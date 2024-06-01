using Finance.Domain.Common;

namespace Finance.Domain.Entities;

public class Account : BaseEntity
{
    public string Title { get; set; } = null!;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string Currency { get; set; } = "UAH";
    public string? Icon { get; set; }
    public bool IsDeleted { get; set; }
    public int TeamId { get; set; }
    public Team? Team { get; set; }
}