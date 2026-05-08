"use client";

import { useEffect, useState } from "react";

/* ─── Detailed ↔ Executive toggle ─────────────────────────────────────
   Adds data-mode="executive" or "detailed" to <html>. CSS in
   globals.css uses that attribute to hide non-essential content
   when executive mode is on (long prose, research, decision bodies,
   contribution, references, etc.). Hero / metrics / insight / decision
   titles / outcomes stay visible — the case study compresses to a
   ~60 second scan.

   Persists choice to localStorage. Defaults to "detailed". Safe in
   SSR — we only touch document/window inside useEffect. */

type Mode = "detailed" | "executive";

export default function ModeToggle() {
  const [mode, setMode] = useState<Mode>("detailed");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = (localStorage.getItem("portfolio-mode") as Mode | null) ?? "detailed";
    setMode(saved);
    document.documentElement.setAttribute("data-mode", saved);
    setMounted(true);
  }, []);

  const toggle = () => {
    const next: Mode = mode === "detailed" ? "executive" : "detailed";
    setMode(next);
    document.documentElement.setAttribute("data-mode", next);
    localStorage.setItem("portfolio-mode", next);
  };

  if (!mounted) {
    return (
      <button
        aria-hidden="true"
        style={{
          width: "44px", height: "44px",
          borderRadius: "12px",
          background: "var(--surface)",
          boxShadow: "var(--card-shadow)",
          border: "none",
        }}
      />
    );
  }

  return (
    <button
      onClick={toggle}
      aria-label={mode === "detailed" ? "Switch to executive mode (faster scan)" : "Switch to detailed mode (full case studies)"}
      title={mode === "detailed" ? "Executive mode" : "Detailed mode"}
      style={{
        width: "44px", height: "44px",
        borderRadius: "12px",
        background: "var(--surface)",
        boxShadow: "var(--card-shadow)",
        border: "none",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--text)",
        transition: "box-shadow 0.25s cubic-bezier(0.22,1,0.36,1)",
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "var(--card-shadow-hover)"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "var(--card-shadow)"; }}
    >
      {/* Detailed mode → "stacked lines" icon; Executive → "flash" icon */}
      {mode === "detailed" ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="18" x2="14" y2="18" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M13 2 L4 14 H11 L11 22 L20 10 H13 Z" />
        </svg>
      )}
    </button>
  );
}
