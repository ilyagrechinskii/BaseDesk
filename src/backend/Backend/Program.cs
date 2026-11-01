var builder = WebApplication.CreateBuilder(args);

// Сервисы API регистрируются здесь; подключение БД — отдельный этап.
var app = builder.Build();

app.MapGet("/api/health", () => Results.Json(new { status = "ok" }));

app.Run();
