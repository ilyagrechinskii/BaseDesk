# BaseDesk API Contracts

Единый документ контрактов backend API BaseDesk.
Отражает состояние после итерации с in-memory реализацией.
С появлением EF Core меняется только внутреннее устройство — контракты остаются те же.

## Содержание

- [1. Общие соглашения](#1-общие-соглашения)
- [2. Маршруты](#2-маршруты)
- [3. DTO](#3-dto)
- [4. Эндпоинты](#4-эндпоинты)
- [5. Ошибки](#5-ошибки)
- [6. Валидация](#6-валидация)
- [7. Enum](#7-enum)

---

## 1. Общие соглашения

| Параметр | Значение |
|---|---|
| Base URL | `http://localhost:5261/api` |
| Content-Type | `application/json; charset=utf-8` |
| Формат свойств | `camelCase` |
| ID | `Guid` (строка в JSON) |
| Даты | ISO 8601 UTC (`2026-11-06T14:30:00Z`), тип `DateTimeOffset` |
| Null-поля | присутствуют в ответах явно, схема стабильна |
| Обновление | `PUT` — полная замена изменяемых полей (`PATCH` не поддерживается) |
| Trim | сервер обрезает `Name`/`Title`/`Description` перед сохранением |
| Навигация | в JSON отдаются только проекции, EF-навигации не сериализуются |

Все ошибки приходят в едином формате [`ErrorResponse`](#51-errorresponse).

---

## 2. Маршруты

### Организации

| Метод | Маршрут | Успех | Ошибки |
|---|---|---|---|
| `POST` | `/api/organizations` | `201 Created` + `Location` | `400`, `409` |
| `GET` | `/api/organizations/{id}` | `200 OK` | `400`, `404` |
| `PUT` | `/api/organizations/{id}` | `200 OK` | `400`, `404`, `409` |
| `DELETE` | `/api/organizations/{id}` | `204 No Content` | `400`, `404`, `409` |

### Рабочие пространства

| Метод | Маршрут | Успех | Ошибки |
|---|---|---|---|
| `GET` | `/api/organizations/{orgId}/workspaces` | `200 OK` | `400`, `404` |
| `POST` | `/api/organizations/{orgId}/workspaces` | `201 Created` + `Location` | `400`, `404`, `409` |
| `GET` | `/api/workspaces/{id}` | `200 OK` | `400`, `404` |
| `PUT` | `/api/workspaces/{id}` | `200 OK` | `400`, `404` |
| `DELETE` | `/api/workspaces/{id}` | `204 No Content` | `400`, `404` |

### Разделы

| Метод | Маршрут | Успех | Ошибки |
|---|---|---|---|
| `GET` | `/api/workspaces/{id}/sections` | `200 OK` | `400`, `404` |
| `PUT` | `/api/workspaces/{id}/sections` | `200 OK` | `400`, `404`, `409` |

### Служебные

| Метод | Маршрут | Успех |
|---|---|---|
| `GET` | `/api/health` | `200 OK` → `{"status":"ok"}` |

**Принципы:**
- `OrganizationId`/`WorkspaceId` берутся **из пути**, не из тела.
- Разделы обновляются **bulk-заменой** (полная замена списка), а не отдельными `POST/DELETE`.
- `DELETE /organizations/{id}` возвращает `409`, если есть workspace'ы. `DELETE /workspaces/{id}` каскадно удаляет разделы.

---

## 3. DTO

### 3.1. Организации

```csharp
public record CreateOrganizationRequest(
    string Name,          // required, 1–120 символов после trim
    string? Description); // optional, без ограничения длины

public record UpdateOrganizationRequest(
    string Name,
    string? Description);

public record OrganizationResponse(
    Guid Id,
    string Name,
    string? Description,
    DateTimeOffset CreatedAt,
    DateTimeOffset UpdatedAt,
    int WorkspaceCount,
    int MemberCount);
```

### 3.2. Рабочие пространства

```csharp
public record CreateWorkspaceRequest(
    string Name,                              // required, 1–120
    IReadOnlyList<SectionItemRequest>? Sections); // optional, атомарно с workspace

public record UpdateWorkspaceRequest(
    string Name);                              // разделы через PUT /sections

public record WorkspaceResponse(
    Guid Id,
    Guid OrganizationId,
    string Name,
    IReadOnlyList<SectionResponse> Sections);
```

### 3.3. Разделы

```csharp
public record SectionItemRequest(
    SectionType Type,     // required, enum
    string Title,         // required, 1–80
    int Position,         // required, >= 0, уникален в workspace
    bool? Enabled);       // optional, null → true

public record UpdateSectionsRequest(
    IReadOnlyList<SectionItemRequest> Sections);  // полная замена

public record SectionResponse(
    Guid Id,
    Guid WorkspaceId,
    SectionType Type,
    string Title,
    int Position,
    bool Enabled);
```

---

## 4. Эндпоинты

### 4.1. Создание организации

curl.exe -i -X POST http://localhost:5261/api/organizations -H "Content-Type: application/json" -d "{\"name\":\"Тест\",\"description\":null}"

**Ответ `201 Created`** (`Location: /api/organizations/{guid}`):

### 4.2. Получение организации

curl.exe -i http://localhost:5261/api/organizations/{id}

**Ответ `200 OK`** — тот же `OrganizationResponse`.

**Ответ `404 Not Found`:**

### 4.3. Обновление организации

curl.exe -i -X PUT http://localhost:5261/api/organizations/{id} -H "Content-Type: application/json" -d @body-update.json

**Ответ `200 OK`** — обновлённый `OrganizationResponse`.

### 4.4. Удаление организации

curl.exe -i -X DELETE http://localhost:5261/api/organizations/{id}

**Ответ `204 No Content`** — без тела.

**Ответ `409 Conflict`** — если есть workspace'ы:

### 4.5. Список рабочих пространств

curl.exe -i http://localhost:5261/api/organizations/{orgId}/workspaces

**Ответ `200 OK`:**

### 4.6. Создание рабочего пространства (с разделами атомарно)

curl.exe -i -X POST http://localhost:5261/api/organizations/{orgId}/workspaces -H "Content-Type: application/json" -d @workspace.json

**Ответ `201 Created`** (`Location: /api/workspaces/{guid}`):

```json
{
  "id": "8c2d2e0a-1b3c-4d5e-8f7a-9b0c1d2e3f40",
  "organizationId": "3f2504e0-4f89-41d3-9a0c-0305e82c3301",
  "name": "Основное",
  "sections": [
    {
      "id": "a1b2c3d4-1111-2222-3333-444455556666",
      "workspaceId": "8c2d2e0a-1b3c-4d5e-8f7a-9b0c1d2e3f40",
      "type": "clients",
      "title": "Клиенты",
      "position": 0,
      "enabled": true
    },
    {
      "id": "a1b2c3d4-7777-8888-9999-000011112222",
      "workspaceId": "8c2d2e0a-1b3c-4d5e-8f7a-9b0c1d2e3f40",
      "type": "tasks",
      "title": "Задачи",
      "position": 1,
      "enabled": true
    }
  ]
}
```

### 4.7. Получение рабочего пространства

curl.exe -i http://localhost:5261/api/workspaces/{wsId}

**Ответ `200 OK`** — `WorkspaceResponse`.

### 4.8. Обновление рабочего пространства

curl.exe -i -X PUT http://localhost:5261/api/workspaces/{wsId}/sections -H "Content-Type: application/json" -d @sections.json

**Ответ `200 OK`** — `WorkspaceResponse`.

Разделы этим запросом не трогаются — для них отдельный `PUT /sections`.


---

## 5. Ошибки

### 5.1. ErrorResponse

Единый формат всех ошибок (400, 404, 405, 409, 415, 500):

```json
{
  "code": "string",
  "message": "string",
  "details": [
    { "field": "string", "message": "string" }
  ]
}
```

- `code` — машиночитаемый идентификатор, стабилен.
- `message` — человекочитаемое сообщение.
- `details` — только для `validation_error`, иначе `null`.

### 5.2. Коды ошибок

| `code` | HTTP | Когда |
|---|---|---|
| `validation_error` | `400` | DataAnnotations, `IValidatableObject`, whitespace-only `Name`/`Title` |
| `invalid_request` | `400` | невалидный JSON, неверный enum, пустой `Guid` |
| `not_found` | `404` | ресурс не найден |
| `method_not_allowed` | `405` | неподдерживаемый HTTP-метод |
| `conflict` | `409` | дубликат, удаление с зависимостями |
| `unsupported_media_type` | `415` | неверный `Content-Type` |
| `internal_error` | `500` | непредвиденная ошибка (без stack trace) |

### 5.3. Примеры

**`400 validation_error`:**

```json
{
  "code": "validation_error",
  "message": "Одно или несколько полей заполнены некорректно.",
  "details": [
    { "field": "name", "message": "Поле обязательно, от 1 до 120 символов." }
  ]
}
```

**`400 invalid_request` (плохой JSON):**

```json
{ "code": "invalid_request", "message": "Запрос содержит некорректные данные." }
```

**`404 not_found`:**

```json
{ "code": "not_found", "message": "Рабочее пространство 8c2d... не найдено." }
```

**`409 conflict`:**

```json
{
  "code": "conflict",
  "message": "Организация с таким названием уже существует."
}
```

**`500 internal_error`:**

```json
{
  "code": "internal_error",
  "message": "Внутренняя ошибка сервера. Попробуйте позже."
}
```

### 5.4. Сводка по операциям

| Операция | Успех | Ошибки |
|---|---|---|
| `GET` (список) | `200` | `400`, `404`, `500` |
| `GET` (по id) | `200` | `400`, `404`, `500` |
| `POST` | `201` + `Location` | `400`, `404`, `409`, `500` |
| `PUT` | `200` | `400`, `404`, `409`, `500` |
| `DELETE` | `204` | `400`, `404`, `409`, `500` |

---

## 6. Валидация

| Поле / правило | Правило | `code` при нарушении |
|---|---|---|
| `Organization.Name`, `Workspace.Name` | обязательное, 1–120 символов после trim | `validation_error` |
| `Section.Title` | обязательное, 1–80 символов после trim | `validation_error` |
| `Section.Position` | `>= 0` | `validation_error` |
| `Section.Type` | допустимое значение enum | `invalid_request` / `validation_error` |
| Уникальность `Type` в workspace | проверяется в `IValidatableObject` + store | `validation_error` |
| Уникальность `Position` в workspace | проверяется в `IValidatableObject` + store | `validation_error` |
| `Description` | без ограничения длины (MVP) | — |
| `Organization.Name` уникально (case-insensitive) | проверка в store | `conflict` |
| Trim | выполняется в handler'ах, whitespace-only → `400` | `validation_error` |

**Порядок проверок в запросе:**
1. JSON-парсинг → `invalid_request` при ошибке.
2. `DataAnnotations` на корне DTO и вложенных элементах → `validation_error`.
3. `IValidatableObject.Validate()` (уникальность, cross-field) → `validation_error`.
4. Trim в handler'ах → `validation_error`, если пусто.
5. Проверки в store (уникальность имени, существование родителя, зависимости) → `conflict` / `not_found`.

---

## 7. Enum

### 7.1. SectionType

| Значение | JSON |
|---|---|
| `Clients` | `"clients"` |
| `Orders` | `"orders"` |
| `Warehouse` | `"warehouse"` |
| `Tasks` | `"tasks"` |

**Сериализация** — всегда нижний регистр (`JsonStringEnumConverter` + `CamelCase`).

**Десериализация** — регистронезависима: `"clients"`, `"Clients"`, `"CLIENTS"` — валидны.

Недопустимое значение (`"projects"`) → `400 invalid_request`.

### 7.2. OrganizationRole

| Значение | JSON |
|---|---|
| `Owner` | `"owner"` |
| `Employee` | `"employee"` |

DTO участников пока не реализованы, enum зарезервирован для будущих эндпоинтов.