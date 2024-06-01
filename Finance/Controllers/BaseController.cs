using System.Security.Claims;
using Finance.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace Finance.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BaseController : ControllerBase
{
    protected int UserId =>
        !User.Identity!.IsAuthenticated ? 0 : int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
    protected Role UserRole => GetRole();
    private Role GetRole()
    {
        try
        {
            return (Role)Enum.Parse(typeof(Role), (User.FindFirst(ClaimTypes.Role)?.Value ?? "Empty")!);
        }
        catch 
        {
            return Role.Empty;
        }
    }
}