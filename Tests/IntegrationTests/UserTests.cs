using System.Net;
using System.Net.Http.Json;
using System.Security.Cryptography;
using System.Text;
using Finance.Application.Common.Enums;
using Finance.Application.Common.Interfaces;
using Finance.Application.Common.Models;
using Finance.Application.Users.CommandHandlers;
using Finance.Domain.Entities;
using FluentAssertions;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using Moq;

namespace Tests.IntegrationTests;

public class UserTests : BaseTestFixture
{
    [Test]
    public async Task GetMembersTest()
    {
        //Arrange
        var token = await GetToken();
        
        //Act
        var request = new HttpRequestMessage(HttpMethod.Get, "api/user");
        request.Headers.Add("Authorization", "Bearer " + token.AccessToken);
        var response = await HttpClient.SendAsync(request, Ct);

        //Assert
        response.EnsureSuccessStatusCode();
        var members = await response.Content.ReadFromJsonAsync<IEnumerable<UserModel>>(cancellationToken: Ct);
        members.Should().NotBeNullOrEmpty();
    }
    
    [Test]
    public async Task UpdateProfileTest()
    {
        //Arrange
        var token = await GetToken();
        const string expectedFirstName = "test";
        
        //Act
        var request = new HttpRequestMessage(HttpMethod.Put, "api/user/profile");
        request.Headers.Add("Authorization", "Bearer " + token.AccessToken);
        request.Content = JsonContent.Create(new UserProfile { Email = User.Email, FirstName = expectedFirstName });
        var response = await HttpClient.SendAsync(request, Ct);

        //Assert
        response.EnsureSuccessStatusCode();
        
        request = new HttpRequestMessage(HttpMethod.Get, "api/user/profile");
        request.Headers.Add("Authorization", "Bearer " + token.AccessToken);
        response = await HttpClient.SendAsync(request, Ct);
        response.EnsureSuccessStatusCode();
        var profile = await response.Content.ReadFromJsonAsync<UserProfile>(cancellationToken: Ct);
        profile.Should().NotBeNull();
        profile!.Email.Should().BeEquivalentTo(User.Email);
        profile!.FirstName.Should().BeEquivalentTo(expectedFirstName);
    }
    
