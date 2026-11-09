(function () {
  "use strict";
  var forceEmpty = /[?&]empty\b/.test(location.search) || location.hash === "#empty";
  var all = forceEmpty ? [] : (window.CLIENTS_MOCK || []).slice();
  var body = document.getElementById("clients-body");
  var table = document.getElementById("clients-table");
  var empty = document.getElementById("empty-state");
  var foot = document.getElementById("foot");
  var count = document.getElementById("count");
  var menu = document.getElementById("row-menu");
  var toast = document.getElementById("toast");
  var checkAll = document.getElementById("check-all");
  var searchInput = document.getElementById("search");
  var activeBtn = null, activeClient = null, deletingClient = null, toastTimer;

  var modalForm = document.getElementById("modal-form");
  var modalView = document.getElementById("modal-view");
  var modalDelete = document.getElementById("modal-delete");
  var clientForm = document.getElementById("client-form");

  var COLORS = [["#dbeafe","#1d4ed8"],["#e4e0fb","#5b3fd0"],["#d9f5e5","#15803d"],["#fde6d3","#c2570c"],["#fbdcec","#be185d"]];
  var ICON_PHONE = '<svg viewBox="0 0 24 24"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z"/></svg>';
  var ICON_MAIL = '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>';
  var ICON_DOTS = '<svg viewBox="0 0 24 24" style="fill:currentColor;stroke:none"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg>';

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function getFiltered() {
    var q = searchInput.value.trim().toLowerCase();
    if (!q) return all;
    return all.filter(function (c) {
      return (c.name + " " + c.phone + " " + c.email).toLowerCase().indexOf(q) !== -1;
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

  function clearErrors() {
    ["name", "phone", "email"].forEach(function (k) {
      document.getElementById("field-" + k).classList.remove("is-invalid");
      document.getElementById("err-" + k).textContent = "";
    });
  }

  function closeModals() {
    modalForm.hidden = true;
    modalView.hidden = true;
    modalDelete.hidden = true;
    clearErrors();
  }

  function openCreateModal() {
    closeModals();
    clientForm.reset();
    document.getElementById("field-id").value = "";
    document.getElementById("field-since").value = new Date().getFullYear();
    document.getElementById("modal-form-title").textContent = "Добавить клиента";
    modalForm.hidden = false;
    document.getElementById("field-name").focus();
  }

  function openEditModal(client) {
    closeModals();
    document.getElementById("field-id").value = client.id;
    document.getElementById("field-name").value = client.name;
    document.getElementById("field-phone").value = client.phone;
    document.getElementById("field-email").value = client.email;
    document.getElementById("field-since").value = client.since || 2026;
    document.getElementById("field-notes").value = client.notes || "";
    document.getElementById("modal-form-title").textContent = "Редактировать клиента";
    modalForm.hidden = false;
    document.getElementById("field-name").focus();
  }

  function openViewModal(client) {
    closeModals();
    document.getElementById("view-details").innerHTML =
      '<div class="details__row"><span class="details__label">Имя</span><strong>' + esc(client.name) + '</strong></div>' +
      '<div class="details__row"><span class="details__label">Клиент с</span><span>' + esc(client.since) + ' г.</span></div>' +
      '<div class="details__row"><span class="details__label">Телефон</span><span>' + esc(client.phone) + '</span></div>' +
      '<div class="details__row"><span class="details__label">Email</span><span>' + esc(client.email) + '</span></div>' +
      '<div class="details__row"><span class="details__label">Заметки</span><span>' + esc(client.notes || "Нет заметок") + '</span></div>';
    document.getElementById("view-edit-btn").onclick = function () {
      openEditModal(client);
    };
    modalView.hidden = false;
  }

  function openDeleteModal(client) {
    closeModals();
    deletingClient = client;
    document.getElementById("delete-client-name").textContent = client.name;
    modalDelete.hidden = false;
  }

  function validate(name, phone, email) {
    clearErrors();
    var valid = true;
    if (!name || name.length < 2) {
      document.getElementById("field-name").classList.add("is-invalid");
      document.getElementById("err-name").textContent = "Введите имя или название (мин. 2 символа)";
      valid = false;
    }
    if (!phone || phone.replace(/\D/g, "").length < 10) {
      document.getElementById("field-phone").classList.add("is-invalid");
      document.getElementById("err-phone").textContent = "Введите корректный телефон (мин. 10 цифр)";
      valid = false;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      document.getElementById("field-email").classList.add("is-invalid");
      document.getElementById("err-email").textContent = "Введите корректный email";
      valid = false;
    }
    return valid;
  }

  clientForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var idVal = document.getElementById("field-id").value;
    var name = document.getElementById("field-name").value.trim();
    var phone = document.getElementById("field-phone").value.trim();
    var email = document.getElementById("field-email").value.trim();
    var since = Number(document.getElementById("field-since").value) || 2026;
    var notes = document.getElementById("field-notes").value.trim();

    if (!validate(name, phone, email)) return;

    if (idVal) {
      var target = all.filter(function (c) { return c.id === Number(idVal); })[0];
      if (target) {
        target.name = name;
        target.phone = phone;
        target.email = email;
        target.since = since;
        target.notes = notes;
      }
      say("Клиент «" + name + "» обновлён");
    } else {
      var nextId = all.reduce(function (m, c) { return Math.max(m, c.id); }, 0) + 1;
      all.unshift({ id: nextId, name: name, since: since, phone: phone, email: email, notes: notes });
      say("Клиент «" + name + "» добавлен");
    }

    closeModals();
    render(getFiltered());
  });

  document.getElementById("confirm-delete-btn").addEventListener("click", function () {
    if (!deletingClient) return;
    var removedName = deletingClient.name;
    all = all.filter(function (c) { return c.id !== deletingClient.id; });
    deletingClient = null;
    closeModals();
    render(getFiltered());
    say("Клиент «" + removedName + "» удалён");
  });

  document.getElementById("add-client-btn").addEventListener("click", openCreateModal);
  document.getElementById("empty-add").addEventListener("click", openCreateModal);
  document.getElementById("back-btn").addEventListener("click", function () {
    window.location.href = "../home/index.html";
  });

  document.querySelectorAll("[data-close-modal]").forEach(function (btn) {
    btn.addEventListener("click", closeModals);
  });

  [modalForm, modalView, modalDelete].forEach(function (ov) {
    ov.addEventListener("click", function (e) {
      if (e.target === ov) closeModals();
    });
  });

  menu.addEventListener("click", function (e) {
    var item = e.target.closest("[data-action]");
    if (!item || !activeClient) return;
    var client = activeClient;
    var action = item.dataset.action;
    closeMenu(false);
    if (action === "view") openViewModal(client);
    if (action === "edit") openEditModal(client);
    if (action === "delete") openDeleteModal(client);
  });

  document.addEventListener("click", function (e) {
    var demo = e.target.closest("[data-demo]");
    if (demo) say(demo.dataset.demo);
    closeMenu(false);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeMenu(true);
      closeModals();
    }
  });
  window.addEventListener("resize", function () { closeMenu(false); });
  window.addEventListener("scroll", function () { closeMenu(false); }, true);

  checkAll.addEventListener("change", function () {
    body.querySelectorAll("input[type=checkbox]").forEach(function (cb) { cb.checked = checkAll.checked; });
  });

  searchInput.addEventListener("input", function () {
    render(getFiltered());
  });

  render(all);
})();