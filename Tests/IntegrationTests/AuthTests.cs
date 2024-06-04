using System.Net;
using System.Net.Http.Json;
using Finance.Application.Common.Models;
using Finance.Application.Users.CommandHandlers;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Tests.IntegrationTests;

public class AuthTests : BaseTestFixture
{
    [Test]
    public async Task LoginSuccessTest()
    {
        //Arrange
        var request = new LoginUserCommand("test@test.com", "Test");
        
        //Act
        var response = await HttpClient.PostAsJsonAsync("api/auth/login", request);

        //Assert
        response.EnsureSuccessStatusCode();
        
        response.Should().NotBeNull();
        var result = await response.Content.ReadFromJsonAsync<AuthResponse>();
        result.Should().NotBeNull();
        result!.AccessToken.Should().NotBeNullOrEmpty();
        result!.RefreshToken.Should().NotBeNullOrEmpty();
    }
    
    [Test]
    public async Task LoginFailTest()
    {
        //Arrange
        var request = new LoginUserCommand("test@test.com", "wrong_password");

        //Act
        var response = await HttpClient.PostAsJsonAsync("api/auth/login", request);

        //Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }
    
    
    [Test]
    public async Task RegistrationTest()
    {
        //Arrange
        var request = new RegisterUserCommand()
        {
            Email = "test@gmail.com",
            Password = "TestStrong12!",
            FirstName = "Test",
            LastName = "Test",
            Currency = "UAH"
        };

        //Act
        var response = await HttpClient.PostAsJsonAsync("api/auth/register", request);

        //Assert
        response.EnsureSuccessStatusCode();
        var registeredUser = await response.Content.ReadFromJsonAsync<AuthResponse>();
        registeredUser.Should().NotBeNull();
        registeredUser!.AccessToken.Should().NotBeNullOrEmpty();
        registeredUser!.RefreshToken.Should().NotBeNull();

        var loginRequest = new LoginUserCommand(request.Email, request.Password);

        var loginResponse = await HttpClient.PostAsJsonAsync("api/auth/login", loginRequest);

        loginResponse.EnsureSuccessStatusCode();
    }

    [Test]
    public async Task RegistrationWithExistingEmail()
    {
        //Arrange
        var request = new RegisterUserCommand()
        {
            Email = "test@test.com",
            Password = "Test12!",
            FirstName = "Test",
            LastName = "Test",
            Currency = "UAH"
        };

        //Act
        var response = await HttpClient.PostAsJsonAsync("api/auth/register", request);
        
        //Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var errorResponse = await response.Content.ReadFromJsonAsync<ValidationProblemDetails>();
        errorResponse.Should().NotBeNull();
        errorResponse!.Status.Should().Be(StatusCodes.Status400BadRequest);
        errorResponse.Errors.Should().NotBeNullOrEmpty();
        errorResponse.Errors["Email"].Should().NotBeNullOrEmpty();
    }
    
    [Test]
    public async Task AccessTokenSuccessTest()
    {
        //Arrange
        var token = await GetToken();
        
        //Act
        var apiRes = await GetSecureApiResponse(token.AccessToken);
        
        //Assert
        apiRes.Should().NotBeNull();
        apiRes.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Test]
    public async Task AccessTokenFailureTest()
    {
        //Act
        var apiRes = await GetSecureApiResponse("");
        
        //Assert
        apiRes.Should().NotBeNull();
        apiRes.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Test]
    public async Task AccessTokenExpireTest()
    {
        //Arrange
        var token = await GetToken();
        await Task.Delay(12000);

        //Act
        var apiRes = await GetSecureApiResponse(token.AccessToken);
        
        //Assert
        apiRes.Should().NotBeNull();
        apiRes.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Test]
    public async Task RefreshTokenTest()
    {
        //Arrange
        var token = await GetToken();
        await Task.Delay(12000);
        
        //Act
        var response = await GetRefreshToken(new RefreshTokenCommand(token.AccessToken, token.RefreshToken));
        
        //Assert
        response.Should().NotBeNull();
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var result = await response.Content.ReadFromJsonAsync<AuthResponse>();
        result.Should().NotBeNull();
        var apiRes = await GetSecureApiResponse(result!.AccessToken);
        apiRes.Should().NotBeNull();
        apiRes.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Test]
    public async Task RefreshTokenExpireTest()
    {
        //Arrange
        var token = await GetToken();
        await Task.Delay(22000);
        
        //Act
        var response = await GetRefreshToken(new RefreshTokenCommand(token.AccessToken, token.RefreshToken));
        
        //Assert
        response.Should().NotBeNull();
        response.StatusCode.Should().Be(HttpStatusCode.InternalServerError);
    }
    
    private async Task<HttpResponseMessage> GetSecureApiResponse(string accessToken)
    {
        HttpRequestMessage request = new(HttpMethod.Get, "api/user/profile");
        request.Headers.Add("Authorization", "Bearer " + accessToken);
        return await HttpClient.SendAsync(request);
    }
}