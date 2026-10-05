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

Нужны .NET 10 SDK x64 и Node.js 22.12 или новее с npm. Первый запуск требует интернета для загрузки NuGet-пакетов и Electron. Отдельная установка ElectronNET.CLI и команда `electronize` не нужны: используется актуальная интеграция Electron.NET со сборкой .NET.

Из корня репозитория:

```powershell
dotnet restore
dotnet run --project src/backend/BaseDesk.App --launch-profile Desktop
```

Откроется окно BaseDesk. На стартовом экране должен появиться текст «Backend доступен. Приложение готово к разработке». Закрытие окна завершает приложение.

В Visual Studio откройте `BaseDesk.sln`, выберите профиль `Desktop` и запустите проект. Для .NET 10 нужна версия Visual Studio с поддержкой этого SDK (Visual Studio 2026 или новее).

### Проверка в браузере

```powershell
dotnet run --project src/backend/BaseDesk.App --launch-profile Web
```

Откройте `http://localhost:5120`. API проверки доступен по адресу `http://localhost:5120/api/health`. Для остановки нажмите `Ctrl+C` в терминале. Этот профиль запускает backend без окна Electron; обычная сборка всё равно подготавливает Electron.

После изменения HTML, CSS или JavaScript перезапустите приложение со сборкой, чтобы обновить файлы в `wwwroot`.

При проверке зависимостей npm сообщает об уязвимости пакета `image-size`, который поставляется внутри Electron.NET. В текущем каркасе нет загрузки пользовательских изображений. Перед распространением приложения нужно проверить обновления Electron.NET; не применяйте `npm audit fix --force` к сборочному каталогу — его содержимое создаётся заново при сборке.

### Если команда dotnet не находит SDK

На Windows команда `dotnet --info` должна показывать установленный SDK x64. Если вместо него запускается `C:\Program Files (x86)\dotnet\dotnet.exe`, используйте x64-версию явно:

```powershell
& 'C:\Program Files\dotnet\dotnet.exe' restore
& 'C:\Program Files\dotnet\dotnet.exe' run --project src/backend/BaseDesk.App --launch-profile Desktop
```

## Дизайн

Ссылка на Figma хранится в [design/figma-link.md](design/figma-link.md).
