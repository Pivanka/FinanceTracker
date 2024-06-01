namespace Finance.Application.Common.Models;

public class OptimizeBudgetResult
{
    public ICollection<OptimizeResultItem> Result { get; set; } = new List<OptimizeResultItem>();
}