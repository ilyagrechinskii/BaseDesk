using System.Text.Json;
using System.Text.Json.Serialization;
using Backend.Contracts.Common;
using Backend.Contracts.Organizations;
using Backend.Contracts.Workspaces;
using Backend.Infrastructure;
using Backend.Contracts.Sections;

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

builder.Services.AddSingleton<InMemoryStore>();

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

app.MapPost("/api/organizations", (CreateOrganizationRequest req, InMemoryStore store) =>
{
    var name = req.Name.Trim();
    var desc = req.Description?.Trim();

    if (string.IsNullOrWhiteSpace(name))
        return ApiResults.ValidationProblem(new[] {
            new Backend.Contracts.Common.FieldError("name", "Поле обязательно.") });

    var r = store.CreateOrganization(name, desc);
    if (!r.Success)
        return ApiResults.Conflict(r.Message!);

    return Results.Created($"/api/organizations/{r.Value!.Id}", MapOrg(r.Value, store));
})
.AddEndpointFilter<ValidationFilter<CreateOrganizationRequest>>();

app.MapGet("/api/organizations/{id:guid}", (Guid id, InMemoryStore store) =>
{
    var org = store.GetOrganization(id);
    return org is null
        ? ApiResults.NotFound($"Организация {id} не найдена.")
        : Results.Ok(MapOrg(org, store));
});

app.MapPut("/api/organizations/{id:guid}",
    (Guid id, UpdateOrganizationRequest req, InMemoryStore store) =>
    {
        var name = req.Name.Trim();
        var desc = req.Description?.Trim();

        if (string.IsNullOrWhiteSpace(name))
            return ApiResults.ValidationProblem(new[] {
            new Backend.Contracts.Common.FieldError("name", "Поле обязательно.") });

        var r = store.UpdateOrganization(id, name, desc);
        if (!r.Success)
            return r.Error == StoreError.NotFound
                ? ApiResults.NotFound(r.Message!)
                : ApiResults.Conflict(r.Message!);

        return Results.Ok(MapOrg(r.Value!, store));
    })
.AddEndpointFilter<ValidationFilter<UpdateOrganizationRequest>>();

app.MapDelete("/api/organizations/{id:guid}", (Guid id, InMemoryStore store) =>
{
    var r = store.DeleteOrganization(id);
    if (!r.Success)
        return r.Error == StoreError.NotFound
            ? ApiResults.NotFound(r.Message!)
            : ApiResults.Conflict(r.Message!);
    return Results.NoContent();
});

app.MapGet("/api/organizations/{orgId:guid}/workspaces",
    (Guid orgId, InMemoryStore store) =>
    {
        if (!store.OrganizationExists(orgId))
            return ApiResults.NotFound($"Организация {orgId} не найдена.");

        var list = store.ListWorkspaces(orgId).Select(MapWs).ToList();
        return Results.Ok(list);
    });

app.MapPost("/api/organizations/{orgId:guid}/workspaces",
    (Guid orgId, CreateWorkspaceRequest req, InMemoryStore store) =>
    {
        var name = req.Name.Trim();
        if (string.IsNullOrWhiteSpace(name))
            return ApiResults.ValidationProblem(new[] {
            new Backend.Contracts.Common.FieldError("name", "Поле обязательно.") });

        // Trim Title у разделов перед сохранением
        var sections = req.Sections?.Select(s => s with { Title = s.Title.Trim() }).ToList();

        var r = store.CreateWorkspace(orgId, name, sections);
        if (!r.Success)
            return r.Error == StoreError.NotFound
                ? ApiResults.NotFound(r.Message!)
                : ApiResults.Conflict(r.Message!);

        return Results.Created($"/api/workspaces/{r.Value!.Id}", MapWs(r.Value));
    })
.AddEndpointFilter<ValidationFilter<CreateWorkspaceRequest>>();

app.MapGet("/api/workspaces/{id:guid}", (Guid id, InMemoryStore store) =>
{
    var ws = store.GetWorkspace(id);
    return ws is null
        ? ApiResults.NotFound($"Рабочее пространство {id} не найдено.")
        : Results.Ok(MapWs(ws));
});

app.MapPut("/api/workspaces/{id:guid}",
    (Guid id, UpdateWorkspaceRequest req, InMemoryStore store) =>
    {
        var name = req.Name.Trim();
        if (string.IsNullOrWhiteSpace(name))
            return ApiResults.ValidationProblem(new[] {
            new Backend.Contracts.Common.FieldError("name", "Поле обязательно.") });

        var r = store.UpdateWorkspace(id, name);
        return r.Success
            ? Results.Ok(MapWs(r.Value!))
            : ApiResults.NotFound(r.Message!);
    })
.AddEndpointFilter<ValidationFilter<UpdateWorkspaceRequest>>();

app.MapDelete("/api/workspaces/{id:guid}", (Guid id, InMemoryStore store) =>
{
    var r = store.DeleteWorkspace(id);
    return r.Success
        ? Results.NoContent()
        : ApiResults.NotFound(r.Message!);
});

app.MapGet("/api/workspaces/{id:guid}/sections",
    (Guid id, InMemoryStore store) =>
    {
        var sections = store.GetSections(id);
        return sections is null
            ? ApiResults.NotFound($"Рабочее пространство {id} не найдено.")
            : Results.Ok(sections.Select(MapSection).ToList());
    });

app.MapPut("/api/workspaces/{id:guid}/sections",
    (Guid id, UpdateSectionsRequest req, InMemoryStore store) =>
    {
        var sections = req.Sections
            .Select(s => s with { Title = s.Title.Trim() })
            .ToList();

        var r = store.ReplaceSections(id, sections);
        return r.Success
            ? Results.Ok(r.Value!.Select(MapSection).ToList())
            : ApiResults.NotFound(r.Message!);
    })
.AddEndpointFilter<ValidationFilter<UpdateSectionsRequest>>();

static OrganizationResponse MapOrg(OrganizationEntity o, InMemoryStore s)
{
    var (wc, mc) = s.GetCounts(o.Id);
    return new OrganizationResponse(o.Id, o.Name, o.Description, o.CreatedAt, o.UpdatedAt, wc, mc);
}

static SectionResponse MapSection(SectionEntity s) =>
    new(s.Id, s.WorkspaceId, s.Type, s.Title, s.Position, s.Enabled);

static WorkspaceResponse MapWs(WorkspaceEntity w) =>
    new(w.Id, w.OrganizationId, w.Name,
        w.Sections.OrderBy(s => s.Position).Select(MapSection).ToList());

app.Run();
