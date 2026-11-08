// Contracts/Sections/SectionItemRequest.cs
using System.ComponentModel.DataAnnotations;

namespace Backend.Contracts.Sections;

public record SectionItemRequest(
    SectionType Type,
    [Required, StringLength(80, MinimumLength = 1)] string Title,
    [Range(0, int.MaxValue)] int Position,
    bool? Enabled);