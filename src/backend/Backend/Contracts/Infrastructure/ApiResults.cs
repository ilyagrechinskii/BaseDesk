using Backend.Contracts.Common;

namespace Backend.Infrastructure;

public static class ApiResults
{
    public static IResult ValidationProblem(IEnumerable<FieldError> errors, string? message = null) =>
        Results.Json(
            new ErrorResponse(
                "validation_error",
                message ?? "Одно или несколько полей заполнены некорректно.",
                errors.ToList()),
            statusCode: StatusCodes.Status400BadRequest);

    public static IResult BadRequest(string code, string message) =>
        Results.Json(new ErrorResponse(code, message),
            statusCode: StatusCodes.Status400BadRequest);

    public static IResult NotFound(string message) =>
        Results.Json(new ErrorResponse("not_found", message),
            statusCode: StatusCodes.Status404NotFound);

    public static IResult Conflict(string message, string code = "conflict") =>
        Results.Json(new ErrorResponse(code, message),
            statusCode: StatusCodes.Status409Conflict);
}