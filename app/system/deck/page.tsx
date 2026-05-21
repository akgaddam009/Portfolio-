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
  { id: "intro",      label: "Introduction" },
  { id: "why",        label: "Why this exists" },
  { id: "philosophy", label: "Four principles" },
  { id: "workflow",   label: "AI workflow" },
  { id: "tokens",     label: "Tokens" },
  { id: "without",    label: "Without tokens" },
  { id: "with",       label: "With tokens" },
  { id: "buttons",    label: "Buttons" },
  { id: "chips",      label: "Chip tones" },
] as const;

type SlideId = typeof SLIDES[number]["id"];

/* Grouped TOC structure — mirrors the article sidebar at
   app/system/page.tsx:19. Group headers are mono caps, items are
   body-font with a sliding left border for active state. */
const TOC_GROUPS = [
  {
    group: "About",
    items: [
      { id: "intro",      label: "Introduction" },
      { id: "why",        label: "Why this exists" },
    ],
  },
  {
    group: "Principles",
    items: [
      { id: "philosophy", label: "Four principles" },
      { id: "workflow",   label: "AI workflow" },
    ],
  },
  {
    group: "Tokens",
    items: [
      { id: "tokens",     label: "Tokens" },
      { id: "without",    label: "Without tokens" },
      { id: "with",       label: "With tokens" },
    ],
  },
  {
    group: "Components",
    items: [
      { id: "buttons",    label: "Buttons" },
      { id: "chips",      label: "Chip tones" },
    ],
  },
] as const;

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
}: {
  id: SlideId;
  isActive: boolean;
  tint?: "warm" | "surface";
  children: React.ReactNode;
  background?: React.ReactNode;
}) {
  // All slides top-align their content for consistency. Vertical centering
  // on sparse slides left big dead bands of empty space top + bottom; the
  // hop between centered and top-aligned slides read as a layout bug.
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
        // Presentation centering: vertical + horizontal. Content block sits
        // dead-center of the panel. Text inside the block stays left-aligned
        // so paragraphs read naturally.
        justifyContent: "center",
        alignItems: "center",
        minHeight: "calc(100vh - 88px)",
      }}
    >
      {background}
      <div style={{
        position: "relative",
        zIndex: 1,
        width: "100%",
        maxWidth: 880,
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
      <nav style={{ flex: 1 }}>
        {TOC_GROUPS.map((group, gi) => (
          <div key={group.group} style={{ marginBottom: gi < TOC_GROUPS.length - 1 ? "24px" : 0 }}>
            <p style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-mono)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--text)",
              fontWeight: 500,
              margin: 0,
              marginBottom: "10px",
            }}>
              {group.group}
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {group.items.map(item => {
                const isActive = item.id === active;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => onJump(item.id as SlideId)}
                      className="deck-rail-link"
                      data-active={isActive}
                      style={{
                        display: "block",
                        width: "100%",
                        textAlign: "left",
                        // Pill treatment — active gets a filled --surface2
                        // background, hover gets --hover; no left border.
                        padding: "8px 12px",
                        borderRadius: "var(--radius-sm)",
                        fontFamily: "var(--font-body)",
                        fontSize: "var(--text-body)",
                        color: isActive ? "var(--text)" : "var(--muted)",
                        fontWeight: isActive ? 500 : 400,
                        background: isActive ? "var(--surface2)" : "transparent",
                        border: "none",
                        cursor: "pointer",
                        lineHeight: 1.4,
                        letterSpacing: "-0.005em",
                        transition: "color 180ms var(--ease-expo), background 180ms var(--ease-expo)",
                      }}
                    >
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Rail footer — balances the tall card by anchoring something
          at the bottom. Slide counter + progress + escape hatch back
          to the long-form article. Pushes to the bottom via the
          flex: 1 on the nav above. */}
      <div style={{
        marginTop: "var(--space-7)",
        paddingTop: "var(--space-5)",
        borderTop: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-3)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
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
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-eyebrow)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--muted)",
          margin: 0,
        }}>
          ↑↓ to jump · scroll snaps
        </p>
      </div>
    </aside>
  );
}

