using System.Security.Cryptography;
using System.Text;
using Finance.Application.Common.Interfaces;
using Finance.Application.Common.Models;
using Finance.Domain.Entities;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Finance.Application.Users.CommandHandlers;

public record RegisterUserCommand : IRequest<AuthResponse>
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
}

public class RegisterUserCommandHandler(
    IUnitOfWork unitOfWork,
    ITokenGenerator tokenGenerator,
    TokenSettings settings)
    : IRequestHandler<RegisterUserCommand, AuthResponse>
{
    public async Task<AuthResponse> Handle(RegisterUserCommand request, CancellationToken cancellationToken)
    {
        using var hmac = new HMACSHA512();

        var userToRegister = new User
        {
            Email = request.Email,
            FirstName = request.FirstName,
            LastName = request.LastName,
            PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(request.Password)),
            PasswordSalt = hmac.Key,
            Team = new Team(),
            Role = Role.Admin
        };

        var registeredUser = await unitOfWork.UserRepository.Add(userToRegister, cancellationToken);
        await unitOfWork.SaveChanges(cancellationToken);

        var account = new Account
        {
            TeamId = registeredUser.TeamId,
            Title = "Default",
        };
        await unitOfWork.AccountRepository.Add(account, cancellationToken);
        await unitOfWork.SaveChanges(cancellationToken);
        
        var token = tokenGenerator.Generate(registeredUser);

        registeredUser.RefreshToken = token.RefreshToken;
        registeredUser.RefreshTokenExpiry = DateTime.UtcNow.AddSeconds(settings.RefreshTokenExpireSeconds);

        await unitOfWork.UserRepository.Update(registeredUser, cancellationToken);
        await unitOfWork.SaveChanges(cancellationToken);

        return token;
    }
}

public class RegisterUserCommandValidator : AbstractValidator<RegisterUserCommand> 
{
    public RegisterUserCommandValidator(IRepository<User> userRepository)
    {
        RuleFor(x => x.Email)
            .EmailAddress()
            .MustAsync(async (x, ct) =>
            {
                return !await userRepository.Query()
                           .AnyAsync(c => c.Email == x, ct);
            })
            .WithMessage("This email is already taken");
        
        RuleFor(p => p.Password)
            .MinimumLength(8).WithMessage("Your password length must be at least 8.")
            .Matches("[A-Z]+").WithMessage("Your password must contain at least one uppercase letter.")
            .Matches("[a-z]+").WithMessage("Your password must contain at least one lowercase letter.")
            .Matches("[0-9]+").WithMessage("Your password must contain at least one number.")
            .Matches(@"[\!\?\*\.]*$").WithMessage("Your password must contain at least one (!? *.).");
    }
}