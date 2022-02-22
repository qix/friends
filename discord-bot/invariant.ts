export function invariant(
  condition: any,
  message?: string | (() => string)
): asserts condition {
  if (condition) {
    return;
  }

  const errorMessage = typeof message === "function" ? message() : message;
  throw new Error(errorMessage);
}
