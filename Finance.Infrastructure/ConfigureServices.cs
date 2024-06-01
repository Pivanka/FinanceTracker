using Finance.Application.Common.Interfaces;
using Finance.Domain.Entities;
using Finance.Infrastructure.Hubs;
using Finance.Infrastructure.Persistence;
using Finance.Infrastructure.Services;
using Finance.RazorHtmlEmails.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Finance.Infrastructure;

public static class ConfigureServices
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<DataContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("PostgreSqlConnectionString")));

        services.AddTransient<IEmailSender, EmailSender>();
        services.AddScoped<IRazorViewToStringRenderer, RazorViewToStringRenderer>();
        services.AddRazorPages();
        
        services.AddScoped<IRepository<User>, Repository<User>>();
        services.AddScoped<IRepository<Team>, Repository<Team>>();
        services.AddScoped<IRepository<Account>, Repository<Account>>();
        services.AddScoped<IRepository<Transaction>, Repository<Transaction>>();
        services.AddScoped<IRepository<Category>, Repository<Category>>();
        services.AddScoped<IRepository<CustomCategory>, Repository<CustomCategory>>();
        services.AddScoped<IRepository<Notification>, Repository<Notification>>();
        services.AddScoped<IUnitOfWork, UnitOfWork>();

        services.AddScoped<ITokenGenerator, TokenGenerator>();
        services.AddScoped<IBudgetOptimizer, BudgetOptimizer>();
        
        services.AddHttpClient<ICurrencyClient, CurrencyClient>("monobank", (_, client) =>
        {
            client.BaseAddress = new Uri("https://api.monobank.ua/");
        });

        services.AddSignalR(options =>
        {
            options.EnableDetailedErrors = true;
        });

        services.AddSingleton<NotificationHub>();
        services.AddSingleton<INotificationContext, NotificationContext>();
        services.AddScoped<ITeamMemberNotificationSender, TeamMemberNotificationSender>();
        services.AddSingleton<ICurrencyService, CurrencyService>();
        services.AddScoped<IExchangeRateCalculator, ExchangeRateCalculator>();
        
        return services;
    }
}