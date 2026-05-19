"use client";

/* Shared hero video block — used by both the unlocked case study
   detail page and the password gate. Pulled out of CaseStudyDetail
   so the gate gets the exact same visual treatment without dragging
   the rest of the case study payload into the gate's bundle.

   Important: this version renders the video unconditionally with
   preload="auto" — no image fallback, no swap. Mobile and web both
   get the same auto-playing muted loop the moment the page mounts. */

export default function VideoBlock({ src, appType, chromeUrl }: { src: string; appType?: string; chromeUrl?: string }) {
  const isMobile = !!appType && /mobile/i.test(appType);
  const urlLabel = chromeUrl || "app.example.com";

  if (isMobile) {
    return (
      <div style={{ display: "flex", justifyContent: "center", background: "var(--surface)", borderRadius: "16px", padding: "24px", boxShadow: "var(--card-shadow)" }}>
        <div style={{ position: "relative", width: "100%", maxWidth: "320px" }}>
          <video
            src={src}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            style={{ maxHeight: "640px", maxWidth: "100%", display: "block", borderRadius: "12px", background: "#0a0a0a" }}
          />
        </div>
      </div>
    );
  }

  return (
    <div style={{ borderRadius: "16px", overflow: "hidden", background: "var(--chrome)", boxShadow: "var(--card-shadow)" }}>
      <div style={{ position: "relative", height: "38px", background: "var(--chrome)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
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
      <video
        src={src}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        style={{ width: "100%", display: "block", maxHeight: "520px", objectFit: "contain", background: "var(--surface)" }}
      />
    </div>
  );
}
