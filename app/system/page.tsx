"use client";

import Link from "next/link";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import Footer from "@/components/Footer";

const EASE = [0.22, 1, 0.36, 1] as const;

const NAV_SECTIONS = [
  { id: "system-overview",     label: "Overview"     },
  { id: "system-foundations",  label: "Foundations"  },
  { id: "system-components",   label: "Components"   },
  { id: "system-patterns",     label: "Patterns"     },
  { id: "system-process",      label: "Process"      },
];

/* Tokens. direct extraction from globals.css (kept in sync manually).
   3-layer depth model in both themes: chrome (canvas) → bg (panel) → surface (card).
   Light theme: cool near-white scale, panels float on a barely-tinted canvas (#f5f5f7),
   cards lift one step further on white (#ffffff). Drop shadows do the heavy lifting.
   Dark theme: lifted warm-neutral scale. Canvas is pure black (#000000); panels sit at
   #141414 (20-unit step, visibly lifted); cards at #1c1c1c. The gap between canvas and
   panel now matches the perceptual contrast of the light theme — legible without any
   surface ever feeling "lit". Text always wins. */
const COLORS = [
  { name: "--chrome",   light: "#f5f5f7", dark: "#000000", role: "Canvas. outermost layer the panels float on" },
  { name: "--bg",       light: "#fafafa", dark: "#141414", role: "Panel fill. sits just above canvas" },
  { name: "--surface",  light: "#ffffff", dark: "#1c1c1c", role: "Card fill. elevated above panel; case study page bg" },
  { name: "--surface2", light: "#f5f5f7", dark: "#242424", role: "Hover / inset. one subtle step further" },
  { name: "--border",   light: "#d2d2d7", dark: "#2a2a2a", role: "Opaque separator / hairline" },
  { name: "--text",     light: "#1d1d1f", dark: "#ffffff", role: "Primary label" },
  { name: "--muted",    light: "#6e6e73", dark: "#71717b", role: "Secondary label. passes AA on card surface" },
  { name: "--muted2",   light: "#424245", dark: "#a1a1aa", role: "Tertiary label. body and value text" },
];

const ACCENTS = [
  { name: "--accent-success", value: "#34c759", role: "Confirmation green. 'now' indicator on the career timeline, the 'copied' state on the email pill, momentary success feedback" },
  { name: "--accent-error",   value: "#ff3b30", role: "Alert red. error states and destructive actions" },
  { name: "--accent-warm",    value: "#d17b53", role: "Burnt terracotta. punctuation accent; used on the 'Now' dot, highlight sweeps, and inline emphasis marks" },
  { name: "--accent-violet",  value: "#9b8ff5", role: "Muted violet. AI Experiments chip, icon badges, and section labels in case study goal / persona cards" },
];

/* Type scale. rebuilt against the Figma reference design
   (lTdRlX8PGw0ncWuAT8fElw). Inter Regular at every size; weight 500
   only for emphasised inline phrases (==text==). 0 letter-spacing
   throughout. the previous negative tracking was drift. */
const TYPE_SCALE = [
  { name: "Case study hero",   size: "clamp(26px, 4vw, 44px)", weight: 300, ls: "-0.03em" },
  { name: "Panel hero",        size: "18px", weight: 400, ls: "0", lh: "30px" },
  { name: "Card title",        size: "16px", weight: 400, ls: "0", lh: "22px" },
  { name: "Body",              size: "14px", weight: 400, ls: "0", lh: "26px" },
  { name: "Body small",        size: "13px", weight: 400, ls: "0", lh: "1.55" },
  { name: "Caption",           size: "12px", weight: 400, ls: "-0.01em" },
  { name: "Mono micro",        size: "10px", weight: 400, ls: "0.06em", mono: true, upper: true },
  { name: "Mono tiny",         size: "9px",  weight: 400, ls: "0.08em", mono: true, upper: true },
];

