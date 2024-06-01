using Finance.Application.Common.Enums;
using Finance.Application.Common.Exceptions;
using Finance.Application.Common.Interfaces;
using Finance.Domain.Entities;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Finance.Application.CustomCategories.CommandHandlers;

public record AddCustomCategoryCommand(int UserId, string Title, string Icon, TransactionType Type, string Color) : IRequest;

public class AddCustomCategoryCommandHandler(IUnitOfWork unitOfWork, ITeamMemberNotificationSender notificationSender)
    : IRequestHandler<AddCustomCategoryCommand>
{
    public async Task<Unit> Handle(AddCustomCategoryCommand request, CancellationToken cancellationToken)
    {
        var user = await unitOfWork.UserRepository.FirstOrDefault(x => x.Id == request.UserId, cancellationToken);
        if (user is null)
        {
            throw new NotFoundException("User not found");
        }

        var newCategory = new CustomCategory
        {
            Type = request.Type,
            Icon = request.Icon,
            Title = request.Title,
            TeamId = user.TeamId,
            Color = request.Color
        };

        await unitOfWork.CustomCategoryRepository.Add(newCategory, cancellationToken);
        await unitOfWork.SaveChanges(cancellationToken);
        
        await notificationSender.Send(user.Id, user.TeamId, SignalRType.Category, cancellationToken);

        return new Unit();
    }
}

public class AddCustomCategoryCommandValidator : AbstractValidator<AddCustomCategoryCommand> 
{
    public AddCustomCategoryCommandValidator(IUnitOfWork unitOfWork)
    {
        RuleFor(x => x.Title)
            .MustAsync(async (command, title, ct) =>
            {
                var titleExistsInCategoryRepo = await unitOfWork.CategoryRepository.Query()
                    .AnyAsync(c => c.Title == title, ct);

                var user = await unitOfWork.UserRepository.FirstOrDefault(x => x.Id == command.UserId, ct);
                //TODO put teamId in claims
                var titleExistsInCustomCategoryRepo = await unitOfWork.CustomCategoryRepository.Query()
                    .AnyAsync(c => c.Title == title && c.TeamId == user!.TeamId, ct);

                return !titleExistsInCategoryRepo && !titleExistsInCustomCategoryRepo;
            })
            .WithMessage("This title already exist");
    }
}