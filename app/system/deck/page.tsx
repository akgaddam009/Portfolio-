"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { InlineChip } from "@/components/ui/InlineChip";
import AsciiWater from "@/components/AsciiWater";
import { PaintedLadyMark, PaintedLadySpecimen } from "@/components/PaintedLady";
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

/* Narrative architecture — the deck is organized as seven chapters
   modelled on the cocoon → wings transformation. The metaphor lives in
   the pacing and structure, not in literal butterflies. */
const SLIDES = [
  // I — The Struggle Before Systems
  { id: "intro",       label: "Opening" },
  { id: "origin",      label: "The cocoon" },
  // II — Chaos Scales Faster Than Consistency
  { id: "why",         label: "Drift" },
  { id: "without",     label: "Without foundations" },
  // III — Inside the Cocoon
  { id: "tokens",      label: "Foundations" },
  { id: "specimen",    label: "Specimen" },
  { id: "palette",     label: "Palette" },
  // IV — Constraints Create Strength
  { id: "philosophy",  label: "Four constraints" },
  { id: "workflow",    label: "The loop" },
  // V — Building the Wings
  { id: "with",        label: "With foundations" },
  { id: "buttons",     label: "Buttons" },
  { id: "chips",       label: "Chip tones" },
  // VI — A System Designed to Fly
  { id: "responsive",  label: "Breakpoints" },
  { id: "navigation",  label: "Navigation" },
  { id: "grids",       label: "Grids" },
  // VII — Beyond Components
  { id: "splash",      label: "Closing" },
] as const;

type SlideId = typeof SLIDES[number]["id"];

/* Chapter index — the spine of the deck. Each chapter has a Roman
   numeral, an editorial title, and a firstSlide pointer used to render
   the chapter heading on that slide. */
const CHAPTERS = [
  { numeral: "I",   title: "The Struggle Before Systems",          firstSlide: "intro"      },
  { numeral: "II",  title: "Chaos Scales Faster Than Consistency", firstSlide: "why"        },
  { numeral: "III", title: "Inside the Cocoon",                    firstSlide: "tokens"     },
  { numeral: "IV",  title: "Constraints Create Strength",          firstSlide: "philosophy" },
  { numeral: "V",   title: "Building the Wings",                   firstSlide: "with"       },
  { numeral: "VI",  title: "A System Designed to Fly",             firstSlide: "responsive" },
  { numeral: "VII", title: "Beyond Components",                    firstSlide: "splash"     },
] as const;

/* TOC structure mirrors the chapter spine. Group headers carry the
   Roman numeral; the chapter title sits underneath as a soft second
   line so long titles don't have to wrap into a single mono line. */
