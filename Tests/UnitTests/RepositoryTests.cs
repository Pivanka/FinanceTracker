using Finance.Application.Common.Interfaces;
using Finance.Domain.Entities;
using Finance.Infrastructure.Services;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;

namespace Tests.UnitTests;

[TestFixture]
public class RepositoryTests
{
    private readonly CancellationToken _ct = CancellationToken.None;
    private RepositorySeedDataFixture _fixture;
    private IRepository<Category> _categoryRepository;

    [OneTimeSetUp]
    public void OneTimeSetUp()
    {
        _fixture = new RepositorySeedDataFixture();
        _categoryRepository = new Repository<Category>(_fixture.DbContext);
    }

    [OneTimeTearDown]
    public void OneTimeTearDown()
    {
        _fixture.Dispose();
    }
    
    [Test]
    public async Task GetById_Test()
    {
        // Arrange
        var category = _fixture.DbContext.Categories.First();

        // Act
        var actualCategory = await _categoryRepository.GetById(category.Id, _ct);

        //Assert
        actualCategory.Should().BeEquivalentTo(category);
    }
    
    [Test]
    public async Task GetAll_Test()
    {
        // Arrange
        var categoriesCount = _fixture.DbContext.Categories.Count();

        // Act
        var allCategories = await _categoryRepository.GetAll(_ct);

        //Assert
        allCategories.Count().Should().Be(categoriesCount);
    }
    
    [Test]
    public async Task AddEntity_Test()
    {
        // Arrange
        var category = new Category
        {
            Title = "Test",
            Icon = "Test",
            Color = "Test",
            Type = TransactionType.Expense
        };
        var expectedCount = _fixture.DbContext.Categories.Count() + 1;

        // Act
        await _categoryRepository.Add(category, _ct);
        await _fixture.DbContext.SaveChangesAsync(_ct);
        var actualCount = _fixture.DbContext.Categories.Count();

        //Assert
        expectedCount.Should().Be(actualCount);
    }
    
    [Test]
    public async Task BulkAddEntity_Test()
    {
        // Arrange
        var categories = new List<Category>
        {
            new()
            {
                Title = "Test",
                Icon = "Test",
                Color = "Test",
                Type = TransactionType.Expense
            },
            new()
            {
                Title = "Test 2",
                Icon = "Test 2",
                Color = "Test 2",
                Type = TransactionType.Income
            }
        };
        var expectedCount = _fixture.DbContext.Categories.Count() + categories.Count;

        // Act
        await _categoryRepository.Add(categories, _ct);
        await _fixture.DbContext.SaveChangesAsync(_ct);
        var actualCount = _fixture.DbContext.Categories.Count();

        //Assert
        expectedCount.Should().Be(actualCount);
    }
    
    [Test]
    public async Task DeleteEntity_Test()
    {
        // Arrange
        var categories = _fixture.DbContext.Categories;
        var expectedCount = categories.Count() - 1;

        // Act
        await _categoryRepository.Delete(categories.First(), _ct);
        await _fixture.DbContext.SaveChangesAsync(_ct);
        var actualCount = _fixture.DbContext.Categories.Count();

        //Assert
        actualCount.Should().Be(expectedCount);
    }
    
    [Test]
    public async Task FirstOrDefaultEntity_Not_Existing_Id()
    {
        // Arrange
        const int notExistingId = -1;

        // Act
        var actualResult = await _categoryRepository.FirstOrDefault(x => x.Id == notExistingId, _ct);

        // Assert
        actualResult.Should().BeNull();
    }
    
    [Test]
    public async Task FirstOrDefaultEntity_Existing_Id()
    {
        // Arrange
        var expectedCategory = _fixture.DbContext.Categories.First();

        // Act
        var actualBook = await _categoryRepository.FirstOrDefault(x => x.Id == expectedCategory.Id, _ct);

        // Assert
        actualBook.Should().NotBeNull();
        expectedCategory.Id.Should().Be(actualBook!.Id);
    }
    
    [Test]
    public async Task UpdateEntity_Not_Null()
    {
        // Arrange
        var category = _fixture.DbContext.Categories.First();
        var expectedTitle= "Test 2";
        category.Title = expectedTitle;

        // Act
        await _categoryRepository.Update(category, _ct);
        await _fixture.DbContext.SaveChangesAsync(_ct);
        var actualTitle = (await _fixture.DbContext.Categories.FirstOrDefaultAsync(x => x.Id == category.Id, _ct))?.Title;

        // Assert
        actualTitle.Should().BeEquivalentTo(expectedTitle);
    }
}