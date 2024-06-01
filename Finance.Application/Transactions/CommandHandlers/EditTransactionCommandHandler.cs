using Finance.Application.Common.Exceptions;
using Finance.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Finance.Application.Transactions.CommandHandlers;

public record EditTransactionCommand() : IRequest
{
    public int UserId { get; init; }
    public int AccountId { get; init; }
    public int TransactionId { get; init; }
    public decimal Amount { get; init; }
    public string Currency { get; init; } = null!;
    public string? Note { get; init; }
    public int? CategoryId { get; init; }
    public int? CustomCategoryId { get; init; }
}

public class EditTransactionCommandHandler(IUnitOfWork unitOfWork) : IRequestHandler<EditTransactionCommand>
{
    public async Task<Unit> Handle(EditTransactionCommand request, CancellationToken cancellationToken)
    {
        var user = await unitOfWork.UserRepository.FirstOrDefault(x => x.Id == request.UserId, cancellationToken);
        if (user is null)
        {
            throw new NotFoundException("User not found");
        }

        var transaction =
            await unitOfWork.TransactionRepository
                .Query()
                .Include(x => x.Account)
                .FirstOrDefaultAsync(x => x.Id == request.TransactionId && 
                                          x.Account.TeamId == user.TeamId && 
                                          x.AccountId == request.AccountId, cancellationToken);
        if (transaction is null)
        {
            throw new NotFoundException("Transaction not found");
        }
        
        transaction.AccountId = request.AccountId;
        transaction.Amount = request.Amount;
        transaction.CategoryId = request.CategoryId;
        transaction.CustomCategoryId = request.CustomCategoryId;
        transaction.Currency = request.Currency;
        transaction.Note = request.Note;

        await unitOfWork.TransactionRepository.Update(transaction, cancellationToken);
        await unitOfWork.SaveChanges(cancellationToken);

        return new Unit();
    }
}