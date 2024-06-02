namespace Finance.Application.Common.Models.Optimizing;

public class Item
{
    public int? CategoryId { get; set; }
    public int? CustomCategoryId { get; set; }
    public decimal? MinAmount { get; set; }
    public decimal? MaxAmount { get; set; }
}