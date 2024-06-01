using Finance.Application.Charts.CommandHandlers;
using Finance.Application.Charts.QueryHandlers;
using Finance.Models;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Finance.Controllers;

[Authorize]
public class ReportController(IMediator mediator) : BaseController
{
    [HttpPost]
    public async Task<IActionResult> GetChart([FromBody] GetChartRequestModel request, CancellationToken cancellationToken)
    {
        return Ok(await mediator.Send(new GetChartQuery(UserId, request.Type, request.From, request.To), cancellationToken));
    }
    
    [HttpPost("optimizing")]
    public async Task<IActionResult> Optimize(OptimizeBudget model, CancellationToken ct)
    {
        return Ok(await mediator.Send(new OptimizeBudgetCommand
            { UserId = UserId, Budget = model.Budget, Items = model.Items }, ct));
    }
}