using Finance.Application.Common.Interfaces;
using Finance.Domain.Entities;
using MediatR;

namespace Finance.Application.Categories.QueryHandlers;

public record GetAllCategoriesQuery() : IRequest<IEnumerable<Category>>;

public class GetAllCategoriesQueryHandler(IUnitOfWork unitOfWork)
    : IRequestHandler<GetAllCategoriesQuery, IEnumerable<Category>>
{
    public async Task<IEnumerable<Category>> Handle(GetAllCategoriesQuery request, CancellationToken cancellationToken)
    {
        var categories = await unitOfWork.CategoryRepository.GetAll(cancellationToken);

        return categories.Where(x => x.Title != "No Category");
    }
}