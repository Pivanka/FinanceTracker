using System.Net.Http.Json;
using Finance.Application.Common.Interfaces;
using Finance.Application.Common.Models;
using Finance.Domain.Entities;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;

namespace Tests.IntegrationTests;

public class DashboardTests : BaseTestFixture
{
    [Test]
    public async Task GetBalanceTest()
    {
        //Arrange
        using var scope = ServiceProvider.CreateScope();
        var unitOfWork = scope.ServiceProvider.GetRequiredService<IUnitOfWork>();

        var account = new Account
        {
            Currency = "UAH",
            TeamId = User.TeamId,
            Title = "test account"
        };
        await unitOfWork.AccountRepository.Add(account, Ct);
        await unitOfWork.SaveChanges(Ct);

        const int expectedAmount = 100;

        var transactions = new List<Transaction>
        {
            new()
            {
                Amount = expectedAmount,
                Currency = account.Currency,
                Date = DateTime.UtcNow,
                AccountId = account.Id,
                Type = TransactionType.Expense,
                ExchangeRate = 1
            },
            new()
            {
                Amount = expectedAmount,
                Currency = account.Currency,
                Date = DateTime.UtcNow.AddMonths(-2),
                AccountId = account.Id,
                Type = TransactionType.Expense,
                ExchangeRate = 1
            },
        };
        await unitOfWork.TransactionRepository.Add(transactions, Ct);
        await unitOfWork.SaveChanges(Ct);
        
        var token = await GetToken();
        
        //Act
        var request = new HttpRequestMessage(HttpMethod.Get, "api/dashboard");
        request.Headers.Add("Authorization", "Bearer " + token.AccessToken);
        var response = await HttpClient.SendAsync(request, Ct);

        //Assert
        response.EnsureSuccessStatusCode();
        var balance = await response.Content.ReadFromJsonAsync<Balance>();
        balance.Should().NotBeNull();
        balance!.Currency.Should().NotBeNullOrEmpty();
        balance!.Expenses.Should().BeGreaterOrEqualTo(expectedAmount);
    }
}