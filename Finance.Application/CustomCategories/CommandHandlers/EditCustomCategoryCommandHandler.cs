using Finance.Application.Common.Exceptions;
using Finance.Application.Common.Interfaces;
using Finance.Domain.Entities;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Finance.Application.CustomCategories.CommandHandlers;

public record EditCustomCategoryCommand(int TeamId, int Id, string Title, string Icon, TransactionType Type, string Color) : IRequest;

public class EditCustomCategoryCommandHandler(IUnitOfWork unitOfWork)
    : IRequestHandler<EditCustomCategoryCommand>
{
    public async Task<Unit> Handle(EditCustomCategoryCommand request, CancellationToken cancellationToken)
    {
        var category = await unitOfWork.CustomCategoryRepository.FirstOrDefault(x => x.Id == request.Id, cancellationToken);
        if (category is null)
        {
            throw new NotFoundException("Category not found");
        }

        category.Type = request.Type;
        category.Icon = request.Icon;
        category.Title = request.Title;
        category.Color = request.Color;

        await unitOfWork.CustomCategoryRepository.Update(category, cancellationToken);
        await unitOfWork.SaveChanges(cancellationToken);

        return new Unit();
    }
}

public class EditCustomCategoryCommandValidator : AbstractValidator<EditCustomCategoryCommand> 
{
    public EditCustomCategoryCommandValidator(IUnitOfWork unitOfWork)
    {
        RuleFor(x => x.Title)
            .MustAsync(async (command, title, ct) =>
            {
                var titleExistsInCategoryRepo = await unitOfWork.CategoryRepository.Query()
                    .AnyAsync(c => c.Title == title, ct);

                var titleExistsInCustomCategoryRepo = unitOfWork.CustomCategoryRepository.Query()
                    .Where(c => c.Title == title && c.TeamId == command.TeamId).ToList().Count > 1;

                return !titleExistsInCategoryRepo && !titleExistsInCustomCategoryRepo;
            })
            .WithMessage("This title already exist");
    }
}