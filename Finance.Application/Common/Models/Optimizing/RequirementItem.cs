namespace Finance.Application.Common.Models.Optimizing;

public class RequirementItem
{
    public string CategoryTitle { get; set; } = null!;
    
    public decimal? MinAmount { get; set; }
    public decimal? MaxAmount { get; set; }
}