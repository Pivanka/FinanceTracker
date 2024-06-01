using Finance.Domain.Entities;
using Finance.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Tests.UnitTests;

public class RepositorySeedDataFixture : IDisposable
{
    public RepositorySeedDataFixture()
    {
        DbContext.Categories.Add(new Category()
        {
            Id = 1, 
            Title = "House",
            Icon = "Food Icon",
            Color = "Food Color",
            Type = TransactionType.Expense
        });
        DbContext.Categories.Add(new Category()
        {
            Id = 2, 
            Title = "Food",
            Icon = "Food Icon",
            Color = "Food Color",
            Type = TransactionType.Expense
        });
        DbContext.SaveChanges();
    }

    public DataContext DbContext { get; } = new(
        new DbContextOptionsBuilder<DataContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options);

    public void Dispose()
    {
        DbContext.Database.EnsureDeleted();
        DbContext.Dispose();
    }
}