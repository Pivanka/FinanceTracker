using Finance.Application.Common.Exceptions;
using Finance.Application.Common.Helpers;
using Finance.Application.Common.Interfaces;
using Finance.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Finance.Application.Users.CommandHandlers;

public record UpdateCurrencyCommand(int UserId, string Currency) : IRequest;

public class UpdateCurrencyCommandHandler(IUnitOfWork unitOfWork, INotificationContext notificationContext)
    : IRequestHandler<UpdateCurrencyCommand>
{
    public async Task<Unit> Handle(UpdateCurrencyCommand request, CancellationToken cancellationToken)
    {
        var user = unitOfWork.UserRepository
            .Query()
            .Include(x => x.Team)
            .ThenInclude(x => x!.Users)
            .FirstOrDefault(x => x.Id == request.UserId);
        if (user is null)
        {
            throw new NotFoundException();
        }

        var team = user.Team;

        team!.Currency = request.Currency;

        await unitOfWork.TeamRepository.Update(team, cancellationToken);
        await unitOfWork.SaveChanges(cancellationToken);

        await SendNotifications(user, request.Currency, cancellationToken);
        
        return new Unit();
    }
    
    private async Task SendNotifications(User user, string currency, CancellationToken cancellationToken)
    {
        var teamNotifications = user!.Team!.Users
            .Select(x => new Notification
            {
                UserId = x.Id,
                Type = NotificationType.CurrencyChanged,
                Message = NotificationHelper.ChangedCurrencyNotification(currency)
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