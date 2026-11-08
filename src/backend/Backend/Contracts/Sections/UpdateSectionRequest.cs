// Contracts/Sections/UpdateSectionsRequest.cs
namespace Backend.Contracts.Sections;

public record UpdateSectionsRequest(
    IReadOnlyList<SectionItemRequest> Sections);