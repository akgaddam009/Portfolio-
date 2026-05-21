"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { InlineChip, type ChipTone } from "@/components/ui/InlineChip";

const EASE = [0.22, 1, 0.36, 1] as const;

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontFamily: "var(--font-mono)", fontSize: "var(--text-eyebrow)",
      letterSpacing: "0.1em", textTransform: "uppercase",
      color: "var(--muted)", marginBottom: "8px",
    }}>
      {children}
    </p>
  );
}

function SectionDescription({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontFamily: "var(--font-body)", fontSize: "var(--text-body)",
      color: "var(--muted2)", marginBottom: "32px", maxWidth: "560px", lineHeight: 1.6,
    }}>
      {children}
    </p>
  );
}

function PreviewBox({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: "var(--chrome)",
      border: "1px solid var(--border)",
      borderRadius: "12px",
      padding: "40px 32px",
      display: "flex",
      flexWrap: "wrap",
      gap: "16px",
      alignItems: "center",
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
  { label: "Display",   token: "--text-display",   size: "clamp(26px, 4vw, 44px)", weight: 300, tracking: "-0.03em", sample: "Design systems at scale" },
  { label: "Title LG",  token: "--text-title-lg",  size: "clamp(20px, 2.2vw, 24px)", weight: 500, tracking: "-0.025em", sample: "Tokens, motion, and patterns" },
  { label: "Title",     token: "--text-title",     size: "18px", weight: 500, tracking: "-0.02em", sample: "Component architecture" },
  { label: "Title SM",  token: "--text-title-sm",  size: "16px", weight: 500, tracking: "-0.015em", sample: "Consistent visual language" },
  { label: "Lead",      token: "--text-lead",      size: "15px", weight: 400, tracking: "-0.01em", sample: "Built from a single source of truth." },
  { label: "Body LG",   token: "--text-body-lg",   size: "14px", weight: 400, tracking: "-0.01em", sample: "Maintained as code, not Figma." },
  { label: "Body",      token: "--text-body",      size: "13px", weight: 400, tracking: "0", sample: "Every swatch and sample is a live CSS variable from globals.css." },
  { label: "Caption",   token: "--text-caption",   size: "12px", weight: 400, tracking: "0", sample: "Secondary label. Not for primary content." },
  { label: "Mono LG",   token: "--text-mono-lg",   size: "11px", weight: 400, tracking: "0.08em", sample: "ARUN GADDAM · UX PORTFOLIO", mono: true },
  { label: "Mono",      token: "--text-mono",      size: "10px", weight: 400, tracking: "0.08em", sample: "DESIGN SYSTEM · TOKENS", mono: true },
  { label: "Eyebrow",   token: "--text-eyebrow",   size: "9px",  weight: 400, tracking: "0.1em",  sample: "COLOR TOKENS · SECTION LABEL", mono: true },
];

export default function DesignSystemPage() {
  return (
    <>
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 10,
        padding: "12px 0",
      }}>
        <div className="page-pad" style={{ display: "flex", justifyContent: "flex-end" }}>
          <ThemeToggle />
        </div>
      </header>

      <main style={{ paddingTop: "100px" }}>

        {/* ── Hero ── */}
        <section style={{ padding: "var(--space-9) 0 var(--space-7)" }}>
          <div className="page-pad">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: EASE }}
              style={{ maxWidth: "720px" }}
            >
              <Link
                href="/"
                style={{
                  fontFamily: "var(--font-mono)", fontSize: "var(--text-mono)",
                  letterSpacing: "0.08em", textTransform: "uppercase",
                  color: "var(--muted)", padding: "8px 4px",
                  display: "inline-flex", alignItems: "center", gap: "4px",
                  marginBottom: "32px", transition: "color 0.18s",
                }}
                onMouseEnter={e => { e.currentTarget.style.color = "var(--text)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "var(--muted)"; }}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                </svg>
                Back
              </Link>

              <p style={{
                fontFamily: "var(--font-mono)", fontSize: "var(--text-eyebrow)",
                letterSpacing: "0.1em", textTransform: "uppercase",
                color: "var(--muted)", marginBottom: "12px",
              }}>
                Portfolio Design Language
              </p>

              <h1 style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 300, lineHeight: 1.2,
                letterSpacing: "-0.03em", color: "var(--text)",
                marginBottom: "20px",
              }}>
                Design system
              </h1>

              <p style={{
                fontFamily: "var(--font-body)", fontSize: "var(--text-body-lg)",
                lineHeight: 1.7, color: "var(--muted2)", marginBottom: "16px",
              }}>
                An opinionated system. No primary buttons. One easing curve. Maintained as code,
                not Figma. Every page in this portfolio renders from the tokens below — the site
                you&apos;re browsing <em>is</em> the documentation.
              </p>

              <p style={{
                fontFamily: "var(--font-body)", fontSize: "var(--text-body-lg)",
                lineHeight: 1.7, color: "var(--muted2)",
              }}>
                There is no design-vs-engineering handoff. Pin every visual decision to a CSS
                variable in <code style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-body)", background: "var(--surface2)", padding: "2px 6px", borderRadius: "4px" }}>globals.css</code>, and drift dies.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── Principles ── */}
        <section style={{ padding: "var(--space-7) 0", borderTop: "1px solid var(--border)" }}>
          <div className="page-pad">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <SectionLabel>Principles</SectionLabel>
              <SectionDescription>
                Four opinions that shape every decision below.
              </SectionDescription>

              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "16px",
              }}>
                {([
                  {
                    n: "01",
                    title: "No primary by design",
                    body: "Three button tiers, none dominant. The work is the hero. Visitors read, they don’t get pitched.",
                  },
                  {
                    n: "02",
                    title: "One easing curve",
                    body: "Every transition uses cubic-bezier(0.22, 1, 0.36, 1). One motion vocabulary across the entire site.",
                  },
                  {
                    n: "03",
                    title: "Maintained as code",
                    body: "No Figma file. No handoff. Tokens live in globals.css. Drift is impossible because there’s only one source.",
                  },
                  {
                    n: "04",
                    title: "44px is the floor",
                    body: "WCAG 2.5.5 touch-target compliance built into the spacing scale itself — not enforced by audit later.",
                  },
                ]).map(p => (
                  <div key={p.n} style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    padding: "24px",
                  }}>
                    <p style={{
                      fontFamily: "var(--font-mono)", fontSize: "var(--text-mono)",
                      letterSpacing: "0.08em",
                      color: "var(--muted)", margin: 0, marginBottom: "16px",
                    }}>
                      {p.n}
                    </p>
                    <p style={{
                      fontFamily: "var(--font-body)", fontSize: "var(--text-title-sm)",
                      fontWeight: 500, letterSpacing: "-0.015em",
                      color: "var(--text)", margin: 0, marginBottom: "8px",
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
            </motion.div>
          </div>
        </section>

        {/* ── Colors ── */}
        <section style={{ padding: "var(--space-7) 0", borderTop: "1px solid var(--border)" }}>
          <div className="page-pad">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <SectionLabel>Color tokens</SectionLabel>
              <SectionDescription>
                Apple-inspired light system. Pure white is the elevated layer; the page canvas
                sits on a tinted cool gray. All grays carry a cool undertone via systemGray — the
                technical move that reads "premium."
              </SectionDescription>

              <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
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
                          borderRadius: "10px", padding: "12px",
                          display: "flex", flexDirection: "column", gap: "10px",
                        }}>
                          <div style={{
                            width: "100%", aspectRatio: "4 / 3",
                            borderRadius: "6px", background: `var(${s.token})`,
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
                              color: "var(--muted2)", margin: 0, letterSpacing: "0.04em",
                              marginTop: "2px",
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
            </motion.div>
          </div>
        </section>

        {/* ── Typography ── */}
        <section style={{ padding: "var(--space-7) 0", borderTop: "1px solid var(--border)" }}>
          <div className="page-pad">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <SectionLabel>Typography</SectionLabel>
              <SectionDescription>
                Inter for body, DM Mono for data and labels. One type scale across the entire
                portfolio — no ad-hoc font sizes.
              </SectionDescription>

              <div style={{
                border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden",
              }}>
                {TYPE_SCALE.map((t, i) => (
                  <div key={t.token} style={{
                    display: "grid",
                    gridTemplateColumns: "140px 1fr 120px",
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
                      color: "var(--text)", margin: 0,
                      lineHeight: 1.3,
                    }}>
                      {t.sample}
                    </p>
                    <TokenPill token={t.token} />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Buttons ── */}
        <section style={{ padding: "var(--space-7) 0", borderTop: "1px solid var(--border)" }}>
          <div className="page-pad">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <SectionLabel>Buttons — three tiers, no primary</SectionLabel>
              <SectionDescription>
                The portfolio is read, not pitched. Every action is opt-in. No hero CTA pulls
                attention from the work — contact, LinkedIn, and CV read as a quiet triplet.
              </SectionDescription>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {([
                  {
                    variant: "chrome" as const,
                    label: "Tier 1 · Chrome",
                    desc: "Page chrome — nav, floating actions. Elevated shadow, no border.",
                    tokens: ["--surface", "--card-shadow", "--radius-md"],
                    example: "Contact",
                  },
                  {
                    variant: "inline" as const,
                    label: "Tier 2 · Inline",
                    desc: "Inline actions within content — download CV, view link, secondary CTAs.",
                    tokens: ["--surface", "--border", "--radius-sm"],
                    example: "Download CV",
                  },
                  {
                    variant: "tag" as const,
                    label: "Tier 3 · Tag",
                    desc: "Metadata labels and filter chips. Lowest visual weight, no border.",
                    tokens: ["--surface2", "--radius-xs"],
                    example: "UX · Product",
                  },
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
            </motion.div>
          </div>
        </section>

        {/* ── Badges ── */}
        <section style={{ padding: "var(--space-7) 0", borderTop: "1px solid var(--border)" }}>
          <div className="page-pad">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <SectionLabel>Badges</SectionLabel>
              <SectionDescription>
                Mono-uppercase chips used for case study tags, status labels, and metadata.
                Three semantic variants map to neutral, emphasis, and success states.
              </SectionDescription>

              <PreviewBox>
                <div style={{ display: "flex", flexDirection: "column", gap: "24px", width: "100%" }}>
                  {([
                    { variant: "default" as const, items: ["UX Design", "Product Strategy", "Research", "0→1"] },
                    { variant: "accent" as const, items: ["AI Exploration", "Beta", "New"] },
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
                      {row.items.map(item => (
                        <Badge key={item} variant={row.variant}>{item}</Badge>
                      ))}
                    </div>
                  ))}
                </div>
              </PreviewBox>
            </motion.div>
          </div>
        </section>

        {/* ── Chip tones ── */}
        <section style={{ padding: "var(--space-7) 0", borderTop: "1px solid var(--border)" }}>
          <div className="page-pad">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <SectionLabel>Chip tones — inline emphasis</SectionLabel>
              <SectionDescription>
                Six tones for highlighting phrases inside prose and headings. Each tone signals
                a different semantic role. Two visual variants: <strong>chip</strong> (rounded
                pill, tinted text) for noun phrases, and <strong>strip</strong> (rectangular
                highlight, body text color) for multi-word emphasis.
              </SectionDescription>

              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: "12px",
              }}>
                {([
                  { tone: "indigo",  use: "Default emphasis · concept",     example: "AI copilot" },
                  { tone: "teal",    use: "Process · methodology",          example: "research-led" },
                  { tone: "amber",   use: "Caution · qualifier",            example: "ambiguous" },
                  { tone: "violet",  use: "Insight · principle",            example: "first principles" },
                  { tone: "emerald", use: "Outcome · positive metric",      example: "68% adoption" },
                  { tone: "sage",    use: "Decorative · soft highlight",    example: "studio of one" },
                ] as { tone: ChipTone; use: string; example: string }[]).map(t => (
                  <div key={t.tone} style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
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
                        <div>
                          <InlineChip label={t.example} tone={t.tone} scale="match" />
                        </div>
                      </div>
                      <div>
                        <p style={{
                          fontFamily: "var(--font-mono)", fontSize: "var(--text-mono)",
                          letterSpacing: "0.06em", textTransform: "uppercase",
                          color: "var(--muted)", margin: 0, marginBottom: "8px",
                        }}>
                          Strip
                        </p>
                        <div>
                          <InlineChip label={t.example} tone={t.tone} scale="match" variant="strip" />
                        </div>
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
            </motion.div>
          </div>
        </section>

        {/* ── Cards ── */}
        <section style={{ padding: "var(--space-7) 0", borderTop: "1px solid var(--border)" }}>
          <div className="page-pad">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <SectionLabel>Cards</SectionLabel>
              <SectionDescription>
                Two states: rest and hover. Shadow lifts and color shifts on interaction —
                a single consistent pattern across every work card on the homepage.
              </SectionDescription>

              <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
                {([
                  { label: "Rest", shadow: "var(--card-shadow)", token: "--card-shadow" },
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
            </motion.div>
          </div>
        </section>

        {/* ── Inputs ── */}
        <section style={{ padding: "var(--space-7) 0", borderTop: "1px solid var(--border)" }}>
          <div className="page-pad">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <SectionLabel>Inputs</SectionLabel>
              <SectionDescription>
                Border animates from <TokenPill token="--border" /> to <TokenPill token="--text" /> on focus.
                No box-shadow ring — the stroke shift alone is sufficient signal at this weight.
              </SectionDescription>

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
                  <Input
                    placeholder="Wrong password"
                    style={{ borderColor: "var(--accent-error)" }}
                    defaultValue="incorrect"
                  />
                </div>
              </PreviewBox>
            </motion.div>
          </div>
        </section>

        {/* ── Patterns ── */}
        <section style={{ padding: "var(--space-7) 0", borderTop: "1px solid var(--border)" }}>
          <div className="page-pad">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <SectionLabel>Patterns — components in composition</SectionLabel>
              <SectionDescription>
                A real work card from the homepage, built entirely from the tokens and
                components above. Each annotation maps to a piece earlier in this doc.
              </SectionDescription>

              <div style={{
                display: "grid",
                gridTemplateColumns: "minmax(280px, 1fr) minmax(280px, 360px)",
                gap: "32px",
                alignItems: "start",
              }}>
                {/* Composed card */}
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
                        color: "var(--text)", margin: 0, marginBottom: "8px",
                        lineHeight: 1.3,
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

                {/* Anatomy */}
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
            </motion.div>
          </div>
        </section>

        {/* ── Spacing ── */}
        <section style={{ padding: "var(--space-7) 0", borderTop: "1px solid var(--border)" }}>
          <div className="page-pad">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <SectionLabel>Spacing scale</SectionLabel>
              <SectionDescription>
                4-px base step. The 44-px stop is the WCAG 2.5.5 touch-target floor — every
                interactive element on this site hits or exceeds it.
              </SectionDescription>

              <div style={{
                border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden",
              }}>
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
                    gridTemplateColumns: "130px 60px 1fr 160px",
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
                      background: "var(--text)", borderRadius: "2px", opacity: 0.15 + (s.px / 96) * 0.85,
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
            </motion.div>
          </div>
        </section>

        {/* ── Radius ── */}
        <section style={{ padding: "var(--space-7) 0", borderTop: "1px solid var(--border)" }}>
          <div className="page-pad">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <SectionLabel>Radius scale</SectionLabel>
              <SectionDescription>
                Corners telegraph affordance. Larger radius = softer, more prominent UI element.
              </SectionDescription>

              <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", alignItems: "flex-end" }}>
                {([
                  { token: "--radius-xs",   px: 4,  use: "Focus ring" },
                  { token: "--radius-sm",   px: 8,  use: "Inline button" },
                  { token: "--radius-md",   px: 12, use: "Card" },
                  { token: "--radius-lg",   px: 16, use: "Hero media" },
                  { token: "--radius-xl",   px: 24, use: "Feature media" },
                  { token: "--radius-pill", px: 9999, use: "Pill / chip" },
                ]).map(r => (
                  <div key={r.token} style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "flex-start" }}>
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
            </motion.div>
          </div>
        </section>

        {/* ── Motion ── */}
        <section style={{ padding: "var(--space-7) 0 var(--space-9)", borderTop: "1px solid var(--border)" }}>
          <div className="page-pad">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <SectionLabel>Motion</SectionLabel>
              <SectionDescription>
                One easing curve, three durations.{" "}
                <code style={{ fontFamily: "var(--font-mono)", background: "var(--surface2)", padding: "2px 6px", borderRadius: "4px" }}>
                  cubic-bezier(0.22, 1, 0.36, 1)
                </code>{" "}
                — cinematic deceleration. Fast for micro-interactions; slow for reveals.
              </SectionDescription>

              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                {([
                  { dur: 0.18, token: "--dur-fast", label: "180ms", desc: "Hover, color shift, icon swap" },
                  { dur: 0.32, token: "--dur-base", label: "320ms", desc: "State transitions, accordions" },
                  { dur: 0.65, token: "--dur-slow", label: "650ms", desc: "Page entry, section reveal" },
                ]).map(m => (
                  <div key={m.dur} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false, margin: "-10px" }}
                      transition={{ duration: m.dur, ease: EASE, repeat: Infinity, repeatType: "reverse", repeatDelay: 2 }}
                      style={{
                        padding: "20px 24px",
                        background: "var(--surface)",
                        border: "1px solid var(--border)",
                        borderRadius: "12px",
                        boxShadow: "var(--card-shadow)",
                        minWidth: "220px",
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
            </motion.div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
