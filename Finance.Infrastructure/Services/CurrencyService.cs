using Finance.Application.Common.Interfaces;
using Finance.Application.Common.Models;
using Microsoft.Extensions.Caching.Memory;

namespace Finance.Infrastructure.Services;

public class CurrencyService(IMemoryCache memoryCache, ICurrencyClient client) : ICurrencyService
{
    private const string CacheKey = "currency-rates";
    
    public async Task<ICollection<CurrencyRate>?> GetCurrencyRates(CancellationToken ct)
    {
        return await memoryCache.GetOrCreateAsync(
            CacheKey,
            x =>
            {
                x.SetAbsoluteExpiration(TimeSpan.FromDays(1));

                return client.GetCurrencyRates(ct);
            }
        );
    }
}