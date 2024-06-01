using Finance.Domain.Entities;

namespace Finance.Application.Common.Interfaces;

public interface IUnitOfWork
{
    Task SaveChanges(CancellationToken ct);
    IRepository<User> UserRepository { get; }
    IRepository<Team> TeamRepository { get; }
    IRepository<Account> AccountRepository { get; }
    IRepository<Category> CategoryRepository { get; }
    IRepository<CustomCategory> CustomCategoryRepository { get; }
    IRepository<Transaction> TransactionRepository { get; }
    IRepository<Notification> NotificationRepository { get; }
}