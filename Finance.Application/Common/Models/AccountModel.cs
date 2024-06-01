namespace Finance.Application.Common.Models;

public class AccountModel
{
    public int Id { get; set; }
    public string Title { get; set; } = null!;
    public string? Icon { get; set; }
    public string Currency { get; set; }
}