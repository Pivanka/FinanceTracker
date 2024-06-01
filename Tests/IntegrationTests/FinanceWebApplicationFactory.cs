using Finance.Infrastructure.Persistence;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Tests.IntegrationTests;

public class FinanceWebApplicationFactory : WebApplicationFactory<Program>
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Test");
        builder.ConfigureTestServices(services =>
        {
            var context = services.FirstOrDefault(descriptor => descriptor.ServiceType == typeof(DataContext));
            if (context != null)
            {
                services.Remove(context);
                var options = services.Where(r => r.ServiceType == typeof(DbContextOptions)
                                                  || r.ServiceType.IsGenericType && r.ServiceType.GetGenericTypeDefinition() == typeof(DbContextOptions<>)).ToArray();
                foreach (var option in options)
                {
                    services.Remove(option);
                }
            }
            services.AddDbContext<DataContext>(options =>
            {
                options.UseInMemoryDatabase("TestDatabase");
            });

            services.AddEmailSenderMock();
            services.AddSignalRMock();
            services.AddCurrencyClientMock();
            services.AddBudgetOptimizerMock();
        });
    }
}