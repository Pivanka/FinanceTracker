using Finance.Domain.Entities;

namespace Finance.Models;

public record GetChartRequestModel(TransactionType Type, string? From, string? To, string? AccountId);