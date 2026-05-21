"use client";

import Link from "next/link";
import AsciiWater from "@/components/AsciiWater";
import { Button } from "@/components/ui/button";

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
        gap: "var(--space-6)",
        padding: "var(--space-9)",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Full-bleed ripple — the page is otherwise empty, so the surface
          becomes the focal point and 404 reads as intentional, not stale. */}
      <AsciiWater opacity={0.45} fontSize={14} damping={0.984} />

      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--space-6)" }}>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-mono-lg)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--muted2)",
            margin: 0,
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
        <p
          style={{
            color: "var(--muted2)",
            fontSize: "var(--text-body-lg)",
            margin: 0,
            maxWidth: "380px",
            lineHeight: 1.6,
          }}
        >
          The link might be broken, or the page may have moved.
        </p>
        <Button asChild variant="inline" style={{ marginTop: "var(--space-2)" }}>
          <Link href="/">← Back to portfolio</Link>
        </Button>
      </div>
    </div>
  );
}
