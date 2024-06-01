using System.Drawing;
using Finance.Domain.Common;

namespace Finance.Domain.Entities;

public class Category : BaseEntity
{
    public string Title { get; set; } = null!;
    public string Icon { get; set; } = null!;
    public TransactionType Type { get; set; }
    public string Color { get; set; } = null!;
}