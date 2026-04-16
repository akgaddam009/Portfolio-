"use client";

import { motion, AnimatePresence } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function LoadingScreen({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: EASE }}
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
          {/* Name */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "16px",
              fontWeight: 300,
              letterSpacing: "-0.03em",
              color: "var(--text)",
              marginBottom: "16px",
              whiteSpace: "nowrap",
            }}
          >
            Arun Gaddam
          </motion.p>

          {/* Progress track */}
          <div
            style={{
              width: "120px",
              height: "1px",
              background: "var(--border)",
              overflow: "hidden",
            }}
          >
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.12 }}
              style={{
                height: "100%",
                background: "var(--text)",
                transformOrigin: "left center",
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
