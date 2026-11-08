namespace Backend.Domain.Models;

public sealed class Section
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public required Guid WorkspaceId { get; set; }

    public Workspace? Workspace { get; set; }

    public required SectionType Type { get; set; }

    public required string Title { get; set; }

    public int Position { get; set; }

    public bool Enabled { get; set; } = true;
}
