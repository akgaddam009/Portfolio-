"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { CaseStudy } from "@/lib/caseStudies";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ── Plain thumbnail ── */
function Thumbnail({ index, featured }: { index: number; featured?: boolean }) {
  const bgs = ["#ebebea", "#eaeaeb", "#eaebea", "#ebeaea", "#eaeaeb", "#eaebeb"];
  return (
    <div style={{ width: "100%", height: "100%", background: bgs[index % bgs.length] }} />
  );
}

/* ── Card ── */
export default function CaseStudyCard({
  cs,
  index,
  featured,
}: {
  cs: CaseStudy;
  index: number;
  featured?: boolean;
}) {
  const href = `/work/${cs.slug}`;

  if (featured) {
    return (
      <Link href={href}>
        <motion.div
          whileHover={{ y: -3 }}
          transition={{ type: "spring", stiffness: 280, damping: 28 }}
          style={{
            background: "var(--surface)",
            borderRadius: "16px",
            overflow: "hidden",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
          }}
          className="featured-card"
        >
          {/* Thumbnail — left side */}
          <div style={{ height: "320px", position: "relative", overflow: "hidden" }}>
            <Thumbnail index={index} featured />
            {cs.confidential && (
              <div style={{
                position: "absolute", top: "12px", right: "12px",
                background: "rgba(22,163,74,0.9)", backdropFilter: "blur(8px)",
                borderRadius: "8px", padding: "3px 10px",
                fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 510,
                letterSpacing: "-0.01em", color: "#fff",
              }}>
                Confidential
              </div>
            )}
          </div>

          {/* Body — right side */}
          <div style={{
            padding: "32px 28px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}>
            <div>
              {/* Number + type */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 510, letterSpacing: "-0.01em", color: "var(--muted)" }}>
                  {cs.number}
                </span>
                <span style={{ width: "1px", height: "10px", background: "var(--border)" }} />
                <span style={{ fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 510, letterSpacing: "-0.01em", color: "var(--muted)" }}>
                  {cs.type}
                </span>
              </div>

              <h2 style={{
                fontFamily: "var(--font-body)", fontSize: "clamp(18px, 2vw, 24px)",
                fontWeight: 600, lineHeight: 1.25, letterSpacing: "-0.025em",
                color: "var(--text)", marginBottom: "12px",
              }}>
                {cs.title}
              </h2>
              <p style={{
                fontFamily: "var(--font-body)", fontSize: "15px",
                lineHeight: 1.65, color: "var(--muted2)", marginBottom: "28px",
              }}>
                {cs.summary}
              </p>

              {/* Metrics */}
              <div style={{ display: "flex", gap: "20px", marginBottom: "28px" }}>
                {(cs.metrics ?? []).slice(0, 2).map(m => (
                  <div key={m.label}>
                    <p style={{
                      fontFamily: "var(--font-body)", fontSize: "18px", fontWeight: 510,
                      letterSpacing: "-0.03em", color: "var(--text)", lineHeight: 1, marginBottom: "3px",
                    }}>{m.value}</p>
                    <p style={{
                      fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 510,
                      letterSpacing: "-0.01em", color: "var(--muted)",
                    }}>{m.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <span style={{
              display: "inline-flex", alignItems: "center", gap: "4px",
              padding: "8px 16px", alignSelf: "flex-start",
              background: cs.confidential ? "var(--surface2)" : "var(--text)",
              color: cs.confidential ? "var(--muted)" : "var(--bg)",
              borderRadius: "8px",
              fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 510,
              letterSpacing: "-0.01em",
            }}>
              {cs.confidential ? "Request access" : "View case study"}
              <span style={{ opacity: 0.6, fontSize: "11px" }}>{cs.confidential ? "→" : "↗"}</span>
            </span>
          </div>
        </motion.div>

        <style>{`
          @media (max-width: 640px) { .featured-card { grid-template-columns: 1fr !important; } }
        `}</style>
      </Link>
    );
  }

  /* Regular card */
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.65, ease: EASE, delay: (index % 2) * 0.07 }}
    >
      <Link href={href}>
        <motion.div
          whileHover={{ y: -3 }}
          transition={{ type: "spring", stiffness: 280, damping: 28 }}
          style={{
            background: "var(--surface)",
            borderRadius: "16px",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Thumbnail */}
          <div style={{ height: "220px", position: "relative", overflow: "hidden" }}>
            <Thumbnail index={index} />
            {cs.confidential && (
              <div style={{
                position: "absolute", top: "10px", right: "10px",
                background: "rgba(22,163,74,0.9)", backdropFilter: "blur(8px)",
                borderRadius: "8px", padding: "3px 10px",
                fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 510,
                letterSpacing: "-0.01em", color: "#fff",
              }}>
                Confidential
              </div>
            )}
          </div>

          {/* Body */}
          <div style={{ padding: "16px 20px 20px" }}>
            {/* Number + tags */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
              <span style={{ fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 510, letterSpacing: "-0.01em", color: "var(--muted)" }}>
                {cs.number}
              </span>
              {cs.tags.slice(0, 1).map(tag => (
                <span key={tag} style={{
                  fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 510, letterSpacing: "-0.01em",
                  padding: "2px 7px", background: "var(--surface2)",
                  color: "var(--muted)", borderRadius: "6px",
                }}>
                  {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h3 style={{
              fontFamily: "var(--font-body)", fontSize: "15px", fontWeight: 510,
              lineHeight: 1.3, letterSpacing: "-0.02em",
              color: "var(--text)", marginBottom: "10px",
            }}>
              {cs.title}
            </h3>

            {/* Summary */}
            {cs.summary && (
              <p style={{
                fontFamily: "var(--font-body)", fontSize: "13px",
                lineHeight: 1.55, letterSpacing: "-0.01em",
                color: "var(--muted2)", marginBottom: "16px",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}>
                {cs.summary.replace(/==(.+?)==/g, "$1")}
              </p>
            )}

            {/* Metrics + CTA */}
            <div style={{
              display: "flex", justifyContent: "space-between",
              alignItems: "center", flexWrap: "wrap", gap: "8px",
              paddingTop: "12px", borderTop: "1px solid var(--border)",
            }}>
              <div style={{ display: "flex", gap: "14px" }}>
                {(cs.metrics ?? []).slice(0, 2).map(m => (
                  <div key={m.label}>
                    <p style={{
                      fontFamily: "var(--font-body)", fontSize: "15px",
                      fontWeight: 510, letterSpacing: "-0.03em",
                      color: "var(--text)", lineHeight: 1, marginBottom: "2px",
                    }}>{m.value}</p>
                    <p style={{
                      fontFamily: "var(--font-body)", fontSize: "11px",
                      fontWeight: 510, letterSpacing: "-0.01em", color: "var(--muted)",
                    }}>{m.label}</p>
                  </div>
                ))}
              </div>

              <span style={{
                display: "inline-flex", alignItems: "center", gap: "4px",
                padding: "6px 12px",
                background: cs.confidential ? "var(--surface2)" : "var(--text)",
                color: cs.confidential ? "var(--muted)" : "var(--bg)",
                borderRadius: "8px",
                fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 510,
                whiteSpace: "nowrap", letterSpacing: "-0.01em",
              }}>
                {cs.confidential ? "Request access" : "View case study"}
                <span style={{ opacity: 0.6, fontSize: "10px" }}>{cs.confidential ? "→" : "↗"}</span>
              </span>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
