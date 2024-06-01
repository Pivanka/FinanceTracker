using Finance.Application.Common.Interfaces;
using Finance.Application.Common.Models;
using Finance.Infrastructure.Settings;
using Microsoft.Extensions.Options;

namespace Finance.Infrastructure.Services;

public class ExchangeRateCalculator(IOptions<CurrenciesOptions> currencies) : IExchangeRateCalculator
{
    private const int MainCurrencyIso = 980;
    
    public decimal Calculate(string currency,
        string changedCurrency,
        ICollection<CurrencyRate>? rates)
    {
        if (currency == changedCurrency || rates is null)
        {
            return 1;
        }
        
        var accountCurrencyIso =
            currencies.Value.Currencies.First(x => x.Currency == currency);
        var selectedCurrencyIso =
            currencies.Value.Currencies.First(x => x.Currency == changedCurrency);

        decimal exchangeRate = 1;
        
        if (MainCurrencyIso != selectedCurrencyIso.ISOnum)
        {
            var mainRate = rates.First(x =>
                x.CurrencyCodeB == MainCurrencyIso && x.CurrencyCodeA == selectedCurrencyIso.ISOnum);
            exchangeRate = mainRate.RateBuy == 0 ? mainRate.RateCross : mainRate.RateBuy;
        }

        if (MainCurrencyIso == accountCurrencyIso.ISOnum) 
            return exchangeRate;
        
        var accountRate = rates.First(x =>
            x.CurrencyCodeB == MainCurrencyIso && x.CurrencyCodeA == accountCurrencyIso.ISOnum);
        exchangeRate /= (accountRate.RateSell == 0 ? accountRate.RateCross : accountRate.RateSell);
        
        return exchangeRate;
    }
}