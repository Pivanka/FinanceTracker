namespace Finance.Application.Common.Models;

public class AccountInfoModel
{
    public int Id { get; set; }
    public string Title { get; set; } = null!;
    public string Icon { get; set; }
    public int TransactionsCount { get; set; }
}