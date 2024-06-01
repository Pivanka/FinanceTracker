using Finance.Application.Common.Exceptions;
using Finance.Application.Common.Helpers;
using Finance.Application.Common.Interfaces;
using Finance.Domain.Entities;
using MediatR;

namespace Finance.Application.Users.CommandHandlers;

public record UpdateUserRoleCommand(int UserId, Role Role) : IRequest;

public class UpdateUserRoleCommandHandler(IUnitOfWork unitOfWork, INotificationContext notificationContext)
    : IRequestHandler<UpdateUserRoleCommand>
{
    public async Task<Unit> Handle(UpdateUserRoleCommand request, CancellationToken cancellationToken)
    {
        var user = await unitOfWork.UserRepository.FirstOrDefault(x => x.Id == request.UserId, cancellationToken);
        if (user is null)
        {
            throw new NotFoundException();
        }

        user.Role = request.Role;
        
        await unitOfWork.UserRepository.Update(user, cancellationToken);
        await unitOfWork.SaveChanges(cancellationToken);

        await SendNotification(user, cancellationToken);

        return new Unit();
    }
    
    private async Task SendNotification(User user, CancellationToken cancellationToken)
    {
        var message = user.Role switch
        {
            Role.Admin => NotificationHelper.ChangedRoleToAdminNotification,
            Role.Manager => NotificationHelper.ChangedRoleToManagerNotification,
            Role.Viewer => NotificationHelper.ChangedRoleToViewerNotification,
            _ => ""
        };
        
        var notification = new Notification
        {
            UserId = user.Id,
            Type = NotificationType.RoleChanged,
            Message = message
        };

        await unitOfWork.NotificationRepository.Add(notification, cancellationToken);
        await unitOfWork.SaveChanges(cancellationToken);

        await notificationContext.ReceiveNotification(user.Id); 
    }
}