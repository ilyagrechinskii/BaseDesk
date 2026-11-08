using Backend.Contracts.Common;
using Microsoft.AspNetCore.Diagnostics;

namespace Backend.Infrastructure;

public sealed class GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)
    : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {
        // Плохой JSON / неверный enum / битый Guid в теле — framework бросает это.
        if (exception is BadHttpRequestException badReq)
        {
            logger.LogInformation(exception,
                "Bad request on {Method} {Path}",
                httpContext.Request.Method, httpContext.Request.Path);

            httpContext.Response.StatusCode = badReq.StatusCode; // обычно 400
            await httpContext.Response.WriteAsJsonAsync(
                new ErrorResponse("invalid_request",
                    "Запрос содержит некорректные данные."),
                cancellationToken);
            return true;
        }

        // Всё остальное — 500.
        logger.LogError(exception,
            "Unhandled exception on {Method} {Path}",
            httpContext.Request.Method, httpContext.Request.Path);

        httpContext.Response.StatusCode = StatusCodes.Status500InternalServerError;
        await httpContext.Response.WriteAsJsonAsync(
            new ErrorResponse("internal_error",
                "Внутренняя ошибка сервера. Попробуйте позже."),
            cancellationToken);
        return true;
    }
}