export default function SystemPage() {
  /* Scroll progress. matches case study layout exactly */
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  /* Sticky section nav. appears after scrolling past the hero */
  const [navVisible, setNavVisible] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("system-overview");

  useEffect(() => {
    const onScroll = () => setNavVisible(window.scrollY > 200);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const observers: IntersectionObserver[] = [];
    NAV_SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { rootMargin: "-30% 0px -60% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => {
      observers.forEach(o => o.disconnect());
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      {/* Scroll progress bar. matches the case study layout exactly:
          1.5px AI-themed gradient (cyan → indigo → purple → pink → amber)
          drifting horizontally on a 6s linear loop. Honours
          prefers-reduced-motion. */}
      <motion.div
        className="cs-scroll-progress"
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          height: "1.5px",
          background:
            "linear-gradient(90deg, #06b6d4 0%, #6366f1 25%, #a855f7 50%, #ec4899 75%, #f59e0b 100%)",
          backgroundSize: "300% 100%",
          transformOrigin: "left center",
          scaleX,
          zIndex: 300,
          boxShadow: "0 0 8px rgba(99, 102, 241, 0.4)",
        }}
      />
      <style>{`
        .cs-scroll-progress { animation: cs-progress-shift 6s linear infinite; }
        @keyframes cs-progress-shift {
          0%   { background-position:   0% 50%; }
          100% { background-position: 300% 50%; }
        }
        @media (prefers-reduced-motion: reduce) {
          .cs-scroll-progress { animation: none !important; }
        }
      `}</style>

      {/* Top nav. same chrome as the case study layout */}
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

        {/* Hero. same shape as case study hero */}
        <section style={{ padding: "48px 0" }}>
          <div className="page-pad">
            <motion.div
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
            >
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
                <span style={tagStyle}>Featured</span>
                <span style={tagStyle}>Design System</span>
                <span style={tagStyle}>Documentation</span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                style={{ fontFamily: "var(--font-body)", fontSize: "clamp(26px, 4vw, 44px)", fontWeight: 300, lineHeight: 1.15, letterSpacing: "-0.03em", color: "var(--text)", marginBottom: "16px" }}
              >
                The system extracted from this portfolio.
              </motion.h1>

              <motion.p
                variants={fadeUp}
                style={{ fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 400, lineHeight: 1.65, color: "var(--muted)", maxWidth: "520px", marginBottom: "32px" }}
              >
                Tokens, components, motion vocabulary, and recurring interaction patterns .
                documented as they exist in the live site, not invented for the page.
                Format follows Untitled UI&apos;s component-spec convention.
              </motion.p>
            </motion.div>
          </div>
        </section>

        <article style={{ padding: "0" }}>
          <div className="page-pad">

            {/* ── Overview ── */}
            <CsSection id="system-overview" label="Overview">
              <ul style={listStyle}>
                <li>Extracted from the live codebase. not speculative or invented for this page</li>
                <li>Every example is wired to the same tokens and behaviors you see in the portfolio</li>
                <li>Covers color + type tokens, components, interaction patterns, and the AI-augmented process</li>
                <li>Format follows Untitled UI&apos;s component-spec convention</li>
              </ul>
              <SpecRow label="Sections">
                <span style={chipStyle}>Foundations</span>
                <span style={chipStyle}>Components</span>
                <span style={chipStyle}>Patterns</span>
                <span style={chipStyle}>Process</span>
              </SpecRow>
            </CsSection>

            {/* ── Foundations ── */}
            <CsSection id="system-foundations" label="Foundations">
              <ul style={listStyle}>
                <li>Two themes, one shared architecture. light (cool near-white) and dark (lifted warm-neutral)</li>
                <li>Dark scale: canvas #000000, panels #141414, cards #1c1c1c. 20-unit canvas-to-panel step matches light-theme perceptual contrast</li>
                <li>Case study detail page sits on <code style={{ fontFamily: "var(--font-mono)", fontSize: "11px" }}>--bg</code>; the impact metrics strip uses <code style={{ fontFamily: "var(--font-mono)", fontSize: "11px" }}>--surface</code> to lift above it</li>
                <li>Inter 400 throughout; weight 500 only for inline emphasis. Zero letter-spacing as default</li>
                <li>Ease-out-quint is the default motion curve across all transitions</li>
              </ul>

              <SubHeading>Surfaces</SubHeading>
              <div style={swatchGrid}>
                {COLORS.map(c => (
                  <div key={c.name} style={swatchCard}>
                    <div style={{ display: "flex", gap: "6px", marginBottom: "10px" }}>
                      <div style={{ ...swatchSquare, background: c.light }} />
                      <div style={{ ...swatchSquare, background: c.dark }} />
                    </div>
                    <p style={tokenName}>{c.name}</p>
                    <p style={tokenRole}>{c.role}</p>
                    <p style={tokenValue}><span style={{ opacity: 0.7 }}>L:</span> {c.light}</p>
                    <p style={tokenValue}><span style={{ opacity: 0.7 }}>D:</span> {c.dark}</p>
                  </div>
                ))}
              </div>

              <SubHeading>Semantic accents</SubHeading>
              <div style={swatchGrid}>
                {ACCENTS.map(c => (
                  <div key={c.name} style={swatchCard}>
                    <div style={{ ...swatchSquare, background: c.value, width: "100%", height: "32px", marginBottom: "10px" }} />
                    <p style={tokenName}>{c.name}</p>
                    <p style={tokenRole}>{c.role}</p>
                    <p style={tokenValue}>{c.value}</p>
                  </div>
                ))}
              </div>

              <SubHeading>Typography</SubHeading>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "12px" }}>
                {TYPE_SCALE.map(t => (
                  <div key={t.name} style={{
                    display: "grid",
                    gridTemplateColumns: "160px 1fr",
                    gap: "20px",
                    alignItems: "baseline",
                    paddingTop: "16px",
                    borderTop: "1px solid var(--border)",
                  }}>
                    <div>
                      <p style={tokenName}>{t.name}</p>
                      <p style={{ ...tokenValue, marginTop: "3px" }}>
                        {t.size} · {t.weight} · ls {t.ls}{t.lh ? ` · lh ${t.lh}` : ""}
                      </p>
                    </div>
                    <p style={{
                      fontFamily: t.mono ? "var(--font-mono)" : "var(--font-body)",
                      fontSize: t.size,
                      fontWeight: t.weight,
                      letterSpacing: t.ls,
                      lineHeight: t.lh ?? 1.2,
                      textTransform: t.upper ? "uppercase" : "none",
                      color: "var(--text)",
                      margin: 0,
                    }}>
                      The quick brown fox
                    </p>
                  </div>
                ))}
              </div>

              <SubHeading>Motion &amp; elevation</SubHeading>
              <SpecRow label="Easing">
                <code style={codeChip}>cubic-bezier(0.22, 1, 0.36, 1)</code>
                <code style={codeChip}>cubic-bezier(0.25, 0.1, 0.25, 1)</code>
              </SpecRow>
              <SpecRow label="Durations">
                <code style={codeChip}>--dur-fast: 180ms</code>
                <code style={codeChip}>--dur-base: 320ms</code>
                <code style={codeChip}>--dur-slow: 650ms</code>
              </SpecRow>
              <SpecRow label="Card shadows">
                <code style={codeChip}>--card-shadow</code>
                <code style={codeChip}>--card-shadow-hover</code>
              </SpecRow>
              <SpecRow label="Panel shadows">
                <code style={codeChip}>0 1px 2px rgba(0,0,0,…)</code>
                <code style={codeChip}>0 6px 24px rgba(0,0,0,…)</code>
                <code style={codeChip}>no border ring — smooth drop only</code>
              </SpecRow>
              <SpecRow label="Scroll progress bar" last>
                <code style={codeChip}>1.5px AI gradient</code>
                <code style={codeChip}>cyan → indigo → purple → pink → amber</code>
                <code style={codeChip}>6s drift loop</code>
              </SpecRow>
            </CsSection>

            {/* ── Components ── */}
            <CsSection id="system-components" label="Components">
              <ul style={listStyle}>
                <li>Each component shown live. resting, hover, and active states where applicable</li>
                <li>Consistent shadow-elevation language across content (cards) and chrome (buttons, pills)</li>
                <li>No bespoke one-offs. every component is reused across at least two surfaces</li>
              </ul>

              <ComponentBlock
                name="Card"
                category="Surface"
                description="Content cards across the portfolio. Shadow-elevated, no borders. Hover deepens the shadow stack."
                usedIn={["Selected Work", "Career timeline", "Testimonials", "Location card"]}
                tokens={["--surface", "--card-shadow", "--card-shadow-hover", "border-radius: 16px"]}
                states={[
                  { label: "Resting", node: <DemoCard interactive={false} label="Resting" desc="Default. sits with subtle elevation." /> },
                  { label: "Hover",   node: <DemoCard interactive={true}  label="Hover me" desc="Shadow deepens; no border change." /> },
                ]}
              />

              <ComponentBlock
                name="Button"
                category="Affordance"
                description="Two button styles. Outlined for secondary, filled for primary. Color + border shifts on hover, no fill swap or scale."
                usedIn={["Copy email + LinkedIn", "Footer CTAs", "Lightbox close"]}
                tokens={["--text", "--muted", "--border", "border-radius: 10px"]}
                states={[
                  { label: "Outlined", node: <DemoButton variant="outlined">Outlined</DemoButton> },
                  { label: "Filled",   node: <DemoButton variant="filled">Filled</DemoButton> },
                ]}
              />

              <ComponentBlock
                name="Pill / Tag"
                category="Metadata"
                description="Mono-uppercase tags. Two variants: filled (--surface2 bg) for standard metadata; border-only (transparent bg + 1px amber border) for Coming soon state. The border-only variant passes WCAG AA contrast in both themes."
                usedIn={["Case study tags", "Work card metadata", "Coming soon label", "System tags"]}
                tokens={["--surface2", "--muted", "--font-mono", "letter-spacing: 0.06em", "Coming soon: transparent + rgba(245,158,11,0.55) border + #f59e0b text"]}
                states={[
                  { label: "Filled",       node: <Pill>Enterprise SaaS</Pill> },
                  { label: "Set",          node: <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}><Pill>AI UX</Pill><Pill>Workflow</Pill><Pill>Confidential</Pill></div> },
                  { label: "Coming soon",  node: <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.06em", textTransform: "uppercase", padding: "3px 8px", borderRadius: "8px", background: "transparent", border: "1px solid rgba(245,158,11,0.55)", color: "#f59e0b" }}>Coming soon</span> },
                ]}
              />

              <ComponentBlock
                name="Wordmark / Home pill"
                category="Identity"
                description="Brand mark across all top navs. Same elevation system as cards. Acts as a Home affordance everywhere."
                usedIn={["Home nav", "About nav", "Case study nav", "System nav"]}
                tokens={["--surface", "--card-shadow", "--font-logo", "uppercase, ls 0.06em"]}
                states={[
                  { label: "Resting", node: <DemoWordmark interactive={false} /> },
                  { label: "Hover",   node: <DemoWordmark interactive={true} /> },
                ]}
              />
            </CsSection>

            {/* ── Patterns ── */}
            <CsSection id="system-patterns" label="Patterns">
              {/* At-a-glance scan table */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1px", marginBottom: "40px", borderRadius: "12px", overflow: "hidden", boxShadow: "var(--card-shadow)" }}>
                {[
                  { name: "Card hover lift",        cat: "Elevation", where: "Work, Career, Nav chrome" },
                  { name: "Scroll reveal",           cat: "Entrance",  where: "Case study sections, Work cards" },
                  { name: "Panel cascade",           cat: "Entrance",  where: "Home. all 5 panels on load" },
                  { name: "Metric count-up",         cat: "Reveal",    where: "Work card primary metrics" },
                  { name: "Live-coded loader",       cat: "Entrance",  where: "Home. first frame" },
                  { name: "Marquee + hover pause",   cat: "Motion",    where: "Contact panel skills ticker" },
                  { name: "Live IST clock",          cat: "Live data", where: "Contact panel map card" },
                ].map((p, i, arr) => (
                  <div key={p.name} style={{
                    display: "grid", gridTemplateColumns: "1fr 90px 1fr",
                    alignItems: "center", gap: "16px",
                    padding: "12px 16px",
                    background: "var(--surface)",
                    borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none",
                  }}>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 400, color: "var(--text)", letterSpacing: "-0.01em" }}>{p.name}</span>
                    <span style={{ ...categoryPill, justifySelf: "start" }}>{p.cat}</span>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--muted)", letterSpacing: "-0.01em" }}>{p.where}</span>
                  </div>
                ))}
              </div>

              <PatternBlock
                name="Card hover lift"
                category="Elevation"
                usedIn={["Selected Work", "Career", "Wordmark", "Theme toggle", "Nav arrows"]}
                tokens={["--card-shadow", "--card-shadow-hover"]}
              >
                <div style={{ display: "flex", gap: "12px" }}>
                  <DemoCard interactive label="Hover me" desc="Shadow deepens on hover." />
                </div>
              </PatternBlock>

              <PatternBlock
                name="Scroll-triggered reveal"
                category="Entrance"
                usedIn={["Case study sections", "Work cards on scroll", "Career cards"]}
                tokens={["ease-out-quint", "0.7s duration", "filter blur 6px → 0"]}
              >
                <ScrollRevealDemo />
              </PatternBlock>

              <PatternBlock
                name="Panel cascade entrance"
                category="Entrance"
                usedIn={["Home page. five panels"]}
                tokens={["0.12s per-panel stagger", "0.7s duration", "y:20, blur 6px → 0"]}
              >
                <CascadeDemo />
              </PatternBlock>

              <PatternBlock
                name="Metric count-up"
                category="Reveal"
                usedIn={["Work card primary metrics"]}
                tokens={["IntersectionObserver threshold 0.5", "1000ms duration", "ease-out-expo"]}
              >
                <CountUpDemo />
              </PatternBlock>

              <PatternBlock
                name="Live-coded loader"
                category="Entrance"
                usedIn={["Home page. first frame"]}
                tokens={["--font-mono → --font-body morph", "1.3s sequence"]}
              >
                <LoaderDemo />
              </PatternBlock>

              <PatternBlock
                name="Marquee with hover pause"
                category="Motion"
                usedIn={["Skills & Tools ticker on Contact panel"]}
                tokens={["--marquee-duration", "@keyframes marquee", "linear infinite"]}
              >
                <MarqueeDemo />
              </PatternBlock>

              <PatternBlock
                name="Live IST clock"
                category="Live data"
                usedIn={["Contact panel. Hyderabad map card"]}
                tokens={["Intl.DateTimeFormat · Asia/Kolkata", "1s update interval"]}
              >
                <ClockDemo />
              </PatternBlock>
            </CsSection>

            {/* ── Process ── */}
            <CsSection id="system-process" label="Process">

              {/* Workflow strip */}
              <div style={{ display: "flex", gap: "2px", marginBottom: "32px" }}>
                {["Plan", "Prompt", "Review", "Revert", "Refine"].map((step, i) => (
                  <div key={step} style={{
                    flex: 1, padding: "14px 10px",
                    background: "var(--surface)",
                    borderRadius: i === 0 ? "10px 2px 2px 10px" : i === 4 ? "2px 10px 10px 2px" : "2px",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: "6px",
                    boxShadow: "var(--card-shadow)",
                  }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--muted)" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 500, color: "var(--text)", letterSpacing: "-0.01em" }}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>

              {/* Moment cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "24px" }}>
                {[
                  {
                    label: "The Setup",
                    items: ["PRODUCT.md + DESIGN.md as ground truth", "Agent skills: impeccable, animate, design-taste-frontend", "Plan mode before every major change"],
                  },
                  {
                    label: "The Reverts",
                    items: ["Dither backdrop. too noisy", "Full-page gradient overlay. killed contrast", "Dark panel border ring. looked bolted on, not designed", "bg/chrome flip in dark. punched in, not elevated"],
                  },
                  {
                    label: "The Wins",
                    items: ["Count-up metric on work cards", "Live IST clock in contact panel", "Lifted dark scale. 20-unit canvas-to-panel step. legible in both themes", "Video poster frames. no more blank flash on load"],
                  },
                ].map(card => (
                  <div key={card.label} style={{ padding: "16px 18px", background: "var(--surface)", borderRadius: "12px", boxShadow: "var(--card-shadow)" }}>
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--muted)", margin: "0 0 12px 0" }}>
                      {card.label}
                    </p>
                    <ul style={{ margin: 0, paddingLeft: "14px" }}>
                      {card.items.map(item => (
                        <li key={item} style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--muted2)", lineHeight: 1.65, marginBottom: "6px" }}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Key insight callout */}
              <div style={{ padding: "18px 22px", background: "var(--surface)", borderRadius: "12px", borderLeft: "3px solid var(--border)", boxShadow: "var(--card-shadow)" }}>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--text)", lineHeight: 1.65, margin: 0, letterSpacing: "-0.01em" }}>
                  AI-augmented design shifts the bottleneck from <em>&quot;can I produce this&quot;</em> to <em>&quot;do I know what I want.&quot;</em> Every revert in this log is a decision made with taste, not a bug. The portfolio is the proof.
                </p>
              </div>

            </CsSection>

          </div>
        </article>
      </main>

      <Footer />

      {/* Sticky section nav. same component as case study detail */}
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
                  }}>{label}</span>
                  <span style={{
                    width: "6px", height: "6px", borderRadius: "50%",
                    background: isActive ? "var(--text)" : "var(--border)",
                    flexShrink: 0,
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

/* ─────────────────────────────────────────────────────────────
   Section primitives. match the case study detail layout shape
   ───────────────────────────────────────────────────────────── */

function CsSection({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.65, ease: EASE }}
      style={{ padding: "48px 0" }}
    >
      <p style={{
        fontFamily: "var(--font-mono)", fontSize: "9px",
        letterSpacing: "0.08em", textTransform: "uppercase",
        color: "var(--muted)", marginBottom: "20px",
      }}>{label}</p>
      {children}
    </motion.section>
  );
}

