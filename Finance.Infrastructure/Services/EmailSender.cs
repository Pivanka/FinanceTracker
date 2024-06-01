using Finance.Application.Common.Interfaces;
using Finance.Infrastructure.Settings;
using Microsoft.Extensions.Options;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace Finance.Infrastructure.Services;

public class EmailSender : IEmailSender
{
    private readonly SendEmailOptions _options;

    public EmailSender(IOptions<SendEmailOptions> settings)
    {
        if (string.IsNullOrEmpty(settings.Value.ApiKey)) throw new ArgumentNullException("settings.Value.ApiKey");
        _options = settings.Value;
    }
    
    public async Task Send(string to, string content, string subject, CancellationToken cancellationToken)
    {
        try
        {
            var client = new SendGridClient(_options.ApiKey);

            var message = new SendGridMessage
            {
                From = new EmailAddress(_options.FromEmail, _options.FromName),
                Subject = subject,
                HtmlContent = content,
                Personalizations = new()
                {
                    new Personalization()
                    {
                        Tos = new List<EmailAddress>() { new (to) }
                    }
                }
            };
            
            var response = await client.SendEmailAsync(message, cancellationToken);
            if (!response.IsSuccessStatusCode)
            {
                Console.WriteLine($"Could not send email to {to}");
            }
        }
        catch (ArgumentNullException ex)
        {
            Console.WriteLine($"Could not send email to {to}");
        }
    }
}