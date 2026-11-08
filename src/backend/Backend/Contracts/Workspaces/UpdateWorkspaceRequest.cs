// Contracts/Workspaces/UpdateWorkspaceRequest.cs
using System.ComponentModel.DataAnnotations;

namespace Backend.Contracts.Workspaces;

public record UpdateWorkspaceRequest(
    [Required, StringLength(120, MinimumLength = 1)]
    string Name);