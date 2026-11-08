using System.ComponentModel.DataAnnotations;
using Backend.Contracts.Sections;

namespace Backend.Contracts.Workspaces;

public record CreateWorkspaceRequest(
    [Required, StringLength(120, MinimumLength = 1)] string Name,
    IReadOnlyList<SectionItemRequest>? Sections) : IValidatableObject
{
    public IEnumerable<ValidationResult> Validate(ValidationContext _)
    {
        if (Sections is null) yield break;

        var seenTypes = new HashSet<SectionType>();
        var seenPositions = new HashSet<int>();

        for (var i = 0; i < Sections.Count; i++)
        {
            var s = Sections[i];

            // 1) Допустимость enum (default(SectionType) = 0, такого значения нет)
            if (!Enum.IsDefined(typeof(SectionType), s.Type))
            {
                yield return new ValidationResult(
                    "Недопустимый тип раздела.",
                    new[] { $"sections[{i}].type" });
            }

            // 2) Рекурсивная проверка DataAnnotations у элемента
            var itemResults = new List<ValidationResult>();
            if (!Validator.TryValidateObject(
                    s, new ValidationContext(s), itemResults, validateAllProperties: true))
            {
                foreach (var r in itemResults)
                {
                    var members = r.MemberNames.Any() ? r.MemberNames : new[] { "" };
                    foreach (var m in members)
                    {
                        var field = string.IsNullOrEmpty(m)
                            ? $"sections[{i}]"
                            : $"sections[{i}].{ToCamel(m)}";
                        yield return new ValidationResult(r.ErrorMessage, new[] { field });
                    }
                }
            }

            // 3) Уникальность Type
            if (Enum.IsDefined(typeof(SectionType), s.Type) && !seenTypes.Add(s.Type))
                yield return new ValidationResult(
                    "Тип раздела повторяется.",
                    new[] { $"sections[{i}].type" });

            // 4) Уникальность Position
            if (!seenPositions.Add(s.Position))
                yield return new ValidationResult(
                    "Позиция повторяется.",
                    new[] { $"sections[{i}].position" });
        }
    }

    private static string ToCamel(string s) =>
        string.IsNullOrEmpty(s) || char.IsLower(s[0])
            ? s
            : char.ToLowerInvariant(s[0]) + s[1..];
}