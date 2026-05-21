"use client";

import { useEffect, useState } from "react";

/* Launch splash — static "Arun Gaddam" wordmark on first session visit.
   No animation; just the name held for ~1.6s then fading out. Shown
   once per session via sessionStorage flag. */
export default function LaunchSplash() {
  const [show, setShow] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("launch-splash-seen")) {
      setShow(false);
      return;
    }
    sessionStorage.setItem("launch-splash-seen", "1");
    const t1 = setTimeout(() => setFading(true), 1600);
    const t2 = setTimeout(() => setShow(false), 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (!show) return null;

  return (
    <div
      role="presentation"
      onClick={() => setFading(true)}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "var(--bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: fading ? 0 : 1,
        transition: "opacity 600ms cubic-bezier(0.22, 1, 0.36, 1)",
        cursor: "pointer",
      }}
      aria-label="Arun Gaddam"
    >
      <h1
        style={{
          fontFamily: "var(--font-logo)",
          fontSize: "clamp(38px, 7vw, 84px)",
          fontWeight: 500,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "var(--text)",
          margin: 0,
        }}
      >
        Arun Gaddam
      </h1>
    </div>
  );
}
