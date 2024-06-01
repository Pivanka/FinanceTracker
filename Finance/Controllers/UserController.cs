using Finance.Application.Common.Models;
using Finance.Application.Users.CommandHandlers;
using Finance.Application.Users.QueryHandlers;
using Finance.Domain.Entities;
using Finance.Models;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Finance.Controllers;

[Authorize]
public class UserController(IMediator mediator) : BaseController
{
    [HttpPost]
    public async Task<IActionResult> InviteUser([FromBody] InviteMemberCommand command, CancellationToken cancellationToken)
    {
        if (UserRole is not Role.Admin) return Forbid();
        
        await mediator.Send(command with { UserId = UserId }, cancellationToken);

        return Ok();
    }
    
    [HttpGet]
    public async Task<IActionResult> GetMembers(CancellationToken cancellationToken)
    {
        return Ok(await mediator.Send(new GetUserMembersQuery(UserId), cancellationToken));
    }
    
    [HttpPut("{id:int}/resend-email")]
    public async Task<IActionResult> ResendInvitation(int id, CancellationToken cancellationToken)
    {
        if (UserRole is not Role.Admin) return Forbid();
        
        await mediator.Send(new ResendInvitationCommand(UserId, id), cancellationToken);

        return Ok();
    }
    
    [HttpPut("change-password")]
    public async Task<IActionResult> UpdatePassword([FromBody] UpdatePasswordCommand request, CancellationToken cancellationToken)
    {
        return Ok(await mediator.Send(request with { UserId = UserId }, cancellationToken));
    }
    
    [HttpGet("profile")]
    public async Task<IActionResult> GetUserProfile(CancellationToken cancellationToken)
    {
        return Ok(await mediator.Send(new GetUserProfileQuery(UserId), cancellationToken));
    }
    
    [HttpPut("profile")]
    public async Task<IActionResult> UpdateUserProfile(UserProfile profile, CancellationToken cancellationToken)
    {
        return Ok(await mediator.Send(new UpdateUserProfileCommand(UserId, profile), cancellationToken));
    }
    
    [HttpPost("{id:int}/role")]
    public async Task<IActionResult> UpdateUserRole([FromBody] Role role, int id, CancellationToken cancellationToken)
    {
        if (UserRole is not Role.Admin) return Forbid();
        
        await mediator.Send(new UpdateUserRoleCommand(id, role), cancellationToken);

        return Ok();
    }
    
    [HttpGet("currency")]
    public async Task<IActionResult> GetCurrency(CancellationToken cancellationToken)
    {
        var currency = await mediator.Send(new GetCurrencyQuery(UserId), cancellationToken);
        return Ok(new CurrencyResult(currency));
    }
    
    [HttpPut("change-currency/{currency}")]
    public async Task<IActionResult> ChangeCurrency(string currency, CancellationToken cancellationToken)
    {
        if (UserRole is not Role.Admin) return Forbid();
        
        await mediator.Send(new UpdateCurrencyCommand(UserId, currency), cancellationToken);

        return Ok();
    }
}