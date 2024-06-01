using Finance.Application.Categories.CommandHandlers;
using Finance.Application.CustomCategories.CommandHandlers;
using Finance.Application.CustomCategories.QueryHandlers;
using Finance.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Finance.Controllers;

public class CustomCategoryController(IMediator mediator) : BaseController
{
    [HttpPost]
    public async Task<IActionResult> AddCustomCategory([FromBody] AddCategoryCommand model, CancellationToken cancellationToken)
    {
        return Ok(await mediator.Send(new AddCustomCategoryCommand(UserId, model.Title, model.Icon, model.Type, model.Color), cancellationToken));
    }
    
    [HttpGet]
    public async Task<IActionResult> GetCustomCategories(CancellationToken cancellationToken)
    {
        return Ok(await mediator.Send(new GetCustomCategoriesQuery(UserId), cancellationToken));
    }
    
    [HttpDelete]
    [Route("{id:int}")]
    public async Task<IActionResult> DeleteCustomCategory(int id, CancellationToken cancellationToken)
    {
        if (UserRole is not Role.Admin) return Forbid();
        
        await mediator.Send(new DeleteCustomCategoryCommand(UserId, id), cancellationToken);
        return Ok();
    }
    
    [HttpPut]
    public async Task<IActionResult> EditCustomCategory([FromBody] EditCustomCategoryCommand model, CancellationToken cancellationToken)
    {
        if (UserRole is not (Role.Admin or Role.Manager)) return Forbid();
        
        return Ok(await mediator.Send(model, cancellationToken));
    }
}