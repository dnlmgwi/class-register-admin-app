export function parseCookie(cookieString: string): Record<string, string> {
  return Object.fromEntries(cookieString.split("; ").map((c) => c.split("=")));
}