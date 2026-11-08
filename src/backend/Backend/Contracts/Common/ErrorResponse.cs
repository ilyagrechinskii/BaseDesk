// Contracts/Common/ErrorResponse.cs
namespace Backend.Contracts.Common;

public record ErrorResponse(
    string Code,
    string Message,
    IReadOnlyList<FieldError>? Details = null);

public record FieldError(string Field, string Message);