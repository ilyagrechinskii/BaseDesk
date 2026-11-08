using System.Text.Json;
using System.Text.Json.Serialization;
using Backend.Contracts.Common;
using Backend.Contracts.Organizations;
using Backend.Contracts.Workspaces;
using Backend.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// 1) JSON: camelCase для enum ("clients", "owner") + регистронезависимый парсинг
builder.Services.ConfigureHttpJsonOptions(o =>
{
    o.SerializerOptions.Converters.Add(
        new JsonStringEnumConverter(JsonNamingPolicy.CamelCase));
});

// 2) Регистрация глобального обработчика исключений
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

var app = builder.Build();

// 3) Exception handler — до остальных middleware
app.UseExceptionHandler();


// 4) Единый формат для framework-пустых 4xx/5xx
app.UseStatusCodePages(async context =>
{
    var response = context.HttpContext.Response;
    var (code, message) = response.StatusCode switch
    {
        400 => ("invalid_request", "Запрос содержит некорректные данные."),
        401 => ("unauthorized", "Требуется авторизация."),
        403 => ("forbidden", "Доступ запрещён."),
        404 => ("not_found", "Ресурс не найден."),
        405 => ("method_not_allowed", "HTTP-метод не поддерживается."),
        415 => ("unsupported_media_type", "Неподдерживаемый тип содержимого."),
        _ => ("error", "Ошибка при обработке запроса.")
    };
    await response.WriteAsJsonAsync(new ErrorResponse(code, message));
});

// 5) Health (как было)
app.MapGet("/api/health", () => Results.Json(new { status = "ok" }));

// 6) Пример эндпоинта с фильтром валидации
app.MapPost("/api/organizations", (CreateOrganizationRequest req) =>
{
    // временная реализация; после EF Core заменится на репозиторий
    var id = Guid.NewGuid();
    var now = DateTimeOffset.UtcNow;
    var created = new
    {
        id,
        name = req.Name.Trim(),
        description = req.Description?.Trim(),
        createdAt = now,
        updatedAt = now,
        workspaceCount = 0,
        memberCount = 1
    };
    return Results.Created($"/api/organizations/{id}", created);
})
.AddEndpointFilter<ValidationFilter<CreateOrganizationRequest>>();

app.MapGet("/api/organizations/{id:guid}", (Guid id) =>
{
    // заглушка: в реальности поиск в хранилище
    return ApiResults.NotFound(
        $"Организация {id} не найдена.");
});

// Пример создания workspace с валидацией вложенных разделов
app.MapPost("/api/organizations/{orgId:guid}/workspaces",
    (Guid orgId, CreateWorkspaceRequest req) =>
    {
        // заглушка
        return Results.Created($"/api/workspaces/{Guid.NewGuid()}", new { });
    })
.AddEndpointFilter<ValidationFilter<CreateWorkspaceRequest>>();

app.Run();