const TOC_GROUPS = [
  { group: "I",   subtitle: "The Struggle Before Systems",          items: [
    { id: "intro",   label: "Opening" },
    { id: "origin",  label: "The cocoon" },
  ]},
  { group: "II",  subtitle: "Chaos Scales Faster Than Consistency", items: [
    { id: "why",     label: "Drift" },
    { id: "without", label: "Without foundations" },
  ]},
  { group: "III", subtitle: "Inside the Cocoon",                    items: [
    { id: "tokens",   label: "Foundations" },
    { id: "specimen", label: "Specimen" },
    { id: "palette",  label: "Palette" },
  ]},
  { group: "IV",  subtitle: "Constraints Create Strength",          items: [
    { id: "philosophy", label: "Four constraints" },
    { id: "workflow",   label: "The loop" },
  ]},
  { group: "V",   subtitle: "Building the Wings",                   items: [
    { id: "with",    label: "With foundations" },
    { id: "buttons", label: "Buttons" },
    { id: "chips",   label: "Chip tones" },
  ]},
  { group: "VI",  subtitle: "A System Designed to Fly",             items: [
    { id: "responsive", label: "Breakpoints" },
    { id: "navigation", label: "Navigation" },
    { id: "grids",      label: "Grids" },
  ]},
  { group: "VII", subtitle: "Beyond Components",                    items: [
    { id: "splash", label: "Closing" },
  ]},
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

/* ChapterHeading — prepended above the eyebrow on the first slide of
   each narrative chapter. Two restrained lines (numeral + title) over
   a hairline rule. Reads as a chapter card in a book, not a header
   banner. Intentionally quiet — the chapter does the heavy lifting,
   not the label. */
function ChapterHeading({
  numeral,
  title,
}: {
  numeral: string;
  title: string;
}) {
  return (
    <div style={{
      marginBottom: "var(--space-9)",
      paddingBottom: "var(--space-5)",
      borderBottom: "1px solid var(--border)",
      maxWidth: 560,
    }}>
      <p style={{
        fontFamily: "var(--font-mono)",
        fontSize: "var(--text-mono)",
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: "var(--muted)",
        margin: 0,
        marginBottom: "var(--space-3)",
      }}>
        Chapter {numeral}
      </p>
      <p style={{
        fontFamily: "var(--font-body)",
        fontSize: "var(--text-title-sm)",
        lineHeight: 1.35,
        letterSpacing: "-0.005em",
        color: "var(--muted2)",
        margin: 0,
      }}>
        {title}
      </p>
    </div>
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

/* HeroSlide — "signature moment" panel. Strips the card chrome
   (--bg + radius + shadow) and lets content stage on the canvas
   itself. Used for the 3 unforgettable frames: opening manifesto,
   token wall, breakpoint diorama. Same min-height + scroll-snap as
   regular slides so the rhythm stays. */
function HeroSlide({
  id,
  isActive,
  children,
  background,
  align = "center",
}: {
  id: SlideId;
  isActive: boolean;
  children: React.ReactNode;
  background?: React.ReactNode;
  align?: "center" | "start";
}) {
  const reduced = useReducedMotion();
  return (
    <motion.section
      id={id}
      data-slide={id}
      className={isActive ? "deck-panel deck-hero is-active" : "deck-panel deck-hero"}
      initial={reduced ? false : { opacity: 0, y: 16 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: EASE }}
      style={{
        background: "var(--chrome)",
        borderRadius: 0,
        padding: "var(--space-11) var(--space-9)",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: align === "center" ? "center" : "flex-start",
        alignItems: "center",
        minHeight: "calc(100vh - 88px)",
        boxShadow: "none",
      }}
    >
      {background}
      <div style={{
        position: "relative",
        zIndex: 1,
        width: "100%",
      }}>
        {children}
      </div>
    </motion.section>
  );
}

/* BreakpointDiorama — one oversized device frame that morphs between the
   three breakpoints. Auto-cycles every 2.4s; users can click a step button
   to lock a specific size. Pixel number sits next to the frame as a
   co-equal display element. */
function BreakpointDiorama() {
  const STEPS = [
    { id: "mobile",  label: "Mobile",  px: 390,  rangeLabel: "≤ 640px",   render: "stack" as const },
    { id: "tablet",  label: "Tablet",  px: 768,  rangeLabel: "641–1023",  render: "stack-wide" as const },
    { id: "desktop", label: "Desktop", px: 1280, rangeLabel: "≥ 1024px",  render: "split" as const },
  ];
  const [active, setActive] = useState(0);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    if (locked) return;
    const id = setInterval(() => setActive(a => (a + 1) % STEPS.length), 2400);
    return () => clearInterval(id);
  }, [locked, STEPS.length]);

  const step = STEPS[active];
  // Visual width clamps the device proportional to the slide stage but
  // keeps the "390 vs 1280" feel visible.
  const widthPct = step.id === "mobile" ? 18 : step.id === "tablet" ? 38 : 72;

  return (
    <div style={{ maxWidth: 1240, margin: "0 auto", width: "100%" }}>
      <p style={{
        fontFamily: "var(--font-mono)",
        fontSize: "var(--text-mono)",
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: "var(--muted2)",
        margin: 0,
        marginBottom: "var(--space-9)",
      }}>
        08 · Responsive diorama
      </p>

      <div style={{
        display: "grid",
        gridTemplateColumns: "minmax(280px, 1fr) 2.4fr",
        gap: "var(--space-11)",
        alignItems: "center",
      }}>
        {/* Left: editorial copy + pixel number */}
        <div>
          <h2 style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(36px, 5vw, 64px)",
            fontWeight: 300,
            lineHeight: 1.02,
            letterSpacing: "-0.035em",
            color: "var(--text)",
            margin: 0,
            marginBottom: "var(--space-7)",
          }}>
            Three breakpoints.<br />
            One system.
          </h2>
          <div style={{
            fontFamily: "var(--font-mono)",
            fontSize: "clamp(56px, 8vw, 120px)",
            fontWeight: 400,
            lineHeight: 1,
            letterSpacing: "-0.04em",
            color: "var(--accent-warm)",
            marginBottom: "var(--space-4)",
            fontVariantNumeric: "tabular-nums",
          }}>
            {step.px}
            <span style={{ fontSize: "0.45em", color: "var(--muted)", marginLeft: 8 }}>px</span>
          </div>
          <p style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-mono-lg)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--muted2)",
            margin: 0,
            marginBottom: "var(--space-7)",
          }}>
            {step.label} · {step.rangeLabel}
          </p>

          {/* Step buttons — click to lock */}
          <div style={{ display: "flex", gap: 6 }}>
            {STEPS.map((s, i) => (
              <button
                key={s.id}
                onClick={() => { setActive(i); setLocked(true); }}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-mono)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: i === active ? "1px solid var(--text)" : "1px solid var(--border)",
                  background: i === active ? "var(--surface)" : "transparent",
                  color: i === active ? "var(--text)" : "var(--muted)",
                  cursor: "pointer",
                  transition: "all 180ms var(--ease-expo)",
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right: morphing device frame */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 420,
        }}>
          <motion.div
            animate={{
              width: `${widthPct}%`,
            }}
            transition={{ duration: 0.6, ease: EASE }}
            style={{
              aspectRatio: step.id === "mobile" ? "9/16" : step.id === "tablet" ? "3/4" : "16/10",
              background: "var(--bg)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              padding: 12,
              boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
              display: "flex",
              flexDirection: step.render === "split" ? "row" : "column",
              gap: 8,
              overflow: "hidden",
            }}
          >
            {step.render === "split" ? (
              <>
                <div style={{
                  width: "20%",
                  background: "var(--surface2)",
                  borderRadius: 6,
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  padding: 10,
                }}>
                  {[1,2,3,4,5].map(i => (
                    <div key={i} style={{ height: 6, background: "var(--border)", borderRadius: 3, width: i % 2 ? "100%" : "70%" }} />
                  ))}
                </div>
                <div style={{
                  flex: 1,
                  background: "var(--surface2)",
                  borderRadius: 6,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  padding: 16,
                }}>
                  <div style={{ height: 12, background: "var(--border)", borderRadius: 4, width: "60%" }} />
                  <div style={{ height: 8, background: "var(--border)", borderRadius: 4, opacity: 0.6 }} />
                  <div style={{ height: 8, background: "var(--border)", borderRadius: 4, opacity: 0.6, width: "85%" }} />
                  <div style={{ flex: 1, background: "var(--bg)", borderRadius: 4, marginTop: 8, border: "1px solid var(--border)" }} />
                </div>
              </>
            ) : step.render === "stack-wide" ? (
              <>
                <div style={{
                  height: 28,
                  background: "var(--surface2)",
                  borderRadius: 6,
                  display: "flex",
                  alignItems: "center",
                  padding: "0 10px",
                  gap: 6,
                }}>
                  <div style={{ width: 14, height: 14, background: "var(--border)", borderRadius: 3 }} />
                  <div style={{ width: 14, height: 14, background: "var(--border)", borderRadius: 3 }} />
                </div>
                <div style={{
                  flex: 1,
                  background: "var(--surface2)",
                  borderRadius: 6,
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  padding: 14,
                }}>
                  <div style={{ height: 10, background: "var(--border)", borderRadius: 4, width: "70%" }} />
                  <div style={{ height: 6, background: "var(--border)", borderRadius: 4, opacity: 0.5 }} />
                  <div style={{ flex: 1, background: "var(--bg)", borderRadius: 4, marginTop: 6, border: "1px solid var(--border)" }} />
                </div>
              </>
            ) : (
              <>
                <div style={{
                  height: 18,
                  background: "var(--surface2)",
                  borderRadius: 4,
                  display: "flex",
                  alignItems: "center",
                  padding: "0 6px",
                  gap: 4,
                }}>
                  <div style={{ width: 8, height: 8, background: "var(--border)", borderRadius: 2 }} />
                </div>
                <div style={{ height: 8, background: "var(--surface2)", borderRadius: 3 }} />
                <div style={{
                  flex: 1,
                  background: "var(--surface2)",
                  borderRadius: 4,
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                  padding: 8,
                }}>
                  <div style={{ height: 8, background: "var(--border)", borderRadius: 3, width: "80%" }} />
                  <div style={{ height: 4, background: "var(--border)", borderRadius: 2, opacity: 0.5 }} />
                  <div style={{ flex: 1, background: "var(--bg)", borderRadius: 3, marginTop: 4, border: "1px solid var(--border)" }} />
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
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
          <div key={group.group} style={{ marginBottom: gi < TOC_GROUPS.length - 1 ? "28px" : 0 }}>
            {/* Chapter heading — two lines: Roman numeral in mono caps
                over a soft body-font subtitle. Lets long chapter titles
                breathe without forcing them into a single mono row. */}
            <p style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-mono)",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "var(--muted)",
              margin: 0,
              marginBottom: 2,
            }}>
              {group.group}
            </p>
            <p style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-caption)",
              lineHeight: 1.3,
              letterSpacing: "-0.005em",
              color: "var(--text)",
              fontWeight: 500,
              margin: 0,
              marginBottom: "10px",
            }}>
              {group.subtitle}
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
        /* Hero slides override the panel chrome — no shadow, no card.
           The canvas IS the stage. Active opacity dim still applies in
           dark mode so the rhythm carries through. */
        .deck-hero, .deck-hero.is-active { box-shadow: none !important; }
        [data-theme="dark"] .deck-hero { box-shadow: none !important; }
        [data-theme="dark"] .deck-hero.is-active,
        [data-theme="dark"] .deck-hero:hover { box-shadow: none !important; }

        /* Palette grid — each row is its own flex container, so the
           grid math is local and we avoid the auto-placement zigzag.
           Desktop: 4 columns in one line. Narrow: swatch + zone on the
           first line, meta on the second, role on the third. */
        .palette-row {
          display: grid;
          grid-template-columns: auto 1.3fr 2fr;
          column-gap: var(--space-7);
          align-items: center;
        }
        @media (max-width: 900px) {
          .palette-row {
            grid-template-columns: auto 1fr;
            row-gap: var(--space-3);
          }
          .palette-row .palette-role {
            grid-column: 1 / 3;
          }
        }
        @media (max-width: 480px) {
          .palette-row { row-gap: var(--space-2); }
        }

        /* Token table — minimal flat chips. 4 cols desktop / 2 tablet.
           Each cell: a short swatch bar + clean label row underneath.
           No hover lift, no blurs — just the color and its name. */
        .token-table {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          overflow: hidden;
          width: 100%;
        }
        .token-cell {
          border-right: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
        }
        .token-cell:nth-child(4n)       { border-right: none; }
        .token-cell:nth-last-child(-n+4) { border-bottom: none; }
        .token-swatch-bar {
          height: 72px;
          width: 100%;
          display: block;
        }
        .token-cell-label {
          padding: 10px 14px 12px;
          border-top: 1px solid var(--border);
          background: var(--bg);
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        @media (max-width: 1023px) {
          .token-table { grid-template-columns: repeat(4, 1fr); }
          .token-cell:nth-child(4n) { border-right: none; }
          .token-cell:nth-last-child(-n+4) { border-bottom: none; }
        }
        @media (max-width: 640px) {
          .token-table { grid-template-columns: repeat(2, 1fr); }
          .token-cell:nth-child(4n)        { border-right: 1px solid var(--border); }
          .token-cell:nth-last-child(-n+4) { border-bottom: 1px solid var(--border); }
          .token-cell:nth-child(2n)        { border-right: none; }
          .token-cell:nth-last-child(-n+2) { border-bottom: none; }
          .token-swatch-bar { height: 56px; }
        }
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

            {/* 01 — Introduction — HERO MANIFESTO. Full canvas. Single
                sentence at display-manifesto scale (clamp 56-96). Tiny
                structural label above; one supporting line below. The
                composition is the moment; no card, no shadow, no clutter. */}
            <HeroSlide id="intro" isActive={active === "intro"} align="start">
              <div style={{ maxWidth: 1100, margin: "0 auto", width: "100%" }}>
                <ChapterHeading numeral="I" title="The Struggle Before Systems" />
                <h2 style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "clamp(48px, 7vw, 96px)",
                  fontWeight: 300,
                  lineHeight: 1.02,
                  letterSpacing: "-0.04em",
                  color: "var(--text)",
                  margin: 0,
                  marginBottom: "var(--space-10)",
                  maxWidth: 980,
                }}>
                  A working artifact,<br />
                  not a deliverable.
                </h2>
                <p style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-lead)",
                  lineHeight: 1.6,
                  letterSpacing: "-0.005em",
                  color: "var(--muted)",
                  margin: 0,
                  maxWidth: 560,
                }}>
                  Most design systems are pictures of design systems. This
                  one is the design system. When the page renders, the
                  rules are correct — not because everyone agreed, but
                  because there is nowhere left for the rules to live.
                </p>
              </div>
            </HeroSlide>

            {/* 02 — Origin — manifesto chapter. The cocoon fable retold in
                first person as the philosophical foundation for why this
                system looks the way it does. Signature moment, HeroSlide,
                editorial typography, no card chrome. */}
            <HeroSlide id="origin" isActive={active === "origin"} align="start">
              <div style={{ maxWidth: 720, margin: "0 auto" }}>
                <p style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-mono)",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--muted2)",
                  margin: 0,
                  marginBottom: "var(--space-7)",
                }}>
                  The cocoon
                </p>
                <h2 style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "clamp(40px, 5.6vw, 72px)",
                  fontWeight: 300,
                  lineHeight: 1.05,
                  letterSpacing: "-0.035em",
                  color: "var(--text)",
                  margin: 0,
                  marginBottom: "var(--space-10)",
                }}>
                  The struggle is the system.
                </h2>

                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--space-5)",
                }}>
                  <p style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--text-title-sm)",
                    lineHeight: 1.7,
                    letterSpacing: "-0.005em",
                    color: "var(--muted2)",
                    margin: 0,
                  }}>
                    A man once cut open a cocoon to help the butterfly escape.
                    The butterfly emerged easily — but its wings stayed shriveled,
                    its body swollen. It never flew. The pressure of breaking
                    out was the fluid the wings needed.
                  </p>
                  <p style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--text-title-sm)",
                    lineHeight: 1.7,
                    letterSpacing: "-0.005em",
                    color: "var(--muted)",
                    margin: 0,
                  }}>
                    I learned design without a degree, without a mentor, without
                    a Figma file handed down. Every component on this site is the
                    result of struggling through the wrong abstraction before
                    finding the right one. Every token is a hex I chose four
                    times before settling. The discipline you see here isn’t
                    preference — it’s what the work left behind.
                  </p>
                  <p style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--text-title-sm)",
                    fontWeight: 500,
                    lineHeight: 1.5,
                    letterSpacing: "-0.01em",
                    color: "var(--text)",
                    margin: 0,
                    marginTop: "var(--space-4)",
                  }}>
                    If I had been shown the answer, the wings would have stayed soft.
                  </p>
                </div>
              </div>
            </HeroSlide>

            {/* Chapter II opener — diagnostic of unbounded scale. */}
            <SlidePanel id="why" isActive={active === "why"} tint="surface">
              <ChapterHeading numeral="II" title="Chaos Scales Faster Than Consistency" />
              <Eyebrow>Drift</Eyebrow>
              <SlideTitle weight="manifesto">Speed makes copies, not systems.</SlideTitle>
              <Lead>
                Three rebuilds in, the same gray was hex-coded four different ways.
                Spacing wandered. The problem wasn’t carelessness — it was the absence
                of a single source. Drift isn’t a failure of attention. It’s what
                happens when nothing is bound.
              </Lead>
            </SlidePanel>

            {/* Without foundations — the cost of unbounded scale, rendered
                in code. Closes out Chapter II. */}
            <SlidePanel id="without" isActive={active === "without"} tint="warm">
              <Eyebrow>Without foundations</Eyebrow>
              <SlideTitle>Each pixel a private decision.</SlideTitle>
              <Lead max={520}>
                Every value is independent. A theme change is a search-and-replace.
                The system bends to whoever wrote the last line.
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

            {/* Chapter III opener — the token wall. The first visible
                structure of the system: a palette bound to a source. */}
            <HeroSlide id="tokens" isActive={active === "tokens"} align="start">
              <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%" }}>
                <ChapterHeading numeral="III" title="Inside the Cocoon" />
                <p style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-mono)",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--muted2)",
                  margin: 0,
                  marginBottom: "var(--space-5)",
                }}>
                  Foundations
                </p>
                <h2 style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "clamp(36px, 5.2vw, 64px)",
                  fontWeight: 300,
                  lineHeight: 1.05,
                  letterSpacing: "-0.035em",
                  color: "var(--text)",
                  margin: 0,
                  marginBottom: "var(--space-9)",
                  maxWidth: 720,
                }}>
                  The whole palette,<br />
                  one source.
                </h2>
                <div className="token-table">
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
                    <div key={s.token} className="token-cell">
                      <span
                        className="token-swatch-bar"
                        style={{ background: `var(${s.token})` }}
                      />
                      <div className="token-cell-label">
                        <span style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "var(--text-body-sm)",
                          fontWeight: 500,
                          letterSpacing: "-0.01em",
                          color: "var(--text)",
                        }}>{s.name}</span>
                        <code style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "var(--text-mono)",
                          color: "var(--muted)",
                          letterSpacing: "0.04em",
                        }}>{s.token}</code>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </HeroSlide>

            {/* Specimen — a quiet exhibit moment inside Chapter III. The
                plate sits at exhibit-drawer scale (not wall mural), framed
                with a brief museum-card caption. The metaphor is now
                annotation, not centerpiece. */}
            <SlidePanel id="specimen" isActive={active === "specimen"} tint="surface">
              <Eyebrow>Specimen</Eyebrow>
              <SlideTitle weight="manifesto">
                The foundations were not invented. They were sampled.
              </SlideTitle>
              <Lead max={560}>
                Five pigments earned a place in the system. One was kept
                in the drawer. The constraint is in what was left out.
              </Lead>

              <div style={{
                marginTop: "var(--space-9)",
                display: "grid",
                gridTemplateColumns: "minmax(280px, 420px) 1fr",
                columnGap: "var(--space-10)",
                rowGap: "var(--space-7)",
                alignItems: "center",
              }}>
                <div style={{
                  background: "var(--bg)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-md)",
                  padding: "var(--space-7) var(--space-5)",
                  display: "flex",
                  justifyContent: "center",
                }}>
                  <PaintedLadySpecimen width={360} showAnnotations={false} />
                </div>
                <div>
                  <p style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--text-mono)",
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: "var(--muted)",
                    margin: 0,
                    marginBottom: "var(--space-3)",
                  }}>
                    Plate · 01
                  </p>
                  <p style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--text-title-sm)",
                    lineHeight: 1.5,
                    color: "var(--text)",
                    margin: 0,
                    marginBottom: "var(--space-4)",
                    letterSpacing: "-0.005em",
                  }}>
                    Vanessa cardui
                  </p>
                  <p style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--text-body)",
                    lineHeight: 1.65,
                    color: "var(--muted)",
                    margin: 0,
                    maxWidth: 440,
                  }}>
                    A specimen whose pigments compose, by accident, the
                    same restricted set this system arrived at by years of
                    iteration. The match is what made it worth keeping.
                  </p>
                </div>
              </div>
            </SlidePanel>

            {/* Palette — Chapter III's quiet documentation slide. The wing
                metaphor is no longer labeled in the grid; the swatches
                speak for themselves. The reserved row stays as the
                system's only acknowledged absence. */}
            <SlidePanel id="palette" isActive={active === "palette"} tint="surface">
              <Eyebrow>Palette</Eyebrow>
              <SlideTitle>Five pigments. Five jobs.</SlideTitle>
              <Lead max={620}>
                Each color is bound to a role. The system uses a subset of
                what is available — not because more wouldn’t work, but
                because more wouldn’t help.
              </Lead>

              <div className="palette-grid" style={{ marginTop: "var(--space-9)", borderTop: "1px solid var(--border)" }}>
                {[
                  { swatch: "#d17b53", hex: "#D17B53", token: "--accent-warm", role: "Action · accent · the single chromatic note" },
                  { swatch: "#1d1d1f", hex: "#1D1D1F", token: "--text",        role: "Primary type · ink" },
                  { swatch: "#424245", hex: "#424245", token: "--muted2",      role: "Tertiary type · captions" },
                  { swatch: "#6e6e73", hex: "#6E6E73", token: "--muted",       role: "Secondary type · supporting prose" },
                  { swatch: "#ffffff", hex: "#FFFFFF", token: "--bg",          role: "Paper · the surface everything floats on" },
                  { swatch: "#f5e9d3", hex: "#F5E9D3", token: "—",             role: "Reserved · present in the drawer, absent from the system", reserved: true },
                ].map((row) => (
                  <div
                    key={row.hex}
                    className="palette-row"
                    style={{
                      padding: "var(--space-4) 0",
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    <div className="palette-swatch">
                      <span style={{
                        display: "inline-block",
                        width: 28,
                        height: 28,
                        background: row.swatch,
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius-sm)",
                        opacity: row.reserved ? 0.45 : 1,
                      }} />
                    </div>
                    <div className="palette-meta" style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "var(--text-mono-lg)",
                      letterSpacing: "0.08em",
                      color: row.reserved ? "var(--muted)" : "var(--muted2)",
                    }}>
                      <span>{row.hex}</span>
                      <span style={{ marginLeft: "var(--space-4)", color: "var(--muted)" }}>{row.token}</span>
                    </div>
                    <div className="palette-role" style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "var(--text-body)",
                      lineHeight: 1.5,
                      color: "var(--muted)",
                      fontStyle: row.reserved ? "italic" : "normal",
                    }}>
                      {row.role}
                    </div>
                  </div>
                ))}
              </div>
            </SlidePanel>

            {/* Chapter IV opener — the constraints that hold the system together. */}
            <SlidePanel id="philosophy" isActive={active === "philosophy"}>
              <ChapterHeading numeral="IV" title="Constraints Create Strength" />
              <Eyebrow>Four constraints</Eyebrow>
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

            {/* The loop — Chapter IV's working method. */}
            <SlidePanel id="workflow" isActive={active === "workflow"} tint="surface">
              <Eyebrow>The loop</Eyebrow>
              <SlideTitle>Plan in Claude AI. Build in Claude Code.</SlideTitle>
              <Lead>
                Two modes, one loop. The plan file is the contract between them —
                the constraint that keeps thinking and making honest with each other.
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

            {/* Chapter V opener — what the foundations afford. The same
                surface as 'without', rewritten in tokens. */}
            <SlidePanel id="with" isActive={active === "with"}>
              <ChapterHeading numeral="V" title="Building the Wings" />
              <Eyebrow>With foundations</Eyebrow>
              <SlideTitle>Every value a reference.</SlideTitle>
              <Lead max={520}>
                The same component, written against the system. A theme change is
                one variable redefinition. The constraints are no longer in the way —
                they hold the work up.
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

            {/* — Layout group ─────────────────────────────────────────── */}

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

            {/* Chapter VI opener — the system in motion. The diorama is
                the chapter's first image; the heading sits as marginalia
                in the top-left so the stage stays uncluttered. */}
            <HeroSlide id="responsive" isActive={active === "responsive"} align="start">
              <div style={{ width: "100%", maxWidth: 1200, margin: "0 auto" }}>
                <ChapterHeading numeral="VI" title="A System Designed to Fly" />
                <BreakpointDiorama />
              </div>
            </HeroSlide>

            {/* Top navigation — live preview of the actual nav. The pills
                use the exact same styles as the real header so what you
                see here is what every page renders at the top. */}
            <SlidePanel id="navigation" isActive={active === "navigation"} tint="surface">
              <Eyebrow>Navigation</Eyebrow>
              <SlideTitle>Floating pill chips, every page.</SlideTitle>
              <Lead>
                One nav pattern across home, case study, deck, and gate.
                Floating pills on a transparent bar. 8px from the viewport.
              </Lead>

              {/* Live nav preview inside a mini browser frame */}
              <div style={{
                marginTop: "var(--space-7)",
                background: "var(--bg)",
                border: "1px solid var(--border)",
                borderRadius: 10,
                overflow: "hidden",
                position: "relative",
                height: 220,
              }}>
                {/* Faux page content behind the nav */}
                <div style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(180deg, var(--bg) 0%, var(--surface2) 100%)",
                }} />
                {/* Real nav pills, scaled in */}
                <div style={{
                  position: "absolute",
                  top: 12, left: 16, right: 16,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}>
                  <div style={{ display: "flex", gap: 8 }}>
                    <span style={{
                      fontFamily: "var(--font-logo)",
                      fontSize: "var(--text-caption)",
                      fontWeight: 500,
                      color: "var(--text)",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      height: 36,
                      padding: "0 14px",
                      borderRadius: 10,
                      background: "var(--surface)",
                      boxShadow: "var(--card-shadow)",
                      display: "inline-flex",
                      alignItems: "center",
                    }}>
                      Arun Gaddam
                    </span>
                    <span style={{
                      height: 36, width: 36,
                      borderRadius: 10,
                      background: "var(--surface)",
                      boxShadow: "var(--card-shadow)",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ color: "var(--text)" }}><circle cx="12" cy="12" r="4"/><line x1="12" y1="3" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="21"/><line x1="5" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="19" y2="12"/></svg>
                    </span>
                  </div>
                  <span style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--text-mono)",
                    fontWeight: 400,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--muted)",
                    padding: "8px 12px",
                    borderRadius: 8,
                    border: "1px solid var(--border)",
                    background: "var(--surface)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                  }}>
                    Next case study →
                  </span>
                </div>

                {/* Faux content lines below the nav */}
                <div style={{
                  position: "absolute",
                  top: 80, left: 16, right: 16,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}>
                  <div style={{ height: 12, width: "60%", background: "var(--border)", borderRadius: 4, opacity: 0.6 }} />
                  <div style={{ height: 8, width: "80%", background: "var(--border)", borderRadius: 4, opacity: 0.4 }} />
                  <div style={{ height: 8, width: "70%", background: "var(--border)", borderRadius: 4, opacity: 0.4 }} />
                </div>
              </div>

              {/* Minimal annotation strip */}
              <div style={{
                marginTop: "var(--space-4)",
                display: "flex",
                gap: "var(--space-5)",
                flexWrap: "wrap",
              }}>
                {[
                  { k: "Wordmark", v: "DM Sans · 0.06em" },
                  { k: "Pills",    v: "--surface + --card-shadow" },
                  { k: "Height",   v: "64px" },
                  { k: "Top",      v: "8px from viewport" },
                ].map(m => (
                  <div key={m.k}>
                    <p style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "var(--text-eyebrow)",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "var(--muted)",
                      margin: 0,
                      marginBottom: 2,
                    }}>{m.k}</p>
                    <p style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "var(--text-body)",
                      color: "var(--text)",
                      margin: 0,
                    }}>{m.v}</p>
                  </div>
                ))}
              </div>
            </SlidePanel>

            {/* Grids — three live grid demos. Each card renders an actual
                grid with placeholder cells so the layout pattern is visible,
                with the spec + use case beneath. */}
            <SlidePanel id="grids" isActive={active === "grids"}>
              <Eyebrow>Grids</Eyebrow>
              <SlideTitle>Three column patterns power the system.</SlideTitle>
              <Lead>
                16px gap between top-level panels. 24px outer gutter.
                880px max content width inside each panel.
              </Lead>
              <div style={{
                marginTop: "var(--space-7)",
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "var(--space-4)",
              }}>
                {[
                  {
                    name: "2 × 2",
                    spec: "repeat(2, 1fr)",
                    uses: "Philosophy principles, paired comparisons.",
                    grid: <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8, height: 88 }}>
                      {[1,2,3,4].map(i => <div key={i} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6 }} />)}
                    </div>,
                  },
                  {
                    name: "4-col",
                    spec: "repeat(4, 1fr)",
                    uses: "Workflow steps, sequential strips.",
                    grid: <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, height: 88 }}>
                      {[1,2,3,4].map(i => <div key={i} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6 }} />)}
                    </div>,
                  },
                  {
                    name: "Auto-fit",
                    spec: "minmax(60px, 1fr)",
                    uses: "Swatches, chips, badges.",
                    grid: <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(60px, 1fr))", gap: 6, height: 88 }}>
                      {[1,2,3,4,5,6].map(i => <div key={i} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6 }} />)}
                    </div>,
                  },
                ].map(g => (
                  <div key={g.name} style={{
                    background: "var(--surface2)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-md)",
                    padding: "var(--space-5)",
                  }}>
                    {g.grid}
                    <p style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "var(--text-title-sm)",
                      fontWeight: 500,
                      letterSpacing: "-0.015em",
                      color: "var(--text)",
                      margin: 0,
                      marginTop: "var(--space-4)",
                      marginBottom: 6,
                    }}>{g.name}</p>
                    <code style={{
                      display: "inline-block",
                      fontFamily: "var(--font-mono)",
                      fontSize: "var(--text-mono)",
                      color: "var(--muted2)",
                      background: "var(--bg)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius-xs)",
                      padding: "3px 6px",
                      marginBottom: "var(--space-3)",
                    }}>{g.spec}</code>
                    <p style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "var(--text-body)",
                      color: "var(--muted)",
                      margin: 0,
                      lineHeight: 1.55,
                    }}>{g.uses}</p>
                  </div>
                ))}
              </div>
            </SlidePanel>

            {/* Launch splash — preview of the actual splash composition.
                The wordmark + hint render inline at the splash's real type
                treatment so visitors see what shows on first visit instead
                of reading a description of it. */}
            <SlidePanel id="splash" isActive={active === "splash"}>
              <ChapterHeading numeral="VII" title="Beyond Components" />
              <Eyebrow>Closing signature</Eyebrow>
              <SlideTitle weight="manifesto">What comes after the system.</SlideTitle>
              <Lead>
                A particle wordmark assembles, once. Then it stays out of the way.
                The signature isn’t the system — it’s the threshold the system
                holds open behind it.
              </Lead>

              {/* Live splash preview — mini viewport mockup */}
              <div style={{
                marginTop: "var(--space-7)",
                background: "var(--bg)",
                border: "1px solid var(--border)",
                borderRadius: 10,
                height: 280,
                position: "relative",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <h3 style={{
                  fontFamily: "var(--font-logo)",
                  fontSize: "clamp(28px, 4vw, 56px)",
                  fontWeight: 500,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "var(--text)",
                  margin: 0,
                }}>
                  Arun Gaddam
                </h3>
                <p style={{
                  position: "absolute",
                  bottom: 18,
                  left: "50%",
                  transform: "translateX(-50%)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-mono)",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                  margin: 0,
                  opacity: 0.7,
                }}>
                  Press any key or click to enter
                </p>
              </div>

              {/* Spec strip — compact */}
              <div style={{
                marginTop: "var(--space-4)",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                gap: "var(--space-3)",
              }}>
                {[
                  { k: "Gate",     v: "Once per session" },
                  { k: "Hold",     v: "2.4s · 1.2s reduced" },
                  { k: "Fade",     v: "600ms" },
                  { k: "Dismiss",  v: "Key · Click" },
                  { k: "Role",     v: "dialog · aria-modal" },
                  { k: "Focus",    v: "body[inert] trap" },
                ].map(m => (
                  <div key={m.k} style={{
                    padding: "var(--space-3) var(--space-4)",
                    background: "var(--surface2)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-md)",
                  }}>
                    <p style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "var(--text-eyebrow)",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "var(--muted)",
                      margin: 0,
                      marginBottom: 2,
                    }}>{m.k}</p>
                    <p style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "var(--text-body)",
                      color: "var(--text)",
                      margin: 0,
                    }}>{m.v}</p>
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
