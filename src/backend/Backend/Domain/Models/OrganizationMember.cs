using System.ComponentModel.DataAnnotations;

namespace Backend.Domain.Models;

public sealed class OrganizationMember : IValidatableObject
{
    public required Guid OrganizationId { get; set; }

    public Organization? Organization { get; set; }

    public required Guid UserId { get; set; }

    [EnumDataType(typeof(OrganizationRole))]
    public required OrganizationRole Role { get; set; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (OrganizationId == Guid.Empty)
        {
            yield return new ValidationResult("OrganizationId must not be empty.", [nameof(OrganizationId)]);
        }

        if (UserId == Guid.Empty)
        {
            yield return new ValidationResult("UserId must not be empty.", [nameof(UserId)]);
        }
    }
}
