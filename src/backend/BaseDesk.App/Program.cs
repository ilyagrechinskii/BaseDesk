using ElectronNET;
using ElectronNET.API;
using ElectronNET.API.Entities;

var webOnly = args.Contains("--web-only");
var builder = WebApplication.CreateBuilder(new WebApplicationOptions
{
    Args = args.Where(arg => arg != "--web-only").ToArray(),
    WebRootPath = Path.Combine(AppContext.BaseDirectory, "wwwroot")
});

if (!webOnly)
{
    builder.UseElectron(args, async () =>
    {
        var options = new BrowserWindowOptions
        {
            Title = "BaseDesk",
            Width = 1280,
            Height = 800,
            MinWidth = 800,
            MinHeight = 600,
            BackgroundColor = "#0b0d10",
            WebPreferences = new WebPreferences
            {
                NodeIntegration = false,
                ContextIsolation = true
            }
        };

        if (OperatingSystem.IsWindows() || OperatingSystem.IsLinux())
        {
            options.AutoHideMenuBar = true;
        }

        var window = await Electron.WindowManager.CreateWindowAsync(options);

        window.OnClosed += () => Electron.App.Quit();
    });
}

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapGet("/api/health", () => Results.Ok(new
{
    application = "BaseDesk",
    status = "ok"
}));

app.Run();
