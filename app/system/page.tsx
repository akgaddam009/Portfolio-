"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { InlineChip, type ChipTone } from "@/components/ui/InlineChip";

const EASE = [0.22, 1, 0.36, 1] as const;

/* =========================================================================
   TABLE OF CONTENTS
   ========================================================================= */

const TOC = [
  {
    group: "About",
    items: [
      { id: "introduction",   label: "Introduction" },
      { id: "why",            label: "Why this system" },
      { id: "philosophy",     label: "Design philosophy" },
    ],
  },
  {
    group: "Workflow",
    items: [
      { id: "ai-workflow",    label: "AI-assisted workflow" },
      { id: "planning",       label: "Planning process" },
      { id: "research",       label: "Claude AI research" },
      { id: "implementation", label: "Claude Code build" },
    ],
  },
  {
    group: "Architecture",
    items: [
      { id: "system",         label: "System overview" },
      { id: "tokens",         label: "Tokens" },
      { id: "components",     label: "Components" },
      { id: "patterns",       label: "Patterns" },
    ],
  },
  {
    group: "Practice",
    items: [
      { id: "accessibility",  label: "Accessibility" },
      { id: "governance",     label: "Governance" },
      { id: "future",         label: "Future scalability" },
    ],
  },
];

/* =========================================================================
   PRIMITIVES
   ========================================================================= */

function SectionLabel({ number, children }: { number?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: "16px", marginBottom: "12px" }}>
      {number && (
        <span style={{
          fontFamily: "var(--font-mono)", fontSize: "var(--text-mono)",
          letterSpacing: "0.1em", color: "var(--muted)",
        }}>
          {number}
        </span>
      )}
      <h2 style={{
        fontFamily: "var(--font-body)", fontSize: "var(--text-title-lg)",
        fontWeight: 500, letterSpacing: "-0.02em",
        color: "var(--text)", margin: 0,
      }}>
        {children}
      </h2>
    </div>
  );
}

function SectionDescription({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontFamily: "var(--font-body)", fontSize: "var(--text-lead)",
      color: "var(--muted2)", marginBottom: "40px", maxWidth: "640px",
      lineHeight: 1.65, letterSpacing: "-0.005em",
    }}>
      {children}
    </p>
  );
}

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ maxWidth: "640px" }}>
      {children}
    </div>
  );
}

function Paragraph({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontFamily: "var(--font-body)", fontSize: "var(--text-body-lg)",
      color: "var(--muted2)", lineHeight: 1.75, letterSpacing: "-0.005em",
      marginBottom: "20px",
    }}>
      {children}
    </p>
  );
}

function PreviewBox({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: "var(--chrome)", border: "1px solid var(--border)",
      borderRadius: "16px", padding: "48px 32px",
      display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "center",
      ...style,
    }}>
      {children}
    </div>
  );
}

function TokenPill({ token }: { token: string }) {
  return (
    <code style={{
      fontFamily: "var(--font-mono)", fontSize: "var(--text-mono)",
      color: "var(--muted)", background: "var(--surface2)",
      padding: "2px 6px", borderRadius: "4px", letterSpacing: "0.02em",
    }}>
      {token}
    </code>
  );
}

function Pullquote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote style={{
      borderLeft: "2px solid var(--text)",
      paddingLeft: "20px",
      margin: "32px 0",
      fontFamily: "var(--font-body)",
      fontSize: "var(--text-title-sm)",
      fontWeight: 400, lineHeight: 1.5, letterSpacing: "-0.015em",
      color: "var(--text)",
      fontStyle: "italic",
    }}>
      {children}
    </blockquote>
  );
}

/* =========================================================================
   SIDEBAR (scroll-spy TOC)
   ========================================================================= */

