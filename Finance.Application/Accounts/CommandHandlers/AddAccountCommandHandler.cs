using Finance.Application.Common.Enums;
using Finance.Application.Common.Exceptions;
using Finance.Application.Common.Interfaces;
using Finance.Domain.Entities;
using MediatR;

namespace Finance.Application.Accounts.CommandHandlers;

public record AddAccountCommand(int UserId, string Title, string Icon, string Currency) : IRequest;

public class AddAccountCommandHandler(ITeamMemberNotificationSender notificationSender, IUnitOfWork unitOfWork)
    : IRequestHandler<AddAccountCommand>
{
    public async Task<Unit> Handle(AddAccountCommand request, CancellationToken cancellationToken)
    {
        var user = await unitOfWork.UserRepository.FirstOrDefault(x => x.Id == request.UserId, cancellationToken);
        if (user is null)
        {
            throw new NotFoundException("User not found");
        }
        
        var newAccount = new Account
        {
            TeamId = user.TeamId,
            Icon = request.Icon,
            Title = request.Title,
            Currency = request.Currency
        };

        await unitOfWork.AccountRepository.Add(newAccount, cancellationToken);
        await unitOfWork.SaveChanges(cancellationToken);
        
        await notificationSender.Send(user.Id, user.TeamId, SignalRType.Account, cancellationToken);

        return new Unit();
    }
}