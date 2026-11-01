var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// (здесь позже появятся сервисы: EF Core, репозитории и т.д.)

var app = builder.Build();

// Configure the HTTP request pipeline.
app.MapGet("/api/health", () => Results.Json(new { status = "ok" }));

app.Run();
