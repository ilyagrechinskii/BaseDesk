// Автономный просмотр экрана «Задачи» на mock-данных, без API, Electron и общего Sidebar.
// Пустое состояние: откройте страницу с параметром ?state=empty.

import { mountTasksPage } from './page.js';

const MOCK_DATA_URL = '../../../../docs/examples/mock-data.json';

const DEMO_ORGANIZATION_ID = '11111111-1111-4111-8111-111111111111';
const DEMO_CLIENT_ID = '33333333-3333-4333-8333-333333333333';
const DEMO_TIMESTAMP = '2026-10-26T09:00:00Z';

// Поля assignee и priority пока отсутствуют в общем DTO Task (docs/domain-models.md).
// Это предложение для согласования с Андреем и Ильёй; страница корректно показывает «—», если их нет.
const DEMO_TASKS = [
  ['Связаться с новым клиентом', 'Александр', 'high', '2026-11-02', 'todo', DEMO_CLIENT_ID],
  ['Подготовить коммерческое предложение', 'Наталья', 'medium', '2026-11-05', 'inProgress', DEMO_CLIENT_ID],
  ['Проверить остатки товаров', 'Дмитрий', 'high', '2026-10-31', 'done', null],
  ['Обновить информацию о заказах', 'Андрей', 'medium', '2026-11-04', 'inProgress', null],
  ['Согласовать условия поставки', 'Александр', 'high', '2026-11-08', 'todo', DEMO_CLIENT_ID],
  ['Подготовить отчёт за неделю', 'Илья', 'low', '2026-11-09', 'todo', null],
  ['Проверить оплату заказов', 'Дмитрий', 'medium', '2026-11-06', 'inProgress', null],
  ['Заказать расходные материалы', 'Никита', 'low', '2026-11-10', 'done', null],
].map(([title, assignee, priority, dueDate, status, clientId], index) => ({
  id: `44444444-4444-4444-8444-${String(index + 1).padStart(12, '0')}`,
  organizationId: DEMO_ORGANIZATION_ID,
  clientId,
  title,
  description: null,
  status,
  dueDate,
  assignee,
  priority,
  createdAt: DEMO_TIMESTAMP,
  updatedAt: DEMO_TIMESTAMP,
}));

async function loadSharedMockData() {
  try {
    const response = await fetch(MOCK_DATA_URL);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn('Общий mock-data.json не загружен, используются только демо-задачи страницы.', error);
    return {};
  }
}

async function startPreview() {
  const root = document.getElementById('tasks-root');
  const isEmpty = new URLSearchParams(window.location.search).get('state') === 'empty';
  const sharedData = await loadSharedMockData();

  const data = {
    ...sharedData,
    tasks: isEmpty ? [] : DEMO_TASKS,
  };

  mountTasksPage(root, { data });

  // Формы и CRUD — следующий этап; в preview только показываем, что страница сообщила о действии.
  for (const name of ['add', 'edit', 'status-change', 'delete', 'back']) {
    root.addEventListener(`tasks-page:${name}`, (event) => {
      console.info(`[tasks preview] ${name}`, event.detail);
    });
  }
}

startPreview();
