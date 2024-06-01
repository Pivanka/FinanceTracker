using Finance.Domain.Entities;

namespace Finance.Models;

public class AddTransactionModel
{
    public decimal Amount { get; set; }
    public string Currency { get; set; } = null!;
    public string? Note { get; set; }
    public TransactionType Type { get; set; }
    public int AccountId { get; set; }
    public int? CategoryId { get; set; }
    public int? CustomCategoryId { get; set; }
    public decimal? ExchangeRate { get; set; }
    public DateTime? Date { get; set; }
}