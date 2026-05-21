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
  { id: "quote",      label: "Plan as artifact" },
  { id: "closer",     label: "Closer" },
] as const;

type SlideId = typeof SLIDES[number]["id"];

/* =========================================================================
   PRIMITIVES
   ========================================================================= */

/* Eyebrow — system mono caps. Same treatment as the article (--system/page.tsx):
   --text-eyebrow (9px), --muted, 0.08em default. Cover hero uses the article
   hero's wider 0.12em treatment. */
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
      color: "var(--muted)",
      margin: 0,
      marginBottom: mb,
    }}>
      {children}
    </p>
  );
}

/* SlideTitle — mapped to the existing display ladder, matching the article:
   - lg (inner slides): --text-display, weight 500 — the section H2 treatment
   - xl (cover / closer): clamp(32px, 5vw, 56px), weight 300 — same as the
     article's hero clamp (app/system/page.tsx:434). No bespoke sizes. */
function SlideTitle({ children, size = "lg" }: { children: React.ReactNode; size?: "lg" | "xl" }) {
  const isXl = size === "xl";
  return (
    <h2 style={{
      fontFamily: "var(--font-body)",
      fontSize: isXl ? "clamp(32px, 5vw, 56px)" : "var(--text-display)",
      fontWeight: isXl ? 300 : 500,
      letterSpacing: isXl ? "-0.035em" : "-0.02em",
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

/* Lead — same scale as the article's SectionDescription (--text-title-sm
   at 16px). No bespoke deck-only sizing. */
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

function Slide({
  id,
  tint,
  children,
  background,
  align = "center",
}: {
  id: SlideId;
  tint?: "warm" | "surface";
  children: React.ReactNode;
  background?: React.ReactNode;
  align?: "start" | "center";
}) {
  const reduced = useReducedMotion();
  // Warm is a real warm wash (terracotta-tinted bg) so it actually reads
  // different from --bg in light mode. Surface is the cooler card colour.
  const bg =
    tint === "warm"   ? "color-mix(in srgb, var(--accent-warm) 5%, var(--bg))"
    : tint === "surface" ? "var(--surface)"
    : "var(--bg)";
  return (
    <section
      id={id}
      data-slide={id}
      style={{
        minHeight: "100vh",
        background: bg,
        display: "flex",
        flexDirection: "column",
        justifyContent: align === "center" ? "center" : "flex-start",
        padding: "var(--space-11) var(--space-7) var(--space-10)",
        position: "relative",
        overflow: "hidden",
        borderBottom: "1px solid var(--border)",
      }}
    >
      {background}
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 16 }}
        whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5, ease: EASE }}
        style={{ width: "100%", maxWidth: 920, margin: "0 auto", position: "relative", zIndex: 1 }}
      >
        {children}
      </motion.div>
    </section>
  );
}

/* =========================================================================
   LEFT RAIL
   ========================================================================= */

function DeckRail({ active, onJump }: { active: SlideId; onJump: (id: SlideId) => void }) {
  const currentIndex = SLIDES.findIndex(s => s.id === active);
  return (
    <aside className="deck-rail" aria-label="Deck navigation">
      {/* The Portfolio back-link lives in the top bar; rail only carries
          the deck title so we don't duplicate the back-nav affordance. */}
      <p style={{
        fontFamily: "var(--font-mono)",
        fontSize: "var(--text-mono-lg)",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "var(--muted2)",
        margin: 0,
        marginBottom: "var(--space-6)",
      }}>
        Design system · Deck
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
                display: "block",
                padding: "8px 12px",
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
                transition: "color var(--dur-fast) var(--ease-expo), background var(--dur-fast) var(--ease-expo)",
                letterSpacing: "-0.005em",
              }}
            >
              {isActive && (
                <motion.span
                  layoutId="rail-indicator"
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 4,
                    bottom: 4,
                    width: 1.5,
                    background: "var(--accent-warm)",
                    borderRadius: 1,
                  }}
                  transition={{ duration: 0.18, ease: EASE }}
                />
              )}
              {s.label}
            </button>
          );
        })}
      </nav>

      <div style={{
        marginTop: "var(--space-6)",
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

      <p style={{
        marginTop: "var(--space-4)",
        fontFamily: "var(--font-mono)",
        fontSize: "var(--text-eyebrow)",
        color: "var(--muted)",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        lineHeight: 1.4,
      }}>
        ↑↓ to jump · scroll snaps
      </p>
    </aside>
  );
}

