export function encodeObjectToBase64(obj: Record<string, any>): string {
  const jsonString = JSON.stringify(obj);
  return btoa(jsonString);
}
export function decodeBase64ToObject<T = Record<string, any>>(
  base64: string | undefined
): T | undefined {
  if (base64 === undefined) {
    return undefined;
  }
  const jsonString = atob(base64);
  return JSON.parse(jsonString) as T;
}
