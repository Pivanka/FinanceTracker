using Finance.Application.Common.Exceptions;
using Finance.Application.Common.Interfaces;
using Finance.Application.Common.Models;
using MediatR;

namespace Finance.Application.Users.CommandHandlers;

public record UpdateUserProfileCommand(int UserId, UserProfile Profile) : IRequest;

public class UpdateUserProfileCommandHandler(IUnitOfWork unitOfWork) : IRequestHandler<UpdateUserProfileCommand>
{
    public async Task<Unit> Handle(UpdateUserProfileCommand request, CancellationToken cancellationToken)
    {
        var user = await unitOfWork.UserRepository.FirstOrDefault(x => x.Id == request.UserId, cancellationToken);
        if (user is null)
        {
            throw new NotFoundException();
        }

        user.FirstName = request.Profile.FirstName;
        user.LastName = request.Profile.LastName;
        user.Avatar = request.Profile.Avatar;
        
        await unitOfWork.UserRepository.Update(user, cancellationToken);
        await unitOfWork.SaveChanges(cancellationToken);

        return new Unit();
    }
}