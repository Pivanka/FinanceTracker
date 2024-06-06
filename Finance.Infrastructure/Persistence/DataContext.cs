using Finance.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Finance.Infrastructure.Persistence;

public class DataContext(DbContextOptions<DataContext> options) : DbContext(options)
{
    public DbSet<User> Users { get; set; }
    public DbSet<Account> Accounts { get; set; }
    public DbSet<Team> Teams { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<CustomCategory> CustomCategories { get; set; }
    public DbSet<Transaction> Transactions { get; set; }
    public DbSet<Notification> Notifications { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        modelBuilder.Entity<CustomCategory>()
            .HasIndex(b => new { b.IsDeleted, b.Title });

        modelBuilder.Entity<User>()
            .HasIndex(x => new { x.Email });

        modelBuilder.Entity<Account>()
            .HasIndex(x => new { x.Title, x.IsDeleted });

        modelBuilder.Entity<Team>()
            .HasIndex(x => new { x.Currency });

        modelBuilder.Entity<Transaction>()
            .HasIndex(x => new { x.Amount, x.Currency, x.Date, x.Type });

        modelBuilder.Entity<Transaction>()
            .HasIndex(x => new { x.Amount, x.Currency, x.Date, x.Type });

        modelBuilder.Entity<Notification>()
            .HasIndex(x => new { x.CreatedDate, x.Message, x.IsRead  });

        modelBuilder.Entity<Category>()
            .HasIndex(x => new { x.Title });
    }
}