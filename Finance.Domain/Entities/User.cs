using Finance.Domain.Common;

namespace Finance.Domain.Entities;

public class User : BaseEntity
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string Email { get; set; } = null!;
    public byte[] PasswordHash { get; set; } = null!;
    public byte[] PasswordSalt { get; set; } = null!;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public string? RefreshToken { get; set; }
    public DateTime RefreshTokenExpiry { get; set; }
    
    public Team? Team { get; set; }
    public int TeamId { get; set; }

    public bool Invited { get; set; }
    public string? Avatar { get; set; }
    public Role Role { get; set; }
}