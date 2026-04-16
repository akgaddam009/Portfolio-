"use client";

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Cursor from "@/components/Cursor";
import ContactCTA from "@/components/ContactCTA";
import PageTransition from "@/components/PageTransition";
import Link from "next/link";
import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

const timeline = [
  {
    year: "2025",
    role: "Senior Product Designer",
    company: "Planful Software, India",
    note: "Led end-to-end design of two finance planning features, reducing training time ~30% and supporting migration of core finance workflows from legacy tools to a modern web interface.",
  },
  {
    year: "2024–2025",
    role: "Senior UX Designer",
    company: "Reputation.com, India",
    note: "Led design across Insights, Reporting, Business Listings, and Reviews — verticals directly tied to primary revenue drivers and AI initiatives. Designed a unified Competitive Insights workflow that reduced task time by 40% and improved customer retention. Implemented design QA, cutting defects by ~25%.",
  },
  {
    year: "2022–2023",
    role: "Senior Product Designer",
    company: "Zetwerk, India",
    note: "Led design for Zetwerk's Order Management System during a ~6× revenue growth phase. Mentored three designers and established UX practices — research, concept validation, usability testing — reducing backlog by ~20–30%.",
  },
  {
    year: "2020–2022",
    role: "Manager, UX",
    company: "FanCode (Dream Sports), India",
    note: "Owned UX for a core product initiative across a ~50M user base. Led research and concept validation that informed a 12-month roadmap, increasing new-user retention by 18% and boosting subscriptions.",
  },
  {
    year: "2016–2020",
    role: "UX Designer (Founder)",
    company: "Quazire Consulting",
    note: "Founded a design consultancy. Worked across startups and enterprise clients on product design, UX strategy, and design systems.",
  },
];

const qa = [
  {
    q: "What does good enterprise design actually look like?",
    a: "It looks invisible. No one is confused, no one needs training, no one opens a support ticket. The hardest problems in enterprise are almost always information architecture problems masquerading as UI problems — you fix the mental model and the UI problems often solve themselves.",
  },
  {
    q: "How do you think about AI in product design?",
    a: "Two ways. First, as a design surface: AI features require different trust patterns than traditional UI. You're not designing interactions — you're designing relationships with uncertainty. Second, as a personal tool: I use Claude Code, ChatGPT, Cursor, and Replit daily. AI has made me meaningfully faster without changing what I think about.",
  },
  {
    q: "What makes you effective in cross-functional teams?",
    a: "I speak enough engineering to be dangerous, enough data science to ask the right questions, and enough business to connect decisions to outcomes. Design's job isn't to advocate for users against the business — it's to find where user needs and business goals overlap and make that the product.",
  },
];

const toolCategories = [
  {
    label: "Design",
    tools: ["Figma", "FigJam", "Miro"],
  },
  {
    label: "AI",
    tools: ["Claude", "Figma AI", "ChatGPT", "Gemini"],
  },
  {
    label: "Research",
    tools: ["Dovetail", "Optimal Workshop"],
  },
  {
    label: "Data",
    tools: ["Pendo", "Mixpanel", "Looker", "Google Analytics"],
  },
];

function SectionLabel({ children }: { children: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, ease: EASE }}
      style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "0" }}
    >
      <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", whiteSpace: "nowrap" }}>
        {children}
      </p>
      <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
    </motion.div>
  );
}

