using Finance.Application.Common.Models;

namespace Finance.Application.Common.Interfaces;

public interface ICurrencyService
{
    public Task<ICollection<CurrencyRate>?> GetCurrencyRates(CancellationToken ct);
}