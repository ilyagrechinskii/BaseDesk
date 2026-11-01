const TEMPLATE = `
<section class="clients-page">
  <!-- Только содержимое раздела. Общий Sidebar подключается на уровне приложения. -->
  <div class="clients">
    <header class="head">
      <button class="back" type="button" aria-label="Назад" data-demo="Назад"><svg viewBox="0 0 24 24"><path d="M19 12H5M11 6l-6 6 6 6"/></svg></button>
      <div class="head__text">
        <h1 class="title">Клиенты</h1>
        <p class="subtitle">Контакты, история взаимодействий и заметки.</p>
      </div>
      <div class="head__actions">
        <button class="btn" type="button" data-demo="Форма добавления клиента — на следующей неделе"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>Добавить</button>
        <button class="btn btn--ai" type="button" data-demo="ИИ — скоро"><svg viewBox="0 0 24 24"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7z"/></svg>ИИ</button>
        <button class="btn btn--icon" type="button" aria-label="Уведомления" data-demo="Уведомления — скоро"><svg viewBox="0 0 24 24"><path d="M6 8a6 6 0 0112 0c0 7 3 8 3 8H3s3-1 3-8M10 20a2 2 0 004 0"/></svg></button>
      </div>
    </header>

    <div class="toolbar">
      <span class="tab"><svg viewBox="0 0 24 24"><rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/></svg>Таблица</span>
      <button class="calendar-tab" type="button" disabled><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16"/></svg>Календарь <span class="soon">Скоро</span></button>
      <span class="toolbar__spacer"></span>
      <label class="search"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg><input data-role="search" type="search" placeholder="Поиск по клиентам…" aria-label="Поиск по клиентам"></label>
      <button class="icon-btn" type="button" aria-label="Фильтры" data-demo="Фильтры — скоро"><svg viewBox="0 0 24 24"><path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/></svg></button>
    </div>

    <section class="card">
      <table data-role="clients-table">
        <thead>
          <tr>
            <th class="col-check"><input type="checkbox" data-role="check-all" aria-label="Выбрать всех"></th>
            <th scope="col">Компания / Имя</th>
            <th scope="col">Контакты</th>
            <th scope="col">Статус</th>
            <th scope="col">Последний контакт</th>
            <th scope="col">Ответственный</th>
            <th scope="col" class="col-actions" aria-label="Действия"><span aria-hidden="true">⋮</span></th>
          </tr>
        </thead>
        <tbody data-role="clients-body"></tbody>
      </table>

      <div class="empty" data-role="empty-state" hidden>
        <h2 class="empty__title" data-role="empty-title">Клиентов пока нет</h2>
        <p class="empty__text" data-role="empty-text">Добавьте первого клиента, чтобы он появился в списке.</p>
        <button class="btn" type="button" data-role="empty-add" data-demo="Форма добавления клиента — на следующей неделе"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>Добавить клиента</button>
      </div>

      <footer class="foot" data-role="foot">
        <span data-role="count"></span>
        <div class="pager">
          <button class="icon-btn" type="button" aria-label="Назад" data-demo="Пагинация — позже"><svg viewBox="0 0 24 24"><path d="M11 17l-5-5 5-5M18 17l-5-5 5-5"/></svg></button>
          <button class="icon-btn icon-btn--on" type="button" aria-current="page">1</button>
          <button class="icon-btn" type="button" aria-label="Вперёд" data-demo="Пагинация — позже"><svg viewBox="0 0 24 24"><path d="M13 17l5-5-5-5M6 17l5-5-5-5"/></svg></button>
          <button class="icon-btn size" type="button" data-demo="Размер страницы — позже">10<svg viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg></button>
        </div>
      </footer>
    </section>
  </div>

  <div class="menu" data-role="row-menu" role="menu" hidden>
    <button class="menu__item" role="menuitem" type="button" data-action="view"><svg viewBox="0 0 24 24"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>Просмотр</button>
    <button class="menu__item" role="menuitem" type="button" data-action="edit"><svg viewBox="0 0 24 24"><path d="M4 20h4L19 9l-4-4L4 16zM13 7l4 4"/></svg>Редактировать</button>
    <button class="menu__item" role="menuitem" type="button" data-action="delete"><svg viewBox="0 0 24 24"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>Удалить</button>
  </div>
  <div class="toast" data-role="toast" role="status" aria-live="polite"></div>


</section>
`;

