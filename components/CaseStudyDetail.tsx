"use client";

import Link from "next/link";
import Footer from "@/components/Footer";
import Cursor from "@/components/Cursor";
import Nav from "@/components/Nav";
import { motion, AnimatePresence, useMotionTemplate } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import type { CaseStudy, CaseStudyImage, TaskFlowStage } from "@/lib/caseStudies";
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
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [lensLightboxSrc, setLensLightboxSrc] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setLightboxSrc(null); setLensLightboxSrc(null); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

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
                  style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", display: "inline-flex", alignItems: "center", gap: "6px", marginBottom: "32px", transition: "color 0.15s" }}
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

              <motion.p variants={fadeUp} style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "8px" }}>
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
                style={{ fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 400, lineHeight: 1.65, color: "var(--muted)", maxWidth: "520px", marginBottom: "32px" }}
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
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "4px" }}>{item!.label}</p>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 400, color: "var(--text)", lineHeight: 1.4 }}>{item!.value}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Metrics bar */}
        <div style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)", padding: "24px 0" }}>
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

        {cs.prototypeVideo && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: EASE }}
            style={{ padding: "48px 0", borderBottom: "1px solid var(--border)" }}
          >
            <div className="page-pad">
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "24px" }}>Prototype</p>
              <VideoBlock src={cs.prototypeVideo} />
            </div>
          </motion.section>
        )}

        {/* Body */}
        <article style={{ padding: "0" }}>
          <div className="page-pad">

            <CsSection label="Overview">
              {cs.context && <BodyText>{cs.context}</BodyText>}
              <div style={{ marginTop: cs.context ? "16px" : 0 }}>
                <BodyText>{cs.summary}</BodyText>
              </div>

              {cs.slug === "planful-esm" && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.65, ease: EASE }}
                  style={{ marginTop: "32px" }}
                >
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "16px" }}>
                    How the system works
                  </p>
                  <div style={{ display: "flex", alignItems: "stretch", gap: "0" }}>
                    {/* ESM Box */}
                    <div style={{ flex: 1, padding: "20px 24px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "8px 0 0 8px" }}>
                      <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "10px" }}>
                        This project
                      </p>
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 400, letterSpacing: "-0.01em", color: "var(--text)", lineHeight: 1.4, marginBottom: "8px" }}>
                        External Source Model
                      </p>
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", letterSpacing: "-0.01em", color: "var(--muted)", lineHeight: 1.6 }}>
                        A controlled workspace where teams load, transform, and validate data before it goes anywhere near the live plan.
                      </p>
                    </div>
                    {/* Arrow divider */}
                    <div style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", width: "48px", background: "var(--surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", color: "var(--muted)" }}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    {/* Core Model Box */}
                    <div style={{ flex: 1, padding: "20px 24px", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "0 8px 8px 0", borderLeft: "none" }}>
                      <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "10px" }}>
                        Always live
                      </p>
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 400, letterSpacing: "-0.01em", color: "var(--text)", lineHeight: 1.4, marginBottom: "8px" }}>
                        Core Financial Model
                      </p>
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", letterSpacing: "-0.01em", color: "var(--muted)", lineHeight: 1.6 }}>
                        The financial data driving budgets, forecasts, and headcount plans. Never edited directly.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </CsSection>

            <CsSection label="The Problem">
              <BodyText>{cs.problem}</BodyText>

              {cs.problemBreakdown && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.65, ease: EASE }}
                  style={{ marginTop: "24px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "12px", padding: "24px" }}
                >
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "16px" }}>
                    Legacy Spotlight
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    {cs.problemBreakdown.points.map((point, i) => (
                      <div key={i} style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "8px", padding: "14px 16px" }}>
                        <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--border)", marginBottom: "8px" }}>
                          {String(i + 1).padStart(2, "0")}
                        </p>
                        <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", lineHeight: 1.55, letterSpacing: "-0.01em", color: "var(--muted2)" }}>{point}</p>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: "1px solid var(--border)" }}>
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "8px" }}>Impact</p>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", lineHeight: 1.65, letterSpacing: "-0.01em", color: "var(--muted2)" }}>{cs.problemBreakdown.impact}</p>
                  </div>
                </motion.div>
              )}

              <ImageBlock image={cs.problemImage} placeholder="Legacy tool — Excel Spotlight screenshot" onOpen={setLightboxSrc} />
            </CsSection>

            {cs.insight && (
              <section style={{ padding: "48px 0" }}>
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.65, ease: EASE }}
                  style={{ background: "var(--surface)", borderRadius: "12px", padding: "24px" }}
                >
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "12px" }}>Core Insight</p>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(16px, 1.8vw, 20px)", fontWeight: 400, lineHeight: 1.6, letterSpacing: "-0.02em", color: "var(--text)" }}>
                    {cs.insight}
                  </p>
                </motion.div>
                {cs.insightDiagram === "olap-vs-esm" && (
                  <div style={{ marginTop: "24px", marginBottom: "8px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", letterSpacing: "-0.01em", color: "var(--muted2)", lineHeight: 1.65 }}>
                      The old model was multidimensional — OLAP cubes where every account, time period, and entity intersects at a single cell. Navigating and editing them requires specialist knowledge. Direct edits bypass validation, complicate audit trails, and introduce errors that are hard to trace.
                    </p>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", letterSpacing: "-0.01em", color: "var(--muted)", lineHeight: 1.65 }}>
                      Separating the data entry layer from the analytical model is the accepted industry approach across enterprise FP&A platforms — Workday Adaptive, OneStream, Anaplan all follow it. ESM Tables implement that separation: a flat, familiar 2D spreadsheet that sits in front of the OLAP model, so any team member can load and manage data without ever touching the cube directly.
                    </p>
                  </div>
                )}
                {cs.insightDiagram === "olap-vs-esm"
                  ? <OlapVsEsmDiagram />
                  : <ImageBlock image={cs.insightImage} placeholder="OLAP vs ESM model comparison diagram" onOpen={setLightboxSrc} />
                }
                {cs.researchEvidence && (
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", lineHeight: 1.7, marginTop: "20px" }}>
                    {cs.researchEvidence}
                  </p>
                )}
              </section>
            )}

            {cs.taskFlow && (
              <section style={{ padding: "48px 0" }}>
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.65, ease: EASE }}
                >
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "24px", borderTop: "1px solid var(--border)", paddingTop: "16px" }}>
                    The New Workflow
                  </p>
                  <TaskFlowDiagram stages={cs.taskFlow.stages} />
                </motion.div>
              </section>
            )}

            <CsSection label="Key Design Decisions">
              <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
                {cs.decisions.map((d, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: EASE, delay: i * 0.06 }}
                    style={{ display: "grid", gridTemplateColumns: "48px 1fr", gap: "24px" }}
                  >
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.06em", color: "var(--muted)", paddingTop: "2px", lineHeight: 1.5 }}>
                      {String(i + 1).padStart(2, "0")}<span style={{ color: "var(--border)" }}> / {String(cs.decisions.length).padStart(2, "0")}</span>
                    </p>
                    <div>
                      <h3 style={{ fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 400, letterSpacing: "-0.01em", color: "var(--text)", marginBottom: "8px", lineHeight: 1.3 }}>
                        {d.title}
                      </h3>
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", lineHeight: 1.65, color: "var(--muted2)" }}>
                        {d.body}
                      </p>
                      {d.images && d.images.length > 0 ? (
                        <motion.div
                          initial={{ opacity: 0, y: 12 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.65, ease: EASE }}
                          style={{ marginTop: "24px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "12px", padding: "32px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}
                        >
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", width: "100%" }}>
                            {d.images.map((img, idx) => (
                              <div key={idx} onClick={() => setLightboxSrc(img.src)} style={{ borderRadius: "8px", overflow: "hidden", border: "1px solid var(--border)", background: "var(--bg)", cursor: "zoom-in" }}>
                                <img src={img.src} alt={img.alt} style={{ width: "100%", display: "block", objectFit: "contain" }} />
                                {img.caption && (
                                  <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", padding: "10px 0", textAlign: "center" }}>
                                    {img.caption}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      ) : d.image?.width ? (
                        <motion.div
                          initial={{ opacity: 0, y: 12 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.65, ease: EASE }}
                          style={{ marginTop: "24px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "12px", padding: "32px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}
                        >
                          <img
                            src={d.image.src}
                            alt={d.image.alt}
                            onClick={() => setLightboxSrc(d.image!.src)}
                            style={{ width: d.image.width, display: "block", objectFit: "contain", cursor: "zoom-in" }}
                          />
                          {d.image.caption && (
                            <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)" }}>
                              {d.image.caption}
                            </p>
                          )}
                        </motion.div>
                      ) : d.image?.zoomLens ? (
                        <ZoomLensImage image={d.image} onOpen={setLensLightboxSrc} />
                      ) : d.image ? (
                        <ImageBlock image={d.image} placeholder="Wireframe, prototype or design artifact" onOpen={setLightboxSrc} />
                      ) : null}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CsSection>

            <CsSection label="Outcomes">
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {/* Before → After display */}
                {cs.outcomes[0] && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: EASE }}
                    style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "12px", padding: "28px 32px" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
                      {/* Before */}
                      <div>
                        <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "8px" }}>Before</p>
                        <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 300, letterSpacing: "-0.04em", color: "var(--muted)", lineHeight: 1 }}>3.5 hrs</p>
                      </div>
                      {/* Arrow */}
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0, color: "var(--border)", marginTop: "20px" }}>
                        <path d="M3 10h14M13 5l5 5-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {/* After */}
                      <div>
                        <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "8px" }}>After</p>
                        <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 300, letterSpacing: "-0.04em", color: "var(--text)", lineHeight: 1 }}>10–15 min</p>
                      </div>
                    </div>
                    {/* Label */}
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", marginTop: "20px" }}>
                      Reduction in time on task
                    </p>
                  </motion.div>
                )}
                {/* Qualitative outcome */}
                {cs.outcomes[1] && (
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55, ease: EASE, delay: 0.08 }}
                    style={{ fontFamily: "var(--font-body)", fontSize: "14px", lineHeight: 1.65, letterSpacing: "-0.01em", color: "var(--muted2)", maxWidth: "580px" }}
                  >
                    {cs.outcomes[1]}
                  </motion.p>
                )}
              </div>
            </CsSection>

            <div style={{ borderTop: "1px solid var(--border)" }} />

            {cs.contribution && (
              <CsSection label="What I owned">
                <BodyText>{cs.contribution}</BodyText>
                {cs.contributionArtifacts && cs.contributionArtifacts.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55, ease: EASE }}
                    style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "20px" }}
                  >
                    {cs.contributionArtifacts.map((artifact, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, scale: 0.92 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, ease: EASE, delay: i * 0.04 }}
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "9px",
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          color: "var(--muted2)",
                          background: "var(--surface)",
                          border: "1px solid var(--border)",
                          borderRadius: "4px",
                          padding: "5px 10px",
                        }}
                      >
                        {artifact}
                      </motion.span>
                    ))}
                  </motion.div>
                )}
              </CsSection>
            )}

            {cs.scrappedDirections && cs.scrappedDirections.length > 0 && (
              <CsSection label="What We Tried & Killed">
                <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                  {cs.scrappedDirections.map((dir, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.55, ease: EASE, delay: i * 0.06 }}
                      style={{ display: "grid", gridTemplateColumns: "48px 1fr", gap: "24px" }}
                    >
                      <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.06em", color: "var(--muted)", paddingTop: "2px" }}>
                        {String(i + 1).padStart(2, "0")}
                      </p>
                      <div>
                        <h3 style={{ fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 400, letterSpacing: "-0.01em", color: "var(--text)", marginBottom: "8px", lineHeight: 1.3, textDecoration: "line-through", textDecorationColor: "var(--border)" }}>
                          {dir.title}
                        </h3>
                        <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", lineHeight: 1.65, color: "var(--muted2)" }}>
                          {dir.reason}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CsSection>
            )}

            {cs.lesson && (() => {
              const dotIdx = cs.lesson.indexOf(". ");
              const headline = dotIdx > -1 ? cs.lesson.slice(0, dotIdx + 1) : cs.lesson;
              const body = dotIdx > -1 ? cs.lesson.slice(dotIdx + 2) : "";
              return (
                <CsSection label="What I learned">
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(20px, 2.8vw, 28px)", fontWeight: 300, lineHeight: 1.3, letterSpacing: "-0.03em", color: "var(--text)", maxWidth: "640px" }}>
                    {headline}
                  </p>
                  {body && (
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 400, lineHeight: 1.65, letterSpacing: "-0.01em", color: "var(--muted2)", maxWidth: "560px", marginTop: "16px" }}>
                      {body}
                    </p>
                  )}
                </CsSection>
              );
            })()}

            {cs.reflection && (
              <CsSection label="What I'd Do Differently">
                <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(16px, 1.8vw, 20px)", fontWeight: 400, lineHeight: 1.6, letterSpacing: "-0.02em", color: "var(--text)", maxWidth: "580px" }}>
                  {cs.reflection}
                </p>
              </CsSection>
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
      <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
      <LensLightbox src={lensLightboxSrc} onClose={() => setLensLightboxSrc(null)} />
    </>
  );
}

