// Mock-данные экрана. status, lastContact, owner и initials — поля представления референса,
// они пока не входят в согласованный API DTO Client.
// Только preview; страница получает данные через mountClientsPage.
export const clientsMock = [
  { id: 1, name: "Альфа ООО", since: 2024, phone: "+7 901 234-56-78", email: "alpha@company.ru", initials: "АО", status: "active", lastContact: "2025-04-12", owner: "Илья Гречинский" },
  { id: 2, name: "Бета Плюс", since: 2023, phone: "+7 965 432-10-98", email: "beta@plus.ru", initials: "Б", status: "active", lastContact: "2025-04-08", owner: "Наталья Иванова" },
  { id: 3, name: "Гамма Тех", since: 2024, phone: "+7 922 555-77-88", email: "gamma@tech.ru", initials: "Г", status: "inProgress", lastContact: "2025-04-03", owner: "Александр Петров" },
  { id: 4, name: "Дельта",    since: 2025, phone: "+7 916 111-22-33", email: "delta@mail.ru", initials: "Д", status: "new", lastContact: "2025-03-21", owner: "Илья Гречинский" },
  { id: 5, name: "Эпсилон",   since: 2023, phone: "+7 905 444-55-66", email: "epsilon@group.ru", initials: "Э", status: "active", lastContact: "2025-03-17", owner: "Наталья Иванова" },
  { id: 6, name: "Зета",      since: 2024, phone: "+7 980 777-66-55", email: "zeta@company.ru", initials: "З", status: "inProgress", lastContact: "2025-03-10", owner: "Александр Петров" },
  { id: 7, name: "Омега",     since: 2025, phone: "+7 999 888-77-66", email: "omega@ru.com", initials: "О", status: "new", lastContact: "2025-03-05", owner: "Илья Гречинский" }
];
