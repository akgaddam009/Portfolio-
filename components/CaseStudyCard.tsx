"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { CaseStudy } from "@/lib/caseStudies";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ── Plain thumbnail ───────────────────────────────── */
function Thumbnail({ index }: { index: number }) {
  const bgs = ["#f0f0ee", "#eeeef0", "#eef0ee", "#f0eeee"];
  return (
    <div style={{ width: "100%", height: "100%", background: bgs[index % bgs.length] }} />
  );
}

/* ── Card ──────────────────────────────────────────── */
export default function CaseStudyCard({ cs, index }: { cs: CaseStudy; index: number }) {
  const href = cs.confidential ? "/contact" : `/work/${cs.slug}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, ease: EASE, delay: (index % 2) * 0.08 }}
    >
      <Link href={href}>
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ type: "spring", stiffness: 280, damping: 28 }}
          style={{
            background: "var(--surface)",
            borderRadius: "12px",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Thumbnail */}
          <div style={{ height: "260px", position: "relative", overflow: "hidden" }}>
            <Thumbnail index={index} />
            {cs.confidential && (
              <div style={{
                position: "absolute", top: "10px", right: "10px",
                background: "rgba(22,163,74,0.9)", backdropFilter: "blur(8px)",
                borderRadius: "6px", padding: "3px 10px",
                fontFamily: "var(--font-mono)", fontSize: "9px",
                letterSpacing: "0.08em", textTransform: "uppercase", color: "#fff",
              }}>
                Confidential
              </div>
            )}
          </div>

          {/* Card body */}
          <div style={{ padding: "16px 20px 20px" }}>
            {/* Tags */}
            <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", marginBottom: "10px" }}>
              {cs.tags.slice(0, 2).map(tag => (
                <span key={tag} style={{
                  fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.06em",
                  padding: "3px 8px", background: "var(--surface2)",
                  color: "var(--muted)", borderRadius: "4px",
                }}>
                  {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h3 style={{
              fontFamily: "var(--font-body)",
              fontSize: "16px", fontWeight: 600,
              lineHeight: 1.35, letterSpacing: "-0.02em",
              color: "var(--text)", marginBottom: "16px",
            }}>
              {cs.title}
            </h3>

            {/* Metrics + CTA */}
            <div style={{
              display: "flex", justifyContent: "space-between",
              alignItems: "center", flexWrap: "wrap", gap: "10px",
              paddingTop: "14px", borderTop: "1px solid var(--border)",
            }}>
              <div style={{ display: "flex", gap: "16px" }}>
                {cs.metrics.slice(0, 2).map(m => (
                  <div key={m.label}>
                    <p style={{
                      fontFamily: "var(--font-body)", fontSize: "16px",
                      fontWeight: 700, letterSpacing: "-0.03em",
                      color: "var(--text)", lineHeight: 1, marginBottom: "2px",
                    }}>{m.value}</p>
                    <p style={{
                      fontFamily: "var(--font-mono)", fontSize: "9px",
                      letterSpacing: "0.06em", color: "var(--muted)",
                      textTransform: "uppercase",
                    }}>{m.label}</p>
                  </div>
                ))}
              </div>

              <span style={{
                display: "inline-flex", alignItems: "center", gap: "4px",
                padding: "7px 14px",
                background: cs.confidential ? "var(--surface2)" : "var(--text)",
                color: cs.confidential ? "var(--muted)" : "var(--bg)",
                borderRadius: "6px",
                fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 500,
                whiteSpace: "nowrap", letterSpacing: "-0.01em",
              }}>
                {cs.confidential ? "Request access" : "View case study"}
                <span style={{ opacity: 0.6, fontSize: "11px" }}>{cs.confidential ? "→" : "↗"}</span>
              </span>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
