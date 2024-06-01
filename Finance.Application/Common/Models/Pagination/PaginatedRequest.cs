namespace Finance.Application.Common.Models.Pagination;

public class PaginatedRequest : Request
{
    public int PageIndex { get; set; }
    public int PageSize { get; set; }
}