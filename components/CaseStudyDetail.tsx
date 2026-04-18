"use client";

import Link from "next/link";
import Footer from "@/components/Footer";
import Cursor from "@/components/Cursor";
import ThemeToggle from "@/components/ThemeToggle";
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
  const [activeSection, setActiveSection] = useState<string>("");
  const [navVisible, setNavVisible] = useState(false);

  const NAV_SECTIONS = [
    { id: "cs-overview",  label: "Overview"  },
    { id: "cs-problem",   label: "Problem"   },
    { id: "cs-insight",   label: "Insight"   },
    { id: "cs-workflow",  label: "Workflow"  },
    { id: "decisions",    label: "Decisions" },
    { id: "outcomes",     label: "Outcomes"  },
    { id: "ownership",    label: "Ownership" },
  ].filter(s => typeof document === "undefined" ? true : !!document.getElementById(s.id));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setLightboxSrc(null); setLensLightboxSrc(null); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    NAV_SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    const onScroll = () => setNavVisible(window.scrollY > 200);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      observers.forEach(o => o.disconnect());
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      <Cursor />

      {/* Minimal nav — matches HomeNav */}
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

            <CsSection label="Overview" id="cs-overview">
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
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--muted)", marginBottom: "10px", display: "block" }}>
                        <rect x="2" y="3" width="12" height="10" rx="1"/><path d="M2 7h12M7 7v6"/>
                      </svg>
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
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--muted)", marginBottom: "10px", display: "block" }}>
                        <ellipse cx="8" cy="5" rx="5" ry="2"/><path d="M3 5v6a5 2 0 0 0 10 0V5"/><path d="M3 8a5 2 0 0 0 10 0"/>
                      </svg>
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

            <CsSection label="The Problem" id="cs-problem">
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
                  {(() => {
                    const problemIcons = [
                      <svg key={0} width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="2" width="14" height="10" rx="1"/><path d="M5 15h6M8 12v3"/></svg>,
                      <svg key={1} width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 8A6 6 0 1 1 8 2"/><path d="M14 2v4h-4"/><path d="M8 6v2.5l2 1.5"/></svg>,
                      <svg key={2} width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="5" r="3"/><path d="M1 14c0-2.5 2-4 5-4"/><path d="M12 9l3 3m0-3l-3 3"/></svg>,
                      <svg key={3} width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="8 1 15 5 8 9 1 5"/><polyline points="1 9 8 13 15 9"/><line x1="8" y1="9" x2="8" y2="13"/></svg>,
                      <svg key={4} width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 1h6l4 4v10H4z"/><polyline points="10 1 10 5 14 5"/><line x1="6" y1="9" x2="10" y2="13"/><line x1="10" y1="9" x2="6" y2="13"/></svg>,
                      <svg key={5} width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 1L1 14h14L8 1z"/><line x1="8" y1="6" x2="8" y2="9"/><circle cx="8" cy="12" r="0.5" fill="currentColor"/></svg>,
                    ];
                    return (
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                        {cs.problemBreakdown!.points.map((point, i) => (
                          <div key={i} style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "8px", padding: "14px 16px" }}>
                            <div style={{ color: "var(--muted)", marginBottom: "8px" }}>{problemIcons[i]}</div>
                            <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", lineHeight: 1.55, letterSpacing: "-0.01em", color: "var(--muted2)" }}>{point}</p>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                  <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: "1px solid var(--border)" }}>
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "8px" }}>Impact</p>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", lineHeight: 1.65, letterSpacing: "-0.01em", color: "var(--muted2)" }}>{cs.problemBreakdown.impact}</p>
                  </div>
                </motion.div>
              )}

              <ImageBlock image={cs.problemImage} placeholder="Legacy tool — Excel Spotlight screenshot" onOpen={setLightboxSrc} />
            </CsSection>

            {/* My Approach — renders when present (research-led case studies) */}
            {cs.approach && (
              <CsSection label="My Approach">
                <BodyText>{cs.approach}</BodyText>
              </CsSection>
            )}

            {/* Research — renders as its own section when approach is present */}
            {cs.approach && cs.researchEvidence && (
              <CsSection label="Research">
                <BodyText>{cs.researchEvidence}</BodyText>
                {cs.researchFindings && cs.researchFindings.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.65, ease: EASE }}
                    style={{ marginTop: "24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}
                  >
                    {cs.researchFindings.map((f, i) => (
                      <div key={i} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "8px", padding: "16px 18px" }}>
                        <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "8px" }}>{f.title}</p>
                        <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", lineHeight: 1.6, letterSpacing: "-0.01em", color: "var(--muted2)" }}>{f.body}</p>
                      </div>
                    ))}
                  </motion.div>
                )}
              </CsSection>
            )}

            {cs.insight && (
              <section id="cs-insight" style={{ padding: "48px 0" }}>
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
                {!cs.approach && cs.researchEvidence && (
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", lineHeight: 1.7, marginTop: "20px" }}>
                    {cs.researchEvidence}
                  </p>
                )}
              </section>
            )}

            {cs.taskFlow && (
              <section id="cs-workflow" style={{ padding: "48px 0" }}>
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

            <CsSection label="Key Design Decisions" id="decisions">
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

            <CsSection label="Outcomes" id="outcomes">
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {/* Before → After display — Planful only */}
                {cs.slug === "planful-esm" && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: EASE }}
                    style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "12px", padding: "28px 32px" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
                      <div>
                        <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "8px" }}>Before</p>
                        <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 300, letterSpacing: "-0.04em", color: "var(--muted)", lineHeight: 1 }}>3.5 hrs</p>
                      </div>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0, color: "var(--border)", marginTop: "20px" }}>
                        <path d="M3 10h14M13 5l5 5-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <div>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#16a34a", background: "#16a34a18", borderRadius: "4px", padding: "3px 7px", display: "inline-block", marginBottom: "8px" }}>After</span>
                        <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 300, letterSpacing: "-0.04em", color: "var(--text)", lineHeight: 1 }}>10–15 min</p>
                      </div>
                    </div>
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", marginTop: "20px" }}>
                      Reduction in time on task
                    </p>
                  </motion.div>
                )}

                {/* All outcomes as a numbered list — all other case studies */}
                {cs.slug !== "planful-esm" && cs.outcomes.map((outcome, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55, ease: EASE, delay: i * 0.06 }}
                    style={{ display: "grid", gridTemplateColumns: "28px 1fr", gap: "12px", alignItems: "start" }}
                  >
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.06em", color: "var(--border)", paddingTop: "3px" }}>
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", lineHeight: 1.65, letterSpacing: "-0.01em", color: "var(--muted2)" }}>
                      {outcome}
                    </p>
                  </motion.div>
                ))}

                {/* Planful qualitative outcome (second item) */}
                {cs.slug === "planful-esm" && cs.outcomes[1] && (
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
              <CsSection label="What I owned" id="ownership">
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

      {/* Section nav */}
      <AnimatePresence>
        {navVisible && (
          <motion.nav
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            transition={{ duration: 0.25, ease: EASE }}
            style={{
              position: "fixed",
              right: "24px",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 30,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: "2px",
            }}
          >
            {NAV_SECTIONS.map(({ id, label }) => {
              const isActive = activeSection === id;
              return (
                <a
                  key={id}
                  href={`#${id}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    textDecoration: "none",
                    padding: "4px 0",
                    transition: "opacity 0.15s",
                    opacity: isActive ? 1 : 0.4,
                  }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
                  onMouseLeave={e => (e.currentTarget.style.opacity = isActive ? "1" : "0.4")}
                >
                  <span style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "8px",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: isActive ? "var(--text)" : "var(--muted)",
                    transition: "color 0.15s",
                  }}>
                    {label}
                  </span>
                  <span style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: isActive ? "var(--text)" : "var(--border)",
                    flexShrink: 0,
                    transition: "background 0.15s",
                  }} />
                </a>
              );
            })}
          </motion.nav>
        )}
      </AnimatePresence>
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

function CsSection({ label, children, id }: { label: string; children: React.ReactNode; id?: string }) {
  return (
    <motion.section
      id={id}
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

const TASK_ICONS: Record<string, React.ReactNode> = {
  Define: (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="5" height="5" rx="0.5"/><rect x="9" y="2" width="5" height="5" rx="0.5"/>
      <rect x="2" y="9" width="5" height="5" rx="0.5"/><rect x="9" y="9" width="5" height="5" rx="0.5"/>
    </svg>
  ),
  Prepare: (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 11V4M5 7l3-3 3 3"/><path d="M3 13h10"/>
    </svg>
  ),
  Validate: (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="8" r="6"/><path d="M5.5 8.5l2 2 3-3"/>
    </svg>
  ),
  Publish: (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2L7 9M14 2l-4.5 12L7 9 2.5 6.5 14 2z"/>
    </svg>
  ),
};

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
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              border: "1px solid var(--border)",
              background: "var(--bg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              marginBottom: "16px",
              color: "var(--muted)",
            }}>
              {TASK_ICONS[stage.label] ?? (
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "0.06em", color: "var(--muted)" }}>
                  {stage.number}
                </span>
              )}
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
        style={{ position: "relative", borderRadius: "12px", overflow: "hidden", border: "1px solid var(--border)", background: "var(--surface2)", cursor: "crosshair" }}
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
