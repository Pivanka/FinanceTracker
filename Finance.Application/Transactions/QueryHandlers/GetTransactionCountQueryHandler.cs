using Finance.Application.Common.Exceptions;
using Finance.Application.Common.Interfaces;
using Finance.Application.Common.Models;
using Finance.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace Finance.Application.Transactions.QueryHandlers;

public record GetTransactionCountQuery(int UserId, int? AccountId, string? Search) : IRequest<TransactionCountModel>;

public class GetTransactionCountQueryHandler(IUnitOfWork unitOfWork)
    : IRequestHandler<GetTransactionCountQuery, TransactionCountModel>
{
    public async Task<TransactionCountModel> Handle(GetTransactionCountQuery request, CancellationToken cancellationToken)
    {
        var user = await unitOfWork.UserRepository.FirstOrDefault(x => x.Id == request.UserId, cancellationToken);
        if (user is null)
        {
            throw new NotFoundException("User not found");
        }

        var query = unitOfWork.TransactionRepository.Query()
            .Where(x => x.Account!.TeamId == user.TeamId);

        if (request.AccountId.HasValue)
        {
            query = query.Where(x => x.AccountId == request.AccountId.Value);
        }

        if (!request.Search.IsNullOrEmpty())
        {
            query = query.Where(x => x.Category != null ? 
                EF.Functions.Like(x.Category.Title, "%" + request.Search + "%") : 
                EF.Functions.Like(x.CustomCategory!.Title, "%" + request.Search + "%")
                || EF.Functions.Like(x.Note, "%" + request.Search + "%"));
        }

        var expenseTransactionCount = await query.CountAsync(x => x.Type == TransactionType.Expense, cancellationToken);
        var incomeTransactionCount = await query.CountAsync(x => x.Type == TransactionType.Income, cancellationToken);

        return new TransactionCountModel
        {
            AllTransactionsCount = await query.CountAsync(cancellationToken),
            ExpenseTransactionsCount = expenseTransactionCount,
            IncomeTransactionsCount = incomeTransactionCount
        };
    }
}