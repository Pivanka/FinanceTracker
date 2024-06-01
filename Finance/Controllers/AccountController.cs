using Finance.Application.Accounts.CommandHandlers;
using Finance.Application.Accounts.QueryHandlers;
using Finance.Application.Common.Models.Pagination;
using Finance.Domain.Entities;
using Finance.Models;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Finance.Controllers;

[Authorize]
public class AccountController(IMediator mediator) : BaseController
{
    [HttpGet]
    public async Task<IActionResult> GetAllAccounts(CancellationToken cancellationToken)
    {
        return Ok(await mediator.Send(new GetAllAccountsQuery(UserId), cancellationToken));
    }
    
    [HttpPost]
    public async Task<IActionResult> AddAccount([FromBody] AddAccountModel request, CancellationToken cancellationToken)
    {
        return Ok(await mediator.Send(new AddAccountCommand(UserId, request.Title, request.Icon, request.Currency), cancellationToken));
    }
    
    [HttpPut]
    public async Task<IActionResult> UpdateAccount([FromBody] EditAccountModel request, CancellationToken cancellationToken)
    {
        if (UserRole is not (Role.Admin or Role.Manager)) return Forbid();
        
        return Ok(await mediator.Send(new EditAccountCommand(UserId, request.Id, request.Title, request.Icon), cancellationToken));
    }
    
    [HttpGet]
    [Route("{id}/currency")]
    public async Task<IActionResult> GetAccountCurrency(int id, CancellationToken cancellationToken)
    {
        return Ok(await mediator.Send(new GetAccountCurrencyQuery(UserId, id), cancellationToken));
    }
    
    [HttpPost("info")]
    public async Task<IActionResult> GetAccountsInfo([FromQuery] string? search,
        [FromBody] ICollection<Filter> filters,
        CancellationToken cancellationToken)
    {
        return Ok(await mediator.Send(new GetAccountsInfoQuery(UserId, search) { Filter = filters }, cancellationToken));
    }
    
    [HttpDelete]
    [Route("{id}")]
    public async Task<IActionResult> DeleteAccount(int id, CancellationToken cancellationToken)
    {
        if (UserRole is not Role.Admin) return Forbid();
        
        await mediator.Send(new DeleteAccountCommand(UserId, id), cancellationToken);
        return Ok();
    }
}