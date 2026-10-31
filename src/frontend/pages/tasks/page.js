// Экран «Задачи» (табличное представление).
// Импорт модуля ничего не монтирует: страницу запускает preview.js или оболочка приложения.

const PAGE_SIZE = 8;

const STATUS_LABELS = {
  todo: 'К выполнению',
  inProgress: 'В работе',
  done: 'Выполнено',
};

const STATUS_ORDER = ['todo', 'inProgress', 'done'];

const PRIORITY_LABELS = {
  high: 'Высокий',
  medium: 'Средний',
  low: 'Низкий',
};

const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

// Статичная разметка без пользовательских данных. Значения задач выводятся только через textContent.
const TEMPLATE = `
  <section class="tasks-page" aria-labelledby="tasks-page-title">
    <header class="tasks-page__header">
      <div class="tasks-page__heading">
        <button class="tasks-page__icon-button tasks-page__back" type="button" data-role="back" aria-label="Назад">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5m6-6-6 6 6 6"/></svg>
        </button>
        <div>
          <h1 class="tasks-page__title" id="tasks-page-title">Задачи</h1>
          <p class="tasks-page__subtitle">Управление задачами вашей организации.</p>
        </div>
      </div>
      <div class="tasks-page__header-actions">
        <button class="tasks-page__button" type="button" data-role="add">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>
          Добавить
        </button>
        <button class="tasks-page__button tasks-page__button--ai" type="button" disabled title="Появится на следующих этапах">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 3l1.8 4.7L16.5 9.5l-4.7 1.8L10 16l-1.8-4.7L3.5 9.5l4.7-1.8zM18 14l.9 2.1 2.1.9-2.1.9L18 20l-.9-2.1-2.1-.9 2.1-.9z"/></svg>
          ИИ
        </button>
        <button class="tasks-page__icon-button tasks-page__icon-button--bordered" type="button" disabled aria-label="Уведомления" title="Появится на следующих этапах">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15zM10 20.5a2 2 0 0 0 4 0"/></svg>
        </button>
      </div>
    </header>

    <div class="tasks-page__toolbar">
      <div class="tasks-page__views" role="group" aria-label="Представление задач">
        <button class="tasks-page__view tasks-page__view--active" type="button" aria-pressed="true">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v14H4zM4 10h16M4 14.5h16M9 10v9"/></svg>
          Таблица
        </button>
        <button class="tasks-page__view" type="button" aria-pressed="false" disabled title="Появится на следующих этапах">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4h11v11H8zM5 8v11h11"/></svg>
          Канбан
        </button>
        <button class="tasks-page__view" type="button" aria-pressed="false" disabled title="Появится на следующих этапах">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16v14H4zM4 10h16M8 3v5M16 3v5"/></svg>
          Календарь
        </button>
      </div>
      <div class="tasks-page__filters">
        <label class="tasks-page__search">
          <span class="tasks-page__visually-hidden">Поиск задач</span>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14zM20 20l-4-4"/></svg>
          <input class="tasks-page__search-input" type="search" placeholder="Поиск задач..." autocomplete="off" data-role="search">
        </label>
        <button class="tasks-page__button" type="button" disabled title="Появится на следующих этапах">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16l-6 7.5V19l-4-2v-4.5z"/></svg>
          Фильтры
        </button>
      </div>
    </div>

    <div class="tasks-page__card">
      <div class="tasks-page__table-wrap" data-role="table-wrap">
        <table class="tasks-page__table">
          <caption class="tasks-page__visually-hidden">Список задач</caption>
          <thead>
            <tr>
              <th class="tasks-page__cell tasks-page__cell--check" scope="col">
                <input class="tasks-page__checkbox" type="checkbox" data-role="select-all" aria-label="Выбрать все задачи на странице">
              </th>
              <th class="tasks-page__cell" scope="col">Название</th>
              <th class="tasks-page__cell" scope="col">Исполнитель</th>
              <th class="tasks-page__cell" scope="col">Приоритет</th>
              <th class="tasks-page__cell" scope="col">Срок</th>
              <th class="tasks-page__cell" scope="col">Статус</th>
              <th class="tasks-page__cell tasks-page__cell--actions" scope="col">Действия</th>
            </tr>
          </thead>
          <tbody data-role="rows"></tbody>
        </table>
      </div>

      <div class="tasks-page__empty" data-role="empty" hidden>
        <svg class="tasks-page__empty-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h14v16H5zM9 9h6M9 13h6M9 17h3"/></svg>
        <h2 class="tasks-page__empty-title" data-role="empty-title"></h2>
        <p class="tasks-page__empty-text" data-role="empty-text"></p>
        <button class="tasks-page__button tasks-page__button--primary" type="button" data-role="empty-add">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>
          Добавить задачу
        </button>
      </div>

      <footer class="tasks-page__footer" data-role="footer">
        <p class="tasks-page__summary" data-role="summary" aria-live="polite"></p>
        <nav class="tasks-page__pagination" aria-label="Страницы списка задач" data-role="pagination"></nav>
      </footer>

      <div class="tasks-page__menu" role="menu" aria-label="Действия с задачей" data-role="menu" hidden>
        <button class="tasks-page__menu-item" type="button" role="menuitem" data-action="edit">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4"/></svg>
          Редактировать
        </button>
        <button class="tasks-page__menu-item" type="button" role="menuitem" data-action="status">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 3 8l9 5 9-5zM3 12.5l9 5 9-5M3 16.5l9 5 9-5"/></svg>
          Изменить статус
        </button>
        <button class="tasks-page__menu-item" type="button" role="menuitem" data-action="delete">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13M10 11v5M14 11v5"/></svg>
          Удалить
        </button>
      </div>
    </div>
  </section>
`;

