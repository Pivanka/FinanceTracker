namespace Finance.Infrastructure.Settings;

public class SendEmailOptions
{
    public string FromName { get; set; } = null!;
    public string FromEmail { get; set; } = null!;
    public string ApiKey { get; set; } = null!;
}