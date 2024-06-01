using Finance.Application.Common.Models;
using Finance.Domain.Entities;

namespace Finance.Application.Common.Interfaces;

public interface ITokenGenerator
{
    AuthResponse Generate(User user);
}