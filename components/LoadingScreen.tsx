"use client";

import { motion, AnimatePresence } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Shimmer-skeleton loader.
 *
 * Renders five panel-shaped placeholders matching the homepage layout
 * (About / Selected Work / Career / Testimonials / Contact). A diagonal
 * shimmer sweep animates across each panel until `visible` flips false,
 * at which point the whole layer fades out.
 *
 * No typewriter, no choreography — just a quiet wait state so the page
 * doesn't pop in cold.
 */
export default function LoadingScreen({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(6px)" }}
          transition={{ duration: 0.55, ease: EASE }}
          aria-hidden
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "var(--bg)",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            overflow: "hidden",
            padding: "80px 24px 24px",
            gap: "8px",
          }}
        >
          {/* Inline shimmer keyframes scoped to this component */}
          <style>{`
            @keyframes loading-shimmer-sweep {
              0%   { transform: translateX(-100%); opacity: 0; }
              15%  { opacity: 1; }
              85%  { opacity: 1; }
              100% { transform: translateX(220%); opacity: 0; }
            }
            .loading-shimmer-panel {
              will-change: opacity;
            }
            .loading-shimmer-panel::before {
              content: "";
              position: absolute;
              top: 0; left: 0; bottom: 0;
              width: 80%;
              background: linear-gradient(
                90deg,
                transparent 0%,
                color-mix(in srgb, var(--text) 5%, transparent) 50%,
                transparent 100%
              );
              animation: loading-shimmer-sweep 2.4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
              animation-delay: var(--shimmer-delay, 0s);
              pointer-events: none;
              will-change: transform, opacity;
            }
            @media (prefers-reduced-motion: reduce) {
              .loading-shimmer-panel::before { animation: none; opacity: 0.35; transform: none; }
            }
          `}</style>

          {/* Five panel skeletons, matching the workspace layout's flex row */}
          <div style={{
            display: "flex",
            flexDirection: "row",
            gap: "8px",
            width: "100%",
            height: "100%",
            maxWidth: "1800px",
            margin: "0 auto",
          }}>
            {[440, 420, 420, 440, 380].map((width, i) => (
              <motion.div
                key={i}
                className="loading-shimmer-panel"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: EASE, delay: i * 0.06 }}
                style={{
                  position: "relative",
                  flexShrink: 0,
                  width: `${width}px`,
                  height: "100%",
                  borderRadius: "16px",
                  background: "var(--surface)",
                  overflow: "hidden",
                  // Stagger the shimmer sweep on each panel so the row doesn't pulse in unison
                  ["--shimmer-delay" as string]: `${i * 0.18}s`,
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
