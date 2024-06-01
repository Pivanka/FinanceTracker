namespace Finance.Infrastructure.Settings;

public class CurrenciesOptions
{
    public ICollection<CurrencyModel> Currencies { get; set; } = new List<CurrencyModel>();
}

public class CurrencyModel
{
    public string Currency { get; set; } = null!;
    public string Name { get; set; } = null!;
    public int ISOnum { get; set; }
    public string Symbol { get; set; } = null!;
}