using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Security.Cryptography;
using System.Text;
using Finance.Application.Common.Interfaces;
using Finance.Application.Common.Models;
using Finance.Application.Users.CommandHandlers;
using Finance.Domain.Entities;
using Finance.Infrastructure.Persistence;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;

namespace Tests.IntegrationTests;

[TestFixture]
public class BaseTestFixture
{
    protected HttpClient HttpClient;
    protected IServiceProvider ServiceProvider;
    protected User User { get; set; }
    protected readonly CancellationToken Ct = CancellationToken.None;

    protected const string UserPassword = "Test";
    private FinanceWebApplicationFactory _factory;
    
    [OneTimeSetUp]
    public void OneTimeSetUp()
    {
        _factory = new FinanceWebApplicationFactory();
        
        HttpClient = _factory.CreateClient();
        
        ServiceProvider = _factory.Services;
        AddDataSeed();
    }

    [OneTimeTearDown]
    public async Task OneTimeTearDown()
    {
        HttpClient.Dispose();
        try
        {
            await _factory.DisposeAsync();
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
        }
    }
    
    protected async Task<AuthResponse> GetToken()
    {
        var request = new LoginUserCommand(User.Email, UserPassword);
        var response = await HttpClient.PostAsJsonAsync("api/auth/login", request, Ct);
        var result = await response.Content.ReadFromJsonAsync<AuthResponse>(Ct);
        result.Should().NotBeNull();
        
        return result!;
    }
    
    protected async Task<HttpResponseMessage> GetRefreshToken(RefreshTokenCommand refreshTokenRequest)
    {
        var response = await HttpClient.PostAsJsonAsync("api/auth/refresh-token", refreshTokenRequest, Ct);
        response.Should().NotBeNull();
        return response;
    }

    private void AddDataSeed()
    {
        using var scope = ServiceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<DataContext>();
        
        using var hmac = new HMACSHA512();

        User = (context.Users.Add(new User
        {
            Email = "test@test.com",
            PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(UserPassword)),
            PasswordSalt = hmac.Key,
            Team = new Team(),
            Role = Role.Admin
        })).Entity;
        context.Users.Add(new User
        {
            Email = "test@member.com",
            PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(UserPassword)),
            PasswordSalt = hmac.Key,
            TeamId = User.TeamId,
            Role = Role.Manager
        });
        context.SaveChanges();
        context.InitializeTestDatabase(User);
    }
}