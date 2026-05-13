"use client";

/* /me — one-click owner opt-out for analytics.
   Visit this URL once per device/browser. Sets the same cookie + localStorage
   flag that AnalyticsClient looks for via `?owner=1`, then bounces home.
   Lasts 1 year. Survives reloads, tab closes, and incognito → normal on the
   same browser profile. Private windows clear cookies on close — visit /me
   again from a private window if you care. */

import { useEffect } from "react";

const COOKIE_NAME = "va-owner";
const LS_KEY = "va-disable";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export default function MePage() {
  useEffect(() => {
    try {
      window.localStorage.setItem(LS_KEY, "1");
    } catch {
      /* private mode / storage disabled — cookie still works */
    }
    document.cookie = `${COOKIE_NAME}=1; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax; Secure`;
    window.location.replace("/");
  }, []);

  return (
    <main
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-mono)",
        fontSize: "11px",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: "var(--muted)",
      }}
    >
      Opting out…
    </main>
  );
}
