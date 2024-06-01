using Finance.Application.Common.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Finance.Infrastructure.Hubs;

[Authorize]
public class NotificationHub : Hub<INotificationClient>
{
}