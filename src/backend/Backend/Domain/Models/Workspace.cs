namespace Backend.Domain.Models;

public sealed class Workspace
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public required string Name { get; set; }

    public required Guid OrganizationId { get; set; }

    public Organization? Organization { get; set; }

    public ICollection<Section> Sections { get; set; } = new List<Section>();
}
