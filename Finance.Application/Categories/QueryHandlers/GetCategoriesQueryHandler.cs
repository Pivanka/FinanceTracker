using Finance.Application.Common.Interfaces;
using Finance.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Finance.Application.Categories.QueryHandlers;

public record GetCategoriesQuery(TransactionType Type) : IRequest<IEnumerable<Category>>;

public class GetCategoriesQueryHandler(IUnitOfWork unitOfWork)
    : IRequestHandler<GetCategoriesQuery, IEnumerable<Category>>
{
    public async Task<IEnumerable<Category>> Handle(GetCategoriesQuery request, CancellationToken cancellationToken)
    {
        var categories = await unitOfWork.CategoryRepository
            .Query()
            .Where(x => x.Type == request.Type && x.Title != "No Category")
            .ToListAsync(cancellationToken);

        return categories;
    }
}