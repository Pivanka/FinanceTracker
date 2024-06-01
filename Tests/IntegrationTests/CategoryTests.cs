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

public class CategoryTests : BaseTestFixture
{
    [Test]
    public async Task AddCategoryTest()
    {
        //Arrange
        using var scope = ServiceProvider.CreateScope();
        var repository = scope.ServiceProvider.GetRequiredService<IRepository<Category>>();
        var command = new AddCategoryCommand("add category", "icon", TransactionType.Expense, "color");
        
        //Act
        var response = await HttpClient.PostAsJsonAsync("api/category", command, Ct);

        //Assert
        response.EnsureSuccessStatusCode();
        var category = await repository.FirstOrDefault(x => x.Title == command.Title, Ct);
        category.Should().NotBeNull();
    }
    
    [Test]
    public async Task GetCategoriesByTypeTest()
    {
        //Act
        var response = await HttpClient.GetAsync($"api/category/{TransactionType.Expense}", Ct);

        //Assert
        response.EnsureSuccessStatusCode();
        var categories = await response.Content.ReadFromJsonAsync<ICollection<Category>>();
        categories.Should().NotBeNullOrEmpty();
    }
    
    [Test]
    public async Task GetAllCategoriesTest()
    {
        //Act
        var response = await HttpClient.GetAsync("api/category", Ct);

        //Assert
        response.EnsureSuccessStatusCode();
        var categories = await response.Content.ReadFromJsonAsync<ICollection<Category>>();
        categories.Should().NotBeNullOrEmpty();
    }
}