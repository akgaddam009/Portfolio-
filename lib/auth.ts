import { cookies } from "next/headers";

/* Server-side session helpers for the case study gate.

   The unlock token is an HttpOnly cookie set by the server action in
   app/actions/unlock.ts. The cookie value is a versioned literal — not
   the password itself — so even with the cookie a visitor can't derive
   the password. Rotating the password rotates UNLOCK_TOKEN_VERSION
   which invalidates every existing cookie automatically.

   Cookie design:
   - HttpOnly:    blocks JS read access (no DevTools / XSS extraction)
   - Secure:      production-only — cookie never sent over plain HTTP
   - SameSite:    Lax — sent on top-level navigation, blocked on
                  cross-site POST (CSRF defense for the gate form)
   - Path: /      shared across the whole site so unlocking one gated
                  case study unlocks all of them, matching the previous
                  global-key UX exactly */

export const UNLOCK_COOKIE_NAME = "cs-unlock";
const UNLOCK_TOKEN_VERSION = "v1";
export const UNLOCK_TOKEN_VALUE = `unlocked-${UNLOCK_TOKEN_VERSION}`;
export const UNLOCK_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export async function isUnlocked(): Promise<boolean> {
  const store = await cookies();
  return store.get(UNLOCK_COOKIE_NAME)?.value === UNLOCK_TOKEN_VALUE;
}
