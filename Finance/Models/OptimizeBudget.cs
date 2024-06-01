using Finance.Application.Common.Models.Optimizing;

namespace Finance.Models;

public class OptimizeBudget
{
    public double Budget { get; set; }
    public ICollection<Item> Items { get; set; } = new List<Item>();
}