/* =========================================================================
   PAGE
   ========================================================================= */

// Mirrors the case-study Prev/Next order on CaseStudyDetail.tsx so the
// deck's "next" CTA flows into the same first case study a visitor would
// see if they jumped from the home page work index.
const NEXT_AFTER_DECK_ORDER = ["planful-esm-tables", "apple-business-listings", "fancode-homepage"];

export default function DesignSystemDeck() {
  const [active, setActive] = useState<SlideId>("cover");
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  const nextCaseStudy = caseStudies.find(c => c.slug === NEXT_AFTER_DECK_ORDER[0]);

  // Scroll-spy via IntersectionObserver.
  useEffect(() => {
    const els = SLIDES.map(s => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    if (els.length === 0) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting && e.intersectionRatio > 0.5) {
            setActive(e.target.id as SlideId);
          }
        });
      },
      { threshold: [0.5, 0.75], rootMargin: "0px" }
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

  // Keyboard nav. Skip when typing or when a button / link has focus so
  // Space activates the focused control instead of jumping a slide.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      const isControl = tag === "INPUT" || tag === "TEXTAREA" || tag === "BUTTON" || tag === "A";
      if (isControl && e.key === " ") return;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
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

  // Wheel-driven slide nav — one gesture = one slide jump. 550ms cooldown
  // covers smooth-scroll + a beat of breath. Skipped over the rail and
  // anything scrollable (e.g. <pre> code blocks) so inner content can scroll.
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    let lastJump = 0;
    const COOLDOWN = 550;
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
        @media (max-width: 1023px) {
          .deck-rail { display: none !important; }
        }
        /* Rail panel — UI-panel treatment, distinct from slide content. */
        .deck-rail {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          width: 280px;
          padding: var(--space-11) var(--space-6) var(--space-6);
          background: var(--chrome);
          border-right: 1px solid var(--border);
          overflow-y: auto;
          z-index: 9;
          display: flex;
          flex-direction: column;
        }
        .deck-rail-item:hover {
          background: var(--hover) !important;
          /* Carve a 4px transparent gutter on each side so the hover fill
             doesn't crash into the active indicator or the panel edge. */
          box-shadow: inset 4px 0 0 var(--chrome), inset -4px 0 0 var(--chrome);
        }
        .deck-rail-item[data-active="true"]:hover {
          background: transparent !important;
          box-shadow: none;
        }
        .deck-content {
          margin-left: 280px;
        }
        @media (max-width: 1023px) {
          .deck-content { margin-left: 0; }
        }
      `}</style>

      {/* Top progress bar — thin, themes via --accent-warm. */}
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

      {/* Top bar — Back link matches the CaseStudyDetail "Back" affordance
          (mono caps, 8/4 padding, 4px gap, --muted → --text on hover,
          cs-back-link class for 44px touch target). */}
      <header style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 40,
        padding: "var(--space-4) var(--space-6)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        pointerEvents: "none",
      }}>
        <Link
          href="/#work"
          className="cs-back-link"
          style={{
            pointerEvents: "auto",
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-mono)",
            fontWeight: 400,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--muted)",
            padding: "8px 4px",
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            textDecoration: "none",
            transition: "color 0.18s",
          }}
          onMouseEnter={e => { e.currentTarget.style.color = "var(--text)"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "var(--muted)"; }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
          Back
        </Link>
        <div style={{ pointerEvents: "auto" }}>
          <ThemeToggle />
        </div>
      </header>

      <DeckRail active={active} onJump={jumpTo} />

      <main className="deck-content">
        {/* 01 — Cover */}
        <Slide
          id="cover"
          background={
            <AsciiWater opacity={0.5} fontSize={13} damping={0.982} />
          }
        >
          <Eyebrow track="cover">Portfolio · Design system</Eyebrow>
          <SlideTitle size="xl">
            Planned with{" "}
            <InlineChip label="Claude AI" tone="indigo" scale="match" />.<br />
            Built with{" "}
            <InlineChip label="Claude Code" tone="violet" scale="match" />.
          </SlideTitle>
          <Lead max={620}>
            No Figma file. No handoff. The site you’re looking at <em>is</em> the
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
        </Slide>

        {/* 02 — Introduction */}
        <Slide id="intro">
          <Eyebrow>Introduction</Eyebrow>
          <SlideTitle>A working artifact, not a deliverable.</SlideTitle>
          <Lead>
            Most design systems live in Figma. They drift the moment engineers touch them.
            This one lives in the code — one CSS file, a handful of React components. If this
            page renders, the system is correct.
          </Lead>
        </Slide>

        {/* 03 — Why */}
        <Slide id="why" tint="surface">
          <Eyebrow>Why this exists</Eyebrow>
          <SlideTitle>Drift was the problem. Code was the answer.</SlideTitle>
          <Lead>
            Three portfolio rebuilds in, the same gray was hex-coded four different ways.
            Spacing wandered. One rule fixed it: nothing visual lives outside the token file.
            Drift becomes impossible because there’s only one place to drift from.
          </Lead>
        </Slide>

        {/* 04 — Philosophy */}
        <Slide id="philosophy" align="start">
          <Eyebrow>Four principles</Eyebrow>
          <SlideTitle>The opinions that shape every decision.</SlideTitle>
          <div style={{
            marginTop: "var(--space-9)",
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
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
                padding: "var(--space-6)",
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
                  color: "var(--muted2)",
                  margin: 0,
                  lineHeight: 1.55,
                }}>{p.body}</p>
              </div>
            ))}
          </div>
        </Slide>

        {/* 05 — AI workflow */}
        <Slide id="workflow" tint="surface" align="start">
          <Eyebrow>AI-assisted workflow</Eyebrow>
          <SlideTitle>Plan in Claude AI. Build in Claude Code.</SlideTitle>
          <Lead>
            Two modes, one loop. The plan file is the contract between them.
          </Lead>
          <div style={{
            marginTop: "var(--space-9)",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "var(--space-3)",
          }}>
            {[
              { step: "Plan",    tool: "Claude AI",   body: "Decisions as prose. Tradeoffs named." },
              { step: "Approve", tool: "Human",       body: "Read it. Push back. Lock scope." },
              { step: "Build",   tool: "Claude Code", body: "Execute the plan. Verify." },
              { step: "Review",  tool: "Human",       body: "Open the browser. Wrong? Back to the plan." },
            ].map((s, i) => (
              <div key={s.step} style={{
                background: "var(--bg)",
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
                  color: "var(--muted2)",
                  margin: 0,
                  lineHeight: 1.5,
                }}>{s.body}</p>
              </div>
            ))}
          </div>
        </Slide>

        {/* 06 — Tokens spec */}
        <Slide id="tokens">
          <Eyebrow>Tokens</Eyebrow>
          <SlideTitle>Colors, type, spacing, motion — one CSS file.</SlideTitle>
          <Lead>
            The token file is the only place visual decisions are allowed to live.
            Components read tokens. Pages read components. Nothing reads hexes.
          </Lead>
          <div style={{
            marginTop: "var(--space-9)",
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
              { name: "Border",  token: "--border" },
              { name: "Warm",    token: "--accent-warm" },
              { name: "Success", token: "--accent-success" },
            ].map(s => (
              <div key={s.token} style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                padding: "var(--space-3)",
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
                  fontSize: "var(--text-body)",
                  fontWeight: 500,
                  color: "var(--text)",
                  margin: 0,
                  marginBottom: 4,
                }}>{s.name}</p>
                <TokenPill token={s.token} />
              </div>
            ))}
          </div>
        </Slide>

        {/* 07 — Without tokens */}
        <Slide id="without" tint="warm">
          <Eyebrow>Without tokens</Eyebrow>
          <SlideTitle>Decisions trapped in pixel literals.</SlideTitle>
          <Lead max={520}>
            Every value is independent. A theme change is a search-and-replace. Drift is one
            careless paste away.
          </Lead>
          <pre data-scrollable style={{
            marginTop: "var(--space-7)",
            padding: "var(--space-6)",
            background: "var(--bg)",
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
        </Slide>

        {/* 08 — With tokens */}
        <Slide id="with">
          <Eyebrow>With tokens</Eyebrow>
          <SlideTitle>Decisions named. Drift impossible.</SlideTitle>
          <Lead max={520}>
            Every value is a reference. A theme change is one variable redefinition. There is
            only one place to change anything.
          </Lead>
          <pre data-scrollable style={{
            marginTop: "var(--space-7)",
            padding: "var(--space-6)",
            background: "var(--surface)",
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
        </Slide>

        {/* 09 — Buttons */}
        <Slide id="buttons" tint="surface" align="start">
          <Eyebrow>Buttons</Eyebrow>
          <SlideTitle>Three tiers, no primary.</SlideTitle>
          <Lead>The work is the hero. None of these buttons is allowed to compete for attention.</Lead>
          <div style={{
            marginTop: "var(--space-9)",
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "var(--space-4)",
          }}>
            {[
              { variant: "chrome" as const, label: "Chrome — page-level chrome, elevated", example: "Contact" },
              { variant: "inline" as const, label: "Inline — actions within content",      example: "Download CV" },
              { variant: "tag"    as const, label: "Tag — metadata, lowest weight",         example: "UX · Product" },
            ].map(row => (
              <div key={row.variant} style={{
                display: "grid",
                gridTemplateColumns: "1fr 240px",
                gap: "var(--space-6)",
                alignItems: "center",
                padding: "var(--space-5) var(--space-6)",
                background: "var(--bg)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
              }}>
                <p style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-body-lg)",
                  color: "var(--muted2)",
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
        </Slide>

        {/* 10 — Chip tones */}
        <Slide id="chips" align="start">
          <Eyebrow>Chip tones</Eyebrow>
          <SlideTitle>Six tones for inline emphasis.</SlideTitle>
          <div style={{
            marginTop: "var(--space-9)",
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
                background: "var(--surface)",
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
        </Slide>

        {/* 11 — Pull quote — matches the system Pullquote (border-left var(--text),
            no italic). Sized up because the deck makes this a moment slide. */}
        <Slide id="quote" tint="warm">
          <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "left" }}>
            <Eyebrow>Planning</Eyebrow>
            <blockquote style={{
              margin: 0,
              borderLeft: "2px solid var(--text)",
              paddingLeft: "var(--space-6)",
              fontFamily: "var(--font-body)",
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 400,
              lineHeight: 1.2,
              letterSpacing: "-0.025em",
              color: "var(--text)",
            }}>
              The plan is the artifact.<br />
              The code follows.
            </blockquote>
            <p style={{
              marginTop: "var(--space-6)",
              marginLeft: "calc(var(--space-6) + 2px)",
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-eyebrow)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--muted)",
            }}>
              Working principle · Claude Code plan mode
            </p>
          </div>
        </Slide>

        {/* 12 — Closer. Eyebrow dropped per feedback; the slide reads as
            a closing manifesto. Primary CTA points to the first case study
            so visitors flow from the design system into actual work. */}
        <Slide id="closer">
          <SlideTitle size="xl">
            Don’t just design interfaces.
            <br />
            Design the system behind them.
          </SlideTitle>
          {/* CTAs split to opposite edges of the content column. Back on the
              left as the cancel / retreat path; next case study on the right
              as the forward path. */}
          <div style={{
            marginTop: "var(--space-10)",
            display: "flex",
            gap: "var(--space-3)",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}>
            <Button asChild variant="inline">
              <Link href="/">← Back to portfolio</Link>
            </Button>
            {nextCaseStudy && (
              <Button asChild variant="inline">
                <Link href={`/work/${nextCaseStudy.slug}`}>
                  Next: {nextCaseStudy.title} →
                </Link>
              </Button>
            )}
          </div>
        </Slide>
      </main>
    </>
  );
}
