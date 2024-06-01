using System.Security.Cryptography;
using System.Text;
using Finance.Application.Common.Exceptions;
using Finance.Application.Common.Interfaces;
using MediatR;

namespace Finance.Application.Users.CommandHandlers;

public record UpdatePasswordCommand(int UserId, string OldPassword, string NewPassword) : IRequest;

public class UpdatePasswordCommandHandler(IUnitOfWork unitOfWork) : IRequestHandler<UpdatePasswordCommand>
{
    public async Task<Unit> Handle(UpdatePasswordCommand request, CancellationToken cancellationToken)
    {
        var user = await unitOfWork.UserRepository.FirstOrDefault(x => x.Id == request.UserId, cancellationToken);
        if (user is null)
        {
            throw new NotFoundException();
        }
        
        using var hmac = new HMACSHA512(user.PasswordSalt);
        var oldPasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(request.OldPassword));
        if (user.PasswordHash.Where((t, i) => t != oldPasswordHash[i]).Any())
        {
            throw new ValidationException(new Dictionary<string, string[]>
            {
                { "Password", ["Old password is incorrect."] }
            });
        }

        user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(request.NewPassword));
        user.PasswordSalt = hmac.Key;
        
        await unitOfWork.UserRepository.Update(user, cancellationToken);
        await unitOfWork.SaveChanges(cancellationToken);

        return new Unit();
    }
}