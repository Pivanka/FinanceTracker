using Finance.Application.Common.Exceptions;
using Finance.Application.Common.Interfaces;
using Finance.Application.Common.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Finance.Application.Accounts.QueryHandlers;

public record GetAllAccountsQuery(int UserId) : IRequest<IEnumerable<AccountModel>>;

public class GetAllAccountsQueryHandler(IUnitOfWork unitOfWork)
    : IRequestHandler<GetAllAccountsQuery, IEnumerable<AccountModel>>
{
    public async Task<IEnumerable<AccountModel>> Handle(GetAllAccountsQuery request, CancellationToken cancellationToken)
    {
        var user = await unitOfWork.UserRepository.FirstOrDefault(x => x.Id == request.UserId, cancellationToken);
        if (user is null)
        {
            throw new NotFoundException("User not found");
        }
        
        var accounts = await unitOfWork.AccountRepository.Query()
            .Where(x => x.TeamId == user.TeamId && !x.IsDeleted)
            .ToListAsync(cancellationToken);
        
        return accounts.Select(x => new AccountModel
        {
            Id = x.Id,
            Title = x.Title,
            Icon = x.Icon,
            Currency = x.Currency
        })!;
    }
}