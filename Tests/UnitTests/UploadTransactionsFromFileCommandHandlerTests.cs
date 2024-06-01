using System.Text;
using Finance.Application.Transactions.CommandHandlers;
using FluentAssertions;

namespace Tests.UnitTests;

[TestFixture]
public class UploadTransactionsFromFileCommandHandlerTests
{
    private UploadTransactionsFromFileCommandHandler _handler;

    [SetUp]
    public void Setup()
    {
        _handler = new UploadTransactionsFromFileCommandHandler();
    }

    [Test]
    public async Task Handle_ValidCsvFile_ReturnsCorrectTransactions()
    {
        // Arrange
        var csvContent = "Date and time,Description,MCC,\"Card currency amount, (UAH)\",\"Operation amount\",\"Operation currency\",\"Exchange \n" +
                         "18.05.2024 20:52:10,\"Coffe Store\",5977,-849.0,-849.0,UAH,вЂ”,вЂ”,вЂ”,372.32\n" +
                         "18.05.2024 01:56:30,\"KYIVSKYI METROPOLITEN\",4111,-8.0,-8.0,UAH,вЂ”,вЂ”,вЂ”,41.42";
        var base64Content = Convert.ToBase64String(Encoding.UTF8.GetBytes(csvContent));
        var command = new UploadTransactionsFromFileCommand(base64Content);
        var cancellationToken = new CancellationToken();

        // Act
        var result = await _handler.Handle(command, cancellationToken);
        result.Should().NotBeNull();

        var transactions = result.ToList();
        transactions.Should().NotBeEmpty();

        // Assert
        transactions.Count().Should().Be(2);
        
        var firstTransaction = transactions[0];
        firstTransaction.Amount.Should().Be(849);

        var secondTransaction = transactions[1];
        secondTransaction.Amount.Should().Be(8);
    }
}