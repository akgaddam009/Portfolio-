"use client";

import Link from "next/link";

export default function AstraIndex() {
  return (
    <>
      <nav className="astra-nav">
        <Link href="/work/astra" className="astra-nav-brand">
          Indemn <span className="astra-nav-brand-v">demo</span>
        </Link>
        <Link href="/work/astra" className="astra-nav-back">
          ← Back to case study
        </Link>
      </nav>

      <div className="astra-screen" style={{ paddingTop: "48px" }}>
        <div style={{ maxWidth: "640px", margin: "0 auto", textAlign: "center", padding: "32px 0" }}>
          <p style={{
            fontFamily: "var(--astra-font-mono)",
            fontSize: "11px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--astra-text-3)",
            marginBottom: "16px",
          }}>
            Indemn · Speculative AI prototype
          </p>
          <h1 style={{
            fontFamily: "var(--astra-font-body)",
            fontSize: "32px",
            fontWeight: 500,
            letterSpacing: "-0.02em",
            color: "var(--astra-text-1)",
            marginBottom: "16px",
            lineHeight: 1.2,
          }}>
            Two flows, both interactive.
          </h1>
          <p style={{
            fontFamily: "var(--astra-font-body)",
            fontSize: "15px",
            lineHeight: 1.6,
            color: "var(--astra-text-2)",
            marginBottom: "32px",
          }}>
            Pick a problem to walk through. Each is a working prototype — click through the screens
            in order. The case study explains the thinking.
          </p>

          <div style={{ display: "grid", gap: "12px", gridTemplateColumns: "1fr", maxWidth: "480px", margin: "0 auto" }}>
            <Link href="/astra/p1" style={cardStyle}>
              <span style={cardTagStyle}>Flow 1</span>
              <h2 style={cardTitleStyle}>AI Contract Review</h2>
              <p style={cardDescStyle}>
                The contract intake flow — procurement uploads, reviews AI extraction, sends to legal.
                Legal sees a personalized queue, approves with legal-emphasis fields.
              </p>
              <p style={cardMetaStyle}>8 screens · procurement + legal roles →</p>
            </Link>

            <Link href="/astra/p2" style={cardStyle}>
              <span style={cardTagStyle}>Flow 2</span>
              <h2 style={cardTitleStyle}>Approval Workflow Configuration</h2>
              <p style={cardDescStyle}>
                The admin builder — define conditions, configure approval chain, review and activate.
                Plus an edit screen for returning admins.
              </p>
              <p style={cardMetaStyle}>5 screens · admin role →</p>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

const cardStyle: React.CSSProperties = {
  background: "var(--astra-surface)",
  border: "1px solid var(--astra-border)",
  borderRadius: "8px",
  padding: "20px 22px",
  textDecoration: "none",
  textAlign: "left",
  boxShadow: "var(--astra-shadow)",
  transition: "border-color 0.15s, box-shadow 0.15s",
};

const cardTagStyle: React.CSSProperties = {
  display: "inline-block",
  fontFamily: "var(--astra-font-mono)",
  fontSize: "9px",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "var(--astra-text-3)",
  marginBottom: "8px",
};

const cardTitleStyle: React.CSSProperties = {
  fontFamily: "var(--astra-font-body)",
  fontSize: "18px",
  fontWeight: 600,
  color: "var(--astra-text-1)",
  marginBottom: "6px",
};

const cardDescStyle: React.CSSProperties = {
  fontFamily: "var(--astra-font-body)",
  fontSize: "13px",
  lineHeight: 1.55,
  color: "var(--astra-text-2)",
  marginBottom: "10px",
};

const cardMetaStyle: React.CSSProperties = {
  fontFamily: "var(--astra-font-mono)",
  fontSize: "10px",
  letterSpacing: "0.04em",
  color: "var(--astra-text-3)",
};
