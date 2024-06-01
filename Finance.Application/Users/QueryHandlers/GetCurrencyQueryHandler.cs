using Finance.Application.Common.Exceptions;
using Finance.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Finance.Application.Users.QueryHandlers;

public record GetCurrencyQuery(int UserId) : IRequest<string>;

public class GetCurrencyQueryHandler(IUnitOfWork unitOfWork) : IRequestHandler<GetCurrencyQuery, string>
{
    public async Task<string> Handle(GetCurrencyQuery request, CancellationToken cancellationToken)
    {
        var user = await unitOfWork.UserRepository.Query()
            .Include(x => x.Team)
            .FirstOrDefaultAsync(x => x.Id == request.UserId, cancellationToken);
        if (user is null)
        {
            throw new NotFoundException();
        }

        return user.Team!.Currency;
    }
}