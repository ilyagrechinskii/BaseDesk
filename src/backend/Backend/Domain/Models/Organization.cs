using System.ComponentModel.DataAnnotations;

namespace Backend.Domain.Models;

public sealed class Organization : IValidatableObject
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required, StringLength(120)]
    public required string Name { get; set; }

    public string? Description { get; set; }

    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;

    public ICollection<Workspace> Workspaces { get; set; } = new List<Workspace>();

    public ICollection<OrganizationMember> Members { get; set; } = new List<OrganizationMember>();

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (Id == Guid.Empty)
        {
            yield return new ValidationResult("Id must not be empty.", [nameof(Id)]);
        }
    }
}