function Sidebar() {
  const [active, setActive] = useState<string>("introduction");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    if (sections.length === 0) return;

    const visible = new Map<string, number>();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visible.set(entry.target.id, entry.intersectionRatio);
          } else {
            visible.delete(entry.target.id);
          }
        });
        if (visible.size > 0) {
          const top = [...visible.entries()].sort((a, b) => b[1] - a[1])[0][0];
          setActive(top);
        }
      },
      {
        rootMargin: "-100px 0px -60% 0px",
        threshold: [0, 0.25, 0.5, 1],
      },
    );

    sections.forEach((s) => observerRef.current?.observe(s));
    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <aside
      className="ds-sidebar"
      style={{
        position: "sticky",
        top: "88px",
        alignSelf: "flex-start",
        width: "200px",
        flexShrink: 0,
        maxHeight: "calc(100vh - 120px)",
        overflowY: "auto",
        paddingRight: "8px",
      }}
    >
      <p style={{
        fontFamily: "var(--font-mono)", fontSize: "var(--text-eyebrow)",
        letterSpacing: "0.1em", textTransform: "uppercase",
        color: "var(--muted)", margin: 0, marginBottom: "20px",
      }}>
        On this page
      </p>

      <nav>
        {TOC.map((group, gi) => (
          <div key={group.group} style={{ marginBottom: gi < TOC.length - 1 ? "24px" : 0 }}>
            <p style={{
              fontFamily: "var(--font-mono)", fontSize: "var(--text-mono)",
              letterSpacing: "0.08em", textTransform: "uppercase",
              color: "var(--text)", fontWeight: 500,
              margin: 0, marginBottom: "10px",
            }}>
              {group.group}
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {group.items.map((item) => {
                const isActive = active === item.id;
                return (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      style={{
                        display: "block",
                        padding: "6px 0 6px 12px",
                        fontFamily: "var(--font-body)",
                        fontSize: "var(--text-body)",
                        color: isActive ? "var(--text)" : "var(--muted)",
                        fontWeight: isActive ? 500 : 400,
                        borderLeft: `2px solid ${isActive ? "var(--text)" : "var(--border)"}`,
                        textDecoration: "none",
                        transition: "color 180ms var(--ease-expo), border-color 180ms var(--ease-expo)",
                        lineHeight: 1.4,
                      }}
                    >
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}

/* =========================================================================
   DATA
   ========================================================================= */

const COLOR_GROUPS = [
  {
    label: "Base",
    swatches: [
      { name: "Canvas",   token: "--bg",       hex: "#ffffff" },
      { name: "Surface",  token: "--surface",  hex: "#ffffff" },
      { name: "Surface 2",token: "--surface2", hex: "#f5f5f7" },
      { name: "Chrome",   token: "--chrome",   hex: "#f5f5f5" },
      { name: "Border",   token: "--border",   hex: "#d2d2d7" },
    ],
  },
  {
    label: "Text",
    swatches: [
      { name: "Text",         token: "--text",         hex: "#1d1d1f" },
      { name: "Text display", token: "--text-display", hex: "#3a3a3c" },
      { name: "Muted",        token: "--muted",        hex: "#6e6e73" },
      { name: "Muted 2",      token: "--muted2",       hex: "#424245" },
    ],
  },
  {
    label: "Accent",
    swatches: [
      { name: "Warm",    token: "--accent-warm",    hex: "#d17b53" },
      { name: "Success", token: "--accent-success", hex: "#16a34a" },
      { name: "Error",   token: "--accent-error",   hex: "#ff3b30" },
      { name: "Gold",    token: "--accent-gold",    hex: "#eab308" },
    ],
  },
];

const TYPE_SCALE = [
  { label: "Display",   token: "--text-display",   size: "26-44px", weight: 300, tracking: "-0.03em",  sample: "Design systems at scale" },
  { label: "Title LG",  token: "--text-title-lg",  size: "20-24px", weight: 500, tracking: "-0.025em", sample: "Tokens, motion, and patterns" },
  { label: "Title",     token: "--text-title",     size: "18px",    weight: 500, tracking: "-0.02em",  sample: "Component architecture" },
  { label: "Title SM",  token: "--text-title-sm",  size: "16px",    weight: 500, tracking: "-0.015em", sample: "Consistent visual language" },
  { label: "Lead",      token: "--text-lead",      size: "15px",    weight: 400, tracking: "-0.01em",  sample: "Built from a single source of truth." },
  { label: "Body LG",   token: "--text-body-lg",   size: "14px",    weight: 400, tracking: "-0.01em",  sample: "Maintained as code, not Figma." },
  { label: "Body",      token: "--text-body",      size: "13px",    weight: 400, tracking: "0",        sample: "Every value is a live CSS variable." },
  { label: "Mono",      token: "--text-mono",      size: "10px",    weight: 400, tracking: "0.08em",   sample: "DESIGN SYSTEM · TOKENS", mono: true },
];

/* =========================================================================
   SECTION WRAPPER
   ========================================================================= */

function Section({ id, number, title, description, children, variant = "default" }: {
  id: string;
  number: string;
  title: string;
  description?: React.ReactNode;
  children: React.ReactNode;
  variant?: "default" | "tinted";
}) {
  return (
    <section
      id={id}
      style={{
        padding: "var(--space-9) 0",
        borderTop: "1px solid var(--border)",
        background: variant === "tinted" ? "var(--chrome)" : "transparent",
        scrollMarginTop: "80px",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <SectionLabel number={number}>{title}</SectionLabel>
        {description && <SectionDescription>{description}</SectionDescription>}
        {children}
      </motion.div>
    </section>
  );
}

/* =========================================================================
   PAGE
   ========================================================================= */

export default function DesignSystemPage() {
  return (
    <>
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 10,
        padding: "12px 0",
        background: "color-mix(in srgb, var(--bg) 80%, transparent)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid color-mix(in srgb, var(--border) 50%, transparent)",
      }}>
        <div style={{
          maxWidth: "1280px", margin: "0 auto",
          padding: "0 24px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <Link
            href="/"
            style={{
              fontFamily: "var(--font-mono)", fontSize: "var(--text-mono)",
              letterSpacing: "0.08em", textTransform: "uppercase",
              color: "var(--muted)", padding: "8px 4px",
              display: "inline-flex", alignItems: "center", gap: "6px",
              transition: "color 0.18s", textDecoration: "none",
            }}
            onMouseEnter={e => { e.currentTarget.style.color = "var(--text)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "var(--muted)"; }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
            Portfolio
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section style={{
        padding: "120px 0 80px",
        borderBottom: "1px solid var(--border)",
      }}>
        <div style={{
          maxWidth: "1280px", margin: "0 auto",
          padding: "0 24px",
        }}>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            style={{ maxWidth: "880px" }}
          >
            <p style={{
              fontFamily: "var(--font-mono)", fontSize: "var(--text-eyebrow)",
              letterSpacing: "0.12em", textTransform: "uppercase",
              color: "var(--muted)", marginBottom: "24px",
            }}>
              Portfolio · Design system documentation
            </p>

            <h1 style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(32px, 5vw, 56px)",
              fontWeight: 300, lineHeight: 1.1,
              letterSpacing: "-0.035em", color: "var(--text)",
              marginBottom: "32px", maxWidth: "880px",
            }}>
              Planned with{" "}
              <InlineChip label="Claude AI" tone="indigo" scale="match" />.
              Built with{" "}
              <InlineChip label="Claude Code" tone="violet" scale="match" />.
            </h1>

            <p style={{
              fontFamily: "var(--font-body)", fontSize: "var(--text-title-sm)",
              lineHeight: 1.6, color: "var(--muted2)", marginBottom: "40px",
              fontWeight: 400, maxWidth: "680px", letterSpacing: "-0.005em",
            }}>
              No Figma file. No handoff. The site you’re looking at <em>is</em> the
              documentation — every color, type ramp, and motion curve below is the same one
              the live pages use.
            </p>

            <div style={{
              display: "flex", gap: "32px", flexWrap: "wrap",
              paddingTop: "24px", borderTop: "1px solid var(--border)",
            }}>
              {([
                { label: "Sections",   value: "13" },
                { label: "Tokens",     value: "60+" },
                { label: "Components", value: "8" },
                { label: "Workflow",   value: "Claude AI + Code" },
              ]).map(stat => (
                <div key={stat.label}>
                  <p style={{
                    fontFamily: "var(--font-mono)", fontSize: "var(--text-eyebrow)",
                    letterSpacing: "0.1em", textTransform: "uppercase",
                    color: "var(--muted)", margin: 0, marginBottom: "4px",
                  }}>
                    {stat.label}
                  </p>
                  <p style={{
                    fontFamily: "var(--font-body)", fontSize: "var(--text-title)",
                    fontWeight: 500, letterSpacing: "-0.015em",
                    color: "var(--text)", margin: 0,
                  }}>
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── BODY: sidebar + content ── */}
      <div style={{
        maxWidth: "1280px", margin: "0 auto",
        padding: "0 24px",
        display: "flex", gap: "64px",
        position: "relative",
      }}>
        <Sidebar />

        <main style={{ flex: 1, minWidth: 0, paddingBottom: "var(--space-11)" }}>

          {/* 01 — Introduction */}
          <Section
            id="introduction"
            number="01"
            title="Introduction"
            description="A working artifact, not a deliverable."
          >
            <Prose>
              <Paragraph>
                Most design systems live in Figma. They drift the moment engineers touch them.
                This one lives in the code — one CSS file, a handful of React components. If this
                page renders, the system is correct.
              </Paragraph>
            </Prose>
          </Section>

          {/* 02 — Why this system was created */}
          <Section
            id="why"
            number="02"
            title="Why this exists"
            description="Drift was the problem. Code was the answer."
          >
            <Prose>
              <Paragraph>
                Three portfolio rebuilds in, the same gray was hex-coded four different ways.
                Spacing wandered. Discipline wasn’t fixing it.
              </Paragraph>
              <Paragraph>
                One rule fixed it: nothing visual lives outside the token file. Pages reference{" "}
                <TokenPill token="var(--text)" />, not a hex. Sections reference{" "}
                <TokenPill token="var(--space-7)" />, not 32px. Drift becomes impossible because
                there’s only one place to drift from.
              </Paragraph>
            </Prose>
          </Section>

          {/* 03 — Design philosophy */}
          <Section
            id="philosophy"
            number="03"
            title="Design philosophy"
            description="Four opinions that shape every decision below."
          >
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "16px",
            }}>
              {([
                {
                  n: "01",
                  title: "No primary, on purpose",
                  body: "Three button tiers, none dominant. The work is the hero — nobody’s getting pitched.",
                },
                {
                  n: "02",
                  title: "One easing curve",
                  body: "Every transition uses the same cubic-bezier. One motion language, everywhere.",
                },
                {
                  n: "03",
                  title: "Code, not Figma",
                  body: "Tokens live in globals.css. One source means nothing to drift from.",
                },
                {
                  n: "04",
                  title: "44px floor",
                  body: "The touch-target minimum is a spacing token, so accessibility is baked in — not bolted on later.",
                },
              ]).map(p => (
                <div key={p.n} style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "16px",
                  padding: "28px",
                }}>
                  <p style={{
                    fontFamily: "var(--font-mono)", fontSize: "var(--text-mono)",
                    letterSpacing: "0.08em",
                    color: "var(--muted)", margin: 0, marginBottom: "20px",
                  }}>
                    {p.n}
                  </p>
                  <p style={{
                    fontFamily: "var(--font-body)", fontSize: "var(--text-title-sm)",
                    fontWeight: 500, letterSpacing: "-0.015em",
                    color: "var(--text)", margin: 0, marginBottom: "10px",
                  }}>
                    {p.title}
                  </p>
                  <p style={{
                    fontFamily: "var(--font-body)", fontSize: "var(--text-body)",
                    color: "var(--muted2)", margin: 0, lineHeight: 1.6,
                  }}>
                    {p.body}
                  </p>
                </div>
              ))}
            </div>
          </Section>

          {/* 04 — AI-assisted workflow */}
          <Section
            id="ai-workflow"
            number="04"
            title="How AI helped"
            description="Plan in Claude AI. Build in Claude Code. The plan is the contract."
          >
            <Prose>
              <Paragraph>
                Two modes, one workflow. <strong>Claude AI</strong> was the thinking partner —
                research, principles, plan documents. <strong>Claude Code</strong> was the
                builder — turning each plan into tokens, components, pages.
              </Paragraph>
              <Paragraph>
                The plan file is the contract. When something feels off, I go back to the plan,
                not the code.
              </Paragraph>
            </Prose>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "12px",
              marginTop: "32px",
            }}>
              {([
                { step: "Plan",    tool: "Claude AI",   body: "Decisions as prose. Tradeoffs named. Files listed." },
                { step: "Approve", tool: "Human",       body: "Read it. Push back. Lock the scope." },
                { step: "Build",   tool: "Claude Code", body: "Execute the plan. Run the dev server. Verify." },
                { step: "Review",  tool: "Human",       body: "Open the browser. Wrong? Back to the plan." },
              ]).map((s, i) => (
                <div key={s.step} style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                  padding: "20px",
                  position: "relative",
                }}>
                  <p style={{
                    fontFamily: "var(--font-mono)", fontSize: "var(--text-mono)",
                    letterSpacing: "0.08em", color: "var(--muted)", margin: 0, marginBottom: "12px",
                  }}>
                    {String(i + 1).padStart(2, "0")} · {s.tool}
                  </p>
                  <p style={{
                    fontFamily: "var(--font-body)", fontSize: "var(--text-title-sm)",
                    fontWeight: 500, color: "var(--text)", margin: 0, marginBottom: "6px",
                  }}>
                    {s.step}
                  </p>
                  <p style={{
                    fontFamily: "var(--font-body)", fontSize: "var(--text-body)",
                    color: "var(--muted2)", margin: 0, lineHeight: 1.5,
                  }}>
                    {s.body}
                  </p>
                </div>
              ))}
            </div>
          </Section>

          {/* 05 — Planning process */}
          <Section
            id="planning"
            number="05"
            title="Planning"
            description="Plan mode in Claude Code. Decisions before code."
          >
            <Prose>
              <Paragraph>
                Claude Code has a <strong>plan mode</strong> that can read and search but can’t
                write. The output is one markdown file: what changes, what doesn’t, and why.
                Every non-trivial change here passed through one.
              </Paragraph>
              <Pullquote>
                The plan is the artifact. The code follows.
              </Pullquote>
            </Prose>
          </Section>

          {/* 06 — Claude AI research workflow */}
          <Section
            id="research"
            number="06"
            title="Research with Claude AI"
            description="Reference systems, principle synthesis, copywriting."
          >
            <Prose>
              <Paragraph>
                I didn’t ask Claude to design things. I asked structural questions: why does
                Apple’s light theme feel less flat than most? What separates Linear’s motion
                language from Vercel’s? Why might a portfolio be better off without a primary
                CTA?
              </Paragraph>
              <Paragraph>
                Those conversations became the four principles above. It also drafted first-pass
                copy for case studies — a wall to push against, not the final word.
              </Paragraph>
            </Prose>
          </Section>

          {/* 07 — Claude Code implementation workflow */}
          <Section
            id="implementation"
            number="07"
            title="Building with Claude Code"
            description="Plan as contract. Agent as builder. Browser as verifier."
          >
            <Prose>
              <Paragraph>
                Each session: read the plan, edit tokens in{" "}
                <TokenPill token="globals.css" />, scaffold components in{" "}
                <TokenPill token="components/ui/" />, compose pages under{" "}
                <TokenPill token="app/" />. Verify in the browser. Commit.
              </Paragraph>
              <Paragraph>
                Nothing reaches <TokenPill token="main" /> without approval. This page was built
                the same way — plan, render, review, repeat.
              </Paragraph>
            </Prose>
          </Section>

          {/* 08 — System architecture overview */}
          <Section
            id="system"
            number="08"
            title="Architecture"
            description="Four layers. Each one only talks to the layer below."
          >
            <Prose>
              <Paragraph>
                Pages never reach past components. Components never hardcode values. This
                layering is what keeps theming and refactors boring.
              </Paragraph>
            </Prose>

            <div style={{
              marginTop: "32px",
              border: "1px solid var(--border)",
              borderRadius: "16px",
              overflow: "hidden",
            }}>
              {([
                { layer: "Pages",      desc: "Composed routes — app/page.tsx, app/work/[slug]/page.tsx",       n: "04" },
                { layer: "Patterns",   desc: "Multi-component compositions — work cards, gates, hero blocks",   n: "03" },
                { layer: "Components", desc: "Atomic UI — Button, Badge, Input, InlineChip, VideoBlock",        n: "02" },
                { layer: "Tokens",     desc: "CSS variables in globals.css — colors, type, spacing, motion",    n: "01" },
              ]).map((l, i, arr) => (
                <div key={l.layer} style={{
                  display: "grid",
                  gridTemplateColumns: "60px 1fr",
                  gap: "20px",
                  alignItems: "center",
                  padding: "20px 24px",
                  borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none",
                  background: i % 2 === 0 ? "var(--surface)" : "var(--chrome)",
                }}>
                  <p style={{
                    fontFamily: "var(--font-mono)", fontSize: "var(--text-mono)",
                    letterSpacing: "0.08em", color: "var(--muted)", margin: 0,
                  }}>
                    {l.n}
                  </p>
                  <div>
                    <p style={{
                      fontFamily: "var(--font-body)", fontSize: "var(--text-title-sm)",
                      fontWeight: 500, color: "var(--text)", margin: 0, marginBottom: "4px",
                    }}>
                      {l.layer}
                    </p>
                    <p style={{
                      fontFamily: "var(--font-body)", fontSize: "var(--text-body)",
                      color: "var(--muted2)", margin: 0, lineHeight: 1.5,
                    }}>
                      {l.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* 09 — Tokens */}
          <Section
            id="tokens"
            number="09"
            title="Token architecture"
            description="Colors, typography, spacing, radius, and motion — the entire visual vocabulary in a single CSS file."
          >
            <Prose>
              <Paragraph>
                The token file is the only place visual decisions are allowed to live. Components
                read tokens. Pages read components. Nothing reads hexes. This rule, applied
                strictly, eliminates a category of bugs that design systems usually solve with
                process — drift, inconsistency, theme fragility.
              </Paragraph>
            </Prose>

            {/* Colors */}
            <div style={{ marginTop: "48px" }}>
              <h3 style={{
                fontFamily: "var(--font-body)", fontSize: "var(--text-title)",
                fontWeight: 500, letterSpacing: "-0.02em",
                color: "var(--text)", marginBottom: "20px",
              }}>
                Colors
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
                {COLOR_GROUPS.map(group => (
                  <div key={group.label}>
                    <p style={{
                      fontFamily: "var(--font-mono)", fontSize: "var(--text-mono)",
                      letterSpacing: "0.06em", textTransform: "uppercase",
                      color: "var(--muted)", marginBottom: "12px",
                    }}>
                      {group.label}
                    </p>
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                      gap: "12px",
                    }}>
                      {group.swatches.map(s => (
                        <div key={s.token} style={{
                          background: "var(--surface)", border: "1px solid var(--border)",
                          borderRadius: "12px", padding: "12px",
                          display: "flex", flexDirection: "column", gap: "10px",
                        }}>
                          <div style={{
                            width: "100%", aspectRatio: "4 / 3",
                            borderRadius: "8px", background: `var(${s.token})`,
                            border: "1px solid var(--border)",
                          }} />
                          <div>
                            <p style={{
                              fontFamily: "var(--font-body)", fontSize: "var(--text-body)",
                              color: "var(--text)", margin: 0, marginBottom: "2px", fontWeight: 500,
                            }}>
                              {s.name}
                            </p>
                            <p style={{
                              fontFamily: "var(--font-mono)", fontSize: "var(--text-mono)",
                              color: "var(--muted)", margin: 0, letterSpacing: "0.04em",
                            }}>
                              {s.token}
                            </p>
                            <p style={{
                              fontFamily: "var(--font-mono)", fontSize: "var(--text-mono)",
                              color: "var(--muted2)", margin: "2px 0 0 0", letterSpacing: "0.04em",
                            }}>
                              {s.hex}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Typography */}
            <div style={{ marginTop: "48px" }}>
              <h3 style={{
                fontFamily: "var(--font-body)", fontSize: "var(--text-title)",
                fontWeight: 500, letterSpacing: "-0.02em",
                color: "var(--text)", marginBottom: "20px",
              }}>
                Typography
              </h3>
              <div style={{ border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden" }}>
                {TYPE_SCALE.map((t, i) => (
                  <div key={t.token} style={{
                    display: "grid",
                    gridTemplateColumns: "120px 1fr 130px",
                    gap: "16px",
                    alignItems: "center",
                    padding: "16px 20px",
                    borderBottom: i < TYPE_SCALE.length - 1 ? "1px solid var(--border)" : "none",
                    background: i % 2 === 0 ? "var(--surface)" : "var(--chrome)",
                  }}>
                    <div>
                      <p style={{
                        fontFamily: "var(--font-mono)", fontSize: "var(--text-mono)",
                        letterSpacing: "0.06em", textTransform: "uppercase",
                        color: "var(--muted)", margin: 0, marginBottom: "2px",
                      }}>
                        {t.label}
                      </p>
                      <p style={{
                        fontFamily: "var(--font-mono)", fontSize: "var(--text-mono)",
                        color: "var(--muted)", margin: 0, opacity: 0.7,
                      }}>
                        {t.size} / {t.weight}
                      </p>
                    </div>
                    <p style={{
                      fontFamily: t.mono ? "var(--font-mono)" : "var(--font-body)",
                      fontSize: `var(${t.token})`,
                      fontWeight: t.weight,
                      letterSpacing: t.tracking,
                      textTransform: t.mono ? "uppercase" : undefined,
                      color: "var(--text)", margin: 0, lineHeight: 1.3,
                    }}>
                      {t.sample}
                    </p>
                    <TokenPill token={t.token} />
                  </div>
                ))}
              </div>
            </div>

            {/* Spacing */}
            <div style={{ marginTop: "48px" }}>
              <h3 style={{
                fontFamily: "var(--font-body)", fontSize: "var(--text-title)",
                fontWeight: 500, letterSpacing: "-0.02em",
                color: "var(--text)", marginBottom: "12px",
              }}>
                Spacing
              </h3>
              <p style={{
                fontFamily: "var(--font-body)", fontSize: "var(--text-body)",
                color: "var(--muted2)", marginBottom: "20px", maxWidth: "560px", lineHeight: 1.6,
              }}>
                4-px base step. The 44-px stop is the WCAG 2.5.5 touch-target floor.
              </p>

              <div style={{ border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden" }}>
                {([
                  { token: "--space-1",  px: 4  },
                  { token: "--space-2",  px: 8  },
                  { token: "--space-3",  px: 12 },
                  { token: "--space-4",  px: 16 },
                  { token: "--space-5",  px: 20 },
                  { token: "--space-6",  px: 24 },
                  { token: "--space-7",  px: 32 },
                  { token: "--space-8",  px: 44, note: "Touch target floor" },
                  { token: "--space-9",  px: 48 },
                  { token: "--space-10", px: 64 },
                  { token: "--space-11", px: 96 },
                ]).map((s, i, arr) => (
                  <div key={s.token} style={{
                    display: "grid",
                    gridTemplateColumns: "130px 60px 1fr 180px",
                    gap: "12px",
                    alignItems: "center",
                    padding: "12px 20px",
                    borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none",
                    background: i % 2 === 0 ? "var(--surface)" : "var(--chrome)",
                  }}>
                    <TokenPill token={s.token} />
                    <p style={{
                      fontFamily: "var(--font-mono)", fontSize: "var(--text-mono)",
                      color: "var(--text)", margin: 0, fontWeight: 500,
                    }}>
                      {s.px}px
                    </p>
                    <div style={{
                      height: "8px", width: `${Math.min(s.px * 2, 192)}px`,
                      background: "var(--text)", borderRadius: "2px",
                      opacity: 0.15 + (s.px / 96) * 0.85,
                    }} />
                    {s.note && (
                      <p style={{
                        fontFamily: "var(--font-mono)", fontSize: "var(--text-mono)",
                        color: "var(--accent-success)", margin: 0, letterSpacing: "0.02em",
                      }}>
                        ↑ {s.note}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Radius */}
            <div style={{ marginTop: "48px" }}>
              <h3 style={{
                fontFamily: "var(--font-body)", fontSize: "var(--text-title)",
                fontWeight: 500, letterSpacing: "-0.02em",
                color: "var(--text)", marginBottom: "20px",
              }}>
                Radius
              </h3>
              <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", alignItems: "flex-end" }}>
                {([
                  { token: "--radius-xs",   px: 4,    use: "Focus ring" },
                  { token: "--radius-sm",   px: 8,    use: "Inline button" },
                  { token: "--radius-md",   px: 12,   use: "Card" },
                  { token: "--radius-lg",   px: 16,   use: "Hero media" },
                  { token: "--radius-xl",   px: 24,   use: "Feature media" },
                  { token: "--radius-pill", px: 9999, use: "Pill / chip" },
                ]).map(r => (
                  <div key={r.token} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <div style={{
                      width: `${Math.min(40 + r.px * 2, 88)}px`,
                      height: `${Math.min(40 + r.px * 2, 88)}px`,
                      borderRadius: `${r.px}px`,
                      background: "var(--surface2)",
                      border: "1px solid var(--border)",
                    }} />
                    <div>
                      <p style={{
                        fontFamily: "var(--font-mono)", fontSize: "var(--text-mono)",
                        color: "var(--text)", margin: 0, marginBottom: "2px", fontWeight: 500,
                      }}>
                        {r.px === 9999 ? "pill" : `${r.px}px`}
                      </p>
                      <p style={{
                        fontFamily: "var(--font-mono)", fontSize: "var(--text-mono)",
                        color: "var(--muted)", margin: 0, letterSpacing: "0.02em",
                      }}>
                        {r.token}
                      </p>
                      <p style={{
                        fontFamily: "var(--font-body)", fontSize: "var(--text-body)",
                        color: "var(--muted2)", margin: 0, marginTop: "4px",
                      }}>
                        {r.use}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Motion */}
            <div style={{ marginTop: "48px" }}>
              <h3 style={{
                fontFamily: "var(--font-body)", fontSize: "var(--text-title)",
                fontWeight: 500, letterSpacing: "-0.02em",
                color: "var(--text)", marginBottom: "12px",
              }}>
                Motion
              </h3>
              <p style={{
                fontFamily: "var(--font-body)", fontSize: "var(--text-body)",
                color: "var(--muted2)", marginBottom: "20px", maxWidth: "560px", lineHeight: 1.6,
              }}>
                One easing curve, three durations. <TokenPill token="cubic-bezier(0.22, 1, 0.36, 1)" />{" "}
                — cinematic deceleration.
              </p>

              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                {([
                  { dur: 0.18, token: "--dur-fast", label: "180ms", desc: "Hover, color shift" },
                  { dur: 0.32, token: "--dur-base", label: "320ms", desc: "State transitions" },
                  { dur: 0.65, token: "--dur-slow", label: "650ms", desc: "Page entry, reveals" },
                ]).map(m => (
                  <div key={m.dur} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false, margin: "-10px" }}
                      transition={{ duration: m.dur, ease: EASE, repeat: Infinity, repeatType: "reverse", repeatDelay: 2 }}
                      style={{
                        padding: "20px 24px",
                        background: "var(--surface)", border: "1px solid var(--border)",
                        borderRadius: "12px", boxShadow: "var(--card-shadow)", minWidth: "220px",
                      }}
                    >
                      <p style={{
                        fontFamily: "var(--font-mono)", fontSize: "var(--text-mono-lg)",
                        letterSpacing: "0.06em", textTransform: "uppercase",
                        color: "var(--text)", margin: 0, marginBottom: "4px",
                      }}>
                        {m.label}
                      </p>
                      <p style={{
                        fontFamily: "var(--font-body)", fontSize: "var(--text-body)",
                        color: "var(--muted2)", margin: 0,
                      }}>
                        {m.desc}
                      </p>
                    </motion.div>
                    <TokenPill token={m.token} />
                  </div>
                ))}
              </div>
            </div>
          </Section>

          {/* 10 — Components */}
          <Section
            id="components"
            number="10"
            title="Component architecture"
            description="Atomic UI built on tokens. Buttons, badges, chips, cards, inputs."
          >
            <Prose>
              <Paragraph>
                Every component in this system reads from tokens and never from hardcoded
                values. A button does not pick its corner radius; it reads{" "}
                <TokenPill token="--radius-md" />. A card does not pick its shadow; it reads{" "}
                <TokenPill token="--card-shadow" />. This is why dark mode shipped without a
                second pass — there was nothing to translate, only one set of values to
                redefine.
              </Paragraph>
            </Prose>

            {/* Buttons */}
            <div style={{ marginTop: "48px" }}>
              <h3 style={{
                fontFamily: "var(--font-body)", fontSize: "var(--text-title)",
                fontWeight: 500, letterSpacing: "-0.02em",
                color: "var(--text)", marginBottom: "16px",
              }}>
                Buttons — three tiers, no primary
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {([
                  { variant: "chrome" as const, label: "Tier 1 · Chrome", desc: "Page chrome — nav, floating actions. Elevated shadow, no border.",       tokens: ["--surface", "--card-shadow", "--radius-md"], example: "Contact" },
                  { variant: "inline" as const, label: "Tier 2 · Inline", desc: "Inline actions within content — view link, secondary CTAs.",            tokens: ["--surface", "--border", "--radius-sm"],     example: "Download CV" },
                  { variant: "tag"    as const, label: "Tier 3 · Tag",    desc: "Metadata labels and filter chips. Lowest weight, no border.",            tokens: ["--surface2", "--radius-xs"],                example: "UX · Product" },
                ]).map(row => (
                  <div key={row.variant} style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 280px",
                    gap: "24px",
                    alignItems: "center",
                    padding: "20px 24px",
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                  }}>
                    <div>
                      <p style={{
                        fontFamily: "var(--font-body)", fontSize: "var(--text-body)",
                        fontWeight: 500, color: "var(--text)", margin: 0, marginBottom: "4px",
                      }}>
                        {row.label}
                      </p>
                      <p style={{
                        fontFamily: "var(--font-body)", fontSize: "var(--text-body)",
                        color: "var(--muted2)", margin: 0, marginBottom: "10px", lineHeight: 1.5,
                      }}>
                        {row.desc}
                      </p>
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                        {row.tokens.map(t => <TokenPill key={t} token={t} />)}
                      </div>
                    </div>
                    <PreviewBox style={{ padding: "24px", justifyContent: "flex-start" }}>
                      <Button variant={row.variant}>{row.example}</Button>
                    </PreviewBox>
                  </div>
                ))}
              </div>
            </div>

            {/* Badges */}
            <div style={{ marginTop: "48px" }}>
              <h3 style={{
                fontFamily: "var(--font-body)", fontSize: "var(--text-title)",
                fontWeight: 500, letterSpacing: "-0.02em",
                color: "var(--text)", marginBottom: "16px",
              }}>
                Badges
              </h3>
              <PreviewBox>
                <div style={{ display: "flex", flexDirection: "column", gap: "24px", width: "100%" }}>
                  {([
                    { variant: "default" as const, items: ["UX Design", "Product Strategy", "Research", "0→1"] },
                    { variant: "accent" as const,  items: ["AI Exploration", "Beta", "New"] },
                    { variant: "success" as const, items: ["In use", "Shipped", "Live"] },
                  ]).map(row => (
                    <div key={row.variant} style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                      <span style={{
                        fontFamily: "var(--font-mono)", fontSize: "var(--text-mono)",
                        color: "var(--muted)", letterSpacing: "0.06em", textTransform: "uppercase",
                        minWidth: "70px",
                      }}>
                        {row.variant}
                      </span>
                      {row.items.map(item => <Badge key={item} variant={row.variant}>{item}</Badge>)}
                    </div>
                  ))}
                </div>
              </PreviewBox>
            </div>

            {/* Chip tones */}
            <div style={{ marginTop: "48px" }}>
              <h3 style={{
                fontFamily: "var(--font-body)", fontSize: "var(--text-title)",
                fontWeight: 500, letterSpacing: "-0.02em",
                color: "var(--text)", marginBottom: "12px",
              }}>
                Chip tones
              </h3>
              <p style={{
                fontFamily: "var(--font-body)", fontSize: "var(--text-body)",
                color: "var(--muted2)", marginBottom: "20px", maxWidth: "560px", lineHeight: 1.6,
              }}>
                Six tones for inline emphasis inside prose and headings. Chip (pill) for noun
                phrases; strip (rectangular highlight) for multi-word emphasis.
              </p>

              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "12px",
              }}>
                {([
                  { tone: "indigo",  use: "Default emphasis · concept",   example: "AI copilot" },
                  { tone: "teal",    use: "Process · methodology",        example: "research-led" },
                  { tone: "amber",   use: "Caution · qualifier",          example: "ambiguous" },
                  { tone: "violet",  use: "Insight · principle",          example: "first principles" },
                  { tone: "emerald", use: "Outcome · positive metric",    example: "68% adoption" },
                  { tone: "sage",    use: "Decorative · soft highlight",  example: "studio of one" },
                ] as { tone: ChipTone; use: string; example: string }[]).map(t => (
                  <div key={t.tone} style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    padding: "20px",
                    display: "flex", flexDirection: "column", gap: "16px",
                  }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      <div>
                        <p style={{
                          fontFamily: "var(--font-mono)", fontSize: "var(--text-mono)",
                          letterSpacing: "0.06em", textTransform: "uppercase",
                          color: "var(--muted)", margin: 0, marginBottom: "8px",
                        }}>
                          Chip
                        </p>
                        <div><InlineChip label={t.example} tone={t.tone} scale="match" /></div>
                      </div>
                      <div>
                        <p style={{
                          fontFamily: "var(--font-mono)", fontSize: "var(--text-mono)",
                          letterSpacing: "0.06em", textTransform: "uppercase",
                          color: "var(--muted)", margin: 0, marginBottom: "8px",
                        }}>
                          Strip
                        </p>
                        <div><InlineChip label={t.example} tone={t.tone} scale="match" variant="strip" /></div>
                      </div>
                    </div>
                    <div style={{ paddingTop: "12px", borderTop: "1px solid var(--border)" }}>
                      <p style={{
                        fontFamily: "var(--font-body)", fontSize: "var(--text-body)",
                        fontWeight: 500, color: "var(--text)", margin: 0, marginBottom: "4px",
                        textTransform: "capitalize",
                      }}>
                        {t.tone}
                      </p>
                      <p style={{
                        fontFamily: "var(--font-body)", fontSize: "var(--text-body)",
                        color: "var(--muted2)", margin: 0, lineHeight: 1.5,
                      }}>
                        {t.use}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cards */}
            <div style={{ marginTop: "48px" }}>
              <h3 style={{
                fontFamily: "var(--font-body)", fontSize: "var(--text-title)",
                fontWeight: 500, letterSpacing: "-0.02em",
                color: "var(--text)", marginBottom: "16px",
              }}>
                Cards
              </h3>
              <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
                {([
                  { label: "Rest",  shadow: "var(--card-shadow)",       token: "--card-shadow" },
                  { label: "Hover", shadow: "var(--card-shadow-hover)", token: "--card-shadow-hover" },
                ]).map(c => (
                  <div key={c.label} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div style={{
                      width: "260px",
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius-md)",
                      boxShadow: c.shadow,
                      overflow: "hidden",
                    }}>
                      <div style={{
                        width: "100%", aspectRatio: "16/9",
                        background: "var(--surface2)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <span style={{
                          fontFamily: "var(--font-mono)", fontSize: "var(--text-mono)",
                          color: "var(--muted)", letterSpacing: "0.06em", textTransform: "uppercase",
                        }}>
                          Media
                        </span>
                      </div>
                      <div style={{ padding: "16px" }}>
                        <div style={{ display: "flex", gap: "6px", marginBottom: "10px" }}>
                          <Badge>Product Design</Badge>
                          <Badge>0→1</Badge>
                        </div>
                        <p style={{
                          fontFamily: "var(--font-body)", fontSize: "var(--text-title-sm)",
                          fontWeight: 500, letterSpacing: "-0.015em",
                          color: "var(--text)", margin: 0, marginBottom: "6px",
                        }}>
                          Case study title
                        </p>
                        <p style={{
                          fontFamily: "var(--font-body)", fontSize: "var(--text-body)",
                          color: "var(--muted2)", margin: 0, lineHeight: 1.5,
                        }}>
                          Short summary of the problem and outcome.
                        </p>
                      </div>
                    </div>
                    <div>
                      <p style={{
                        fontFamily: "var(--font-body)", fontSize: "var(--text-body)",
                        color: "var(--text)", margin: 0, fontWeight: 500,
                      }}>
                        {c.label}
                      </p>
                      <TokenPill token={c.token} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Inputs */}
            <div style={{ marginTop: "48px" }}>
              <h3 style={{
                fontFamily: "var(--font-body)", fontSize: "var(--text-title)",
                fontWeight: 500, letterSpacing: "-0.02em",
                color: "var(--text)", marginBottom: "16px",
              }}>
                Inputs
              </h3>
              <PreviewBox style={{ flexDirection: "column", alignItems: "flex-start", gap: "24px" }}>
                <div style={{ width: "100%", maxWidth: "360px", display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{
                    fontFamily: "var(--font-mono)", fontSize: "var(--text-mono)",
                    letterSpacing: "0.06em", textTransform: "uppercase",
                    color: "var(--muted)",
                  }}>
                    Default
                  </label>
                  <Input placeholder="Enter password" />
                </div>
                <div style={{ width: "100%", maxWidth: "360px", display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{
                    fontFamily: "var(--font-mono)", fontSize: "var(--text-mono)",
                    letterSpacing: "0.06em", textTransform: "uppercase",
                    color: "var(--muted)",
                  }}>
                    Error state
                  </label>
                  <Input placeholder="Wrong password" style={{ borderColor: "var(--accent-error)" }} defaultValue="incorrect" />
                </div>
              </PreviewBox>
            </div>
          </Section>

          {/* 11 — Patterns */}
          <Section
            id="patterns"
            number="11"
            title="Patterns"
            description="Components composed into the work card pattern used across the homepage."
          >
            <div style={{
              display: "grid",
              gridTemplateColumns: "minmax(280px, 1fr) minmax(280px, 360px)",
              gap: "32px",
              alignItems: "start",
            }}>
              <PreviewBox style={{ padding: "40px", justifyContent: "center" }}>
                <div style={{
                  width: "100%", maxWidth: "360px",
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-md)",
                  boxShadow: "var(--card-shadow)",
                  overflow: "hidden",
                }}>
                  <div style={{
                    width: "100%", aspectRatio: "16/9",
                    background: "linear-gradient(135deg, var(--surface2) 0%, var(--chrome) 100%)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <span style={{
                      fontFamily: "var(--font-mono)", fontSize: "var(--text-mono)",
                      color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase",
                    }}>
                      Hero media
                    </span>
                  </div>
                  <div style={{ padding: "20px" }}>
                    <div style={{ display: "flex", gap: "6px", marginBottom: "12px", flexWrap: "wrap" }}>
                      <Badge>Enterprise SaaS</Badge>
                      <Badge>Fintech</Badge>
                    </div>
                    <p style={{
                      fontFamily: "var(--font-body)", fontSize: "var(--text-title-sm)",
                      fontWeight: 500, letterSpacing: "-0.015em",
                      color: "var(--text)", margin: 0, marginBottom: "8px", lineHeight: 1.3,
                    }}>
                      Composing tables for{" "}
                      <InlineChip label="financial planning" tone="indigo" scale="match" />{" "}
                      at scale
                    </p>
                    <p style={{
                      fontFamily: "var(--font-body)", fontSize: "var(--text-body)",
                      color: "var(--muted2)", margin: 0, lineHeight: 1.55,
                    }}>
                      Rebuilt a 12-year-old ESM grid used by 500+ enterprise customers — from
                      5,000ms render to 200ms.
                    </p>
                  </div>
                </div>
              </PreviewBox>

              <div style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                padding: "20px 24px",
              }}>
                <p style={{
                  fontFamily: "var(--font-mono)", fontSize: "var(--text-mono)",
                  letterSpacing: "0.08em", textTransform: "uppercase",
                  color: "var(--muted)", margin: 0, marginBottom: "16px",
                }}>
                  Anatomy
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {([
                    { label: "Container",  tokens: ["--surface", "--radius-md", "--card-shadow"] },
                    { label: "Border",     tokens: ["--border", "1.5px solid"] },
                    { label: "Tags",       tokens: ["<Badge>", "--text-eyebrow"] },
                    { label: "Title",      tokens: ["--text-title-sm", "weight 500", "-0.015em"] },
                    { label: "Highlight",  tokens: ["<InlineChip tone=\"indigo\">"] },
                    { label: "Summary",    tokens: ["--text-body", "--muted2"] },
                  ]).map((row, i, arr) => (
                    <div key={row.label} style={{
                      paddingBottom: i < arr.length - 1 ? "14px" : 0,
                      borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none",
                    }}>
                      <p style={{
                        fontFamily: "var(--font-body)", fontSize: "var(--text-body)",
                        fontWeight: 500, color: "var(--text)", margin: 0, marginBottom: "6px",
                      }}>
                        {row.label}
                      </p>
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                        {row.tokens.map(t => <TokenPill key={t} token={t} />)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Section>

          {/* 12 — Accessibility */}
          <Section
            id="accessibility"
            number="12"
            title="Accessibility philosophy"
            description="Accessibility is a token, not an audit."
          >
            <Prose>
              <Paragraph>
                The fastest way to fail an accessibility audit is to design for sighted
                pointer-and-keyboard users first and bolt accessibility on later. The compliance
                items become impossible to retrofit without changing the visual design. So in
                this system, the constraints are tokens.
              </Paragraph>
              <Paragraph>
                The 44px touch-target floor is a spacing token (<TokenPill token="--space-8" />),
                which means every button, link, and tap target that uses the system already
                meets WCAG 2.5.5. The contrast ratios are baked into the color tokens —{" "}
                <TokenPill token="--text" /> on <TokenPill token="--bg" /> hits AAA, and the
                pairing is the same in dark mode because dark mode is a token redefinition,
                not a separate palette.
              </Paragraph>
              <Paragraph>
                Motion respects <TokenPill token="prefers-reduced-motion" />. Focus rings use{" "}
                <TokenPill token="--radius-xs" /> with{" "}
                <TokenPill token="outline: 2px solid var(--text)" /> and never depend on color
                alone. The result is a system where accessibility is the default, not the
                ceiling.
              </Paragraph>
            </Prose>
          </Section>

          {/* 13 — Governance */}
          <Section
            id="governance"
            number="13"
            title="Governance principles"
            description="Three rules that keep the system from rotting."
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {([
                {
                  rule: "One source of truth",
                  body: "Tokens live in globals.css. Components read tokens. Pages read components. No page reads tokens directly. No component hardcodes a value.",
                },
                {
                  rule: "Tokens before components",
                  body: "A new token gets added when there is a real second use case for a value. Single-use values stay inline. The system grows in response to need, not anticipation.",
                },
                {
                  rule: "Components before patterns",
                  body: "A new component is only created when the same structure repeats with the same intent. Two cards on two pages does not justify a Card component. Five does.",
                },
              ]).map((g, i) => (
                <div key={g.rule} style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                  padding: "24px",
                  display: "grid",
                  gridTemplateColumns: "60px 1fr",
                  gap: "16px",
                  alignItems: "start",
                }}>
                  <p style={{
                    fontFamily: "var(--font-mono)", fontSize: "var(--text-mono)",
                    letterSpacing: "0.08em", color: "var(--muted)", margin: 0,
                  }}>
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <div>
                    <p style={{
                      fontFamily: "var(--font-body)", fontSize: "var(--text-title-sm)",
                      fontWeight: 500, letterSpacing: "-0.015em",
                      color: "var(--text)", margin: 0, marginBottom: "8px",
                    }}>
                      {g.rule}
                    </p>
                    <p style={{
                      fontFamily: "var(--font-body)", fontSize: "var(--text-body)",
                      color: "var(--muted2)", margin: 0, lineHeight: 1.6,
                    }}>
                      {g.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* 14 — Future scalability */}
          <Section
            id="future"
            number="14"
            title="Future scalability vision"
            description="What this system would need to grow into a multi-product design language."
          >
            <Prose>
              <Paragraph>
                The current system is sized for one product: this portfolio. Scaling it to
                multiple products would mean three additions, in order: a semantic token layer,
                a multi-theme architecture, and a component variant taxonomy.
              </Paragraph>
              <Paragraph>
                The <strong>semantic token layer</strong> would sit between the primitive
                tokens (colors, sizes) and the components. Today, a button reads{" "}
                <TokenPill token="--surface" /> directly. In a multi-product system, the button
                would read <TokenPill token="--button-bg" />, and{" "}
                <TokenPill token="--button-bg" /> would resolve to <TokenPill token="--surface" />
                {" "}in this product and to something else in a future product. The semantic
                layer is what lets the same component travel.
              </Paragraph>
              <Paragraph>
                The <strong>multi-theme architecture</strong> already partially exists — light
                and dark themes are token redefinitions in <TokenPill token="globals.css" />.
                Scaling means treating "theme" as a generalized concept (not just light/dark)
                with explicit theme contracts that any product can implement.
              </Paragraph>
              <Paragraph>
                Finally, a <strong>component variant taxonomy</strong> using{" "}
                <TokenPill token="class-variance-authority" /> (already a dependency here)
                would let components grow more variants without growing more components. A
                button with <TokenPill token="size" />, <TokenPill token="tone" />, and{" "}
                <TokenPill token="emphasis" /> dimensions can replace five separate button
                components.
              </Paragraph>
              <Paragraph>
                None of this is urgent for a portfolio of one. All of it is the natural next
                step the day a second product asks to use the same system.
              </Paragraph>
            </Prose>
          </Section>

        </main>
      </div>

      <Footer />

      {/* Mobile: hide the sidebar, the content gets full width */}
      <style jsx global>{`
        @media (max-width: 1023px) {
          .ds-sidebar { display: none; }
          .ds-source-plate { grid-template-columns: 1fr !important; gap: 32px !important; }
          .ds-wing-row { grid-template-columns: auto 1fr !important; row-gap: 4px; }
          .ds-wing-row > :nth-child(3),
          .ds-wing-row > :nth-child(4) { grid-column: 2; }
        }
      `}</style>
    </>
  );
}
