(function () {
  "use strict";
  var sections = window.HOME_SECTIONS_MOCK || [];
  var grid = document.getElementById("sections-grid");
  var aiBtn = document.getElementById("ai-toggle-btn");
  var aiBox = document.getElementById("ai-box");
  var addBtn = document.getElementById("add-section-btn");
  var toast = document.getElementById("toast");
  var toastTimer;

  var ICON_ARROW = '<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  var ICON_DOC = '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9h10M7 13h6"/></svg>';

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function say(text) {
    toast.textContent = text;
    toast.classList.add("toast--show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove("toast--show"); }, 2200);
  }

  function render() {
    grid.innerHTML = sections.map(function (s) {
      return '<article class="section-card" tabindex="0" role="link" data-section="' + esc(s.id) + '" data-route="' + esc(s.route) + '">' +
        '<div>' +
          '<div class="section-card__top">' +
            '<span class="section-card__icon section-card__icon--' + esc(s.theme) + '">' + s.icon + '</span>' +
            '<span class="section-card__arrow">' + ICON_ARROW + '</span>' +
          '</div>' +
          '<h2 class="section-card__title">' + esc(s.title) + '</h2>' +
          '<p class="section-card__desc">' + esc(s.desc) + '</p>' +
        '</div>' +
        '<div class="section-card__meta">' + ICON_DOC + '<span>' + esc(s.countText) + '</span></div>' +
      '</article>';
    }).join("");
  }

  function openSection(card) {
    var section = card.dataset.section;
    var route = card.dataset.route;
    window.dispatchEvent(new CustomEvent("basedesk:navigate", { detail: { section: section, route: route } }));
    if (typeof window.onBaseDeskNavigate === "function") {
      window.onBaseDeskNavigate(section, route);
      return;
    }
    if (route && route.charAt(0) !== "#") {
      window.location.href = route;
    } else {
      say("Переход в раздел «" + card.querySelector(".section-card__title").textContent + "»");
    }
  }

  grid.addEventListener("click", function (e) {
    var card = e.target.closest(".section-card");
    if (card) openSection(card);
  });

  grid.addEventListener("keydown", function (e) {
    var card = e.target.closest(".section-card");
    if (card && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      openSection(card);
    }
  });

  aiBtn.addEventListener("click", function () {
    var active = aiBox.classList.toggle("is-active");
    aiBtn.classList.toggle("is-active", active);
    aiBtn.setAttribute("aria-expanded", String(active));
    say(active ? "Блок ИИ выделен" : "Блок ИИ скрыт");
  });

  addBtn.addEventListener("click", function () {
    say("Каталог шаблонов разделов — скоро");
  });

  document.addEventListener("click", function (e) {
    var demo = e.target.closest("[data-demo]");
    if (demo) say(demo.dataset.demo);
  });

  render();
})();