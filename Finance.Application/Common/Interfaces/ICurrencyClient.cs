using Finance.Application.Common.Models;

namespace Finance.Application.Common.Interfaces;

public interface ICurrencyClient
{
    public Task<ICollection<CurrencyRate>> GetCurrencyRates(CancellationToken ct);
}