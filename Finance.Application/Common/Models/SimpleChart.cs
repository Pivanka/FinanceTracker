namespace Finance.Application.Common.Models;

public class SimpleChart
{
    public IEnumerable<Value> Values { get; set; } = new List<Value>();
    public string Currency { get; set; } = null!;
}

public class Value
{
    public string CategoryTitle { get; set; } = null!;
    public decimal Amount { get; set; }
    public string Color { get; set; } = null!;
}