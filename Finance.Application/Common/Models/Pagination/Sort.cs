namespace Finance.Application.Common.Models.Pagination;

public class Sort
{
    public string Field { get; set; } = string.Empty;
    public SortDirection Direction { get; set; }
}