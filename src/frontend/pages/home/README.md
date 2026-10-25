# Главная — Никита

Постоянная ветка: `nikita`. Рабочая область: эта папка. Реализуйте экран по утверждённому изображению, на mock-данных, независимо от API и Electron.

Будущие файлы: `index.html`, `page.css`, `page.js`, `preview.js`. Предлагаемый экспорт: `mountHomePage(root, { data })`, возвращающий функцию очистки. Общие данные: [mock-data.json](../../../../docs/examples/mock-data.json); для главной можно вычислять показатели из массивов clients/tasks без добавления нового endpoint.

После реализации автономный адрес: `http://localhost:8080/src/frontend/pages/home/`. Пока здесь только README, готового экрана нет. Команда HTTP-сервера: [development.md](../../../../docs/development.md).

Sidebar не копировать: общий компонент принадлежит Наталье и подключается Александром. [Организация frontend](../../../../docs/frontend-conventions.md), [правила кода](../../../../docs/frontend-coding-rules.md).
