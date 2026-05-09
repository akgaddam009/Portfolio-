"use client";

/* Top-of-page navigation progress bar.

   The case study detail page is a heavy "use client" component
   (~5400 lines, ~177 motion components). After clicking a card,
   there is a visible window where the browser is parsing and
   hydrating before the new page is interactive. Without feedback,
   that window reads as a frozen click.

   This component listens for clicks on internal Link anchors and
   shows a thin amber progress bar at the very top until the
   pathname actually changes (route resolves). Pure transform/opacity
   animation — no layout thrash, no hydration cost beyond the
   single useState. */

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function RouteProgress() {
  const pathname = usePathname();
  const [pending, setPending] = useState(false);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      // Bail on modified clicks (open in new tab, etc) — browser handles those.
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;

      const a = (e.target as Element | null)?.closest("a");
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href) return;
      // Internal navigation only.
      if (!href.startsWith("/") || href.startsWith("//")) return;
      // Same-page anchor — no navigation.
      if (href.startsWith("#")) return;
      // Same path — no navigation.
      try {
        const url = new URL(href, window.location.origin);
        if (url.pathname === window.location.pathname) return;
      } catch { /* ignore */ }

      setPending(true);
    }
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  // Reset when pathname actually changes (route resolved).
  useEffect(() => {
    setPending(false);
  }, [pathname]);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "2px",
        zIndex: 10000,
        pointerEvents: "none",
        background: "transparent",
      }}
    >
      <div
        style={{
          height: "100%",
          width: pending ? "85%" : "0%",
          background: "var(--accent, #d4a574)",
          opacity: pending ? 1 : 0,
          transformOrigin: "left center",
          transition: pending
            ? "width 8s cubic-bezier(0.1, 0.9, 0.2, 1), opacity 0.15s linear"
            : "width 0.2s ease, opacity 0.25s linear 0.1s",
        }}
      />
    </div>
  );
}
