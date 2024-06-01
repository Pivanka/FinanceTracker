namespace Finance.Application.Common.Interfaces;

public interface IEmailSender
{
    Task Send(string to, string content, string subject, CancellationToken cancellationToken);
}