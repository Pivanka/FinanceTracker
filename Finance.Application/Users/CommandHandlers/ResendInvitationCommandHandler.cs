using System.Security.Cryptography;
using System.Text;
using Finance.Application.Common.Exceptions;
using Finance.Application.Common.Helpers;
using Finance.Application.Common.Interfaces;
using Finance.RazorHtmlEmails.Services;
using Finance.RazorHtmlEmails.Views.Emails.Invitation;
using MediatR;
using Microsoft.Extensions.Configuration;

namespace Finance.Application.Users.CommandHandlers;

public record ResendInvitationCommand(int UserId, int MemberId) : IRequest;

public class ResendInvitationCommandHandler(
    IUnitOfWork unitOfWork,
    IEmailSender emailSender,
    IRazorViewToStringRenderer razorViewToStringRenderer,
    IConfiguration configuration)
    : IRequestHandler<ResendInvitationCommand>
{
    public async Task<Unit> Handle(ResendInvitationCommand request, CancellationToken cancellationToken)
    {
        var inviter = await unitOfWork.UserRepository
            .FirstOrDefault(x => x.Id == request.UserId, cancellationToken);
        if (inviter is null)
        {
            throw new NotFoundException();
        }
        
        var member = await unitOfWork.UserRepository
            .FirstOrDefault(x => x.Id == request.MemberId, cancellationToken);
        if (member is null)
        {
            throw new NotFoundException();
        }
        
        using var hmac = new HMACSHA512();
        var oneTimePwd = OneTimePasswordGenerator.Generate();
        member.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(oneTimePwd));
        member.PasswordSalt = hmac.Key;

        await unitOfWork.UserRepository.Update(member, cancellationToken);
        await unitOfWork.SaveChanges(cancellationToken);

        var invitationViewModel = new InvitationEmailViewModel(member.FirstName + ' ' + member.LastName,
                inviter.FirstName + ' ' + inviter.LastName,
                oneTimePwd,
                configuration["UserInvitationUrl"]!);

        var htmlContent = await razorViewToStringRenderer
            .RenderViewToString("/Views/Emails/Invitation/InvitationEmail.cshtml", invitationViewModel);
        
        await emailSender.Send(member.Email, htmlContent, "FinTrack Invitation", cancellationToken);

        return new Unit();
    }
}