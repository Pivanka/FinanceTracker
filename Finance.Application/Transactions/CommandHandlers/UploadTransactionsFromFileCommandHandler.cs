using System.Globalization;
using System.Text;
using CsvHelper;
using CsvHelper.Configuration;
using Finance.Application.Common.Models.Transactions;
using Finance.Domain.Entities;
using MediatR;

namespace Finance.Application.Transactions.CommandHandlers;

public record UploadTransactionsFromFileCommand(string FileContent) : IRequest<IEnumerable<UploadTransaction>>;

public class UploadTransactionsFromFileCommandHandler : IRequestHandler<UploadTransactionsFromFileCommand, IEnumerable<UploadTransaction>>
{
    public async Task<IEnumerable<UploadTransaction>> Handle(UploadTransactionsFromFileCommand request, CancellationToken cancellationToken)
    {
        var fileBytes = Convert.FromBase64String(request.FileContent);
        var csvContent = Encoding.UTF8.GetString(fileBytes);

        var transactions = new List<UploadTransaction>();
        using (var reader = new StringReader(csvContent))
        {
            var headerLine = await reader.ReadLineAsync(cancellationToken);
            if (headerLine == null) return transactions;

            while (await reader.ReadLineAsync(cancellationToken) is { } line)
            {
                var values = ParseCsvLine(line);

                var transaction = new UploadTransaction
                {
                    Date = DateTime.ParseExact(values[0], "dd.MM.yyyy HH:mm:ss", CultureInfo.InvariantCulture),
                    Note = values[1],
                    Amount = Math.Abs(decimal.Parse(values[4], NumberStyles.Any, CultureInfo.InvariantCulture)),
                    Type = decimal.Parse(values[4], NumberStyles.Any, CultureInfo.InvariantCulture) > 0 ? TransactionType.Income : TransactionType.Expense,
                    Currency =  values[5],
                    ExchangeRate = decimal.TryParse(values[6], NumberStyles.Any, CultureInfo.InvariantCulture, out var value) ? value : 1,
                };

                transactions.Add(transaction);
            }
        }

        return transactions;
    }

    private string[] ParseCsvLine(string line)
    {
        var values = new List<string>();
        bool inQuotes = false;
        string value = "";

        foreach (char c in line)
        {
            if (c == ',' && !inQuotes)
            {
                values.Add(value);
                value = "";
            }
            else if (c == '"')
            {
                inQuotes = !inQuotes;
            }
            else
            {
                value += c;
            }
        }

        values.Add(value);
        return values.ToArray();
    }
}