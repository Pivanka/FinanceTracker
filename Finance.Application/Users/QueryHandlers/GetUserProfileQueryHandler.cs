using Finance.Application.Common.Interfaces;
using Finance.Application.Common.Models;
using MediatR;

namespace Finance.Application.Users.QueryHandlers;

public record GetUserProfileQuery(int UserId) : IRequest<UserProfile>;

public class GetUserProfileQueryHandler(IUnitOfWork unitOfWork) : IRequestHandler<GetUserProfileQuery, UserProfile>
{
    public async Task<UserProfile> Handle(GetUserProfileQuery request, CancellationToken cancellationToken)
    {
        var user = await unitOfWork.UserRepository.FirstOrDefault(x => x.Id == request.UserId, cancellationToken);
        if (user is null)
        {
            throw new ArgumentException();
        }

        return new UserProfile
        {
            Id = user.Id,
            FirstName = user.FirstName,
            Email = user.Email,
            Avatar = user.Avatar,
            LastName = user.LastName,
            Role = user.Role
        };
    }
}