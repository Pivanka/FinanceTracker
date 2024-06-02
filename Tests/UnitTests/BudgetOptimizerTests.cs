using Finance.Application.Common.Models.Optimizing;
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
    public void OptimizeBudgetTest()
    {
        // Arrange
        const double budget = 10000;
        const string houseCategory = "house";
        const string healthCategory = "health";
        
        var items = new List<CategoryInfo>
        {
            new()
            {
                Title = houseCategory,
                LowerLimit = 3000,
                UpperLimit = double.PositiveInfinity,
                PreviousExpense = 3300
            },
            new()
            {
                Title = "food",
                LowerLimit = 0,
                UpperLimit = double.PositiveInfinity,
                PreviousExpense = 2100
            },
            new()
            {
                Title = healthCategory,
                LowerLimit = 0,
                UpperLimit = 1500,
                PreviousExpense = 1200
            },
            new()
            {
                Title = "car",
                LowerLimit = 0,
                UpperLimit = double.PositiveInfinity,
                PreviousExpense = 2000
            },
        };

        // Act
        var result = _budgetOptimizer.Optimize(budget, items);

        // Assert
        result.Should().NotBeNullOrEmpty();
        var house = result.FirstOrDefault(x => x.Key == houseCategory);
        house.Should().NotBeNull();
        house.Value.Should().BeGreaterOrEqualTo(items.First(x => x.Title == houseCategory).LowerLimit);
        
        var health = result.FirstOrDefault(x => x.Key == healthCategory);
        health.Should().NotBeNull();
        health.Value.Should().BeLessOrEqualTo(items.First(x => x.Title == houseCategory).UpperLimit);
    }
}