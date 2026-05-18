"use client";

import Link from "next/link";
import { useState } from "react";

export default function Footer() {
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText("akgaddam02@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer style={{ borderTop: "1px solid var(--border)", marginTop: "80px" }}>
      <div className="page-pad" style={{ padding: "56px 24px 40px" }}>

        {/* CTA heading */}
        <h2 style={{
          fontFamily: "var(--font-body)",
          fontSize: "clamp(22px, 3.5vw, 32px)",
          fontWeight: 400,
          letterSpacing: "-0.03em",
          lineHeight: 1.2,
          color: "var(--text)",
          marginBottom: "28px",
        }}>
          Let&apos;s create stories together
        </h2>

        {/* CTAs — quiet conversion moment: outlined transparent buttons matching
            the Contact panel pattern, but without magnetic physics. The case
            study footer is the end of a long read where the visitor is deciding
            to reach out — motion at that moment reads as decoration, not delight. */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "48px" }}>
          <button
            onClick={copyEmail}
            aria-label={copied ? "Email copied" : "Copy email address"}
            style={{
              fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 400,
              letterSpacing: "-0.01em",
              color: copied ? "var(--accent-success)" : "var(--muted)",
              padding: "9px 20px",
              borderRadius: "10px",
              border: "1px solid var(--border)",
              background: "transparent",
              cursor: "pointer",
              display: "inline-flex", alignItems: "center", gap: "6px",
              transition: "color 0.18s, border-color 0.18s, background 0.18s",
            }}
            onMouseEnter={e => { if (!copied) { e.currentTarget.style.color = "var(--text)"; e.currentTarget.style.borderColor = "var(--text)"; } }}
            onMouseLeave={e => { if (!copied) { e.currentTarget.style.color = "var(--muted)"; e.currentTarget.style.borderColor = "var(--border)"; } }}
          >
            {copied ? "Copied ✓" : "Copy email"}
          </button>

          <Link
            href="https://www.linkedin.com/in/akgaddam/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 400,
              letterSpacing: "-0.01em",
              color: "var(--muted)",
              padding: "9px 20px",
              borderRadius: "10px",
              border: "1px solid var(--border)",
              background: "transparent",
              display: "inline-flex", alignItems: "center", gap: "6px",
              transition: "color 0.18s, border-color 0.18s, background 0.18s",
              textDecoration: "none",
            }}
            onMouseEnter={e => { e.currentTarget.style.color = "var(--text)"; e.currentTarget.style.borderColor = "var(--text)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "var(--muted)"; e.currentTarget.style.borderColor = "var(--border)"; }}
          >
            <span style={{ fontSize: "11px" }}>↗</span>
            LinkedIn
          </Link>
        </div>

        {/* Bottom bar — matched to the homepage Contact panel footer:
            stacked vertically, body font, copyright first, attribution second
            with reduced opacity. The heart is an inline 11×11 SVG, not the
            text glyph, so it inherits muted colour like the rest of the line. */}
        <div style={{ paddingTop: "20px", borderTop: "1px solid var(--border)" }}>
          <p style={{
            fontFamily: "var(--font-body)", fontSize: "11px",
            fontWeight: 400, letterSpacing: "-0.01em",
            color: "var(--muted)", lineHeight: 1.3,
            marginBottom: "4px",
          }}>
            © 2026 · Arun Gaddam ツ
          </p>
          <p style={{
            fontFamily: "var(--font-body)", fontSize: "11px",
            fontWeight: 400, letterSpacing: "-0.01em",
            color: "var(--muted)", lineHeight: 1.3,
            opacity: 0.6,
          }}>
            Designed with <svg width="11" height="11" viewBox="0 0 24 24" style={{ display: "inline", verticalAlign: "middle", marginBottom: "1px" }} fill="var(--muted)"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg> using Claude Code
          </p>
        </div>

      </div>
    </footer>
  );
}
