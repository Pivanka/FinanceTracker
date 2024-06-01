using Finance.Application.Common.Interfaces;
using Finance.Domain.Entities;
using MediatR;

namespace Finance.Application.Categories.CommandHandlers;

public record AddCategoryCommand(string Title, string Icon, TransactionType Type, string Color) : IRequest;

public class AddCategoryCommandHandler(IUnitOfWork unitOfWork)
    : IRequestHandler<AddCategoryCommand>
{
    public async Task<Unit> Handle(AddCategoryCommand request, CancellationToken cancellationToken)
    {
        var newCategory = new Category
        {
            Type = request.Type,
            Icon = request.Icon,
            Title = request.Title,
            Color = request.Color
        };

        await unitOfWork.CategoryRepository.Add(newCategory, cancellationToken);
        await unitOfWork.SaveChanges(cancellationToken);

        return new Unit();
    }
}