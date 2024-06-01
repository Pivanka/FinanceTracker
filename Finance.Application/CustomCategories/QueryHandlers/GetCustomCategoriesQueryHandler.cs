using Finance.Application.Common.Exceptions;
using Finance.Application.Common.Interfaces;
using Finance.Domain.Entities;
using MediatR;

namespace Finance.Application.CustomCategories.QueryHandlers;

public record GetCustomCategoriesQuery(int UserId) : IRequest<IEnumerable<CustomCategory>>;

public class GetCustomCategoriesQueryHandler(IUnitOfWork unitOfWork)
    : IRequestHandler<GetCustomCategoriesQuery, IEnumerable<CustomCategory>>
{
    public async Task<IEnumerable<CustomCategory>> Handle(GetCustomCategoriesQuery request, CancellationToken cancellationToken)
    {
        var user = await unitOfWork.UserRepository.FirstOrDefault(x => x.Id == request.UserId, cancellationToken);
        if (user is null)
        {
            throw new NotFoundException("User not found");
        }
        
        var customCategories = unitOfWork.CustomCategoryRepository.Query()
                .Where(x => x.TeamId == user.TeamId && !x.IsDeleted)
                .ToList();
        
        return customCategories.Select(x => new CustomCategory
        {
            Type = x.Type,
            Title = x.Title,
            Icon = x.Icon,
            Id = x.Id,
            TeamId = x.TeamId,
            Color = x.Color
        });
    }
}