using System.Net.Http.Json;
using Finance.Application.Common.Interfaces;
using Finance.Application.Common.Models;
using Finance.Application.Common.Models.Optimizing;
using Finance.Domain.Entities;
using Finance.Models;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using Moq;

namespace Tests.IntegrationTests;

public class ReportTests : BaseTestFixture
{
    [Test]
    public async Task GetChartTest()
    {
        //Arrange
        var requestModel = new GetChartRequestModel(TransactionType.Expense, DateTime.UtcNow.ToLongDateString(),
            DateTime.UtcNow.AddDays(-1).ToLongDateString(), "");
        var token = await GetToken();
        
        //Act
        var request = new HttpRequestMessage(HttpMethod.Post, "api/report");
        request.Headers.Add("Authorization", "Bearer " + token.AccessToken);
        request.Content = JsonContent.Create(requestModel);
        var response = await HttpClient.SendAsync(request, Ct);

        //Assert
        response.EnsureSuccessStatusCode();
        var chart = await response.Content.ReadFromJsonAsync<SimpleChart>();
        chart.Should().NotBeNull();
    }
    
    [Test]
    public async Task GetChartsWithCorrectPeriodTest()
    {
        //Arrange
        using var scope = ServiceProvider.CreateScope();
        var unitOfWork = scope.ServiceProvider.GetRequiredService<IUnitOfWork>();
        
        var category = new Category
        {
            Title = "specific category",
            Type = TransactionType.Expense,
            Color = "color",
            Icon = "icon"
        };
        await unitOfWork.CategoryRepository.Add(category, Ct);
        await unitOfWork.SaveChanges(Ct);

        var transaction = new Transaction
        {
            Amount = 100,
            Currency = "UAH",
            AccountId = 1,
            CategoryId = category.Id,
            Date = DateTime.UtcNow.AddMonths(-2),
            ExchangeRate = 1,
            Type = TransactionType.Expense
        };
        await unitOfWork.TransactionRepository.Add(transaction, Ct);
        await unitOfWork.SaveChanges(Ct);
        
        var requestModel = new GetChartRequestModel(TransactionType.Expense, DateTime.UtcNow.AddMonths(-3).ToLongDateString(),
            DateTime.UtcNow.AddMonths(-1).ToLongDateString(), "");
        
        var token = await GetToken();
        
        //Act
        var request = new HttpRequestMessage(HttpMethod.Post, "api/report");
        request.Headers.Add("Authorization", "Bearer " + token.AccessToken);
        request.Content = JsonContent.Create(requestModel);
        var response = await HttpClient.SendAsync(request, Ct);

        //Assert
        response.EnsureSuccessStatusCode();
        var chart = await response.Content.ReadFromJsonAsync<SimpleChart>();
        chart.Should().NotBeNull();
        chart!.Values.Should().NotBeNullOrEmpty();
        var value = chart!.Values.Should().ContainSingle(x => x.CategoryTitle == category.Title).Subject;
        value.Amount.Should().Be(transaction.Amount);
    }
    
    [Test]
    public async Task OptimizeBudgetTest()
    {
        //Arrange
        using var scope = ServiceProvider.CreateScope();
        var optimizerMock = scope.ServiceProvider.GetRequiredService<Mock<IBudgetOptimizer>>();
        var requestModel = new OptimizeBudget
        {
            Budget = 10000,
            Items = new List<Item>()
        };
        var token = await GetToken();
        
        //Act
        var request = new HttpRequestMessage(HttpMethod.Post, "api/report/optimizing");
        request.Headers.Add("Authorization", "Bearer " + token.AccessToken);
        request.Content = JsonContent.Create(requestModel);
        var response = await HttpClient.SendAsync(request, Ct);

        //Assert
        response.EnsureSuccessStatusCode();
        var result = await response.Content.ReadFromJsonAsync<OptimizeBudgetResult>();
        result.Should().NotBeNull();
        result!.Result.Should().NotBeNullOrEmpty();
        
        optimizerMock.Verify(x => x.Optimize(It.IsAny<double>(),
            It.IsAny<List<CategoryInfo>>()), Times.Once);
    }
}