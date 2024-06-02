using Finance.Application.Common.Exceptions;
using Finance.Application.Common.Interfaces;
using Finance.Application.Common.Models;
using Finance.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Finance.Application.Charts.QueryHandlers;

public record GetChartQuery(int UserId, TransactionType Type, string? From, string? To) : IRequest<SimpleChart>;

public class GetChartQueryHandler(IUnitOfWork unitOfWork,
    IExchangeRateCalculator exchangeRateCalculator,
    ICurrencyService currencyService)
    : IRequestHandler<GetChartQuery, SimpleChart>
{
    public async Task<SimpleChart> Handle(GetChartQuery request, CancellationToken cancellationToken)
    {
        var user = await unitOfWork.UserRepository
            .Query()
            .Include(x => x.Team)
            .FirstOrDefaultAsync(x => x.Id == request.UserId, cancellationToken);
        if (user is null)
        {
            throw new NotFoundException("User not found");
        }

        var transactionsQuery = unitOfWork.TransactionRepository.Query()
            .Include(x => x.Category)
            .Include(x => x.CustomCategory)
            .Where(x => x.Type == request.Type);

        if (request.From is not null)
        {
            transactionsQuery = transactionsQuery.Where(x => x.Date > DateTime.Parse(request.From).ToUniversalTime());
        }
        if (request.To is not null)
        {
            transactionsQuery = transactionsQuery.Where(x => x.Date <= DateTime.Parse(request.To).ToUniversalTime());
        }
        
        var transactions = await transactionsQuery.ToListAsync(cancellationToken);
            
        var rates = await currencyService.GetCurrencyRates(cancellationToken);
        var groupedByCategory = transactions
            .Where(x => x.Category != null)
            .GroupBy(x => x.Category,
                x => x,
                (key, g) => new { Category = key, Transactions = g })
            .Select(x => new Value
            {
                CategoryTitle = x.Category!.Title,
                Amount = x.Transactions.Sum(t => t.Amount * exchangeRateCalculator.Calculate(user.Team!.Currency, t.Currency, rates)),
                Color = x.Category.Color
            });

        var groupedByCustomCategory = transactions
            .Where(x => x.CustomCategory != null)
            .GroupBy(x => x.CustomCategory,
                x => x,
                (key, g) => new { CustomCategory = key, Transactions = g })
            .Select(x => new Value
            {
                CategoryTitle = x.CustomCategory!.Title,
                Amount = x.Transactions.Sum(t => t.Amount),
                Color = x.CustomCategory.Color
            });

        var combinedResults = groupedByCategory.Concat(groupedByCustomCategory);

        return new SimpleChart { Values = combinedResults, Currency = user.Team!.Currency };
    }
}