using Finance.Application.Common.Exceptions;
using Finance.Application.Common.Interfaces;
using Finance.Application.Common.Models;
using Finance.Application.Common.Models.Pagination;
using Finance.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace Finance.Application.Transactions.QueryHandlers;

public class GetPaginatedDetailedTransactionsQuery : PaginatedRequest, IRequest<PaginatedList<TransactionDetailedModel>>
{
    public int UserId { get; set; }
}

public class GetPaginatedDetailedTransactionsQueryHandler(IUnitOfWork unitOfWork)
    : IRequestHandler<GetPaginatedDetailedTransactionsQuery, PaginatedList<TransactionDetailedModel>>
{
    public async Task<PaginatedList<TransactionDetailedModel>> Handle(GetPaginatedDetailedTransactionsQuery request, CancellationToken cancellationToken)
    {
        var user = await unitOfWork.UserRepository.FirstOrDefault(x => x.Id == request.UserId, cancellationToken);
        if (user is null)
        {
            throw new NotFoundException("User not found");
        }

        var query = unitOfWork.TransactionRepository.Query()
            .Include(x => x.Account)
            .Include(x => x.Category)
            .Include(x => x.CustomCategory)
            .Where(x => x.Account!.TeamId == user.TeamId);
        
        query = FilterQuery(request, query);

        if (!request.Search.IsNullOrEmpty())
        {
            query = query
                .Where(x => x.Category != null ? 
                                EF.Functions.Like(x.Category.Title, "%" + request.Search + "%") : 
                                EF.Functions.Like(x.CustomCategory.Title ?? "", "%" + request.Search + "%")
                            || EF.Functions.Like(x.Note, "%" + request.Search + "%"));
        }

        query = AddSort(query, request.Sort);
        var totalCount = await query.CountAsync(cancellationToken);
        query = query
            .Skip(request.PageIndex * request.PageSize)
            .Take(request.PageSize);

        var transactionsResult = query.ToList();
        if (!transactionsResult.Any())
        {
            return new PaginatedList<TransactionDetailedModel>(new List<TransactionDetailedModel>(), 0, 1, 1);
        }
        
        return new PaginatedList<TransactionDetailedModel>(transactionsResult.Select(x => new TransactionDetailedModel
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
                Title = x.Category?.Title ?? x.CustomCategory.Title,
                Icon = x.Category?.Icon ?? x.CustomCategory.Icon
            },
            Account = new AccountModel
            {
                Id = x.AccountId,
                Title = x.Account?.Title,
                Icon = x.Account?.Icon
            }
        }).ToList(), totalCount, request.PageIndex + 1, request.PageSize);
    }

    private static IQueryable<Transaction> FilterQuery(GetPaginatedDetailedTransactionsQuery request, IQueryable<Transaction> query)
    {
        var typeFilter = request.Filter.FirstOrDefault(x => x.Key == "type");
        if (typeFilter != null && typeFilter.Value != "All")
        {
            query = query.Where(x => x.Type == (TransactionType)Enum.Parse(typeof(TransactionType), typeFilter.Value));
        }
        
        var accountFilter = request.Filter.FirstOrDefault(x => x.Key == "account");
        if (accountFilter != null && !accountFilter.Value.IsNullOrEmpty())
        {
            query = query.Where(x => x.AccountId == Convert.ToInt32(accountFilter.Value));
        }

        return query;
    }

    private IQueryable<Transaction> AddSort(IQueryable<Transaction> query, IEnumerable<Sort> sort)
    {
        var dataSort = sort.FirstOrDefault(x => x.Field == "date");
        if (dataSort != null)
        {
            query = dataSort.Direction == SortDirection.Descending
                ? query.OrderByDescending(x => x.Date)
                : query.OrderBy(x => x.Date);
        }

        var categorySort = sort.FirstOrDefault(x => x.Field == "category");
        if (categorySort != null)
        {
            query = categorySort.Direction == SortDirection.Descending
                ? query.OrderByDescending(x => x.Category != null ? x.Category.Title : x.CustomCategory!.Title)
                : query.OrderBy(x => x.Category != null ? x.Category.Title : x.CustomCategory!.Title);
        }

        var amountSort = sort.FirstOrDefault(x => x.Field == "amount");
        if (amountSort != null)
        {
            query = amountSort.Direction == SortDirection.Descending
                ? query.OrderByDescending(x => x.Amount)
                : query.OrderBy(x => x.Amount);
        }

        var accountSort = sort.FirstOrDefault(x => x.Field == "account");
        if (accountSort != null)
        {
            query = accountSort.Direction == SortDirection.Descending
                ? query.OrderByDescending(x => x.Account!.Title)
                : query.OrderBy(x => x.Account!.Title);
        }

        return query;
    }
}