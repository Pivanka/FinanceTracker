using System.Net.Http.Json;
using Finance.Application.Common.Enums;
using Finance.Application.Common.Interfaces;
using Finance.Domain.Entities;
using Finance.Models;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Moq;

namespace Tests.IntegrationTests;

public class TransactionTests : BaseTestFixture
{
    [Test]
    public async Task AddTransactionTest()
    {
        //Arrange
        using var scope = ServiceProvider.CreateScope();
        var signalRMock = scope.ServiceProvider.GetRequiredService<Mock<INotificationContext>>();
        var unitOfWork = scope.ServiceProvider.GetRequiredService<IUnitOfWork>();

        var account = new Account
        {
            Currency = "UAH",
            TeamId = User.TeamId,
            Title = "test account for transaction"
        };
        await unitOfWork.AccountRepository.Add(account, Ct);
        await unitOfWork.SaveChanges(Ct);
        
        var command = new AddTransactionModel
        {
            Amount = 100,
            Currency = account.Currency,
            Type = TransactionType.Expense,
            AccountId = account.Id,
            CategoryId = 1,
            ExchangeRate = 1,
            Date = DateTime.UtcNow
        };
        
        var token = await GetToken();
        
        //Act
        var request = new HttpRequestMessage(HttpMethod.Post, "api/transaction");
        request.Headers.Add("Authorization", "Bearer " + token.AccessToken);
        request.Content = JsonContent.Create(command);
        var response = await HttpClient.SendAsync(request, Ct);

        //Assert
        response.EnsureSuccessStatusCode();
        var transaction = await unitOfWork.TransactionRepository.FirstOrDefault(x => x.AccountId == account.Id, Ct);
        transaction.Should().NotBeNull();
        signalRMock.Verify(x => x.SendToUser(It.IsAny<int>(), SignalRType.Transaction), Times.AtLeastOnce);
    }
    
    [Test]
    public async Task DeleteTransactionTest()
    {
        //Arrange
        using var scope = ServiceProvider.CreateScope();
        var signalRMock = scope.ServiceProvider.GetRequiredService<Mock<INotificationContext>>();
        var repository = scope.ServiceProvider.GetRequiredService<IRepository<Transaction>>();

        var transaction = await repository.Query()
            .Include(x => x.Account)
            .FirstOrDefaultAsync(x => x.Account!.TeamId == User.TeamId);
        transaction.Should().NotBeNull();
        
        var token = await GetToken();
        
        //Act
        var request = new HttpRequestMessage(HttpMethod.Delete, $"api/transaction/{transaction!.Id}");
        request.Headers.Add("Authorization", "Bearer " + token.AccessToken);
        var response = await HttpClient.SendAsync(request, Ct);

        //Assert
        response.EnsureSuccessStatusCode();
        var deletedTransaction = await repository.FirstOrDefault(x => x.Id == transaction!.Id, Ct);
        deletedTransaction.Should().BeNull();
        signalRMock.Verify(x => x.SendToUser(It.IsAny<int>(), SignalRType.Transaction), Times.AtLeastOnce);
    }
    
    [Test]
    public async Task UpdateTransactionTest()
    {
        //Arrange
        using var scope = ServiceProvider.CreateScope();
        var signalRMock = scope.ServiceProvider.GetRequiredService<Mock<INotificationContext>>();
        var repository = scope.ServiceProvider.GetRequiredService<IRepository<Transaction>>();

        var transaction = await repository.Query()
            .Include(x => x.Account)
            .FirstOrDefaultAsync(x => x.Account!.TeamId == User.TeamId);
        transaction.Should().NotBeNull();
        
        const string note = "some note to transaction";
        var model = new EditTransactionModel
        {
            Id = transaction!.Id,
            AccountId = transaction!.AccountId,
            Amount = transaction!.Amount,
            CategoryId = transaction!.CategoryId,
            CustomCategoryId = transaction!.CustomCategoryId,
            Currency = transaction!.Currency,
            Note = note
        };
        var token = await GetToken();
        
        //Act
        var request = new HttpRequestMessage(HttpMethod.Put, "api/transaction");
        request.Headers.Add("Authorization", "Bearer " + token.AccessToken);
        request.Content = JsonContent.Create(model);
        var response = await HttpClient.SendAsync(request, Ct);

        //Assert
        response.EnsureSuccessStatusCode();
        
        //TODO investigate
        /*var updatedTransaction = await repository.GetById(transaction.Id, Ct);
        updatedTransaction.Should().NotBeNull();
        updatedTransaction.Note.Should().NotBeNullOrEmpty();
        updatedTransaction.Note.Should().BeEquivalentTo(note);*/
        signalRMock.Verify(x => x.SendToUser(It.IsAny<int>(), SignalRType.Transaction), Times.AtLeastOnce);
    }
    
    [Test]
    public async Task AddTransactionsTest()
    {
        //Arrange
        using var scope = ServiceProvider.CreateScope();
        var signalRMock = scope.ServiceProvider.GetRequiredService<Mock<INotificationContext>>();
        var unitOfWork = scope.ServiceProvider.GetRequiredService<IUnitOfWork>();

        var account = new Account
        {
            Currency = "UAH",
            TeamId = User.TeamId,
            Title = "test account for bulk transactions"
        };
        await unitOfWork.AccountRepository.Add(account, Ct);
        await unitOfWork.SaveChanges(Ct);
        
        var command = new AddTransactionsModel
        {
            AccountId = account.Id,
            Transactions = new []
            {
                new AddTransactionModel
                {
                    Amount = 100,
                    Currency = account.Currency,
                    Type = TransactionType.Expense,
                    AccountId = account.Id,
                    CategoryId = 1,
                    ExchangeRate = 1,
                    Date = DateTime.UtcNow
                },
                new AddTransactionModel
                {
                    Amount = 150,
                    Currency = account.Currency,
                    Type = TransactionType.Expense,
                    AccountId = account.Id,
                    CategoryId = 1,
                    ExchangeRate = 1,
                    Date = DateTime.UtcNow.AddDays(-1)
                },
            }
        };
        
        var token = await GetToken();
        
        //Act
        var request = new HttpRequestMessage(HttpMethod.Post, "api/transaction/bulk");
        request.Headers.Add("Authorization", "Bearer " + token.AccessToken);
        request.Content = JsonContent.Create(command);
        var response = await HttpClient.SendAsync(request, Ct);

        //Assert
        response.EnsureSuccessStatusCode();
        
        var transactions = unitOfWork.TransactionRepository.Query().Where(x => x.AccountId == account.Id).ToList();
        transactions.Should().NotBeNull();
        transactions.Count.Should().Be(command.Transactions.Count());
        signalRMock.Verify(x => x.SendToUser(It.IsAny<int>(), SignalRType.Transaction), Times.AtLeastOnce);
    }
}