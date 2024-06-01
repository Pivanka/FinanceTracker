using Finance.Application.Common.Enums;

namespace Finance.Application.Common.Interfaces;

public interface ITeamMemberNotificationSender
{
    Task Send(int userId, int teamId, SignalRType type, CancellationToken cancellationToken);
}