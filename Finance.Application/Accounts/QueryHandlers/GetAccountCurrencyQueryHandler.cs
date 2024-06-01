using Finance.Application.Common.Exceptions;
using Finance.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Finance.Application.Accounts.QueryHandlers;

public record GetAccountCurrencyQuery(int UserId, int AccountId) : IRequest<string>;

public class GetAccountCurrencyQueryHandler(IUnitOfWork unitOfWork)
    : IRequestHandler<GetAccountCurrencyQuery, string>
{
    public async Task<string> Handle(GetAccountCurrencyQuery request, CancellationToken cancellationToken)
    {
        var user = await unitOfWork.UserRepository.FirstOrDefault(x => x.Id == request.UserId, cancellationToken);
        if (user is null)
        {
            throw new NotFoundException("User not found");
        }

        var account = await unitOfWork.AccountRepository.Query()
            .Where(x => x.Id == request.AccountId && x.TeamId == user.TeamId)
            .FirstOrDefaultAsync(cancellationToken);

        return account?.Currency ?? string.Empty;
    }
}