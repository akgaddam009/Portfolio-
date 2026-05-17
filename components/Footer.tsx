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
          <button
            onClick={copyEmail}
            aria-label={copied ? "Email copied" : "Copy email address"}
            style={{
              fontFamily: "var(--font-body)", fontSize: "var(--text-body)", fontWeight: 500,
              letterSpacing: "-0.01em",
              color: copied ? "var(--accent-success)" : "var(--text)",
              minHeight: "var(--space-8)",
              padding: "var(--space-3) var(--space-5)",
              borderRadius: "12px",
              border: "1px solid var(--border)",
              background: "var(--surface2)",
              cursor: "pointer",
              display: "inline-flex", alignItems: "center", gap: "var(--space-2)",
              transition: "color 0.18s, box-shadow 0.18s",
            }}
            onMouseEnter={e => { if (!copied) { e.currentTarget.style.boxShadow = "var(--card-shadow)"; } }}
            onMouseLeave={e => { if (!copied) { e.currentTarget.style.boxShadow = "none"; } }}
          >
            {copied ? "Copied ✓" : "Copy email"}
          </button>

          <Link
            href="https://www.linkedin.com/in/akgaddam/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "var(--font-body)", fontSize: "var(--text-body)", fontWeight: 500,
              letterSpacing: "-0.01em",
              color: "var(--text)",
              minHeight: "var(--space-8)",
              padding: "var(--space-3) var(--space-5)",
              borderRadius: "12px",
              border: "1px solid var(--border)",
              background: "var(--surface2)",
              display: "inline-flex", alignItems: "center", gap: "var(--space-2)",
              transition: "color 0.18s, box-shadow 0.18s",
              textDecoration: "none",
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = "var(--card-shadow)"; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; }}
          >
            <span style={{ fontSize: "var(--text-mono-lg)" }}>↗</span>
            LinkedIn
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
