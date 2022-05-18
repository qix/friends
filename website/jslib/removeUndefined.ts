export function removeUndefined<T>(obj: { [k: string]: T | undefined }): {
  [k: string]: T;
} {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => typeof v !== "undefined") as Array<
      [string, T]
    >
  );
}
