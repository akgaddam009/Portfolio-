"use client";

import { motion, AnimatePresence } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function LoadingScreen({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          initial={{ y: "0%" }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.8, ease: EASE }}
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
              transition={{ duration: 1.1, ease: EASE, delay: 0 }}
              style={{ width: "100%", height: "1px", background: "var(--border)", transformOrigin: "left center" }}
            />
          </div>

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(28px, 5vw, 42px)",
              fontWeight: 300,
              letterSpacing: "-0.035em",
              color: "var(--text)",
              lineHeight: 1,
              marginBottom: "14px",
              whiteSpace: "nowrap",
            }}
          >
            Arun Gaddam
          </motion.h1>

          {/* Name underline sweep */}
          <div style={{ width: "clamp(120px, 18vw, 200px)", height: "1px", overflow: "hidden", marginBottom: "16px" }}>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.55, ease: EASE, delay: 0.4 }}
              style={{ width: "100%", height: "1px", background: "var(--border)", transformOrigin: "left center" }}
            />
          </div>

          {/* Role */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.65 }}
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

          {/* Bottom metadata */}
          <div style={{
            position: "absolute", bottom: "24px",
            left: 0, right: 0,
            display: "flex", justifyContent: "space-between",
            padding: "0 24px",
          }}>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.75 }}
              style={{ fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)" }}
            >
              Portfolio · 2026
            </motion.span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.85 }}
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
