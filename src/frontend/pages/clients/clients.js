(function () {
  "use strict";
  var forceEmpty = /[?&]empty\b/.test(location.search) || location.hash === "#empty";
  var all = forceEmpty ? [] : (window.CLIENTS_MOCK || []);
  var body = document.getElementById("clients-body");
  var table = document.getElementById("clients-table");
  var empty = document.getElementById("empty-state");
  var foot = document.getElementById("foot");
  var count = document.getElementById("count");
  var menu = document.getElementById("row-menu");
  var toast = document.getElementById("toast");
  var checkAll = document.getElementById("check-all");
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

  function render(list) {
    var has = list.length > 0;
    table.hidden = !has;
    foot.hidden = !has;
    empty.hidden = has;
    checkAll.checked = false;
    if (!has) {
      var searching = all.length > 0;
      document.getElementById("empty-title").textContent = searching ? "Ничего не найдено" : "Клиентов пока нет";
      document.getElementById("empty-text").textContent = searching ? "Попробуйте изменить запрос." : "Добавьте первого клиента, чтобы он появился в списке.";
      document.getElementById("empty-add").hidden = searching;
    }
    count.textContent = "Показано 1–" + list.length + " из " + list.length;
    body.innerHTML = list.map(function (c, i) {
      var col = COLORS[i % COLORS.length];
      return '<tr data-id="' + c.id + '">' +
        '<td class="col-check"><input type="checkbox" aria-label="Выбрать ' + esc(c.name) + '"></td>' +
        '<td><div class="who"><span class="avatar" style="background:' + col[0] + ';color:' + col[1] + '">' + esc(c.name.charAt(0)) + '</span>' +
        '<div><div class="who__name">' + esc(c.name) + '</div><div class="who__sub">Клиент с ' + esc(c.since) + '</div></div></div></td>' +
        '<td><span class="contact">' + ICON_PHONE + esc(c.phone) + '</span></td>' +
        '<td><span class="contact">' + ICON_MAIL + esc(c.email) + '</span></td>' +
        '<td class="col-actions"><button type="button" class="row-menu-btn" aria-haspopup="menu" aria-expanded="false" aria-label="Действия: ' + esc(c.name) + '">' + ICON_DOTS + '</button></td></tr>';
    }).join("");
  }

  body.addEventListener("click", function (e) {
    var btn = e.target.closest(".row-menu-btn");
    if (!btn) return;
    e.stopPropagation();
    var id = Number(btn.closest("tr").dataset.id);
    var client = all.filter(function (c) { return c.id === id; })[0];
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

  menu.addEventListener("click", function (e) {
    var item = e.target.closest("[data-action]");
    if (!item || !activeClient) return;
    var names = { view: "Просмотр", edit: "Редактирование", delete: "Удаление" };
    var msg = names[item.dataset.action] + ": " + activeClient.name + " — скоро";
    closeMenu(true);
    say(msg);
  });
  document.addEventListener("click", function (e) {
    var demo = e.target.closest("[data-demo]");
    if (demo) say(demo.dataset.demo);
    closeMenu(false);
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(true); });
  window.addEventListener("resize", function () { closeMenu(false); });
  window.addEventListener("scroll", function () { closeMenu(false); }, true);

  checkAll.addEventListener("change", function () {
    body.querySelectorAll('input[type=checkbox]').forEach(function (cb) { cb.checked = checkAll.checked; });
  });
  document.getElementById("search").addEventListener("input", function (e) {
    var q = e.target.value.trim().toLowerCase();
    render(all.filter(function (c) {
      return (c.name + " " + c.phone + " " + c.email).toLowerCase().indexOf(q) !== -1;
    }));
  });

  render(all);
})();
