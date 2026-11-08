namespace Backend.Infrastructure;

public enum StoreError { None, NotFound, Conflict }

public sealed record StoreResult<T>(bool Success, T? Value, StoreError Error, string? Message)
{
    public static StoreResult<T> Ok(T value) => new(true, value, StoreError.None, null);
    public static StoreResult<T> NotFound(string msg) => new(false, default, StoreError.NotFound, msg);
    public static StoreResult<T> Conflict(string msg) => new(false, default, StoreError.Conflict, msg);
}