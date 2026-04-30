"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

const months = ["Feb 2024", "Mar 2024", "May 2024"];

export default function Awards() {
  return (
    <section style={{ padding: "64px 0 0" }}>
      <div className="page-pad">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
          style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}
        >
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", whiteSpace: "nowrap" }}>
            Recognition · ADPList
          </p>
          <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: EASE, delay: 0.05 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            padding: "20px 24px",
            background: "var(--surface)",
            borderRadius: "14px",
          }}
        >
          {/* Badge */}
          <div style={{
            width: "40px", height: "40px", borderRadius: "50%",
            background: "var(--text)", flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "16px", lineHeight: 1,
          }}>
            ★
          </div>

          {/* Text */}
          <div style={{ flex: 1 }}>
            <p style={{
              fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 600,
              color: "var(--text)", marginBottom: "3px", letterSpacing: "-0.01em",
            }}>
              ADPList Super Mentor
            </p>
            <p style={{
              fontFamily: "var(--font-mono)", fontSize: "10px",
              color: "var(--muted)", letterSpacing: "0.04em",
            }}>
              Top 1% Mentor Recognition · 3× awarded
            </p>
          </div>

          {/* Months + profile link */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-end", flexShrink: 0 }}>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "flex-end" }}>
              {months.map(m => (
                <span key={m} style={{
                  fontFamily: "var(--font-mono)", fontSize: "10px",
                  color: "var(--muted2)", letterSpacing: "0.04em",
                  padding: "4px 10px", background: "var(--surface2)", borderRadius: "6px",
                }}>
                  {m}
                </span>
              ))}
            </div>
            <Link
              href="https://adplist.org/mentors/arun-gaddam"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.04em", color: "var(--muted)", textDecoration: "underline", textDecorationColor: "var(--border)", transition: "color 0.15s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}
            >
              View profile ↗
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
