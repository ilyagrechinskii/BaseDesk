using System.ComponentModel.DataAnnotations;

namespace Backend.Domain.Models;

public sealed class Section : IValidatableObject
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public required Guid WorkspaceId { get; set; }

    public Workspace? Workspace { get; set; }

    [EnumDataType(typeof(SectionType))]
    public required SectionType Type { get; set; }

    [Required, StringLength(80)]
    public required string Title { get; set; }

    [Range(0, int.MaxValue)]
    public int Position { get; set; }

    public bool Enabled { get; set; } = true;

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (Id == Guid.Empty)
        {
            yield return new ValidationResult("Id must not be empty.", [nameof(Id)]);
        }

        if (WorkspaceId == Guid.Empty)
        {
            yield return new ValidationResult("WorkspaceId must not be empty.", [nameof(WorkspaceId)]);
        }
    }
}