export function mountClientsPage(root, { data } = {}) {
  root.innerHTML = TEMPLATE;
  const page = root.querySelector(".clients-page");
  const find = role => root.querySelector(`[data-role="${role}"]`);
  const cleanups = [];
  function listen(target, event, handler, options) {
    target.addEventListener(event, handler, options);
    cleanups.push(() => target.removeEventListener(event, handler, options));
  }
  const all = Array.isArray(data?.clients) ? data.clients.map(client => ({ ...client })) : [];
  var body = find("clients-body");
  var table = find("clients-table");
  var empty = find("empty-state");
  var foot = find("foot");
  var count = find("count");
  var menu = find("row-menu");
  var toast = find("toast");
  var checkAll = find("check-all");
  var activeBtn = null, activeClient = null, toastTimer;

  var COLORS = [["#dbeafe","#1d4ed8"],["#e4e0fb","#5b3fd0"],["#d9f5e5","#15803d"],["#fde6d3","#c2570c"],["#fbdcec","#be185d"]];
  var ICON_PHONE = '<svg viewBox="0 0 24 24"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z"/></svg>';
  var ICON_MAIL = '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>';
  var ICON_DOTS = '<svg viewBox="0 0 24 24" style="fill:currentColor;stroke:none"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg>';

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function statusBadge(status) {
    const labels = { active: "Активный", inProgress: "В работе", new: "Новый" };
    return labels[status] ? '<span class="status status--' + status + '">' + labels[status] + '</span>' : '—';
  }

  function formatDate(value) {
    const match = typeof value === 'string' && /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    return match ? match[3] + '.' + match[2] + '.' + match[1] : '—';
  }

  function render(list) {
    closeMenu(false);
    var has = list.length > 0;
    table.hidden = !has;
    foot.hidden = !has;
    empty.hidden = has;
    checkAll.checked = false;
    if (!has) {
      var searching = all.length > 0;
      find("empty-title").textContent = searching ? "Ничего не найдено" : "Клиентов пока нет";
      find("empty-text").textContent = searching ? "Попробуйте изменить запрос." : "Добавьте первого клиента, чтобы он появился в списке.";
      find("empty-add").hidden = searching;
    }
    count.textContent = has ? "Показано 1–" + list.length + " из " + list.length : "";
    body.innerHTML = list.map(function (c, i) {
      var col = COLORS[i % COLORS.length];
      return '<tr data-id="' + esc(c.id) + '">' +
        '<td class="col-check"><input type="checkbox" aria-label="Выбрать ' + esc(c.name) + '"></td>' +
        '<td><div class="who"><span class="avatar" style="background:' + col[0] + ';color:' + col[1] + '">' + esc(c.initials ?? c.name.charAt(0)) + '</span>' +
        '<div><div class="who__name">' + esc(c.name) + '</div><div class="who__sub">Клиент с ' + esc(c.since ?? (c.createdAt ? c.createdAt.slice(0, 4) : "—")) + '</div></div></div></td>' +
        '<td><div class="contacts"><span class="contact">' + ICON_PHONE + esc(c.phone ?? "—") + '</span>' +
        '<span class="contact">' + ICON_MAIL + esc(c.email ?? "—") + '</span></div></td>' +
        '<td>' + statusBadge(c.status) + '</td>' +
        '<td class="last-contact">' + esc(formatDate(c.lastContact)) + '</td>' +
        '<td><span class="owner">' + (c.owner ? '<span class="owner__avatar">' + esc(c.owner.charAt(0)) + '</span><span>' + esc(c.owner) + '</span>' : '—') + '</span></td>' +
        '<td class="col-actions"><button type="button" class="row-menu-btn" aria-haspopup="menu" aria-expanded="false" aria-label="Действия: ' + esc(c.name) + '">' + ICON_DOTS + '</button></td></tr>';
    }).join("");
  }

  listen(body, "click", function (e) {
    var btn = e.target.closest(".row-menu-btn");
    if (!btn) return;
    e.stopPropagation();
    var id = btn.closest("tr").dataset.id;
    var client = all.filter(function (c) { return String(c.id) === id; })[0];
    var same = activeBtn === btn;
    closeMenu(false);
    if (!same) openMenu(btn, client);
  });

  function openMenu(btn, client) {
    activeBtn = btn; activeClient = client;
    btn.setAttribute("aria-expanded", "true");
    menu.hidden = false;
    var r = btn.getBoundingClientRect(), mw = menu.offsetWidth, mh = menu.offsetHeight;
    var top = r.bottom + 4;
    if (top + mh > window.innerHeight - 8) top = r.top - mh - 4;
    menu.style.top = Math.max(8, top) + "px";
    menu.style.left = Math.max(8, r.right - mw) + "px";
    menu.querySelector(".menu__item").focus();
  }
  function closeMenu(returnFocus) {
    if (!activeBtn) return;
    menu.hidden = true;
    activeBtn.setAttribute("aria-expanded", "false");
    if (returnFocus) activeBtn.focus();
    activeBtn = activeClient = null;
  }

  function say(text) {
    toast.textContent = text;
    toast.classList.add("toast--show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove("toast--show"); }, 2200);
  }

  listen(menu, "click", function (e) {
    var item = e.target.closest("[data-action]");
    if (!item || !activeClient) return;
    var names = { view: "Просмотр", edit: "Редактирование", delete: "Удаление" };
    var msg = names[item.dataset.action] + ": " + activeClient.name + " — скоро";
    closeMenu(true);
    say(msg);
  });
  listen(page, "click", function (e) {
    var demo = e.target.closest("[data-demo]");
    if (demo) say(demo.dataset.demo);
    closeMenu(false);
  });
  listen(document, "pointerdown", function (e) {
    if (activeBtn && !menu.contains(e.target) && !activeBtn.contains(e.target)) closeMenu(false);
  });
  listen(menu, "keydown", function (e) {
    const items = [...menu.querySelectorAll('[role="menuitem"]')];
    const index = items.indexOf(document.activeElement);
    if (e.key === "Escape") { e.preventDefault(); closeMenu(true); }
    else if (e.key === "Tab") closeMenu(false);
    else if (["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) {
      e.preventDefault();
      const next = e.key === "Home" ? 0 : e.key === "End" ? items.length - 1 : (index + (e.key === "ArrowUp" ? -1 : 1) + items.length) % items.length;
      items[next].focus();
    }
  });
  listen(window, "resize", function () { closeMenu(false); });
  listen(window, "scroll", function () { closeMenu(false); }, true);

  listen(checkAll, "change", function () {
    body.querySelectorAll('input[type=checkbox]').forEach(function (cb) { cb.checked = checkAll.checked; });
  });
  listen(find("search"), "input", function (e) {
    var q = e.target.value.trim().toLowerCase();
    render(all.filter(function (c) {
      return (c.name + " " + c.phone + " " + c.email).toLowerCase().indexOf(q) !== -1;
    }));
  });

  render(all);
  return function unmountClientsPage() {
    closeMenu(false);
    clearTimeout(toastTimer);
    cleanups.forEach(cleanup => cleanup());
    root.replaceChildren();
  };
}
