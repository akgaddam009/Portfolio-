"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { InlineChip } from "@/components/ui/InlineChip";
import AsciiWater from "@/components/AsciiWater";
import { caseStudies } from "@/lib/caseStudies";

const EASE = [0.22, 1, 0.36, 1] as const;

/* Shadow constants mirror the landing page exactly (app/page.tsx:2978).
   Dark canvas is near-black so flat drops disappear — landing solves
   this with deeper rgba shadows + a stronger active-vs-rest delta.
   Inactive panels also dim to 0.6 in dark mode; hovering or becoming
   active engages them back to full brightness. */
const PANEL_SHADOW_LIGHT        = "0 1px 2px rgba(0,0,0,0.04), 0 6px 24px rgba(0,0,0,0.06)";
const PANEL_SHADOW_ACTIVE_LIGHT = "0 2px 4px rgba(0,0,0,0.06), 0 12px 40px rgba(0,0,0,0.10)";
const PANEL_SHADOW_DARK         = "0 1px 2px rgba(0,0,0,0.40), 0 6px 24px rgba(0,0,0,0.35)";
const PANEL_SHADOW_ACTIVE_DARK  = "0 2px 4px rgba(0,0,0,0.50), 0 12px 40px rgba(0,0,0,0.45)";

/* =========================================================================
   DECK MANIFEST
   ========================================================================= */

const SLIDES = [
  { id: "cover",      label: "Cover" },
  { id: "intro",      label: "Introduction" },
  { id: "why",        label: "Why this exists" },
  { id: "philosophy", label: "Four principles" },
  { id: "workflow",   label: "AI workflow" },
  { id: "tokens",     label: "Tokens" },
  { id: "without",    label: "Without tokens" },
  { id: "with",       label: "With tokens" },
  { id: "buttons",    label: "Buttons" },
  { id: "chips",      label: "Chip tones" },
  { id: "closer",     label: "Closer" },
] as const;

type SlideId = typeof SLIDES[number]["id"];

const NEXT_AFTER_DECK_ORDER = ["planful-esm-tables", "apple-business-listings", "fancode-homepage"];

/* =========================================================================
   PRIMITIVES — same scale as the /system article so the type system stays
   shared between the deck and its sister page.
   ========================================================================= */

function Eyebrow({
  children,
  mb = 16,
  track = "default",
}: {
  children: React.ReactNode;
  mb?: number;
  track?: "default" | "cover";
}) {
  return (
    <p style={{
      fontFamily: "var(--font-mono)",
      fontSize: "var(--text-eyebrow)",
      letterSpacing: track === "cover" ? "0.12em" : "0.08em",
      textTransform: "uppercase",
      // --muted2 gives enough contrast to remain readable when the
      // panel is dimmed to opacity 0.6 in dark mode (the dim multiplies
      // through to child text).
      color: "var(--muted2)",
      margin: 0,
      marginBottom: mb,
    }}>
      {children}
    </p>
  );
}

/* SlideTitle — two size tiers, two weight tiers. Cover hero uses xl/300.
   Manifesto slides (intro, why, closer) use lg/300 — same scale as spec
   slides but the lighter weight signals "principle / closing thought."
   Spec slides (philosophy, workflow, tokens, without/with, buttons, chips)
   use lg/500 — heading-weight to anchor the data below. */
function SlideTitle({
  children,
  size = "lg",
  weight = "spec",
}: {
  children: React.ReactNode;
  size?: "lg" | "xl";
  weight?: "spec" | "manifesto";
}) {
  const isXl = size === "xl";
  const isManifesto = weight === "manifesto";
  return (
    <h2 style={{
      fontFamily: "var(--font-body)",
      fontSize: isXl ? "clamp(32px, 5vw, 56px)" : "var(--text-display)",
      fontWeight: isXl || isManifesto ? 300 : 500,
      letterSpacing: isXl || isManifesto ? "-0.025em" : "-0.02em",
      lineHeight: isXl ? 1.05 : 1.15,
      color: "var(--text)",
      margin: 0,
      marginBottom: "var(--space-6)",
      maxWidth: 880,
    }}>
      {children}
    </h2>
  );
}

