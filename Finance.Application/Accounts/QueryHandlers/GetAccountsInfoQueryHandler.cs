using Finance.Application.Common.Exceptions;
using Finance.Application.Common.Interfaces;
using Finance.Application.Common.Models;
using Finance.Application.Common.Models.Pagination;
using Finance.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace Finance.Application.Accounts.QueryHandlers;

public record GetAccountsInfoQuery(int UserId, string? Search) : IRequest<IEnumerable<AccountInfoModel>>
{
    public ICollection<Filter> Filter { get; set; } = new List<Filter>();
}

public class GetAccountsInfoQueryHandler(IUnitOfWork unitOfWork)
    : IRequestHandler<GetAccountsInfoQuery, IEnumerable<AccountInfoModel>>
{
    public async Task<IEnumerable<AccountInfoModel>> Handle(GetAccountsInfoQuery request, CancellationToken cancellationToken)
    {
        var user = await unitOfWork.UserRepository.FirstOrDefault(x => x.Id == request.UserId, cancellationToken);
        if (user is null)
        {
            throw new NotFoundException("User not found");
        }

        var query = unitOfWork.TransactionRepository.Query()
            .Include(x => x.Account)
            .Where(x => x.Account.TeamId == user.TeamId);
        
        query = FilterQuery(request.Filter, query);

        if (!request.Search.IsNullOrEmpty())
        {
            query = query.Where(x => x.Category != null ? 
                EF.Functions.Like(x.Category.Title, "%" + request.Search + "%") : 
                EF.Functions.Like(x.CustomCategory!.Title, "%" + request.Search + "%")
                || EF.Functions.Like(x.Note, "%" + request.Search + "%"));
        }

        var transactions = query.GroupBy(x => x.Account);
        
        return transactions.Select(x => new AccountInfoModel
        {
            Id = x.Key.Id,
            Title = x.Key.Title,
            Icon = x.Key.Icon,
            TransactionsCount = x.ToList().Count
        })!;
    }
    private static IQueryable<Transaction> FilterQuery(ICollection<Filter> filters, IQueryable<Transaction> query)
    {
        var typeFilter = filters.FirstOrDefault(x => x.Key == "type");
        if (typeFilter != null && typeFilter.Value != "All")
        {
            query = query.Where(x => x.Type == (TransactionType)Enum.Parse(typeof(TransactionType), typeFilter.Value));
        }
        
        var accountFilter = filters.FirstOrDefault(x => x.Key == "account");
        if (accountFilter != null && !accountFilter.Value.IsNullOrEmpty())
        {
            query = query.Where(x => x.AccountId == Convert.ToInt32(accountFilter.Value));
        }

        return query;
    }
}