function BodyText({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontFamily: "var(--font-body)", fontSize: "15px",
      fontWeight: 400, lineHeight: 1.7, letterSpacing: "-0.01em",
      color: "var(--muted2)", maxWidth: "640px",
      marginBottom: "20px",
    }}>{children}</p>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 style={{
      fontFamily: "var(--font-mono)", fontSize: "10px",
      fontWeight: 400, letterSpacing: "0.08em",
      textTransform: "uppercase", color: "var(--muted)",
      marginTop: "40px", marginBottom: "16px",
    }}>{children}</h3>
  );
}

function SpecRow({ label, children, last }: { label: string; children: React.ReactNode; last?: boolean }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "120px 1fr",
      gap: "16px",
      padding: "14px 0",
      borderBottom: last ? "none" : "1px solid var(--border)",
      alignItems: "start",
    }}>
      <p style={{
        fontFamily: "var(--font-mono)", fontSize: "10px",
        letterSpacing: "0.08em", textTransform: "uppercase",
        color: "var(--muted)", margin: 0, paddingTop: "3px",
      }}>{label}</p>
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
        {children}
      </div>
    </div>
  );
}

/* ─── Component block (Untitled UI-style spec card) ─── */

function ComponentBlock({
  name, category, description, usedIn, tokens, states,
}: {
  name: string;
  category: string;
  description: string;
  usedIn: string[];
  tokens: string[];
  states: { label: string; node: React.ReactNode }[];
}) {
  return (
    <div style={{ marginTop: "48px" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "8px" }}>
        <h3 style={blockTitle}>{name}</h3>
        <span style={categoryPill}>{category}</span>
      </div>
      <p style={blockPara}>{description}</p>

      <div style={demoFrame}>
        {states.map(s => (
          <div key={s.label} style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "flex-start" }}>
            <span style={stateLabel}>{s.label}</span>
            {s.node}
          </div>
        ))}
      </div>

      <div style={specBlock}>
        <SpecRow label="Used in">
          {usedIn.map(u => <span key={u} style={chipStyle}>{u}</span>)}
        </SpecRow>
        <SpecRow label="Tokens" last>
          {tokens.map(t => <code key={t} style={codeChip}>{t}</code>)}
        </SpecRow>
      </div>
    </div>
  );
}

