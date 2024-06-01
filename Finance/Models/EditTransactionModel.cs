namespace Finance.Models;

public class EditTransactionModel
{
    public int Id { get; set; }
    public decimal Amount { get; set; }
    public string Currency { get; set; } = null!;
    public string? Note { get; set; }
    public int AccountId { get; set; }
    public int? CategoryId { get; set; }
    public int? CustomCategoryId { get; set; }
}