// Contracts/Workspaces/WorkspaceResponse.cs
using Backend.Contracts.Sections;

namespace Backend.Contracts.Workspaces;

public record WorkspaceResponse(
    Guid Id,
    Guid OrganizationId,
    string Name,
    IReadOnlyList<SectionResponse> Sections);