using Finance.Application.Common.Exceptions;
using Finance.Application.Common.Interfaces;
using Finance.Application.Common.Mapping;
using Finance.Application.Common.Models;
using Finance.Application.Common.Models.Pagination;
using MediatR;

namespace Finance.Application.Notifications.QueryHandlers;

public class GetPaginatedNotificationsQuery : IRequest<PaginatedList<NotificationModel>>
{
    public int UserId { get; set; }
    public string? SearchString { get; init; }
    public int Page { get; init; }
    public int Take { get; init; }

    public bool IsDescending { get; init; } = true;
    public int? Days { get; init; }
}

public class GetPaginatedNotificationsQueryHandler(IUnitOfWork unitOfWork)
    : IRequestHandler<GetPaginatedNotificationsQuery, PaginatedList<NotificationModel>>
{
    public async Task<PaginatedList<NotificationModel>> Handle(GetPaginatedNotificationsQuery request, CancellationToken cancellationToken)
    {
        var user = await unitOfWork.UserRepository.FirstOrDefault(x => x.Id == request.UserId, cancellationToken);
        if (user is null)
        {
            throw new NotFoundException();
        }
        
        var notifications = unitOfWork.NotificationRepository.Query()
            .Where(x => x.UserId == user.Id);

        if (!string.IsNullOrEmpty(request.SearchString))
        {
            notifications = notifications.Where(x => x.Message.ToLower().Contains(request.SearchString.ToLower()));
        }
        
        if (request.Days.HasValue)
        {
            var startDate = DateTime.UtcNow.AddDays(-request.Days.Value);
            var endDate = DateTime.UtcNow;

            notifications = notifications.Where(x => x.CreatedDate >= startDate && x.CreatedDate <= endDate);
        }
        
        var query = request.IsDescending
            ? notifications.OrderByDescending(x => x.CreatedDate).AsQueryable()
            : notifications.OrderBy(x => x.CreatedDate).AsQueryable();

        var result = await query
            .Select(x => new NotificationModel()
            {
                Id = x.Id,
                Type = x.Type,
                CreatedDate = x.CreatedDate,
                IsRead = x.IsRead,
                Message = x.Message
            })
            .PaginatedListAsync(request.Page, request.Take);

        return result;
    }
}