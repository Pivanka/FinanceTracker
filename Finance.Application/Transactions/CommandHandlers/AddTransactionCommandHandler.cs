using Finance.Application.Common.Enums;
using Finance.Application.Common.Exceptions;
using Finance.Application.Common.Interfaces;
using Finance.Domain.Entities;
using MediatR;

namespace Finance.Application.Transactions.CommandHandlers;

public record AddTransactionCommand() : IRequest
{
    public int UserId { get; init; }
    public int AccountId { get; init; }
    public decimal Amount { get; init; }
    public string Currency { get; init; } = null!;
    public string? Note { get; init; }
    public TransactionType Type { get; init; }
    public int? CategoryId { get; init; }
    public int? CustomCategoryId { get; init; }
    public decimal? ExchangeRate { get; init; }
    public DateTime? Date { get; init; }
}

public class AddTransactionCommandHandler(IUnitOfWork unitOfWork,
    ITeamMemberNotificationSender notificationSender,
    IExchangeRateCalculator exchangeRateCalculator, ICurrencyService currencyService)
    : IRequestHandler<AddTransactionCommand>
{
    public async Task<Unit> Handle(AddTransactionCommand request, CancellationToken cancellationToken)
    {
        var user = await unitOfWork.UserRepository.FirstOrDefault(x => x.Id == request.UserId, cancellationToken);
        if (user is null)
        {
            throw new NotFoundException("User not found");
        }
        
        var account = await unitOfWork.AccountRepository
            .FirstOrDefault(x => x.Id == request.AccountId && x.TeamId == user.TeamId, cancellationToken);
        if (account is null)
        {
            throw new NotFoundException("Account not found");
        }

        var newTransaction = new Transaction
        {
            AccountId = account.Id,
            Amount = request.Amount,
            CategoryId = request.CategoryId,
            CustomCategoryId = request.CustomCategoryId,
            Currency = request.Currency,
            Note = request.Note,
            Type = request.Type,
            ExchangeRate = 1
        };

        if (account.Currency != request.Currency)
        {
            var rates = await currencyService.GetCurrencyRates(cancellationToken);
            newTransaction.ExchangeRate = exchangeRateCalculator.Calculate(account.Currency, request.Currency, rates);
        }

        await unitOfWork.TransactionRepository.Add(newTransaction, cancellationToken);
        await unitOfWork.SaveChanges(cancellationToken);
        
        await notificationSender.Send(user.Id, user.TeamId, SignalRType.Transaction, cancellationToken);

        return new Unit();
    }
}