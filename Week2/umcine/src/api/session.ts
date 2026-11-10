export interface TokenClaims { sub: string; email: string; exp: number }
// Display claims only; authorization is verified by the server.
export function readToken(token: string | null): TokenClaims | null {
  try {
    if (!token) return null;
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const claims = JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(payload), c => c.charCodeAt(0))));
    return /^\d+$/.test(claims.sub) && typeof claims.email === 'string' && typeof claims.exp === 'number' && claims.exp * 1000 > Date.now() ? claims : null;
  } catch { return null; }
}
