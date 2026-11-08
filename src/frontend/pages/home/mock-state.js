const sectionTitles = {
    clients: 'Клиенты',
    orders: 'Заказы',
    warehouse: 'Склад',
    tasks: 'Задачи',
};

const state = {
    organizations: [],
    workspaces: [],
    sections: [],
    activeOrganizationId: null,
    activeWorkspaceId: null,
};

export function getMockState() {
    return structuredClone(state);
}

export function createMockOrganization({ name, description = '', sectionKeys }) {
    const normalizedName = typeof name === 'string' ? name.trim() : '';
    if (!normalizedName || normalizedName.length > 120) {
        throw new Error('Название организации должно содержать от 1 до 120 символов.');
    }
    if (typeof description !== 'string') {
        throw new Error('Описание должно быть строкой.');
    }
    if (!Array.isArray(sectionKeys) || sectionKeys.some(key => !Object.hasOwn(sectionTitles, key))) {
        throw new Error('Выбраны неизвестные разделы.');
    }

    const timestamp = new Date().toISOString();
    const organization = {
        id: crypto.randomUUID(),
        name: normalizedName,
        description: description.trim() || null,
        createdAt: timestamp,
        updatedAt: timestamp,
    };
    const workspace = {
        id: crypto.randomUUID(),
        organizationId: organization.id,
        name: 'Основное рабочее пространство',
    };
    const sections = [...new Set(sectionKeys)].map((key, position) => ({
        id: crypto.randomUUID(),
        workspaceId: workspace.id,
        key,
        title: sectionTitles[key],
        position,
        enabled: true,
    }));

    state.organizations.push(organization);
    state.workspaces.push(workspace);
    state.sections.push(...sections);
    state.activeOrganizationId = organization.id;
    state.activeWorkspaceId = workspace.id;

    return structuredClone({ organization, workspace, sections });
}
