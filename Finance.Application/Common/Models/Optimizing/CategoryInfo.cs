namespace Finance.Application.Common.Models.Optimizing;

public class CategoryInfo
{
    public string Title { get; set; } = null!;
    public double LowerLimit { get; set; }
    public double UpperLimit { get; set; }
    public double PreviousExpense { get; set; }
}