function ImageBlock({ image, placeholder, onOpen }: { image?: CaseStudyImage; placeholder?: string; onOpen?: (src: string) => void }) {
  const [errored, setErrored] = useState(false);
  const isEmpty = !image || errored;

  return (
    <motion.figure
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.65, ease: EASE }}
      style={{ margin: "24px 0 0", padding: 0, width: image?.width ?? "100%" }}
    >
      <div
        onClick={!isEmpty && onOpen ? () => onOpen(image!.src) : undefined}
        style={{
          borderRadius: "12px",
          minHeight: isEmpty ? "240px" : undefined,
          display: "flex",
          flexDirection: "column",
          alignItems: isEmpty ? "center" : undefined,
          justifyContent: isEmpty ? "center" : undefined,
          overflow: "hidden",
          border: isEmpty ? "1.5px dashed var(--border)" : "1px solid var(--border)",
          background: "var(--surface)",
          cursor: !isEmpty && onOpen ? "zoom-in" : undefined,
        }}
      >
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
          <div style={image?.displayHeight ? { height: image.displayHeight, overflow: "hidden" } : undefined}>
            <img
              src={image!.src}
              alt={image!.alt}
              onError={() => setErrored(true)}
              style={{
                width: "100%",
                display: "block",
                objectFit: image?.displayHeight ? "cover" : "contain",
                objectPosition: image?.objectPosition ?? "center center",
                height: image?.displayHeight ? "100%" : undefined,
              }}
            />
          </div>
        )}
      </div>
      {!isEmpty && image?.caption && (
        <figcaption style={{
          fontFamily: "var(--font-mono)",
          fontSize: "9px",
          letterSpacing: "0.08em",
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
      style={{ padding: "48px 0" }}
    >
      <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "24px", borderTop: "1px solid var(--border)", paddingTop: "16px" }}>{label}</p>
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

function OlapVsEsmDiagram() {
  // ── Cube geometry ──
  const cw = 100, ch = 64, dx = 30, dy = 22;
  const svgW = cw + dx; // 130
  const svgH = dy + ch; // 86

  // ── Grid geometry ──
  const gW = 130, gH = 86;
  const gCols = 5, gRows = 5;
  const colW = gW / gCols;
  const headerH = 20;
  const bodyRowH = (gH - headerH) / (gRows - 1);

  const Chip = ({ children }: { children: React.ReactNode }) => (
    <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--muted)", padding: "3px 8px", background: "var(--surface2)", borderRadius: "4px", whiteSpace: "nowrap" as const }}>
      {children}
    </span>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.65, ease: EASE }}
      style={{ marginTop: "24px", display: "grid", gridTemplateColumns: "1fr 1px 1fr", border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden" }}
    >
      {/* ── OLAP ── */}
      <div style={{ padding: "24px 20px", background: "var(--surface)", display: "flex", flexDirection: "column", gap: "20px" }}>
        <div>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "4px" }}>OLAP</p>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 400, letterSpacing: "-0.01em", color: "var(--text)", lineHeight: 1.3 }}>Multidimensional cube</p>
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`} style={{ overflow: "visible" }}>
            {/* Top face */}
            <polygon points={`0,${dy} ${cw},${dy} ${cw + dx},0 ${dx},0`} fill="#ffffff" stroke="#e5e5e5" strokeWidth="1" />
            {/* Right face */}
            <polygon points={`${cw},${dy} ${cw + dx},0 ${cw + dx},${ch} ${cw},${svgH}`} fill="#ebebeb" stroke="#e5e5e5" strokeWidth="1" />
            {/* Front face */}
            <polygon points={`0,${dy} ${cw},${dy} ${cw},${svgH} 0,${svgH}`} fill="#f5f5f5" stroke="#e5e5e5" strokeWidth="1" />
            {/* Face labels */}
            <text x={cw / 2} y={dy + ch / 2 + 4} textAnchor="middle" fontFamily="'DM Mono', monospace" fontSize="9" fill="#737373" letterSpacing="0.5">ACCOUNTS</text>
            <text x={cw + dx / 2 + 6} y={dy / 2 + ch / 2 + 4} textAnchor="middle" fontFamily="'DM Mono', monospace" fontSize="9" fill="#737373" letterSpacing="0.5" transform={`rotate(90,${cw + dx / 2 + 6},${dy / 2 + ch / 2})`}>TIME</text>
            <text x={cw / 2 + dx / 2} y={dy / 2 + 4} textAnchor="middle" fontFamily="'DM Mono', monospace" fontSize="9" fill="#737373" letterSpacing="0.5">ENTITIES</text>
          </svg>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {["Accounts", "Time", "Entities", "Scenarios"].map(d => <Chip key={d}>{d}</Chip>)}
        </div>

        <p style={{ fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--muted)", lineHeight: 1.8 }}>
          All dimensions intersect at every cell · Requires expert navigation
        </p>
      </div>

      {/* ── Divider ── */}
      <div style={{ background: "var(--border)" }} />

      {/* ── ESM ── */}
      <div style={{ padding: "24px 20px", background: "var(--bg)", display: "flex", flexDirection: "column", gap: "20px" }}>
        <div>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "4px" }}>ESM</p>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 400, letterSpacing: "-0.01em", color: "var(--text)", lineHeight: 1.3 }}>2D spreadsheet model</p>
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <svg width={gW} height={gH} viewBox={`0 0 ${gW} ${gH}`}>
            <rect x="0" y="0" width={gW} height={gH} fill="#f5f5f5" rx="4" stroke="#e5e5e5" strokeWidth="1" />
            <rect x="0" y="0" width={gW} height={headerH} fill="#ebebeb" rx="4" />
            <rect x="0" y={headerH - 3} width={gW} height="3" fill="#ebebeb" />
            {Array.from({ length: gCols - 1 }).map((_, i) => (
              <line key={i} x1={(i + 1) * colW} y1="0" x2={(i + 1) * colW} y2={gH} stroke="#e5e5e5" strokeWidth="1" />
            ))}
            {Array.from({ length: gRows - 1 }).map((_, i) => (
              <line key={i} x1="0" y1={headerH + i * bodyRowH} x2={gW} y2={headerH + i * bodyRowH} stroke="#e5e5e5" strokeWidth="1" />
            ))}
            {["", "Q1", "Q2", "Q3", "Q4"].map((t, i) => (
              <text key={i} x={i * colW + colW / 2} y={headerH / 2 + 4} textAnchor="middle" fontFamily="'DM Mono', monospace" fontSize="7" fill="#737373" letterSpacing="0.3">{t}</text>
            ))}
            {["Revenue", "COGS", "Gross P", "EBITDA"].map((t, i) => (
              <text key={i} x={colW / 2} y={headerH + i * bodyRowH + bodyRowH / 2 + 3} textAnchor="middle" fontFamily="'DM Mono', monospace" fontSize="6.5" fill="#737373" letterSpacing="0.2">{t}</text>
            ))}
            {[["1.2M","1.4M","1.1M","1.6M"],["420K","510K","390K","580K"],["780K","890K","710K","1.0M"],["340K","410K","290K","490K"]].map((row, ri) =>
              row.map((val, ci) => (
                <text key={`${ri}-${ci}`} x={(ci + 1) * colW + colW / 2} y={headerH + ri * bodyRowH + bodyRowH / 2 + 3} textAnchor="middle" fontFamily="'DM Mono', monospace" fontSize="6.5" fill="#404040" letterSpacing="0.2">{val}</text>
              ))
            )}
          </svg>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          <Chip>Rows — members</Chip>
          <Chip>Columns — time</Chip>
        </div>

        <p style={{ fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--muted)", lineHeight: 1.8 }}>
          One flat layer · Any team member can read and edit directly
        </p>
      </div>
    </motion.div>
  );
}

function VideoBlock({ src }: { src: string }) {
  return (
    <div style={{ borderRadius: "12px", overflow: "hidden", border: "1px solid var(--border)", background: "var(--chrome)" }}>
      {/* macOS chrome bar */}
      <div style={{ position: "relative", height: "38px", background: "var(--chrome)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {/* Traffic lights — positioned absolute so URL bar truly centres */}
        <div style={{ position: "absolute", left: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
          {["#ff5f57", "#febc2e", "#28c840"].map((c, i) => (
            <div key={i} style={{ width: "10px", height: "10px", borderRadius: "50%", background: c }} />
          ))}
        </div>
        {/* URL pill — centred */}
        <div style={{ background: "var(--surface)", borderRadius: "5px", padding: "4px 14px", display: "flex", alignItems: "center", gap: "6px", maxWidth: "240px", width: "100%" }}>
          <svg width="8" height="10" viewBox="0 0 8 10" fill="none" style={{ flexShrink: 0, opacity: 0.4 }}>
            <rect x="1" y="4" width="6" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.2" />
            <path d="M2.5 4V2.8a1.5 1.5 0 013 0V4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.04em", color: "var(--muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            app.planful.com/esm
          </span>
        </div>
      </div>
      {/* Video */}
      <video
        src={src}
        autoPlay
        loop
        muted
        playsInline
        style={{ width: "100%", display: "block", maxHeight: "520px", objectFit: "contain", background: "var(--surface)" }}
      />
    </div>
  );
}

function TaskFlowDiagram({ stages }: { stages: TaskFlowStage[] }) {
  return (
    <div style={{ position: "relative" }}>
      {/* Connecting line behind the step dots */}
      <div style={{
        position: "absolute",
        top: "11px",
        left: "12.5%",
        right: "12.5%",
        height: "1px",
        background: "var(--border)",
        zIndex: 0,
      }} />

      <div style={{ display: "flex", gap: "0" }}>
        {stages.map((stage, i) => (
          <motion.div
            key={stage.number}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: EASE, delay: i * 0.1 }}
            style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative", zIndex: 1 }}
          >
            {/* Step dot */}
            <div style={{
              width: "22px",
              height: "22px",
              borderRadius: "50%",
              border: "1px solid var(--border)",
              background: "var(--bg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              marginBottom: "16px",
            }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "0.06em", color: "var(--muted)" }}>
                {stage.number}
              </span>
            </div>

            {/* Stage label */}
            <h3 style={{
              fontFamily: "var(--font-body)",
              fontSize: "13px",
              fontWeight: 400,
              letterSpacing: "-0.02em",
              color: "var(--text)",
              textAlign: "center",
              lineHeight: 1.3,
              marginBottom: "16px",
              paddingLeft: "8px",
              paddingRight: "8px",
            }}>
              {stage.label}
            </h3>

            {/* Meta */}
            {stage.meta && stage.meta.length > 0 && (
              <div style={{
                borderTop: "1px solid var(--border)",
                paddingTop: "12px",
                width: "100%",
                paddingLeft: "8px",
                paddingRight: "8px",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              }}>
                {stage.meta.map(m => (
                  <div key={m.label} style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)" }}>
                      {m.label}
                    </span>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--muted2)", letterSpacing: "-0.01em", lineHeight: 1.4 }}>
                      {m.value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
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
  if (typeof children === "string" && children.includes("\n\n")) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {children.split("\n\n").map((para, i) => (
          <p key={i} style={{ fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 400, lineHeight: 1.65, color: "var(--muted2)", maxWidth: "580px" }}>
            {parseHighlights(para)}
          </p>
        ))}
      </div>
    );
  }
  const content = typeof children === "string" ? parseHighlights(children) : children;
  return (
    <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 400, lineHeight: 1.65, color: "var(--muted2)", maxWidth: "580px" }}>
      {content}
    </p>
  );
}

function ZoomLensImage({ image, onOpen }: { image: CaseStudyImage; onOpen?: (src: string) => void }) {
  const ZOOM = 2.5;
  const LENS = 200;
  const [isHovering, setIsHovering] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  const maskImage = useMotionTemplate`radial-gradient(circle ${LENS / 2}px at ${pos.x}px ${pos.y}px, black 100%, transparent 100%)`;

  const zoomedLayer = (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.12 }}
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        maskImage,
        WebkitMaskImage: maskImage,
        transformOrigin: `${pos.x}px ${pos.y}px`,
        zIndex: 10,
      }}
    >
      <div style={{
        position: "absolute",
        inset: 0,
        transform: `scale(${ZOOM})`,
        transformOrigin: `${pos.x}px ${pos.y}px`,
      }}>
        <img src={image.src} alt="" style={{ width: "100%", display: "block", objectFit: "contain" }} />
      </div>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.65, ease: EASE }}
      style={{ marginTop: "24px" }}
    >
      <div
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onMouseMove={handleMouseMove}
        style={{ position: "relative", borderRadius: "12px", overflow: "hidden", border: "1px solid var(--border)", background: "var(--surface)", cursor: "crosshair" }}
      >
        <img src={image.src} alt={image.alt} style={{ width: "100%", display: "block", objectFit: "contain" }} />
        <AnimatePresence>
          {isHovering && zoomedLayer}
        </AnimatePresence>
        {onOpen && (
          <button
            onClick={() => onOpen(image.src)}
            title="Expand"
            style={{
              position: "absolute",
              bottom: "12px",
              right: "12px",
              background: "rgba(255,255,255,0.88)",
              border: "1px solid var(--border)",
              borderRadius: "6px",
              width: "28px",
              height: "28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              backdropFilter: "blur(4px)",
              zIndex: 20,
            }}
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="var(--muted)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="8,1 12,1 12,5" />
              <polyline points="5,12 1,12 1,8" />
              <line x1="12" y1="1" x2="7.5" y2="5.5" />
              <line x1="1" y1="12" x2="5.5" y2="7.5" />
            </svg>
          </button>
        )}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px" }}>
        {image.caption && (
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)" }}>
            {image.caption}
          </p>
        )}
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", opacity: 0.5, marginLeft: "auto" }}>
          Hover to inspect
        </p>
      </div>
    </motion.div>
  );
}

function LensLightbox({ src, onClose }: { src: string | null; onClose: () => void }) {
  const ZOOM = 2.5;
  const LENS = 220;
  const [isHovering, setIsHovering] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  const maskImage = useMotionTemplate`radial-gradient(circle ${LENS / 2}px at ${pos.x}px ${pos.y}px, black 100%, transparent 100%)`;

  if (!src) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(10,10,10,0.92)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px",
        backdropFilter: "blur(12px)",
        cursor: "pointer",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onMouseMove={handleMouseMove}
        style={{
          position: "relative",
          maxWidth: "88vw",
          maxHeight: "88vh",
          borderRadius: "12px",
          overflow: "hidden",
          cursor: "crosshair",
          boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
        }}
      >
        {/* Base image */}
        <img
          src={src}
          alt=""
          style={{ display: "block", maxWidth: "88vw", maxHeight: "88vh", objectFit: "contain" }}
        />

        {/* Zoomed lens layer — same MagicUI technique */}
        <AnimatePresence>
          {isHovering && (
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.12 }}
              style={{
                position: "absolute",
                inset: 0,
                overflow: "hidden",
                maskImage,
                WebkitMaskImage: maskImage,
                transformOrigin: `${pos.x}px ${pos.y}px`,
                zIndex: 10,
              }}
            >
              <div style={{
                position: "absolute",
                inset: 0,
                transform: `scale(${ZOOM})`,
                transformOrigin: `${pos.x}px ${pos.y}px`,
              }}>
                <img src={src} alt="" style={{ display: "block", maxWidth: "88vw", maxHeight: "88vh", objectFit: "contain" }} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hint */}
        {!isHovering && (
          <div style={{
            position: "absolute",
            bottom: "16px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(10,10,10,0.6)",
            backdropFilter: "blur(6px)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "6px",
            padding: "5px 12px",
            fontFamily: "var(--font-mono)",
            fontSize: "9px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.5)",
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}>
            Hover to zoom · click outside to close
          </div>
        )}
      </motion.div>

      {/* Close button */}
      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        style={{
          position: "fixed",
          top: "20px",
          right: "24px",
          background: "rgba(255,255,255,0.1)",
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: "8px",
          width: "36px",
          height: "36px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: "rgba(255,255,255,0.7)",
          fontSize: "18px",
          lineHeight: 1,
        }}
      >
        ×
      </button>
    </motion.div>
  );
}

function Lightbox({ src, onClose }: { src: string | null; onClose: () => void }) {
  if (!src) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(10,10,10,0.88)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        backdropFilter: "blur(8px)",
        cursor: "pointer",
      }}
    >
      <motion.img
        src={src}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "90vw",
          maxHeight: "90vh",
          objectFit: "contain",
          borderRadius: "12px",
          boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
          cursor: "default",
        }}
        alt=""
      />
      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        style={{
          position: "fixed",
          top: "20px",
          right: "24px",
          background: "rgba(255,255,255,0.1)",
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: "8px",
          width: "36px",
          height: "36px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: "rgba(255,255,255,0.7)",
          fontSize: "18px",
          lineHeight: 1,
        }}
      >
        ×
      </button>
    </motion.div>
  );
}
