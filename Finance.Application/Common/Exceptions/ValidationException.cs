using FluentValidation.Results;

namespace Finance.Application.Common.Exceptions;

public class ValidationException() : Exception("One or more validation failures have occurred.")
{
    public ValidationException(IEnumerable<ValidationFailure> failures)
        : this()
    {
        Errors = failures
            .GroupBy(e => e.PropertyName, e => e.ErrorMessage)
            .ToDictionary(failureGroup => failureGroup.Key.Split('.').Last(), failureGroup => failureGroup.ToArray());
    }
    
    public ValidationException(IDictionary<string, string[]> failures)
        : this()
    {
        Errors = failures;
    }

    public IDictionary<string, string[]> Errors { get; } = new Dictionary<string, string[]>();
}