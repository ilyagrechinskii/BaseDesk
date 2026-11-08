// Contracts/Sections/SectionResponse.cs
namespace Backend.Contracts.Sections;

public record SectionResponse(
    Guid Id,
    Guid WorkspaceId,
    SectionType Type,
    string Title,
    int Position,
    bool Enabled);