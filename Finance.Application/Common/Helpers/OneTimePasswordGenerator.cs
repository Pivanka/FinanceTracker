namespace Finance.Application.Common.Helpers;

public static class OneTimePasswordGenerator
{
    public static string Generate()
    {
        return Convert.ToBase64String(Guid.NewGuid().ToByteArray())[..12];
    }
}