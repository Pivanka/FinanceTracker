namespace Finance.RazorHtmlEmails.Views.Emails.Invitation;

public record InvitationEmailViewModel(string Username, string InvitedBy, string Password, string InvitationLinkUrl);