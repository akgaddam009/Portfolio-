"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const EASE = [0.22, 1, 0.36, 1] as const;

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};

const infoCards = [
  {
    label: "Role",
    value: "Senior Product Designer. I own the full design process — from discovery and strategy to final pixel.",
  },
  {
    label: "Focus",
    value: "Enterprise SaaS, B2B AI tools, and consumer products at scale — with user research as a core part of the process.",
  },
  {
    label: "Experience",
    value: "8+ years designing complex enterprise apps to consumer mobile app influencing roadmaps, mentoring designers, and collaborating across cross-functional teams.",
  },
  {
    label: "Superpower",
    value: "I can hold the big picture and still get into the details that matter.",
  },
];

export default function Hero() {
  return (
    <section style={{ paddingTop: "96px", paddingBottom: "0" }}>
      <div className="page-pad">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          style={{ display: "flex", flexDirection: "column" }}
        >
          {/* Headline */}
          <motion.h1
            variants={item}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(26px, 4vw, 40px)",
              fontWeight: 500,
              lineHeight: 1.2,
              letterSpacing: "-0.03em",
              color: "var(--text)",
              marginBottom: "20px",
            }}
          >
            Hey, I&apos;m Arun.{" "}
            <span style={{ color: "var(--muted)" }}>
              I design products at the intersection of UX, product thinking, and AI.
            </span>
          </motion.h1>

          {/* Subheader */}
          <motion.p
            variants={item}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "15px",
              lineHeight: 1.65,
              color: "var(--muted)",
              marginBottom: "48px",
              maxWidth: "520px",
            }}
          >
            I&apos;m based in Hyderabad, India with my wife and our son — figuring out the balance between designing products, catching up with AI, and raising a tiny human. I&apos;m learning a lot from both.
          </motion.p>

          {/* Info grid — 2×2 + last spans full */}
          <motion.div variants={item}>
            <div style={{ borderTop: "1px solid var(--border)" }} />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                borderBottom: "1px solid var(--border)",
              }}
              className="info-grid"
            >
              {infoCards.map((card, i) => {
                const total = infoCards.length;
                const isLastOdd = total % 2 === 1 && i === total - 1;
                const isLeft = i % 2 === 0;
                const isLastRow = i >= total - (isLastOdd ? 1 : 2);
                return (
                  <div
                    key={card.label}
                    style={{
                      padding: "18px 0",
                      paddingRight: !isLastOdd && isLeft ? "28px" : "0",
                      paddingLeft: !isLastOdd && !isLeft ? "28px" : "0",
                      borderRight: !isLastOdd && isLeft ? "1px solid var(--border)" : "none",
                      borderBottom: !isLastRow ? "1px solid var(--border)" : "none",
                      gridColumn: isLastOdd ? "1 / -1" : "auto",
                    }}
                  >
                    <p style={{
                      fontFamily: "var(--font-mono)", fontSize: "10px",
                      letterSpacing: "0.08em", textTransform: "uppercase",
                      color: "var(--muted)", marginBottom: "6px",
                    }}>
                      {card.label}
                    </p>
                    <p style={{
                      fontFamily: "var(--font-body)", fontSize: "14px",
                      color: "var(--text)", lineHeight: 1.55,
                      letterSpacing: "-0.01em",
                    }}>
                      {card.value}
                    </p>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* CTAs */}
          <motion.div
            variants={item}
            style={{ display: "flex", alignItems: "center", gap: "24px", marginTop: "32px" }}
          >
            <Link
              href="/#work"
              style={{
                fontFamily: "var(--font-mono)", fontSize: "11px",
                letterSpacing: "0.05em", textTransform: "uppercase",
                color: "var(--text)", transition: "opacity 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.5")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              View work ↓
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 500px) {
          .info-grid { grid-template-columns: 1fr !important; }
          .info-grid > div { padding-left: 0 !important; padding-right: 0 !important; border-right: none !important; border-bottom: 1px solid var(--border) !important; }
        }
      `}</style>
    </section>
  );
}
