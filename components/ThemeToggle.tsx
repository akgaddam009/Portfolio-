"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

// 8 sun rays at 45° increments
const RAYS = Array.from({ length: 8 }, (_, i) => {
  const a = (i * 45 * Math.PI) / 180;
  return {
    x1: 12 + 7.5 * Math.cos(a), y1: 12 + 7.5 * Math.sin(a),
    x2: 12 + 11  * Math.cos(a), y2: 12 + 11  * Math.sin(a),
  };
});

export default function ThemeToggle() {
  const [dark, setDark]       = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved       = localStorage.getItem("theme");
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
    const isDark      = saved !== null ? saved === "dark" : prefersDark;
    setDark(isDark);
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  // Render a placeholder on SSR so layout doesn't shift
  if (!mounted) {
    return <div style={{ width: "32px", height: "32px", flexShrink: 0 }} />;
  }

  return (
    <motion.button
      onClick={toggle}
      whileTap={{ scale: 0.88 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
      style={{
        width: "44px",
        height: "44px",
        borderRadius: "12px",
        border: "none",
        background: "var(--surface)",
        boxShadow: "var(--card-shadow)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        flexShrink: 0,
        transition: "box-shadow 0.25s cubic-bezier(0.22,1,0.36,1), transform 0.25s cubic-bezier(0.22,1,0.36,1)",
      }}
      // Shadow elevation system (matches cards). Resting uses --card-shadow,
      // hover lifts to --card-shadow-hover. No border anywhere.
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "var(--card-shadow-hover)"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "var(--card-shadow)"; }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {dark ? (
          /* ── Moon ── */
          <motion.svg
            key="moon"
            width="15" height="15"
            viewBox="0 0 24 24"
            fill="none"
            initial={{ opacity: 0, rotate: -40, scale: 0.75 }}
            animate={{ opacity: 1, rotate: 0,   scale: 1    }}
            exit={{    opacity: 0, rotate:  40, scale: 0.75 }}
            transition={{ duration: 0.32, ease: EASE }}
          >
            <path
              d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
              fill="var(--text)"
            />
          </motion.svg>
        ) : (
          /* ── Sun ── */
          <motion.svg
            key="sun"
            width="15" height="15"
            viewBox="0 0 24 24"
            fill="none"
            initial={{ opacity: 0, rotate:  40, scale: 0.75 }}
            animate={{ opacity: 1, rotate: 0,   scale: 1    }}
            exit={{    opacity: 0, rotate: -40, scale: 0.75 }}
            transition={{ duration: 0.32, ease: EASE }}
          >
            <circle cx="12" cy="12" r="4.5" fill="var(--text)" />
            {RAYS.map((r, i) => (
              <line
                key={i}
                x1={r.x1} y1={r.y1}
                x2={r.x2} y2={r.y2}
                stroke="var(--text)"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            ))}
          </motion.svg>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
