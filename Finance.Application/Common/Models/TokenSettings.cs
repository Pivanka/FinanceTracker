namespace Finance.Application.Common.Models;

public class TokenSettings
{
    public string Issuer { get; set; } = "";
    public string Audience { get; set; } = "";
    public string Secret { get; set; } = "";
    public int TokenExpireSeconds { get; set; }
    public int RefreshTokenExpireSeconds { get; set; }
}