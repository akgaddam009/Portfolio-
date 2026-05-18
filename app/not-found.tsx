"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
        fontFamily: "var(--font-body)",
        gap: "24px",
        padding: "40px",
        textAlign: "center",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-mono)",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--muted)",
        }}
      >
        404
      </p>
      <h1
        style={{
          fontSize: "clamp(28px, 4vw, 48px)",
          fontWeight: 300,
          letterSpacing: "-0.03em",
          color: "var(--text)",
          margin: 0,
        }}
      >
        This page doesn't exist.
      </h1>
      <p style={{ color: "var(--muted)", fontSize: "var(--text-body-lg)", margin: 0, maxWidth: "380px" }}>
        The link might be broken, or the page may have moved.
      </p>
      <Link
        href="/"
        style={{
          marginTop: "8px",
          padding: "10px 24px",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "8px",
          color: "var(--text)",
          fontSize: "var(--text-body)",
          textDecoration: "none",
        }}
      >
        ← Back to portfolio
      </Link>
    </div>
  );
}
