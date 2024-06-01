using Finance.Application.Common.Interfaces;
using Finance.Application.Common.Models.Optimizing;
using Google.OrTools.LinearSolver;

namespace Finance.Infrastructure.Services;

public class BudgetOptimizer : IBudgetOptimizer
{
    public Dictionary<string, double> Optimize(double budget, List<string> categories, List<double> usage, List<RequirementItem> items)
    {
        var solver = Solver.CreateSolver("GLOP");
        
        var allocations = new List<Variable>();
        var budgetConstraint = solver.MakeConstraint(budget, budget, "budget");
        for (var i = 0; i < categories.Count; i++)
        {
            allocations.Add(solver.MakeNumVar(0.0, budget, categories[i]));
            budgetConstraint.SetCoefficient(allocations[i], 1);
        }

        var l = 0;
        foreach (var item in items)
        {
            if (categories.All(x => x != item.CategoryTitle))
            {
                allocations.Add(solver.MakeNumVar(0.0, budget, item.CategoryTitle));
                budgetConstraint.SetCoefficient(allocations.Last(), 1);
            }
            
            if (item.Type is RequirementType.Max)
            {
                var upperBound = item.Amount;
                var lowerBound = 0;//item.Amount > (decimal)usage[i] ? usage[i] : 0;
                
                var constraint = solver.MakeConstraint(lowerBound, (double)upperBound, $"constraint_{categories[l]}");
                constraint.SetCoefficient(allocations[l], 1);
                l++;
                continue;
            }
            
            var lower = item.Amount;
            var upper = budget;//item.Amount < (decimal)usage[i] ? usage[i] : budget;
                
            var constraint2 = solver.MakeConstraint((double)lower, upper, $"constraint_{categories[l]}");
            constraint2.SetCoefficient(allocations[l], 1);
            l++;
        }
        
        var deviations = new List<Variable>();
        /*foreach (var allocation in allocations)
        {
            var allocationUsage = 
            deviations.Add(solver.MakeNumVar(0.0, double.PositiveInfinity, $"d_{allocation.Name()}"));
            solver.Add(allocation - usage[i] <= deviations.Last());
            solver.Add(usage[i] - allocation <= deviations.Last());
        }*/

        for (var i = 0; i < allocations.Count; i++)
        {
            var allocationUsage = i < usage.Count
                ? usage[i]
                : (double)(items.Find(x => x.CategoryTitle == allocations[i].Name())?.Amount ?? 0);
            deviations.Add(solver.MakeNumVar(0.0, double.PositiveInfinity, $"d_{allocations[i].Name()}"));
            solver.Add(allocations[i] - allocationUsage <= deviations.Last());
            solver.Add(usage[i] - allocationUsage <= deviations.Last());
        }
        /*for (var i = 0; i < categories.Count; i++)
        {
            deviations.Add(solver.MakeNumVar(0.0, double.PositiveInfinity, $"d_{categories[i]}"));
            solver.Add(allocations[i] - usage[i] <= deviations[i]);
            solver.Add(usage[i] - allocations[i] <= deviations[i]);
        }*/

        var objective = solver.Objective();
        foreach (var t in deviations)
        {
            objective.SetCoefficient(t, 1);
        }
        objective.SetMinimization();

        var resultStatus = solver.Solve();

        if (resultStatus == Solver.ResultStatus.OPTIMAL)
        {
            var result = new Dictionary<string, double>();
            var j = 0;
            foreach (var category in categories)
            {
                result[category] = allocations[j].SolutionValue();
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