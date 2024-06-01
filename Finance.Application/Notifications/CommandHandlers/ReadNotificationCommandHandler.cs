using Finance.Application.Common.Exceptions;
using Finance.Application.Common.Interfaces;
using MediatR;

namespace Finance.Application.Notifications.CommandHandlers;

public record ReadNotificationCommand(int UserId, int NotificationId) : IRequest;

public class ReadNotificationCommandHandler(IUnitOfWork unitOfWork) : IRequestHandler<ReadNotificationCommand>
{
    public async Task<Unit> Handle(ReadNotificationCommand request, CancellationToken cancellationToken)
    {
        var notification = await unitOfWork.NotificationRepository.FirstOrDefault(x => x.UserId == request.UserId
            && x.Id == request.NotificationId, cancellationToken);
        if (notification is null)
        {
            throw new NotFoundException();
        }

        notification.IsRead = true;

        await unitOfWork.NotificationRepository.Update(notification, cancellationToken);
        await unitOfWork.SaveChanges(cancellationToken);

        return new Unit();
    }
}