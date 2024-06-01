using Finance.Application.Common.Enums;
using Finance.Application.Common.Exceptions;
using Finance.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Finance.Application.Transactions.CommandHandlers;

public record DeleteTransactionCommand(int UserId, int TransactionId) : IRequest<int>;

public class DeleteTransactionCommandHandler(IUnitOfWork unitOfWork, ITeamMemberNotificationSender notificationSender)
    : IRequestHandler<DeleteTransactionCommand, int>
{
    public async Task<int> Handle(DeleteTransactionCommand request, CancellationToken cancellationToken)
    {
        var user = await unitOfWork.UserRepository.FirstOrDefault(x => x.Id == request.UserId, cancellationToken);
        if (user is null)
        {
            throw new NotFoundException("User not found");
        }
        
        var transaction = await unitOfWork.TransactionRepository
            .Query()
            .Include(x => x.Account)
            .FirstOrDefaultAsync(x => x.Id == request.TransactionId && x.Account!.TeamId == user.TeamId, cancellationToken);
        if (transaction is null)
        {
            return 0;
        }
        
        var deletedTransactionId = await unitOfWork.TransactionRepository.Delete(transaction, cancellationToken);

        await unitOfWork.SaveChanges(cancellationToken);
        
        await notificationSender.Send(user.Id, user.TeamId, SignalRType.Transaction, cancellationToken);

        return deletedTransactionId;
    }
}