/* ─── Pattern block ─── */

function PatternBlock({
  name, category, usedIn, tokens, children,
}: {
  name: string;
  category: string;
  usedIn: string[];
  tokens: string[];
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginTop: "36px" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "12px" }}>
        <h3 style={blockTitle}>{name}</h3>
        <span style={categoryPill}>{category}</span>
      </div>

      <div style={demoFrame}>{children}</div>

      <div style={specBlock}>
        <SpecRow label="Used in">
          {usedIn.map(u => <span key={u} style={chipStyle}>{u}</span>)}
        </SpecRow>
        <SpecRow label="Config" last>
          {tokens.map(t => <code key={t} style={codeChip}>{t}</code>)}
        </SpecRow>
      </div>
    </div>
  );
}

/* ─── Demo components ─── */

function DemoCard({ interactive, label, desc }: { interactive: boolean; label: string; desc: string }) {
  return (
    <div style={{
      width: "100%", padding: "16px",
      background: "var(--surface)",
      borderRadius: "12px",
      boxShadow: "var(--card-shadow)",
      cursor: interactive ? "pointer" : "default",
      transition: "box-shadow 0.25s cubic-bezier(0.22,1,0.36,1)",
    }}
    onMouseEnter={interactive ? (e => { e.currentTarget.style.boxShadow = "var(--card-shadow-hover)"; }) : undefined}
    onMouseLeave={interactive ? (e => { e.currentTarget.style.boxShadow = "var(--card-shadow)"; }) : undefined}
    >
      <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 590, color: "var(--text)", margin: "0 0 4px 0" }}>{label}</p>
      <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--muted)", margin: 0, lineHeight: 1.5 }}>{desc}</p>
    </div>
  );
}

