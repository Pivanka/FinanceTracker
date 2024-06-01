using Finance.Application.Common.Interfaces;
using Finance.Application.Common.Models;
using MediatR;

namespace Finance.Application.Transactions.CommandHandlers;

public record CalculateAmountCommand(decimal Amount, string AccountCurrency, string SelectedCurrency) : IRequest<CalculateAmountResponseModel>;

public class CalculateAmountCommandHandler(IExchangeRateCalculator exchangeRateCalculator,
    ICurrencyService currencyService)
    : IRequestHandler<CalculateAmountCommand, CalculateAmountResponseModel>
{
    public async Task<CalculateAmountResponseModel> Handle(CalculateAmountCommand request, CancellationToken cancellationToken)
    {
        var rates = await currencyService.GetCurrencyRates(cancellationToken);
        
        var exchangeRate = exchangeRateCalculator.Calculate(request.AccountCurrency, request.SelectedCurrency, rates);
        
        return new CalculateAmountResponseModel(request.Amount * exchangeRate, exchangeRate);
    }
}