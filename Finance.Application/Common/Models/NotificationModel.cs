using Finance.Domain.Entities;

namespace Finance.Application.Common.Models;

public class NotificationModel
{
    public int Id { get; set; }
    public NotificationType Type { get; set; }
    public string Message { get; set; } = null!;
    public DateTime CreatedDate { get; set; }
    public bool IsRead { get; set; }
}