namespace Finance.Models;

public class AddTransactionsModel
{
    public int AccountId { get; set; }
    public IEnumerable<AddTransactionModel> Transactions { get; set; }
}