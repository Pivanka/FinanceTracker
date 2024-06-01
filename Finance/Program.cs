using Finance.DependencyInjection;
using Finance.Application;
using Finance.Application.Common.Models;
using Finance.Infrastructure;
using Finance.Infrastructure.Hubs;
using Finance.Middlewares;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration.AddJsonFile("currencies.json", optional: true);

var appSettings = builder.Configuration.GetSection("Auth").Get<TokenSettings>() ?? default!;
builder.Services.AddSingleton(appSettings);

builder.Services.AddControllers();

builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddInfrastructureServices(builder.Configuration);
builder.Services.AddAuth(builder.Configuration);
builder.Services.AddSwagger();
builder.Services.AddTransient<CustomErrorHandlingMiddleware>();

builder.Services.AddEndpointsApiExplorer();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("dev");

app.UseAuthentication();
app.UseRouting();
app.UseAuthorization();
app.UseMiddleware<CustomErrorHandlingMiddleware>();

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
    endpoints.MapHub<NotificationHub>("notifications").RequireAuthorization();
});

app.Run();

public partial class Program { }
