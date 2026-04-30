"use client";

import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const sections = [
  {
    heading: "Why I tried this",
    body: [
      "I needed a new portfolio. I had the design direction in my head. What I didn't have was time to learn to code it myself or a developer to hand off to.",
      "AI felt like a third option. Not to replace the thinking — to handle the building while I handled the direction.",
      "So I tried it.",
    ],
  },
  {
    heading: "How the process worked",
    body: [
      "I used Claude Code throughout. The workflow was straightforward: I described what I needed, reviewed what came back, gave feedback, and repeated.",
      "The first thing I built was the design system. Tokens for color, typography, spacing. Light and dark mode. Once that foundation was in place, every new component pulled from it automatically. That consistency — across the homepage, the case study pages, the nav — I didn't have to manage manually. The AI held it.",
      "From there I built panel by panel. The homepage has five sections that snap-scroll horizontally. The work section renders case studies from a data file. Each case study page has its own layout — overview, problem, research, decisions, outcomes — all driven by structured data.",
      "Every time I wanted something new — a scroll-spy nav, a findings grid, a before/after metric card, an icon set — I described it. The AI built it. I reviewed it, adjusted it, sometimes removed it entirely. Knowing what to reject is as important as knowing what to ask for.",
    ],
  },
  {
    heading: "What surprised me",
    body: [
      "The review process was more valuable than the build process.",
      "I started asking the AI to review what we had built — not just write new things. Check this against the template. What's missing? What isn't working?",
      "That's when things got interesting. It caught component bugs I hadn't noticed. It flagged copy that was vague when it should have been specific. It noticed when a section was doing two jobs and suggested splitting it.",
      "I didn't expect the AI to audit. I expected it to generate. The audit turned out to be more useful.",
    ],
  },
  {
    heading: "What I had to do myself",
    body: [
      "Every decision came from me.",
      "What sections the portfolio needed. What the case study structure should look like. What tone felt honest. What to cut when something wasn't working. When to push back on copy that sounded too polished to be true.",
      "The AI would write confident-sounding content. My job was to make sure it was accurate. That discipline — not publishing anything I couldn't defend — had to come from me. The AI doesn't know what's true. It knows what sounds right.",
      "There's a real difference.",
    ],
  },
  {
    heading: "What I'd say to another designer trying this",
    body: [
      "Start with structure, not visuals. Define your design tokens and data models first. Everything else becomes easier when the foundation is consistent.",
      "Treat it as direction, not delegation. You're not handing work off. You're making decisions faster and skipping the part where you have to write every line yourself.",
      "Review constantly. Don't just build forward. Ask the AI to look back at what you've made and tell you what's wrong. That's where the real value shows up.",
      "And be honest. The AI will write whatever you allow it to. The quality of the portfolio reflects the quality of your judgment — not the quality of the prompts.",
    ],
  },
  {
    heading: "The short version",
    body: [
      "I designed this portfolio. I directed every component, every layout, every word. AI built what I described and reviewed what I made.",
      "It took weeks, not months. It works exactly how I wanted it to. And I understood every decision that went into it — because I made every decision that went into it.",
      "That's the part worth taking from this.",
    ],
  },
];

export default function AIArticlePage() {
  return (
    <>
      {/* Minimal nav */}
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          zIndex: 200,
          height: "52px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          background: "transparent",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Link
            href="/"
            style={{
              fontFamily: "var(--font-logo)",
              fontSize: "13px",
              fontWeight: 500,
              color: "var(--text)",
              letterSpacing: "-0.03em",
              height: "32px",
              padding: "0 12px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              background: "transparent",
              display: "inline-flex",
              alignItems: "center",
              textDecoration: "none",
            }}
          >
            Arun Gaddam
          </Link>
          <ThemeToggle />
        </div>
      </motion.header>

      <main style={{ paddingTop: "52px" }}>

        {/* Hero */}
        <section style={{ padding: "64px 0 48px", borderBottom: "1px solid var(--border)" }}>
          <div className="page-pad">
            <motion.div variants={container} initial="hidden" animate="show">

              <motion.div variants={fadeUp}>
                <Link
                  href="/"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "10px",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--muted)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    marginBottom: "40px",
                    transition: "color 0.15s",
                    textDecoration: "none",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}
                >
                  ← Back
                </Link>
              </motion.div>

              <motion.div variants={fadeUp} style={{ marginBottom: "12px" }}>
                <span style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "9px",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#7c3aed",
                  background: "#7c3aed18",
                  padding: "3px 8px",
                  borderRadius: "4px",
                }}>
                  AI Exploration
                </span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "clamp(24px, 4vw, 40px)",
                  fontWeight: 300,
                  lineHeight: 1.2,
                  letterSpacing: "-0.03em",
                  color: "var(--text)",
                  maxWidth: "640px",
                  marginBottom: "20px",
                }}
              >
                Building my portfolio with AI — what I did and what I learned
              </motion.h1>

              <motion.div
                variants={fadeUp}
                style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}
              >
                {[
                  { label: "Tool", value: "Claude Code" },
                  { label: "Stack", value: "Next.js, TypeScript, Framer Motion" },
                  { label: "Duration", value: "Ongoing" },
                ].map(item => (
                  <div key={item.label} style={{ borderTop: "1px solid var(--border)", paddingTop: "10px", minWidth: "120px" }}>
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "4px" }}>
                      {item.label}
                    </p>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--text)", lineHeight: 1.4 }}>
                      {item.value}
                    </p>
                  </div>
                ))}
              </motion.div>

            </motion.div>
          </div>
        </section>

        {/* Article body */}
        <article style={{ padding: "0 0 80px" }}>
          <div className="page-pad">
            <div style={{ maxWidth: "620px", display: "flex", flexDirection: "column", gap: "0" }}>
              {sections.map((section, i) => (
                <motion.div
                  key={section.heading}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.65, ease: EASE, delay: i * 0.04 }}
                  style={{ padding: "48px 0", borderBottom: "1px solid var(--border)" }}
                >
                  <p style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "9px",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--muted)",
                    marginBottom: "20px",
                  }}>
                    {section.heading}
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    {section.body.map((para, j) => (
                      <p
                        key={j}
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "15px",
                          lineHeight: 1.7,
                          letterSpacing: "-0.01em",
                          color: j === 0 ? "var(--text)" : "var(--muted2)",
                          fontWeight: 400,
                        }}
                      >
                        {para}
                      </p>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </article>

      </main>

      <Footer />
    </>
  );
}
