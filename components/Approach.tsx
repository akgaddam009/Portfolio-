"use client";

import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

const principles = [
  {
    number: "01",
    title: "Problem First, Always",
    body: "I don't start with screens. I start with the decision a user needs to make and work backwards from there. Every artifact — wireframe, prototype, spec — exists to answer a specific product question, not to demonstrate craft.",
  },
  {
    number: "02",
    title: "Systems Thinking at Every Level",
    body: "Good enterprise design means thinking in systems — information architecture, state machines, edge cases, role-based access, error recovery. I design the whole surface, not just the happy path.",
  },
  {
    number: "03",
    title: "AI-Augmented, Not AI-Replaced",
    body: "I use Claude Code, ChatGPT, Cursor, and Replit to accelerate prototyping, research synthesis, and even production code. AI is a multiplier on craft — it doesn't replace judgment. I decide what to build; the tools help me build it faster.",
  },
  {
    number: "04",
    title: "Measure, Then Iterate",
    body: "I define success metrics before design begins. Adoption rate, task completion time, decision accuracy — those are metrics. 'Improved UX' is not. I use Pendo, Mixpanel, and Looker to validate whether the design actually worked.",
  },
];

export default function Approach() {
  return (
    <section style={{ padding: "64px 0 0" }}>
      <div className="page-pad">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
          style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "0" }}
        >
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", whiteSpace: "nowrap" }}>
            Process
          </p>
          <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
        </motion.div>

        {/* Principles */}
        {principles.map((p, i) => (
          <motion.div
            key={p.number}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.65, ease: EASE, delay: i * 0.05 }}
            style={{
              display: "grid",
              gridTemplateColumns: "48px 1fr",
              gap: "24px",
              padding: "24px 0",
              borderBottom: "1px solid var(--border)",
              alignItems: "start",
            }}
          >
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: "0.04em", color: "var(--muted)", paddingTop: "3px" }}>
              {p.number}
            </p>
            <div>
              <h3 style={{ fontFamily: "var(--font-body)", fontSize: "15px", fontWeight: 600, color: "var(--text)", letterSpacing: "-0.01em", lineHeight: 1.3, marginBottom: "8px" }}>
                {p.title}
              </h3>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", lineHeight: 1.65, color: "var(--muted2)", fontWeight: 400 }}>
                {p.body}
              </p>
            </div>
          </motion.div>
        ))}

      </div>
    </section>
  );
}
