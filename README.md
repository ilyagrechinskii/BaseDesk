# BaseDesk

Десктопное приложение для организации данных и рабочих процессов небольших компаний и команд, вдохновлённое Airtable. Проект разрабатывается в рамках вузовской проектной деятельности.

Сейчас реализован стартовый каркас: окно Electron.NET, минимальный ASP.NET Core backend и главная страница, которая проверяет соединение с backend через `GET /api/health`. Бизнес-функции пока не реализованы.

## Стек

- C# и .NET 10 / ASP.NET Core.
- Electron.NET (`ElectronNET.Core` и `ElectronNET.Core.AspNet` 0.6.0), Electron 44.5.1.
- JavaScript, HTML и CSS без frontend-фреймворка и сборщика.

## Структура

```text
BaseDesk.sln                 Решение для Visual Studio
global.json                  Выбор версии .NET SDK
docs/
  running.md                 Инструкция локального запуска
src/
  backend/BaseDesk.App/
    BaseDesk.App.csproj       Проект и зависимости Electron.NET
    Program.cs               Запуск backend, окна и проверочного API
    Properties/
      launchSettings.json    Профили Desktop и Web
      electron-builder.json  Конфигурация упаковки Electron для Windows
  frontend/
    index.html               Стартовый экран
    styles.css               Стили
    app.js                   Проверка соединения с backend
design/
  figma-link.md              Ссылка на дизайн
```

Backend и frontend запускаются как одно приложение. При сборке файлы `src/frontend` копируются в `wwwroot` выходного каталога. Редактировать нужно исходники в `src/frontend`, а не копии в `bin`.

## Локальный запуск

Требования, команды запуска из VS Code и Visual Studio, браузерный режим и решение типичных проблем описаны в [docs/running.md](docs/running.md).

## Дизайн

Ссылка на Figma хранится в [design/figma-link.md](design/figma-link.md).
