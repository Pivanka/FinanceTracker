using System.Text.Json;
using Finance.Application.Common.Interfaces;
using Finance.Application.Common.Models;

namespace Finance.Infrastructure.Services;

public class CurrencyClient : ICurrencyClient
{
    private readonly HttpClient _httpClient;

    public CurrencyClient(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<ICollection<CurrencyRate>> GetCurrencyRates(CancellationToken ct)
    {
        try
        {
            var result = await _httpClient.GetAsync("bank/currency", cancellationToken: ct);
            result.EnsureSuccessStatusCode();

            return JsonSerializer.Deserialize<ICollection<CurrencyRate>>(await result.Content.ReadAsStringAsync(ct),
                new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                }) ?? new List<CurrencyRate>();
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }
}