"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import {
  isClickSoundEnabled,
  setClickSoundEnabled,
  subscribeClickSound,
} from "@/lib/clickSound";

const EASE = [0.22, 1, 0.36, 1] as const;

/* Sits beside ThemeToggle and borrows its geometry exactly -- same 44px pill,
   same radius, same chrome shadow and hover fill. Two controls of different
   sizes in the same cluster would read as an accident.

   It exists because sound a visitor did not ask for carries into a quiet room
   or headphones at the wrong volume, and until now there was no way to stop it
   short of muting the tab. */
export default function SoundToggle() {
  const [on, setOn] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setOn(isClickSoundEnabled());
    /* The engine owns the value. Mirror it rather than keeping a second copy
       that can drift. */
    return subscribeClickSound(setOn);
  }, []);

  const toggle = () => setClickSoundEnabled(!on);

  // Placeholder on SSR so the nav does not shift as this mounts.
  if (!mounted) {
    return <div style={{ width: "44px", height: "44px", flexShrink: 0 }} />;
  }

  return (
    <motion.button
      onClick={toggle}
      whileTap={{ scale: 0.88 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      aria-label={on ? "Turn click sound off" : "Turn click sound on"}
      aria-pressed={on}
      title={on ? "Turn click sound off" : "Turn click sound on"}
      style={{
        width: "44px",
        height: "44px",
        borderRadius: "var(--radius-lg)",
        border: "none",
        background: "var(--surface)",
        boxShadow: "var(--chrome-shadow)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        flexShrink: 0,
        transition: "box-shadow 200ms var(--ease-out-quart), background 200ms var(--ease-out-quart)",
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "var(--chrome-shadow-hover)"; e.currentTarget.style.background = "var(--chrome-hover)"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "var(--chrome-shadow)"; e.currentTarget.style.background = "var(--surface)"; }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.svg
          key={on ? "on" : "off"}
          width="15" height="15"
          viewBox="0 0 24 24"
          fill="none"
          initial={{ opacity: 0, scale: 0.75 }}
          animate={{ opacity: 1, scale: 1    }}
          exit={{    opacity: 0, scale: 0.75 }}
          transition={{ duration: 0.32, ease: EASE }}
        >
          {/* Speaker body, shared by both states. */}
          <path
            d="M4 9.5v5a1 1 0 0 0 1 1h3l4 3.5V5L8 8.5H5a1 1 0 0 0-1 1z"
            fill="var(--text)"
          />
          {on ? (
            /* Two arcs rather than three: at 15px a third ring closes up into
               a smudge. */
            <>
              <path d="M15.5 9a4.5 4.5 0 0 1 0 6" stroke="var(--text)" strokeWidth="1.75" strokeLinecap="round" />
              <path d="M18 6.5a8 8 0 0 1 0 11" stroke="var(--text)" strokeWidth="1.75" strokeLinecap="round" />
            </>
          ) : (
            /* A cross, not a slash through the whole glyph. The slash reads as
               "disabled" over the speaker itself; the cross reads as "no
               output", which is what is actually true. */
            <>
              <path d="M16 9.5l5 5" stroke="var(--text)" strokeWidth="1.75" strokeLinecap="round" />
              <path d="M21 9.5l-5 5" stroke="var(--text)" strokeWidth="1.75" strokeLinecap="round" />
            </>
          )}
        </motion.svg>
      </AnimatePresence>
    </motion.button>
  );
}
