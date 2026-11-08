console.log('BaseDesk frontend initialized.');

document.addEventListener('DOMContentLoaded', () => {
  // Динамические данные активной сессии
  const currentUser = {
    name: 'Александр',
    role: 'Разработчик',
    organization: 'BaseDesk'
  };

  // Отображаем вошедшего пользователя и организацию
  const nameEl = document.getElementById('user-display-name');
  const roleEl = document.getElementById('user-display-role');
  const orgEl = document.getElementById('user-display-org'); 
  const avatarEl = document.getElementById('user-avatar-initial');

  if (nameEl) nameEl.textContent = currentUser.name;
  if (roleEl) roleEl.textContent = currentUser.role;
  if (orgEl) orgEl.textContent = currentUser.organization;
  if (avatarEl && currentUser.name) avatarEl.textContent = currentUser.name.charAt(0).toUpperCase();

  // Логика переключения страниц
  const navLinks = document.querySelectorAll('.sidebar-nav a');
  const pages = document.querySelectorAll('.page-view');
  const pageTitle = document.getElementById('page-title');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('data-target');

      if (!targetId) return;

      pages.forEach(page => page.classList.remove('active'));
      navLinks.forEach(l => l.classList.remove('active'));

      const targetPage = document.getElementById(targetId);
      if (targetPage) targetPage.classList.add('active');

      link.classList.add('active');

      if (pageTitle) {
        const cleanText = link.textContent.trim();
        pageTitle.textContent = `Рабочее пространство — ${cleanText}`;
      }
    });
  });
});