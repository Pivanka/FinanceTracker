using Finance.Application.Common.Models.Pagination;
using Finance.Application.Transactions.CommandHandlers;
using Finance.Application.Transactions.QueryHandlers;
using Finance.Domain.Entities;
using Finance.Models;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Finance.Controllers;

[Authorize]
public class TransactionController(IMediator mediator) : BaseController
{
    [HttpGet]
    public async Task<IActionResult> GetAllTransactions([FromQuery] GetPaginatedTransactionsQuery query, CancellationToken cancellationToken)
    {
        query.UserId = UserId;
        return Ok(await mediator.Send(query, cancellationToken));
    }
    
    [HttpPost]
    public async Task<IActionResult> AddTransaction([FromBody] AddTransactionModel model, CancellationToken cancellationToken)
    {
        return Ok(await mediator.Send(new AddTransactionCommand
        {
            UserId = UserId,
            AccountId = model.AccountId,
            Amount = model.Amount,
            CategoryId = model.CategoryId,
            CustomCategoryId = model.CustomCategoryId,
            Currency = model.Currency,
            Note = model.Note,
            Type = model.Type,
            ExchangeRate = model.ExchangeRate,
            Date = model.Date
        }, cancellationToken));
    }
    
    [HttpDelete]
    [Route("{id:int}")]
    public async Task<IActionResult> DeleteTransaction(int id, CancellationToken cancellationToken)
    {
        if (UserRole is not (Role.Admin or Role.Manager)) return Forbid();
        
        return Ok(await mediator.Send(new DeleteTransactionCommand(UserId, id), cancellationToken));
    }
    
    [HttpPut]
    public async Task<IActionResult> EditTransaction([FromBody] EditTransactionModel model, CancellationToken cancellationToken)
    {
        if (UserRole is not (Role.Admin or Role.Manager)) return Forbid();
        
        return Ok(await mediator.Send(new EditTransactionCommand
        {
            UserId = UserId,
            AccountId = model.AccountId,
            Amount = model.Amount,
            CategoryId = model.CategoryId,
            CustomCategoryId = model.CustomCategoryId,
            Currency = model.Currency,
            Note = model.Note,
            TransactionId = model.Id
        }, cancellationToken));
    }

    [HttpPost("paginated")]
    public async Task<IActionResult> GetPaginatedTransactions([FromBody] PaginatedRequest request, CancellationToken ct)
    {
        return Ok(await mediator.Send(new GetPaginatedDetailedTransactionsQuery
        {
            Filter = request.Filter,
            PageIndex = request.PageIndex,
            PageSize = request.PageSize,
            Search = request.Search,
            Sort = request.Sort,
            UserId = UserId
        }, ct));
    }
    
    [HttpGet("count")]
    public async Task<IActionResult> GetCounts([FromQuery] int? accountId, [FromQuery] string? search, CancellationToken ct)
    {
        return Ok(await mediator.Send(new GetTransactionCountQuery(UserId, accountId, search), ct));
    }
    
    [HttpPost("upload")]
    public async Task<IActionResult> Upload([FromBody] FileUploadModel model, CancellationToken ct)
    {
        return Ok(await mediator.Send(new UploadTransactionsFromFileCommand(model.FileContent), ct));
    }
    
    [HttpPost("bulk")]
    public async Task<IActionResult> AddTransactions([FromBody] AddTransactionsModel model, CancellationToken cancellationToken)
    {
        return Ok(await mediator.Send(new AddTransactionsCommand
        {
            Transactions = model.Transactions.Select(x => new AddTransactionCommand
            {
                UserId = UserId,
                AccountId = x.AccountId,
                Amount = x.Amount,
                CategoryId = x.CategoryId,
                CustomCategoryId = x.CustomCategoryId,
                Currency = x.Currency,
                Note = x.Note,
                Type = x.Type,
                ExchangeRate = x.ExchangeRate,
                Date = x.Date
            }),
            UserId = UserId,
            AccountId = model.AccountId
        }, cancellationToken));
    }
}