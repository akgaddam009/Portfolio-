"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InlineChip } from "@/components/ui/InlineChip";
import AsciiWater from "@/components/AsciiWater";

const EASE = [0.22, 1, 0.36, 1] as const;

/* =========================================================================
   DECK MANIFEST — single source for slides + rail labels
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

function Eyebrow({ children, mb = 16 }: { children: React.ReactNode; mb?: number }) {
  return (
    <p style={{
      fontFamily: "var(--font-mono)",
      fontSize: "var(--text-eyebrow)",
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: "var(--muted)",
      margin: 0,
      marginBottom: mb,
    }}>
      {children}
    </p>
  );
}

function SlideTitle({ children, size = "lg" }: { children: React.ReactNode; size?: "lg" | "xl" }) {
  const fontSize = size === "xl" ? "clamp(40px, 6vw, 72px)" : "clamp(32px, 4.5vw, 52px)";
  return (
    <h2 style={{
      fontFamily: "var(--font-body)",
      fontSize,
      fontWeight: 300,
      letterSpacing: "-0.035em",
      lineHeight: 1.05,
      color: "var(--text)",
      margin: 0,
      marginBottom: 24,
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
      lineHeight: 1.55,
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
      borderRadius: 6,
      letterSpacing: "0.02em",
    }}>
      {token}
    </code>
  );
}

function Slide({
  id,
  index,
  total,
  tint,
  children,
  background,
  align = "center",
}: {
  id: SlideId;
  index: number;
  total: number;
  tint?: "warm" | "cool" | "surface";
  children: React.ReactNode;
  /** Optional full-bleed background layer (e.g. AsciiWater). Renders behind
      the centered content column; pointer-events should be none. */
  background?: React.ReactNode;
  align?: "start" | "center";
}) {
  const bg =
    tint === "warm"    ? "var(--chrome)"
    : tint === "cool"  ? "var(--surface2)"
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
        padding: "120px 32px 80px",
        position: "relative",
        overflow: "hidden",
        borderBottom: "1px solid var(--border)",
      }}
    >
      {background}

      {/* Slide number — top-left */}
      <div style={{
        position: "absolute",
        top: 96,
        left: 32,
        fontFamily: "var(--font-mono)",
        fontSize: "var(--text-mono)",
        letterSpacing: "0.1em",
        color: "var(--muted)",
        zIndex: 2,
      }}>
        {String(index).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-20%" }}
        transition={{ duration: 0.55, ease: EASE }}
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
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 24 }}>
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-mono)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--muted)",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
          Portfolio
        </Link>
        <p style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-eyebrow)",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--muted)",
          margin: 0,
        }}>
          Design system · Deck
        </p>
      </div>

      <nav style={{ position: "relative" }}>
        {SLIDES.map((s, i) => {
          const isActive = s.id === active;
          return (
            <button
              key={s.id}
              onClick={() => onJump(s.id)}
              style={{
                position: "relative",
                display: "grid",
                gridTemplateColumns: "28px 1fr",
                gap: 10,
                alignItems: "baseline",
                padding: "7px 0 7px 12px",
                width: "100%",
                textAlign: "left",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-body)",
                color: isActive ? "var(--text)" : "var(--muted)",
                fontWeight: isActive ? 500 : 400,
                lineHeight: 1.3,
                transition: "color 180ms var(--ease-expo)",
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
                  transition={{ duration: 0.25, ease: EASE }}
                />
              )}
              <span style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-mono)",
                color: "var(--muted)",
                letterSpacing: "0.06em",
              }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{s.label}</span>
            </button>
          );
        })}
      </nav>

      <div style={{
        marginTop: 24,
        paddingTop: 16,
        borderTop: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}>
        <span style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-mono)",
          color: "var(--muted)",
          letterSpacing: "0.06em",
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
        marginTop: 16,
        fontFamily: "var(--font-mono)",
        fontSize: "var(--text-eyebrow)",
        color: "var(--muted)",
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        lineHeight: 1.4,
      }}>
        ↑↓ to jump · scroll to read
      </p>
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

  // Keyboard navigation — Arrow / PageUp/Down jump slides.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
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

  // Wheel-driven slide nav — one gesture = one slide jump. We hijack the wheel
  // event and call jumpBy() with a cooldown so trackpad inertia (which fires
  // many tiny wheel ticks per gesture) doesn't fly through multiple slides.
  // Skipped on coarse-pointer / reduced-motion (mobile + a11y → normal scroll).
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    let lastJump = 0;
    const COOLDOWN = 750; // ms; covers ~600ms smooth scroll + breath
    const THRESHOLD = 8;  // ignore micro-wheel noise

    const onWheel = (e: WheelEvent) => {
      // Let the rail scroll naturally if it overflows.
      const target = e.target as HTMLElement | null;
      if (target?.closest(".deck-rail")) return;

      // Horizontal-dominant scrolls (e.g. trackpad horizontal swipe) are not deck nav.
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
      {/* Mobile: hide the rail, let the page scroll normally as an article.
          Snap classes are still defined for the case where we want to bring
          back CSS snap as a fallback, but desktop nav is now wheel-hijacked. */}
      <style jsx global>{`
        @media (max-width: 1023px) {
          .deck-rail { display: none !important; }
        }
        /* Rail panel — clearly distinct from the slide content area. Uses
           --chrome (warm off-white in light, pure black in dark) + a hairline
           right border + a soft right shadow for depth. Reads as a UI panel,
           not a floating overlay. */
        .deck-rail {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          width: 280px;
          padding: 96px 24px 24px;
          background: var(--chrome);
          border-right: 1px solid var(--border);
          box-shadow: 6px 0 24px -12px rgba(0, 0, 0, 0.05);
          overflow-y: auto;
          z-index: 9;
          display: flex;
          flex-direction: column;
        }
        .deck-content {
          margin-left: 280px;
        }
        @media (max-width: 1023px) {
          .deck-content { margin-left: 0; }
        }
      `}</style>

      {/* Top progress bar — thin, warm accent, themes correctly. */}
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

      {/* Top bar */}
      <header style={{
        position: "fixed",
        top: 0, right: 0,
        zIndex: 40,
        padding: "16px 24px",
      }}>
        <ThemeToggle />
      </header>

      <DeckRail active={active} onJump={jumpTo} />

      <main className="deck-content">
        {/* 01 — Cover. No tint so it sits on pure --bg (white in light, dark
            panel in dark) and contrasts cleanly against the warm-gray rail. */}
        <Slide
          id="cover"
          index={1}
          total={SLIDES.length}
          background={
            /* Signature moment: ASCII ripple sits behind the cover headline.
               Reacts to cursor; flat under prefers-reduced-motion; quiet on
               touch devices. Opacity kept low so it reads as texture. */
            <AsciiWater opacity={0.32} fontSize={13} damping={0.982} />
          }
        >
          <Eyebrow>Portfolio · Design system</Eyebrow>
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
            marginTop: 56,
            paddingTop: 24,
            borderTop: "1px solid var(--border)",
            display: "flex",
            gap: 40,
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
                  letterSpacing: "0.1em",
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

        {/* 02 — Introduction (manifesto) */}
        <Slide id="intro" index={2} total={SLIDES.length}>
          <Eyebrow>Introduction</Eyebrow>
          <SlideTitle>A working artifact, not a deliverable.</SlideTitle>
          <Lead>
            Most design systems live in Figma. They drift the moment engineers touch them.
            This one lives in the code — one CSS file, a handful of React components. If this
            page renders, the system is correct.
          </Lead>
        </Slide>

        {/* 03 — Why (manifesto) */}
        <Slide id="why" index={3} total={SLIDES.length} tint="surface">
          <Eyebrow>Why this exists</Eyebrow>
          <SlideTitle>Drift was the problem. Code was the answer.</SlideTitle>
          <Lead>
            Three portfolio rebuilds in, the same gray was hex-coded four different ways.
            Spacing wandered. One rule fixed it: nothing visual lives outside the token file.
            Drift becomes impossible because there’s only one place to drift from.
          </Lead>
        </Slide>

        {/* 04 — Philosophy (grid) */}
        <Slide id="philosophy" index={4} total={SLIDES.length} align="start">
          <Eyebrow>Four principles</Eyebrow>
          <SlideTitle>The opinions that shape every decision.</SlideTitle>
          <div style={{
            marginTop: 40,
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 16,
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
                borderRadius: 16,
                padding: 24,
              }}>
                <p style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-mono)",
                  color: "var(--muted)",
                  letterSpacing: "0.08em",
                  margin: 0,
                  marginBottom: 16,
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

        {/* 05 — AI workflow (map) */}
        <Slide id="workflow" index={5} total={SLIDES.length} tint="surface" align="start">
          <Eyebrow>AI-assisted workflow</Eyebrow>
          <SlideTitle>Plan in Claude AI. Build in Claude Code.</SlideTitle>
          <Lead>
            Two modes, one loop. The plan file is the contract between them.
          </Lead>
          <div style={{
            marginTop: 40,
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 12,
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
                borderRadius: 12,
                padding: 20,
              }}>
                <p style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-mono)",
                  color: "var(--muted)",
                  letterSpacing: "0.08em",
                  margin: 0,
                  marginBottom: 12,
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

        {/* 06 — Tokens chapter cover (spec) */}
        <Slide id="tokens" index={6} total={SLIDES.length}>
          <Eyebrow>Tokens</Eyebrow>
          <SlideTitle>Colors, type, spacing, motion — one CSS file.</SlideTitle>
          <Lead>
            The token file is the only place visual decisions are allowed to live.
            Components read tokens. Pages read components. Nothing reads hexes.
          </Lead>
          <div style={{
            marginTop: 48,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: 12,
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
                borderRadius: 12,
                padding: 12,
              }}>
                <div style={{
                  width: "100%",
                  aspectRatio: "5 / 3",
                  borderRadius: 8,
                  background: `var(${s.token})`,
                  border: "1px solid var(--border)",
                  marginBottom: 10,
                }} />
                <p style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-body)",
                  fontWeight: 500,
                  color: "var(--text)",
                  margin: 0,
                }}>{s.name}</p>
                <TokenPill token={s.token} />
              </div>
            ))}
          </div>
        </Slide>

        {/* 07 — Without tokens (comparison: half 1) */}
        <Slide id="without" index={7} total={SLIDES.length} tint="cool">
          <Eyebrow>Without tokens</Eyebrow>
          <SlideTitle>Decisions trapped in pixel literals.</SlideTitle>
          <Lead max={520}>
            Every value is independent. A theme change is a search-and-replace. Drift is one
            careless paste away.
          </Lead>
          <pre style={{
            marginTop: 32,
            padding: 24,
            background: "var(--bg)",
            border: "1px solid var(--border)",
            borderRadius: 12,
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
        <Slide id="with" index={8} total={SLIDES.length}>
          <Eyebrow>With tokens</Eyebrow>
          <SlideTitle>Decisions named. Drift impossible.</SlideTitle>
          <Lead max={520}>
            Every value is a reference. A theme change is one variable redefinition. There is
            only one place to change anything.
          </Lead>
          <pre style={{
            marginTop: 32,
            padding: 24,
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 12,
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

        {/* 09 — Buttons (demo) */}
        <Slide id="buttons" index={9} total={SLIDES.length} tint="surface" align="start">
          <Eyebrow>Buttons</Eyebrow>
          <SlideTitle>Three tiers, no primary.</SlideTitle>
          <Lead>The work is the hero. None of these buttons is allowed to compete for attention.</Lead>
          <div style={{
            marginTop: 48,
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 16,
          }}>
            {[
              { variant: "chrome" as const, label: "Chrome — page-level chrome, elevated", example: "Contact" },
              { variant: "inline" as const, label: "Inline — actions within content",      example: "Download CV" },
              { variant: "tag"    as const, label: "Tag — metadata, lowest weight",         example: "UX · Product" },
            ].map(row => (
              <div key={row.variant} style={{
                display: "grid",
                gridTemplateColumns: "1fr 240px",
                gap: 24,
                alignItems: "center",
                padding: "20px 24px",
                background: "var(--bg)",
                border: "1px solid var(--border)",
                borderRadius: 12,
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

        {/* 10 — Chip tones (demo grid) */}
        <Slide id="chips" index={10} total={SLIDES.length} align="start">
          <Eyebrow>Chip tones</Eyebrow>
          <SlideTitle>Six tones for inline emphasis.</SlideTitle>
          <div style={{
            marginTop: 40,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 12,
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
                borderRadius: 12,
                padding: 20,
                display: "flex",
                flexDirection: "column",
                gap: 12,
                alignItems: "flex-start",
              }}>
                <InlineChip label={c.label} tone={c.tone} scale="match" />
                <p style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-mono)",
                  color: "var(--muted)",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  margin: 0,
                }}>
                  {c.tone}
                </p>
              </div>
            ))}
          </div>
        </Slide>

        {/* 11 — Pull quote */}
        <Slide id="quote" index={11} total={SLIDES.length} tint="warm">
          <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "left" }}>
            <Eyebrow>Planning</Eyebrow>
            <blockquote style={{
              margin: 0,
              borderLeft: "2px solid var(--accent-warm)",
              paddingLeft: 24,
              fontFamily: "var(--font-body)",
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 300,
              lineHeight: 1.2,
              letterSpacing: "-0.025em",
              color: "var(--text)",
              fontStyle: "italic",
            }}>
              The plan is the artifact.<br />
              The code follows.
            </blockquote>
            <p style={{
              marginTop: 24,
              marginLeft: 26,
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-eyebrow)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--muted)",
            }}>
              Working principle · Claude Code plan mode
            </p>
          </div>
        </Slide>

        {/* 12 — Closer */}
        <Slide id="closer" index={12} total={SLIDES.length}>
          <Eyebrow>End of deck</Eyebrow>
          <SlideTitle size="xl">
            Don’t just design interfaces.
            <br />
            Design the system behind them.
          </SlideTitle>
          <div style={{
            marginTop: 56,
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
          }}>
            <Link href="/system" style={{ textDecoration: "none" }}>
              <Button variant="inline">Read as article →</Button>
            </Link>
            <Link href="/" style={{ textDecoration: "none" }}>
              <Button variant="tag">Back to portfolio</Button>
            </Link>
          </div>
        </Slide>
      </main>
    </>
  );
}
