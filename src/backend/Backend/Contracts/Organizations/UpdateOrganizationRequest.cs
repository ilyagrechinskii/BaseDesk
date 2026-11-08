// Contracts/Organizations/UpdateOrganizationRequest.cs
using System.ComponentModel.DataAnnotations;

namespace Backend.Contracts.Organizations;

public record UpdateOrganizationRequest(
    [Required, StringLength(120, MinimumLength = 1)]
    string Name,

    string? Description);