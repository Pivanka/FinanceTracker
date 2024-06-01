using System.Security.Cryptography;
using System.Text;
using Finance.Application.Common.Enums;
using Finance.Application.Common.Exceptions;
using Finance.Application.Common.Helpers;
using Finance.Application.Common.Interfaces;
using Finance.Domain.Entities;
using Finance.RazorHtmlEmails.Services;
using Finance.RazorHtmlEmails.Views.Emails.Invitation;
using MediatR;
using Microsoft.Extensions.Configuration;

namespace Finance.Application.Users.CommandHandlers;

public record InviteMemberCommand(int UserId, string Email, string FirstName, string LastName, Role Role = Role.Viewer) : IRequest;

public class InviteMemberCommandHandler(
    IUnitOfWork unitOfWork,
    IEmailSender emailSender,
    IRazorViewToStringRenderer razorViewToStringRenderer,
    IConfiguration configuration,
    ITeamMemberNotificationSender notificationSender)
    : IRequestHandler<InviteMemberCommand>
{
    public async Task<Unit> Handle(InviteMemberCommand request, CancellationToken cancellationToken)
    {
        var inviter = await unitOfWork.UserRepository
            .FirstOrDefault(x => x.Id == request.UserId, cancellationToken);
        if (inviter is null)
        {
            throw new NotFoundException();
        }
        
        using var hmac = new HMACSHA512();
        var oneTimePwd = OneTimePasswordGenerator.Generate();
        
        var newMember = new User {
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email,
            PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(oneTimePwd)),
            PasswordSalt = hmac.Key,
            TeamId = inviter.TeamId,
            Invited = true,
            Role = request.Role
        };

        await unitOfWork.UserRepository.Add(newMember, cancellationToken);
        await unitOfWork.SaveChanges(cancellationToken);
        
        var invitationViewModel = new InvitationEmailViewModel(request.FirstName + ' ' + request.LastName,
                inviter.FirstName + ' ' + inviter.LastName,
                oneTimePwd,
                configuration["UserInvitationUrl"]!);

        var htmlContent = await razorViewToStringRenderer
            .RenderViewToString("/Views/Emails/Invitation/InvitationEmail.cshtml", invitationViewModel);
        
        await emailSender.Send(request.Email, htmlContent, "FinTrack Invitation", cancellationToken);
        
        await notificationSender.Send(inviter.Id, inviter.TeamId, SignalRType.Member, cancellationToken);

        return new Unit();
    }
}