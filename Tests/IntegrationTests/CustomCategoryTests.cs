using System.Net;
using System.Net.Http.Json;
using Finance.Application.Categories.CommandHandlers;
using Finance.Application.Common.Interfaces;
using Finance.Application.CustomCategories.CommandHandlers;
using Finance.Domain.Entities;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Tests.IntegrationTests;

public class CustomCategoryTests : BaseTestFixture
{
    [Test]
    public async Task AddCustomCategoryTest()
    {
        //Arrange
        using var scope = ServiceProvider.CreateScope();
        var repository = scope.ServiceProvider.GetRequiredService<IRepository<CustomCategory>>();
        var token = await GetToken();
        var command = new AddCategoryCommand("add title", "icon", TransactionType.Expense, "color");
        
        //Act
        var request = new HttpRequestMessage(HttpMethod.Post, "api/customCategory");
        request.Headers.Add("Authorization", "Bearer " + token.AccessToken);
        request.Content = JsonContent.Create(command);
        var response = await HttpClient.SendAsync(request, Ct);

        //Assert
        response.EnsureSuccessStatusCode();
        var category = await repository.FirstOrDefault(x => x.Title == command.Title, Ct);
        category.Should().NotBeNull();
    }
    
    [Test]
    public async Task AddCustomCategoryWithExistingTitleTest()
    {
        //Arrange
        using var scope = ServiceProvider.CreateScope();
        var repository = scope.ServiceProvider.GetRequiredService<IRepository<CustomCategory>>();
        
        var category = await repository.Query().FirstOrDefaultAsync(Ct);
        category.Should().NotBeNull();
        
        var command = new AddCategoryCommand(category!.Title, "icon2", TransactionType.Expense, "color2");
        var token = await GetToken();
        
        //Act
        var request = new HttpRequestMessage(HttpMethod.Post, "api/customCategory");
        request.Headers.Add("Authorization", "Bearer " + token.AccessToken);
        request.Content = JsonContent.Create(command);
        var response = await HttpClient.SendAsync(request, Ct);

        //Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var errorResponse = await response.Content.ReadFromJsonAsync<ValidationProblemDetails>();
        errorResponse.Should().NotBeNull();
        errorResponse!.Status.Should().Be(StatusCodes.Status400BadRequest);
        errorResponse.Errors.Should().NotBeNullOrEmpty();
        errorResponse.Errors["Title"].Should().NotBeNullOrEmpty();
    }
    
    [Test]
    public async Task GetCustomCategoriesTest()
    {
        //Arrange
        using var scope = ServiceProvider.CreateScope();
        var token = await GetToken();
        
        //Act
        var request = new HttpRequestMessage(HttpMethod.Get, "api/customCategory");
        request.Headers.Add("Authorization", "Bearer " + token.AccessToken);
        var response = await HttpClient.SendAsync(request, Ct);

        //Assert
        response.EnsureSuccessStatusCode();
        var categories = await response.Content.ReadFromJsonAsync<ICollection<CustomCategory>>();
        categories.Should().NotBeNullOrEmpty();
    }
    
    [Test]
    public async Task DeleteCustomCategoryTest()
    {
        //Arrange
        using var scope = ServiceProvider.CreateScope();
        var repository = scope.ServiceProvider.GetRequiredService<IRepository<CustomCategory>>();
        
        var category = await repository.FirstOrDefault(x => x.TeamId == User.TeamId && !x.IsDeleted, Ct);
        category.Should().NotBeNull();
        var token = await GetToken();
        
        //Act
        var request = new HttpRequestMessage(HttpMethod.Delete, $"api/customCategory/{category!.Id}");
        request.Headers.Add("Authorization", "Bearer " + token.AccessToken);
        var response = await HttpClient.SendAsync(request, Ct);

        //Assert
        response.EnsureSuccessStatusCode();
        
        request = new HttpRequestMessage(HttpMethod.Get, "api/customCategory");
        request.Headers.Add("Authorization", "Bearer " + token.AccessToken);
        response = await HttpClient.SendAsync(request, Ct);
        response.EnsureSuccessStatusCode();
        var categories = await response.Content.ReadFromJsonAsync<ICollection<CustomCategory>>();
        categories.Should().NotBeNull();
        categories.Should().NotContain(x => x.Title == category.Title && x.TeamId == category.TeamId);
    }
    
    [Test]
    public async Task UpdateCustomCategoryTest()
    {
        //Arrange
        using var scope = ServiceProvider.CreateScope();
        var repository = scope.ServiceProvider.GetRequiredService<IRepository<CustomCategory>>();

        var category = await repository.FirstOrDefault(x => x.TeamId == User.TeamId && !x.IsDeleted, Ct);
        category.Should().NotBeNull();
        
        const string newTitle = "new custom title";
        var token = await GetToken();
        
        //Act
        var request = new HttpRequestMessage(HttpMethod.Put, "api/customCategory");
        request.Headers.Add("Authorization", "Bearer " + token.AccessToken);
        request.Content = JsonContent.Create(new EditCustomCategoryCommand(User.TeamId, category!.Id, newTitle, category!.Icon, category!.Type, category!.Color));
        var response = await HttpClient.SendAsync(request, Ct);

        //Assert
        response.EnsureSuccessStatusCode();
        
        //TODO investigate why
        /*var categories = await repository.GetAllAsync(Ct);
        categories.Should().NotBeNullOrEmpty();
        categories.Should().ContainSingle(x => x.Title == newTitle && x.TeamId == User.TeamId);*/
    }
}