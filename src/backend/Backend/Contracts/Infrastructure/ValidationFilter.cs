using System.ComponentModel.DataAnnotations;
using Backend.Contracts.Common;

namespace Backend.Infrastructure;

public sealed class ValidationFilter<T> : IEndpointFilter where T : class
{
    public async ValueTask<object?> InvokeAsync(
        EndpointFilterInvocationContext context,
        EndpointFilterDelegate next)
    {
        var arg = context.Arguments.OfType<T>().FirstOrDefault();
        if (arg is null)
            return await next(context);

        var results = new List<ValidationResult>();
        var ctx = new ValidationContext(arg);

        // validateAllProperties: true => вызывает и IValidatableObject.Validate()
        if (!Validator.TryValidateObject(arg, ctx, results, validateAllProperties: true))
        {
            var fieldErrors = results
                .SelectMany(r =>
                {
                    var names = r.MemberNames.Any() ? r.MemberNames : new[] { "" };
                    return names.Select(m =>
                        new FieldError(ToCamelCase(m), r.ErrorMessage ?? "Ошибка валидации."));
                })
                .ToList();

            return ApiResults.ValidationProblem(fieldErrors);
        }

        return await next(context);
    }

    private static string ToCamelCase(string s)
    {
        if (string.IsNullOrEmpty(s) || char.IsLower(s[0])) return s;
        return char.ToLowerInvariant(s[0]) + s[1..];
    }
}