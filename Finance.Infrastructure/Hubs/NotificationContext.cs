using Finance.Application.Common.Enums;
using Finance.Application.Common.Interfaces;
using Microsoft.AspNetCore.SignalR;

namespace Finance.Infrastructure.Hubs;

public class NotificationContext(IHubContext<NotificationHub, INotificationClient> messageHub)
    : INotificationContext
{
    public async Task SendToUser(int userId, SignalRType type)
    {
        await messageHub.Clients.User(userId.ToString()).SendToUser(type);
    }

    public async Task ReceiveNotification(int userId)
    {
        await messageHub.Clients.User(userId.ToString()).ReceiveNotification();
    }
}