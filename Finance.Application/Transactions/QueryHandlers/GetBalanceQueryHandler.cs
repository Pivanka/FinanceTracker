using Finance.Application.Common.Exceptions;
using Finance.Application.Common.Interfaces;
using Finance.Application.Common.Models;
using Finance.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Finance.Application.Transactions.QueryHandlers;

public record GetBalanceQuery(int UserId) : IRequest<Balance>;

public class GetBalanceQueryHandler(IUnitOfWork unitOfWork,
    IExchangeRateCalculator exchangeRateCalculator,
    ICurrencyService currencyService)
    : IRequestHandler<GetBalanceQuery, Balance>
{
    public async Task<Balance> Handle(GetBalanceQuery request, CancellationToken cancellationToken)
    {
        var user = await unitOfWork.UserRepository
            .Query()
            .Include(x => x.Team)
            .FirstOrDefaultAsync(x => x.Id == request.UserId, cancellationToken);
        if (user is null)
        {
            throw new NotFoundException("User not found");
        }
        
        var accounts = await unitOfWork.AccountRepository
            .Query()
            .Where(x => x.TeamId == user.TeamId)
            .Select(x => x.Id)
            .ToListAsync(cancellationToken);
        if (accounts.Count == 0)
        {
            return new Balance(0, 0, user.Team!.Currency);
        }
        
        var today = DateTime.Today;
        var startOfMonth = new DateTime(today.Year, today.Month, 1);
        var transactions = await unitOfWork.TransactionRepository
            .Query()
            .Where(x => accounts.Contains(x.AccountId) && x.Date >= startOfMonth.ToUniversalTime())
            .ToListAsync(cancellationToken);
        
        var rates = await currencyService.GetCurrencyRates(cancellationToken);
        
        var incomes = transactions.Where(x => x.Type is TransactionType.Income)
            .Sum(x => x.Amount * exchangeRateCalculator.Calculate(user.Team!.Currency, x.Currency, rates));
        var expenses = transactions.Where(x => x.Type is TransactionType.Expense)
            .Sum(x => x.Amount * exchangeRateCalculator.Calculate(user.Team!.Currency, x.Currency, rates));
        
        return new Balance(incomes, expenses, user.Team!.Currency);
    }
}