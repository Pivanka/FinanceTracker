using Finance.Domain.Common;

namespace Finance.Domain.Entities;

public class Transaction : BaseEntity
{
    public decimal Amount { get; set; }
    public string Currency { get; set; } = null!;
    public string? Note { get; set; }
    public DateTime Date { get; set; } = DateTime.UtcNow;
    public TransactionType Type { get; set; }
    public decimal ExchangeRate { get; set; }
    
    public int AccountId { get; set; }
    public Account? Account { get; set; }
    
    public int? CategoryId { get; set; }
    public Category? Category { get; set; }
    
    public int? CustomCategoryId { get; set; }
    public CustomCategory? CustomCategory { get; set; }
}