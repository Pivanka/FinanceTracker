using Finance.Application.Common.Enums;
using Finance.Application.Common.Interfaces;
using Finance.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Finance.Infrastructure.Services;

public class TeamMemberNotificationSender(INotificationContext notificationContext, IUnitOfWork unitOfWork)
    : ITeamMemberNotificationSender
{
    public async Task Send(int userId, int teamId, SignalRType type, CancellationToken cancellationToken)
    {
        var team = await unitOfWork.TeamRepository.Query()
            .Include(x => x.Users)
            .FirstAsync(x => x.Id == teamId, cancellationToken);

        foreach (var teamUser in team.Users)
        {
            if (teamUser.Id == userId)
            {
                continue;
            }
            
            await notificationContext.SendToUser(teamUser.Id, type);
        }
    }
}