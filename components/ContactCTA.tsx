"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function ContactCTA() {
  return (
    <section style={{ padding: "64px 0 80px" }}>
      <div className="page-pad">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{
            background: "var(--text)", borderRadius: "12px",
            padding: "40px 36px",
          }}
        >
          <h2 style={{
            fontFamily: "var(--font-body)", fontSize: "clamp(22px, 3vw, 28px)",
            fontWeight: 300, lineHeight: 1.25, letterSpacing: "-0.025em",
            color: "var(--bg)", marginBottom: "10px",
          }}>
            Have a hard problem?
          </h2>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "rgba(245,244,240,0.5)", lineHeight: 1.6, marginBottom: "28px", maxWidth: "380px" }}>
            I&apos;m always happy to talk about product, design, or AI — whether it&apos;s a collaboration, a question, or just a conversation.
          </p>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <Link href="mailto:akgaddam02@gmail.com" style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 400,
              padding: "9px 20px", background: "var(--bg)", color: "var(--text)",
              borderRadius: "8px", letterSpacing: "-0.01em", transition: "opacity 0.15s",
            }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              Say hello →
            </Link>
            <Link href="https://linkedin.com/in/akgaddam" target="_blank" rel="noopener noreferrer" style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 400,
              padding: "9px 20px", border: "1px solid rgba(245,244,240,0.15)",
              color: "rgba(245,244,240,0.65)", borderRadius: "8px",
              letterSpacing: "-0.01em", transition: "border-color 0.15s, color 0.15s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(245,244,240,0.4)"; e.currentTarget.style.color = "rgba(245,244,240,1)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(245,244,240,0.15)"; e.currentTarget.style.color = "rgba(245,244,240,0.65)"; }}
            >
              LinkedIn ↗
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
