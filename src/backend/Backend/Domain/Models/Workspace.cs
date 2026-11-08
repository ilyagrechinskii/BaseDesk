using System.ComponentModel.DataAnnotations;

namespace Backend.Domain.Models;

public sealed class Workspace : IValidatableObject
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required, StringLength(120)]
    public required string Name { get; set; }

    public required Guid OrganizationId { get; set; }

    public Organization? Organization { get; set; }

    public ICollection<Section> Sections { get; set; } = new List<Section>();

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (Id == Guid.Empty)
        {
            yield return new ValidationResult("Id must not be empty.", [nameof(Id)]);
        }

        if (OrganizationId == Guid.Empty)
        {
            yield return new ValidationResult("OrganizationId must not be empty.", [nameof(OrganizationId)]);
        }
    }
}
