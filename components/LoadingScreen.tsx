"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

const TAG_OPEN  = "<h1>";
const NAME      = "Arun Gaddam";
const TAG_CLOSE = "</h1>";
const FULL      = TAG_OPEN + NAME + TAG_CLOSE;
const TYPE_MS   = 35; // per character — total typing ~700ms for 20 chars

type Phase = "typing" | "holding" | "transforming" | "settled";

/**
 * Live-coded reveal loader.
 *
 * Sequence (~1.3s total):
 *   1. <h1>Arun Gaddam</h1> types out one character at a time in mono,
 *      with syntax in --muted and the name in --text.
 *   2. Brief hold while the caret blinks.
 *   3. The <h1> / </h1> tags fade out, the inner text simultaneously morphs
 *      mono → body, 14px → display size, while the layout transitions.
 *   4. "Senior Product Designer" fades in below.
 *   5. Loader exits with the existing slide-up motion.
 */
export default function LoadingScreen({ visible }: { visible: boolean }) {
  const [chars, setChars] = useState(0);
  const [phase, setPhase] = useState<Phase>("typing");

  // Phase 1: typewriter
  useEffect(() => {
    if (!visible || phase !== "typing") return;
    const id = setInterval(() => {
      setChars(c => {
        if (c >= FULL.length) {
          clearInterval(id);
          setPhase("holding");
          return c;
        }
        return c + 1;
      });
    }, TYPE_MS);
    return () => clearInterval(id);
  }, [visible, phase]);

  // Phase 2 → 3 → 4 timeline
  useEffect(() => {
    if (phase === "holding") {
      const t = setTimeout(() => setPhase("transforming"), 200);
      return () => clearTimeout(t);
    }
    if (phase === "transforming") {
      const t = setTimeout(() => setPhase("settled"), 400);
      return () => clearTimeout(t);
    }
  }, [phase]);

  // Slice the typed string into open-tag / name / close-tag segments.
  // Once we're past the typing phase, render the full name unconditionally
  // so the transform morph happens on a stable string.
  const isCode = phase === "typing" || phase === "holding";

  const openVisible = isCode
    ? FULL.slice(0, Math.min(chars, TAG_OPEN.length))
    : TAG_OPEN;
  const nameVisible = isCode
    ? (chars > TAG_OPEN.length
        ? FULL.slice(TAG_OPEN.length, Math.min(chars, TAG_OPEN.length + NAME.length))
        : "")
    : NAME;
  const closeVisible = isCode
    ? (chars > TAG_OPEN.length + NAME.length
        ? FULL.slice(TAG_OPEN.length + NAME.length, chars)
        : "")
    : TAG_CLOSE;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          initial={{ y: "0%" }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.5, ease: EASE }}
          style={{
            position: "fixed",
            inset: 0,
            background: "var(--bg)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          {/* Top sweep — progress indicator */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", overflow: "hidden" }}>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.1, ease: EASE }}
              style={{ width: "100%", height: "1px", background: "var(--border)", transformOrigin: "left center" }}
            />
          </div>

          {/* Code → name container.
              Font-family / font-size / letter-spacing all transition via CSS,
              giving us the morph from mono code to typeset display name. */}
          <div
            style={{
              fontFamily: isCode ? "var(--font-mono)" : "var(--font-body)",
              fontSize: isCode ? "14px" : "clamp(28px, 5vw, 42px)",
              fontWeight: isCode ? 400 : 300,
              letterSpacing: isCode ? "0" : "-0.035em",
              color: "var(--text)",
              lineHeight: 1,
              marginBottom: "16px",
              whiteSpace: "nowrap",
              transition:
                "font-size 0.4s cubic-bezier(0.22,1,0.36,1)," +
                "letter-spacing 0.4s cubic-bezier(0.22,1,0.36,1)," +
                "font-weight 0.3s ease",
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            <motion.span
              animate={{ opacity: isCode ? 1 : 0, width: isCode ? "auto" : 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              style={{ color: "var(--muted)", overflow: "hidden", display: "inline-block" }}
            >
              {openVisible}
            </motion.span>
            <span style={{ color: "var(--text)" }}>{nameVisible}</span>
            <motion.span
              animate={{ opacity: isCode ? 1 : 0, width: isCode ? "auto" : 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              style={{ color: "var(--muted)", overflow: "hidden", display: "inline-block" }}
            >
              {closeVisible}
            </motion.span>
            {/* Blinking caret — only during typing/holding */}
            {isCode && (
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                style={{
                  display: "inline-block",
                  width: "1px",
                  height: "1em",
                  background: "var(--text)",
                  marginLeft: "2px",
                  verticalAlign: "middle",
                }}
              />
            )}
          </div>

          {/* Role — appears after transform settles */}
          <AnimatePresence>
            {phase === "settled" && (
              <motion.p
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: EASE, delay: 0.05 }}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "9px",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                }}
              >
                Senior Product Designer
              </motion.p>
            )}
          </AnimatePresence>

          {/* Bottom metadata — orientation cues, unchanged */}
          <div style={{
            position: "absolute", bottom: "24px",
            left: 0, right: 0,
            display: "flex", justifyContent: "space-between",
            padding: "0 24px",
          }}>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.3 }}
              style={{ fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)" }}
            >
              Portfolio · 2026
            </motion.span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.4 }}
              style={{ fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)" }}
            >
              Hyderabad, India
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
