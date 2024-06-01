using System.Net.Http.Json;
using Finance.Application.Common.Interfaces;
using Finance.Application.Common.Models;
using Finance.Application.Common.Models.Pagination;
using Finance.Application.Notifications.QueryHandlers;
using Finance.Domain.Entities;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Tests.IntegrationTests;

public class NotificationTests : BaseTestFixture
{
    [Test]
    public async Task IsUnreadNotificationsTest()
    {
        //Arrange
        var token = await GetToken();
        
        //Act
        var request = new HttpRequestMessage(HttpMethod.Get, "api/notification/unread");
        request.Headers.Add("Authorization", "Bearer " + token.AccessToken);
        var response = await HttpClient.SendAsync(request, Ct);

        //Assert
        response.EnsureSuccessStatusCode();
        var notifications = await response.Content.ReadFromJsonAsync<bool>();
        notifications.Should().BeTrue();
    }
    
    [Test]
    public async Task ReadNotificationTest()
    {
        //Arrange
        using var scope = ServiceProvider.CreateScope();
        var repository = scope.ServiceProvider.GetRequiredService<IRepository<Notification>>();
        
        var notification = await repository.FirstOrDefault(x => x.UserId == User.Id && !x.IsRead, Ct);
        notification.Should().NotBeNull();
        
        var token = await GetToken();
        
        //Act
        var request = new HttpRequestMessage(HttpMethod.Post, $"api/notification/read");
        request.Headers.Add("Authorization", "Bearer " + token.AccessToken);
        request.Content = JsonContent.Create(notification!.Id);
        var response = await HttpClient.SendAsync(request, Ct);

        //Assert
        response.EnsureSuccessStatusCode();
    }
}