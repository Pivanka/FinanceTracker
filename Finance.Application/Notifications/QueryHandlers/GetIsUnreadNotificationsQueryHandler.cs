using Finance.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Finance.Application.Notifications.QueryHandlers;

public record GetIsUnreadNotificationsQuery(int UserId) : IRequest<bool>;

public class GetIsUnreadNotificationsQueryHandler(IUnitOfWork unitOfWork)
    : IRequestHandler<GetIsUnreadNotificationsQuery, bool>
{
    public async Task<bool> Handle(GetIsUnreadNotificationsQuery request, CancellationToken cancellationToken)
    {
        return await unitOfWork.NotificationRepository.Query()
            .Where(x => x.UserId == request.UserId)
            .AnyAsync(x => !x.IsRead, cancellationToken);
    }
}