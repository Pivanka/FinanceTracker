using Finance.Application.Common.Enums;
using Finance.Application.Common.Interfaces;
using Finance.Application.Common.Models;
using Finance.Application.Common.Models.Optimizing;
using Microsoft.Extensions.DependencyInjection;
using Moq;

namespace Tests.IntegrationTests;

public static class ServiceExtensions
{
    public static void AddEmailSenderMock(this IServiceCollection serviceCollection)
    {
        var emailSenderMock = new Mock<IEmailSender>();
        serviceCollection.AddSingleton(emailSenderMock.Object)
            .AddSingleton(emailSenderMock);

        emailSenderMock.Setup(x => x.Send(It.IsAny<string>(),
                It.IsAny<string>(),
                It.IsAny<string>(),
                It.IsAny<CancellationToken>()
            ))
            .Returns(Task.FromResult(Task.CompletedTask));
    }

    public static void AddCurrencyClientMock(this IServiceCollection serviceCollection)
    {
        var mock = new Mock<ICurrencyClient>();
        serviceCollection.AddSingleton(mock.Object)
            .AddSingleton(mock);

        mock.Setup(x => x.GetCurrencyRates(It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<CurrencyRate>
            {
                new()
                {
                    Date = 1716843673,
                    RateBuy = 40,
                    RateCross = 40,
                    CurrencyCodeA = 840,
                    CurrencyCodeB = 980,
                    RateSell = 40
                }
            });
    }

    public static void AddSignalRMock(this IServiceCollection serviceCollection)
    {
        var mock = new Mock<INotificationContext>();
        serviceCollection.AddSingleton(mock.Object)
            .AddSingleton(mock);

        mock.Setup(x => x.SendToUser(It.IsAny<int>(),
                It.IsAny<SignalRType>()
            ))
            .Returns(Task.FromResult(Task.CompletedTask));

        mock.Setup(x => x.ReceiveNotification(It.IsAny<int>()))
            .Returns(Task.FromResult(Task.CompletedTask));
    }
    
    public static void AddBudgetOptimizerMock(this IServiceCollection serviceCollection)
    {
        var mock = new Mock<IBudgetOptimizer>();
        serviceCollection.AddSingleton(mock.Object)
            .AddSingleton(mock);

        mock.Setup(x => x.Optimize(It.IsAny<double>(),
                It.IsAny<List<CategoryInfo>>()
            ))
            .Returns(new Dictionary<string, double>
            {
                {"house", 1000}
            });
    }
}