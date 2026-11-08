// Contracts/Organizations/OrganizationResponse.cs
namespace Backend.Contracts.Organizations;

public record OrganizationResponse(
    Guid Id,
    string Name,
    string? Description,
    DateTimeOffset CreatedAt,
    DateTimeOffset UpdatedAt,
    int WorkspaceCount,
    int MemberCount);