function DemoButton({ variant, children }: { variant: "outlined" | "filled"; children: React.ReactNode }) {
  if (variant === "filled") {
    return (
      <button style={{
        fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 400,
        letterSpacing: "-0.01em", color: "var(--bg)",
        padding: "9px 20px", borderRadius: "10px", border: "none",
        background: "var(--text)", cursor: "pointer", transition: "opacity 0.18s",
      }}
      onMouseEnter={e => { e.currentTarget.style.opacity = "0.85"; }}
      onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
      >{children}</button>
    );
  }
  return (
    <button style={{
      fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 400,
      letterSpacing: "-0.01em", color: "var(--muted)",
      padding: "9px 20px", borderRadius: "10px",
      border: "1px solid var(--border)", background: "transparent",
      cursor: "pointer", transition: "color 0.18s, border-color 0.18s",
    }}
    onMouseEnter={e => { e.currentTarget.style.color = "var(--text)"; e.currentTarget.style.borderColor = "var(--text)"; }}
    onMouseLeave={e => { e.currentTarget.style.color = "var(--muted)"; e.currentTarget.style.borderColor = "var(--border)"; }}
    >{children}</button>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      fontFamily: "var(--font-mono)", fontSize: "9px",
      letterSpacing: "0.06em", textTransform: "uppercase",
      padding: "3px 8px", background: "var(--surface2)",
      color: "var(--muted)", borderRadius: "8px",
    }}>{children}</span>
  );
}

