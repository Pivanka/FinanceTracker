using Finance.Application.Common.Enums;

namespace Finance.Application.Common.Interfaces;

public interface INotificationClient
{
    Task SendToUser(SignalRType type);
    Task ReceiveNotification();
}