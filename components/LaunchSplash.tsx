"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/* Launch splash — single typographic moment, premium-portfolio rhythm.

   - "Arun Gaddam" reveals character-by-character via stagger + clip mask
   - A hairline draws underneath during the hold
   - Sub-line ("Senior Product Designer") fades in after the name lands
   - Whole composition lifts and fades on exit
   - Once per session (sessionStorage); reduced-motion shortens timings
   - No canvas, no particles — just typography + motion */

const NAME = "Arun Gaddam";
const SUBTITLE = "Senior Product Designer";

const EASE = [0.22, 1, 0.36, 1] as const;
const EASE_OUT = [0.4, 0, 0.2, 1] as const;

export default function LaunchSplash() {
  const [show, setShow] = useState(true);
  const [exiting, setExiting] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("launch-splash-seen")) {
      setShow(false);
      return;
    }
    sessionStorage.setItem("launch-splash-seen", "1");

    const hold = reduced ? 600 : 1500;     // total visible time after reveal
    const exitMs = reduced ? 300 : 750;

    // Reveal completes ~1100ms after mount; then hold; then begin exit.
    const t1 = setTimeout(() => setExiting(true), 1100 + hold);
    const t2 = setTimeout(() => setShow(false),  1100 + hold + exitMs);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [reduced]);

  if (!show) return null;

  // Character reveal — stagger each glyph in. Spaces preserved via a
  // non-animating <span> so layout doesn't collapse.
  const chars = NAME.split("");

  return (
    <motion.div
      role="presentation"
      onClick={() => setExiting(true)}
      initial={false}
      animate={exiting ? "exit" : "shown"}
      variants={{
        shown: { opacity: 1, y: 0 },
        exit:  { opacity: 0, y: -16, transition: { duration: reduced ? 0.3 : 0.7, ease: EASE_OUT } },
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "var(--bg)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        gap: "var(--space-5)",
      }}
      aria-label="Arun Gaddam"
    >
      <h1
        style={{
          fontFamily: "var(--font-body)",
          /* Display scale matching the home hero's premium tier; tracking
             pulled in tight (-0.04em) so the name reads as a wordmark, not
             a paragraph. */
          fontSize: "clamp(44px, 8vw, 96px)",
          fontWeight: 300,
          letterSpacing: "-0.04em",
          lineHeight: 1.05,
          color: "var(--text)",
          margin: 0,
          position: "relative",
          display: "inline-block",
          /* Clip the bottom slightly so the character rise stays masked. */
          paddingBottom: "0.12em",
        }}
      >
        {chars.map((c, i) => {
          if (c === " ") {
            return (
              <span key={i} style={{ display: "inline-block", width: "0.32em" }} aria-hidden="true">
                &nbsp;
              </span>
            );
          }
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                /* Each character is masked inside its own clip box so the
                   y-rise reveals from below, like type lifting off the
                   baseline rather than fading in place. */
                overflow: "hidden",
                verticalAlign: "bottom",
              }}
              aria-hidden="true"
            >
              <motion.span
                style={{ display: "inline-block" }}
                initial={reduced ? { y: 0, opacity: 1 } : { y: "110%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                transition={{
                  delay: reduced ? 0 : 0.08 + i * 0.045,
                  duration: reduced ? 0.2 : 0.8,
                  ease: EASE,
                }}
              >
                {c}
              </motion.span>
            </span>
          );
        })}
      </h1>

      {/* Hairline that draws in from centre once the name has landed.
          Quiet signature element — gives the moment a punctuation point. */}
      <motion.div
        initial={reduced ? { scaleX: 1, opacity: 0.5 } : { scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{
          delay: reduced ? 0 : 0.95,
          duration: reduced ? 0.2 : 0.7,
          ease: EASE,
        }}
        style={{
          width: 56,
          height: 1,
          background: "var(--accent-warm)",
          transformOrigin: "center",
        }}
      />

      <motion.p
        initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: reduced ? 0 : 1.05,
          duration: reduced ? 0.2 : 0.6,
          ease: EASE,
        }}
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-mono-lg)",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--muted2)",
          margin: 0,
        }}
      >
        {SUBTITLE}
      </motion.p>
    </motion.div>
  );
}
