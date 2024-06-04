using Finance.Application.Common.Exceptions;
using Finance.Application.Common.Interfaces;
using Finance.Application.Common.Models;
using Finance.Application.Common.Models.Optimizing;
using Finance.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Finance.Application.Charts.CommandHandlers;

public class OptimizeBudgetCommand : IRequest<OptimizeBudgetResult>
{
    public int? UserId { get; set; }
    public double Budget { get; set; }
    public ICollection<Item> Items { get; set; } = new List<Item>();
}

public class OptimizeBudgetCommandHandler(IUnitOfWork unitOfWork, IBudgetOptimizer budgetOptimizer,
    IExchangeRateCalculator exchangeRateCalculator, ICurrencyService currencyService)
    : IRequestHandler<OptimizeBudgetCommand, OptimizeBudgetResult>
{
    public async Task<OptimizeBudgetResult> Handle(OptimizeBudgetCommand request, CancellationToken cancellationToken)
    {
        var user = await unitOfWork.UserRepository
            .Query()
            .Include(x => x.Team)
            .FirstOrDefaultAsync(x => x.Id == request.UserId, cancellationToken);
        if (user is null)
        {
            throw new NotFoundException();
        }

        const int monthsCount = 2;
        var today = DateTime.Today;
        var firstOfNextMonth = new DateTime(today.Year, today.Month, 1);
        var startDate = firstOfNextMonth.AddMonths(-monthsCount);
        var endDate = firstOfNextMonth.AddDays(-1);
        
        var transactions = unitOfWork.TransactionRepository
            .Query()
            .Include(x => x.Account)
            .Include(x => x.Category)
            .Include(x => x.CustomCategory)
            .Where(x => x.Account!.TeamId == user.TeamId && x.Type == TransactionType.Expense)
            .Where(t => t.Date >= startDate.ToUniversalTime() && t.Date <= endDate.ToUniversalTime() && (t.Category != null || t.CustomCategory != null));
        if (!transactions.Any())
        {
            return new OptimizeBudgetResult();
        }
        
        var usualCategoriesTransactions = transactions.Where(x => x.Category != null).ToList();
        var customCategoryTransactions = transactions.Where(x => x.CustomCategory != null).ToList();

        var rates = await currencyService.GetCurrencyRates(cancellationToken);
        var groupedUsualCategoriesTransactions = usualCategoriesTransactions
            .GroupBy(t => t.Category)
            .Select(g => new 
            {
                CategoryTitle = g.Key!.Title,
                MonthlySpent = (double)(g.Sum(t => t.Amount * exchangeRateCalculator.Calculate(t.Currency, user.Team!.Currency, rates)) / monthsCount )
            })
            .ToDictionary(x => x.CategoryTitle, x => x.MonthlySpent);
        
        var groupedCustomCategoriesTransactions = customCategoryTransactions
            .GroupBy(t => t.CustomCategory)
            .Select(g => new 
            {
                CategoryTitle = g.Key!.Title,
                MonthlySpent = (double)(g.Sum(t => t.Amount * exchangeRateCalculator.Calculate(t.Currency, user.Team!.Currency, rates)) / monthsCount )
            })
            .ToDictionary(x => x.CategoryTitle, x => x.MonthlySpent);

        var groupedByCategoryTransactions =
            groupedUsualCategoriesTransactions.Concat(groupedCustomCategoriesTransactions)
                .OrderByDescending(c => c.Value)
                .ToDictionary();

        var categories = await unitOfWork.CategoryRepository.GetAll(cancellationToken);
        var customCategories = unitOfWork.CustomCategoryRepository
            .Query()
            .Where(x => x.TeamId == user.TeamId)
            .ToList();

        var requirementItems = request.Items.Select(x => new RequirementItem
        {
            MinAmount = x.MinAmount,
            MaxAmount = x.MaxAmount,
            CategoryTitle = x.CategoryId is null
                ? customCategories.First(c => c.Id == x.CustomCategoryId).Title
                : categories.First(c => c.Id == x.CategoryId).Title
        }).ToList();

        var previousBudget = groupedByCategoryTransactions.Sum(x => x.Value);
        var threshold = previousBudget * 0.03;
        var keysToRemove = new List<string>();
        const string keyOthers = "Others";
        groupedByCategoryTransactions.TryAdd(keyOthers, 0);
        
        foreach (var item in groupedByCategoryTransactions.Where(x => x.Value < threshold 
                                                                      && requirementItems.All(r => r.CategoryTitle != x.Key)))
        {
            groupedByCategoryTransactions[keyOthers] += item.Value;
            keysToRemove.Add(item.Key);
        }
        foreach (var key in keysToRemove.Where(key => key != keyOthers))
        {
            groupedByCategoryTransactions.Remove(key);
        }

        var mapItems = MapItems(request.Budget, groupedByCategoryTransactions, requirementItems);
        
        var result = budgetOptimizer.Optimize(request.Budget, mapItems);

        return new OptimizeBudgetResult
        {
            Result = result.Select(x => new OptimizeResultItem
            {
                Category = x.Key,
                Amount = x.Value
            }).ToList()
        };
    }
    
    private static List<CategoryInfo> MapItems(double budget, Dictionary<string, double> expenses, List<RequirementItem> items)
    {
        var mappedItems = new List<CategoryInfo>();

        foreach (var expense in expenses) {
            var item = items.FirstOrDefault(i => i.CategoryTitle == expense.Key);
            var newItem = new CategoryInfo {
                Title = expense.Key,
                PreviousExpense = expense.Value
            };

            if (item != null) {
                SetupLimits(budget, item, newItem);
            } else {
                DefaultLimits(budget, newItem);
            }

            mappedItems.Add(newItem);
        }

        foreach (var item in items.Where(i => !expenses.ContainsKey(i.CategoryTitle))) {
            var newItem = new CategoryInfo {
                Title = item.CategoryTitle,
                PreviousExpense = 0 
            };
            SetupLimits(budget, item, newItem);
            mappedItems.Add(newItem);
        }

        return mappedItems;
    }

    private static void SetupLimits(double budget, RequirementItem item, CategoryInfo newItem)
    {
        newItem.LowerLimit = item.MinAmount.HasValue ? (double)item.MinAmount : 0;
        newItem.UpperLimit = item.MaxAmount > 0 ? (double)item.MaxAmount : budget;
    }

    private static void DefaultLimits(double budget, CategoryInfo newItem) {
        newItem.LowerLimit = 0;
        newItem.UpperLimit = budget;
    }
}