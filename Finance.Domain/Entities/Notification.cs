using Finance.Domain.Common;

namespace Finance.Domain.Entities;

public class Notification : BaseEntity
{
    public int UserId { get; set; }
    public User? User { get; set; }
    public NotificationType Type { get; set; }
    public string Message { get; set; } = null!;
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    public bool IsRead { get; set; }
}