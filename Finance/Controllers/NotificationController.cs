using Finance.Application.Notifications.CommandHandlers;
using Finance.Application.Notifications.QueryHandlers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Finance.Controllers;

[Authorize]
public class NotificationController(IMediator mediator) : BaseController
{
    [HttpGet]
    public async Task<IActionResult> GetAllNotifications([FromQuery] GetPaginatedNotificationsQuery query, CancellationToken cancellationToken)
    {
        query.UserId = UserId;
        return Ok(await mediator.Send(query, cancellationToken));
    }
    
    [HttpGet("unread")]
    public async Task<IActionResult> IsUnreadNotifications(CancellationToken cancellationToken)
    {
        return Ok(await mediator.Send(new GetIsUnreadNotificationsQuery(UserId), cancellationToken));
    }
    
    [HttpPost("read")]
    public async Task<IActionResult> ReadNotification([FromBody] int id, CancellationToken cancellationToken)
    {
        await mediator.Send(new ReadNotificationCommand(UserId, id), cancellationToken);
        return Ok();
    }
}