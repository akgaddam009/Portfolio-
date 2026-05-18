"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

export type CareerDetail = {
  title: string;
  subtitle?: string;
  dateLabel?: string;
  logoDomain?: string;
  description?: string;
  highlights?: string[];
  learnings?: string[];
};

type Props = {
  item: CareerDetail | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
};

export default function CareerDetailSheet({ item, onClose, onPrev, onNext, hasPrev, hasNext }: Props) {
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = item ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [item]);

  return (
    <AnimatePresence>
      {item && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            style={{
              position: "fixed", inset: 0,
              background: "rgba(0,0,0,0.36)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
              zIndex: 400,
            }}
          />

          {/* Sheet */}
          <motion.div
            key="sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.48, ease: EASE }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={{ top: 0, bottom: 0.2 }}
            onDragEnd={(_, info) => { if (info.offset.y > 80) onClose(); }}
            style={{
              position: "fixed",
              bottom: 0, left: 0, right: 0,
              maxHeight: "88vh",
              background: "var(--bg)",
              borderRadius: "20px 20px 0 0",
              border: "1px solid var(--border)",
              borderBottom: "none",
              zIndex: 401,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              touchAction: "none",
            }}
          >
            {/* Drag handle */}
            <div style={{
              display: "flex", justifyContent: "center",
              padding: "12px 0 8px", flexShrink: 0,
              cursor: "grab",
            }}>
              <div style={{
                width: "36px", height: "4px",
                borderRadius: "2px",
                background: "var(--border)",
              }} />
            </div>

            {/* Scrollable content */}
            <div style={{ flex: 1, overflowY: "auto", padding: "8px 24px 0", cursor: "default" }}>

              {/* Logo */}
              {item.logoDomain && (
                <div style={{
                  width: "44px", height: "44px",
                  borderRadius: "16px",
                  border: "1px solid var(--border)",
                  background: "var(--bg)",
                  overflow: "hidden",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: "16px",
                }}>
                  <img
                    src={`https://logo.clearbit.com/${item.logoDomain}`}
                    alt={item.subtitle}
                    width={36} height={36}
                    style={{ objectFit: "contain", display: "block" }}
                    onError={e => { (e.currentTarget.parentElement as HTMLElement).style.display = "none"; }}
                  />
                </div>
              )}

              {/* Title */}
              <h2 style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(18px, 4vw, 24px)",
                fontWeight: 510,
                letterSpacing: "-0.025em",
                color: "var(--text)",
                lineHeight: 1.2,
                marginBottom: "8px",
              }}>
                {item.title}
              </h2>

              {/* Company + date */}
              <p style={{
                fontFamily: "var(--font-body)",
                fontSize: "11px",
                fontWeight: 510,
                letterSpacing: "-0.01em",
                color: "var(--muted)",
                marginBottom: "24px",
              }}>
                {item.subtitle}{item.dateLabel ? ` · ${item.dateLabel}` : ""}
              </p>

              {/* Description */}
              {item.description && (
                <p style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "15px",
                  fontWeight: 400,
                  letterSpacing: "-0.01em",
                  lineHeight: 1.65,
                  color: "var(--muted2)",
                  marginBottom: "32px",
                }}>
                  {item.description}
                </p>
              )}

              {/* Highlights */}
              {item.highlights && item.highlights.length > 0 && (
                <div style={{ marginBottom: "32px" }}>
                  <p style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "11px",
                    fontWeight: 510,
                    letterSpacing: "-0.01em",
                    color: "var(--muted)",
                    marginBottom: "16px",
                  }}>
                    Stuff I worked on
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {item.highlights.map((h, i) => (
                      <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                        <span style={{
                          color: "var(--muted)", flexShrink: 0,
                          fontFamily: "var(--font-body)", fontSize: "16px", lineHeight: 1.4,
                        }}>·</span>
                        <p style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "15px", fontWeight: 400,
                          letterSpacing: "-0.01em", lineHeight: 1.55,
                          color: "var(--text)",
                        }}>
                          {h}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Learnings */}
              {item.learnings && item.learnings.length > 0 && (
                <div style={{ marginBottom: "48px" }}>
                  <p style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "11px",
                    fontWeight: 510,
                    letterSpacing: "-0.01em",
                    color: "var(--muted)",
                    marginBottom: "16px",
                  }}>
                    Things I learned
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {item.learnings.map((l, i) => (
                      <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                        <span style={{
                          color: "var(--muted)", flexShrink: 0,
                          fontFamily: "var(--font-body)", fontSize: "16px", lineHeight: 1.4,
                        }}>·</span>
                        <p style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "15px", fontWeight: 400,
                          letterSpacing: "-0.01em", lineHeight: 1.55,
                          color: "var(--text)",
                        }}>
                          {l}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom controls */}
            <div style={{
              flexShrink: 0,
              padding: "16px 24px 32px",
              borderTop: "1px solid var(--border)",
              background: "var(--bg)",
              display: "flex",
              gap: "8px",
              justifyContent: "center",
              alignItems: "center",
            }}>
              <motion.button
                onClick={onPrev}
                disabled={!hasPrev}
                whileTap={hasPrev ? { scale: 0.9 } : {}}
                style={{
                  width: "40px", height: "40px",
                  borderRadius: "16px",
                  border: "1px solid var(--border)",
                  background: "var(--bg)",
                  color: "var(--text)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: hasPrev ? "pointer" : "default",
                  opacity: hasPrev ? 1 : 0.3,
                  fontSize: "18px",
                  transition: "opacity 0.15s",
                }}
              >
                ‹
              </motion.button>

              <motion.button
                onClick={onClose}
                whileTap={{ scale: 0.96 }}
                style={{
                  height: "40px",
                  padding: "0 28px",
                  borderRadius: "16px",
                  border: "1px solid var(--border)",
                  background: "var(--bg)",
                  color: "var(--text)",
                  cursor: "pointer",
                  fontFamily: "var(--font-body)",
                  fontSize: "13px",
                  fontWeight: 510,
                  letterSpacing: "-0.01em",
                }}
              >
                Close
              </motion.button>

              <motion.button
                onClick={onNext}
                disabled={!hasNext}
                whileTap={hasNext ? { scale: 0.9 } : {}}
                style={{
                  width: "40px", height: "40px",
                  borderRadius: "16px",
                  border: "1px solid var(--border)",
                  background: "var(--bg)",
                  color: "var(--text)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: hasNext ? "pointer" : "default",
                  opacity: hasNext ? 1 : 0.3,
                  fontSize: "18px",
                  transition: "opacity 0.15s",
                }}
              >
                ›
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
