using Finance.Application.Transactions.QueryHandlers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Finance.Controllers;

[Authorize]
public class DashboardController(IMediator mediator) : BaseController
{
    [HttpGet]
    public async Task<IActionResult> GetBalance(CancellationToken cancellationToken)
    {
        return Ok(await mediator.Send(new GetBalanceQuery(UserId), cancellationToken));
    }
}