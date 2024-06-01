using Finance.Application.Common.Exceptions;
using Finance.Application.Common.Interfaces;
using Finance.Application.Common.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Finance.Application.Users.QueryHandlers;

public record GetUserMembersQuery(int UserId) : IRequest<IEnumerable<UserModel>>;

public class GetUserMembersQueryHandler(IUnitOfWork unitOfWork) : IRequestHandler<GetUserMembersQuery, IEnumerable<UserModel>>
{
    public async Task<IEnumerable<UserModel>> Handle(GetUserMembersQuery request, CancellationToken cancellationToken)
    {
        var user = await unitOfWork.UserRepository.FirstOrDefault(x => x.Id == request.UserId, cancellationToken);
        if (user is null)
        {
            throw new NotFoundException();
        }

        var members = await unitOfWork.UserRepository.Query()
            .Where(x => x.TeamId == user.TeamId && x.Id != user.Id)
            .ToListAsync(cancellationToken);

        return members.Select(x => new UserModel
        {
            Id = x.Id,
            FirstName = x.FirstName,
            LastName = x.LastName,
            Email = x.Email,
            Invited = x.Invited,
            Icon = x.Avatar,
            Role = x.Role
        });
    }
}