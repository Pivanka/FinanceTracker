using Finance.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Finance.Application.Common.Interfaces;

public interface IDataContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<Account> Accounts { get; set; }
    public DbSet<Team> Teams { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<CustomCategory> CustomCategories { get; set; }
    public DbSet<Transaction> Transactions { get; set; }
    public DbSet<Notification> Notifications { get; set; }
}