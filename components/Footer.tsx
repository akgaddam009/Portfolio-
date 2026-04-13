"use client";

import Link from "next/link";

const links = [
  { label: "Email", href: "mailto:hello@arungaddam.com" },
  { label: "LinkedIn", href: "https://linkedin.com/in/arungaddam", external: true },
  { label: "Medium", href: "https://medium.com/@arungaddam", external: true },
  { label: "ADPList", href: "https://adplist.org/mentors/arun-gaddam", external: true },
];

const nav = [
  { label: "Work", href: "/#work" },
  { label: "About", href: "/about" },
];

export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--border)", marginTop: "80px" }}>
      <div className="page-pad" style={{ padding: "40px 24px 32px" }}>
        {/* Top row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "24px", marginBottom: "32px" }}>
          <div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 600, color: "var(--text)", letterSpacing: "-0.01em", marginBottom: "4px" }}>
              Arun Gaddam
            </p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--muted)", lineHeight: 1.5 }}>
              Senior Product Designer · 8+ years
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-end" }}>
            {links.map(({ label, href, external }) => (
              <Link
                key={label}
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                style={{
                  fontFamily: "var(--font-body)", fontSize: "13px",
                  color: "var(--muted)", transition: "color 0.15s",
                  letterSpacing: "-0.01em",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}
              >
                {label}{external ? " ↗" : ""}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", paddingTop: "20px", borderTop: "1px solid var(--border)" }}>
          <nav style={{ display: "flex", gap: "16px" }}>
            {nav.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--muted)", transition: "color 0.15s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}
              >
                {label}
              </Link>
            ))}
          </nav>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--muted)", letterSpacing: "0.04em" }}>
            © {new Date().getFullYear()} · Hyderabad, India
          </p>
        </div>
      </div>
    </footer>
  );
}