/**
 * Монтирует экран задач в переданный root.
 * @param {HTMLElement} root — область контента, которой управляет страница.
 * @param {{ data?: { tasks?: Array<object> } }} options — mock-данные или DTO из API.
 * @returns {() => void} функция очистки: снимает обработчики и очищает root.
 */
export function mountTasksPage(root, { data } = {}) {
  const state = {
    // Копия, чтобы изменения в памяти страницы не трогали исходные данные.
    tasks: Array.isArray(data?.tasks) ? data.tasks.map((task) => ({ ...task })) : [],
    query: '',
    page: 1,
    selectedIds: new Set(),
    menuTaskId: null,
    menuTrigger: null,
  };

  root.innerHTML = TEMPLATE;

  const page = root.querySelector('.tasks-page');
  const elements = {
    card: root.querySelector('.tasks-page__card'),
    rows: root.querySelector('[data-role="rows"]'),
    tableWrap: root.querySelector('[data-role="table-wrap"]'),
    empty: root.querySelector('[data-role="empty"]'),
    emptyTitle: root.querySelector('[data-role="empty-title"]'),
    emptyText: root.querySelector('[data-role="empty-text"]'),
    emptyAdd: root.querySelector('[data-role="empty-add"]'),
    footer: root.querySelector('[data-role="footer"]'),
    summary: root.querySelector('[data-role="summary"]'),
    pagination: root.querySelector('[data-role="pagination"]'),
    search: root.querySelector('[data-role="search"]'),
    selectAll: root.querySelector('[data-role="select-all"]'),
    menu: root.querySelector('[data-role="menu"]'),
    add: root.querySelector('[data-role="add"]'),
    back: root.querySelector('[data-role="back"]'),
  };

  const cleanups = [];

  function listen(target, type, handler) {
    target.addEventListener(type, handler);
    cleanups.push(() => target.removeEventListener(type, handler));
  }

  // Модальные формы появятся на следующем этапе, поэтому страница только сообщает о намерении.
  function emit(name, detail = {}) {
    page.dispatchEvent(new CustomEvent(`tasks-page:${name}`, { bubbles: true, detail }));
  }

  function getFilteredTasks() {
    const query = state.query.trim().toLowerCase();
    if (!query) {
      return state.tasks;
    }
    return state.tasks.filter((task) =>
      [task.title, task.assignee].some((value) => typeof value === 'string' && value.toLowerCase().includes(query)),
    );
  }

  function render() {
    closeMenu({ restoreFocus: false });

    const filtered = getFilteredTasks();
    const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    state.page = Math.min(state.page, pageCount);

    const start = (state.page - 1) * PAGE_SIZE;
    const visible = filtered.slice(start, start + PAGE_SIZE);

    elements.rows.replaceChildren(...visible.map(createRow));

    const isEmpty = visible.length === 0;
    elements.tableWrap.hidden = isEmpty;
    elements.footer.hidden = isEmpty;
    elements.empty.hidden = !isEmpty;

    if (isEmpty) {
      renderEmptyState();
      return;
    }

    elements.summary.textContent = `Показано ${start + 1}–${start + visible.length} из ${filtered.length}`;
    renderPagination(pageCount);
    renderSelectAll(visible);
  }

  function renderEmptyState() {
    const hasTasks = state.tasks.length > 0;
    elements.emptyTitle.textContent = hasTasks ? 'Ничего не найдено' : 'Задач пока нет';
    elements.emptyText.textContent = hasTasks
      ? 'Попробуйте изменить запрос поиска.'
      : 'Создайте первую задачу, чтобы начать работу.';
    elements.emptyAdd.hidden = hasTasks;
  }

  function renderSelectAll(visible) {
    const selectedCount = visible.filter((task) => state.selectedIds.has(task.id)).length;
    elements.selectAll.checked = selectedCount > 0 && selectedCount === visible.length;
    elements.selectAll.indeterminate = selectedCount > 0 && selectedCount < visible.length;
  }

  function renderPagination(pageCount) {
    const buttons = [
      createPageButton('«', 'Первая страница', 1, state.page === 1),
      createPageButton('‹', 'Предыдущая страница', state.page - 1, state.page === 1),
    ];
    for (let number = 1; number <= pageCount; number += 1) {
      const button = createPageButton(String(number), `Страница ${number}`, number, false);
      if (number === state.page) {
        button.classList.add('tasks-page__page-button--active');
        button.setAttribute('aria-current', 'page');
      }
      buttons.push(button);
    }
    buttons.push(
      createPageButton('›', 'Следующая страница', state.page + 1, state.page === pageCount),
      createPageButton('»', 'Последняя страница', pageCount, state.page === pageCount),
    );
    elements.pagination.replaceChildren(...buttons);
  }

  function createPageButton(label, ariaLabel, targetPage, disabled) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'tasks-page__page-button';
    button.textContent = label;
    button.disabled = disabled;
    button.dataset.page = String(targetPage);
    button.setAttribute('aria-label', ariaLabel);
    return button;
  }

  function createRow(task) {
    const row = document.createElement('tr');
    row.className = 'tasks-page__row';
    row.dataset.taskId = task.id;
    row.classList.toggle('tasks-page__row--selected', state.selectedIds.has(task.id));

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'tasks-page__checkbox';
    checkbox.checked = state.selectedIds.has(task.id);
    checkbox.dataset.role = 'select-row';
    checkbox.setAttribute('aria-label', `Выбрать задачу «${task.title}»`);

    const actions = document.createElement('button');
    actions.type = 'button';
    actions.className = 'tasks-page__actions-button';
    actions.dataset.role = 'open-menu';
    actions.setAttribute('aria-haspopup', 'menu');
    actions.setAttribute('aria-expanded', 'false');
    actions.setAttribute('aria-label', `Действия с задачей «${task.title}»`);
    actions.append(createDotsIcon());

    row.append(
      createCell(checkbox, 'tasks-page__cell--check'),
      createCell(task.title, 'tasks-page__cell--title'),
      createCell(task.assignee || '—', 'tasks-page__cell--muted'),
      createCell(createBadge(PRIORITY_LABELS[task.priority], `priority-${task.priority}`), 'tasks-page__cell--muted'),
      createCell(formatDate(task.dueDate), 'tasks-page__cell--muted'),
      createCell(createBadge(STATUS_LABELS[task.status], `status-${task.status}`), 'tasks-page__cell--muted'),
      createCell(actions, 'tasks-page__cell--actions'),
    );
    return row;
  }

  function createCell(content, modifier) {
    const cell = document.createElement('td');
    cell.className = modifier ? `tasks-page__cell ${modifier}` : 'tasks-page__cell';
    if (content instanceof Node) {
      cell.append(content);
    } else {
      cell.textContent = content;
    }
    return cell;
  }

  function createBadge(label, modifier) {
    if (!label) {
      return '—';
    }
    const badge = document.createElement('span');
    badge.className = `tasks-page__badge tasks-page__badge--${modifier}`;
    badge.textContent = label;
    return badge;
  }

  function createDotsIcon() {
    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    icon.setAttribute('viewBox', '0 0 24 24');
    icon.setAttribute('aria-hidden', 'true');
    for (const cx of [6, 12, 18]) {
      const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot.setAttribute('cx', String(cx));
      dot.setAttribute('cy', '12');
      dot.setAttribute('r', '1.6');
      icon.append(dot);
    }
    return icon;
  }

  function openMenu(trigger, taskId) {
    closeMenu({ restoreFocus: false });
    state.menuTaskId = taskId;
    state.menuTrigger = trigger;
    trigger.setAttribute('aria-expanded', 'true');

    elements.menu.hidden = false;
    const cardRect = elements.card.getBoundingClientRect();
    const triggerRect = trigger.getBoundingClientRect();
    elements.menu.style.top = `${triggerRect.bottom - cardRect.top + 6}px`;
    elements.menu.style.right = `${cardRect.right - triggerRect.right}px`;

    getMenuItems()[0].focus();
  }

  function closeMenu({ restoreFocus = true } = {}) {
    if (elements.menu.hidden) {
      return;
    }
    elements.menu.hidden = true;
    const trigger = state.menuTrigger;
    state.menuTaskId = null;
    state.menuTrigger = null;
    if (trigger) {
      trigger.setAttribute('aria-expanded', 'false');
      if (restoreFocus && trigger.isConnected) {
        trigger.focus();
      }
    }
  }

  function getMenuItems() {
    return [...elements.menu.querySelectorAll('[role="menuitem"]')];
  }

  function runMenuAction(action, taskId) {
    const task = state.tasks.find((item) => item.id === taskId);
    if (!task) {
      return;
    }
    if (action === 'edit') {
      closeMenu();
      emit('edit', { taskId });
      return;
    }
    if (action === 'status') {
      // Пока без модального окна: статус переключается по кругу в памяти страницы.
      const nextIndex = (STATUS_ORDER.indexOf(task.status) + 1) % STATUS_ORDER.length;
      task.status = STATUS_ORDER[nextIndex];
      emit('status-change', { taskId, status: task.status });
    }
    if (action === 'delete') {
      state.tasks = state.tasks.filter((item) => item.id !== taskId);
      state.selectedIds.delete(taskId);
      emit('delete', { taskId });
    }
    render();
    focusRowAction(taskId);
  }

  // После перерисовки возвращаем фокус к кнопке той же строки, чтобы не потерять место при работе с клавиатуры.
  function focusRowAction(taskId) {
    const row = [...elements.rows.children].find((item) => item.dataset.taskId === taskId);
    const target = row?.querySelector('[data-role="open-menu"]') ?? elements.search;
    target.focus();
  }

  listen(elements.rows, 'click', (event) => {
    const trigger = event.target.closest('[data-role="open-menu"]');
    if (!trigger) {
      return;
    }
    const { taskId } = trigger.closest('tr').dataset;
    if (state.menuTaskId === taskId) {
      closeMenu();
    } else {
      openMenu(trigger, taskId);
    }
  });

  listen(elements.rows, 'change', (event) => {
    if (event.target.dataset.role !== 'select-row') {
      return;
    }
    const { taskId } = event.target.closest('tr').dataset;
    if (event.target.checked) {
      state.selectedIds.add(taskId);
    } else {
      state.selectedIds.delete(taskId);
    }
    event.target.closest('tr').classList.toggle('tasks-page__row--selected', event.target.checked);
    renderSelectAll(getVisibleTasks());
  });

  function getVisibleTasks() {
    const start = (state.page - 1) * PAGE_SIZE;
    return getFilteredTasks().slice(start, start + PAGE_SIZE);
  }

  listen(elements.selectAll, 'change', () => {
    for (const task of getVisibleTasks()) {
      if (elements.selectAll.checked) {
        state.selectedIds.add(task.id);
      } else {
        state.selectedIds.delete(task.id);
      }
    }
    render();
  });

  listen(elements.menu, 'click', (event) => {
    const item = event.target.closest('[data-action]');
    if (item) {
      runMenuAction(item.dataset.action, state.menuTaskId);
    }
  });

  listen(elements.menu, 'keydown', (event) => {
    const items = getMenuItems();
    const index = items.indexOf(document.activeElement);
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const step = event.key === 'ArrowDown' ? 1 : -1;
      items[(index + step + items.length) % items.length].focus();
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      items[event.key === 'Home' ? 0 : items.length - 1].focus();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      closeMenu();
    } else if (event.key === 'Tab') {
      closeMenu({ restoreFocus: false });
    }
  });

  listen(document, 'pointerdown', (event) => {
    if (elements.menu.hidden) {
      return;
    }
    if (!elements.menu.contains(event.target) && !state.menuTrigger?.contains(event.target)) {
      closeMenu({ restoreFocus: false });
    }
  });

  listen(window, 'resize', () => closeMenu({ restoreFocus: false }));
  listen(elements.tableWrap, 'scroll', () => closeMenu({ restoreFocus: false }));

  listen(elements.pagination, 'click', (event) => {
    const button = event.target.closest('[data-page]');
    if (!button || button.disabled) {
      return;
    }
    state.page = Number(button.dataset.page);
    render();
  });

  listen(elements.search, 'input', () => {
    state.query = elements.search.value;
    state.page = 1;
    render();
  });

  listen(elements.add, 'click', () => emit('add'));
  listen(elements.emptyAdd, 'click', () => emit('add'));
  listen(elements.back, 'click', () => emit('back'));

  render();

  return function unmountTasksPage() {
    cleanups.forEach((cleanup) => cleanup());
    cleanups.length = 0;
    root.replaceChildren();
  };
}

// Даты DTO хранятся как YYYY-MM-DD; для таблицы показываем ДД.ММ.ГГГГ.
function formatDate(isoDate) {
  const match = typeof isoDate === 'string' ? ISO_DATE_PATTERN.exec(isoDate) : null;
  if (!match) {
    return '—';
  }
  const [, year, month, day] = match;
  return `${day}.${month}.${year}`;
}
