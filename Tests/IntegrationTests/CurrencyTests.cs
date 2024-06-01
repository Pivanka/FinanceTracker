using System.Net.Http.Json;
using Finance.Application.Common.Models;
using Finance.Application.Transactions.CommandHandlers;
using Finance.Infrastructure.Settings;
using FluentAssertions;

namespace Tests.IntegrationTests;

public class CurrencyTests : BaseTestFixture
{
    [Test]
    public async Task GetCurrenciesTest()
    {
        //Arrange
        var token = await GetToken();
        
        //Act
        var request = new HttpRequestMessage(HttpMethod.Get, "api/currency");
        request.Headers.Add("Authorization", "Bearer " + token.AccessToken);
        var response = await HttpClient.SendAsync(request, Ct);

        //Assert
        response.EnsureSuccessStatusCode();
        var currencies = await response.Content.ReadFromJsonAsync<CurrenciesOptions>();
        currencies.Should().NotBeNull();
        currencies!.Currencies.Should().NotBeNullOrEmpty();
    }
    
    [Test]
    public async Task CalculateAmountTest()
    {
        //Arrange
        var command = new CalculateAmountCommand(100, "UAH", "USD");
        var token = await GetToken();
        
        //Act
        var request = new HttpRequestMessage(HttpMethod.Post, "api/currency");
        request.Headers.Add("Authorization", "Bearer " + token.AccessToken);
        request.Content = JsonContent.Create(command);
        var response = await HttpClient.SendAsync(request, Ct);

        //Assert
        response.EnsureSuccessStatusCode();
        var currencies = await response.Content.ReadFromJsonAsync<CalculateAmountResponseModel>();
        currencies.Should().NotBeNull();
        currencies!.Amount.Should().BeGreaterThan(0);
    }
}