"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const EASE = [0.22, 1, 0.36, 1] as const;

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};

/* Info cards — MC's Role/Focus/Stack/Experience blocks */
const infoCards = [
  {
    label: "Role",
    value: "Senior Product Designer. I own everything from discovery to design and now can produce code using Claude Code.",
  },
  {
    label: "Focus",
    value: "My main focus is product design & product thinking, but I also dabble in user research.",
  },
  {
    label: "Stack",
    value: "Cursor, Claude Code, Figma, and more.",
  },
  {
    label: "Experience",
    value: "8+ years designing digital products for product based companies in complex enterprise apps to consumer mobile app ranging more than 50m users. — influencing roadmaps, mentoring designers, and collaborating across cross-functional teams.",
  },
  {
    label: "Superpower",
    value: "I can hold the big picture and still get into the details that matter.",
  },
];

export default function Hero() {
  return (
    <section
      style={{ paddingTop: "96px", paddingBottom: "0" }}
    >
      <div className="page-pad">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          style={{ display: "flex", flexDirection: "column", gap: "0" }}
        >
          {/* Intro — MC's conversational opening */}
          <motion.p
            variants={item}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(22px, 3vw, 28px)",
              fontWeight: 400,
              lineHeight: 1.55,
              color: "var(--text)",
              marginBottom: "20px",
              letterSpacing: "-0.02em",
            }}
          >
            Hey, I&apos;m Arun.{" "}
            <span style={{ color: "var(--muted)" }}>
              I design products at the intersection of UX, product thinking, and AI.
            </span>
          </motion.p>

          <motion.p
            variants={item}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "15px",
              fontWeight: 400,
              lineHeight: 1.65,
              color: "var(--muted)",
              marginBottom: "48px",
              letterSpacing: "-0.01em",
              maxWidth: "520px",
            }}
          >
            I&apos;m based in Hyderabad, India with my wife and our son — figuring out the balance between designing products, catching up with AI, and raising a tiny human. I&apos;m learning a lot from both.
          </motion.p>

          {/* CTA row */}
          <motion.div
            variants={item}
            style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "56px" }}
          >
            <Link
              href="/#work"
              style={{
                fontFamily: "var(--font-mono)", fontSize: "11px",
                letterSpacing: "0.04em", color: "var(--muted)",
                textDecoration: "underline", textDecorationColor: "var(--border)",
                transition: "color 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}
            >
              View work ↓
            </Link>
            <Link
              href="mailto:hello@arungaddam.com"
              style={{
                fontFamily: "var(--font-mono)", fontSize: "11px",
                letterSpacing: "0.04em", color: "var(--muted)",
                textDecoration: "underline", textDecorationColor: "var(--border)",
                transition: "color 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}
            >
              Get in touch →
            </Link>
          </motion.div>

          {/* Info rows — linear stacked */}
          <motion.div variants={item}>
            <div>
              {infoCards.map((card, i) => (
                <div
                  key={card.label}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "96px 1fr",
                    gap: "16px",
                    padding: "16px 0",
                    borderTop: "1px solid var(--border)",
                    alignItems: "baseline",
                  }}
                >
                  <p style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "10px",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--muted)",
                    paddingTop: "2px",
                  }}>
                    {card.label}
                  </p>
                  <p style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "14px",
                    fontWeight: 400,
                    color: "var(--text)",
                    lineHeight: 1.6,
                    letterSpacing: "-0.01em",
                  }}>
                    {card.value}
                  </p>
                </div>
              ))}
              <div style={{ borderTop: "1px solid var(--border)" }} />
            </div>
          </motion.div>
        </motion.div>
      </div>

    </section>
  );
}
