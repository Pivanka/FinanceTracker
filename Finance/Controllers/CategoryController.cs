using Finance.Application.Categories.CommandHandlers;
using Finance.Application.Categories.QueryHandlers;
using Finance.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Finance.Controllers;

public class CategoryController(IMediator mediator) : BaseController
{
    [HttpPost]
    public async Task<IActionResult> AddCategory([FromBody] AddCategoryCommand model, CancellationToken cancellationToken)
    {
        return Ok(await mediator.Send(model, cancellationToken));
    }
    
    [HttpGet]
    [Route("{type}")]
    public async Task<IActionResult> GetCategories(TransactionType type, CancellationToken cancellationToken)
    {
        return Ok(await mediator.Send(new GetCategoriesQuery(type), cancellationToken));
    }
    
    [HttpGet]
    public async Task<IActionResult> GetCategories(CancellationToken cancellationToken)
    {
        return Ok(await mediator.Send(new GetAllCategoriesQuery(), cancellationToken));
    }
}