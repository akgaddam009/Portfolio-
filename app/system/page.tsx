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

/* Tokens — direct extraction from globals.css.
   3-layer depth model in both themes: chrome (canvas) → bg (panel) → surface (card).
   Dark uses Apple's systemGray scale (gray6 → gray5 → gray4); light inverts. */
const COLORS = [
  { name: "--chrome",   light: "#f5f5f7", dark: "#000000", role: "Canvas — outermost layer behind panels" },
  { name: "--bg",       light: "#fbfbfd", dark: "#1c1c1e", role: "Panel surface — body background" },
  { name: "--surface",  light: "#ffffff", dark: "#2c2c2e", role: "Card surface — elevated above panel" },
  { name: "--surface2", light: "#f5f5f7", dark: "#3a3a3c", role: "Hover / inset state" },
  { name: "--border",   light: "#d2d2d7", dark: "#38383a", role: "Opaque separator" },
  { name: "--text",     light: "#1d1d1f", dark: "#ffffff", role: "Primary label" },
  { name: "--muted",    light: "#6e6e73", dark: "#9a9a9f", role: "Secondary label — passes AA on card surface" },
  { name: "--muted2",   light: "#424245", dark: "#aeaeb2", role: "Tertiary label" },
];

const ACCENTS = [
  { name: "--accent-success", value: "#34c759", role: "Apple systemGreen — success" },
  { name: "--accent-error",   value: "#ff3b30", role: "Apple systemRed — error" },
];

const TYPE_SCALE = [
  { name: "Display",      size: "48px", weight: 400, ls: "-0.035em" },
  { name: "Heading 1",    size: "32px", weight: 400, ls: "-0.022em" },
  { name: "Heading 2",    size: "24px", weight: 400, ls: "-0.012em" },
  { name: "Heading 3",    size: "20px", weight: 590, ls: "-0.012em" },
  { name: "Body Large",   size: "17px", weight: 400, ls: "-0.01em"  },
  { name: "Body",         size: "15px", weight: 400, ls: "-0.01em"  },
  { name: "Caption",      size: "13px", weight: 400, ls: "-0.01em"  },
  { name: "Mono Micro",   size: "10px", weight: 400, ls: "0.08em",  mono: true, upper: true },
];

