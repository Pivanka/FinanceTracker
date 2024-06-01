using Finance.Application.Common.Enums;
using Finance.Application.Common.Exceptions;
using Finance.Application.Common.Interfaces;
using MediatR;

namespace Finance.Application.Accounts.CommandHandlers;

public record DeleteAccountCommand(int UserId, int AccountId) : IRequest;

public class DeleteAccountCommandHandler(IUnitOfWork unitOfWork, ITeamMemberNotificationSender notificationSender)
    : IRequestHandler<DeleteAccountCommand>
{
    public async Task<Unit> Handle(DeleteAccountCommand request, CancellationToken cancellationToken)
    {
        var user = await unitOfWork.UserRepository.FirstOrDefault(x => x.Id == request.UserId, cancellationToken);
        if (user is null)
        {
            throw new NotFoundException("User not found");
        }
        
        var account = await unitOfWork.AccountRepository.FirstOrDefault(x => x.Id == request.AccountId && user.TeamId == x.TeamId, cancellationToken);
        if (account is null)
        {
            throw new NotFoundException("Account not found");
        }
        
        account.IsDeleted = true;

        await unitOfWork.AccountRepository.Update(account, cancellationToken);
        await unitOfWork.SaveChanges(cancellationToken);

        await notificationSender.Send(user.Id, user.TeamId, SignalRType.Account, cancellationToken);

        return new Unit();
    }
}