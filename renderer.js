document.addEventListener('DOMContentLoaded', () => {
  const navItems = document.querySelectorAll('.nav-item');
  const contentContainer = document.getElementById('app-content');

  // Функция загрузки страницы
  async function loadPage(pageName) {
    try {
      // Здесь можно подгружать html-фрагменты страниц
      const response = await fetch(`pages/${pageName}.html`);
      if (!response.ok) throw new Error('Не удалось загрузить страницу');
      const html = await response.text();
      contentContainer.innerHTML = html;
      
      // Обновляем класс активного пункта в сайдбаре
      navItems.forEach(item => {
        if (item.dataset.page === pageName) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    } catch (error) {
      console.error('Ошибка навигации:', error);
      contentContainer.innerHTML = `<div class="error">Страница "${pageName}" в разработке или недоступна.</div>`;
    }
  }

  // Обработка кликов по меню
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const page = item.dataset.page;
      if (page) {
        loadPage(page);
        // Меняем URL в истории без перезагрузки (опционально)
        window.history.pushState({ page }, '', `#${page}`);
      }
    });
  });

  // Загрузка начальной страницы по хешу или по умолчанию 'home'
  const initialPage = window.location.hash.replace('#', '') || 'home';
  loadPage(initialPage);
});