function Lead({ children, max = 580 }: { children: React.ReactNode; max?: number }) {
  return (
    <p style={{
      fontFamily: "var(--font-body)",
      fontSize: "var(--text-title-sm)",
      lineHeight: 1.6,
      color: "var(--muted2)",
      maxWidth: max,
      margin: 0,
      letterSpacing: "-0.005em",
    }}>
      {children}
    </p>
  );
}

function TokenPill({ token }: { token: string }) {
  return (
    <code style={{
      fontFamily: "var(--font-mono)",
      fontSize: "var(--text-mono)",
      color: "var(--muted2)",
      background: "var(--surface2)",
      padding: "3px 8px",
      borderRadius: "var(--radius-xs)",
      letterSpacing: "0.02em",
    }}>
      {token}
    </code>
  );
}

/* =========================================================================
   SLIDE PANEL — each slide is a floating card on the --chrome canvas. Same
   panel pattern as the home page's About / Work / Career sections.
   ========================================================================= */

function SlidePanel({
  id,
  isActive,
  tint,
  children,
  background,
  align = "center",
}: {
  id: SlideId;
  isActive: boolean;
  tint?: "warm" | "surface";
  children: React.ReactNode;
  background?: React.ReactNode;
  align?: "start" | "center";
}) {
  const reduced = useReducedMotion();
  // Same bg as the landing panels — var(--bg). Tints layer on top.
  const bg =
    tint === "warm"   ? "color-mix(in srgb, var(--accent-warm) 8%, var(--bg))"
    : tint === "surface" ? "var(--surface)"
    : "var(--bg)";
  return (
    <motion.section
      id={id}
      data-slide={id}
      className={isActive ? "deck-panel is-active" : "deck-panel"}
      initial={reduced ? false : { opacity: 0, y: 16 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, ease: EASE }}
      style={{
        background: bg,
        borderRadius: "var(--radius-lg)",
        padding: "var(--space-7)",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: align === "center" ? "center" : "flex-start",
        // Full-stretch — one card fills one viewport. 88px = nav 72 + gap 16.
        minHeight: "calc(100vh - 88px)",
      }}
    >
      {background}
      <div style={{
        position: "relative",
        zIndex: 1,
        width: "100%",
        maxWidth: 880,
        margin: align === "center" ? "0 auto" : "0",
      }}>
        {children}
      </div>
    </motion.section>
  );
}

/* =========================================================================
   RAIL PANEL — sticky quick-links card in the 20% column.
   ========================================================================= */

function RailPanel({ active, onJump }: { active: SlideId; onJump: (id: SlideId) => void }) {
  const currentIndex = SLIDES.findIndex(s => s.id === active);
  return (
    <aside className="deck-rail" aria-label="Deck navigation">
      <div className="deck-rail-card">
        <p style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-eyebrow)",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--muted)",
          margin: 0,
          marginBottom: "var(--space-5)",
        }}>
          Portfolio · Design system
        </p>

        <nav style={{ position: "relative" }}>
          {SLIDES.map(s => {
            const isActive = s.id === active;
            return (
              <button
                key={s.id}
                onClick={() => onJump(s.id)}
                className="deck-rail-item"
                data-active={isActive}
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  padding: "12px 8px 12px 14px",
                  minHeight: "44px",
                  width: "100%",
                  textAlign: "left",
                  background: "transparent",
                  border: "none",
                  borderRadius: "var(--radius-xs)",
                  cursor: "pointer",
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-body)",
                  color: isActive ? "var(--text)" : "var(--muted)",
                  fontWeight: isActive ? 500 : 400,
                  lineHeight: 1.3,
                  letterSpacing: "-0.005em",
                  transition: "color var(--dur-base) var(--ease-expo), background var(--dur-fast) var(--ease-expo)",
                }}
              >
                {isActive && (
                  <motion.span
                    layoutId="rail-indicator"
                    data-rail-indicator
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 10,
                      bottom: 10,
                      width: 1.5,
                      background: "var(--accent-warm)",
                      borderRadius: 1,
                    }}
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                {s.label}
              </button>
            );
          })}
        </nav>

        <div style={{
          marginTop: "var(--space-5)",
          paddingTop: "var(--space-4)",
          borderTop: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}>
          <span style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-mono)",
            color: "var(--muted)",
            letterSpacing: "0.08em",
          }}>
            {String(currentIndex + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
          </span>
          <div style={{
            flex: 1,
            height: 2,
            background: "var(--border)",
            borderRadius: 1,
            overflow: "hidden",
          }}>
            <div style={{
              width: `${((currentIndex + 1) / SLIDES.length) * 100}%`,
              height: "100%",
              background: "var(--accent-warm)",
              transition: "width 280ms var(--ease-expo)",
            }} />
          </div>
        </div>
      </div>
    </aside>
  );
}

