using Backend.Contracts.Sections;

namespace Backend.Infrastructure;

public sealed class OrganizationEntity
{
    public Guid Id { get; init; }
    public string Name { get; set; } = "";
    public string? Description { get; set; }
    public DateTimeOffset CreatedAt { get; init; }
    public DateTimeOffset UpdatedAt { get; set; }
}

public sealed class WorkspaceEntity
{
    public Guid Id { get; init; }
    public Guid OrganizationId { get; init; }
    public string Name { get; set; } = "";
    public List<SectionEntity> Sections { get; set; } = new();
}

public sealed class SectionEntity
{
    public Guid Id { get; init; }
    public Guid WorkspaceId { get; init; }
    public SectionType Type { get; init; }
    public string Title { get; set; } = "";
    public int Position { get; set; }
    public bool Enabled { get; set; }
}