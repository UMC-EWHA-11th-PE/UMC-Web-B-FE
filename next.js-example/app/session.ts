export interface TokenClaims {
  sub: string;
  email: string;
  exp: number;
}

export function readToken(token: string | null): TokenClaims | null {
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length !== 3 || !parts[1]) return null;

  try {
    const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const bytes = Uint8Array.from(atob(payload), (char) => char.charCodeAt(0));
    const claims = JSON.parse(new TextDecoder().decode(bytes));

    if (
      typeof claims?.sub !== "string" ||
      !/^\d+$/.test(claims.sub) ||
      typeof claims.email !== "string" ||
      typeof claims.exp !== "number" ||
      !Number.isFinite(claims.exp) ||
      claims.exp * 1000 <= Date.now()
    ) {
      return null;
    }

    return { sub: claims.sub, email: claims.email, exp: claims.exp };
  } catch {
    return null;
  }
}