/* =========================================================================
   PAGE
   ========================================================================= */

export default function DesignSystemDeck() {
  const [active, setActive] = useState<SlideId>("cover");
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  const nextCaseStudy = caseStudies.find(c => c.slug === NEXT_AFTER_DECK_ORDER[0]);

  useEffect(() => {
    const els = SLIDES.map(s => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    if (els.length === 0) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting && e.intersectionRatio > 0.4) {
            setActive(e.target.id as SlideId);
          }
        });
      },
      { threshold: [0.4, 0.6], rootMargin: "-15% 0px -50% 0px" }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const jumpTo = useCallback((id: SlideId) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const jumpBy = useCallback((delta: 1 | -1) => {
    const i = SLIDES.findIndex(s => s.id === active);
    const next = SLIDES[Math.min(SLIDES.length - 1, Math.max(0, i + delta))];
    if (next) jumpTo(next.id);
  }, [active, jumpTo]);

  // Keyboard nav — Arrow / PageUp / PageDown jump slides.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "BUTTON" || tag === "A") return;
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        jumpBy(1);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        jumpBy(-1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [jumpBy]);

  // Wheel-driven slide nav — one gesture = one slide jump. Slides are
  // viewport-tall now (calc(100vh - 88px)), so one-scroll-per-slide makes
  // sense as the dominant interaction. 600ms cooldown absorbs trackpad
  // inertia. Disabled on touch (pointer:coarse) and reduced-motion.
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    let lastJump = 0;
    const COOLDOWN = 600;
    const THRESHOLD = 8;

    const onWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest(".deck-rail, pre, [data-scrollable]")) return;
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      if (Math.abs(e.deltaY) < THRESHOLD) return;

      e.preventDefault();
      const now = Date.now();
      if (now - lastJump < COOLDOWN) return;
      lastJump = now;
      jumpBy(e.deltaY > 0 ? 1 : -1);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [jumpBy]);

  return (
    <>
      <style jsx global>{`
        .deck-page {
          background: var(--chrome);
          min-height: 100vh;
        }
        /* Symmetric 24px gutters mirror the landing page's left-side
           container padding (app/page.tsx:3516). 16px gap between rail
           and content matches the inter-panel gap on landing. */
        .deck-grid {
          margin: 0;
          padding: 72px 24px 24px;
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 16px;
          align-items: start;
        }
        .deck-rail {
          position: sticky;
          top: 72px;
          align-self: start;
        }
        /* Rail is flat — no card, no shadow, no border-radius. Sits
           directly on the page chrome so the right-side slide panels
           are the only floating surfaces. */
        .deck-rail-card {
          background: transparent;
          padding: 0 8px 0 4px;
          display: flex;
          flex-direction: column;
        }
        /* Slide panels — landing's shadow tiers (active vs rest) plus
           the dark-mode dim-and-engage behaviour. Light mode never dims;
           dark mode fades inactive panels to 0.6 and engages back to 1
           on hover or active. */
        .deck-panel { box-shadow: ${PANEL_SHADOW_LIGHT}; transition: box-shadow var(--dur-base) var(--ease-expo), opacity var(--dur-base) var(--ease-expo); }
        .deck-panel.is-active { box-shadow: ${PANEL_SHADOW_ACTIVE_LIGHT}; }
        [data-theme="dark"] .deck-panel { box-shadow: ${PANEL_SHADOW_DARK}; opacity: 0.6; }
        [data-theme="dark"] .deck-panel.is-active,
        [data-theme="dark"] .deck-panel:hover { opacity: 1; box-shadow: ${PANEL_SHADOW_ACTIVE_DARK}; }
        .deck-rail-item:hover {
          background: var(--hover) !important;
        }
        .deck-rail-item[data-active="true"]:hover {
          background: transparent !important;
          box-shadow: none;
        }
        /* Slide stack uses the same 16px gap as the landing panel rail
           so the vertical rhythm matches the horizontal one. */
        .deck-content {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        /* Mobile: single column, rail above content, same 16px gap. */
        @media (max-width: 1023px) {
          .deck-grid {
            grid-template-columns: 1fr;
            padding-top: 64px;
            gap: 16px;
          }
          .deck-rail {
            position: relative;
            top: auto;
          }
          .deck-rail-card {
            padding: 16px 20px;
          }
        }
      `}</style>

      {/* Top progress bar — themes via --accent-warm, matches the article. */}
      <motion.div
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          height: 1.5,
          background: "var(--accent-warm)",
          transformOrigin: "left center",
          scaleX: progress,
          zIndex: 50,
        }}
      />

      {/* Top nav — matches HomeNav and CaseStudyDetail header exactly.
          Floating pill chips on transparent background, 8px from the top
          edge, 64px tall, 24px sides. Left: Arun Gaddam wordmark +
          ThemeToggle. Right: Next case study CTA (when one exists). */}
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        style={{
          position: "fixed",
          top: "8px", left: 0, right: 0,
          zIndex: 200,
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          background: "transparent",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Link
            href="/"
            aria-label="Home. Arun Gaddam"
            style={{
              fontFamily: "var(--font-logo)",
              fontSize: "var(--text-caption)",
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
              userSelect: "none",
              transition: "box-shadow 0.25s cubic-bezier(0.22,1,0.36,1)",
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = "var(--card-shadow-hover)"; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = "var(--card-shadow)"; }}
          >
            Arun Gaddam
          </Link>
          <ThemeToggle />
        </div>

        {/* Right side intentionally empty — the closer slide carries the
            Next case study CTA, so duplicating it in the top bar would
            split the same affordance into two visual styles. */}
      </motion.header>

      <div className="deck-page">
        <div className="deck-grid">
          <RailPanel active={active} onJump={jumpTo} />

          <main className="deck-content">

            {/* 01 — Cover */}
            <SlidePanel
              id="cover"
              isActive={active === "cover"}
              background={<AsciiWater opacity={0.45} fontSize={13} damping={0.982} />}
            >
              <Eyebrow track="cover">Portfolio · Design system</Eyebrow>
              <SlideTitle size="xl">
                Planned with{" "}
                <InlineChip label="Claude AI" tone="indigo" scale="match" />.<br />
                Built with{" "}
                <InlineChip label="Claude Code" tone="violet" scale="match" />.
              </SlideTitle>
              <Lead max={620}>
                No Figma file. No handoff. The site you’re looking at{" "}
                <span style={{ color: "var(--text)", fontWeight: 500 }}>is</span> the
                documentation — every color, type ramp, and motion curve below is the same one
                the live pages use.
              </Lead>
              <div style={{
                marginTop: "var(--space-10)",
                paddingTop: "var(--space-6)",
                borderTop: "1px solid var(--border)",
                display: "flex",
                gap: "var(--space-9)",
                flexWrap: "wrap",
              }}>
                {[
                  { label: "Slides",     value: String(SLIDES.length) },
                  { label: "Tokens",     value: "60+" },
                  { label: "Components", value: "8" },
                  { label: "Workflow",   value: "Claude AI + Code" },
                ].map(stat => (
                  <div key={stat.label}>
                    <p style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "var(--text-eyebrow)",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "var(--muted)",
                      margin: 0,
                      marginBottom: 4,
                    }}>{stat.label}</p>
                    <p style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "var(--text-title)",
                      fontWeight: 500,
                      letterSpacing: "-0.015em",
                      color: "var(--text)",
                      margin: 0,
                    }}>{stat.value}</p>
                  </div>
                ))}
              </div>
            </SlidePanel>

            {/* 02 — Introduction */}
            <SlidePanel id="intro" isActive={active === "intro"}>
              <Eyebrow>Introduction</Eyebrow>
              <SlideTitle weight="manifesto">A working artifact, not a deliverable.</SlideTitle>
              <Lead>
                Most design systems live in Figma. They drift the moment engineers touch them.
                This one lives in the code — one CSS file, a handful of React components. If this
                page renders, the system is correct.
              </Lead>
            </SlidePanel>

            {/* 03 — Why */}
            <SlidePanel id="why" isActive={active === "why"} tint="surface">
              <Eyebrow>Why this exists</Eyebrow>
              <SlideTitle weight="manifesto">Drift was the problem. Code was the answer.</SlideTitle>
              <Lead>
                Three portfolio rebuilds in, the same gray was hex-coded four different ways.
                Spacing wandered. One rule fixed it: nothing visual lives outside the token file.
                Drift becomes impossible because there’s only one place to drift from.
              </Lead>
            </SlidePanel>

            {/* 04 — Philosophy */}
            <SlidePanel id="philosophy" isActive={active === "philosophy"} align="start">
              <Eyebrow>Four principles</Eyebrow>
              <SlideTitle>The opinions that shape every decision.</SlideTitle>
              <div style={{
                marginTop: "var(--space-7)",
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "var(--space-4)",
              }}>
                {[
                  { n: "01", title: "No primary, on purpose", body: "Three button tiers, none dominant. The work is the hero." },
                  { n: "02", title: "One easing curve",       body: "Every transition uses the same cubic-bezier. One motion language." },
                  { n: "03", title: "Code, not Figma",        body: "Tokens live in globals.css. One source means nothing to drift from." },
                  { n: "04", title: "44px floor",             body: "Touch-target minimum is a spacing token. Accessibility, baked in." },
                ].map(p => (
                  <div key={p.n} style={{
                    background: "var(--surface2)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-md)",
                    padding: "var(--space-5)",
                  }}>
                    <p style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "var(--text-mono)",
                      color: "var(--muted)",
                      letterSpacing: "0.08em",
                      margin: 0,
                      marginBottom: "var(--space-4)",
                    }}>{p.n}</p>
                    <p style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "var(--text-title-sm)",
                      fontWeight: 500,
                      letterSpacing: "-0.015em",
                      color: "var(--text)",
                      margin: 0,
                      marginBottom: 8,
                    }}>{p.title}</p>
                    <p style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "var(--text-body)",
                      color: "var(--muted)",
                      margin: 0,
                      lineHeight: 1.6,
                    }}>{p.body}</p>
                  </div>
                ))}
              </div>
            </SlidePanel>

            {/* 05 — AI workflow */}
            <SlidePanel id="workflow" isActive={active === "workflow"} tint="surface" align="start">
              <Eyebrow>AI-assisted workflow</Eyebrow>
              <SlideTitle>Plan in Claude AI. Build in Claude Code.</SlideTitle>
              <Lead>
                Two modes, one loop. The plan file is the contract between them.
              </Lead>
              <div style={{
                marginTop: "var(--space-7)",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "var(--space-3)",
              }}>
                {[
                  { step: "Plan",    tool: "Claude AI",   body: "Decisions as prose. Tradeoffs named." },
                  { step: "Approve", tool: "Human",       body: "Read it. Push back. Lock scope." },
                  { step: "Build",   tool: "Claude Code", body: "Execute the plan. Verify." },
                  { step: "Review",  tool: "Human",       body: "Open the browser. Wrong? Back to the plan." },
                ].map((s, i) => (
                  <div key={s.step} style={{
                    background: "var(--surface2)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-md)",
                    padding: "var(--space-5)",
                  }}>
                    <p style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "var(--text-mono)",
                      color: "var(--muted)",
                      letterSpacing: "0.08em",
                      margin: 0,
                      marginBottom: "var(--space-3)",
                    }}>
                      {String(i + 1).padStart(2, "0")} · {s.tool}
                    </p>
                    <p style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "var(--text-title-sm)",
                      fontWeight: 500,
                      color: "var(--text)",
                      margin: 0,
                      marginBottom: 6,
                    }}>{s.step}</p>
                    <p style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "var(--text-body)",
                      color: "var(--muted)",
                      margin: 0,
                      lineHeight: 1.5,
                    }}>{s.body}</p>
                  </div>
                ))}
              </div>
            </SlidePanel>

            {/* 06 — Tokens spec */}
            <SlidePanel id="tokens" isActive={active === "tokens"} align="start">
              <Eyebrow>Tokens</Eyebrow>
              <SlideTitle>Colors, type, spacing, motion — one CSS file.</SlideTitle>
              <Lead>
                The token file is the only place visual decisions are allowed to live.
                Components read tokens. Pages read components. Nothing reads hexes.
              </Lead>
              <div style={{
                marginTop: "var(--space-7)",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                gap: "var(--space-3)",
              }}>
                {[
                  { name: "Canvas",  token: "--bg" },
                  { name: "Surface", token: "--surface" },
                  { name: "Chrome",  token: "--chrome" },
                  { name: "Text",    token: "--text" },
                  { name: "Muted",   token: "--muted" },
                  { name: "Border", token: "--border" },
                  { name: "Warm",   token: "--accent-warm" },
                  { name: "Success", token: "--accent-success" },
                ].map(s => (
                  <div key={s.token} style={{
                    background: "var(--surface2)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-md)",
                    padding: "var(--space-4)",
                  }}>
                    <div style={{
                      width: "100%",
                      aspectRatio: "5 / 3",
                      borderRadius: "var(--radius-sm)",
                      background: `var(${s.token})`,
                      border: "1px solid var(--border)",
                      marginBottom: "var(--space-3)",
                    }} />
                    <p style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "var(--text-title-sm)",
                      fontWeight: 500,
                      letterSpacing: "-0.015em",
                      color: "var(--text)",
                      margin: 0,
                      marginBottom: 4,
                    }}>{s.name}</p>
                    <TokenPill token={s.token} />
                  </div>
                ))}
              </div>
            </SlidePanel>

            {/* 07 — Without tokens */}
            <SlidePanel id="without" isActive={active === "without"} tint="warm" align="start">
              <Eyebrow>Without tokens</Eyebrow>
              <SlideTitle>Decisions trapped in pixel literals.</SlideTitle>
              <Lead max={520}>
                Every value is independent. A theme change is a search-and-replace. Drift is one
                careless paste away.
              </Lead>
              <pre data-scrollable style={{
                marginTop: "var(--space-7)",
                padding: "var(--space-5)",
                background: "var(--surface2)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-mono-lg)",
                lineHeight: 1.75,
                color: "var(--text)",
                overflow: "auto",
              }}>
{`color:         #1d1d1f;
background:    #f5f5f7;
padding:       16px 24px;
border-radius: 12px;
transition:    180ms cubic-bezier(0.22, 1, 0.36, 1);`}
              </pre>
            </SlidePanel>

            {/* 08 — With tokens */}
            <SlidePanel id="with" isActive={active === "with"} align="start">
              <Eyebrow>With tokens</Eyebrow>
              <SlideTitle>Decisions named. Drift impossible.</SlideTitle>
              <Lead max={520}>
                Every value is a reference. A theme change is one variable redefinition. There is
                only one place to change anything.
              </Lead>
              <pre data-scrollable style={{
                marginTop: "var(--space-7)",
                padding: "var(--space-5)",
                background: "var(--surface2)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-mono-lg)",
                lineHeight: 1.75,
                color: "var(--text)",
                overflow: "auto",
              }}>
{`color:         var(--text);
background:    var(--surface2);
padding:       var(--space-4) var(--space-6);
border-radius: var(--radius-md);
transition:    var(--dur-fast) var(--ease-expo);`}
              </pre>
            </SlidePanel>

            {/* 09 — Buttons */}
            <SlidePanel id="buttons" isActive={active === "buttons"} tint="surface" align="start">
              <Eyebrow>Buttons</Eyebrow>
              <SlideTitle>Three tiers, no primary.</SlideTitle>
              <Lead>The work is the hero. None of these buttons is allowed to compete for attention.</Lead>
              <div style={{
                marginTop: "var(--space-7)",
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-4)",
              }}>
                {[
                  { variant: "chrome" as const, label: "Chrome — page-level chrome, elevated", example: "Contact" },
                  { variant: "inline" as const, label: "Inline — actions within content",      example: "Download CV" },
                  { variant: "tag"    as const, label: "Tag — metadata, lowest weight",         example: "UX · Product" },
                ].map(row => (
                  <div key={row.variant} style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 220px",
                    gap: "var(--space-5)",
                    alignItems: "center",
                    padding: "var(--space-5) var(--space-6)",
                    background: "var(--surface2)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-md)",
                  }}>
                    <p style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "var(--text-title-sm)",
                      fontWeight: 500,
                      letterSpacing: "-0.015em",
                      color: "var(--text)",
                      margin: 0,
                    }}>
                      {row.label}
                    </p>
                    <div style={{ display: "flex", justifyContent: "flex-start" }}>
                      <Button variant={row.variant}>{row.example}</Button>
                    </div>
                  </div>
                ))}
              </div>
            </SlidePanel>

            {/* 10 — Chip tones */}
            <SlidePanel id="chips" isActive={active === "chips"} align="start">
              <Eyebrow>Chip tones</Eyebrow>
              <SlideTitle>Six tones for inline emphasis.</SlideTitle>
              <div style={{
                marginTop: "var(--space-7)",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "var(--space-3)",
              }}>
                {([
                  { tone: "indigo",  label: "AI copilot" },
                  { tone: "teal",    label: "research-led" },
                  { tone: "amber",   label: "ambiguous" },
                  { tone: "violet",  label: "first principles" },
                  { tone: "emerald", label: "68% adoption" },
                  { tone: "sage",    label: "studio of one" },
                ] as const).map(c => (
                  <div key={c.tone} style={{
                    background: "var(--surface2)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-md)",
                    padding: "var(--space-5)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--space-3)",
                    alignItems: "flex-start",
                  }}>
                    <InlineChip label={c.label} tone={c.tone} scale="match" />
                    <p style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "var(--text-mono)",
                      color: "var(--muted)",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      margin: 0,
                    }}>
                      {c.tone}
                    </p>
                  </div>
                ))}
              </div>
            </SlidePanel>

            {/* 11 — Closer */}
            <SlidePanel id="closer" isActive={active === "closer"}>
              <Eyebrow>Continue</Eyebrow>
              <div style={{
                marginTop: "var(--space-7)",
                display: "flex",
                gap: "16px",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                flexWrap: "wrap",
              }}>
                <Link
                  href="/"
                  aria-label="Back to portfolio"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    background: "var(--text)",
                    color: "var(--bg)",
                    textDecoration: "none",
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--text-caption)",
                    fontWeight: 500,
                    letterSpacing: "-0.01em",
                    flexShrink: 0,
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M19 12H5M11 6l-6 6 6 6" />
                  </svg>
                  Back to portfolio
                </Link>
                {nextCaseStudy && (
                  <Link
                    href={`/work/${nextCaseStudy.slug}`}
                    aria-label={`Next case study: ${nextCaseStudy.title}`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "8px 16px",
                      borderRadius: "8px",
                      background: "var(--text)",
                      color: "var(--bg)",
                      textDecoration: "none",
                      fontFamily: "var(--font-body)",
                      fontSize: "var(--text-caption)",
                      fontWeight: 500,
                      letterSpacing: "-0.01em",
                      flexShrink: 0,
                    }}
                  >
                    Next: {nextCaseStudy.title}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </Link>
                )}
              </div>
            </SlidePanel>

          </main>
        </div>
      </div>
    </>
  );
}
