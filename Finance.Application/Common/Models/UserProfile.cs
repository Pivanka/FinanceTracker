using Finance.Domain.Entities;

namespace Finance.Application.Common.Models;

public class UserProfile
{
    public int Id { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string Email { get; set; } = null!;
    public string? Avatar { get; set; }
    public Role Role { get; set; } 
}