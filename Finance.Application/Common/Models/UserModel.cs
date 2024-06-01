using Finance.Domain.Entities;

namespace Finance.Application.Common.Models;

public class UserModel
{
    public int Id { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string Email { get; set; } = null!;
    public bool Invited { get; set; }
    public string? Icon { get; set; }
    public Role Role { get; set; }
}