using Newtonsoft.Json;

namespace Finance.Application.Common.Models;

public class CurrencyRate
{
    [JsonProperty("currencyCodeA")]
    public int CurrencyCodeA { get; set; }
    
    [JsonProperty("currencyCodeB")]
    public int CurrencyCodeB { get; set; }
    
    [JsonProperty("rateCross")]
    public decimal RateCross { get; set; }
    
    [JsonProperty("rateBuy")]
    public decimal RateBuy { get; set; }
    
    [JsonProperty("rateSell")]
    public decimal RateSell { get; set; }
    
    [JsonProperty("date")]
    public long Date { get; set; }
}