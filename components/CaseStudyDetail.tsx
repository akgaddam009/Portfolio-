"use client";

import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { motion, AnimatePresence, useMotionTemplate, useScroll, useSpring } from "framer-motion";
import { useState, useEffect, useRef, useCallback, Fragment } from "react";
import type { CaseStudy, CaseStudyImage, TaskFlowStage } from "@/lib/caseStudies";
import { caseStudies } from "@/lib/caseStudies";

const EASE = [0.22, 1, 0.36, 1] as const;

// All possible nav sections — filtered at runtime after DOM commit
const ALL_NAV_SECTIONS = [
  { id: "cs-overview",  label: "Overview"  },
  { id: "cs-problem",   label: "Problem"   },
  { id: "cs-insight",   label: "Insight"   },
  { id: "cs-workflow",  label: "Workflow"  },
  { id: "decisions",    label: "Decisions" },
  { id: "outcomes",     label: "Impact"  },
  { id: "ownership",    label: "Ownership" },
];

const fadeUp = {
  // Cinematic entry: subtle blur resolves with the position so the element
  // feels like it's pulling into focus, not just fading. The ~6px blur is
  // gentle enough to GPU-paint smoothly while reading as "premium" on entry.
  hidden: { opacity: 0, y: 20, filter: "blur(6px)" },
  show:   { opacity: 1, y: 0,  filter: "blur(0px)", transition: { duration: 0.8, ease: EASE } },
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

export default function CaseStudyDetail({ cs }: { cs: CaseStudy }) {
  // Find the next case study so we can offer a forward CTA at the end of the page.
  // Wraps to the first study after the last one so visitors never hit a dead end.
  const currentIndex = caseStudies.findIndex(c => c.slug === cs.slug);
  const next = caseStudies[(currentIndex + 1) % caseStudies.length];

  // Scroll progress bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [lensLightboxSrc, setLensLightboxSrc] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>("");
  const [navVisible, setNavVisible] = useState(false);
  const [hoveredPersona, setHoveredPersona] = useState<number | null>(null);

  // Derive a sensible URL for the macOS browser chrome on VideoBlock from the
  // case study's company name. Strips non-alphanumeric, lowercases, drops common
  // suffixes like ".com", and reconstructs as "app.{company}.com". For Planful
  // the well-known path stays so existing behaviour is preserved.
  const chromeUrl = (() => {
    if (cs.slug === "planful-esm") return "app.planful.com/esm";
    const co = (cs.company || "").toLowerCase().replace(/\.com$/, "").replace(/[^a-z0-9]/g, "");
    return co ? `app.${co}.com` : "app.example.com";
  })();

  // Password gate — any case study with `confidential: true`.
  // Unlock state is per-slug, keyed in sessionStorage so different gated
  // case studies don't share an unlock and reload doesn't re-prompt.
  const PASSWORD = "password";
  const isGated = !!cs.confidential;
  const storageKey = `cs-unlocked-${cs.slug}`;
  const [unlocked, setUnlocked] = useState(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem(storageKey) === "1";
  });
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState(false);
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwInput === PASSWORD) {
      setUnlocked(true);
      sessionStorage.setItem(storageKey, "1");
      setPwError(false);
    } else {
      setPwError(true);
      setPwInput("");
    }
  };

  // NAV_SECTIONS must be state — getElementById during render always returns null
  // because the component's own DOM hasn't been committed yet.
  const [NAV_SECTIONS, setNavSections] = useState<typeof ALL_NAV_SECTIONS>([]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setLightboxSrc(null); setLensLightboxSrc(null); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    // Filter to sections that actually exist in the rendered DOM, then set up
    // IntersectionObservers for active-section tracking. Merged into one effect
    // so the filtered list and the observers are always in sync.
    const existing = ALL_NAV_SECTIONS.filter(s => !!document.getElementById(s.id));
    setNavSections(existing);

    const observers: IntersectionObserver[] = [];
    existing.forEach(({ id }) => {
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
      {/* Scroll progress bar */}
      <motion.div
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          height: "2px",
          background: "var(--text)",
          transformOrigin: "left center",
          scaleX,
          zIndex: 300,
          opacity: 0.7,
        }}
      />

      {/* Minimal nav — matches HomeNav */}
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="nav-glass"
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          zIndex: 200,
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Link
            href="/"
            style={{
              fontFamily: "var(--font-logo)",
              fontSize: "12px",
              fontWeight: 500,
              color: "var(--text)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              height: "44px",
              padding: "0 14px",
              borderRadius: "12px",
              border: "none",
              background: "var(--surface)",
              boxShadow: "var(--card-shadow)",
              display: "inline-flex",
              alignItems: "center",
              textDecoration: "none",
              transition: "box-shadow 0.25s cubic-bezier(0.22,1,0.36,1)",
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = "var(--card-shadow-hover)"; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = "var(--card-shadow)"; }}
          >
            Arun Gaddam
          </Link>
          <ThemeToggle />
        </div>
      </motion.header>

      <main style={{ paddingTop: "64px" }}>

        {/* Hero */}
        <section style={{ padding: "48px 0" }}>
          <div className="page-pad">
            <motion.div variants={container} initial="hidden" animate="show">
              <motion.div variants={fadeUp} style={{ marginBottom: "32px" }}>
                <Link
                  href="/#work"
                  className="case-study-back-link"
                  style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", display: "inline-flex", alignItems: "center", gap: "6px", transition: "color 0.2s cubic-bezier(0.22, 1, 0.36, 1)" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                  </svg>
                  Back
                </Link>
              </motion.div>

              <motion.div variants={fadeUp} style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
                {cs.tags.map(tag => (
                  <span key={tag} style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.06em", textTransform: "uppercase", padding: "3px 8px", background: "var(--surface2)", color: "var(--muted)", borderRadius: "8px" }}>
                    {tag}
                  </span>
                ))}
                {cs.confidential && (
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.06em", textTransform: "uppercase", padding: "3px 8px", background: "var(--surface2)", color: "var(--muted)", borderRadius: "8px" }}>
                    Confidential — available 1:1
                  </span>
                )}
              </motion.div>

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
                  { label: "Role", value: cs.role },
                  cs.company  ? { label: "Company",  value: cs.company  } : null,
                  cs.timeline ? { label: "Timeline", value: cs.timeline } : null,
                ].filter(Boolean).map(item => (
                  <div key={item!.label}>
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "4px" }}>{item!.label}</p>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 400, color: "var(--text)", lineHeight: 1.4 }}>{item!.value}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Metrics bar — only rendered when the case study has real business outcomes to show */}
        {cs.metrics && cs.metrics.length > 0 && (
          <div style={{ background: "var(--surface)", padding: "24px 0" }}>
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
        )}

        {/* Hero video — placed before TLDR so a recruiter sees the final UI in
            motion within the first scroll. Asymmetric vertical padding: heavier on
            top to clearly separate the panel from the metrics bar above, lighter
            on bottom to lead the eye into the TLDR. */}
        {cs.contextVideo && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: EASE }}
            style={{ padding: "96px 0 64px" }}
          >
            <div className="page-pad">
              <VideoBlock src={cs.contextVideo} appType={cs.type} chromeUrl={chromeUrl} />
            </div>
          </motion.section>
        )}

        {cs.tldr && (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE }}
            style={{ padding: "32px 0" }}
          >
            <div className="page-pad">
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "20px" }}>
                In one minute
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
                {[
                  { label: "Problem",  value: cs.tldr.problem  },
                  { label: "Approach", value: cs.tldr.approach },
                  { label: "Impact",  value: cs.tldr.outcome  },
                ].map(item => (
                  <div key={item.label}>
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "8px" }}>
                      {item.label}
                    </p>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", lineHeight: 1.6, letterSpacing: "-0.01em", color: "var(--text)" }}>
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {/* Prototype Video used to render here (right after TLDR). Moved into the
            new "Final Design" section after Decisions so the storytelling flows:
            TLDR → Process (problem/approach/research/insight) → Design Ideas →
            Final Design → Impact. */}

        {cs.prototypeIframes && cs.prototypeIframes.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: EASE }}
            style={{ padding: "48px 0" }}
          >
            {/* Eyebrow stays in the narrow body column to align with the rest
                of the case study text. */}
            <div className="page-pad">
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "24px" }}>Live prototype</p>
            </div>
            {/* Iframe blocks break out to a wider column — the Astra app is
                designed for desktop (~1300px), and forcing it into the 680px
                body column made the contents cramped. 1180px gives the inner
                app shell (200px sidebar + main) enough room to breathe. */}
            <div style={{ maxWidth: "1180px", margin: "0 auto", padding: "0 24px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                {cs.prototypeIframes.map(p => (
                  <PrototypeBlock key={p.src} prototype={p} />
                ))}
              </div>
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

              {/* contextVideo and contextImage used to render here inside Overview.
                  Removed because the contextVideo already renders as the hero panel
                  above (right under metrics, before TLDR), and re-rendering both
                  cluttered the Overview reading flow. The hero placement is the
                  only place these need to appear. */}

              {/* OLAP vs ESM data shapes — Planful only */}
              {cs.slug === "planful-esm" && cs.insightDiagram === "olap-vs-esm" && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.65, ease: EASE }}
                  style={{ marginTop: "32px" }}
                >
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "16px" }}>
                    ESM vs OLAP data model
                  </p>
                  <div style={{ display: "flex", border: "1px solid var(--border)", borderRadius: "10px", overflow: "hidden" }}>
                    {/* ESM — Tabular */}
                    <div style={{ flex: 1, padding: "24px", display: "flex", flexDirection: "column", gap: "16px", borderRight: "1px solid var(--border)" }}>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)" }}>
                        ESM · Tabular
                      </span>
                      <div style={{ display: "flex", justifyContent: "center", padding: "8px 0" }}>
                        <svg width="140" height="80" viewBox="0 0 140 80" fill="none" stroke="currentColor" strokeWidth="0.9" style={{ color: "var(--muted2)" }}>
                          {/* Header band */}
                          <rect x="2" y="2" width="136" height="14" fill="currentColor" fillOpacity="0.06" />
                          {/* Outer table */}
                          <rect x="2" y="2" width="136" height="76" />
                          {/* Column dividers */}
                          <line x1="36" y1="2" x2="36" y2="78" />
                          <line x1="70" y1="2" x2="70" y2="78" />
                          <line x1="104" y1="2" x2="104" y2="78" />
                          {/* Row dividers */}
                          <line x1="2" y1="16" x2="138" y2="16" />
                          <line x1="2" y1="31" x2="138" y2="31" />
                          <line x1="2" y1="46" x2="138" y2="46" />
                          <line x1="2" y1="61" x2="138" y2="61" />
                          {/* Header label dashes */}
                          <line x1="10" y1="9" x2="28" y2="9" strokeWidth="1.2" />
                          <line x1="44" y1="9" x2="62" y2="9" strokeWidth="1.2" />
                          <line x1="78" y1="9" x2="96" y2="9" strokeWidth="1.2" />
                          <line x1="112" y1="9" x2="130" y2="9" strokeWidth="1.2" />
                        </svg>
                      </div>
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", lineHeight: 1.55, color: "var(--muted2)", letterSpacing: "-0.01em" }}>
                        Rows × columns. Typed cells. Editable in a sandbox before publish.
                      </p>
                    </div>

                    {/* OLAP — Multi-dimensional */}
                    <div style={{ flex: 1, padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)" }}>
                        OLAP · Multi-dimensional
                      </span>
                      <div style={{ display: "flex", justifyContent: "center", padding: "8px 0" }}>
                        <svg width="140" height="80" viewBox="0 0 140 80" fill="none" stroke="currentColor" strokeWidth="0.9" strokeLinejoin="round" strokeLinecap="round" style={{ color: "var(--muted2)" }}>
                          {/* Hex outline */}
                          <path d="M70 6 L106 22 L106 54 L70 70 L34 54 L34 22 Z" />
                          {/* 3 inner edges to the front-top corner */}
                          <path d="M70 6 L70 38 M34 22 L70 38 M106 22 L70 38" />
                          {/* Top face subdivisions */}
                          <line x1="52" y1="14" x2="52" y2="30" strokeOpacity="0.5" />
                          <line x1="88" y1="14" x2="88" y2="30" strokeOpacity="0.5" />
                          <line x1="42" y1="26" x2="78" y2="42" strokeOpacity="0.4" />
                          <line x1="98" y1="26" x2="62" y2="42" strokeOpacity="0.4" />
                          {/* Front-left face vertical subdivisions */}
                          <line x1="46" y1="28" x2="46" y2="60" strokeOpacity="0.5" />
                          <line x1="58" y1="34" x2="58" y2="66" strokeOpacity="0.5" />
                          {/* Front-right face vertical subdivisions */}
                          <line x1="82" y1="34" x2="82" y2="66" strokeOpacity="0.5" />
                          <line x1="94" y1="28" x2="94" y2="60" strokeOpacity="0.5" />
                        </svg>
                      </div>
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", lineHeight: 1.55, color: "var(--muted2)", letterSpacing: "-0.01em" }}>
                        Dimensions × members. Aggregated. The shape reports and forecasts read from.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {cs.slug === "planful-esm" && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.65, ease: EASE }}
                  style={{ marginTop: "32px" }}
                >
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "16px" }}>
                    How financial data models are managed
                  </p>
                  <div style={{ display: "flex", alignItems: "stretch", gap: "0" }}>
                    {/* ESM Box */}
                    <div style={{ flex: 1, padding: "20px 24px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "10px 0 0 10px" }}>
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
                    <div style={{ flex: 1, padding: "20px 24px", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "0 10px 10px 0", borderLeft: "none" }}>
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
                  style={{ marginTop: "24px", background: "var(--surface)", borderRadius: "16px", padding: "24px", boxShadow: "var(--card-shadow)" }}
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
                          <div key={i} style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "10px", padding: "14px 16px" }}>
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

              {cs.problemImage && <ImageBlock image={cs.problemImage} placeholder="Legacy tool — Excel Spotlight screenshot" onOpen={setLightboxSrc} />}
            </CsSection>

            {/* ── Password gate (Planful only) ── */}
            {isGated && !unlocked && (
              <>
                {/* Blurred content peek */}
                <div style={{ position: "relative", overflow: "hidden", maxHeight: "180px", pointerEvents: "none", userSelect: "none" }}>
                  <div style={{ filter: "blur(6px)", opacity: 0.45, padding: "48px 0" }}>
                    <div className="page-pad">
                      <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "16px" }}>My Approach</p>
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "16px", lineHeight: 1.7, letterSpacing: "-0.02em", color: "var(--text)", maxWidth: "640px" }}>
                        {cs.approach ?? cs.insight ?? ""}
                      </p>
                    </div>
                  </div>
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "100px", background: "linear-gradient(to bottom, transparent, var(--bg))" }} />
                </div>

                {/* Gate card */}
                <div style={{ padding: "0 0 120px" }}>
                  <div className="page-pad">
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.55, ease: EASE }}
                      style={{
                        borderRadius: "16px",
                        padding: "56px 40px 48px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                        gap: "20px",
                        background: "var(--surface)",
                        boxShadow: "var(--card-shadow)",
                      }}
                    >
                      {/* Lock icon */}
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--muted)" }}>
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>

                      <div>
                        <p style={{ fontFamily: "var(--font-body)", fontSize: "17px", fontWeight: 400, letterSpacing: "-0.02em", color: "var(--text)", marginBottom: "8px", lineHeight: 1.3 }}>
                          This case study is password protected
                        </p>
                        <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--muted)", lineHeight: 1.65, maxWidth: "320px" }}>
                          The details here are confidential. Reach out to Arun for access.
                        </p>
                      </div>

                      <form onSubmit={handlePasswordSubmit} style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "340px" }}>
                        <input
                          type="password"
                          value={pwInput}
                          onChange={e => { setPwInput(e.target.value); setPwError(false); }}
                          placeholder="Password"
                          autoComplete="off"
                          style={{
                            flex: 1,
                            fontFamily: "var(--font-body)", fontSize: "14px",
                            letterSpacing: "-0.01em",
                            color: "var(--text)",
                            background: "var(--bg)",
                            border: `1px solid ${pwError ? "var(--accent-error)" : "var(--border)"}`,
                            borderRadius: "10px",
                            padding: "10px 14px",
                            outline: "none",
                            transition: "border-color 0.2s",
                          }}
                          onFocus={e => { if (!pwError) e.currentTarget.style.borderColor = "var(--text)"; }}
                          onBlur={e => { if (!pwError) e.currentTarget.style.borderColor = "var(--border)"; }}
                        />
                        <motion.button
                          type="submit"
                          whileTap={{ scale: 0.95 }}
                          transition={{ type: "spring", stiffness: 400, damping: 20 }}
                          style={{
                            fontFamily: "var(--font-body)", fontSize: "14px",
                            fontWeight: 400, letterSpacing: "-0.01em",
                            padding: "10px 20px",
                            background: "var(--text)", color: "var(--bg)",
                            border: "none", borderRadius: "10px",
                            cursor: "pointer", whiteSpace: "nowrap",
                          }}
                        >
                          Unlock
                        </motion.button>
                      </form>

                      <AnimatePresence>
                        {pwError && (
                          <motion.p
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25, ease: EASE }}
                            style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--accent-error)", letterSpacing: "0.04em", marginTop: "-8px" }}
                          >
                            Incorrect password — try again.
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </div>
                </div>
              </>
            )}

            {/* All sections below are gated for Planful until unlocked */}
            {(!isGated || unlocked) && (
            <>

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
                      <div key={i} style={{ background: "var(--surface)", borderRadius: "10px", padding: "16px 18px", boxShadow: "var(--card-shadow)" }}>
                        <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 400, letterSpacing: "-0.01em", color: "var(--text)", marginBottom: "8px", lineHeight: 1.35 }}>{f.title}</p>
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
                  style={{ background: "var(--surface)", borderRadius: "16px", padding: "24px", boxShadow: "var(--card-shadow)" }}
                >
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "12px" }}>Core Insight</p>
                  {(() => {
                    const paras = cs.insight.split("\n\n");
                    return (
                      <>
                        <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(16px, 1.8vw, 20px)", fontWeight: 400, lineHeight: 1.6, letterSpacing: "-0.02em", color: "var(--text)" }}>
                          {parseHighlights(paras[0])}
                        </p>
                        {paras.slice(1).map((para, i) => (
                          <p key={i} style={{ fontFamily: "var(--font-body)", fontSize: "13px", lineHeight: 1.65, letterSpacing: "-0.01em", color: "var(--muted2)", marginTop: "16px", maxWidth: "560px" }}>
                            {parseHighlights(para)}
                          </p>
                        ))}
                      </>
                    );
                  })()}
                </motion.div>
                {cs.insightImage && (
                  <ImageBlock image={cs.insightImage} placeholder="" onOpen={setLightboxSrc} />
                )}
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
                    {cs.taskFlow!.heading ?? "The New Workflow"}
                  </p>
                  <TaskFlowDiagram stages={cs.taskFlow.stages} />
                </motion.div>
              </section>
            )}

            {cs.decisions.some(d => d.persona) && (
              <CsSection label="Who We Designed For">
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.65, ease: EASE }}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "12px",
                    overflowX: "auto",
                    scrollSnapType: "x mandatory",
                    WebkitOverflowScrolling: "touch",
                    paddingBottom: "4px",
                    msOverflowStyle: "none",
                    scrollbarWidth: "none",
                  }}
                >
                  {cs.decisions.filter(d => d.persona).map((d, i) => {
                    const accents = [
                      { bg: "rgba(113,112,255,0.10)", text: "#7170ff", avatarBg: "rgba(113,112,255,0.15)" },
                      { bg: "rgba(16,185,129,0.10)",  text: "#10b981", avatarBg: "rgba(16,185,129,0.15)"  },
                      { bg: "rgba(113,112,255,0.07)", text: "#828fff", avatarBg: "rgba(113,112,255,0.12)" },
                      { bg: "rgba(16,185,129,0.07)",  text: "#34d399", avatarBg: "rgba(16,185,129,0.12)"  },
                    ];
                    const accent = accents[i % accents.length];
                    const initials = d.persona!.name.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();
                    return (
                      <div
                        key={i}
                        onMouseEnter={() => setHoveredPersona(i)}
                        onMouseLeave={() => setHoveredPersona(null)}
                        style={{
                          background: "var(--surface)",
                          borderRadius: "16px",
                          display: "flex",
                          flexDirection: "column",
                          minWidth: "320px",
                          maxWidth: "320px",
                          scrollSnapAlign: "start",
                          flexShrink: 0,
                          boxShadow: hoveredPersona === i ? "var(--card-shadow-hover)" : "var(--card-shadow)",
                          transition: "box-shadow 0.2s cubic-bezier(0.22, 1, 0.36, 1)",
                          overflow: "hidden",
                        }}
                      >
                        <div style={{ padding: "24px 24px 20px", display: "flex", flexDirection: "column", gap: "16px", flex: 1, position: "relative" }}>
                          <svg width="48" height="36" viewBox="0 0 48 36" fill="none" style={{ position: "absolute", top: "14px", right: "16px", opacity: 0.07, color: "var(--text)", pointerEvents: "none" }} aria-hidden="true">
                            <path d="M0 36V21.6C0 14.4 2.4 8.4 7.2 3.6L10.8 7.2C8.4 9.6 7.2 12 7.2 14.4H14.4V36H0ZM24 36V21.6C24 14.4 26.4 8.4 31.2 3.6L34.8 7.2C32.4 9.6 31.2 12 31.2 14.4H38.4V36H24Z" fill="currentColor"/>
                          </svg>
                          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: accent.avatarBg, border: `1px solid ${accent.text}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: 500, color: accent.text, letterSpacing: "0.04em" }}>{initials}</span>
                            </div>
                            <div>
                              <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 500, letterSpacing: "-0.01em", color: "var(--text)", margin: 0 }}>{d.persona!.name}</p>
                              <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.04em", color: "var(--muted)", margin: "3px 0 0" }}>{d.persona!.role}</p>
                            </div>
                          </div>
                          <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", lineHeight: 1.65, color: "var(--muted2)", fontStyle: "italic", letterSpacing: "-0.01em", margin: 0 }}>
                            "{d.persona!.quote}"
                          </p>
                        </div>
                        <div style={{ background: "var(--bg)", borderTop: "1px solid var(--border)", borderRadius: "0 0 16px 16px", padding: "20px 24px", display: "flex", flexDirection: "column", gap: "12px" }}>
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "5px" }}>
                              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ color: accent.text, flexShrink: 0 }}>
                                <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1.2"/><circle cx="5" cy="5" r="2" stroke="currentColor" strokeWidth="1.2"/><circle cx="5" cy="5" r="0.8" fill="currentColor"/>
                              </svg>
                              <p style={{ fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", margin: 0 }}>Goal</p>
                            </div>
                            <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", lineHeight: 1.55, color: "var(--muted2)", margin: 0 }}>{d.persona!.goal}</p>
                          </div>
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "5px" }}>
                              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ color: accent.text, flexShrink: 0 }}>
                                <path d="M6.5 1.5L2.5 5.5H5L3.5 8.5L7.5 4.5H5L6.5 1.5Z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" strokeLinecap="round"/>
                              </svg>
                              <p style={{ fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", margin: 0 }}>Pain point</p>
                            </div>
                            <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", lineHeight: 1.55, color: "var(--muted2)", margin: 0 }}>{d.persona!.pain}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              </CsSection>
            )}

            <CsSection label="Key Design Decisions" id="decisions">
              {cs.decisionsIntro && (
                <div style={{ marginBottom: "48px" }}>
                  <BodyText>{cs.decisionsIntro}</BodyText>
                </div>
              )}
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
                      {cs.slug === "planful-esm" && d.title.startsWith("What comes next") ? (
                        <MapsDecisionBlock />
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                          {d.body.split("\n\n").map((para, pi) => (
                            <p key={pi} style={{ fontFamily: "var(--font-body)", fontSize: "14px", lineHeight: 1.65, color: "var(--muted2)" }}>
                              {parseHighlights(para)}
                            </p>
                          ))}
                        </div>
                      )}
                      {d.videos && d.videos.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 12 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.65, ease: EASE }}
                          style={{ marginTop: "24px" }}
                        >
                          <div style={{ display: "grid", gridTemplateColumns: `repeat(${d.videos.length}, 1fr)`, gap: "12px", width: "100%" }}>
                            {d.videos.map((v, vi) => (
                              <div key={vi} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                {v.label && (
                                  <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)" }}>
                                    {v.label}
                                  </p>
                                )}
                                <div
                                  onClick={() => setLightboxSrc(v.src)}
                                  style={{ position: "relative", cursor: "zoom-in", borderRadius: "8px", overflow: "hidden", background: "var(--surface)" }}
                                >
                                  <video
                                    src={v.src}
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    preload="metadata"
                                    style={{ width: "100%", display: "block", pointerEvents: "none" }}
                                  />
                                  {/* Expand affordance — small badge top-right signalling
                                      the video is clickable to view full-size in the lightbox. */}
                                  <div style={{ position: "absolute", top: "8px", right: "8px", background: "rgba(0,0,0,0.65)", borderRadius: "6px", padding: "5px 8px", display: "flex", alignItems: "center", gap: "4px", color: "#fff", fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.06em", textTransform: "uppercase", pointerEvents: "none", backdropFilter: "blur(4px)" }}>
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                      <polyline points="15 3 21 3 21 9" />
                                      <polyline points="9 21 3 21 3 15" />
                                      <line x1="21" y1="3" x2="14" y2="10" />
                                      <line x1="3" y1="21" x2="10" y2="14" />
                                    </svg>
                                    <span>Expand</span>
                                  </div>
                                </div>
                                {v.caption && (
                                  <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", textAlign: "center" }}>
                                    {v.caption}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                      {!(cs.slug === "planful-esm" && d.title.startsWith("What comes next")) && (d.images && d.images.length > 0 ? (
                        <motion.div
                          initial={{ opacity: 0, y: 12 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.65, ease: EASE }}
                          style={{ marginTop: "24px" }}
                        >
                          <div style={{ display: "grid", gridTemplateColumns: d.imageStack ? "1fr" : "1fr 1fr", gap: "12px", width: "100%" }}>
                            {d.images.map((img, idx) => (
                              <div key={idx} onClick={() => setLightboxSrc(img.src)} style={{ position: "relative", cursor: "zoom-in" }}>
                                <img src={img.src} alt={img.alt} style={{ width: "100%", display: "block", objectFit: "contain" }} />
                                <ZoomBadge />
                                {img.caption && (
                                  <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", paddingTop: "8px", textAlign: "center" }}>
                                    {img.caption}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      ) : d.image?.fullBleed ? (
                        <motion.div
                          initial={{ opacity: 0, y: 12 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.65, ease: EASE }}
                          style={{ marginTop: "24px", marginLeft: "-72px", width: "calc(100% + 72px)", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}
                        >
                          <div style={{ position: "relative", width: "100%" }}>
                            <img
                              src={d.image.src}
                              alt={d.image.alt}
                              onClick={() => setLightboxSrc(d.image!.src)}
                              style={{ width: "100%", display: "block", objectFit: "contain", cursor: "zoom-in" }}
                            />
                            <ZoomBadge />
                          </div>
                          {d.image.caption && (
                            <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)" }}>
                              {d.image.caption}
                            </p>
                          )}
                        </motion.div>
                      ) : d.image?.width ? (
                        <motion.div
                          initial={{ opacity: 0, y: 12 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.65, ease: EASE }}
                          style={{ marginTop: "24px", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}
                        >
                          <div style={{ position: "relative", display: "inline-block" }}>
                            <img
                              src={d.image.src}
                              alt={d.image.alt}
                              onClick={() => setLightboxSrc(d.image!.src)}
                              style={{ width: d.image.width, display: "block", objectFit: "contain", cursor: "zoom-in" }}
                            />
                            <ZoomBadge />
                          </div>
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
                      ) : null)}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CsSection>

            {/* Final Design — the polished result. Static design hero first
                (instant "what shipped") then prototype motion (the product live). */}
            {(cs.outcomesImage || cs.prototypeVideo) && (
              <CsSection label="Final Design">
                <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                  {cs.outcomesImage && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.65, ease: EASE }}
                      onClick={() => setLightboxSrc(cs.outcomesImage!.src)}
                    >
                      <img
                        src={cs.outcomesImage.src}
                        alt={cs.outcomesImage.alt}
                        style={{ width: "100%", display: "block", cursor: "zoom-in", borderRadius: "12px" }}
                      />
                      {cs.outcomesImage.caption && (
                        <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", paddingTop: "10px", textAlign: "center" }}>
                          {cs.outcomesImage.caption}
                        </p>
                      )}
                    </motion.div>
                  )}
                  {cs.prototypeVideo && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.65, ease: EASE }}
                    >
                      <VideoBlock src={cs.prototypeVideo} appType={cs.type} chromeUrl={chromeUrl} />
                    </motion.div>
                  )}
                </div>
              </CsSection>
            )}

            <CsSection label="Impact" id="outcomes">
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {/* Impact tiles — Planful only */}
                {cs.slug === "planful-esm" && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: EASE }}
                    style={{ display: "flex", border: "1px solid var(--border)", borderRadius: "6px", overflow: "hidden" }}
                  >
                    {/* Tile 1: Time on task */}
                    <div style={{ flex: 1, padding: "24px 24px 20px", display: "flex", flexDirection: "column", gap: "16px", borderRight: "1px solid var(--border)" }}>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)" }}>
                        Time on task
                      </span>
                      <div style={{ display: "flex", alignItems: "baseline", gap: "12px", flexWrap: "wrap" }}>
                        <span style={{ fontFamily: "var(--font-body)", fontSize: "clamp(20px, 2.4vw, 26px)", fontWeight: 300, letterSpacing: "-0.03em", color: "var(--muted)", lineHeight: 1, textDecoration: "line-through", textDecorationColor: "var(--border)" }}>3.5 hrs</span>
                        <svg width="14" height="14" viewBox="0 0 20 20" fill="none" style={{ color: "var(--muted)", flexShrink: 0 }}>
                          <path d="M3 10h14M13 5l5 5-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span style={{ fontFamily: "var(--font-body)", fontSize: "clamp(28px, 3.4vw, 36px)", fontWeight: 400, letterSpacing: "-0.03em", color: "var(--text)", lineHeight: 1 }}>10–15 min</span>
                      </div>
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", lineHeight: 1.55, color: "var(--muted2)", letterSpacing: "-0.01em" }}>
                        ~95% reduction. Simple updates that took half a day now take a coffee break.
                      </p>
                    </div>

                    {/* Tile 2: Access expanded */}
                    <div style={{ flex: 1, padding: "24px 24px 20px", display: "flex", flexDirection: "column", gap: "16px" }}>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)" }}>
                        Access expanded
                      </span>
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(22px, 2.6vw, 28px)", fontWeight: 400, letterSpacing: "-0.03em", color: "var(--text)", lineHeight: 1.15 }}>
                        Finance → Any team
                      </p>
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", lineHeight: 1.55, color: "var(--muted2)", letterSpacing: "-0.01em" }}>
                        Non-finance teams now load their own data without finance mediating every update.
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Zetwerk BU Ecosystem — qualitative shift card */}
                {cs.slug === "zetwerk-bu-ecosystem" && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: EASE }}
                    style={{ background: "var(--surface)", borderRadius: "16px", padding: "28px 32px", boxShadow: "var(--card-shadow)" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap", marginBottom: "24px" }}>
                      <div>
                        <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "8px" }}>Before</p>
                        <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 300, letterSpacing: "-0.04em", color: "var(--muted)", lineHeight: 1 }}>5 backlogs</p>
                      </div>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0, color: "var(--border)", marginTop: "20px" }}>
                        <path d="M3 10h14M13 5l5 5-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <div>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--accent-success)", background: "color-mix(in srgb, var(--accent-success) 10%, transparent)", borderRadius: "8px", padding: "3px 7px", display: "inline-block", marginBottom: "8px" }}>After</span>
                        <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 300, letterSpacing: "-0.04em", color: "var(--text)", lineHeight: 1 }}>1 sequenced roadmap</p>
                      </div>
                    </div>
                    <div style={{ paddingTop: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
                      {cs.outcomes.map((outcome, i) => (
                        <div key={i} style={{ display: "grid", gridTemplateColumns: "20px 1fr", gap: "10px", alignItems: "start" }}>
                          <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.06em", color: "var(--border)", paddingTop: "3px" }}>
                            {String(i + 1).padStart(2, "0")}
                          </p>
                          <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", lineHeight: 1.6, letterSpacing: "-0.01em", color: "var(--muted2)" }}>
                            {outcome}
                          </p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* All outcomes as a numbered list — all other case studies */}
                {cs.slug !== "planful-esm" && cs.slug !== "zetwerk-bu-ecosystem" && cs.outcomes.map((outcome, i) => (
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

              </div>
            </CsSection>

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
                          borderRadius: "8px",
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
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(18px, 2vw, 22px)", fontWeight: 400, lineHeight: 1.4, letterSpacing: "-0.02em", color: "var(--text)", maxWidth: "640px" }}>
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

            {/* "What I'd Do Differently" section hidden across all case studies. Data
                preserved in cs.reflection in case we want to bring it back. */}
            {false && cs.reflection && (
              <CsSection label="What I'd Do Differently">
                <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(16px, 1.8vw, 20px)", fontWeight: 400, lineHeight: 1.6, letterSpacing: "-0.02em", color: "var(--text)", maxWidth: "580px" }}>
                  {cs.reflection}
                </p>
              </CsSection>
            )}

            {cs.references && cs.references.length > 0 && (
              <CsSection label="References">
                <ul style={{ display: "flex", flexDirection: "column", gap: "10px", listStyle: "none", padding: 0, margin: 0, maxWidth: "640px" }}>
                  {cs.references.map((ref, i) => (
                    <li key={i}>
                      <a
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontFamily: "var(--font-body)", fontSize: "14px", lineHeight: 1.55, color: "var(--muted2)", textDecoration: "underline", textDecorationColor: "var(--border)", textUnderlineOffset: "3px", display: "inline-flex", alignItems: "center", gap: "8px" }}
                      >
                        {/* External-link icon — small arrow pointing out of a box,
                            signals "opens in new tab" before users click. */}
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.6 }} aria-hidden="true">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                        <span>{ref.label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </CsSection>
            )}

            </> /* end gated content wrapper */
            )}

            {/* Next case study — mono-uppercase forward CTA at the end of the page,
                mirrors the "Back to work" treatment at the top. Eyebrow line for
                the system label, larger line for the actual destination title. */}
            {next && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, ease: EASE }}
                style={{ paddingTop: "64px", paddingBottom: "120px" }}
              >
                <Link
                  href={`/work/${next.slug}`}
                  className="case-study-next-link"
                  style={{
                    display: "inline-flex",
                    flexDirection: "column",
                    gap: "8px",
                    textDecoration: "none",
                  }}
                >
                  <span style={{
                    fontFamily: "var(--font-mono)", fontSize: "10px",
                    letterSpacing: "0.08em", textTransform: "uppercase",
                    color: "var(--muted)",
                    display: "inline-flex", alignItems: "center", gap: "6px",
                  }}>
                    Next case study
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M4 11v2h12l-5.59 5.59L12 20l8-8-8-8-1.41 1.41L16 11H4z"/>
                    </svg>
                  </span>
                  <span
                    className="case-study-next-title"
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "clamp(20px, 2.4vw, 28px)",
                      fontWeight: 400,
                      letterSpacing: "-0.02em",
                      lineHeight: 1.2,
                      color: "var(--text)",
                    }}
                  >
                    {next.title}
                  </span>
                </Link>
              </motion.div>
            )}

          </div>
        </article>
      </main>
      {/* Lightboxes wrapped in AnimatePresence so their `exit` animations actually run.
          Without this wrapper, the components unmount instantly when src becomes null
          and the fade/scale-out choreography never plays. */}
      <AnimatePresence>
        {lightboxSrc && (
          <Lightbox key="lightbox" src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {lensLightboxSrc && (
          <LensLightbox key="lens-lightbox" src={lensLightboxSrc} onClose={() => setLensLightboxSrc(null)} />
        )}
      </AnimatePresence>

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
                    transition: "opacity 0.25s cubic-bezier(0.22, 1, 0.36, 1)",
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
                    transition: "color 0.25s cubic-bezier(0.22, 1, 0.36, 1)",
                  }}>
                    {label}
                  </span>
                  <span style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: isActive ? "var(--text)" : "var(--border)",
                    flexShrink: 0,
                    // Active dot scales up — anchors the eye to "you are here"
                    transform: isActive ? "scale(1.4)" : "scale(1)",
                    transition: "background 0.25s cubic-bezier(0.22, 1, 0.36, 1), transform 0.25s cubic-bezier(0.22, 1, 0.36, 1)",
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

function ZoomBadge() {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        top: "8px",
        right: "8px",
        width: "26px",
        height: "26px",
        borderRadius: "8px",
        background: "rgba(0,0,0,0.65)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        pointerEvents: "none",
        opacity: 0.85,
      }}
    >
      <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="7" cy="7" r="4.5"/>
        <path d="M14 14l-3.5-3.5"/>
        <path d="M5 7h4M7 5v4"/>
      </svg>
    </div>
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
          minHeight: isEmpty ? "240px" : undefined,
          display: "flex",
          flexDirection: "column",
          alignItems: isEmpty ? "center" : undefined,
          justifyContent: isEmpty ? "center" : undefined,
          overflow: "hidden",
          border: isEmpty ? "1.5px dashed var(--border)" : "none",
          background: isEmpty ? "var(--surface)" : undefined,
          boxShadow: undefined,
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
          background: "rgba(113, 112, 255, 0.20)",
          borderRadius: "3px",
          transformOrigin: "left center",
          zIndex: 0,
        }}
      />
      <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
    </span>
  );
}


/* ─── Prototype iframe with optional jump-navigation strip ─────
   When `prototype.screens` is defined, renders a tab strip above the iframe
   that postMessages `{ type: 'astra-nav', screen, role }` to let the visitor
   scrub directly to a specific screen without doing the full linear flow.
   The target route handles the message — see /app/astra/p1/page.tsx for the
   reference implementation. */
function PrototypeBlock({ prototype: p }: { prototype: NonNullable<CaseStudy["prototypeIframes"]>[number] }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const jump = (idx: number) => {
    const target = p.screens?.[idx];
    if (!target) return;
    setActiveIdx(idx);
    iframeRef.current?.contentWindow?.postMessage(
      { type: "astra-nav", screen: target.screen, role: target.role },
      "*"
    );
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px", flexWrap: "wrap", gap: "12px" }}>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "15px", fontWeight: 590, letterSpacing: "-0.012em", color: "var(--text)", margin: 0 }}>
          {p.label}
        </p>
        <a
          href={p.src}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "5px", padding: "5px 10px", borderRadius: "6px", border: "1px solid var(--border)", transition: "color 0.15s, border-color 0.15s" }}
          onMouseEnter={e => { e.currentTarget.style.color = "var(--text)"; e.currentTarget.style.borderColor = "var(--text)"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "var(--muted)"; e.currentTarget.style.borderColor = "var(--border)"; }}
        >
          Open in new tab ↗
        </a>
      </div>

      {/* Screen-jump strip — only renders when screens are defined */}
      {p.screens && p.screens.length > 0 && (
        <div style={{
          display: "flex",
          gap: "4px",
          flexWrap: "wrap",
          marginBottom: "12px",
          padding: "6px",
          background: "var(--surface2)",
          borderRadius: "10px",
        }}>
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: "9px",
            letterSpacing: "0.08em", textTransform: "uppercase",
            color: "var(--muted)", padding: "5px 10px",
            alignSelf: "center",
          }}>
            Jump to
          </span>
          {p.screens.map((s, i) => (
            <button
              key={`${s.role ?? ""}-${s.screen}`}
              onClick={() => jump(i)}
              style={{
                fontFamily: "var(--font-body)", fontSize: "11px",
                fontWeight: 510, letterSpacing: "-0.01em",
                padding: "5px 10px", borderRadius: "6px",
                border: "none", cursor: "pointer",
                background: i === activeIdx ? "var(--text)" : "transparent",
                color:      i === activeIdx ? "var(--bg)"   : "var(--muted2)",
                transition: "background 0.15s, color 0.15s",
              }}
              onMouseEnter={e => { if (i !== activeIdx) { e.currentTarget.style.background = "var(--surface)"; e.currentTarget.style.color = "var(--text)"; } }}
              onMouseLeave={e => { if (i !== activeIdx) { e.currentTarget.style.background = "transparent";   e.currentTarget.style.color = "var(--muted2)"; } }}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}

      {/* Iframe */}
      <div style={{
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "var(--card-shadow)",
        background: "var(--surface)",
      }}>
        <iframe
          ref={iframeRef}
          src={p.src}
          title={p.label}
          loading="lazy"
          style={{
            width: "100%",
            height: p.height ?? "720px",
            border: "none",
            display: "block",
            background: "var(--surface)",
          }}
        />
      </div>
    </div>
  );
}

function VideoBlock({ src, appType, chromeUrl }: { src: string; appType?: string; chromeUrl?: string }) {
  // Mobile case studies skip the macOS browser chrome — it's misleading for an
  // app prototype. Detect on the case-study `type` string (e.g. "Consumer Mobile App").
  const isMobile = !!appType && /mobile/i.test(appType);
  // URL pill in the chrome bar. Falls back to a generic "app.example.com" if no
  // chromeUrl is passed — but we always want to pass one to keep it accurate per case.
  const urlLabel = chromeUrl || "app.example.com";

  if (isMobile) {
    return (
      <div style={{ display: "flex", justifyContent: "center", background: "var(--surface)", borderRadius: "16px", padding: "24px", boxShadow: "var(--card-shadow)" }}>
        <video
          src={src}
          autoPlay
          loop
          muted
          playsInline
          style={{ maxHeight: "640px", maxWidth: "100%", display: "block", borderRadius: "12px", background: "#000" }}
        />
      </div>
    );
  }

  return (
    <div style={{ borderRadius: "16px", overflow: "hidden", background: "var(--chrome)", boxShadow: "var(--card-shadow)" }}>
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
            {urlLabel}
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

function MapsDecisionBlock() {
  const pills = [
    { label: "Define" },
    { label: "Prepare" },
    { label: "Validate" },
    { label: "Publish" },
    { label: "Route to model ← gap", gap: true },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", lineHeight: 1.65, color: "var(--muted2)" }}>
        The four-stage flow solves data loading. But after data is loaded, someone still has to route it to the right place in the financial model. At launch, that step required backend support from an implementation team.
      </p>

      {/* Pill chain — done stages muted, gap highlighted as the focus */}
      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "6px" }}>
        {pills.map((p, i) => (
          <Fragment key={i}>
            <div style={{
              padding: "6px 12px",
              border: "1px solid var(--border)",
              borderRadius: "6px",
              fontFamily: "var(--font-body)",
              fontSize: "12px",
              color: p.gap ? "var(--text)" : "var(--muted)",
              background: p.gap ? "var(--surface)" : "transparent",
              fontWeight: p.gap ? 500 : 400,
              letterSpacing: "-0.01em",
            }}>
              {p.label}
            </div>
            {i < pills.length - 1 && (
              <span style={{ color: "var(--muted)", fontSize: "12px", fontFamily: "var(--font-mono)" }}>›</span>
            )}
          </Fragment>
        ))}
      </div>

      {/* Maps closes the loop card */}
      <div style={{ border: "1px solid var(--border)", borderRadius: "10px", padding: "20px 22px", display: "flex", flexDirection: "column", gap: "16px" }}>
        <h4 style={{ fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 500, letterSpacing: "-0.01em", color: "var(--text)", lineHeight: 1.3, margin: 0 }}>
          Maps closes the loop
        </h4>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", lineHeight: 1.6, color: "var(--muted2)" }}>
          A visual interface where finance teams draw the connections between ESM columns and OLAP dimensions themselves, no backend access, no developer dependency. The workflow becomes end-to-end: any team member loads, validates, publishes, and routes their data without leaving the product.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", border: "1px solid var(--border)", borderRadius: "8px", overflow: "hidden" }}>
          {/* Without Maps — de-emphasized */}
          <div style={{ padding: "14px 16px", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "8px" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)" }}>
              Without Maps
            </span>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", lineHeight: 1.55, color: "var(--muted)" }}>
              Teams finish publishing. Implementation consultants route the data from the backend. Turnaround: hours to days.
            </p>
          </div>
          {/* With Maps — full readable */}
          <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: "8px", background: "var(--surface)" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text)" }}>
              With Maps
            </span>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", lineHeight: 1.55, color: "var(--muted2)" }}>
              Finance teams draw the connections visually. Data reaches the right model dimensions in the same session.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}

function TaskFlowDiagram({ stages }: { stages: TaskFlowStage[] }) {
  return (
    <div style={{ display: "flex", border: "1px solid var(--border)", borderRadius: "6px", overflow: "hidden" }}>
      {stages.map((stage, i) => (
        <motion.div
          key={stage.number}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: EASE, delay: i * 0.1 }}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "24px 20px 20px",
            borderRight: i < stages.length - 1 ? "1px solid var(--border)" : "none",
            gap: "20px",
          }}
        >
          {/* Step number */}
          <span style={{
            fontFamily: "var(--font-mono)",
            fontSize: "9px",
            letterSpacing: "0.08em",
            color: "var(--muted)",
          }}>
            {stage.number}
          </span>

          {/* Icon */}
          <div style={{ color: "var(--muted2)", width: "22px", height: "22px", display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
            <svg width="22" height="22" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
              {stage.label === "Define" && <><rect x="2" y="2" width="5" height="5" rx="0.5"/><rect x="9" y="2" width="5" height="5" rx="0.5"/><rect x="2" y="9" width="5" height="5" rx="0.5"/><rect x="9" y="9" width="5" height="5" rx="0.5"/></>}
              {stage.label === "Prepare" && <><path d="M8 11V4M5 7l3-3 3 3"/><path d="M3 13h10"/></>}
              {stage.label === "Validate" && <><circle cx="8" cy="8" r="6"/><path d="M5.5 8.5l2 2 3-3"/></>}
              {stage.label === "Publish" && <path d="M14 2L7 9M14 2l-4.5 12L7 9 2.5 6.5 14 2z"/>}
            </svg>
          </div>

          {/* Stage label */}
          <h3 style={{
            fontFamily: "var(--font-body)",
            fontSize: "14px",
            fontWeight: 500,
            letterSpacing: "-0.02em",
            color: "var(--text)",
            lineHeight: 1.2,
          }}>
            {stage.label}
          </h3>
        </motion.div>
      ))}
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
        style={{ position: "relative", overflow: "hidden", background: "var(--surface2)", cursor: "crosshair" }}
      >
        <img src={image.src} alt={image.alt} style={{ width: "100%", display: "block", objectFit: "contain" }} />
        <AnimatePresence>
          {isHovering && zoomedLayer}
        </AnimatePresence>
        {onOpen && (
          <button
            onClick={() => onOpen(image.src)}
            title="Expand"
            aria-label="Expand image"
            style={{
              position: "absolute",
              bottom: "12px",
              right: "12px",
              background: "rgba(255,255,255,0.88)",
              border: "1px solid var(--border)",
              borderRadius: "10px",
              width: "44px",
              height: "44px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              backdropFilter: "blur(4px)",
              zIndex: 20,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 13 13" fill="none" stroke="var(--muted)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
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
          borderRadius: "16px",
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
            borderRadius: "8px",
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
        aria-label="Close lightbox"
        style={{
          position: "fixed",
          top: "20px",
          right: "24px",
          background: "rgba(255,255,255,0.1)",
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: "10px",
          width: "44px",
          height: "44px",
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
  // Detect video sources so the lightbox can play them at full size, not just images.
  const isVideo = /\.(mov|mp4|webm)$/i.test(src);
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
      {isVideo ? (
        <motion.video
          src={src}
          autoPlay
          loop
          controls
          playsInline
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
          style={{
            maxWidth: "90vw",
            maxHeight: "90vh",
            objectFit: "contain",
            borderRadius: "16px",
            boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
            cursor: "default",
            background: "#000",
          }}
        />
      ) : (
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
          borderRadius: "16px",
          boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
          cursor: "default",
        }}
        alt=""
      />
      )}
      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        aria-label="Close lightbox"
        style={{
          position: "fixed",
          top: "20px",
          right: "24px",
          background: "rgba(255,255,255,0.1)",
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: "10px",
          width: "44px",
          height: "44px",
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
