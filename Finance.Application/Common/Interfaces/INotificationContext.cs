using Finance.Application.Common.Enums;

namespace Finance.Application.Common.Interfaces;

public interface INotificationContext
{
    Task SendToUser(int userId, SignalRType type);
    Task ReceiveNotification(int userId);
}