function DemoWordmark({ interactive }: { interactive: boolean }) {
  return (
    <span style={{
      fontFamily: "var(--font-logo)", fontSize: "12px", fontWeight: 500,
      color: "var(--text)", letterSpacing: "0.06em", textTransform: "uppercase",
      height: "44px", padding: "0 14px", borderRadius: "12px",
      background: "var(--surface)", boxShadow: "var(--card-shadow)",
      display: "inline-flex", alignItems: "center",
      transition: "box-shadow 0.25s cubic-bezier(0.22,1,0.36,1)",
      cursor: interactive ? "pointer" : "default",
    }}
    onMouseEnter={interactive ? (e => { e.currentTarget.style.boxShadow = "var(--card-shadow-hover)"; }) : undefined}
    onMouseLeave={interactive ? (e => { e.currentTarget.style.boxShadow = "var(--card-shadow)"; }) : undefined}
    >Arun Gaddam</span>
  );
}

function ScrollRevealDemo() {
  const [key, setKey] = useState(0);
  return (
    <div style={{ width: "100%" }}>
      <button onClick={() => setKey(k => k + 1)} style={replayBtn}>Replay</button>
      <motion.div
        key={key}
        initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.8, ease: EASE }}
        style={{ marginTop: "12px", padding: "20px", background: "var(--surface)", borderRadius: "12px", boxShadow: "var(--card-shadow)" }}
      >
        <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--text)", margin: 0 }}>
          Element fades up + de-blurs into focus.
        </p>
      </motion.div>
    </div>
  );
}

