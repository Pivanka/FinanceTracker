using Finance.Application.Users.CommandHandlers;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Finance.Controllers;

public class AuthController(IMediator mediator) : BaseController
{
    [HttpPost("login")]
    public async Task<IActionResult> LoginAsync([FromBody] LoginUserCommand loginRequest, CancellationToken cancellationToken)
    {
        return Ok(await mediator.Send(loginRequest, cancellationToken));
    }

    [HttpPost("register")]
    public async Task<IActionResult> RegisterUser([FromBody] RegisterUserCommand command, CancellationToken cancellationToken)
    {
        return Ok(await mediator.Send(command, cancellationToken));
    }

    [HttpPost("refresh-token")]
    public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenCommand tokenRequest, CancellationToken cancellationToken)
    {
        return Ok(await mediator.Send(tokenRequest, cancellationToken));
    }
}