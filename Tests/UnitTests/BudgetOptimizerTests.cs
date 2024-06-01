using System.Text;
using Accord.Math;
using Finance.Application.Common.Models.Optimizing;
using Finance.Application.Transactions.CommandHandlers;
using Finance.Infrastructure.Services;
using FluentAssertions;

namespace Tests.UnitTests;

[TestFixture]
public class BudgetOptimizerTests
{
    private BudgetOptimizer _budgetOptimizer;

    [SetUp]
    public void Setup()
    {
        _budgetOptimizer = new BudgetOptimizer();
    }

    [Test]
    public async Task OptimizeBudgetTest()
    {
        // Arrange
        const double budget = 10000;
        const string houseCategory = "house";
        const string healthCategory = "health";
        
        var categories = new[] { houseCategory, "food", healthCategory, "car" };
        var usage = new double[] { 3300, 2100, 1200, 2000 };
        var items = new List<RequirementItem>
        {
            new()
            {
                Amount = 3000,
                CategoryTitle = houseCategory,
                Type = RequirementType.Min
            },
            
            new()
            {
                Amount = 1500,
                CategoryTitle = healthCategory,
                Type = RequirementType.Max
            }
        };

        // Act
        var result = _budgetOptimizer.Optimize(budget, categories.ToList(), usage.ToList(), items);

        // Assert
        result.Should().NotBeNullOrEmpty();
        var house = result.FirstOrDefault(x => x.Key == houseCategory);
        house.Should().NotBeNull();
        house.Value.Should().BeGreaterOrEqualTo(usage[categories.IndexOf(houseCategory)]);
        
        var health = result.FirstOrDefault(x => x.Key == healthCategory);
        health.Should().NotBeNull();
        health.Value.Should().BeLessOrEqualTo(usage[categories.IndexOf(healthCategory)]);
    }
}