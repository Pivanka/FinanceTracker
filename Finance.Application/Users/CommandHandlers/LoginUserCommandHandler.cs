using System.Security.Cryptography;
using System.Text;
using Destructurama.Attributed;
using Finance.Application.Common.Helpers;
using Finance.Application.Common.Interfaces;
using Finance.Application.Common.Models;
using Finance.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using ValidationException = Finance.Application.Common.Exceptions.ValidationException;

namespace Finance.Application.Users.CommandHandlers;

public record LoginUserCommand(string Email, [property: LogMasked] string Password) : IRequest<AuthResponse>;

public class LoginUserCommandHandler(
    IUnitOfWork unitOfWork,
    ITokenGenerator tokenGenerator,
    INotificationContext notificationContext,
    TokenSettings settings)
    : IRequestHandler<LoginUserCommand, AuthResponse>
{
    public async Task<AuthResponse> Handle(LoginUserCommand request, CancellationToken cancellationToken)
    {
        var userToLogin = await unitOfWork.UserRepository.FirstOrDefault(u => u.Email == request.Email, cancellationToken);

        if (userToLogin == null)
        {
            throw new ValidationException(new Dictionary<string, string[]>
            {
                {"Email", ["Invalid email address. Please enter a valid email."] }
            });
        }

        using var hmac = new HMACSHA512(userToLogin.PasswordSalt);
        var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(request.Password));
        if (computedHash.Where((t, i) => t != userToLogin.PasswordHash[i]).Any())
        {
            throw new ValidationException(new Dictionary<string, string[]>
            {
                {"Password", ["Password is incorrect."] }
            });
        }

        if (userToLogin.Invited)
        {
            userToLogin.Invited = false;
            await SendNotifications(userToLogin, cancellationToken);
        }
        
        var token = tokenGenerator.Generate(userToLogin);

        userToLogin.RefreshToken = token.RefreshToken;
        userToLogin.RefreshTokenExpiry = DateTime.UtcNow.AddSeconds(settings.RefreshTokenExpireSeconds);

        await unitOfWork.UserRepository.Update(userToLogin, cancellationToken);
        await unitOfWork.SaveChanges(cancellationToken);

        return token;
    }
    
    private async Task SendNotifications(User user, CancellationToken cancellationToken)
    {
        var notification = new Notification
        {
            UserId = user.Id,
            Type = NotificationType.ChangePasswordByInvitation,
            Message = NotificationHelper.InvitedNotification
        };

        await unitOfWork.NotificationRepository.Add(notification, cancellationToken);
        await unitOfWork.SaveChanges(cancellationToken);

        await notificationContext.ReceiveNotification(user.Id);

        var team = unitOfWork.TeamRepository.Query()
            .Include(x => x.Users)
            .First(x => x.Id == user.TeamId);
        
        var teamNotifications = team.Users.Where(x => x.Id != user.Id)
            .Select(x => new Notification
            {
                Type = NotificationType.InvitationApproved,
                Message = $"{user.FirstName} {user.LastName} has accepted the invitation and joined the team!",
                UserId = x.Id
            })
            .ToArray();

        await unitOfWork.NotificationRepository.Add(teamNotifications, cancellationToken);
        await unitOfWork.SaveChanges(cancellationToken);

        foreach (var teamUser in teamNotifications)
        {
            await notificationContext.ReceiveNotification(teamUser.UserId);
        }
    }
}