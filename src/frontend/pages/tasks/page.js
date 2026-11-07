// Экран «Задачи»: табличное представление и Kanban на общем mock-массиве задач.
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
        <button class="tasks-page__view tasks-page__view--active" type="button" data-role="view-table" aria-pressed="true">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v14H4zM4 10h16M4 14.5h16M9 10v9"/></svg>
          Таблица
        </button>
        <button class="tasks-page__view" type="button" data-role="view-kanban" aria-pressed="false">
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

    <div class="tasks-page__card" data-role="table-view">
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
    </div>

    <div class="tasks-page__board" data-role="board" hidden>
      <div class="tasks-page__column tasks-page__column--todo" data-status="todo">
        <header class="tasks-page__column-header">
          <span class="tasks-page__column-title">
            К выполнению
            <span class="tasks-page__column-count" data-role="count-todo">0</span>
          </span>
        </header>
        <div class="tasks-page__column-body" data-role="column-body-todo" data-status="todo"></div>
        <button class="tasks-page__column-add" type="button" data-role="column-add" data-status="todo">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>
          Добавить задачу
        </button>
      </div>
      <div class="tasks-page__column tasks-page__column--inProgress" data-status="inProgress">
        <header class="tasks-page__column-header">
          <span class="tasks-page__column-title">
            В работе
            <span class="tasks-page__column-count" data-role="count-inProgress">0</span>
          </span>
        </header>
        <div class="tasks-page__column-body" data-role="column-body-inProgress" data-status="inProgress"></div>
        <button class="tasks-page__column-add" type="button" data-role="column-add" data-status="inProgress">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>
          Добавить задачу
        </button>
      </div>
      <div class="tasks-page__column tasks-page__column--done" data-status="done">
        <header class="tasks-page__column-header">
          <span class="tasks-page__column-title">
            Выполнено
            <span class="tasks-page__column-count" data-role="count-done">0</span>
          </span>
        </header>
        <div class="tasks-page__column-body" data-role="column-body-done" data-status="done"></div>
        <button class="tasks-page__column-add" type="button" data-role="column-add" data-status="done">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>
          Добавить задачу
        </button>
      </div>
    </div>

    <div class="tasks-page__menu" role="menu" aria-label="Действия с задачей" data-role="menu" hidden>
      <button class="tasks-page__menu-item" type="button" role="menuitem" data-action="view">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>
        Просмотреть
      </button>
      <button class="tasks-page__menu-item" type="button" role="menuitem" data-action="edit">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4"/></svg>
        Редактировать
      </button>
      <button class="tasks-page__menu-item" type="button" role="menuitem" data-action="delete">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13M10 11v5M14 11v5"/></svg>
        Удалить
      </button>
    </div>

    <dialog class="tasks-page__dialog tasks-page__dialog--form" data-role="form-dialog" aria-labelledby="tasks-form-title">
      <form class="tasks-page__form" data-role="form" novalidate>
        <div class="tasks-page__dialog-header">
          <h2 class="tasks-page__dialog-title" id="tasks-form-title" data-role="form-title">Новая задача</h2>
          <button class="tasks-page__icon-button" type="button" data-role="form-close" aria-label="Закрыть">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
          </button>
        </div>
        <div class="tasks-page__form-body">
          <label class="tasks-page__field">
            <span class="tasks-page__field-label">Название</span>
            <input class="tasks-page__input" type="text" maxlength="200" required data-role="field-title">
          </label>
          <p class="tasks-page__field-error" data-role="title-error" hidden>Укажите название задачи.</p>

          <label class="tasks-page__field">
            <span class="tasks-page__field-label">Исполнитель</span>
            <input class="tasks-page__input" type="text" maxlength="120" placeholder="Не назначен" data-role="field-assignee">
          </label>

          <div class="tasks-page__field-row">
            <label class="tasks-page__field">
              <span class="tasks-page__field-label">Приоритет</span>
              <select class="tasks-page__select" data-role="field-priority">
                <option value="">Не указан</option>
                <option value="low">Низкий</option>
                <option value="medium">Средний</option>
                <option value="high">Высокий</option>
              </select>
            </label>
            <label class="tasks-page__field">
              <span class="tasks-page__field-label">Статус</span>
              <select class="tasks-page__select" data-role="field-status">
                <option value="todo">К выполнению</option>
                <option value="inProgress">В работе</option>
                <option value="done">Выполнено</option>
              </select>
            </label>
          </div>

          <label class="tasks-page__field">
            <span class="tasks-page__field-label">Срок</span>
            <input class="tasks-page__input" type="date" data-role="field-due-date">
          </label>

          <label class="tasks-page__field">
            <span class="tasks-page__field-label">Описание</span>
            <textarea class="tasks-page__textarea" rows="3" maxlength="4000" placeholder="Необязательно" data-role="field-description"></textarea>
          </label>
        </div>
        <div class="tasks-page__dialog-footer">
          <button class="tasks-page__button" type="button" data-role="form-cancel">Отмена</button>
          <button class="tasks-page__button tasks-page__button--primary" type="submit" data-role="form-submit">Сохранить</button>
        </div>
      </form>
    </dialog>

    <dialog class="tasks-page__dialog tasks-page__dialog--view" data-role="view-dialog" aria-labelledby="tasks-view-title">
      <div class="tasks-page__dialog-header">
        <h2 class="tasks-page__dialog-title" id="tasks-view-title" data-role="view-title"></h2>
        <button class="tasks-page__icon-button" type="button" data-role="view-close" aria-label="Закрыть">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </button>
      </div>
      <dl class="tasks-page__view-list">
        <div class="tasks-page__view-row">
          <dt>Исполнитель</dt>
          <dd data-role="view-assignee"></dd>
        </div>
        <div class="tasks-page__view-row">
          <dt>Приоритет</dt>
          <dd data-role="view-priority"></dd>
        </div>
        <div class="tasks-page__view-row">
          <dt>Срок</dt>
          <dd data-role="view-due-date"></dd>
        </div>
        <div class="tasks-page__view-row">
          <dt>Статус</dt>
          <dd data-role="view-status"></dd>
        </div>
        <div class="tasks-page__view-row tasks-page__view-row--description">
          <dt>Описание</dt>
          <dd data-role="view-description"></dd>
        </div>
      </dl>
      <div class="tasks-page__dialog-footer">
        <button class="tasks-page__button" type="button" data-role="view-close-secondary">Закрыть</button>
        <button class="tasks-page__button tasks-page__button--primary" type="button" data-role="view-edit">Редактировать</button>
      </div>
    </dialog>

    <dialog class="tasks-page__dialog tasks-page__dialog--confirm" data-role="confirm-dialog" aria-labelledby="tasks-confirm-title">
      <div class="tasks-page__dialog-header">
        <h2 class="tasks-page__dialog-title" id="tasks-confirm-title">Удалить задачу?</h2>
      </div>
      <p class="tasks-page__confirm-text" data-role="confirm-text"></p>
      <div class="tasks-page__dialog-footer">
        <button class="tasks-page__button" type="button" data-role="confirm-cancel">Отмена</button>
        <button class="tasks-page__button tasks-page__button--danger" type="button" data-role="confirm-delete">Удалить</button>
      </div>
    </dialog>
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
    view: 'table',
    selectedIds: new Set(),
    menuTaskId: null,
    menuTrigger: null,
    draggingTaskId: null,
    formMode: null,
    formTaskId: null,
    viewTaskId: null,
    confirmTaskId: null,
  };

  root.innerHTML = TEMPLATE;

  const page = root.querySelector('.tasks-page');
  const elements = {
    card: root.querySelector('[data-role="table-view"]'),
    board: root.querySelector('[data-role="board"]'),
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
    viewTableButton: root.querySelector('[data-role="view-table"]'),
    viewKanbanButton: root.querySelector('[data-role="view-kanban"]'),
    columnBody: {
      todo: root.querySelector('[data-role="column-body-todo"]'),
      inProgress: root.querySelector('[data-role="column-body-inProgress"]'),
      done: root.querySelector('[data-role="column-body-done"]'),
    },
    columnCount: {
      todo: root.querySelector('[data-role="count-todo"]'),
      inProgress: root.querySelector('[data-role="count-inProgress"]'),
      done: root.querySelector('[data-role="count-done"]'),
    },
  };

  const dialogs = {
    form: root.querySelector('[data-role="form-dialog"]'),
    view: root.querySelector('[data-role="view-dialog"]'),
    confirm: root.querySelector('[data-role="confirm-dialog"]'),
  };

  const formFields = {
    form: root.querySelector('[data-role="form"]'),
    title: root.querySelector('[data-role="form-title"]'),
    titleInput: root.querySelector('[data-role="field-title"]'),
    titleError: root.querySelector('[data-role="title-error"]'),
    assignee: root.querySelector('[data-role="field-assignee"]'),
    priority: root.querySelector('[data-role="field-priority"]'),
    status: root.querySelector('[data-role="field-status"]'),
    dueDate: root.querySelector('[data-role="field-due-date"]'),
    description: root.querySelector('[data-role="field-description"]'),
  };

  const viewFields = {
    title: root.querySelector('[data-role="view-title"]'),
    assignee: root.querySelector('[data-role="view-assignee"]'),
    priority: root.querySelector('[data-role="view-priority"]'),
    dueDate: root.querySelector('[data-role="view-due-date"]'),
    status: root.querySelector('[data-role="view-status"]'),
    description: root.querySelector('[data-role="view-description"]'),
  };

  const confirmText = root.querySelector('[data-role="confirm-text"]');

  const cleanups = [];

  function listen(target, type, handler) {
    target.addEventListener(type, handler);
    cleanups.push(() => target.removeEventListener(type, handler));
  }

  // Внешние слушатели (будущая оболочка, аналитика) по-прежнему получают события о действиях.
  function emit(name, detail = {}) {
    page.dispatchEvent(new CustomEvent(`tasks-page:${name}`, { bubbles: true, detail }));
  }

  function createTaskId() {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return `task-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function findTask(taskId) {
    return state.tasks.find((task) => task.id === taskId);
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
    if (state.view === 'kanban') {
      renderKanban();
    } else {
      renderTable();
    }
  }

  function switchView(view) {
    if (state.view === view) {
      return;
    }
    state.view = view;
    state.page = 1;
    elements.card.hidden = view !== 'table';
    elements.board.hidden = view !== 'kanban';
    elements.viewTableButton.classList.toggle('tasks-page__view--active', view === 'table');
    elements.viewTableButton.setAttribute('aria-pressed', String(view === 'table'));
    elements.viewKanbanButton.classList.toggle('tasks-page__view--active', view === 'kanban');
    elements.viewKanbanButton.setAttribute('aria-pressed', String(view === 'kanban'));
    render();
  }

  function renderTable() {
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

    const actions = createMenuTrigger(task);

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

  function createMenuTrigger(task) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'tasks-page__actions-button';
    button.dataset.role = 'open-menu';
    button.setAttribute('aria-haspopup', 'menu');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-label', `Действия с задачей «${task.title}»`);
    button.append(createDotsIcon());
    return button;
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

  function createLineIcon(pathData) {
    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    icon.setAttribute('viewBox', '0 0 24 24');
    icon.setAttribute('aria-hidden', 'true');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathData);
    icon.append(path);
    return icon;
  }

  // --- Kanban ---

  function renderKanban() {
    const filtered = getFilteredTasks();
    for (const status of STATUS_ORDER) {
      const tasksForStatus = filtered.filter((task) => task.status === status);
      const body = elements.columnBody[status];
      if (tasksForStatus.length === 0) {
        const placeholder = document.createElement('p');
        placeholder.className = 'tasks-page__column-empty';
        placeholder.textContent = state.query.trim() ? 'Ничего не найдено' : 'Задач пока нет';
        body.replaceChildren(placeholder);
      } else {
        body.replaceChildren(...tasksForStatus.map(createKanbanCard));
      }
      elements.columnCount[status].textContent = String(tasksForStatus.length);
    }
  }

  function createKanbanCard(task) {
    const card = document.createElement('article');
    card.className = 'tasks-page__kanban-card';
    card.draggable = true;
    card.dataset.taskId = task.id;

    const head = document.createElement('div');
    head.className = 'tasks-page__kanban-card-head';
    const title = document.createElement('h3');
    title.className = 'tasks-page__kanban-card-title';
    title.textContent = task.title;
    head.append(title, createMenuTrigger(task));

    const meta = document.createElement('div');
    meta.className = 'tasks-page__kanban-card-meta';
    meta.append(
      createMetaItem(createLineIcon('M4 6h16v14H4zM4 10h16M8 3v5M16 3v5'), formatDate(task.dueDate)),
      createMetaItem(createLineIcon('M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 20c0-4 4-6 8-6s8 2 8 6'), task.assignee || '—'),
    );

    card.append(head, meta);

    const priorityLabel = PRIORITY_LABELS[task.priority];
    if (priorityLabel) {
      const badge = document.createElement('span');
      badge.className = `tasks-page__badge tasks-page__badge--priority-${task.priority}`;
      badge.textContent = priorityLabel;
      card.append(badge);
    }

    return card;
  }

  function createMetaItem(icon, text) {
    const item = document.createElement('span');
    item.className = 'tasks-page__kanban-meta-item';
    item.append(icon);
    const label = document.createElement('span');
    label.textContent = text;
    item.append(label);
    return item;
  }

  function clearColumnHighlight() {
    for (const status of STATUS_ORDER) {
      elements.columnBody[status].classList.remove('tasks-page__column-body--over');
    }
  }

  listen(elements.board, 'dragstart', (event) => {
    const card = event.target.closest('.tasks-page__kanban-card');
    if (!card) {
      return;
    }
    state.draggingTaskId = card.dataset.taskId;
    card.classList.add('tasks-page__kanban-card--dragging');
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', card.dataset.taskId);
  });

  listen(elements.board, 'dragend', (event) => {
    event.target.closest('.tasks-page__kanban-card')?.classList.remove('tasks-page__kanban-card--dragging');
    state.draggingTaskId = null;
    clearColumnHighlight();
  });

  for (const status of STATUS_ORDER) {
    const body = elements.columnBody[status];
    listen(body, 'dragover', (event) => {
      if (!state.draggingTaskId) {
        return;
      }
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
      body.classList.add('tasks-page__column-body--over');
    });
    listen(body, 'dragleave', (event) => {
      if (!body.contains(event.relatedTarget)) {
        body.classList.remove('tasks-page__column-body--over');
      }
    });
    listen(body, 'drop', (event) => {
      event.preventDefault();
      clearColumnHighlight();
      const taskId = event.dataTransfer.getData('text/plain') || state.draggingTaskId;
      state.draggingTaskId = null;
      const task = findTask(taskId);
      if (task && task.status !== status) {
        task.status = status;
        emit('status-change', { taskId, status });
        renderKanban();
      }
    });
  }

  listen(elements.board, 'click', (event) => {
    const addButton = event.target.closest('[data-role="column-add"]');
    if (addButton) {
      openFormDialog('add');
      formFields.status.value = addButton.dataset.status;
      return;
    }
  });

  listen(elements.viewTableButton, 'click', () => switchView('table'));
  listen(elements.viewKanbanButton, 'click', () => switchView('kanban'));

  // --- Меню действий (общее для таблицы и Kanban) ---

  function openMenu(trigger, taskId) {
    closeMenu({ restoreFocus: false });
    state.menuTaskId = taskId;
    state.menuTrigger = trigger;
    trigger.setAttribute('aria-expanded', 'true');

    elements.menu.hidden = false;
    const pageRect = page.getBoundingClientRect();
    const triggerRect = trigger.getBoundingClientRect();
    elements.menu.style.top = `${triggerRect.bottom - pageRect.top + 6}px`;
    elements.menu.style.right = `${pageRect.right - triggerRect.right}px`;

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
    const task = findTask(taskId);
    if (!task) {
      return;
    }
    closeMenu();
    if (action === 'view') {
      openViewDialog(taskId);
    } else if (action === 'edit') {
      openFormDialog('edit', taskId);
    } else if (action === 'delete') {
      openConfirmDialog(taskId);
    }
  }

  listen(page, 'click', (event) => {
    const trigger = event.target.closest('[data-role="open-menu"]');
    if (!trigger) {
      return;
    }
    const host = trigger.closest('[data-task-id]');
    if (!host) {
      return;
    }
    const { taskId } = host.dataset;
    if (state.menuTaskId === taskId) {
      closeMenu();
    } else {
      openMenu(trigger, taskId);
    }
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

  // --- Таблица: выбор строк, поиск, пагинация ---

  function getVisibleTasks() {
    const start = (state.page - 1) * PAGE_SIZE;
    return getFilteredTasks().slice(start, start + PAGE_SIZE);
  }

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

  listen(elements.add, 'click', () => openFormDialog('add'));
  listen(elements.emptyAdd, 'click', () => openFormDialog('add'));
  listen(elements.back, 'click', () => emit('back'));

  // --- Модальная форма добавления / редактирования ---

  function openFormDialog(mode, taskId = null) {
    const task = taskId ? findTask(taskId) : null;
    state.formMode = mode;
    state.formTaskId = taskId;

    formFields.title.textContent = mode === 'edit' ? 'Редактировать задачу' : 'Новая задача';
    formFields.titleInput.value = task?.title ?? '';
    formFields.assignee.value = task?.assignee ?? '';
    formFields.priority.value = task?.priority ?? '';
    formFields.status.value = task?.status ?? 'todo';
    formFields.dueDate.value = task?.dueDate ?? '';
    formFields.description.value = task?.description ?? '';
    formFields.titleError.hidden = true;
    formFields.titleInput.setAttribute('aria-invalid', 'false');

    dialogs.form.showModal();
    formFields.titleInput.focus();
  }

  listen(formFields.form, 'submit', (event) => {
    event.preventDefault();
    const title = formFields.titleInput.value.trim();
    if (!title) {
      formFields.titleError.hidden = false;
      formFields.titleInput.setAttribute('aria-invalid', 'true');
      formFields.titleInput.focus();
      return;
    }

    const payload = {
      title,
      assignee: formFields.assignee.value.trim() || null,
      priority: formFields.priority.value || null,
      status: formFields.status.value,
      dueDate: formFields.dueDate.value || null,
      description: formFields.description.value.trim() || null,
    };

    if (state.formMode === 'edit' && state.formTaskId) {
      const task = findTask(state.formTaskId);
      if (task) {
        Object.assign(task, payload, { updatedAt: new Date().toISOString() });
        dialogs.form.close();
        emit('edit', { taskId: task.id });
        render();
        restoreFocusIfLost();
      }
      return;
    }

    const now = new Date().toISOString();
    const task = {
      id: createTaskId(),
      organizationId: null,
      clientId: null,
      createdAt: now,
      updatedAt: now,
      ...payload,
    };
    state.tasks.push(task);
    dialogs.form.close();
    emit('add', { taskId: task.id });
    render();
    restoreFocusIfLost();
  });

  listen(root.querySelector('[data-role="form-close"]'), 'click', () => dialogs.form.close());
  listen(root.querySelector('[data-role="form-cancel"]'), 'click', () => dialogs.form.close());
  listen(dialogs.form, 'close', () => {
    state.formMode = null;
    state.formTaskId = null;
  });

  // --- Модальный просмотр задачи ---

  function openViewDialog(taskId) {
    const task = findTask(taskId);
    if (!task) {
      return;
    }
    state.viewTaskId = taskId;
    viewFields.title.textContent = task.title;
    viewFields.assignee.textContent = task.assignee || '—';
    viewFields.priority.textContent = PRIORITY_LABELS[task.priority] || '—';
    viewFields.dueDate.textContent = formatDate(task.dueDate);
    viewFields.status.textContent = STATUS_LABELS[task.status];
    viewFields.description.textContent = task.description || '—';
    dialogs.view.showModal();
  }

  listen(root.querySelector('[data-role="view-close"]'), 'click', () => dialogs.view.close());
  listen(root.querySelector('[data-role="view-close-secondary"]'), 'click', () => dialogs.view.close());
  listen(root.querySelector('[data-role="view-edit"]'), 'click', () => {
    const taskId = state.viewTaskId;
    dialogs.view.close();
    openFormDialog('edit', taskId);
  });
  listen(dialogs.view, 'close', () => {
    state.viewTaskId = null;
  });

  // --- Подтверждение удаления ---

  function openConfirmDialog(taskId) {
    const task = findTask(taskId);
    if (!task) {
      return;
    }
    state.confirmTaskId = taskId;
    confirmText.textContent = `Удалить задачу «${task.title}»? Это действие нельзя отменить.`;
    dialogs.confirm.showModal();
  }

  listen(root.querySelector('[data-role="confirm-cancel"]'), 'click', () => dialogs.confirm.close());
  listen(root.querySelector('[data-role="confirm-delete"]'), 'click', () => {
    const taskId = state.confirmTaskId;
    dialogs.confirm.close();
    state.tasks = state.tasks.filter((item) => item.id !== taskId);
    state.selectedIds.delete(taskId);
    emit('delete', { taskId });
    render();
    restoreFocusIfLost();
  });
  listen(dialogs.confirm, 'close', () => {
    state.confirmTaskId = null;
  });

  // При закрытии модалки после удаления/сохранения браузер пытается вернуть фокус на уже
  // удалённый или перерисованный элемент; подстраховываемся поиском, чтобы фокус не терялся.
  function restoreFocusIfLost() {
    if (document.activeElement === document.body || !page.contains(document.activeElement)) {
      elements.search.focus();
    }
  }

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