    [Test]
    public async Task UpdateUserRoleWithoutAccessTest()
    {
        //Arrange
        using var scope = ServiceProvider.CreateScope();
        var unitOfWork = scope.ServiceProvider.GetRequiredService<IUnitOfWork>();
        var mediator = scope.ServiceProvider.GetRequiredService<IMediator>();

        using var hmac = new HMACSHA512();
        const string password = "test";

        var teamMember = new User
        {
            Email = "update@role.com",
            PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password)),
            PasswordSalt = hmac.Key,
            TeamId = User.TeamId,
            Role = Role.Manager
        };
        await unitOfWork.UserRepository.Add(teamMember, Ct);
        await unitOfWork.SaveChanges(Ct);
        var loginUserResponse = await mediator.Send(new LoginUserCommand(teamMember.Email, password));
        
        //Act
        var request = new HttpRequestMessage(HttpMethod.Post, $"api/user/{User.Id}/role");
        request.Headers.Add("Authorization", "Bearer " + loginUserResponse.AccessToken);
        request.Content = JsonContent.Create(Role.Viewer);
        var response = await HttpClient.SendAsync(request, Ct);

        //Assert
        response.StatusCode.Should().Be(HttpStatusCode.Forbidden);
    }
    
    [Test]
    public async Task UpdateUserRoleWithAccessTest()
    {
        //Arrange
        using var scope = ServiceProvider.CreateScope();
        var unitOfWork = scope.ServiceProvider.GetRequiredService<IUnitOfWork>();
        var signalRMock = scope.ServiceProvider.GetRequiredService<Mock<INotificationContext>>();

        using var hmac = new HMACSHA512();
        const string password = "test";

        var teamMember = new User
        {
            Email = "update@role.com",
            PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password)),
            PasswordSalt = hmac.Key,
            TeamId = User.TeamId,
            Role = Role.Manager
        };
        await unitOfWork.UserRepository.Add(teamMember, Ct);
        await unitOfWork.SaveChanges(Ct);

        const Role role = Role.Viewer;
        
        var token = await GetToken();
        
        //Act
        var request = new HttpRequestMessage(HttpMethod.Post, $"api/user/{teamMember.Id}/role");
        request.Headers.Add("Authorization", "Bearer " + token.AccessToken);
        request.Content = JsonContent.Create(role);
        var response = await HttpClient.SendAsync(request, Ct);

        //Assert
        response.EnsureSuccessStatusCode();
        /*var teamMemberWithChangedRole = await repository.GetById(teamMember.Id, Ct);
        teamMemberWithChangedRole.Should().NotBeNull();
        teamMemberWithChangedRole.Role.Should().Be(role);*/
        signalRMock.Verify(x => x.ReceiveNotification(It.IsAny<int>()), Times.AtLeastOnce);
    }
    
    [Test]
    public async Task InviteMemberTest()
    {
        //Arrange
        using var scope = ServiceProvider.CreateScope();
        var unitOfWork = scope.ServiceProvider.GetRequiredService<IUnitOfWork>();
        var emailSenderMock = scope.ServiceProvider.GetRequiredService<Mock<IEmailSender>>();
        var signalRMock = scope.ServiceProvider.GetRequiredService<Mock<INotificationContext>>();
        var token = await GetToken();
        var invitationRequest = new InviteMemberCommand(0, "test@invite.com", "", "");
        
        //Act
        var request = new HttpRequestMessage(HttpMethod.Post, "api/user/");
        request.Headers.Add("Authorization", "Bearer " + token.AccessToken);
        request.Content = JsonContent.Create(invitationRequest);
        var response = await HttpClient.SendAsync(request, Ct);

        //Assert
        response.EnsureSuccessStatusCode();
        var invitedUser = await unitOfWork.UserRepository.FirstOrDefault(x => x.Email == invitationRequest.Email, Ct);
        invitedUser.Should().NotBeNull();
        invitedUser!.Invited.Should().BeTrue();
        
        signalRMock.Verify(x => x.SendToUser(It.IsAny<int>(), It.IsAny<SignalRType>()), Times.AtLeastOnce);
        emailSenderMock.Verify(x => x.Send(It.IsAny<string>(), 
            It.IsAny<string>(), 
            It.IsAny<string>(), 
            It.IsAny<CancellationToken>()), Times.AtLeastOnce);
    }
    
    [Test]
    public async Task InviteMemberWithoutAccessTest()
    {
        //Arrange
        using var scope = ServiceProvider.CreateScope();
        var unitOfWork = scope.ServiceProvider.GetRequiredService<IUnitOfWork>();
        var mediator = scope.ServiceProvider.GetRequiredService<IMediator>();
        
        var emailSenderMock = scope.ServiceProvider.GetRequiredService<Mock<IEmailSender>>();
        emailSenderMock.Reset();
        
        var signalRMock = scope.ServiceProvider.GetRequiredService<Mock<INotificationContext>>();
        signalRMock.Reset();
        
        var invitationRequest = new InviteMemberCommand(0, "test@invite.com", "", "");

        using var hmac = new HMACSHA512();
        const string password = "test";
        var teamMember = new User
        {
            Email = "invite@member.com",
            PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password)),
            PasswordSalt = hmac.Key,
            TeamId = User.TeamId,
            Role = Role.Manager
        };
        
        await unitOfWork.UserRepository.Add(teamMember, Ct);
        await unitOfWork.SaveChanges(Ct);
        
        var loginUserResponse = await mediator.Send(new LoginUserCommand(teamMember.Email, password));
        
        //Act
        var request = new HttpRequestMessage(HttpMethod.Post, "api/user/");
        request.Headers.Add("Authorization", "Bearer " + loginUserResponse.AccessToken);
        request.Content = JsonContent.Create(invitationRequest);
        var response = await HttpClient.SendAsync(request, Ct);

        //Assert
        response.StatusCode.Should().Be(HttpStatusCode.Forbidden);
        signalRMock.Verify(x => x.SendToUser(It.IsAny<int>(), It.IsAny<SignalRType>()), Times.Never);
        emailSenderMock.Verify(x => x.Send(It.IsAny<string>(), 
            It.IsAny<string>(), 
            It.IsAny<string>(), 
            It.IsAny<CancellationToken>()), Times.Never);
    }
    
    [Test]
    public async Task UpdatePasswordTest()
    {
        //Arrange
        const string newPassword = "newPassword1!";
        using var scope = ServiceProvider.CreateScope();
        
        var mediator = scope.ServiceProvider.GetRequiredService<IMediator>();
        var registerCommand = new RegisterUserCommand
        {
            Email = "test@change.password",
            FirstName = "test",
            LastName = "test",
            Password = "PassToChange1!"
        };
        await mediator.Send(registerCommand);

        var token = await mediator.Send(new LoginUserCommand(registerCommand.Email, registerCommand.Password));
        var command = new UpdatePasswordCommand(User.Id, registerCommand.Password, newPassword);
        
        //Act
        var request = new HttpRequestMessage(HttpMethod.Put, "api/user/change-password");
        request.Headers.Add("Authorization", "Bearer " + token.AccessToken);
        request.Content = JsonContent.Create(command);
        var response = await HttpClient.SendAsync(request, Ct);

        //Assert
        response.EnsureSuccessStatusCode();

        var oldPasswordLoginCommmand = new LoginUserCommand(registerCommand.Email, registerCommand.Password);
        response = await HttpClient.PostAsJsonAsync("api/auth/login", oldPasswordLoginCommmand);
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);

        var newPasswordLoginCommmand = new LoginUserCommand(registerCommand.Email, newPassword);
        response = await HttpClient.PostAsJsonAsync("api/auth/login", newPasswordLoginCommmand);
        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }
}