export default function AboutPage() {
  return (
    <>
      <Cursor />
      <Nav />
      <main style={{ paddingTop: "52px" }}>
      <PageTransition>

        {/* Intro */}
        <section style={{ padding: "48px 0 0" }}>
          <div className="page-pad">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: EASE, delay: 0.1 }}
              style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "16px" }}
            >
              About
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: EASE, delay: 0.12 }}
              style={{ fontFamily: "var(--font-body)", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 300, lineHeight: 1.2, letterSpacing: "-0.03em", color: "var(--text)", marginBottom: "24px" }}
            >
              I&apos;m Arun Gaddam.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.18 }}
              style={{ fontFamily: "var(--font-body)", fontSize: "14px", lineHeight: 1.7, color: "var(--muted2)", marginBottom: "16px" }}
            >
              Senior UX/Product Designer with 8+ years across startups and large-scale consumer products. I&apos;ve designed for apps with millions of users — from a 50M-user sports platform to enterprise SaaS tools tied directly to revenue. I care about systems that work, not just screens that look good.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.24 }}
              style={{ fontFamily: "var(--font-body)", fontSize: "14px", lineHeight: 1.7, color: "var(--muted2)", marginBottom: "16px" }}
            >
              I work at the intersection of UX, product thinking, and AI. I care about the problem before the interface, the system before the screen, and the metric before the launch. I&apos;ve led cross-functional teams, mentored designers, and shipped design systems adopted across multiple product surfaces.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.30 }}
              style={{ fontFamily: "var(--font-body)", fontSize: "14px", lineHeight: 1.7, color: "var(--muted2)", marginBottom: "32px" }}
            >
              Outside work, I&apos;m in Hyderabad with my wife and our son — figuring out how to be present as a parent while staying sharp as a designer. AI helps with the second part.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE, delay: 0.36 }} style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
              <Link href="mailto:akgaddam02@gmail.com" className="btn-primary">Get in touch →</Link>
              <Link
                href="/cv.pdf"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: "var(--font-mono)", fontSize: "10px",
                  letterSpacing: "0.06em", textTransform: "uppercase",
                  color: "var(--muted)", transition: "color 0.15s",
                  display: "inline-flex", alignItems: "center", gap: "5px",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}
              >
                Download CV ↓
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Perspective Q&A */}
        <section style={{ padding: "48px 0 0" }}>
          <div className="page-pad">
            <SectionLabel>Perspective</SectionLabel>
            {qa.map(({ q, a }, i) => (
              <motion.div
                key={q}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: EASE, delay: i * 0.06 }}
                style={{ padding: "24px 0", borderBottom: "1px solid var(--border)", borderTop: i === 0 ? "1px solid var(--border)" : "none", marginTop: i === 0 ? "20px" : "0" }}
              >
                <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 400, color: "var(--text)", marginBottom: "8px", letterSpacing: "-0.01em" }}>{q}</p>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", lineHeight: 1.7, color: "var(--muted2)" }}>{a}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Experience */}
        <section style={{ padding: "48px 0 0" }}>
          <div className="page-pad">
            <SectionLabel>Experience</SectionLabel>
            {timeline.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: EASE, delay: i * 0.05 }}
                style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: "24px", padding: "24px 0", borderTop: "1px solid var(--border)", marginTop: i === 0 ? "20px" : "0", alignItems: "start" }}
                className="timeline-item"
              >
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.06em", color: "var(--muted)", paddingTop: "3px" }}>{item.year}</p>
                <div>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 400, color: "var(--text)", marginBottom: "2px", letterSpacing: "-0.01em" }}>{item.role}</p>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 400, letterSpacing: "-0.01em", color: "var(--muted)", marginBottom: "8px" }}>{item.company}</p>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", lineHeight: 1.6, color: "var(--muted2)" }}>{item.note}</p>
                </div>
              </motion.div>
            ))}
            <div style={{ borderTop: "1px solid var(--border)" }} />
          </div>
        </section>

        {/* Tools — categorized */}
        <section style={{ padding: "48px 0 0" }}>
          <div className="page-pad">
            <SectionLabel>Tools</SectionLabel>
            <div style={{ paddingTop: "20px", display: "flex", flexDirection: "column", gap: "0" }}>
              {toolCategories.map((cat, i) => (
                <motion.div
                  key={cat.label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, ease: EASE, delay: i * 0.04 }}
                  style={{ display: "grid", gridTemplateColumns: "96px 1fr", gap: "16px", padding: "16px 0", borderTop: "1px solid var(--border)", alignItems: "start" }}
                  className="tools-row"
                >
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--muted)", paddingTop: "5px" }}>
                    {cat.label}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {cat.tools.map(t => (
                      <span key={t} style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 400, padding: "4px 12px", background: "var(--surface)", color: "var(--muted2)", borderRadius: "5px", letterSpacing: "-0.01em" }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
              <div style={{ borderTop: "1px solid var(--border)" }} />
            </div>
          </div>
        </section>

        {/* Education */}
        <section style={{ padding: "48px 0 0" }}>
          <div className="page-pad">
            <SectionLabel>Education</SectionLabel>
            {[
              { year: "2020–21", title: "Program in UX Design", org: "IIT Bombay" },
              { year: "2017",    title: "Executive Certificate in Design Thinking & Leadership", org: "DSIL Global" },
              { year: "2010–11", title: "MBA, Strategic Management", org: "Cardiff School of Management" },
            ].map((e, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: EASE, delay: i * 0.05 }}
                style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: "20px", padding: "20px 0", borderTop: "1px solid var(--border)", marginTop: i === 0 ? "20px" : "0", alignItems: "start" }}
                className="timeline-item"
              >
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.06em", color: "var(--muted)", paddingTop: "3px" }}>{e.year}</p>
                <div>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 400, color: "var(--text)", marginBottom: "2px", letterSpacing: "-0.01em" }}>{e.title}</p>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 400, letterSpacing: "-0.01em", color: "var(--muted)" }}>{e.org}</p>
                </div>
              </motion.div>
            ))}
            <div style={{ borderTop: "1px solid var(--border)" }} />
          </div>
        </section>

        <ContactCTA />
      </PageTransition>
      </main>
      <Footer />

      <style>{`
        @media (max-width: 480px) {
          .timeline-item { grid-template-columns: 1fr !important; gap: 6px !important; }
          .tools-row { grid-template-columns: 1fr !important; gap: 8px !important; }
        }
      `}</style>
    </>
  );
}
