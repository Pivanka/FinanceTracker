using Finance.Application.Common.Interfaces;
using Finance.Application.Common.Mapping;
using Finance.Application.Common.Models;
using Finance.Application.Common.Models.Pagination;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Finance.Application.Transactions.QueryHandlers;

public record GetPaginatedTransactionsQuery() : IRequest<PaginatedList<TransactionModel>>
{
    public int UserId { get; set; }
    public string? SearchString { get; init; }
    public int Page { get; init; }
    public int Take { get; init; }

    public bool IsDescending { get; init; } = true;
    public int? Days { get; init; }
}

public class GetPaginatedTransactionsQueryHandler(IUnitOfWork unitOfWork)
    : IRequestHandler<GetPaginatedTransactionsQuery, PaginatedList<TransactionModel>>
{

    public async Task<PaginatedList<TransactionModel>> Handle(GetPaginatedTransactionsQuery request, CancellationToken cancellationToken)
    {
        var user = await unitOfWork.UserRepository.FirstOrDefault(x => x.Id == request.UserId, cancellationToken);
        if (user is null)
        {
            throw new ArgumentException();
        }
        
        var accounts = await unitOfWork.AccountRepository.Query()
            .Where(x => x.TeamId == user.TeamId)
            .Select(x => x.Id)
            .ToListAsync(cancellationToken);
        if (accounts is null || accounts.Count == 0)
        {
            throw new ArgumentException();
        }
        
        var transactions = unitOfWork.TransactionRepository.Query()
            .Include(x => x.Category)
            .Include(x => x.CustomCategory)
            .Where(x => accounts.Contains(x.AccountId));

        if (!string.IsNullOrEmpty(request.SearchString))
        {
            transactions = transactions.Where(x => x.Note.ToLower().Contains(request.SearchString.ToLower())
                                                        || x.Category.Title.ToLower().Contains(request.SearchString.ToLower()));
        }
        
        if (request.Days.HasValue)
        {
            var startDate = DateTime.UtcNow.AddDays(-request.Days.Value);
            var endDate = DateTime.UtcNow;

            transactions = transactions.Where(x => x.Date >= startDate && x.Date <= endDate);
        }
        
        var query = request.IsDescending
            ? transactions.OrderByDescending(x => x.Date).AsQueryable()
            : transactions.OrderBy(x => x.Date).AsQueryable();

        var result = await query
            .Select(x => new TransactionModel
            {
                Amount = x.Amount,
                Currency = x.Currency,
                Date = x.Date,
                Id = x.Id,
                Note = x.Note,
                Type = x.Type,
                Category = new CategoryModel
                {
                    Id = x.CategoryId ?? x.CustomCategoryId,
                    Title = x.Category != null ? x.Category.Title : x.CustomCategory.Title,
                    Icon = x.Category != null ? x.Category.Icon : x.CustomCategory.Icon,
                },
            })
            .PaginatedListAsync(request.Page, request.Take);

        return result;
    }
}