using Finance.Domain.Common;

namespace Finance.Domain.Entities;

public class CustomCategory : BaseEntity
{
    public string Title { get; set; } = null!;
    public string Icon { get; set; } = null!;
    public TransactionType Type { get; set; }
    public string Color { get; set; } = null!;
    public bool IsDeleted { get; set; }
    
    public int TeamId { get; set; }
    public Team? Team { get; set; }
}