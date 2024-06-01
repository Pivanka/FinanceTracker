using Finance.Domain.Common;

namespace Finance.Domain.Entities;

public class Team : BaseEntity
{
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string Currency { get; set; } = "UAH";

    public ICollection<User> Users { get; set; } = new List<User>();
    public ICollection<Account> Accounts { get; set; } = new List<Account>();
}