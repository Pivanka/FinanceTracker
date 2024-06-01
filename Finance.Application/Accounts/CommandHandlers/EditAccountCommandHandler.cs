using Finance.Application.Common.Exceptions;
using Finance.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Finance.Application.Accounts.CommandHandlers;

public record EditAccountCommand(int UserId, int Id, string Title, string Icon) : IRequest;

public class EditAccountCommandHandler(IUnitOfWork unitOfWork) : IRequestHandler<EditAccountCommand>
{
    public async Task<Unit> Handle(EditAccountCommand request, CancellationToken cancellationToken)
    {
        var account = await unitOfWork.AccountRepository
            .Query()
            .Include(x => x.Team)
            .ThenInclude(x => x!.Users)
            .FirstOrDefaultAsync(x => x.Id == request.Id && x.Team!.Users.Select(y => y.Id).Contains(request.UserId), cancellationToken);
        if (account == null)
        {
            throw new NotFoundException("Account not found");
        }

        account.Title = request.Title;
        account.Icon = request.Icon;

        await unitOfWork.AccountRepository.Update(account, cancellationToken);
        await unitOfWork.SaveChanges(cancellationToken);

        return new Unit();
    }
}