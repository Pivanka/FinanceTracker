using Finance.Application.Common.Interfaces;
using Finance.Domain.Entities;
using Finance.Infrastructure.Persistence;

namespace Finance.Infrastructure.Services;

public class UnitOfWork(DataContext dataContext) : IUnitOfWork
{
    public IRepository<User> UserRepository { get; } = new Repository<User>(dataContext);
    public IRepository<Team> TeamRepository { get; } = new Repository<Team>(dataContext);
    public IRepository<Account> AccountRepository { get; } = new Repository<Account>(dataContext);
    public IRepository<Category> CategoryRepository { get; } = new Repository<Category>(dataContext);
    public IRepository<CustomCategory> CustomCategoryRepository { get; } = new Repository<CustomCategory>(dataContext);
    public IRepository<Transaction> TransactionRepository { get; } = new Repository<Transaction>(dataContext);
    public IRepository<Notification> NotificationRepository { get; } = new Repository<Notification>(dataContext);

    public async Task SaveChanges(CancellationToken ct)
    {
        await dataContext.SaveChangesAsync(ct);
    }
}