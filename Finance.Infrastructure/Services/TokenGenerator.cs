using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Finance.Application.Common.Interfaces;
using Finance.Application.Common.Models;
using Finance.Domain.Entities;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Finance.Infrastructure.Services;

public class TokenGenerator : ITokenGenerator
{
    private readonly TokenSettings _settings;
    private readonly SymmetricSecurityKey _key;

    public TokenGenerator(TokenSettings settings)
    {
        _settings = settings;
        _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(settings.Secret));
    }
    
    public AuthResponse Generate(User user)
    {
        var claims = new List<Claim>
        {
            new (ClaimsIdentity.DefaultNameClaimType, user.Email),
            new (ClaimTypes.NameIdentifier, user.Id.ToString()),
            new (ClaimTypes.Role, (user.Role).ToString()),
        };

        var credentials = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Issuer = _settings.Issuer,
            Audience = _settings.Audience,
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddSeconds(_settings.TokenExpireSeconds),
            SigningCredentials = credentials
        };

        var tokenHandler = new JwtSecurityTokenHandler();

        var token = tokenHandler.CreateToken(tokenDescriptor);

        return new AuthResponse
        {
            AccessToken = tokenHandler.WriteToken(token),
            Expiration = token.ValidTo,
            RefreshToken = GenerateRefreshToken()
        };
    }

    private static string GenerateRefreshToken()
    {
        var randomNumber = new byte[64];

        using var generator = RandomNumberGenerator.Create();
        
        generator.GetBytes(randomNumber);

        return Convert.ToBase64String(randomNumber);
    }
}