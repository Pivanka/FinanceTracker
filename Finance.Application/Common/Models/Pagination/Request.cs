namespace Finance.Application.Common.Models.Pagination;

public class Request
{
    public string? Search { get; set; }
    public ICollection<Sort> Sort { get; set; } = new List<Sort>();
    public ICollection<Filter> Filter { get; set; } = new List<Filter>();
}