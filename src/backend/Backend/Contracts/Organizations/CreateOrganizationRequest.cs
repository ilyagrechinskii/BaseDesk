// Contracts/Organizations/CreateOrganizationRequest.cs
using System.ComponentModel.DataAnnotations;

namespace Backend.Contracts.Organizations;

public record CreateOrganizationRequest(
    [Required, StringLength(120, MinimumLength = 1)]
    string Name,

    string? Description);