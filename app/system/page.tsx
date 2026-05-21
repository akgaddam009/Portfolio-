"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";
import Footer from "@/components/Footer";

/* Minimal landing for the portfolio's design system documentation.
   Visual showcase of the actual tokens powering this site — colors,
   type scale, surfaces. Every swatch and sample on this page is the
   live value from app/globals.css, not a screenshot. */

const EASE = [0.22, 1, 0.36, 1] as const;

type Swatch = { name: string; token: string };

const COLOR_SWATCHES: Swatch[] = [
  { name: "Page canvas",      token: "var(--bg)" },
  { name: "Surface",          token: "var(--surface)" },
  { name: "Surface 2",        token: "var(--surface2)" },
  { name: "Border",           token: "var(--border)" },
  { name: "Text",             token: "var(--text)" },
  { name: "Text display",     token: "var(--text-display)" },
  { name: "Muted",            token: "var(--muted)" },
  { name: "Muted 2",          token: "var(--muted2)" },
];

const TYPE_SAMPLES = [
  { label: "Display",  sample: "Design system documentation", style: { fontFamily: "var(--font-body)", fontSize: "var(--text-display)", fontWeight: 300, lineHeight: 1.15, letterSpacing: "-0.03em" } },
  { label: "Title lg", sample: "Tokens, motion, and patterns",  style: { fontFamily: "var(--font-body)", fontSize: "var(--text-title-lg)", fontWeight: 500, letterSpacing: "-0.025em" } },
  { label: "Body lg",  sample: "Maintained as code, not Figma.", style: { fontFamily: "var(--font-body)", fontSize: "var(--text-body-lg)", lineHeight: 1.65 } },
  { label: "Body",     sample: "The system you see rendered around you is the same system documented here.", style: { fontFamily: "var(--font-body)", fontSize: "var(--text-body)", lineHeight: 1.65 } },
  { label: "Mono",     sample: "ARUN GADDAM · DESIGN SYSTEM", style: { fontFamily: "var(--font-mono)", fontSize: "var(--text-mono-lg)", letterSpacing: "0.1em", textTransform: "uppercase" as const } },
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
        {/* Hero */}
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
                fontWeight: 300, lineHeight: 1.25,
                letterSpacing: "-0.03em", color: "var(--text)",
                marginBottom: "24px",
              }}>
                Design system documentation
              </h1>

              <p style={{
                fontFamily: "var(--font-body)", fontSize: "var(--text-body-lg)",
                lineHeight: 1.7, color: "var(--muted2)", marginBottom: "16px",
              }}>
                This is the design system documentation of this portfolio — tokens, type scale, and surfaces that power every page you've browsed.
              </p>

              <p style={{
                fontFamily: "var(--font-body)", fontSize: "var(--text-body-lg)",
                lineHeight: 1.7, color: "var(--muted2)", marginBottom: "0",
              }}>
                Maintained as code, not Figma. Everything below is the live value pulled from <code style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-body)", background: "var(--surface2)", padding: "2px 6px", borderRadius: "4px" }}>app/globals.css</code>.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Colors */}
        <section style={{ padding: "var(--space-7) 0", borderTop: "1px solid var(--border)" }}>
          <div className="page-pad">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <p style={{
                fontFamily: "var(--font-mono)", fontSize: "var(--text-eyebrow)",
                letterSpacing: "0.1em", textTransform: "uppercase",
                color: "var(--muted)", marginBottom: "20px",
              }}>
                Color tokens
              </p>

              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                gap: "16px",
              }}>
                {COLOR_SWATCHES.map((s) => (
                  <div key={s.name} style={{
                    background: "var(--surface)", border: "1px solid var(--border)",
                    borderRadius: "12px", padding: "12px", display: "flex",
                    flexDirection: "column", gap: "10px",
                  }}>
                    <div style={{
                      width: "100%", aspectRatio: "16 / 9",
                      borderRadius: "8px", background: s.token,
                      border: "1px solid var(--border)",
                    }} />
                    <div>
                      <p style={{
                        fontFamily: "var(--font-body)", fontSize: "var(--text-body)",
                        color: "var(--text)", margin: 0, marginBottom: "2px",
                      }}>
                        {s.name}
                      </p>
                      <p style={{
                        fontFamily: "var(--font-mono)", fontSize: "var(--text-mono)",
                        color: "var(--muted)", margin: 0, letterSpacing: "0.02em",
                      }}>
                        {s.token}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Type scale */}
        <section style={{ padding: "var(--space-7) 0", borderTop: "1px solid var(--border)" }}>
          <div className="page-pad">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <p style={{
                fontFamily: "var(--font-mono)", fontSize: "var(--text-eyebrow)",
                letterSpacing: "0.1em", textTransform: "uppercase",
                color: "var(--muted)", marginBottom: "20px",
              }}>
                Type scale
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {TYPE_SAMPLES.map((t) => (
                  <div key={t.label} style={{
                    display: "grid", gridTemplateColumns: "120px 1fr",
                    gap: "24px", alignItems: "baseline",
                    paddingBottom: "20px", borderBottom: "1px solid var(--border)",
                  }}>
                    <p style={{
                      fontFamily: "var(--font-mono)", fontSize: "var(--text-mono)",
                      letterSpacing: "0.08em", textTransform: "uppercase",
                      color: "var(--muted)", margin: 0,
                    }}>
                      {t.label}
                    </p>
                    <p style={{ ...t.style, color: "var(--text)", margin: 0 }}>
                      {t.sample}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Spacing scale */}
        <section style={{ padding: "var(--space-7) 0", borderTop: "1px solid var(--border)" }}>
          <div className="page-pad">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <p style={{
                fontFamily: "var(--font-mono)", fontSize: "var(--text-eyebrow)",
                letterSpacing: "0.1em", textTransform: "uppercase",
                color: "var(--muted)", marginBottom: "12px",
              }}>
                Spacing scale
              </p>
              <p style={{
                fontFamily: "var(--font-body)", fontSize: "var(--text-body)",
                color: "var(--muted2)", marginBottom: "24px", maxWidth: "560px",
              }}>
                4-px base step. The 44-px stop is the WCAG 2.5.5 touch-target floor — every interactive element on this site hits or exceeds it.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {([
                  { token: "--space-1",  px: 4  },
                  { token: "--space-2",  px: 8  },
                  { token: "--space-3",  px: 12 },
                  { token: "--space-4",  px: 16 },
                  { token: "--space-5",  px: 20 },
                  { token: "--space-6",  px: 24 },
                  { token: "--space-7",  px: 32 },
                  { token: "--space-8",  px: 44 },
                  { token: "--space-9",  px: 48 },
                  { token: "--space-10", px: 64 },
                  { token: "--space-11", px: 96 },
                ]).map(s => (
                  <div key={s.token} style={{
                    display: "grid", gridTemplateColumns: "120px 80px 1fr",
                    gap: "16px", alignItems: "center",
                  }}>
                    <p style={{
                      fontFamily: "var(--font-mono)", fontSize: "var(--text-mono)",
                      color: "var(--muted)", margin: 0, letterSpacing: "0.02em",
                    }}>
                      {s.token}
                    </p>
                    <p style={{
                      fontFamily: "var(--font-mono)", fontSize: "var(--text-mono)",
                      color: "var(--text)", margin: 0,
                    }}>
                      {s.px}px
                    </p>
                    <div style={{
                      height: "16px", width: `${s.px}px`, maxWidth: "100%",
                      background: "var(--text)", borderRadius: "2px",
                    }} />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Radius scale */}
        <section style={{ padding: "var(--space-7) 0", borderTop: "1px solid var(--border)" }}>
          <div className="page-pad">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <p style={{
                fontFamily: "var(--font-mono)", fontSize: "var(--text-eyebrow)",
                letterSpacing: "0.1em", textTransform: "uppercase",
                color: "var(--muted)", marginBottom: "20px",
              }}>
                Radius scale
              </p>

              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                {([
                  { token: "--radius-xs",  px: 4,  use: "Focus ring" },
                  { token: "--radius-sm",  px: 8,  use: "Small button" },
                  { token: "--radius-md",  px: 12, use: "Card" },
                  { token: "--radius-lg",  px: 16, use: "Hero media" },
                  { token: "--radius-xl",  px: 24, use: "Feature media" },
                ]).map(r => (
                  <div key={r.token} style={{
                    display: "flex", flexDirection: "column", gap: "10px",
                    minWidth: "120px",
                  }}>
                    <div style={{
                      width: "80px", height: "80px",
                      borderRadius: `${r.px}px`,
                      background: "var(--surface2)",
                      border: "1px solid var(--border)",
                    }} />
                    <div>
                      <p style={{
                        fontFamily: "var(--font-mono)", fontSize: "var(--text-mono)",
                        color: "var(--text)", margin: 0, marginBottom: "2px",
                      }}>
                        {r.px}px
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

        {/* Elevation / shadow */}
        <section style={{ padding: "var(--space-7) 0", borderTop: "1px solid var(--border)" }}>
          <div className="page-pad">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <p style={{
                fontFamily: "var(--font-mono)", fontSize: "var(--text-eyebrow)",
                letterSpacing: "0.1em", textTransform: "uppercase",
                color: "var(--muted)", marginBottom: "20px",
              }}>
                Elevation
              </p>

              <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
                {([
                  { token: "--card-shadow",       label: "Rest"  },
                  { token: "--card-shadow-hover", label: "Hover" },
                ]).map(e => (
                  <div key={e.token} style={{
                    display: "flex", flexDirection: "column", gap: "10px",
                  }}>
                    <div style={{
                      width: "160px", height: "120px",
                      borderRadius: "12px",
                      background: "var(--surface)",
                      boxShadow: `var(${e.token})`,
                    }} />
                    <p style={{
                      fontFamily: "var(--font-body)", fontSize: "var(--text-body)",
                      color: "var(--text)", margin: 0,
                    }}>
                      {e.label}
                    </p>
                    <p style={{
                      fontFamily: "var(--font-mono)", fontSize: "var(--text-mono)",
                      color: "var(--muted)", margin: 0, letterSpacing: "0.02em",
                    }}>
                      {e.token}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Motion */}
        <section style={{ padding: "var(--space-7) 0", borderTop: "1px solid var(--border)" }}>
          <div className="page-pad">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <p style={{
                fontFamily: "var(--font-mono)", fontSize: "var(--text-eyebrow)",
                letterSpacing: "0.1em", textTransform: "uppercase",
                color: "var(--muted)", marginBottom: "12px",
              }}>
                Motion
              </p>
              <p style={{
                fontFamily: "var(--font-body)", fontSize: "var(--text-body)",
                color: "var(--muted2)", marginBottom: "24px", maxWidth: "560px",
              }}>
                One easing curve, two durations. <code style={{ fontFamily: "var(--font-mono)", background: "var(--surface2)", padding: "2px 6px", borderRadius: "4px" }}>cubic-bezier(0.22, 1, 0.36, 1)</code> — cinematic decel.
                Quick interactions at 180ms; reveals and section transitions at 550ms.
              </p>

              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                {([
                  { dur: 0.18, label: "180ms — quick (hover, color shift)" },
                  { dur: 0.55, label: "550ms — reveal (section entry, page transition)" },
                ]).map(m => (
                  <motion.div
                    key={m.dur}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, margin: "-10px" }}
                    transition={{ duration: m.dur, ease: EASE, repeat: Infinity, repeatType: "reverse", repeatDelay: 1.5 }}
                    style={{
                      padding: "16px 20px",
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                      borderRadius: "12px",
                      boxShadow: "var(--card-shadow)",
                      minWidth: "240px",
                    }}
                  >
                    <p style={{
                      fontFamily: "var(--font-body)", fontSize: "var(--text-body)",
                      color: "var(--text)", margin: 0,
                    }}>
                      {m.label}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Button tiers */}
        <section style={{ padding: "var(--space-7) 0 var(--space-9)", borderTop: "1px solid var(--border)" }}>
          <div className="page-pad">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <p style={{
                fontFamily: "var(--font-mono)", fontSize: "var(--text-eyebrow)",
                letterSpacing: "0.1em", textTransform: "uppercase",
                color: "var(--muted)", marginBottom: "12px",
              }}>
                Button system — three tiers, no primary by design
              </p>
              <p style={{
                fontFamily: "var(--font-body)", fontSize: "var(--text-body)",
                color: "var(--muted2)", marginBottom: "24px", maxWidth: "560px",
              }}>
                The portfolio is read, not pitched. Every action is opt-in — contact, LinkedIn, CV read as a triplet without a hero button pulling attention from the work.
              </p>

              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center" }}>
                {/* Tier 1 — Page chrome */}
                <div style={{
                  height: "44px", padding: "0 18px", borderRadius: "12px",
                  background: "var(--surface)", boxShadow: "var(--card-shadow)",
                  display: "inline-flex", alignItems: "center",
                  fontFamily: "var(--font-body)", fontSize: "var(--text-body-lg)",
                  color: "var(--text)",
                }}>
                  Tier 1 · Chrome
                </div>

                {/* Tier 2 — Inline action */}
                <div style={{
                  padding: "8px 14px", borderRadius: "8px",
                  background: "var(--surface)", border: "1px solid var(--border)",
                  display: "inline-flex", alignItems: "center",
                  fontFamily: "var(--font-mono)", fontSize: "var(--text-mono-lg)",
                  letterSpacing: "0.08em", textTransform: "uppercase",
                  color: "var(--text)",
                }}>
                  Tier 2 · Inline
                </div>

                {/* Tier 3 — Metadata tag */}
                <div style={{
                  padding: "4px 8px", borderRadius: "6px",
                  background: "var(--surface2)",
                  display: "inline-flex", alignItems: "center",
                  fontFamily: "var(--font-mono)", fontSize: "var(--text-eyebrow)",
                  letterSpacing: "0.08em", textTransform: "uppercase",
                  color: "var(--muted)",
                }}>
                  Tier 3 · Tag
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