function CascadeDemo() {
  const [key, setKey] = useState(0);
  return (
    <div style={{ width: "100%" }}>
      <button onClick={() => setKey(k => k + 1)} style={replayBtn}>Replay cascade</button>
      <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
        {[0, 1, 2, 3, 4].map(i => (
          <motion.div
            key={`${key}-${i}`}
            initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7, ease: EASE, delay: i * 0.12 }}
            style={{
              flex: 1, height: "70px", borderRadius: "10px",
              background: "var(--surface)", boxShadow: "var(--card-shadow)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "var(--font-mono)", fontSize: "11px",
              color: "var(--muted)", letterSpacing: "0.04em",
            }}
          >P{i + 1}</motion.div>
        ))}
      </div>
    </div>
  );
}

function CountUpDemo() {
  const [key, setKey] = useState(0);
  const [display, setDisplay] = useState("0");
  useEffect(() => {
    setDisplay("0");
    const target = 95;
    const duration = 1000;
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(2, -10 * p);
      setDisplay(p >= 1 ? "~95%" : `~${Math.round(eased * target)}%`);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [key]);
  return (
    <div style={{ width: "100%" }}>
      <button onClick={() => setKey(k => k + 1)} style={replayBtn}>Replay</button>
      <div style={{ marginTop: "12px", padding: "20px", background: "var(--surface)", borderRadius: "12px", boxShadow: "var(--card-shadow)" }}>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "32px", fontWeight: 400, letterSpacing: "-0.03em", color: "var(--text)", lineHeight: 1, margin: "0 0 4px 0" }}>{display}</p>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "-0.01em", color: "var(--muted)", margin: 0 }}>Reduction in time on task</p>
      </div>
    </div>
  );
}

function LoaderDemo() {
  const FULL = "<h1>Arun Gaddam</h1>";
  const [chars, setChars] = useState(0);
  const [key, setKey] = useState(0);
  useEffect(() => {
    setChars(0);
    let i = 0;
    const id = setInterval(() => { i++; setChars(i); if (i >= FULL.length) clearInterval(id); }, 35);
    return () => clearInterval(id);
  }, [key]);
  return (
    <div style={{ width: "100%" }}>
      <button onClick={() => setKey(k => k + 1)} style={replayBtn}>Replay</button>
      <div style={{
        marginTop: "12px", padding: "32px 20px",
        background: "var(--surface)", borderRadius: "12px",
        boxShadow: "var(--card-shadow)", textAlign: "center",
        minHeight: "80px", display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "14px", color: "var(--text)", margin: 0 }}>
          {FULL.slice(0, chars)}
          <span style={{
            display: "inline-block", width: "1px", height: "1em",
            background: "var(--text)", marginLeft: "2px", verticalAlign: "middle",
            opacity: chars < FULL.length ? 1 : 0, transition: "opacity 0.2s",
          }} />
        </p>
      </div>
    </div>
  );
}