export default function SystemPage() {
  /* Scroll progress — matches case study layout exactly */
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  /* Sticky section nav — appears after scrolling past the hero */
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
      {/* Scroll progress bar — same as case study */}
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

      {/* Top nav — same chrome as the case study layout */}
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

        {/* Hero — same shape as case study hero */}
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
                Tokens, components, motion vocabulary, and recurring interaction patterns —
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
              <BodyText>
                This page documents what already lives in the codebase you&apos;re reading from —
                color and type tokens, the components used across the home and case study pages,
                and the recurring interaction patterns. Nothing here is speculative; every
                example is wired to the same tokens and behaviors used in the live portfolio.
              </BodyText>
              <SpecRow label="Sections">
                <span style={chipStyle}>Foundations</span>
                <span style={chipStyle}>Components</span>
                <span style={chipStyle}>Patterns</span>
                <span style={chipStyle}>Process</span>
              </SpecRow>
            </CsSection>

            {/* ── Foundations ── */}
            <CsSection id="system-foundations" label="Foundations">
              <BodyText>
                Apple-system color in both themes; Inter typography with the 510 weight as the
                signature emphasis; ease-out-quint as the default motion curve.
              </BodyText>

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
                        {t.size} · {t.weight} · ls {t.ls}
                      </p>
                    </div>
                    <p style={{
                      fontFamily: t.mono ? "var(--font-mono)" : "var(--font-body)",
                      fontSize: t.size,
                      fontWeight: t.weight,
                      letterSpacing: t.ls,
                      lineHeight: 1.2,
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
              <SpecRow label="Shadow tokens" last>
                <code style={codeChip}>--card-shadow</code>
                <code style={codeChip}>--card-shadow-hover</code>
              </SpecRow>
            </CsSection>

            {/* ── Components ── */}
            <CsSection id="system-components" label="Components">
              <BodyText>
                Each component shown live with its variants. Same shadow-elevation language
                across content (cards) and chrome (icon buttons, wordmark pill).
              </BodyText>

              <ComponentBlock
                name="Card"
                category="Surface"
                description="Content cards across the portfolio. Shadow-elevated, no borders. Hover deepens the shadow stack."
                usedIn={["Selected Work", "Career timeline", "Testimonials", "Location card"]}
                tokens={["--surface", "--card-shadow", "--card-shadow-hover", "border-radius: 16px"]}
                states={[
                  { label: "Resting", node: <DemoCard interactive={false} label="Resting" desc="Default — sits with subtle elevation." /> },
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
                description="Mono-uppercase tags. --surface2 background to differentiate against page or card surfaces."
                usedIn={["Case study tags", "Work card metadata", "System tags"]}
                tokens={["--surface2", "--muted", "--font-mono", "letter-spacing: 0.06em"]}
                states={[
                  { label: "Single",  node: <Pill>Enterprise SaaS</Pill> },
                  { label: "Set",     node: <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}><Pill>AI UX</Pill><Pill>Workflow</Pill><Pill>Confidential</Pill></div> },
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
              <BodyText>
                Recurring interactions used across the portfolio. Each is implemented in the
                live codebase; the demos here run on the same tokens and timings.
              </BodyText>

              <PatternBlock
                name="Card hover lift"
                category="Elevation"
                rationale="One elevation language across the entire portfolio. Cards rest at --card-shadow, lift to --card-shadow-hover on hover. The same tokens drive icon-button hovers (theme toggle, wordmark) so chrome and content share physics."
                usedIn={["Selected Work", "Career", "Wordmark", "Theme toggle", "Nav arrows"]}
                tokens={["--card-shadow", "--card-shadow-hover"]}
              >
                <div style={{ display: "flex", gap: "12px" }}>
                  <DemoCard interactive label="Hover me" desc="Shadow deepens." />
                </div>
              </PatternBlock>

              <PatternBlock
                name="Scroll-triggered reveal"
                category="Entrance"
                rationale="Elements fade up from y:20 with a brief filter:blur(6px) → blur(0). The blur adds cinematic depth without scale or rotation. Uses framer-motion whileInView with viewport once: true."
                usedIn={["Case study sections", "Work cards on scroll", "Career cards"]}
                tokens={["ease-out-quint", "0.7s duration", "filter blur 6px → 0"]}
              >
                <ScrollRevealDemo />
              </PatternBlock>

              <PatternBlock
                name="Panel cascade entrance"
                category="Entrance"
                rationale="When the loader exits, the five home panels reveal in sequence (0.12s stagger) over ~700ms. Each uses the same fade-up + blur as the scroll pattern. One well-rehearsed entrance over scattered micro-interactions."
                usedIn={["Home page — five panels"]}
                tokens={["0.12s per-panel stagger", "0.7s duration", "y:20, blur 6px → 0"]}
              >
                <CascadeDemo />
              </PatternBlock>

              <PatternBlock
                name="Metric count-up"
                category="Reveal"
                rationale="The first time a work card enters view, its primary metric counts up from 0 to the target. Parses prefix/suffix (e.g. ~95%) and animates only the numeric portion. Fires once via IntersectionObserver."
                usedIn={["Work card primary metrics"]}
                tokens={["IntersectionObserver threshold 0.5", "1000ms duration", "ease-out-expo"]}
              >
                <CountUpDemo />
              </PatternBlock>

              <PatternBlock
                name="Live-coded loader"
                category="Entrance"
                rationale="The page loader types <h1>Arun Gaddam</h1> in mono font, then the syntax tags fade and the inner text morphs from mono 14px → body 42px. Gated on document.fonts.ready with a 1500ms safety cap."
                usedIn={["Home page — first frame"]}
                tokens={["--font-mono → --font-body morph", "1.3s sequence"]}
              >
                <LoaderDemo />
              </PatternBlock>

              <PatternBlock
                name="Marquee with hover pause"
                category="Motion"
                rationale="Continuously-scrolling track using CSS keyframes (not framer-motion — supports animation-play-state: paused). On hover of the parent .skills-ticker container, the inner .marquee-track pauses so visitors can read the items."
                usedIn={["Skills & Tools ticker on Contact panel"]}
                tokens={["--marquee-duration", "@keyframes marquee", "linear infinite"]}
              >
                <MarqueeDemo />
              </PatternBlock>

              <PatternBlock
                name="Live IST clock"
                category="Live data"
                rationale="Replaces a static IST · UTC +5:30 label with a live ticking clock. SSR-safe: renders the static fallback until hydration. Signals the human on the other side."
                usedIn={["Contact panel — Hyderabad map card"]}
                tokens={["Intl.DateTimeFormat with timeZone: 'Asia/Kolkata'", "1s update interval"]}
              >
                <ClockDemo />
              </PatternBlock>
            </CsSection>

            {/* ── Process ── */}
            <CsSection id="system-process" label="Process">
              <BodyText>
                This portfolio — and this system documentation — was built end-to-end with Claude Code.
                Not &quot;AI-assisted&quot; as a buzzword; the actual workflow: plan, prompt, review, revert,
                refine. The notes below capture what worked, what I overrode, and what I&apos;d carry forward.
              </BodyText>

              <SubHeading>What this section will cover</SubHeading>
              <ul style={listStyle}>
                <li>The setup — PRODUCT.md, DESIGN.md, the agent skills (impeccable, animate, design-taste-frontend) and how I used them</li>
                <li>Specific design decisions that emerged from the human / AI dialog</li>
                <li>The reverts — moments where I knew better than Claude (the dither backdrop, the gradient overlay, the chartreuse accent)</li>
                <li>Unexpected wins — where Claude proposed something I wouldn&apos;t have considered alone</li>
                <li>What this says about the senior designer&apos;s role in an AI-augmented workflow</li>
              </ul>

              <BodyText>
                AI-augmented design isn&apos;t faster than solo design — it&apos;s <em>different</em>.
                The bottleneck shifts from &quot;can I produce this&quot; to &quot;do I know what I want.&quot;
                Claude can generate ten variants of a button hover in a minute, but only the designer
                can name which one is right. The portfolio is the proof; this essay (in progress) is the post-mortem.
              </BodyText>
            </CsSection>

          </div>
        </article>
      </main>

      <Footer />

      {/* Sticky section nav — same component as case study detail */}
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
   Section primitives — match the case study detail layout shape
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
  name, category, rationale, usedIn, tokens, children,
}: {
  name: string;
  category: string;
  rationale: string;
  usedIn: string[];
  tokens: string[];
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginTop: "48px" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "8px" }}>
        <h3 style={blockTitle}>{name}</h3>
        <span style={categoryPill}>{category}</span>
      </div>
      <p style={blockPara}>{rationale}</p>

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
              {["Inter", "DM Mono", "Apple systemGray scale", "shadow + ring elevation", "ease-out-quint", "100dvh"].map(s => (
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
