# Задачи — Артём

Постоянная ветка: `artem`. Рабочая область: эта папка. Реализуйте таблицу задач по утверждённому изображению на mock-данных, независимо от API и Electron.

Будущие файлы: `index.html`, `page.css`, `page.js`, `preview.js`. Предлагаемый экспорт: `mountTasksPage(root, { data })`, возвращающий функцию очистки. Пример tasks и связанного клиента: [mock-data.json](../../../../docs/examples/mock-data.json). `clientId` может быть `null`; дата без времени. Проверить пустой список и разные статусы, не добавляя серверную логику.

После реализации автономный адрес: `http://localhost:8080/src/frontend/pages/tasks/`. Пока здесь только README. Команда HTTP-сервера: [development.md](../../../../docs/development.md).

Sidebar не копировать; общие CSS и компоненты согласовывать с Натальей. [Организация frontend](../../../../docs/frontend-conventions.md), [правила кода](../../../../docs/frontend-coding-rules.md), [модели](../../../../docs/domain-models.md).
