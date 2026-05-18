"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: "100dvh",
        backgroundColor: "var(--bg)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
        padding: "0 24px",
        textAlign: "center",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--muted)",
        }}
      >
        Something went wrong
      </p>
      <h1
        style={{
          fontSize: "clamp(24px, 4vw, 36px)",
          fontWeight: 500,
          letterSpacing: "-0.03em",
          color: "var(--text)",
          margin: 0,
        }}
      >
        This case study failed to load.
      </h1>
      <div style={{ display: "flex", gap: 16 }}>
        <button
          onClick={reset}
          style={{
            padding: "10px 20px",
            borderRadius: 8,
            border: "1px solid var(--border)",
            backgroundColor: "var(--surface)",
            color: "var(--text)",
            fontSize: 14,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Try again
        </button>
        <Link
          href="/"
          style={{
            padding: "10px 20px",
            borderRadius: 8,
            border: "1px solid var(--border)",
            backgroundColor: "transparent",
            color: "var(--muted)",
            fontSize: 14,
            textDecoration: "none",
            fontFamily: "inherit",
          }}
        >
          ← Back to portfolio
        </Link>
      </div>
    </div>
  );
}
