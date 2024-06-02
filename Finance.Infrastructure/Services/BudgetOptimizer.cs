using Finance.Application.Common.Interfaces;
using Finance.Application.Common.Models.Optimizing;
using Google.OrTools.LinearSolver;

namespace Finance.Infrastructure.Services;

public class BudgetOptimizer : IBudgetOptimizer
{
    public Dictionary<string, double> Optimize(double budget, List<CategoryInfo> categories)
    {
        var solver = Solver.CreateSolver("GLOP");

        var n = categories.Count;

        var x = new Variable[n];
        var posDev = new Variable[n];
        var negDev = new Variable[n];
        
        for (var i = 0; i < n; i++)
        {
            x[i] = solver.MakeNumVar(categories[i].LowerLimit, categories[i].UpperLimit, categories[i].Title);
            posDev[i] = solver.MakeNumVar(0.0, double.PositiveInfinity, $"posDev{i+1}");
            negDev[i] = solver.MakeNumVar(0.0, double.PositiveInfinity, $"negDev{i+1}");

            solver.Add(x[i] - categories[i].PreviousExpense == posDev[i] - negDev[i]);
        }

        solver.Add(x.Sum() <= budget);

        solver.Minimize(posDev.Sum() + negDev.Sum());

        var resultStatus = solver.Solve();

        if (resultStatus == Solver.ResultStatus.OPTIMAL)
        {
            var result = new Dictionary<string, double>();
            var j = 0;
            foreach (var category in categories)
            {
                result[category.Title] = x[j].SolutionValue();
                j++;
            }

            Console.WriteLine("\nAdvanced usage:");
            Console.WriteLine("Problem solved in " + solver.WallTime() + " milliseconds");
            Console.WriteLine("Problem solved in " + solver.Iterations() + " iterations");

            return result;
        }
        
        throw new Exception("Optimal solution not found.");
    }
}