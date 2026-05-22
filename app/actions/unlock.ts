"use server";

import { cookies, headers } from "next/headers";
import { revalidatePath } from "next/cache";
import {
  UNLOCK_COOKIE_NAME,
  UNLOCK_COOKIE_MAX_AGE,
  UNLOCK_TOKEN_VALUE,
} from "@/lib/auth";

/* Server-side unlock action — never exposes the password to the client.

   Architecture:
   - Password lives in process.env.CASE_STUDY_PASSWORD (Vercel env var).
     Configure it once in the Vercel dashboard and rotate without
     redeploying code.
   - A fallback dev default is used when the env var is unset so local
     dev works out of the box, but in production the env var is required
     (action returns an error if missing).
   - On success the action sets an HttpOnly cookie via the standard
     next/headers cookie store. The browser can never read the cookie
     from JS, so DevTools / XSS can't extract a stolen session.
   - Rate limit is a 30-attempt-per-15-min bucket keyed by client IP
     (best-effort — Vercel adds x-forwarded-for). Defense in depth, not
     a guarantee. */

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 min
const RATE_LIMIT_MAX_ATTEMPTS = 30;

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

function getClientKey(headerStore: Headers): string {
  // Vercel populates x-forwarded-for. Fall back to a generic key so the
  // limiter still works in local dev (where everyone is 127.0.0.1).
  const xff = headerStore.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return headerStore.get("x-real-ip") || "anonymous";
}

function checkRateLimit(key: string): { ok: true } | { ok: false; retryInSec: number } {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { ok: true };
  }
  if (bucket.count >= RATE_LIMIT_MAX_ATTEMPTS) {
    return { ok: false, retryInSec: Math.ceil((bucket.resetAt - now) / 1000) };
  }
  bucket.count += 1;
  return { ok: true };
}

/* Constant-time string compare — prevents an attacker from probing the
   password one character at a time by measuring response latency.
   Returns true iff both strings are byte-identical. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export type UnlockResult =
  | { ok: true }
  | { ok: false; error: "wrong" | "rate-limited" | "config"; retryInSec?: number };

export async function unlock(formData: FormData): Promise<UnlockResult> {
  const headerStore = await headers();
  const clientKey = getClientKey(headerStore);

  const limit = checkRateLimit(clientKey);
  if (!limit.ok) return { ok: false, error: "rate-limited", retryInSec: limit.retryInSec };

  const expected = process.env.CASE_STUDY_PASSWORD;
  if (!expected) {
    // Fail closed in production. In dev, accept a hardcoded default so
    // the UX still works while the env var is being set up.
    if (process.env.NODE_ENV === "production") {
      return { ok: false, error: "config" };
    }
  }

  // Trim leading/trailing whitespace so a copy-paste or autofill with
  // an accidental space doesn't read as a wrong password.
  const submitted = String(formData.get("password") ?? "").trim();
  // Empty submissions are wrong without even consulting the env var, so
  // dev defaults aren't exercised by accident.
  if (!submitted) return { ok: false, error: "wrong" };

  const target = (expected ?? "Nothing@123$").trim(); // dev-only fallback
  if (!safeEqual(submitted, target)) return { ok: false, error: "wrong" };

  const store = await cookies();
  store.set(UNLOCK_COOKIE_NAME, UNLOCK_TOKEN_VALUE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: UNLOCK_COOKIE_MAX_AGE,
  });

  // Invalidate cached pages so confidential routes re-render with the
  // unlocked branch on the very next request.
  revalidatePath("/", "layout");
  return { ok: true };
}
