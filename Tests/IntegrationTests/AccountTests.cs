using System.Net;
using System.Net.Http.Json;
using Finance.Application.Accounts.CommandHandlers;
using Finance.Application.Categories.CommandHandlers;
using Finance.Application.Common.Interfaces;
using Finance.Application.Common.Models;
using Finance.Application.Common.Models.Pagination;
using Finance.Domain.Entities;
using Finance.Models;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;

namespace Tests.IntegrationTests;

public class AccountTests : BaseTestFixture
{
    [Test]
    public async Task GetAccountTest()
    {
        //Arrange
        var token = await GetToken();
        
        //Act
        var request = new HttpRequestMessage(HttpMethod.Get, "api/account");
        request.Headers.Add("Authorization", "Bearer " + token.AccessToken);
        var response = await HttpClient.SendAsync(request, Ct);

        //Assert
        response.EnsureSuccessStatusCode();
        var accounts = await response.Content.ReadFromJsonAsync<ICollection<AccountModel>>();
        accounts.Should().NotBeNullOrEmpty();
    }
    
    [Test]
    public async Task AddAccountTest()
    {
        //Arrange
        using var scope = ServiceProvider.CreateScope();
        var repository = scope.ServiceProvider.GetRequiredService<IRepository<Account>>();
        var token = await GetToken();
        var command = new AddAccountModel("add title", "icon", "currency");
        
        //Act
        var request = new HttpRequestMessage(HttpMethod.Post, "api/account");
        request.Headers.Add("Authorization", "Bearer " + token.AccessToken);
        request.Content = JsonContent.Create(command);
        var response = await HttpClient.SendAsync(request, Ct);

        //Assert
        response.EnsureSuccessStatusCode();
        var account = await repository.FirstOrDefault(x => x.Title == command.Title, Ct);
        account.Should().NotBeNull();
    }
    
    [Test]
    public async Task UpdateAccountTest()
    {
        //Arrange
        using var scope = ServiceProvider.CreateScope();
        var repository = scope.ServiceProvider.GetRequiredService<IRepository<Account>>();
        var acccount = await repository.FirstOrDefault(x => x.TeamId == User.TeamId, Ct);
        acccount.Should().NotBeNull();
        var command = new EditAccountModel(acccount!.Id, "updated title", "updated icon");
        var token = await GetToken();
        
        //Act
        var request = new HttpRequestMessage(HttpMethod.Put, "api/account");
        request.Headers.Add("Authorization", "Bearer " + token.AccessToken);
        request.Content = JsonContent.Create(command);
        var response = await HttpClient.SendAsync(request, Ct);

        //Assert
        response.EnsureSuccessStatusCode();
        
        request = new HttpRequestMessage(HttpMethod.Get, "api/account");
        request.Headers.Add("Authorization", "Bearer " + token.AccessToken);
        response = await HttpClient.SendAsync(request, Ct);
        response.EnsureSuccessStatusCode();
        var accountModels = await response.Content.ReadFromJsonAsync<ICollection<AccountModel>>();
        accountModels.Should().NotBeNull();
        accountModels.Should().ContainSingle(x => x.Id == command.Id);
    }
    
    [Test]
    public async Task GetAccountCurrencyTest()
    {
        //Arrange
        using var scope = ServiceProvider.CreateScope();
        
        var repository = scope.ServiceProvider.GetRequiredService<IRepository<Account>>();
        var acccount = await repository.FirstOrDefault(x => x.TeamId == User.TeamId, Ct);
        acccount.Should().NotBeNull();
        var token = await GetToken();
        
        //Act
        var request = new HttpRequestMessage(HttpMethod.Get, $"api/account/{acccount!.Id}/currency");
        request.Headers.Add("Authorization", "Bearer " + token.AccessToken);
        var response = await HttpClient.SendAsync(request, Ct);

        //Assert
        response.EnsureSuccessStatusCode();
    }
    
    [Test]
    public async Task DeleteAccountTest()
    {
        //Arrange
        using var scope = ServiceProvider.CreateScope();
        
        var token = await GetToken();
        
        var command = new AddAccountModel("delete title", "icon", "currency");
        var request = new HttpRequestMessage(HttpMethod.Post, "api/account");
        request.Headers.Add("Authorization", "Bearer " + token.AccessToken);
        request.Content = JsonContent.Create(command);
        var response = await HttpClient.SendAsync(request, Ct);
        response.EnsureSuccessStatusCode();
        
        var repository = scope.ServiceProvider.GetRequiredService<IRepository<Account>>();
        var account = await repository.FirstOrDefault(x => x.Title == command.Title && x.TeamId == User.TeamId, Ct);
        account.Should().NotBeNull();
        
        //Act
        request = new HttpRequestMessage(HttpMethod.Delete, $"api/account/{account!.Id}");
        request.Headers.Add("Authorization", "Bearer " + token.AccessToken);
        response = await HttpClient.SendAsync(request, Ct);

        //Assert
        response.EnsureSuccessStatusCode();
        
        request = new HttpRequestMessage(HttpMethod.Get, "api/account");
        request.Headers.Add("Authorization", "Bearer " + token.AccessToken);
        response = await HttpClient.SendAsync(request, Ct);
        response.EnsureSuccessStatusCode();
        var accountModels = await response.Content.ReadFromJsonAsync<ICollection<AccountModel>>();
        accountModels.Should().NotBeNull();
        accountModels.Should().NotContain(x => x.Id == account.Id);
    }
    
    [Test]
    public async Task DeleteNotExistingAccountTest()
    {
        //Arrange
        var token = await GetToken();
        
        //Act
        var request = new HttpRequestMessage(HttpMethod.Delete, "api/account/-1");
        request.Headers.Add("Authorization", "Bearer " + token.AccessToken);
        var response = await HttpClient.SendAsync(request, Ct);

        //Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }
    
    [Test]
    public async Task GetAccountsInfoTest()
    {
        //Arrange
        var token = await GetToken();
        
        //Act
        var request = new HttpRequestMessage(HttpMethod.Post, "api/account/info?search=");
        request.Headers.Add("Authorization", "Bearer " + token.AccessToken);
        request.Content = JsonContent.Create(new List<Filter>
        {
            new()
            {
                Key = "type",
                Value = "All"
            }
        });
        var response = await HttpClient.SendAsync(request, Ct);

        //Assert
        response.EnsureSuccessStatusCode();
        var accounts = await response.Content.ReadFromJsonAsync<ICollection<AccountInfoModel>>();
        accounts.Should().NotBeNullOrEmpty();
    }
}