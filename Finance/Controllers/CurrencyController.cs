using Finance.Application.Transactions.CommandHandlers;
using Finance.Infrastructure.Settings;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace Finance.Controllers;

public class CurrencyController(IOptions<CurrenciesOptions> currencies, IMediator mediator) : BaseController
{
    [HttpGet]
    public IActionResult GetCurrencies()
    {
        return Ok(currencies.Value);
    }

    [HttpPost]
    public async Task<IActionResult> CalculateAmount([FromBody] CalculateAmountCommand request,CancellationToken cancellationToken)
    {
        return Ok(await mediator.Send(request, cancellationToken));
    }
}