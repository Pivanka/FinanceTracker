namespace Finance.Application.Common.Helpers;

public static class NotificationHelper
{
    public static string ChangedRoleToAdminNotification =>
        "You've been promoted to Admin! You now have full access and control over all team settings, user management, and data. Enjoy your new powers and responsibilities!";

    public static string ChangedRoleToManagerNotification =>
        "You've been assigned the role of Manager. You can now manage transactions, categories and accounts, and ensure everything runs smoothly. Lead the way to success!";

    public static string ChangedRoleToViewerNotification => "Your role has been updated to Viewer. " +
                                                "You can now view all the team activities and data, but you have limited access to make changes. Stay informed and keep an eye on the progress!";

    public static string InvitedNotification => "You've been invited to join FinTrack! " +
                                                "To ensure your security, we've generated a one-time password for you to use during your initial login." +
                                                "Can you please change it to secure your account!";
    
    public static string ChangedCurrencyNotification(string currency) => $"Our currency has been updated to {currency}. " +
                                                            "Stay informed and keep an eye on the progress!";

}