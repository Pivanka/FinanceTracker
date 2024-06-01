using Finance.Domain.Entities;

namespace Finance.Application.Common.Models.Transactions;

public class UploadTransaction
{
    public decimal Amount { get; set; }
    public string Currency { get; set; } = null!;
    public string? Note { get; set; }
    public DateTime Date { get; set; }
    public TransactionType Type { get; set; }
    public decimal ExchangeRate { get; set; }
}