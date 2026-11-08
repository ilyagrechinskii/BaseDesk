using System.Collections.Concurrent;
using Backend.Contracts.Sections;

namespace Backend.Infrastructure;

public sealed class InMemoryStore
{
    private readonly ConcurrentDictionary<Guid, OrganizationEntity> _organizations = new();
    private readonly ConcurrentDictionary<Guid, WorkspaceEntity> _workspaces = new();

    // Lock дл€ операций, требующих атомарности по нескольким запис€м
    // (уникальность имЄн, каскадные проверки, bulk-replace разделов).
    private readonly object _sync = new();

    // ---------- Organizations ----------

    public StoreResult<OrganizationEntity> CreateOrganization(string name, string? description)
    {
        lock (_sync)
        {
            if (_organizations.Values.Any(o =>
                    string.Equals(o.Name, name, StringComparison.OrdinalIgnoreCase)))
                return StoreResult<OrganizationEntity>.Conflict(
                    "ќрганизаци€ с таким названием уже существует.");

            var now = DateTimeOffset.UtcNow;
            var org = new OrganizationEntity
            {
                Id = Guid.NewGuid(),
                Name = name,
                Description = description,
                CreatedAt = now,
                UpdatedAt = now
            };
            _organizations[org.Id] = org;
            return StoreResult<OrganizationEntity>.Ok(org);
        }
    }

    public OrganizationEntity? GetOrganization(Guid id) =>
        _organizations.TryGetValue(id, out var org) ? org : null;

    public StoreResult<OrganizationEntity> UpdateOrganization(Guid id, string name, string? description)
    {
        lock (_sync)
        {
            if (!_organizations.TryGetValue(id, out var org))
                return StoreResult<OrganizationEntity>.NotFound($"ќрганизаци€ {id} не найдена.");

            if (_organizations.Values.Any(o =>
                    o.Id != id &&
                    string.Equals(o.Name, name, StringComparison.OrdinalIgnoreCase)))
                return StoreResult<OrganizationEntity>.Conflict(
                    "ќрганизаци€ с таким названием уже существует.");

            org.Name = name;
            org.Description = description;
            org.UpdatedAt = DateTimeOffset.UtcNow;
            return StoreResult<OrganizationEntity>.Ok(org);
        }
    }

    public StoreResult<bool> DeleteOrganization(Guid id)
    {
        lock (_sync)
        {
            if (!_organizations.ContainsKey(id))
                return StoreResult<bool>.NotFound($"ќрганизаци€ {id} не найдена.");

            if (_workspaces.Values.Any(w => w.OrganizationId == id))
                return StoreResult<bool>.Conflict(
                    "ќрганизаци€ содержит рабочие пространства. ”далите их перед удалением организации.");

            _organizations.TryRemove(id, out _);
            return StoreResult<bool>.Ok(true);
        }
    }

    public (int WorkspaceCount, int MemberCount) GetCounts(Guid organizationId)
    {
        var wsCount = _workspaces.Values.Count(w => w.OrganizationId == organizationId);
        // Members пока не реализованы; владелец = 1.
        return (wsCount, 1);
    }

    // ---------- Workspaces ----------

    public bool OrganizationExists(Guid id) => _organizations.ContainsKey(id);

    public IReadOnlyList<WorkspaceEntity> ListWorkspaces(Guid organizationId) =>
        _workspaces.Values
            .Where(w => w.OrganizationId == organizationId)
            .OrderBy(w => w.Name, StringComparer.OrdinalIgnoreCase)
            .ToList();

    public StoreResult<WorkspaceEntity> CreateWorkspace(
        Guid organizationId, string name, IReadOnlyList<SectionItemRequest>? sections)
    {
        lock (_sync)
        {
            if (!_organizations.ContainsKey(organizationId))
                return StoreResult<WorkspaceEntity>.NotFound(
                    $"ќрганизаци€ {organizationId} не найдена.");

            var wsId = Guid.NewGuid();
            var ws = new WorkspaceEntity
            {
                Id = wsId,
                OrganizationId = organizationId,
                Name = name,
                Sections = (sections ?? Array.Empty<SectionItemRequest>())
                    .Select(s => new SectionEntity
                    {
                        Id = Guid.NewGuid(),
                        WorkspaceId = wsId,
                        Type = s.Type,
                        Title = s.Title,
                        Position = s.Position,
                        Enabled = s.Enabled ?? true
                    })
                    .OrderBy(s => s.Position)
                    .ToList()
            };
            _workspaces[ws.Id] = ws;
            return StoreResult<WorkspaceEntity>.Ok(ws);
        }
    }

    public WorkspaceEntity? GetWorkspace(Guid id) =>
        _workspaces.TryGetValue(id, out var ws) ? ws : null;

    public StoreResult<WorkspaceEntity> UpdateWorkspace(Guid id, string name)
    {
        lock (_sync)
        {
            if (!_workspaces.TryGetValue(id, out var ws))
                return StoreResult<WorkspaceEntity>.NotFound(
                    $"–абочее пространство {id} не найдено.");

            ws.Name = name;
            return StoreResult<WorkspaceEntity>.Ok(ws);
        }
    }

    public StoreResult<bool> DeleteWorkspace(Guid id)
    {
        lock (_sync)
        {
            if (!_workspaces.TryRemove(id, out _))
                return StoreResult<bool>.NotFound(
                    $"–абочее пространство {id} не найдено.");
            return StoreResult<bool>.Ok(true);
        }
    }

    // ---------- Sections ----------

    public IReadOnlyList<SectionEntity>? GetSections(Guid workspaceId) =>
        _workspaces.TryGetValue(workspaceId, out var ws)
            ? ws.Sections.OrderBy(s => s.Position).ToList()
            : null;

    public StoreResult<IReadOnlyList<SectionEntity>> ReplaceSections(
        Guid workspaceId, IReadOnlyList<SectionItemRequest> request)
    {
        lock (_sync)
        {
            if (!_workspaces.TryGetValue(workspaceId, out var ws))
                return StoreResult<IReadOnlyList<SectionEntity>>.NotFound(
                    $"–абочее пространство {workspaceId} не найдено.");

            var existingByType = ws.Sections.ToDictionary(s => s.Type);
            var newList = new List<SectionEntity>(request.Count);

            foreach (var item in request)
            {
                if (existingByType.TryGetValue(item.Type, out var existing))
                {
                    existing.Title = item.Title;
                    existing.Position = item.Position;
                    existing.Enabled = item.Enabled ?? true;
                    newList.Add(existing);
                }
                else
                {
                    newList.Add(new SectionEntity
                    {
                        Id = Guid.NewGuid(),
                        WorkspaceId = workspaceId,
                        Type = item.Type,
                        Title = item.Title,
                        Position = item.Position,
                        Enabled = item.Enabled ?? true
                    });
                }
            }

            ws.Sections = newList.OrderBy(s => s.Position).ToList();
            return StoreResult<IReadOnlyList<SectionEntity>>.Ok(ws.Sections);
        }
    }
}