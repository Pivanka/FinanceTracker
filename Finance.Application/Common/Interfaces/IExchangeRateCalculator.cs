using Finance.Application.Common.Models;

namespace Finance.Application.Common.Interfaces;

public interface IExchangeRateCalculator
{
    decimal Calculate(string currency,
        string changedCurrency,
        ICollection<CurrencyRate>? rates);
}