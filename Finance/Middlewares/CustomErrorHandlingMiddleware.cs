using Finance.Application.Common.Exceptions;
using Microsoft.AspNetCore.Mvc;

namespace Finance.Middlewares;

public class CustomErrorHandlingMiddleware(ILogger<CustomErrorHandlingMiddleware> logger) : IMiddleware
{
    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        try
        {
            await next(context);
        }
        catch (Exception e)
        {
            logger.LogError(e, "exception occured: {Message}", e.Message);

            switch (e)
            {
                case NotFoundException:
                    await HandleNotFoundException(context, e);
                    break;
                case ValidationException:
                    await HandleValidationException(context, e);
                    break;
                default:
                {
                    var details = new ProblemDetails
                    {
                        Status = StatusCodes.Status500InternalServerError,
                        Title = "Server Error"
                    };

                    context.Response.StatusCode = StatusCodes.Status500InternalServerError;

                    await context.Response.WriteAsJsonAsync(details);
                    break;
                }
            }
        }
    }
    
    private static async Task HandleNotFoundException(HttpContext context, Exception e)
    {
        var exception = (NotFoundException)e;

        var details = new ProblemDetails()
        {
            Type = "https://tools.ietf.org/html/rfc7231#section-6.5.4",
            Detail = string.IsNullOrEmpty(exception.Message) ? "The specified resource was not found." : exception.Message,
            Title = "Not Found",
            Status = StatusCodes.Status404NotFound
        };
        
        context.Response.StatusCode = StatusCodes.Status404NotFound;

        await context.Response.WriteAsJsonAsync(details);
    }

    private static async Task HandleValidationException(HttpContext context, Exception e)
    {
        var exception = (ValidationException)e;

        var details = new ValidationProblemDetails(exception.Errors)
        {
            Type = "https://tools.ietf.org/html/rfc7231#section-6.5.1",
            Status = StatusCodes.Status400BadRequest
        };
        
        context.Response.StatusCode = StatusCodes.Status400BadRequest;

        await context.Response.WriteAsJsonAsync(details);
    }
}