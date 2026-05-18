"use client";

import { useEffect } from "react";
import { Analytics } from "@vercel/analytics/next";

/* Vercel Analytics wrapper with three layers of self-traffic filtering:

   1. Host filter — only events from the production host count. Localhost,
      127.0.0.1, and Vercel preview deployments
      (e.g. arungaddamux-git-<branch>-<scope>.vercel.app) are dropped at
      the source. No more "I committed something and watched my own deploy
      preview" noise.

   2. Owner flag — checked in BOTH localStorage and a 1-year cookie so
      clearing one doesn't undo the opt-out. Set both via URL param:

        https://arungaddamux.vercel.app/?owner=1   → opt out
        https://arungaddamux.vercel.app/?owner=0   → opt back in

      Visit the URL once per device/browser. The flag survives reloads,
      tab closes, and incognito-to-normal transitions on the same browser
      profile. Private windows clear cookies on close — flag yourself
      separately there if you care.

   3. Manual override — the original localStorage console command still
      works for backwards compatibility:

        localStorage.setItem('va-disable', '1')

   Filtering happens client-side via beforeSend. No events leave the
   browser when any filter matches. */

const PRODUCTION_HOST = "arungaddamux.vercel.app";
const COOKIE_NAME = "va-owner";
const LS_KEY = "va-disable";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

function readOwnerFlag(): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (window.localStorage.getItem(LS_KEY) === "1") return true;
  } catch {
    /* private mode / storage disabled — fall through to cookie */
  }
  if (typeof document !== "undefined") {
    if (document.cookie.split("; ").some(c => c === `${COOKIE_NAME}=1`)) return true;
  }
  return false;
}

function writeOwnerFlag(on: boolean) {
  try {
    if (on) window.localStorage.setItem(LS_KEY, "1");
    else window.localStorage.removeItem(LS_KEY);
  } catch {
    /* private mode — cookie still works */
  }
  if (typeof document !== "undefined") {
    document.cookie = on
      ? `${COOKIE_NAME}=1; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax; Secure`
      : `${COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax; Secure`;
  }
}

export default function AnalyticsClient() {
  /* ?owner=1 / ?owner=0 — set the flag and clean the URL so the param
     doesn't leak into shared links or analytics referrers. */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const qs = new URLSearchParams(window.location.search);
    const v = qs.get("owner");
    if (v !== "1" && v !== "0") return;
    writeOwnerFlag(v === "1");
    qs.delete("owner");
    const cleanUrl =
      window.location.pathname +
      (qs.toString() ? `?${qs.toString()}` : "") +
      window.location.hash;
    window.history.replaceState({}, "", cleanUrl);
  }, []);

  return (
    <Analytics
      beforeSend={event => {
        if (typeof window === "undefined") return event;
        // Drop non-production hosts (localhost, preview deploys).
        if (window.location.hostname !== PRODUCTION_HOST) return null;
        // Drop self-traffic.
        if (readOwnerFlag()) return null;
        return event;
      }}
    />
  );
}
