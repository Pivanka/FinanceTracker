namespace Finance.Application.Common.Models;

public class AuthResponse
{
    public string AccessToken { get; set; } = null!;
    public DateTime Expiration { get; set; }
    public string RefreshToken { get; set; } = null!;
}