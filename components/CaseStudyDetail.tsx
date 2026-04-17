"use client";

import Link from "next/link";
import Footer from "@/components/Footer";
import Cursor from "@/components/Cursor";
import Nav from "@/components/Nav";
import { motion } from "framer-motion";
import { useState } from "react";
import type { CaseStudy, CaseStudyImage } from "@/lib/caseStudies";
import { caseStudies } from "@/lib/caseStudies";

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

export default function CaseStudyDetail({ cs }: { cs: CaseStudy }) {
  const currentIndex = caseStudies.findIndex((c) => c.slug === cs.slug);
  const next = caseStudies[currentIndex + 1];

  return (
    <>
      <Cursor />
      <Nav />
      <main style={{ paddingTop: "52px" }}>

        {/* Hero */}
        <section style={{ padding: "48px 0", borderBottom: "1px solid var(--border)" }}>
          <div className="page-pad">
            <motion.div variants={container} initial="hidden" animate="show">
              <motion.div variants={fadeUp}>
                <Link
                  href="/#work"
                  style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", display: "inline-flex", alignItems: "center", gap: "6px", marginBottom: "36px", transition: "color 0.15s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}
                >
                  ← Back to work
                </Link>
              </motion.div>

              <motion.div variants={fadeUp} style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
                {cs.tags.map(tag => (
                  <span key={tag} style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.06em", textTransform: "uppercase", padding: "3px 8px", background: "var(--surface)", color: "var(--muted)", borderRadius: "4px" }}>
                    {tag}
                  </span>
                ))}
                {cs.confidential && (
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.06em", textTransform: "uppercase", padding: "3px 8px", background: "var(--surface)", color: "var(--muted)", borderRadius: "4px" }}>
                    Confidential — available 1:1
                  </span>
                )}
              </motion.div>

              <motion.p variants={fadeUp} style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "10px" }}>
                {cs.number}
              </motion.p>

              <motion.h1
                variants={fadeUp}
                style={{ fontFamily: "var(--font-body)", fontSize: "clamp(26px, 4vw, 44px)", fontWeight: 300, lineHeight: 1.15, letterSpacing: "-0.03em", color: "var(--text)", marginBottom: "16px" }}
              >
                {cs.title}
              </motion.h1>

              <motion.p
                variants={fadeUp}
                style={{ fontFamily: "var(--font-body)", fontSize: "15px", fontWeight: 400, lineHeight: 1.65, color: "var(--muted)", maxWidth: "520px", marginBottom: "32px" }}
              >
                {cs.subtitle}
              </motion.p>

              <motion.div variants={fadeUp} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "16px" }}>
                {[
                  { label: "Type", value: cs.type },
                  { label: "Role", value: cs.role },
                  cs.company  ? { label: "Company",  value: cs.company  } : null,
                  cs.timeline ? { label: "Timeline", value: cs.timeline } : null,
                  cs.team     ? { label: "Team",     value: cs.team     } : null,
                ].filter(Boolean).map(item => (
                  <div key={item!.label} style={{ borderTop: "1px solid var(--border)", paddingTop: "12px" }}>
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "5px" }}>{item!.label}</p>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 400, color: "var(--text)", lineHeight: 1.4 }}>{item!.value}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Metrics bar */}
        <div style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)", padding: "32px 0" }}>
          <div className="page-pad">
            <div style={{ display: "flex", gap: "32px", flexWrap: "wrap" }}>
              {cs.metrics.map(m => (
                <div key={m.label}>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 400, letterSpacing: "-0.03em", color: "var(--text)", lineHeight: 1, marginBottom: "4px" }}>
                    {m.value}
                  </p>
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)" }}>{m.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Body */}
        <article style={{ padding: "0" }}>
          <div className="page-pad">

            <CsSection label="Overview"><BodyText>{cs.summary}</BodyText></CsSection>

            <CsSection label="The Problem">
              <BodyText>{cs.problem}</BodyText>
              <ImageBlock image={cs.problemImage} placeholder="Legacy tool — Excel Spotlight screenshots or flow diagram" />
            </CsSection>

            {cs.insight && (
              <section style={{ padding: "48px 0", borderBottom: "1px solid var(--border)" }}>
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.65, ease: EASE }}
                  style={{ background: "var(--surface)", borderRadius: "10px", padding: "24px" }}
                >
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "14px" }}>Core Insight</p>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(16px, 1.8vw, 20px)", fontWeight: 400, lineHeight: 1.45, letterSpacing: "-0.02em", color: "var(--text)" }}>
                    {cs.insight}
                  </p>
                </motion.div>
                <ImageBlock image={cs.insightImage} placeholder="OLAP vs ESM model comparison diagram" />
              </section>
            )}

            <CsSection label="Key Design Decisions">
              <div style={{ display: "flex", flexDirection: "column" }}>
                {cs.decisions.map((d, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: EASE, delay: i * 0.06 }}
                    style={{ padding: "24px 0", borderBottom: "1px solid var(--border)", display: "grid", gridTemplateColumns: "48px 1fr", gap: "20px" }}
                  >
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.06em", color: "var(--muted)", paddingTop: "2px" }}>
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    <div>
                      <h3 style={{ fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 400, letterSpacing: "-0.01em", color: "var(--text)", marginBottom: "8px", lineHeight: 1.3 }}>
                        {d.title}
                      </h3>
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", lineHeight: 1.7, color: "var(--muted2)" }}>
                        {d.body}
                      </p>
                      <ImageBlock image={d.image} placeholder="Wireframe, prototype or design artifact" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </CsSection>

            <CsSection label="Outcomes">
              <div>
                {cs.outcomes.map((o, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55, ease: EASE, delay: i * 0.05 }}
                    style={{ display: "flex", alignItems: "flex-start", gap: "16px", padding: "16px 0", borderBottom: "1px solid var(--border)" }}
                  >
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--muted)", letterSpacing: "0.06em", marginTop: "2px", flexShrink: 0, minWidth: "24px" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 400, lineHeight: 1.65, color: "var(--muted2)", letterSpacing: "-0.01em" }}>
                      {o}
                    </p>
                  </motion.div>
                ))}
              </div>
              <ImageBlock image={cs.outcomesImage} placeholder="Final design — bulk update or published state" />
            </CsSection>

            {cs.lesson && (
              <section style={{ padding: "48px 0", borderBottom: "1px solid var(--border)" }}>
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.65, ease: EASE }}
                >
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "16px" }}>What I learned</p>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(16px, 1.8vw, 20px)", fontWeight: 400, lineHeight: 1.45, letterSpacing: "-0.02em", color: "var(--text)", maxWidth: "600px" }}>
                    {cs.lesson}
                  </p>
                </motion.div>
              </section>
            )}

            {/* Navigation */}
            <nav style={{ padding: "48px 0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
              <Link href="/#work" className="btn-secondary">← All work</Link>
              {next && <Link href={`/work/${next.slug}`} className="btn-primary">Next: {next.title} →</Link>}
            </nav>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}

function ImageBlock({ image, placeholder }: { image?: CaseStudyImage; placeholder?: string }) {
  const [errored, setErrored] = useState(false);
  const isEmpty = !image || errored;

  return (
    <motion.figure
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.65, ease: EASE }}
      style={{ margin: "24px 0 0", padding: 0 }}
    >
      <div style={{
        borderRadius: "12px",
        minHeight: "240px",
        display: "flex",
        flexDirection: "column",
        alignItems: isEmpty ? "center" : undefined,
        justifyContent: isEmpty ? "center" : undefined,
        overflow: "hidden",
        border: isEmpty ? "1.5px dashed var(--border)" : "1px solid var(--border)",
        background: "var(--surface)",
      }}>
        {isEmpty ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", padding: "48px 24px", textAlign: "center" }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ opacity: 0.25 }}>
              <rect x="1" y="1" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="6.5" cy="6.5" r="1.5" fill="currentColor" />
              <path d="M1 13l5-4 4 3.5 3-2.5 6 5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", opacity: 0.5 }}>
              {placeholder ?? "Add image or artifact"}
            </span>
          </div>
        ) : (
          <img
            src={image!.src}
            alt={image!.alt}
            onError={() => setErrored(true)}
            style={{ width: "100%", display: "block", objectFit: "cover" }}
          />
        )}
      </div>
      {!isEmpty && image?.caption && (
        <figcaption style={{
          fontFamily: "var(--font-mono)",
          fontSize: "9px",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "var(--muted)",
          marginTop: "10px",
          textAlign: "center",
        }}>
          {image.caption}
        </figcaption>
      )}
    </motion.figure>
  );
}

function CsSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.65, ease: EASE }}
      style={{ padding: "48px 0", borderBottom: "1px solid var(--border)" }}
    >
      <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "24px" }}>{label}</p>
      {children}
    </motion.section>
  );
}

function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ position: "relative", display: "inline" }}>
      <motion.span
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        style={{
          position: "absolute",
          inset: "0 -3px",
          background: "rgba(255, 213, 0, 0.32)",
          borderRadius: "3px",
          transformOrigin: "left center",
          zIndex: 0,
        }}
      />
      <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
    </span>
  );
}

function parseHighlights(text: string): React.ReactNode[] {
  const parts = text.split(/(==.+?==)/g);
  return parts.map((part, i) =>
    part.startsWith("==") && part.endsWith("==")
      ? <Highlight key={i}>{part.slice(2, -2)}</Highlight>
      : part
  );
}

function BodyText({ children }: { children: React.ReactNode }) {
  const content = typeof children === "string" ? parseHighlights(children) : children;
  return (
    <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 400, lineHeight: 1.75, color: "var(--muted2)", maxWidth: "580px" }}>
      {content}
    </p>
  );
}
