namespace Finance.Application.Common.Models.Optimizing;

public class RequirementItem
{
    public string CategoryTitle { get; set; } = null!;
    public decimal Amount { get; set; }
    public RequirementType Type { get; set; }
}