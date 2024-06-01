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

public class OptimizeBudgetCommandHandler(IUnitOfWork unitOfWork, IBudgetOptimizer budgetOptimizer)
    : IRequestHandler<OptimizeBudgetCommand, OptimizeBudgetResult>
{
    public async Task<OptimizeBudgetResult> Handle(OptimizeBudgetCommand request, CancellationToken cancellationToken)
    {
        var user = await unitOfWork.UserRepository.FirstOrDefault(x => x.Id == request.UserId, cancellationToken);
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
            .Where(t => t.Date >= startDate && t.Date <= endDate && (t.Category != null || t.CustomCategory != null));

        var usualCategoriesTransactions = transactions.Where(x => x.Category != null);
        var customCategoryTransactions = transactions.Except(usualCategoriesTransactions);

        var groupedUsualCategoriesTransactions = usualCategoriesTransactions
            .GroupBy(t => t.Category)
            .Select(g => new 
            {
                CategoryTitle = g.Key!.Title,
                MonthlySpent = (double)(g.Sum(t => t.Amount) / monthsCount )
            })
            .ToDictionary(x => x.CategoryTitle, x => x.MonthlySpent);
        
        var groupedCustomCategoriesTransactions = customCategoryTransactions
            .GroupBy(t => t.CustomCategory)
            .Select(g => new 
            {
                CategoryTitle = g.Key!.Title,
                MonthlySpent = (double)(g.Sum(t => t.Amount) / monthsCount )
            })
            .ToDictionary(x => x.CategoryTitle, x => x.MonthlySpent);

        var groupedByCategoryTransactions =
            groupedUsualCategoriesTransactions.Concat(groupedCustomCategoriesTransactions)
                .OrderByDescending(c => c.Value)
                .ToDictionary();

        var categories = await unitOfWork.CategoryRepository.GetAll(cancellationToken);
        var customCategories = await unitOfWork.CustomCategoryRepository.GetAll(cancellationToken);

        var requirementItems = request.Items.Select(x => new RequirementItem
        {
            Amount = x.Amount,
            Type = x.Type,
            CategoryTitle = x.CategoryId is null
                ? customCategories.First(c => c.Id == x.CustomCategoryId).Title
                : categories.First(c => c.Id == x.CategoryId).Title
        });

        var result = budgetOptimizer.Optimize(request.Budget,
            groupedByCategoryTransactions.Keys.ToList(),
            groupedByCategoryTransactions.Values.ToList(),
            requirementItems.ToList());

        return new OptimizeBudgetResult
        {
            Result = result.Select(x => new OptimizeResultItem
            {
                Category = x.Key,
                Amount = x.Value
            }).ToList()
        };
    }
}