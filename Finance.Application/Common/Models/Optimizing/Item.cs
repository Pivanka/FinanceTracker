namespace Finance.Application.Common.Models.Optimizing;

public class Item
{
    public int? CategoryId { get; set; }
    public int? CustomCategoryId { get; set; }
    public decimal Amount { get; set; }
    public RequirementType Type { get; set; }
}