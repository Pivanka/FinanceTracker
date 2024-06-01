using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Finance.Application.Common.Interfaces;
using Finance.Application.Common.Models;
using MediatR;
using Microsoft.IdentityModel.Tokens;

namespace Finance.Application.Users.CommandHandlers;

public record RefreshTokenCommand(string AccessToken, string RefreshToken) : IRequest<AuthResponse>;

public class RefreshTokenCommandHandler(
    IUnitOfWork unitOfWork,
    ITokenGenerator tokenGenerator,
    TokenSettings settings)
    : IRequestHandler<RefreshTokenCommand, AuthResponse>
{
    public async Task<AuthResponse> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
    {
        var tokenHandler = new JwtSecurityTokenHandler();

        var tokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = settings.Issuer,
            ValidateAudience = true,
            ValidAudience = settings.Audience,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(settings.Secret)),
            ValidateLifetime = false
        };
        
        var principal = tokenHandler.ValidateToken(request.AccessToken, tokenValidationParameters, out var validatedToken);
        if (principal?.Identity?.Name is null)
            throw new ArgumentException();
        
        if (validatedToken is JwtSecurityToken jwtSecurityToken) {
            var result = jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha512, StringComparison.InvariantCultureIgnoreCase);
            if (result == false)
            {
                throw new ArgumentException();
            }
        }

        var user = await unitOfWork.UserRepository.FirstOrDefault(x => x.RefreshToken == request.RefreshToken &&
                                                        x.Email == principal.Identity.Name, cancellationToken);

        if (user is null || DateTime.UtcNow > user.RefreshTokenExpiry)
        {
            throw new ArgumentException();
        }

        var token = tokenGenerator.Generate(user);

        user.RefreshToken = token.RefreshToken;
        user.RefreshTokenExpiry = DateTime.UtcNow.AddSeconds(settings.RefreshTokenExpireSeconds);

        await unitOfWork.UserRepository.Update(user, cancellationToken);
        await unitOfWork.SaveChanges(cancellationToken);
        
        return new AuthResponse
        {
            AccessToken = token.AccessToken,
            Expiration = token.Expiration,
            RefreshToken = token.RefreshToken
        };
    }
}