/* =========================================================================
   PAGE
   ========================================================================= */

export default function DesignSystemDeck() {
  const [active, setActive] = useState<SlideId>("intro");
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  const nextCaseStudy = caseStudies.find(c => c.slug === NEXT_AFTER_DECK_ORDER[0]);

  // Scroll-spy. Tracks visible slides with their intersection ratio in a
  // Map and picks the highest-ratio one as the active slide. Avoids the
  // bug where `entries.forEach(setActive)` lets the last-fired entry win,
  // which made the rail lag behind the actual current slide.
  useEffect(() => {
    const els = SLIDES.map(s => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    if (els.length === 0) return;
    const visible = new Map<string, number>();
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) visible.set(e.target.id, e.intersectionRatio);
          else visible.delete(e.target.id);
        });
        if (visible.size > 0) {
          const top = [...visible.entries()].sort((a, b) => b[1] - a[1])[0][0];
          setActive(top as SlideId);
        }
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1], rootMargin: "-25% 0px -25% 0px" }
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

  // Wheel hijack dropped — CSS scroll-snap: y proximity (set in styles
  // below) gives a smoother, browser-native snap behaviour. Users scroll
  // freely; the browser eases to the nearest panel when scroll settles.
  // Keyboard arrows still jump via the handler above. No JS-driven
  // smooth-scroll fighting native wheel input = no glitch.

  return (
    <>
      <style jsx global>{`
        .deck-page {
          background: var(--chrome);
          min-height: 100vh;
        }
        /* CSS scroll-snap — proximity mode lets users scroll freely and
           softly eases to the nearest panel when the gesture ends. No
           browser-vs-JS fight, no cooldown timer. Disabled under
           reduced-motion (native handling). */
        html { scroll-snap-type: y proximity; scroll-padding-top: 80px; }
        @media (prefers-reduced-motion: reduce) {
          html { scroll-snap-type: none; }
        }
        .deck-panel, .deck-hero-panel { scroll-snap-align: start; }
        /* Container spacing mirrors the landing page rhythm:
           - paddingTop 80px = 72px header clearance + 8px top breathing
             (landing has paddingTop 72 on main + padding-top 8 on the
             container at app/page.tsx:3502 + :3516 — same cumulative 80px)
           - paddingBottom 16px (matches landing :3516 bottom)
           - 24px sides (matches landing's left gutter, applied both sides
             since vertical layouts can't go asymmetric like horizontal scroll)
           - 16px inter-panel gap (matches landing :3512). */
        .deck-grid {
          margin: 0;
          padding: 80px 24px 16px;
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 16px;
          align-items: start;
        }
        /* Rail panel — full-stretch matching the slide panels. Same
           landing card shell (--bg + --radius-lg + shadow tiers) so it
           reads as a sibling of the right-side content panels, not a
           floating flyer above them. Height locked to calc(100vh - 88px)
           and sticky so it stays in view while content scrolls. */
        .deck-rail {
          position: sticky;
          /* 80px matches the grid's padding-top so the gap between the
             top bar's bottom edge (72px) and the rail top stays a
             consistent 8px whether the page is at scroll 0 or scrolled
             past. Was 72px, which made the rail butt against the top
             bar once scrolled — that's the spacing the user flagged. */
          top: 80px;
          align-self: start;
          background: var(--bg);
          border-radius: var(--radius-lg);
          padding: var(--space-7);
          min-height: calc(100vh - 96px);
          box-shadow: ${PANEL_SHADOW_LIGHT};
          display: flex;
          flex-direction: column;
        }
        [data-theme="dark"] .deck-rail {
          box-shadow: ${PANEL_SHADOW_DARK};
        }
        /* Rail item — Vercel-menu pill. Active = --surface2 fill, hover
           on inactive = --hover. Active state isn't double-signalled. */
        .deck-rail-link:hover {
          color: var(--text) !important;
        }
        .deck-rail-link:not([data-active="true"]):hover {
          background: var(--hover) !important;
        }
        /* Slide panels — landing's shadow tiers (active vs rest) plus
           the dark-mode dim-and-engage behaviour. Light mode never dims;
           dark mode fades inactive panels to 0.6 and engages back to 1
           on hover or active. scroll-margin-top leaves room for the
           fixed top bar (~72px) so scrollIntoView lands the slide below
           it instead of behind it — fixes the "scrolls past, snaps back"
           glitch when jumping with the wheel handler. */
        .deck-panel { box-shadow: ${PANEL_SHADOW_LIGHT}; transition: box-shadow var(--dur-base) var(--ease-expo), opacity var(--dur-base) var(--ease-expo); scroll-margin-top: 72px; }
        .deck-panel.is-active { box-shadow: ${PANEL_SHADOW_ACTIVE_LIGHT}; }
        [data-theme="dark"] .deck-panel { box-shadow: ${PANEL_SHADOW_DARK}; opacity: 0.6; }
        [data-theme="dark"] .deck-panel.is-active,
        [data-theme="dark"] .deck-panel:hover { opacity: 1; box-shadow: ${PANEL_SHADOW_ACTIVE_DARK}; }
        /* Slide stack uses the same 16px gap as the landing panel rail
           so the vertical rhythm matches the horizontal one. */
        .deck-content {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        /* Mobile: single column, rail above content, same 16px gap.
           Rail card on mobile drops the viewport-height stretch and
           the sticky positioning. Inner grids collapse to a single
           column so cards stay readable at narrow widths. Slide panel
           padding tightens to leave more room for content. */
        @media (max-width: 1023px) {
          .deck-grid {
            grid-template-columns: 1fr;
            /* Mobile top: 72px (one step below desktop's 80px). 16px
               sides + bottom match the landing rhythm. */
            padding: 72px 16px 16px;
            gap: 16px;
          }
          .deck-rail {
            position: relative;
            top: auto;
            min-height: 0;
            padding: var(--space-5) var(--space-6);
          }
          .deck-panel {
            min-height: 80vh;
            padding: var(--space-6) var(--space-5);
          }
          /* All inner grids inside slide panels collapse to a single
             column on mobile. Keeps card widths comfortable, prevents
             squashed cells. */
          .deck-panel [style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
          /* Buttons demo row stacks (label above, button below) instead
             of side-by-side 1fr 220px which crushes the label. */
          .deck-panel-buttons-row {
            grid-template-columns: 1fr !important;
            gap: var(--space-3) !important;
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

        {nextCaseStudy && (
          <Link
            href={`/work/${nextCaseStudy.slug}`}
            aria-label={`Next case study: ${nextCaseStudy.title}`}
            style={{
              fontFamily: "var(--font-mono)", fontSize: "var(--text-mono)", fontWeight: 400,
              letterSpacing: "0.08em", textTransform: "uppercase",
              color: "var(--muted)",
              padding: "8px 12px", minHeight: "var(--space-8)", borderRadius: "8px",
              border: "1px solid var(--border)", background: "var(--surface)",
              display: "inline-flex", alignItems: "center", gap: "6px",
              transition: "color 0.18s, border-color 0.18s, background 0.18s, box-shadow 0.18s",
              textDecoration: "none",
            }}
            onMouseEnter={e => { e.currentTarget.style.color = "var(--text)"; e.currentTarget.style.background = "var(--surface2)"; e.currentTarget.style.boxShadow = "var(--card-shadow)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "var(--muted)"; e.currentTarget.style.background = "var(--surface)"; e.currentTarget.style.boxShadow = "none"; }}
          >
            Next case study
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M4 11h12.17l-5.59-5.59L12 4l8 8-8 8-1.41-1.41L16.17 13H4v-2z"/>
            </svg>
          </Link>
        )}
      </motion.header>

      <div className="deck-page">
        <div className="deck-grid">
          <RailPanel active={active} onJump={jumpTo} />

          <main className="deck-content">

            {/* Hero header panel — mirrors the case-study-detail page hero
                (CaseStudyDetail.tsx:413). Tags + title + subtitle sit in
                their own panel before the deck slides start. Reads as
                "this is what this page is about" before the visitor
                begins the deck proper. */}
            <motion.section
              className="deck-hero-panel"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: EASE }}
              style={{
                background: "var(--bg)",
                borderRadius: "var(--radius-lg)",
                boxShadow: PANEL_SHADOW_LIGHT,
                padding: "var(--space-7)",
                minHeight: "calc(100vh - 96px)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Signature ASCII ripple — moved here from the removed
                  cover slide so the hero keeps the textured background. */}
              <AsciiWater opacity={0.4} fontSize={13} damping={0.982} />
              <div style={{ width: "100%", maxWidth: 880, position: "relative", zIndex: 1 }}>
                {/* Tags row — same chip pattern as case study hero
                    (CaseStudyDetail.tsx:442). */}
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
                  {["Design system", "Portfolio", "Internal tool"].map(tag => (
                    <span key={tag} style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "var(--text-eyebrow)",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      padding: "4px 8px",
                      background: "var(--surface2)",
                      color: "var(--muted2)",
                      borderRadius: "6px",
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>

                <h1 style={{
                  fontFamily: "var(--font-body)",
                  // 35% reduction from clamp(32px, 5vw, 56px) → settles
                  // around 21–36px so the hero headline doesn't dominate
                  // the panel and matches the article's hero scale.
                  fontSize: "clamp(21px, 3.25vw, 36px)",
                  fontWeight: 300,
                  lineHeight: 1.15,
                  letterSpacing: "-0.025em",
                  color: "var(--text)",
                  margin: 0,
                  marginBottom: "16px",
                }}>
                  Planned with{" "}
                  <InlineChip label="Claude AI" tone="indigo" scale="match" />.<br />
                  Built with{" "}
                  <InlineChip label="Claude Code" tone="violet" scale="match" />.
                </h1>

                <p style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-body-lg)",
                  lineHeight: 1.65,
                  color: "var(--muted)",
                  maxWidth: 520,
                  margin: 0,
                  marginBottom: "32px",
                }}>
                  An opinionated, token-driven design system maintained as code.
                  No Figma file. The site you’re looking at is the documentation.
                </p>

                {/* Role / Stack / Year meta grid — case study detail
                    pattern (CaseStudyDetail.tsx:463). */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                  gap: "16px",
                  alignItems: "start",
                  maxWidth: 640,
                }}>
                  {[
                    { label: "Role",     value: "Design + build" },
                    { label: "Stack",    value: "Next.js · Tailwind · CSS vars" },
                    { label: "Workflow", value: "Claude AI + Code" },
                  ].map(item => (
                    <div key={item.label} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <p style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "var(--text-eyebrow)",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "var(--muted)",
                        margin: 0,
                      }}>
                        {item.label}
                      </p>
                      <p style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "var(--text-body)",
                        fontWeight: 400,
                        color: "var(--text)",
                        lineHeight: 1.4,
                        margin: 0,
                      }}>
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>

            {/* 01 — Introduction */}
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
            <SlidePanel id="philosophy" isActive={active === "philosophy"}>
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
            <SlidePanel id="workflow" isActive={active === "workflow"} tint="surface">
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
            <SlidePanel id="tokens" isActive={active === "tokens"}>
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
            <SlidePanel id="without" isActive={active === "without"} tint="warm">
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
            <SlidePanel id="with" isActive={active === "with"}>
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
            <SlidePanel id="buttons" isActive={active === "buttons"} tint="surface">
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
                  <div key={row.variant} className="deck-panel-buttons-row" style={{
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
            <SlidePanel id="chips" isActive={active === "chips"}>
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

          </main>
        </div>
      </div>
    </>
  );
}
