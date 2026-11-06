export function mountHomePage(root, { data }) {
    const icons = {
        clients: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
        orders: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><path d="M9 14l2 2 4-4"></path></svg>`,
        warehouse: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>`,
        tasks: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>`
    };

    const sections = data?.sections || [
        { id: 'clients', title: 'Клиенты', desc: 'Храните контакты и информацию о клиентах.', icon: icons.clients, selected: true },
        { id: 'orders', title: 'Заказы', desc: 'Отслеживайте заказы и их выполнение.', icon: icons.orders, selected: true },
        { id: 'warehouse', title: 'Склад', desc: 'Учитывайте товары и контролируйте остатки.', icon: icons.warehouse, selected: false },
        { id: 'tasks', title: 'Задачи', desc: 'Планируйте работу и отслеживайте выполнение.', icon: icons.tasks, selected: true }
    ];

    const renderLogo = () => `
        <div class="base-logo-header">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L3 7V17L12 22V12V2Z" fill="#E5E7EB" stroke="#111827" stroke-width="1.5" stroke-linejoin="round"/>
                <path d="M12 2L21 7V17L12 22V12V2Z" fill="#111827" stroke="#111827" stroke-width="1.5" stroke-linejoin="round"/>
                <path d="M3 7L12 12L21 7L12 2L3 7Z" fill="#FFFFFF" stroke="#111827" stroke-width="1.5" stroke-linejoin="round"/>
            </svg>
            <span class="base-logo-text">BaseDesk</span>
        </div>
    `;

    const renderSteps = (activeStep) => `
        ${renderLogo()}
        <header class="base-steps">
            <!-- Для первого шага: если activeStep > 1, добавляем класс --completed -->
            <div class="base-step ${activeStep >= 1 ? 'base-step--active' : ''} ${activeStep > 1 ? 'base-step--completed' : ''}">
                <div class="base-step__circle">${activeStep > 1 ? '✓' : '1'}</div>
                <span class="base-step__label">Организация</span>
            </div>
            <div class="base-step__line"></div>
            <div class="base-step ${activeStep >= 2 ? 'base-step--active' : ''}">
                <div class="base-step__circle">2</div>
                <span class="base-step__label">Разделы</span>
            </div>
        </header>
    `;

    const renderStep1 = () => {
        root.innerHTML = `
            <div class="base-home-container">
                ${renderSteps(1)}

                <div class="base-title">
                    <h1>Создайте свою организацию</h1>
                    <p>Начните с основной информации. Остальные настройки можно изменить позже.</p>
                </div>

                <div class="base-form">
                    <div class="base-form-group">
                        <label>Название организации</label>
                        <div class="base-input-wrapper">
                            <svg class="base-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                            <input type="text" placeholder="Например, Студия Вектор" class="base-input">
                        </div>
                        <span class="base-hint">Это название будет отображаться в вашем рабочем пространстве.</span>
                    </div>

                    <div class="base-form-group">
                        <label>Описание организации (необязательно)</label>
                        <div class="base-input-wrapper base-textarea-wrapper">
                            <svg class="base-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                            <textarea placeholder="Кратко расскажите о вашей деятельности" class="base-textarea"></textarea>
                        </div>
                    </div>

                    <div class="base-form-group">
                        <label>Логотип организации (необязательно)</label>
                        <div class="base-upload-row">
                            <div class="base-upload-box">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                            </div>
                            <button class="btn-upload">
                                Загрузить логотип
                            </button>
                        </div>
                    </div>
                </div>

                <div class="base-actions">
                    <button class="btn btn--secondary">Назад</button>
                    <button class="btn btn--primary" id="btn-next">Продолжить</button>
                </div>
            </div>
        `;

        root.querySelector('#btn-next').addEventListener('click', () => {
            renderStep2();
        });
    };

    const renderStep2 = () => {
        root.innerHTML = `
            <div class="base-home-container">
                ${renderSteps(2)}

                <div class="base-title">
                    <h1>Настройте рабочее пространство</h1>
                    <p>Выберите разделы, которые нужны вашей организации. Вы сможете добавить другие позже.</p>
                </div>

                <div class="base-cards">
                    ${sections.map(sec => `
                        <label class="base-card ${sec.selected ? 'base-card--selected' : ''}">
                            <input type="checkbox" ${sec.selected ? 'checked' : ''}>
                            <div class="base-card__icon-wrapper">
                                <div class="base-card__icon">${sec.icon}</div>
                            </div>
                            <div class="base-card__content">
                                <h3>${sec.title}</h3>
                                <p>${sec.desc}</p>
                            </div>
                            <div class="base-card__check">✓</div>
                        </label>
                    `).join('')}
                </div>

                <div class="base-actions">
                    <button class="btn btn--secondary" id="btn-back">Назад</button>
                    <button class="btn btn--primary">Создать организацию</button>
                </div>
            </div>
        `;

        const cards = root.querySelectorAll('.base-card');
        cards.forEach(card => {
            const checkbox = card.querySelector('input');
            card.addEventListener('click', (e) => {
                if (e.target !== checkbox) checkbox.checked = !checkbox.checked;
                card.classList.toggle('base-card--selected', checkbox.checked);
            });
        });

        root.querySelector('#btn-back').addEventListener('click', () => {
            renderStep1();
        });
    };

    renderStep1();

    return () => {
        root.innerHTML = '';
    };
}