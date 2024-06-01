using Finance.Application.Common.Enums;
using Finance.Application.Common.Exceptions;
using Finance.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Finance.Application.CustomCategories.CommandHandlers;

public record DeleteCustomCategoryCommand(int UserId, int CategoryId) : IRequest;

public class DeleteCustomCategoryCommandHandler(IUnitOfWork unitOfWork, ITeamMemberNotificationSender notificationSender)
    : IRequestHandler<DeleteCustomCategoryCommand>
{
    public async Task<Unit> Handle(DeleteCustomCategoryCommand request, CancellationToken cancellationToken)
    {
        var user = await unitOfWork.UserRepository.FirstOrDefault(x => x.Id == request.UserId, cancellationToken);
        if (user is null)
        {
            throw new NotFoundException("User not found");
        }
        
        var category = await unitOfWork.CustomCategoryRepository
            .Query()
            .FirstOrDefaultAsync(x => x.Id == request.CategoryId && x.TeamId == user.TeamId, cancellationToken);
        if (category is null)
        {
            throw new NotFoundException("Category not found");
        }

        category.IsDeleted = true;
        
        await unitOfWork.CustomCategoryRepository.Update(category, cancellationToken);
        await unitOfWork.SaveChanges(cancellationToken);
        
        await notificationSender.Send(user.Id, user.TeamId, SignalRType.Category, cancellationToken);
        
        return new Unit();
    }
}