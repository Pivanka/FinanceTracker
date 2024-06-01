using System.Text;
using Finance.Infrastructure.Settings;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Models;

namespace Finance.DependencyInjection;

public static class FinanceTrackerInternalDependencies
{
    public static void AddAuth(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddAuthentication(x =>
            {
                x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidIssuer = configuration["Auth:Issuer"],
                    RequireAudience = true,
                    ValidateAudience = true,
                    ValidAudience = configuration["Auth:Audience"],
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(configuration["Auth:Secret"])),
                    RequireExpirationTime = true,
                    ClockSkew = TimeSpan.FromSeconds(0)
                };

                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = (context) =>
                    {
                        var access_token = context.Request.Query["access_token"];
                        if (!string.IsNullOrEmpty(access_token))
                        {
                            context.Token = access_token;
                        }
                        return Task.CompletedTask;
                    }
                };
            });
        services.AddCors(options =>
        {
            options.AddPolicy("dev",builder =>
                builder
                    .WithOrigins("http://localhost:4200", "https://localhost:4200")
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials()
            );
        });
        
        services.AddOptions<SendEmailOptions>().Bind(configuration.GetSection("SendEmailOptions"));
        services.Configure<CurrenciesOptions>(x => configuration.GetSection(nameof(CurrenciesOptions)).Bind(x));
    }

    public static void AddSwagger(this IServiceCollection services)
    {
        services.AddSwaggerGen(options =>
        {
            options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                In = ParameterLocation.Header,
                Description = "Authentication Login",
                Name = "Authorization",
                Type = SecuritySchemeType.Http,
                BearerFormat = "JsonWebToken",
                Scheme = "Bearer"
            });
            options.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer"
                        }
                    },
                    new string[] { }
                }
            });
            options.MapType<DateOnly>(() => new OpenApiSchema
            {
                Type = "string",
                Format = "date",
                Example = new OpenApiString("2023-01-01")
            });
        });
    }
}
    