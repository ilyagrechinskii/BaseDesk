# Клиенты — Дмитрий

Постоянная ветка: `dmitry`. Рабочая область: эта папка. Реализуйте таблицу по утверждённому изображению на mock-данных, независимо от API и Electron.

Будущие файлы: `index.html`, `page.css`, `page.js`, `preview.js`. Предлагаемый экспорт: `mountClientsPage(root, { data })`, возвращающий функцию очистки. Пример clients: [mock-data.json](../../../../docs/examples/mock-data.json). Пустая таблица проверяется с пустым массивом, локальные изменения не обещают сохранение в БД.

После реализации автономный адрес: `http://localhost:8080/src/frontend/pages/clients/`. Пока здесь только README. Команда HTTP-сервера: [development.md](../../../../docs/development.md).

Sidebar не копировать; общие CSS и компоненты согласовывать с Натальей. [Организация frontend](../../../../docs/frontend-conventions.md), [правила кода](../../../../docs/frontend-coding-rules.md), [модели](../../../../docs/domain-models.md).
