using Finance.Application.Common.Enums;
using Finance.Application.Common.Exceptions;
using Finance.Application.Common.Interfaces;
using Finance.Domain.Entities;
using MediatR;

namespace Finance.Application.Transactions.CommandHandlers;

public class AddTransactionsCommand : IRequest
{
    public int UserId { get; set; }
    public int AccountId { get; set; }
    public IEnumerable<AddTransactionCommand> Transactions { get; set; } = [];
}

public class AddTransactionsCommandHandler(IUnitOfWork unitOfWork, ITeamMemberNotificationSender notificationSender) : IRequestHandler<AddTransactionsCommand>
{
    public async Task<Unit> Handle(AddTransactionsCommand request, CancellationToken cancellationToken)
    {
        var user = await unitOfWork.UserRepository.FirstOrDefault(x => x.Id == request.UserId, cancellationToken);
        if (user is null)
        {
            throw new NotFoundException("User not found");
        }
        
        var account = await unitOfWork.AccountRepository
            .FirstOrDefault(x => x.Id == request.AccountId && x.TeamId == user.TeamId, cancellationToken);
        if (account is null)
        {
            throw new NotFoundException("Account not found");
        }

        var newTransactions = request.Transactions.Select(x =>
        {
            var transaction = new Transaction
            {
                AccountId = account.Id,
                Amount = x.Amount,
                CategoryId = x.CategoryId,
                CustomCategoryId = x.CustomCategoryId,
                Currency = x.Currency,
                Note = x.Note,
                Type = x.Type,
                ExchangeRate = x.ExchangeRate ?? 1,
                Date = x.Date ?? DateTime.UtcNow
            };

            if (transaction.CategoryId is null && transaction.CustomCategoryId is null)
            {
                transaction.CategoryId = transaction.Type is TransactionType.Income ? 18 : 19;
            }

            return transaction;
        });

        await unitOfWork.TransactionRepository.Add(newTransactions, cancellationToken);
        await unitOfWork.SaveChanges(cancellationToken);
        
        await notificationSender.Send(user.Id, user.TeamId, SignalRType.Transaction, cancellationToken);

        return new Unit();
    }
}