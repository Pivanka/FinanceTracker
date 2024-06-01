using Finance.Domain.Entities;

namespace Finance.Application.Common.Models;

public class TransactionDetailedModel
{
    public int Id { get; set; }
    public decimal Amount { get; set; }
    public string Currency { get; set; } = null!;
    public string? Note { get; set; }
    public DateTime Date { get; set; }
    public TransactionType Type { get; set; }
    public CategoryModel Category { get; set; }
    public AccountModel Account { get; set; }
}