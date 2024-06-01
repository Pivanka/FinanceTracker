using Finance.Application.Common.Enums;
using Finance.Application.Common.Interfaces;
using Finance.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Finance.Infrastructure.Services;

public class TeamMemberNotificationSender : ITeamMemberNotificationSender
{
    private readonly INotificationContext _notificationContext;
    private readonly IRepository<Team> _teamRepository;

    public TeamMemberNotificationSender(INotificationContext notificationContext, IRepository<Team> teamRepository)
    {
        _notificationContext = notificationContext;
        _teamRepository = teamRepository;
    }

    public async Task Send(int userId, int teamId, SignalRType type, CancellationToken cancellationToken)
    {
        var team = await _teamRepository.Query()
            .Include(x => x.Users)
            .FirstAsync(x => x.Id == teamId, cancellationToken);

        foreach (var teamUser in team.Users)
        {
            if (teamUser.Id == userId)
            {
                continue;
            }
            
            await _notificationContext.SendToUser(teamUser.Id, type);
        }
    }
}