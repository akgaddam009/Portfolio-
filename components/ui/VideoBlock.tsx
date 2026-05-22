"use client";

/* Shared hero video block — used by both the unlocked case study
   detail page and the password gate. Pulled out of CaseStudyDetail
   so the gate gets the exact same visual treatment without dragging
   the rest of the case study payload into the gate's bundle.

   Important: this version renders the video unconditionally with
   preload="auto" — no image fallback, no swap. Mobile and web both
   get the same auto-playing muted loop the moment the page mounts.

   The container reserves an aspect ratio so the panel doesn't
   collapse while the video is loading; the video crossfades in
   once metadata is ready. */

import { useState } from "react";

export default function VideoBlock({ src, appType, chromeUrl, dark }: { src: string; appType?: string; chromeUrl?: string; dark?: boolean }) {
  const isMobile = !!appType && /mobile/i.test(appType);
  const urlLabel = chromeUrl || "app.example.com";
  const [ready, setReady] = useState(false);
  // When `dark` is true, the surrounding panel + browser chrome render
  // a dark surface so a dark-themed app video blends in light mode.
  // Used on the Reputation case study where the product UI is dark.
  const panelBg = dark ? "#0f1115" : "var(--chrome)";
  const videoBg = dark ? "#0f1115" : "var(--surface)";

  if (isMobile) {
    return (
      <div style={{ display: "flex", justifyContent: "center", background: "var(--surface)", borderRadius: "16px", padding: "24px", boxShadow: "var(--card-shadow)" }}>
        <div style={{ position: "relative", width: "100%", maxWidth: "320px", aspectRatio: "9 / 19.5", background: "#0a0a0a", borderRadius: "12px", overflow: "hidden" }}>
          <video
            src={src}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            onCanPlay={() => setReady(true)}
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              objectFit: "cover",
              background: "#0a0a0a",
              opacity: ready ? 1 : 0,
              transition: "opacity 320ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div style={{ borderRadius: "16px", overflow: "hidden", background: panelBg, boxShadow: "var(--card-shadow)" }}>
      <div style={{ position: "relative", height: "38px", background: panelBg, borderBottom: dark ? "1px solid rgba(255,255,255,0.08)" : "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "absolute", left: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
          {["#ff5f57", "#febc2e", "#28c840"].map((c, i) => (
            <div key={i} style={{ width: "10px", height: "10px", borderRadius: "50%", background: c }} />
          ))}
        </div>
        <div style={{ background: "var(--surface)", borderRadius: "4px", padding: "4px 14px", display: "flex", alignItems: "center", gap: "6px", maxWidth: "240px", width: "100%" }}>
          <svg width="8" height="10" viewBox="0 0 8 10" fill="none" style={{ flexShrink: 0, opacity: 0.4 }}>
            <rect x="1" y="4" width="6" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.2" />
            <path d="M2.5 4V2.8a1.5 1.5 0 013 0V4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-mono-lg)", letterSpacing: "0", color: "var(--muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {urlLabel}
          </span>
        </div>
      </div>
      <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 9", background: videoBg }}>
        <video
          src={src}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onCanPlay={() => setReady(true)}
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "contain",
            background: videoBg,
            opacity: ready ? 1 : 0,
            transition: "opacity 320ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        />
      </div>
    </div>
  );
}
