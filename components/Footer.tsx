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
    <footer style={{ borderTop: "1px solid var(--border)", marginTop: "var(--space-11)" }}>
      <div className="page-pad" style={{ padding: "var(--space-9) var(--space-6) var(--space-9)" }}>

        {/* CTA heading */}
        <h2 style={{
          fontFamily: "var(--font-body)",
          fontSize: "clamp(22px, 3.5vw, 32px)",
          fontWeight: 400,
          letterSpacing: "-0.03em",
          lineHeight: 1.2,
          color: "var(--text-display)",
          marginBottom: "var(--space-7)",
        }}>
          Let&apos;s create stories together
        </h2>

        {/* CTAs — quiet conversion moment: outlined transparent buttons matching
            the Contact panel pattern, but without magnetic physics. The case
            study footer is the end of a long read where the visitor is deciding
            to reach out — motion at that moment reads as decoration, not delight.
            minHeight: var(--space-8) (44px) enforces WCAG 2.5.5 touch target floor. */}
        <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap", marginBottom: "var(--space-9)" }}>
          {/* Tier-2 CTAs — matched to case-study back-link + Contact panel for
              system consistency. Mono caps, surface fill, hover color + shadow. */}
          <button
            onClick={copyEmail}
            aria-label={copied ? "Email copied" : "Copy email address"}
            style={{
              fontFamily: "var(--font-mono)", fontSize: "var(--text-mono)", fontWeight: 400,
              letterSpacing: "0.08em", textTransform: "uppercase",
              color: copied ? "var(--accent-success)" : "var(--muted)",
              padding: "8px 12px", minHeight: "var(--space-8)", borderRadius: "8px",
              border: "1px solid var(--border)", background: "var(--surface)",
              cursor: "pointer",
              display: "inline-flex", alignItems: "center", gap: "6px",
              transition: "color 0.18s, border-color 0.18s, background 0.18s, box-shadow 0.18s",
            }}
            onMouseEnter={e => { if (!copied) { e.currentTarget.style.color = "var(--text)"; e.currentTarget.style.background = "var(--surface2)"; e.currentTarget.style.boxShadow = "var(--card-shadow)"; } }}
            onMouseLeave={e => { if (!copied) { e.currentTarget.style.color = "var(--muted)"; e.currentTarget.style.background = "var(--surface)"; e.currentTarget.style.boxShadow = "none"; } }}
          >
            {copied ? "Copied ✓" : "Copy email"}
          </button>

          <Link
            href="https://www.linkedin.com/in/akgaddam/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "var(--font-mono)", fontSize: "var(--text-mono)", fontWeight: 400,
              letterSpacing: "0.08em", textTransform: "uppercase",
              color: "var(--muted)",
              padding: "8px 12px", minHeight: "var(--space-8)", borderRadius: "8px",
              border: "1px solid var(--border)", background: "var(--surface)",
              display: "inline-flex", alignItems: "center", gap: "6px",
              transition: "color 0.18s, border-color 0.18s, background 0.18s, box-shadow 0.18s",
              textDecoration: "none",
            }}
            onMouseEnter={e => { e.currentTarget.style.color = "var(--text)"; e.currentTarget.style.background = "var(--surface2)"; e.currentTarget.style.boxShadow = "var(--card-shadow)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "var(--muted)"; e.currentTarget.style.background = "var(--surface)"; e.currentTarget.style.boxShadow = "none"; }}
          >
            LinkedIn
            <span style={{ fontSize: "var(--text-mono-lg)" }}>↗</span>
          </Link>
        </div>

        {/* Bottom bar — matched to the homepage Contact panel footer:
            stacked vertically, body font, copyright first, attribution second
            with reduced opacity. The heart is an inline 11×11 SVG, not the
            text glyph, so it inherits muted colour like the rest of the line. */}
        <div style={{ paddingTop: "var(--space-5)", borderTop: "1px solid var(--border)" }}>
          <p style={{
            fontFamily: "var(--font-body)", fontSize: "var(--text-mono-lg)",
            fontWeight: 400, letterSpacing: "-0.01em",
            color: "var(--muted)", lineHeight: 1.3,
            marginBottom: "var(--space-1)",
          }}>
            © 2026 · Arun Gaddam ツ
          </p>
          <p style={{
            fontFamily: "var(--font-body)", fontSize: "var(--text-mono-lg)",
            fontWeight: 400, letterSpacing: "-0.01em",
            color: "var(--muted)", lineHeight: 1.3,
            opacity: 0.6,
          }}>
            Designed with{" "}
            {/* #D97757 is the Claude brand orange — kept as a literal (not a token)
                because it's an external brand reference, not part of our palette. */}
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="#D97757"
              aria-hidden
              style={{ display: "inline-block", verticalAlign: "-1px", marginRight: "2px" }}
            >
              <path d="M12 2c.5 6 2 7.5 10 10-8 2.5-9.5 4-10 10-.5-6-2-7.5-10-10 8-2.5 9.5-4 10-10z" />
            </svg>
            Claude Code
          </p>
        </div>

      </div>
    </footer>
  );
}
