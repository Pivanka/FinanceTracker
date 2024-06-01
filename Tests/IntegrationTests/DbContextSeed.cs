using Finance.Domain.Entities;
using Finance.Infrastructure.Persistence;

namespace Tests.IntegrationTests;

public static class DbContextSeed
{
    public static DataContext InitializeTestDatabase(this DataContext context, User user)
    {
        if (!context.Categories.Any())
        {
            context.Categories.Add(new Category()
            {
                Title = "House",
                Icon = "House Icon",
                Color = "House Color",
                Type = TransactionType.Expense
            });

            context.Categories.Add(new Category()
            {
                Title = "Food",
                Icon = "Food Icon",
                Color = "Food Color",
                Type = TransactionType.Expense
            });

            context.SaveChanges();
        }
        
        if (!context.CustomCategories.Any())
        {
            context.CustomCategories.Add(new CustomCategory()
            {
                Title = "House",
                Icon = "House Icon",
                Color = "House Color",
                Type = TransactionType.Expense,
                TeamId = user.TeamId,
                IsDeleted = false
            });

            context.CustomCategories.Add(new CustomCategory()
            {
                Title = "Food",
                Icon = "Food Icon",
                Color = "Food Color",
                Type = TransactionType.Expense,
                TeamId = user.TeamId,
                IsDeleted = false
            });

            context.SaveChanges();
        }

        if (!context.Accounts.Any())
        {
            context.Accounts.Add(new Account
            {
                Id = 1,
                TeamId = user.TeamId,
                Title = "Default",
                IsDeleted = false,
                Currency = "UAH"
            });
            context.SaveChanges();
        }

        if (!context.Notifications.Any())
        {
            context.Notifications.Add(new Notification
            {
               UserId = user.Id,
               Type = NotificationType.RoleChanged,
               Message = "test",
               IsRead = false
            });
            context.SaveChanges();
        }

        if (!context.Transactions.Any())
        {
            context.Transactions.Add(new Transaction
            {
                Amount = 100,
                Currency = "UAH",
                Type = TransactionType.Expense,
                AccountId = 1,
                CategoryId = 1,
                ExchangeRate = 1,
                Date = DateTime.UtcNow
            });
            
            context.Transactions.Add(new Transaction
            {
                Amount = 120,
                Currency = "UAH",
                Type = TransactionType.Expense,
                AccountId = 1,
                CategoryId = 1,
                ExchangeRate = 1,
                Date = DateTime.UtcNow
            });
            context.SaveChanges();
        }
        
        return context;
    }
}