function MarqueeDemo() {
  return (
    <div style={{ width: "100%" }}>
      <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "10px" }}>
        Hover to pause.
      </p>
      <div className="skills-ticker" style={{
        background: "var(--surface)", borderRadius: "12px", boxShadow: "var(--card-shadow)",
        padding: "14px 0", overflow: "hidden", position: "relative",
      }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "32px", background: "linear-gradient(to right, var(--surface), transparent)", zIndex: 1, pointerEvents: "none" }} />
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "32px", background: "linear-gradient(to left, var(--surface), transparent)", zIndex: 1, pointerEvents: "none" }} />
        <div className="marquee-track" style={{ ["--marquee-duration" as string]: "20s", display: "flex", alignItems: "center", gap: "0", whiteSpace: "nowrap" }}>
          {[...Array(2)].map((_, n) => (
            <span key={n} style={{ display: "inline-flex", alignItems: "center" }}>
              {["Inter", "DM Mono", "warm-neutral grey scale", "shadow + ring elevation", "ease-out-quint", "100dvh"].map(s => (
                <span key={`${n}-${s}`} style={{
                  fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 400,
                  letterSpacing: "-0.01em", color: "var(--muted2)",
                  padding: "4px 10px", border: "1px solid var(--border)",
                  borderRadius: "9999px", background: "var(--surface2)",
                  marginRight: "6px", whiteSpace: "nowrap",
                }}>{s}</span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function ClockDemo() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true,
    }));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div style={{ width: "100%", padding: "20px", background: "var(--surface)", borderRadius: "12px", boxShadow: "var(--card-shadow)", textAlign: "center" }}>
      <p style={{ fontFamily: "var(--font-mono)", fontSize: "20px", fontWeight: 400, letterSpacing: "0.04em", color: "var(--text)", margin: "0 0 4px 0", fontVariantNumeric: "tabular-nums" }}>
        {time ?? "--:-- --"}
      </p>
      <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", margin: 0 }}>
        IST · Hyderabad
      </p>
    </div>
  );
}

/* ─── Animation variants ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 20, filter: "blur(6px)" },
  show:   { opacity: 1, y: 0,  filter: "blur(0px)", transition: { duration: 0.8, ease: EASE } },
};

/* ─── Shared styles ─── */

const tagStyle: React.CSSProperties = {
  fontFamily: "var(--font-mono)", fontSize: "9px",
  letterSpacing: "0.06em", textTransform: "uppercase",
  padding: "3px 8px", background: "var(--surface2)",
  color: "var(--muted)", borderRadius: "8px",
};

const blockTitle: React.CSSProperties = {
  fontFamily: "var(--font-body)", fontSize: "20px",
  fontWeight: 590, letterSpacing: "-0.012em",
  color: "var(--text)", margin: 0,
};

const blockPara: React.CSSProperties = {
  fontFamily: "var(--font-body)", fontSize: "14px",
  fontWeight: 400, lineHeight: 1.65, letterSpacing: "-0.01em",
  color: "var(--muted2)", maxWidth: "640px",
  marginBottom: "20px",
};

const categoryPill: React.CSSProperties = {
  fontFamily: "var(--font-mono)", fontSize: "9px",
  letterSpacing: "0.06em", textTransform: "uppercase",
  padding: "3px 8px", borderRadius: "8px",
  background: "var(--surface2)", color: "var(--muted)",
};

const stateLabel: React.CSSProperties = {
  fontFamily: "var(--font-mono)", fontSize: "10px",
  letterSpacing: "0.08em", textTransform: "uppercase",
  color: "var(--muted)",
};

const chipStyle: React.CSSProperties = {
  fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 400,
  letterSpacing: "-0.01em",
  padding: "3px 9px",
  background: "var(--surface2)", color: "var(--muted2)",
  borderRadius: "999px",
};

const codeChip: React.CSSProperties = {
  fontFamily: "var(--font-mono)", fontSize: "11px",
  padding: "3px 8px", borderRadius: "6px",
  background: "var(--surface2)", color: "var(--muted2)",
};

const swatchGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "12px",
  marginTop: "12px",
};

const swatchCard: React.CSSProperties = {
  padding: "14px",
  background: "var(--surface)",
  borderRadius: "10px",
  boxShadow: "var(--card-shadow)",
};

const swatchSquare: React.CSSProperties = {
  width: "32px", height: "32px",
  borderRadius: "6px",
  border: "1px solid var(--border)",
};

const tokenName: React.CSSProperties = {
  fontFamily: "var(--font-mono)", fontSize: "11px",
  fontWeight: 510, letterSpacing: "-0.01em",
  color: "var(--text)", margin: 0,
};

const tokenRole: React.CSSProperties = {
  fontFamily: "var(--font-body)", fontSize: "11px",
  fontWeight: 400, lineHeight: 1.4, letterSpacing: "-0.01em",
  color: "var(--muted)", margin: "3px 0 0 0",
};

const tokenValue: React.CSSProperties = {
  fontFamily: "var(--font-mono)", fontSize: "10px",
  fontWeight: 400, color: "var(--muted2)",
  margin: "3px 0 0 0",
};

const demoFrame: React.CSSProperties = {
  marginTop: "12px",
  padding: "24px",
  background: "var(--chrome)",
  borderRadius: "12px",
  display: "flex",
  flexDirection: "column",
  gap: "20px",
};

const specBlock: React.CSSProperties = {
  marginTop: "16px",
  padding: "0 18px",
  background: "var(--surface)",
  borderRadius: "10px",
  boxShadow: "var(--card-shadow)",
};

const replayBtn: React.CSSProperties = {
  fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 400,
  letterSpacing: "-0.01em",
  color: "var(--muted)", padding: "6px 12px",
  borderRadius: "8px", border: "1px solid var(--border)",
  background: "transparent", cursor: "pointer",
  transition: "color 0.18s, border-color 0.18s",
  alignSelf: "flex-start",
};

const listStyle: React.CSSProperties = {
  fontFamily: "var(--font-body)", fontSize: "15px",
  fontWeight: 400, lineHeight: 1.7, letterSpacing: "-0.01em",
  color: "var(--muted2)", maxWidth: "640px",
  paddingLeft: "20px",
  marginBottom: "20px",
};
