using Finance.Application.Common.Models.Optimizing;

namespace Finance.Application.Common.Interfaces;

public interface IBudgetOptimizer
{
    Dictionary<string, double> Optimize(double budget, List<CategoryInfo> categories);
}