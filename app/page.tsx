"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useRef, useCallback, useState, useEffect } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import LoadingScreen from "@/components/LoadingScreen";
import { MapLibreMap } from "@/components/ui/MapLibreMap";
import { caseStudies } from "@/lib/caseStudies";
import ISTClock from "@/components/ISTClock";
import { ArrowUpRight } from "@/components/ui/Icon";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ── Haptic utility — silently ignored on desktop ── */
const haptic = (pattern: number | number[]) => {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(pattern);
  }
};

/* ── Home nav — name + panel arrows ── */
const PANEL_LABELS = ["About", "Work", "AI", "Career", "Testimonials", "Contact"];

function HomeNav({ onPrev, onNext, activePanel }: { onPrev: () => void; onNext: () => void; activePanel: number }) {
  return (
    <header
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 200,
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        background: "transparent",
      }}
    >
      {/* Name + theme toggle */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Link
          href="/"
          aria-label="Home — Arun Gaddam"
          style={{
            fontFamily: "var(--font-logo)",
            fontSize: "12px",
            fontWeight: 500,
            color: "var(--text)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            height: "44px",
            padding: "0 14px 0 6px",
            borderRadius: "12px",
            border: "none",
            background: "var(--surface)",
            boxShadow: "var(--card-shadow)",
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            textDecoration: "none",
            userSelect: "none",
            transition: "box-shadow 0.25s cubic-bezier(0.22,1,0.36,1)",
          }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = "var(--card-shadow-hover)"; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = "var(--card-shadow)"; }}
        >
          <img
            src="/Illustration image .png"
            alt=""
            aria-hidden="true"
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              objectFit: "cover",
              objectPosition: "center top",
              display: "block",
            }}
          />
          Arun Gaddam
        </Link>
        <ThemeToggle />
      </div>

      {/* Panel dots + arrows */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        {/* Panel position dots */}
        <div className="panel-dots" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          {PANEL_LABELS.map((label, i) => (
            <div
              key={label}
              title={label}
              style={{
                width: i === activePanel ? "16px" : "5px",
                height: "5px",
                borderRadius: "3px",
                background: i === activePanel ? "var(--text)" : "var(--border)",
                transition: "width 0.3s cubic-bezier(0.22,1,0.36,1), background 0.3s",
              }}
            />
          ))}
        </div>

        {/* Arrows */}
        <div className="desktop-nav-arrows" style={{ display: "flex", gap: "6px" }}>
          {([
            { dir: "prev", fn: onPrev, d: "M14 6l-6 6 6 6" },
            { dir: "next", fn: onNext, d: "M10 6l6 6-6 6" },
          ] as const).map(({ dir, fn, d }) => {
            const disabled = (dir === "prev" && activePanel === 0) || (dir === "next" && activePanel === PANEL_LABELS.length - 1);
            return (
              <motion.button
                key={dir}
                onClick={disabled ? undefined : () => { haptic(8); fn(); }}
                whileTap={disabled ? {} : { scale: 0.88 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                title={dir === "prev" ? "Previous panel" : "Next panel"}
                aria-label={dir === "prev" ? "Previous panel" : "Next panel"}
                aria-disabled={disabled}
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  border: "none",
                  background: "var(--surface)",
                  boxShadow: "var(--card-shadow)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "box-shadow 0.25s cubic-bezier(0.22,1,0.36,1), opacity 0.2s",
                  opacity: disabled ? 0.3 : 1,
                  cursor: disabled ? "default" : "none",
                }}
                onMouseEnter={e => { if (!disabled) e.currentTarget.style.boxShadow = "var(--card-shadow-hover)"; }}
                onMouseLeave={e => { if (!disabled) e.currentTarget.style.boxShadow = "var(--card-shadow)"; }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d={d} />
                </svg>
              </motion.button>
            );
          })}
        </div>
      </div>
    </header>
  );
}

/* ── Shared panel header ── */
function PanelHeader({ label }: { label: string }) {
  return (
    <div className="panel-header-glass" style={{
      position: "sticky",
      top: 0,
      zIndex: 20,
      padding: "12px 24px",
      borderBottom: "1px solid color-mix(in srgb, var(--border) 50%, transparent)",
    }}>
      <p style={{
        fontFamily: "var(--font-mono)",
        fontSize: "10px",
        fontWeight: 400,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "var(--muted)",
      }}>
        {label}
      </p>
    </div>
  );
}

/* ── Panel 1: About ── */
/* ── Portrait: illustration by default, real photo on hover ── */
function PortraitMagnify() {
  const [hovered, setHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [leaving, setLeaving] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width  - 0.5; // -0.5 → 0.5
    const ny = (e.clientY - rect.top)  / rect.height - 0.5;
    setTilt({ x: nx * 14, y: -ny * 10 }); // rotateY, rotateX
    setLeaving(false);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    setLeaving(true);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div style={{ perspective: "700px", width: "100%", aspectRatio: "4 / 3" }}>
      <div
        ref={containerRef}
        onMouseEnter={() => { setHovered(true); setLeaving(false); }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          position: "relative",
          width: "100%", height: "100%",
          cursor: "pointer",
          borderRadius: "16px",
          overflow: "hidden",
          transform: `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
          transition: leaving ? "transform 0.55s cubic-bezier(0.22,1,0.36,1)" : "transform 0.08s linear",
          willChange: "transform",
        }}
      >
        {/* Illustrated portrait — default */}
        <img
          src="/Illustration image .png"
          alt="Arun Gaddam illustration"
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "cover", objectPosition: "center top",
            opacity: hovered ? 0 : 1,
            transition: "opacity 0.35s ease",
            display: "block",
          }}
        />
        {/* Real photo — revealed on hover */}
        <img
          src="/arun.JPG"
          alt="Arun Gaddam"
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "cover", objectPosition: "center top",
            filter: "grayscale(100%)",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.35s ease",
            display: "block",
          }}
        />
      </div>
    </div>
  );
}

const infoRows: { label: string; value: string; chips?: string[] }[] = [
  { label: "Role", value: "Senior Product Designer. I own the full design process, from discovery and strategy to final pixel." },
  { label: "Superpower", value: "Turning strategy into execution, ensuring clarity at the top and precision where it matters." },
  { label: "Focus", value: "Enterprise SaaS and consumer products at scale, driven by design, strategy, and research." },
  {
    label: "Experience",
    value: "Nearly a decade designing products for startups and large-scale platforms with millions of users. I focus on building scalable systems that solve real-world problems.",
    chips: ["Fintech", "Manufacturing", "Healthcare", "HRIS", "Entertainment", "ERP", "Customer Experience"],
  },
];

function AboutPanel() {
  return (
    <div>
      <PanelHeader label="About me" />
      <div style={{ padding: "16px 24px 48px" }}>

        {/* Hero headline — matches case study detail page hero typography:
            display scale, light weight, compressed tracking. Was 24px /
            weight 400 (body scale) which felt demoted next to the case
            study heroes. */}
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.05 }}
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(26px, 3.4vw, 38px)",
            fontWeight: 300,
            lineHeight: 1.15,
            letterSpacing: "-0.03em",
            color: "var(--text)",
            marginBottom: "20px",
          }}
        >
          I design products at the intersection of design, product thinking, and now vibe coding.
        </motion.h1>

        {/* Bio */}
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "14px",
            lineHeight: 1.65,
            letterSpacing: "-0.011em",
            color: "var(--muted)",
            marginBottom: "20px",
          }}
        >
          I&apos;m hands-on throughout the entire process, from strategy to execution. These days, I lean on AI to move faster and test ideas.
        </motion.p>

        {/* Info rows */}
        <div>
          {infoRows.map((row, i) => (
            <motion.div
              key={row.label}
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, ease: EASE, delay: i * 0.06 }}
            >
              <div
                style={{ padding: "12px 0", transition: "opacity 0.2s" }}
                onMouseEnter={e => {
                  e.currentTarget.style.opacity = "0.6";
                  const label = e.currentTarget.querySelector<HTMLElement>("[data-label]");
                  if (label) label.style.color = "var(--text)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.opacity = "1";
                  const label = e.currentTarget.querySelector<HTMLElement>("[data-label]");
                  if (label) label.style.color = "var(--muted)";
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                  <p
                    data-label="true"
                    style={{
                      fontFamily: "var(--font-mono)", fontSize: "9px",
                      letterSpacing: "0.1em", textTransform: "uppercase",
                      color: "var(--muted)", whiteSpace: "nowrap", fontWeight: 400,
                      transition: "color 0.2s",
                    }}
                  >
                    {row.label}
                  </p>
                  <div style={{ flex: 1, borderTop: "1px dashed var(--border)" }} />
                </div>
                <p style={{
                  fontFamily: "var(--font-body)", fontSize: "14px",
                  letterSpacing: "-0.01em",
                  color: "var(--muted2)", lineHeight: 1.65, fontWeight: 400,
                  marginBottom: row.chips ? "10px" : 0,
                }}>
                  {row.value}
                </p>
                {row.chips && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                    {row.chips.map(chip => (
                      <span key={chip} style={{
                        fontFamily: "var(--font-mono)", fontSize: "8px",
                        letterSpacing: "0.07em", textTransform: "uppercase",
                        padding: "3px 8px", borderRadius: "6px",
                        background: "var(--surface2)", color: "var(--muted)",
                        border: "1px solid var(--border)",
                      }}>
                        {chip}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Skills & Tools — marquee of chips, but with the same mono label +
            dashed-line header used by the rows above (Role, Focus, Experience,
            Superpower) for visual consistency. AI-forward sequence leads. */}
        {(() => {
          const skills = [
            "AI UX Design", "Vibe Coding", "Agentic AI", "Claude Code", "Cursor",
            "Figma", "UX Design", "UX Strategy", "UX Research",
            "Design Systems", "Prototyping", "Service Design",
            "Usability Testing", "Contextual Inquiry", "Service Blueprints",
            "Dovetail", "Framer", "Jobs-to-be-Done",
            "Information Architecture", "Interaction Design",
            "Next.js",
          ];
          const ticker = [...skills, ...skills];
          return (
            <motion.div
              className="skills-ticker"
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, ease: EASE, delay: 0.24 }}
              style={{ padding: "12px 0" }}
            >
              {/* Header row — matches the infoRow label style above */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <p style={{
                  fontFamily: "var(--font-mono)", fontSize: "9px",
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  color: "var(--muted)", whiteSpace: "nowrap", fontWeight: 400,
                }}>
                  Skills &amp; Tools
                </p>
                <div style={{ flex: 1, borderTop: "1px dashed var(--border)" }} />
              </div>

              {/* Marquee track */}
              <div style={{ overflow: "hidden", position: "relative" }}>
                <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "32px", background: "linear-gradient(to right, var(--bg), transparent)", zIndex: 1, pointerEvents: "none" }} />
                <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "32px", background: "linear-gradient(to left, var(--bg), transparent)", zIndex: 1, pointerEvents: "none" }} />
                <div
                  className="marquee-track"
                  style={{
                    ["--marquee-duration" as string]: "28s",
                    display: "flex", alignItems: "center", gap: "0", whiteSpace: "nowrap",
                  }}
                >
                  {ticker.map((skill, i) => (
                    <span key={`${skill}-${i}`} style={{ display: "inline-flex", alignItems: "center" }}>
                      <span style={{
                        fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 400,
                        letterSpacing: "-0.01em", color: "var(--muted2)",
                        padding: "4px 10px",
                        border: "1px solid var(--border)",
                        borderRadius: "9999px",
                        background: "var(--surface)",
                        marginRight: "6px",
                        whiteSpace: "nowrap",
                      }}>
                        {skill}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })()}

        {/* Availability anchor — closes the card with a clear signal,
            using the same mono label + dashed line as the rows above. The
            green status dot ties it to the brand accent (also in the OG image). */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: EASE, delay: 0.3 }}
        >
          <div style={{ padding: "12px 0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
              <p style={{
                fontFamily: "var(--font-mono)", fontSize: "9px",
                letterSpacing: "0.1em", textTransform: "uppercase",
                color: "var(--muted)", whiteSpace: "nowrap", fontWeight: 400,
              }}>
                Availability
              </p>
              <div style={{ flex: 1, borderTop: "1px dashed var(--border)" }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
              <span style={{
                width: "8px", height: "8px", borderRadius: "50%",
                background: "#34c759", display: "block", flexShrink: 0,
              }} />
              <p style={{
                fontFamily: "var(--font-body)", fontSize: "14px",
                letterSpacing: "-0.01em",
                color: "var(--muted2)", lineHeight: 1.65, fontWeight: 400,
              }}>
                Open to suitable opportunities
              </p>
            </div>

            {/* Links — paired with availability so the CTA fires after full context */}
            <div style={{ display: "flex", alignItems: "center", gap: "4px", flexWrap: "wrap" }}>
              {[
                { label: "LinkedIn", href: "https://linkedin.com/in/akgaddam", external: true },
                { label: "Medium", href: "https://medium.com/@akgaddam", external: true },
                { label: "CV", href: "https://drive.google.com/file/d/1VWajNl_cigKjLwMNevZIJXUm1bY3hoOs/view?usp=sharing", external: true },
              ].map(({ label, href, external }, i, arr) => (
                <span key={label} style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  <Link
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    style={{
                      fontFamily: "var(--font-mono)", fontSize: "9px",
                      letterSpacing: "0.08em", textTransform: "uppercase",
                      color: "var(--muted)",
                      padding: "4px 8px",
                      borderRadius: "6px",
                      display: "inline-flex", alignItems: "center", gap: "4px",
                      transition: "color 0.18s, background 0.18s",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.color = "var(--text)";
                      e.currentTarget.style.background = "var(--surface)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.color = "var(--muted)";
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    {label}
                    <ArrowUpRight size={10} strokeWidth={1.5} />
                  </Link>
                  {i < arr.length - 1 && (
                    <span style={{ color: "var(--muted)", fontFamily: "var(--font-mono)", fontSize: "9px", userSelect: "none", opacity: 0.4 }}>·</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}

/* ── Mesh thumbnail — mouse-reactive radial gradient orbs ── */
const meshPalettes = {
  light: [
    { base: "#f0ede8", orbs: ["#e8d5c4", "#d4c5e0", "#c4d8e0"] },
    { base: "#e8ecf0", orbs: ["#c4d4e8", "#d4e8d0", "#e0d4c4"] },
    { base: "#edf0e8", orbs: ["#d4e8c4", "#c4d8e0", "#e0c4d8"] },
    { base: "#f0e8ed", orbs: ["#e0c4d4", "#d4c4e8", "#c4e0d4"] },
    { base: "#e8f0ee", orbs: ["#c4e0d8", "#d8d4c4", "#d4c4e0"] },
    { base: "#f0ede8", orbs: ["#e0d4c0", "#c4d0e0", "#d8c4d8"] },
  ],
  dark: [
    { base: "#1a1714", orbs: ["#3d2e20", "#2a2040", "#1e3040"] },
    { base: "#14171a", orbs: ["#1e2e40", "#243820", "#402e1e"] },
    { base: "#151a14", orbs: ["#243820", "#1e2840", "#38182e"] },
    { base: "#1a1418", orbs: ["#3a1e2a", "#241838", "#183828"] },
    { base: "#14171a", orbs: ["#1e3040", "#382e18", "#281838"] },
    { base: "#1a1714", orbs: ["#382e1e", "#1e2e40", "#2e1e38"] },
  ],
};

function MeshThumbnail({ index, type, confidential }: {
  index: number; type?: string; confidential?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const raf = useRef<number | null>(null);
  const [isDark, setIsDark] = useState(false);

  // Watch data-theme attribute changes
  useEffect(() => {
    const check = () => setIsDark(document.documentElement.dataset.theme === "dark");
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  const palette = isDark
    ? meshPalettes.dark[index % meshPalettes.dark.length]
    : meshPalettes.light[index % meshPalettes.light.length];

  useEffect(() => () => { if (raf.current) cancelAnimationFrame(raf.current); }, []);

  // Theme-aware colour values
  const badgeBg   = isDark ? "rgba(0,0,0,0.4)"        : "rgba(255,255,255,0.6)";
  const badgeColor = isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.4)";

  return (
    <div
      ref={ref}
      style={{
        height: "192px",
        background: palette.base,
        position: "relative", overflow: "hidden",
      }}
    >
      <div className="paper-grain" />
      {confidential && (
        <div style={{
          position: "absolute", top: "10px", right: "10px",
          background: badgeBg,
          borderRadius: "6px", padding: "3px 8px",
          fontFamily: "var(--font-body)", fontSize: "11px",
          fontWeight: 510, letterSpacing: "-0.01em",
          color: badgeColor,
          transition: "background 0.3s, color 0.3s",
        }}>
          Confidential
        </div>
      )}
    </div>
  );
}

/* ── Panel 2: Selected Work ── */

const WORK_THUMBS: Record<string, string> = {
  "astra":                "/images/astra/overview.mov",
  "planful-esm":          "/images/planful/Untitled.mp4",
  "apple-business-listings": "/images/reputation/after.mov",
  "fancode-ftux":         "/images/fancode/user-journey-map.jpg",
  "fancode-homepage":     "/images/fancode/hp-overview.mov",
  "zetwerk-dc":           "/images/zetwerk/cover.png",
  "zetwerk-bu-ecosystem": "/images/zetwerk-bu/service-blueprint.png",
};

// Video file extensions that should render through <video> instead of <img>.
const isVideoThumb = (src: string) => /\.(mov|mp4|webm)$/i.test(src);

/* ── Count-up animation for metric values ── */
function MetricValue({ value }: { value: string }) {
  const [display, setDisplay] = useState(value);
  const ref   = useRef<HTMLSpanElement>(null);
  const fired = useRef(false);

  useEffect(() => {
    const match = value.match(/^([^0-9]*)(\d+)(.*)$/);
    if (!match) return;
    const [, prefix, numStr, suffix] = match;
    const target = parseInt(numStr, 10);
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || fired.current) return;
        fired.current = true;
        const duration = 1000;
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(2, -10 * p); // ease-out-expo
          setDisplay(p >= 1 ? value : `${prefix}${Math.round(eased * target)}${suffix}`);
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return <span ref={ref}>{display}</span>;
}

/* ─── Featured Design System card — leads the Selected Work panel ─────
   The design system extracted from this portfolio. Documents the actual
   tokens, components, and patterns in the live codebase — no speculation. */
function SystemFeatureCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{
        opacity: { duration: 0.5, ease: EASE },
        y: { type: "spring", stiffness: 320, damping: 28 },
      }}
    >
      <Link href="/system">
        <div
          className="work-card"
          style={{
            background: "var(--surface)",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "var(--card-shadow)",
            transition: "box-shadow 0.25s cubic-bezier(0.22,1,0.36,1)",
          }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = "var(--card-shadow-hover)"; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = "var(--card-shadow)"; }}
        >
          {/* Thumbnail — abstract MeshThumbnail (the portfolio's signature
              gradient-orb fallback). The card is about the design language
              itself, so the thumbnail leans into the portfolio's visual
              vocabulary instead of showing a literal page screenshot. */}
          <div style={{ position: "relative", height: "160px", overflow: "hidden", padding: "12px 12px 0" }}>
            <MeshThumbnail index={0} type="design-system" confidential={false} />
          </div>

          {/* Body */}
          <div style={{ padding: "12px 16px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap", marginBottom: "8px" }}>
              {["Design Language", "Built with Claude"].map(tag => (
                <span key={tag} style={{
                  fontFamily: "var(--font-mono)", fontSize: "9px",
                  letterSpacing: "0.06em", textTransform: "uppercase",
                  padding: "3px 8px", background: "var(--surface2)",
                  color: "var(--muted)", borderRadius: "8px",
                }}>
                  {tag}
                </span>
              ))}
            </div>

            <h3 style={{
              fontFamily: "var(--font-body)", fontSize: "15px", fontWeight: 590,
              lineHeight: 1.3, letterSpacing: "-0.012em",
              color: "var(--text)", marginBottom: "4px",
            }}>
              Portfolio Design Language
            </h3>

            <p style={{
              fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 400,
              lineHeight: 1.4, letterSpacing: "-0.13px",
              color: "var(--muted)", marginBottom: "12px",
            }}>
              Tokens, motion vocab, and interaction patterns. Documented as they exist in the live site.
            </p>

          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function WorkPanel() {
  return (
    <div id="work-panel">
      <PanelHeader label="Selected Work" />
      <div style={{ padding: "16px 24px 32px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>

          {caseStudies.filter(cs => cs.slug !== "astra").map((cs, i) => {
            const href = `/work/${cs.slug}`;
            return (
              <motion.div
                key={cs.slug}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -2 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{
                  opacity: { duration: 0.5, ease: EASE, delay: i * 0.06 },
                  y: { type: "spring", stiffness: 320, damping: 28 },
                }}
              >
                <Link href={href}>
                  <div
                    className="work-card"
                    style={{
                      background: "var(--surface)",
                      borderRadius: "16px",
                      overflow: "hidden",
                      boxShadow: "var(--card-shadow)",
                      transition: "box-shadow 0.25s cubic-bezier(0.22,1,0.36,1), transform 0.25s cubic-bezier(0.22,1,0.36,1)",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.boxShadow = "var(--card-shadow-hover)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.boxShadow = "var(--card-shadow)";
                    }}
                  >
                    {/* Thumbnail — always-visible image (or video for case studies
                        where motion communicates the design better), mesh as fallback */}
                    <div style={{ position: "relative", height: "160px", overflow: "hidden", padding: "12px 12px 0" }}>
                      {WORK_THUMBS[cs.slug] ? (
                        isVideoThumb(WORK_THUMBS[cs.slug]) ? (
                          <video
                            className="work-thumb"
                            src={WORK_THUMBS[cs.slug]}
                            autoPlay
                            loop
                            muted
                            playsInline
                            preload="metadata"
                            aria-hidden="true"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              objectPosition: "center top",
                              display: "block",
                              borderRadius: "8px 8px 0 0",
                              background: "var(--surface)",
                            }}
                          />
                        ) : (
                          <img
                            className="work-thumb"
                            src={WORK_THUMBS[cs.slug]}
                            alt=""
                            aria-hidden="true"
                            loading="lazy"
                            decoding="async"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              objectPosition: "center top",
                              display: "block",
                              borderRadius: "8px 8px 0 0",
                            }}
                          />
                        )
                      ) : (
                        <MeshThumbnail
                          index={i}
                          type={cs.type}
                          confidential={cs.confidential}
                        />
                      )}
                    </div>

                    {/* Body */}
                    <div style={{ padding: "12px 16px 16px" }}>
                      {/* Tags row — mono uppercase to match the system used everywhere
                          else (case study tags, panel headers). The numeric counter is
                          dropped: the cards already have a clear visual order. */}
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap", marginBottom: "8px" }}>
                        {cs.tags.slice(0, 2).map(tag => (
                          <span key={tag} style={{
                            fontFamily: "var(--font-mono)", fontSize: "9px",
                            letterSpacing: "0.06em", textTransform: "uppercase",
                            padding: "3px 8px", background: "var(--surface2)",
                            color: "var(--muted)", borderRadius: "8px",
                          }}>
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Title */}
                      <h3 style={{
                        fontFamily: "var(--font-body)", fontSize: "15px", fontWeight: 590,
                        lineHeight: 1.3, letterSpacing: "-0.012em",
                        color: "var(--text)", marginBottom: "4px",
                      }}>
                        {cs.title}
                      </h3>

                      {/* Subtitle */}
                      <p style={{
                        fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 400,
                        lineHeight: 1.4, letterSpacing: "-0.01em",
                        color: "var(--muted)", marginBottom: "12px",
                      }}>
                        {cs.subtitle}
                      </p>

                      {/* Primary metric block removed from the card to save vertical
                          space. The headline metric will live inside the case study
                          subtitle/summary text instead. MetricValue helper kept defined
                          in case a metric block is reintroduced later. */}
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── Panel 3: Career ── */
const YEAR_PX    = 56;   // px per year
const CAL_START  = 2012;
const CAL_END    = 2027;
const TOP_OFFSET = 20;   // px breathing room above the topmost card

type CareerItem = {
  type: "role" | "education" | "label";
  startYear: number;
  endYear?: number;
  title: string;
  subtitle?: string;
  dateLabel?: string;
  impact?: string;
  logoDomain?: string;
  description?: string;
  highlights?: string[];
  highlightLink?: string;
  learnings?: string[];
  link?: string;
  images?: string[];
  minHeight?: number;
};

// Month helper: year + (month-1)/12
// Jan=0, Feb=0.083, Mar=0.167, Apr=0.25, May=0.333, Jun=0.417,
// Jul=0.5, Aug=0.583, Sep=0.667, Oct=0.75, Nov=0.833, Dec=0.917
const careerItems: CareerItem[] = [
  // Work — newest first
  {
    type: "role", startYear: 2025.167, endYear: 2025.583,
    title: "Senior Product Designer", subtitle: "Planful Software", minHeight: 72,
    dateLabel: "Mar 2025 — Aug 2025", impact: "−30% training time", logoDomain: "planful.com",
    link: "https://planful.com/",
    description: "Led end-to-end design of two finance planning features, reducing training time ~30% and supporting migration of core finance workflows from legacy tools to a modern web interface.",
    highlights: [
      "Designed two finance planning features end-to-end, reducing training time by ~30%",
    ],
  },
  {
    type: "role", startYear: 2024.167, endYear: 2025.083,
    title: "Senior UX Designer", subtitle: "Reputation.com", minHeight: 72,
    dateLabel: "Mar 2024 — Feb 2025", impact: "−40% task time", logoDomain: "reputation.com",
    link: "https://reputation.com/",
    description: "Led design across three core product verticals (Insights, Reporting, Business Listings, and Reviews), directly supporting primary revenue drivers and AI feature initiatives.",
    highlights: [
      "Designed a unified Competitive Insights workflow that reduced task time by 40%, increased active usage, and contributed to higher customer retention and monetisation",
      "Implemented design QA, reducing design defects by ~25% and improving release quality",
    ],
    highlightLink: "https://reputation.com/resources/reports-guides/competitive-intelligence-stand-out-from-competition",
  },
  {
    type: "role", startYear: 2022.25, endYear: 2023.833,
    title: "Senior Product Designer", subtitle: "Zetwerk",
    dateLabel: "Apr 2022 — Nov 2023", impact: "~6× revenue growth", logoDomain: "zetwerk.com",
    link: "https://www.zetwerk.com/",
    images: ["/images/career/zetwerk-team.jpg"],
    description: "Led product design initiatives for Zetwerk's Order Management System (OMS), improving workflows to support business operations during a ~6× revenue growth phase.",
    highlights: [
      "Mentored three designers and partnered with leadership to establish UX practices: research, concept validation, usability testing",
      "Replaced guesswork with evidence-based design, improving product quality and reducing backlog ~20–30%",
    ],
  },
  {
    type: "role", startYear: 2020.583, endYear: 2022.25,
    title: "Manager UX Designer", subtitle: "FanCode / Dream Sports",
    dateLabel: "Aug 2020 — Apr 2022", impact: "+18% retention", logoDomain: "fancode.com",
    link: "https://play.google.com/store/apps/details?id=com.dream11sportsguru&hl=en_IN",
    images: ["/images/career/fancode-team.jpg"],
    description: "Owned UX for a core product initiative, designing multiple features that drove adoption, retention, and growth across a ~50M user base.",
    highlights: [
      "Led research and concept validation to solve new-user retention, informing a 12-month roadmap and increasing retention by 18% while boosting subscriptions",
      "Redesign of FanCode homepage experience led to an increase in user engagement by 20%",
      "Designed and delivered new sports experiences as part of growth initiatives, driving adoption in football and kabaddi",
      "Uncovered and improved interconnected fan journeys across key touchpoints, increasing time spent by ~20%",
    ],
  },
  {
    type: "role", startYear: 2016.667, endYear: 2020.5,
    title: "UX Designer (Founder)", subtitle: "Quazire Consulting",
    dateLabel: "Sep 2016 — Jul 2020", impact: "0→1 founder",
    description: "Founded and ran a boutique UX consultancy, designing 0→1 digital products across healthcare, HRIS, and fintech verticals for early-stage startups and SMEs.",
    highlights: [
      "Designed an award-winning suite of hospital applications (Ehnote), improving operational efficiency, patient management, and clinical decision-making",
      "Designed SwarmHR, an HRIS and applicant tracking system that streamlined recruitment workflows and enhanced hiring team collaboration",
      "Designed Instabee, a mobile ERP solution for MSMEs in India",
    ],
  },
  // Other — education & side roles
  {
    type: "education", startYear: 2023.833, endYear: 2026.25,
    title: "Super Mentor", subtitle: "ADPList", minHeight: 72,
    dateLabel: "Nov 2023 — Present", impact: "Top 1% · 3K+ mins",
    link: "https://adplist.org/",
    description: "Recognised as a Super Mentor and Top 1% Contributing Mentor on ADPList, mentoring designers across career transitions, portfolio reviews, and senior IC growth.",
    highlights: [
      "Top 1% Mentor Recognition: Feb, Mar, May & Jun 2024 (Expertise of Design)",
      "3,000+ mentorship minutes milestone, Feb 2026",
      "Ongoing 1:1 sessions on product design, career strategy, and portfolio critique",
    ],
  },
  {
    type: "education", startYear: 2023.75, endYear: 2025.083,
    title: "Product Management", subtitle: "IIT Guwahati · Accredian",
    dateLabel: "Oct 2023 — Feb 2025", logoDomain: "accredian.com", minHeight: 72,
    description: "Executive Program in Data-Driven Product Management (Accredian, IIT Guwahati), focused on applying data, product strategy, and user-centric approaches across the product lifecycle. Covered customer research, analytics, product strategy, and experimentation, translating insights into product roadmaps, metrics, and iterative, data-informed decisions.",
  },
  {
    type: "education", startYear: 2020.917, endYear: 2021.333,
    title: "Program in UX Design", subtitle: "IIT Bombay",
    dateLabel: "Dec 2020 — May 2021", logoDomain: "iitb.ac.in", minHeight: 72,
    description: "Program in User Experience Design from IDC School of Design, IIT Bombay, covering the end-to-end UX lifecycle from user research and problem framing to interaction design, testing, and implementation. Completed a hands-on, project-based curriculum including a field research project using contextual inquiry to uncover real-world user behaviours and translate insights into iterative design solutions.",
    images: ["/images/career/iitb-1.jpg", "/images/career/iitb-2.jpg"],
  },
  {
    type: "education", startYear: 2019.583, endYear: 2019.75,
    title: "Conducting Usability Testing", subtitle: "Interaction Design Foundation",
    dateLabel: "Aug 2019", logoDomain: "interaction-design.org", minHeight: 72,
    description: "Usability Testing certification from Interaction Design Foundation, focused on planning, conducting, and analysing user tests to drive data-informed design improvements.",
  },
  {
    type: "education", startYear: 2019.5, endYear: 2019.583,
    title: "Industry Jury", subtitle: "Institute of Product Leadership",
    dateLabel: "Jul 2019", minHeight: 72,
    description: "At the Institute of Product Leadership, examinations are replaced with Skillathons. Top Product Lab UX ideas are presented to a live jury of hiring managers and industry experts. The best voted team wins the Skill Champion Trophy and cash award.",
  },
  {
    type: "education", startYear: 2017, endYear: 2017.5,
    title: "Design Thinking & Leadership", subtitle: "DSIL Global",
    dateLabel: "2017", minHeight: 72,
    description: "Global certification in social innovation and leadership, applying human-centered methods and systems thinking through field immersions and cross-sector collaboration to address complex, real-world problems. Worked closely with local communities, social enterprises, and ecosystem leaders across Southeast Asia: conducting contextual research, facilitating design sprints, and translating insights into actionable solutions through iterative prototyping and real-world validation.",
    images: ["/images/career/dsil-1.jpg", "/images/career/dsil-2.jpg"],
  },
];

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
  initials: string;
  /** Optional headshot path, e.g. "/images/testimonials/raissa.jpg".
      When present the avatar renders the photo; otherwise it falls back to the
      tinted-monogram avatar built from `initials`. */
  image?: string;
};

const testimonials: Testimonial[] = [
  { quote: "Arun possesses a remarkable understanding of user needs, seamlessly navigating between design strategy and hands-on execution. His strategic mindset significantly impacted our efforts to enhance retention metrics.", name: "Raissa Fichardo", role: "Director of UX", company: "Fancode", initials: "RF" },
  { quote: "I was always impressed by his ability to simplify complex problems and create user-friendly designs. He's a thoughtful, strategic designer who balances business goals with user needs.", name: "Jeff Orshalick", role: "UX Design Manager", company: "Reputation", initials: "JO" },
  { quote: "Arun has an exceptional understanding of design and the knack to draw relevant insights to identify the right problems. His business acumen combined with a user-first approach makes him an ideal UX lead.", name: "Vikas Kotian", role: "VP Product Design", company: "Fancode", initials: "VK" },
  { quote: "Arun embodies the core principles of exceptional UX research and design. Our collaboration on numerous uncertain projects highlighted his invaluable contributions. Arun not only drove the research but also championed the significance of user research. He was integral throughout the process, actively shaping the product. A true advocate for the customer's voice, and a definite asset to any team.", name: "Nikhil Bhagya", role: "Product Manager", company: "Zetwerk", initials: "NB" },
  { quote: "During the short period we collaborated on the same project I noticed that Arun is very good at UX. As a developer I loved working on his vision. He was always very committed and focused. I was impressed by his UX and research skills.", name: "Bishal Biswas", role: "Engineer", company: "Atlassian", initials: "BB" },
];

/** Deterministic hue (0-360) derived from initials so each person gets a
    stable, unique tint without us having to hand-pick colours. Used to softly
    tint the monogram avatar background. */
const hueFromInitials = (initials: string): number => {
  let hash = 0;
  for (let i = 0; i < initials.length; i++) {
    hash = (hash * 31 + initials.charCodeAt(i)) >>> 0;
  }
  return hash % 360;
};

function CareerPanel() {
  const totalH = (CAL_END - CAL_START) * YEAR_PX + TOP_OFFSET;
  const allYears = Array.from({ length: CAL_END - CAL_START + 1 }, (_, i) => CAL_END - i);
  const workItems = careerItems.filter(i => i.type === "role");
  const eduItems  = careerItems.filter(i => i.type === "education");
  const [hoveredItem, setHoveredItem]   = useState<CareerItem | null>(null);
  const [selectedItem, setSelectedItem] = useState<CareerItem | null>(null);

  const selectedIdx   = selectedItem ? workItems.findIndex(w => w.title === selectedItem.title && w.startYear === selectedItem.startYear) : -1;
  const toggleCard    = (item: CareerItem) => setSelectedItem(prev => prev?.title === item.title ? null : item);
  const collapseCard  = () => setSelectedItem(null);
  const prevCard      = () => { if (selectedIdx > 0) setSelectedItem(workItems[selectedIdx - 1]); };
  const nextCard      = () => { if (selectedIdx < workItems.length - 1) setSelectedItem(workItems[selectedIdx + 1]); };

  // Which years fall within the hovered card's span
  const isYearActive = (yr: number) => {
    if (!hoveredItem) return false;
    const endYr = hoveredItem.endYear ?? hoveredItem.startYear + 0.5;
    return yr >= Math.floor(hoveredItem.startYear) && yr <= Math.ceil(endYr);
  };

  const NOW_Y = (CAL_END - 2026.25) * YEAR_PX + TOP_OFFSET; // y-position of the "Now" dot

  const CARD_OVERLAP = 6; // px of overlap between adjacent cards

  // Pre-compute stacked positions for work cards — slight negative gap
  const stackedWorkPositions = (() => {
    const computed = workItems.map(item => {
      const endYr  = item.endYear ?? (item.startYear + 0.5);
      const height = Math.max((endYr - item.startYear) * YEAR_PX - 4, item.minHeight ?? 36);
      const rawTop = (CAL_END - item.startYear) * YEAR_PX + 4 + TOP_OFFSET - height;
      return { item, top: Math.max(rawTop, NOW_Y + 10), height };
    });
    computed.sort((a, b) => a.top - b.top);
    for (let i = 1; i < computed.length; i++) {
      const prevBottom = computed[i - 1].top + computed[i - 1].height;
      const gap = computed[i].top - prevBottom;
      if (gap < 20) {
        computed[i].top = prevBottom - CARD_OVERLAP; // overlap adjacent cards
      } else if (gap < 0) {
        computed[i].top = prevBottom; // prevent full collision on distant cards
      }
    }
    return computed;
  })();

  // Pre-compute stacked positions for education cards — same overlap logic
  const stackedEduPositions = (() => {
    const computed = eduItems.map(item => {
      const endYr  = item.endYear ?? (item.startYear + 0.5);
      const height = Math.max((endYr - item.startYear) * YEAR_PX - 4, item.minHeight ?? 44);
      const rawTop = (CAL_END - item.startYear) * YEAR_PX + 4 + TOP_OFFSET - height;
      return { item, top: Math.max(rawTop, 0), height };
    });
    computed.sort((a, b) => a.top - b.top);
    for (let i = 1; i < computed.length; i++) {
      const prevBottom = computed[i - 1].top + computed[i - 1].height;
      const gap = computed[i].top - prevBottom;
      if (gap < 20) {
        computed[i].top = prevBottom - CARD_OVERLAP;
      } else if (gap < 0) {
        computed[i].top = prevBottom;
      }
    }
    return computed;
  })();

  const renderCard = (item: CareerItem, isEdu: boolean, index: number, overrideTop?: number) => {
    const endYr     = item.endYear ?? (item.startYear + 0.5);
    const naturalH  = Math.max((endYr - item.startYear) * YEAR_PX - 4, item.minHeight ?? (isEdu ? 44 : 36));
    const top       = overrideTop ?? Math.max((CAL_END - item.startYear) * YEAR_PX + 4 + TOP_OFFSET - naturalH, NOW_Y + 10);
    const isClickable = true;
    const isHovered   = hoveredItem?.title === item.title && hoveredItem?.startYear === item.startYear;
    const isExpanded  = isClickable && selectedItem?.title === item.title && selectedItem?.startYear === item.startYear;

    return (
      <motion.div
        key={item.title + item.startYear}
        layout
        initial={{ opacity: 0, x: isEdu ? 8 : -8 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        whileHover={!isExpanded && isClickable ? { y: -2 } : {}}
        transition={{
          layout: { type: "spring", stiffness: 320, damping: 32 },
          opacity: { duration: 0.4, ease: EASE },
          x:       { duration: 0.4, ease: EASE, delay: index * 0.055 },
        }}
        onMouseEnter={() => !isExpanded && setHoveredItem(item)}
        onMouseLeave={() => setHoveredItem(null)}
        onClick={() => isClickable && toggleCard(item)}
        style={{
          position: "absolute",
          top: `${top}px`,
          left: isExpanded ? "22px" : isEdu ? "calc(58% + 4px)" : "22px",
          right: isExpanded ? "16px" : isEdu ? "16px" : "calc(42% + 8px)",
          borderRadius: "14px",
          background: isExpanded ? "var(--bg)" : "var(--surface)",
          // Expanded state keeps a border because its bg matches the canvas;
          // collapsed cards use shadow-only depth like the Work cards.
          border: isExpanded ? "1px solid var(--border)" : "none",
          overflow: "hidden",
          cursor: isClickable ? "pointer" : "default",
          zIndex: isExpanded ? 10 : isHovered ? 5 : 1,
          boxShadow: isExpanded
            ? "0 4px 32px rgba(0,0,0,0.09)"
            : isHovered
              ? "var(--card-shadow-hover)"
              : "var(--card-shadow)",
          transition: "box-shadow 0.25s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        {/* ── Compact header row — always visible ── */}
        <motion.div layout style={{
          display: "flex", alignItems: "center", gap: "8px",
          padding: isExpanded ? "8px 12px" : naturalH < 40 ? "4px 10px" : "8px 12px",
          minHeight: isExpanded ? undefined : `${naturalH}px`,
          overflow: "hidden",
          borderBottom: isExpanded ? "1px solid var(--border)" : "none",
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{
              fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 500,
              color: "var(--text)", letterSpacing: "-0.02em", lineHeight: 1.25,
              overflow: "hidden", display: "-webkit-box",
              WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
            }}>
              {item.title}
            </p>
            {item.subtitle && (
              <p style={{
                fontFamily: "var(--font-body)", fontSize: "11px",
                fontWeight: 510, letterSpacing: "-0.01em",
                color: "var(--muted)", lineHeight: 1.2, marginTop: "3px",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {item.subtitle}
              </p>
            )}
            {!isExpanded && (item.dateLabel || item.impact) && (
              <p style={{
                fontFamily: "var(--font-body)", fontSize: "11px",
                fontWeight: 510, letterSpacing: "-0.01em",
                color: isHovered && item.impact ? "var(--text)" : "var(--muted)", marginTop: "3px",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                fontVariantNumeric: "tabular-nums",
                transition: "color 0.2s",
              }}>
                {isHovered && item.impact ? item.impact : item.dateLabel}
              </p>
            )}
          </div>


          {/* Close — only visible when expanded */}
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              style={{
                flexShrink: 0, width: "20px", height: "20px",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--muted)",
              }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 2L10 10M10 2L2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </motion.div>
          )}
        </motion.div>

        {/* ── Expanded detail content ── */}
        <AnimatePresence mode="popLayout">
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.08, ease: EASE } }}
              transition={{ duration: 0.28, ease: EASE, delay: 0.1 }}
            >

              <div style={{ padding: "16px 12px 12px" }}>

                {/* Company / project link — top */}
                {item.link && (
                  <div style={{ marginBottom: "12px" }}>
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      style={{
                        display: "inline-flex", alignItems: "center", gap: "4px",
                        fontFamily: "var(--font-body)", fontSize: "12px",
                        fontWeight: 510, letterSpacing: "-0.01em",
                        color: "var(--muted)", textDecoration: "none",
                        transition: "color 0.15s",
                      }}
                      onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
                      onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}
                    >
                      Visit site <ArrowUpRight size={11} strokeWidth={1.5} />
                    </a>
                  </div>
                )}

                {/* Date label */}
                {item.dateLabel && (
                  <p style={{
                    fontFamily: "var(--font-body)", fontSize: "11px",
                    fontWeight: 510, letterSpacing: "-0.01em",
                    color: "var(--muted)", marginBottom: "12px",
                  }}>
                    {item.dateLabel}
                  </p>
                )}

                {/* Images */}
                {item.images && item.images.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
                    {item.images.map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt=""
                        style={{ width: "100%", height: "auto", display: "block", borderRadius: "8px", filter: "grayscale(15%)" }}
                      />
                    ))}
                  </div>
                )}

                {/* Description */}
                {item.description && (
                  <p style={{
                    fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 400,
                    letterSpacing: "-0.01em", lineHeight: 1.65,
                    color: "var(--muted2)", marginBottom: "16px",
                  }}>
                    {item.description}
                  </p>
                )}

                {/* Highlights */}
                {item.highlights && item.highlights.length > 0 && (
                  <div style={{ marginBottom: "16px" }}>
                    <p style={{
                      fontFamily: "var(--font-body)", fontSize: "11px",
                      fontWeight: 510, letterSpacing: "-0.01em",
                      color: "var(--muted)", marginBottom: "8px",
                    }}>
                      {item.subtitle === "ADPList" ? "Achievements" : "Worked on"}
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {item.highlights.map((h, i) => (
                        <div key={i} style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                          <span style={{ color: "var(--muted)", fontFamily: "var(--font-body)", fontSize: "12px", lineHeight: 1.5, flexShrink: 0 }}>·</span>
                          <p style={{
                            fontFamily: "var(--font-body)", fontSize: "12px",
                            letterSpacing: "-0.01em", lineHeight: 1.55, color: "var(--text)",
                          }}>{h}</p>
                        </div>
                      ))}
                    </div>
                    {/* Highlight reference link (e.g. Competitive Insights report) */}
                    {item.highlightLink && (
                      <a
                        href={item.highlightLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        style={{
                          display: "inline-flex", alignItems: "center", gap: "4px",
                          marginTop: "8px",
                          fontFamily: "var(--font-body)", fontSize: "12px",
                          fontWeight: 510, letterSpacing: "-0.01em",
                          color: "var(--muted)", textDecoration: "none",
                          transition: "color 0.15s",
                        }}
                        onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
                        onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}
                      >
                        Read the CI report <ArrowUpRight size={11} strokeWidth={1.5} />
                      </a>
                    )}
                  </div>
                )}

                {/* Learnings */}
                {item.learnings && item.learnings.length > 0 && (
                  <div style={{ marginBottom: "12px" }}>
                    <p style={{
                      fontFamily: "var(--font-body)", fontSize: "11px",
                      fontWeight: 510, letterSpacing: "-0.01em",
                      color: "var(--muted)", marginBottom: "8px",
                    }}>
                      Learned
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {item.learnings.map((l, i) => (
                        <div key={i} style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                          <span style={{ color: "var(--muted)", fontFamily: "var(--font-body)", fontSize: "12px", lineHeight: 1.5, flexShrink: 0 }}>·</span>
                          <p style={{
                            fontFamily: "var(--font-body)", fontSize: "12px",
                            letterSpacing: "-0.01em", lineHeight: 1.55, color: "var(--text)",
                          }}>{l}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ADPList mentee reviews */}
                {item.subtitle === "ADPList" && (
                  <div style={{ marginBottom: "12px" }}>
                    <p style={{
                      fontFamily: "var(--font-body)", fontSize: "11px",
                      fontWeight: 510, letterSpacing: "-0.01em",
                      color: "var(--muted)", marginBottom: "10px",
                    }}>
                      Mentee reviews
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {[
                        {
                          quote: "Arun's attention to detail, proactive approach, and analytic mindset were truly impressive. His positive attitude, constructive feedback, and receptiveness to new ideas created a collaborative and growth-oriented environment.",
                          initials: "DG", role: "Senior UX Designer", company: "Salesforce", date: "Dec 2023",
                        },
                        {
                          quote: "I have learned a lot of things from Arun in just one meet. He has great product thinking and analytical thinking. He showed me frameworks to build a good product along with real life examples.",
                          initials: "JS", role: "UI/UX Designer", company: "Goldenflitch", date: "May 2024",
                        },
                        {
                          quote: "Arun was incredibly helpful during my job hunt! He listened to what I needed and made suggestions on different approaches I could take to find more jobs and improve my applications. He also thought ahead and anticipated other needs. I would highly recommend booking a session.",
                          initials: "AZ", role: "Freelance UX/UI Designer", company: "Self Employed", date: "Jun 2024",
                        },
                        {
                          quote: "I got a lot of value from just one hour session. I was feeling stuck navigating my self taught UX journey and Arun cleared a lot of doubts and helped improve my confidence. His tips and guidance are incredibly helpful.",
                          initials: "SD", role: "Senior Analyst", company: "Ernst & Young", date: "Mar 2026",
                        },
                      ].map((r, i) => (
                        <div key={i} style={{
                          background: "var(--surface)", borderRadius: "10px",
                          padding: "10px 12px", border: "1px solid var(--border)",
                        }}>
                          <p style={{
                            fontFamily: "var(--font-body)", fontSize: "12px",
                            color: "var(--muted2)", lineHeight: 1.6,
                            letterSpacing: "-0.01em", marginBottom: "8px",
                          }}>
                            &ldquo;{r.quote}&rdquo;
                          </p>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <div style={{
                                width: "20px", height: "20px", borderRadius: "50%",
                                background: "var(--surface2)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                flexShrink: 0,
                              }}>
                                <span style={{
                                  fontFamily: "var(--font-body)", fontSize: "10px",
                                  fontWeight: 510, letterSpacing: "-0.01em",
                                  color: "var(--muted)",
                                }}>{r.initials}</span>
                              </div>
                              <div>
                                <span style={{
                                  fontFamily: "var(--font-body)", fontSize: "11px",
                                  fontWeight: 400, letterSpacing: "-0.01em",
                                  color: "var(--muted)", display: "block",
                                }}>{r.role}</span>
                                <span style={{
                                  fontFamily: "var(--font-body)", fontSize: "11px",
                                  fontWeight: 510, letterSpacing: "-0.01em",
                                  color: "var(--text)", display: "block", marginTop: "1px",
                                }}>{r.company}</span>
                              </div>
                            </div>
                            <span style={{
                              fontFamily: "var(--font-body)", fontSize: "11px",
                              fontWeight: 400, letterSpacing: "-0.01em",
                              color: "var(--muted)", flexShrink: 0,
                            }}>{r.date}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Prev / Next navigation — only for work cards */}
                {!isEdu && <div style={{
                  display: "flex", gap: "6px", paddingTop: "12px",
                  borderTop: "1px solid var(--border)",
                }}>
                  <motion.button
                    onClick={e => { e.stopPropagation(); prevCard(); }}
                    disabled={selectedIdx <= 0}
                    whileTap={selectedIdx > 0 ? { scale: 0.9 } : {}}
                    style={{
                      flex: 1, height: "36px",
                      borderRadius: "8px", border: "1px solid var(--border)",
                      background: "var(--surface)", color: "var(--text)",
                      fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 510,
                      letterSpacing: "-0.01em",
                      cursor: selectedIdx > 0 ? "pointer" : "default",
                      opacity: selectedIdx > 0 ? 1 : 0.3,
                      transition: "opacity 0.15s",
                    }}
                  >
                    ‹ Prev
                  </motion.button>
                  <motion.button
                    onClick={e => { e.stopPropagation(); nextCard(); }}
                    disabled={selectedIdx >= workItems.length - 1}
                    whileTap={selectedIdx < workItems.length - 1 ? { scale: 0.9 } : {}}
                    style={{
                      flex: 1, height: "36px",
                      borderRadius: "8px", border: "1px solid var(--border)",
                      background: "var(--surface)", color: "var(--text)",
                      fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 510,
                      letterSpacing: "-0.01em",
                      cursor: selectedIdx < workItems.length - 1 ? "pointer" : "default",
                      opacity: selectedIdx < workItems.length - 1 ? 1 : 0.3,
                      transition: "opacity 0.15s",
                    }}
                  >
                    Next ›
                  </motion.button>
                </div>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <div id="career-panel-container">
      <PanelHeader label="Career" />
      <div style={{ padding: "16px 0 32px 0" }}>

        {/* Column headers — single continuous bottom border spans the full panel
            width (year axis + Work + Other) so the line aligns with where the
            year text begins on the left. */}
        <div style={{ display: "flex", borderBottom: "1px solid var(--border)", paddingBottom: "10px" }}>
          <div style={{ width: "52px", flexShrink: 0 }} />
          <div style={{ flex: 1, display: "flex" }}>
            <div style={{ flex: 1, paddingLeft: "24px" }}>
              <span style={{ fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 510, letterSpacing: "-0.01em", color: "var(--muted)" }}>Work</span>
            </div>
            <div style={{ width: "42%", paddingLeft: "8px" }}>
              <span style={{ fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 510, letterSpacing: "-0.01em", color: "var(--muted)" }}>Other</span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex" }}>
          {/* Year axis */}
          <div style={{ width: "52px", flexShrink: 0, position: "relative", height: `${totalH}px` }}>
            {allYears.map(yr => (
              <div key={yr} style={{
                position: "absolute", top: `${(CAL_END - yr) * YEAR_PX - 6 + TOP_OFFSET}px`,
                width: "100%", textAlign: "right", paddingRight: "10px",
              }}>
                <span style={{
                  fontFamily: "var(--font-body)", fontSize: "11px",
                  letterSpacing: "-0.01em",
                  color: isYearActive(yr) ? "var(--text)" : yr === 2026 ? "var(--text)" : "var(--muted)",
                  fontWeight: 400,
                  fontVariantNumeric: "tabular-nums",
                  opacity: isYearActive(yr) ? 1 : yr === 2026 ? 1 : 0.55,
                  transition: "color 0.2s, opacity 0.2s",
                }}>{yr}</span>
              </div>
            ))}
          </div>

          {/* Timeline track */}
          <div style={{ flex: 1, position: "relative", height: `${totalH}px`, paddingRight: "16px", borderBottom: "1px solid var(--border)" }}>

            {/* Horizontal grid lines — all years, uniform weight */}
            {allYears.map(yr => (
              <div key={yr} style={{
                position: "absolute", left: 0, right: 0,
                top: `${(CAL_END - yr) * YEAR_PX + TOP_OFFSET}px`,
                height: "1px",
                background: "var(--border)",
                opacity: 0.3,
              }} />
            ))}

            {/* Vertical rail */}
            <div style={{
              position: "absolute", left: "10px",
              top: 0, bottom: 0,
              width: "1px",
              background: "linear-gradient(to bottom, var(--border) 0%, var(--border) 88%, transparent 100%)",
            }} />

            {/* Column divider */}
            <div style={{
              position: "absolute", left: "58%",
              top: 0, bottom: 0,
              width: "1px", background: "var(--border)", opacity: 0.35,
            }} />

            {/* Today marker + Now label */}
            <div style={{
              position: "absolute",
              left: "6px", top: `${(CAL_END - 2026.25) * YEAR_PX + TOP_OFFSET}px`,
              display: "flex", alignItems: "center", gap: "8px", zIndex: 3,
            }}>
              <div className="today-dot" style={{
                width: "9px", height: "9px", borderRadius: "50%",
                background: "var(--accent-warm)", flexShrink: 0,
              }} />
              <span style={{
                fontFamily: "var(--font-body)", fontSize: "11px",
                fontWeight: 510, letterSpacing: "-0.01em",
                color: "var(--accent-warm)", opacity: 0.85,
              }}>Now</span>
            </div>

            {/* Rail connector dots — mark each card's start year on the vertical rail */}
            {[...workItems, ...eduItems].map(item => {
              const dotY = (CAL_END - item.startYear) * YEAR_PX + TOP_OFFSET;
              const isActive = hoveredItem?.title === item.title && hoveredItem?.startYear === item.startYear;
              return (
                <div key={`dot-${item.title}-${item.startYear}`} style={{
                  position: "absolute",
                  left: "7px", top: `${dotY - 3}px`,
                  width: "6px", height: "6px",
                  borderRadius: "50%",
                  background: isActive ? "var(--muted2)" : "var(--border)",
                  border: `1px solid ${isActive ? "var(--muted)" : "var(--border)"}`,
                  transition: "background 0.2s, border-color 0.2s",
                  zIndex: 2,
                }} />
              );
            })}

            {/* Dismiss overlay — catches outside clicks when a card is expanded */}
            {selectedItem && (
              <div
                onClick={collapseCard}
                style={{ position: "absolute", inset: 0, zIndex: 9, cursor: "default" }}
              />
            )}

            {/* Work cards — stacked with slight overlap */}
            {stackedWorkPositions.map(({ item, top }, i) => renderCard(item, false, i, top))}

            {/* Education cards — stacked with slight overlap */}
            {stackedEduPositions.map(({ item, top }, i) => renderCard(item, true, i, top))}

          </div>
        </div>
      </div>

    </div>
  );
}

/* ── Panel 4: Testimonials ── */
function TestimonialsPanel() {
  return (
    <div>
      <PanelHeader label="Testimonials" />
      <div style={{ padding: "24px 24px 48px" }}>

        {/* Intro */}
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          style={{
            fontFamily: "var(--font-body)", fontSize: "13px",
            lineHeight: 1.65, letterSpacing: "-0.01em",
            color: "var(--muted)", marginBottom: "24px", fontWeight: 400,
          }}
        >
          From colleagues and managers I&apos;ve worked closely with.
        </motion.p>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.5, ease: EASE, delay: i * 0.07 }}
              style={{
                borderRadius: "16px",
                background: "var(--surface)",
                boxShadow: "var(--card-shadow)",
                padding: "20px",
              }}
            >
              {/* Quote mark */}
              <p style={{
                fontFamily: "var(--font-body)", fontSize: "28px", lineHeight: 1,
                color: "var(--text)", marginBottom: "8px",
                letterSpacing: "-0.02em", opacity: 0.2,
              }}>
                &ldquo;
              </p>

              {/* Quote body — primary content, var(--text) */}
              <p style={{
                fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 400,
                lineHeight: 1.7, color: "var(--text)", marginBottom: "16px",
                letterSpacing: "-0.01em",
              }}>
                {t.quote}
              </p>

              {/* Author — no border, spacing does the separation */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                {t.image ? (
                  <img
                    src={t.image}
                    alt={t.name}
                    loading="lazy"
                    decoding="async"
                    style={{
                      width: "40px", height: "40px", borderRadius: "50%",
                      objectFit: "cover", flexShrink: 0,
                      boxShadow: "inset 0 0 0 1px color-mix(in srgb, var(--text) 8%, transparent)",
                    }}
                  />
                ) : (() => {
                  const hue = hueFromInitials(t.initials);
                  const tint = `hsl(${hue}, 55%, 55%)`;
                  return (
                    <div
                      aria-hidden="true"
                      style={{
                        width: "40px", height: "40px", borderRadius: "50%",
                        // Soft hue-tinted gradient — color-mix blends with theme surface tones,
                        // so this stays subtle in both light and dark mode.
                        background: `linear-gradient(135deg,
                          color-mix(in srgb, ${tint} 16%, var(--surface2)),
                          color-mix(in srgb, ${tint} 6%, var(--surface)))`,
                        boxShadow: "inset 0 0 0 1px color-mix(in srgb, var(--text) 6%, transparent)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <span style={{
                        fontFamily: "var(--font-body)", fontSize: "13px",
                        fontWeight: 590, letterSpacing: "-0.01em",
                        color: `color-mix(in srgb, ${tint} 65%, var(--text))`,
                      }}>
                        {t.initials}
                      </span>
                    </div>
                  );
                })()}
                <div>
                  <p style={{
                    fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 400,
                    letterSpacing: "-0.01em", color: "var(--muted2)", lineHeight: 1.3,
                  }}>
                    {t.name}
                  </p>
                  <p style={{
                    fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 400,
                    letterSpacing: "-0.01em",
                    color: "var(--muted)", marginTop: "3px", lineHeight: 1.3,
                  }}>
                    {t.role} · {t.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Panel 4: AI Explorations ── */
function ContactPanel() {
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText("akgaddam02@gmail.com");
    haptic([10, 40, 10]); // double-tap success pattern
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <PanelHeader label="Contact" />
      <div style={{ padding: "16px 24px 24px", flex: 1, display: "flex", flexDirection: "column" }}>

        {/* Headline — matches case study detail page hero typography:
            display scale, light weight, compressed tracking. Aligns with
            the About panel hero so both panel heroes share one type voice. */}
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.14 }}
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(26px, 3.4vw, 38px)",
            fontWeight: 300,
            letterSpacing: "-0.03em",
            lineHeight: 1.15,
            color: "var(--text)",
            marginBottom: "10px",
          }}
        >
          Let&apos;s create stories together
        </motion.h2>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE, delay: 0.15 }}
          style={{
            fontFamily: "var(--font-body)", fontSize: "12px",
            lineHeight: 1.65, letterSpacing: "-0.01em",
            color: "var(--muted)", fontWeight: 400,
            marginBottom: "20px",
          }}
        >
          Open to senior IC and lead roles, consulting engagements, and conversations about design, AI-assisted workflows, or vibe coding.
        </motion.p>

        {/* CTAs — always visible */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE, delay: 0.16 }}
          style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0" }}
        >
          <button
            onClick={copyEmail}
            aria-label={copied ? "Email copied" : "Copy email address"}
            style={{
              fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 400,
              letterSpacing: "-0.01em",
              color: copied ? "var(--accent-success)" : "var(--muted)",
              padding: "8px 14px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              background: "transparent",
              cursor: "pointer",
              display: "inline-flex", alignItems: "center", gap: "5px",
              transition: "color 0.18s, border-color 0.18s, background 0.18s",
            }}
            onMouseEnter={e => { if (!copied) { e.currentTarget.style.color = "var(--text)"; e.currentTarget.style.borderColor = "var(--text)"; } }}
            onMouseLeave={e => { if (!copied) { e.currentTarget.style.color = "var(--muted)"; e.currentTarget.style.borderColor = "var(--border)"; } }}
          >
            {copied ? "Copied ✓" : "Copy email"}
          </button>

          <Link
            href="https://www.linkedin.com/in/akgaddam/"
            target="_blank" rel="noopener noreferrer"
            style={{
              fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 400,
              letterSpacing: "-0.01em",
              color: "var(--muted)",
              padding: "8px 14px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              background: "transparent",
              display: "inline-flex", alignItems: "center", gap: "5px",
              transition: "color 0.18s, border-color 0.18s, background 0.18s",
            }}
            onMouseEnter={e => { e.currentTarget.style.color = "var(--text)"; e.currentTarget.style.borderColor = "var(--text)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "var(--muted)"; e.currentTarget.style.borderColor = "var(--border)"; }}
          >
            <ArrowUpRight size={11} strokeWidth={1.5} />
            LinkedIn
          </Link>
        </motion.div>

        {/* Skills & Tools — matches the about-panel treatment (mono label
            + dashed line + marquee of pills). marginTop: auto pushes it
            and the location card to the bottom of the panel. */}
        {(() => {
          const skills = [
            "AI UX Design", "Vibe Coding", "Agentic AI", "Claude Code", "Cursor",
            "Figma", "UX Design", "UX Strategy", "UX Research",
            "Design Systems", "Prototyping", "Service Design",
            "Usability Testing", "Contextual Inquiry", "Service Blueprints",
            "Dovetail", "Framer", "Jobs-to-be-Done",
            "Information Architecture", "Interaction Design",
            "Next.js",
          ];
          const ticker = [...skills, ...skills];
          return (
            <motion.div
              className="skills-ticker"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.18 }}
              style={{ marginTop: "auto", marginBottom: "16px" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <p style={{
                  fontFamily: "var(--font-mono)", fontSize: "9px",
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  color: "var(--muted)", whiteSpace: "nowrap", fontWeight: 400,
                }}>
                  Skills &amp; Tools
                </p>
                <div style={{ flex: 1, borderTop: "1px dashed var(--border)" }} />
              </div>
              <div style={{ overflow: "hidden", position: "relative" }}>
                <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "32px", background: "linear-gradient(to right, var(--bg), transparent)", zIndex: 1, pointerEvents: "none" }} />
                <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "32px", background: "linear-gradient(to left, var(--bg), transparent)", zIndex: 1, pointerEvents: "none" }} />
                <div
                  className="marquee-track"
                  style={{
                    ["--marquee-duration" as string]: "28s",
                    display: "flex", alignItems: "center", gap: "0", whiteSpace: "nowrap",
                  }}
                >
                  {ticker.map((skill, i) => (
                    <span key={`${skill}-${i}`} style={{ display: "inline-flex", alignItems: "center" }}>
                      <span style={{
                        fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 400,
                        letterSpacing: "-0.01em", color: "var(--muted2)",
                        padding: "4px 10px",
                        border: "1px solid var(--border)",
                        borderRadius: "9999px",
                        background: "var(--surface)",
                        marginRight: "6px",
                        whiteSpace: "nowrap",
                      }}>
                        {skill}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })()}

        {/* Location card */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE, delay: 0.2 }}
          style={{
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "var(--card-shadow)",
          }}
        >
          {/* Map area — MapLibre GL */}
          <div style={{ position: "relative", overflow: "hidden" }}>
            <MapLibreMap height={190} />
          </div>
          <div style={{ padding: "8px 12px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--muted)", flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
              <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 400, letterSpacing: "-0.01em", color: "var(--text)" }}>Hyderabad, India</span>
            </div>
            <ISTClock style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.05em", color: "var(--muted)", textTransform: "uppercase" }} />
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.25 }}
          style={{ paddingTop: "16px", borderTop: "1px solid var(--border)", marginTop: "20px" }}
        >
          <p style={{
            fontFamily: "var(--font-body)", fontSize: "11px",
            fontWeight: 400, letterSpacing: "-0.01em",
            color: "var(--muted)", lineHeight: 1.3,
            marginBottom: "4px",
          }}>
            © 2026 · Arun Gaddam ツ
          </p>
          <p style={{
            fontFamily: "var(--font-body)", fontSize: "11px",
            fontWeight: 400, letterSpacing: "-0.01em",
            color: "var(--muted)", lineHeight: 1.3,
            opacity: 0.6,
          }}>
            Designed with <svg width="11" height="11" viewBox="0 0 24 24" style={{ display: "inline", verticalAlign: "middle", marginBottom: "1px" }} fill="var(--muted)"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg> using Claude Code
          </p>
        </motion.div>

      </div>
    </div>
  );
}

/* ── Panel shadow helpers ── */
/* ── AI Explorations panel ── */
function AiExplorationsPanel() {
  const astra = caseStudies.find(cs => cs.slug === "astra");
  return (
    <div>
      <PanelHeader label="AI Explorations" />
      <div style={{ padding: "16px 24px 32px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>

          {/* Featured: AI Contract Review — live React prototype built with Claude */}
          {astra && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -2 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ opacity: { duration: 0.5, ease: EASE }, y: { type: "spring", stiffness: 320, damping: 28 } }}
            >
              <Link href={`/work/${astra.slug}`}>
                <div
                  className="work-card"
                  style={{
                    background: "var(--surface)", borderRadius: "16px", overflow: "hidden",
                    boxShadow: "var(--card-shadow)",
                    transition: "box-shadow 0.25s cubic-bezier(0.22,1,0.36,1), transform 0.25s cubic-bezier(0.22,1,0.36,1)",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = "var(--card-shadow-hover)"; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = "var(--card-shadow)"; }}
                >
                  <div style={{ position: "relative", height: "160px", overflow: "hidden", padding: "12px 12px 0" }}>
                    {WORK_THUMBS[astra.slug] ? (
                      isVideoThumb(WORK_THUMBS[astra.slug]) ? (
                        <video
                          className="work-thumb"
                          src={WORK_THUMBS[astra.slug]}
                          autoPlay
                          loop
                          muted
                          playsInline
                          preload="metadata"
                          aria-hidden="true"
                          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block", borderRadius: "8px 8px 0 0", background: "var(--surface)" }}
                        />
                      ) : (
                        <img
                          className="work-thumb"
                          src={WORK_THUMBS[astra.slug]}
                          alt=""
                          aria-hidden="true"
                          loading="lazy"
                          decoding="async"
                          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block", borderRadius: "8px 8px 0 0" }}
                        />
                      )
                    ) : (
                      <MeshThumbnail index={0} type={astra.type} confidential={astra.confidential} />
                    )}
                  </div>
                  <div style={{ padding: "12px 16px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap", marginBottom: "8px" }}>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.06em", textTransform: "uppercase", padding: "3px 8px", background: "var(--surface2)", color: "var(--muted)", borderRadius: "8px" }}>
                        Live Prototype
                      </span>
                      {astra.tags.slice(0, 2).map(tag => (
                        <span key={tag} style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.06em", textTransform: "uppercase", padding: "3px 8px", background: "var(--surface2)", color: "var(--muted)", borderRadius: "8px" }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 style={{ fontFamily: "var(--font-body)", fontSize: "15px", fontWeight: 590, lineHeight: 1.3, letterSpacing: "-0.012em", color: "var(--text)", marginBottom: "4px" }}>
                      {astra.title}
                    </h3>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 400, lineHeight: 1.4, letterSpacing: "-0.01em", color: "var(--muted)" }}>
                      {astra.subtitle}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Portfolio Design Language — meta artifact */}
          <SystemFeatureCard />

        </div>
      </div>
    </div>
  );
}

const PANEL_SHADOW_LIGHT = "0 1px 2px rgba(0,0,0,0.04), 0 6px 24px rgba(0,0,0,0.06)";
const PANEL_SHADOW_ACTIVE_LIGHT = "0 2px 4px rgba(0,0,0,0.06), 0 12px 40px rgba(0,0,0,0.10)";
/* Dark panels sit on #050507 canvas — drop shadows are invisible on near-black.
   A white hairline ring defines the panel edge; the surface step (#1c1c1e panel
   vs #050507 canvas) provides the perceived lift. */
const PANEL_SHADOW_DARK  = "0 0 0 1px rgba(255,255,255,0.06), 0 2px 8px rgba(0,0,0,0.5), 0 8px 32px rgba(0,0,0,0.4)";
const PANEL_SHADOW_ACTIVE_DARK = "0 0 0 1px rgba(255,255,255,0.09), 0 4px 12px rgba(0,0,0,0.6), 0 16px 48px rgba(0,0,0,0.5)";

const PANEL_CONFIGS = [
  { label: "About",          width: "420px", minWidth: "380px", Component: AboutPanel },
  { label: "Work",           width: "440px", minWidth: "380px", Component: WorkPanel },
  { label: "AI",             width: "440px", minWidth: "380px", Component: AiExplorationsPanel },
  { label: "Career",         width: "420px", minWidth: "380px", Component: CareerPanel },
  { label: "Testimonials",   width: "400px", minWidth: "360px", Component: TestimonialsPanel },
  { label: "Contact",        width: "380px", minWidth: "340px", Component: ContactPanel },
];

/* ── Home ── */
export default function Home() {
  const containerRef  = useRef<HTMLDivElement>(null);
  const [activePanel, setActivePanel] = useState(0);
  const [loading, setLoading]         = useState(true);
  const [revealed, setRevealed]       = useState(false);
  const [isDark, setIsDark]           = useState(false);

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.dataset.theme === "dark");
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    // Honest timer: loader exits when fonts have actually loaded AND the
    // typewriter reveal animation has had time to play. Hard-capped at
    // SAFETY_CAP so a hung font request can't trap the user on the loader.
    const ANIMATION_MIN = 1300; // typewriter + transform + role-fade total
    const SAFETY_CAP    = 1500;

    let resolved = false;
    const finish = () => {
      if (resolved) return;
      resolved = true;
      setLoading(false);
      setTimeout(() => setRevealed(true), 60); // slight delay so panels animate after loader exits
    };

    const fontsReady = document.fonts?.ready ?? Promise.resolve();
    const minTime    = new Promise<void>(r => setTimeout(r, ANIMATION_MIN));

    const cap = setTimeout(finish, SAFETY_CAP);
    Promise.all([fontsReady, minTime]).then(finish);

    return () => clearTimeout(cap);
  }, []);

  const scrollByPanel = useCallback((dir: 1 | -1) => {
    const el = containerRef.current;
    if (!el) return;
    const panels = el.querySelectorAll<HTMLElement>(".panel");
    const current = panels[activePanel];
    if (!current) return;
    el.scrollBy({ left: dir * (current.offsetWidth + 8), behavior: "smooth" });
  }, [activePanel]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = () => {
      const panels = el.querySelectorAll<HTMLElement>(".panel");
      let closest = 0, minDist = Infinity;
      panels.forEach((p, i) => {
        const dist = Math.abs(p.getBoundingClientRect().left - 24);
        if (dist < minDist) { minDist = dist; closest = i; }
      });
      setActivePanel(closest);
    };
    el.addEventListener("scroll", handler, { passive: true });
    return () => el.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") scrollByPanel(1);
      if (e.key === "ArrowLeft")  scrollByPanel(-1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [scrollByPanel]);

  // Add scrolled class to panel headers when panel scrolls
  useEffect(() => {
    const panels = containerRef.current?.querySelectorAll<HTMLElement>(".panel");
    if (!panels) return;
    const cleanups: (() => void)[] = [];
    panels.forEach(panel => {
      const handler = () => {
        const header = panel.querySelector<HTMLElement>(".panel-header-glass");
        if (header) header.classList.toggle("scrolled", panel.scrollTop > 4);
      };
      panel.addEventListener("scroll", handler, { passive: true });
      cleanups.push(() => panel.removeEventListener("scroll", handler));
    });
    return () => cleanups.forEach(fn => fn());
  }, [revealed]);

  const isLastPanel = activePanel === PANEL_CONFIGS.length - 1;

  return (
    <>
      <LoadingScreen visible={loading} />
      <HomeNav onPrev={() => scrollByPanel(-1)} onNext={() => scrollByPanel(1)} activePanel={activePanel} />

      {/* Right-edge fade — hides on last panel */}
      <motion.div
        className="panels-right-fade"
        animate={{ opacity: isLastPanel ? 0 : 1 }}
        transition={{ duration: 0.3, ease: EASE }}
        style={{
          position: "fixed", top: "64px", right: 0,
          width: "80px", height: "calc(100dvh - 64px)",
          background: "linear-gradient(to right, transparent, var(--chrome))",
          pointerEvents: "none", zIndex: 100,
        }}
      />

      <main id="main-content" className="home-main" style={{ paddingTop: "64px", height: "100dvh", overflow: "hidden", background: "var(--chrome)" }}>
        <div
          ref={containerRef}
          className="panels-container"
          style={{
            display: "flex",
            height: "calc(100dvh - 64px)",
            overflowX: "auto",
            overflowY: "hidden",
            gap: "8px",
            padding: "12px 0 16px 24px",
            boxSizing: "border-box",
            scrollSnapType: "x proximity",
            scrollPaddingLeft: "24px",
          }}
        >
          {PANEL_CONFIGS.map(({ width, minWidth, Component }, i) => {
            const isActive = activePanel === i;
            const shadow = isDark
              ? (isActive ? PANEL_SHADOW_ACTIVE_DARK  : PANEL_SHADOW_DARK)
              : (isActive ? PANEL_SHADOW_ACTIVE_LIGHT : PANEL_SHADOW_LIGHT);
            return (
              <motion.div
                key={i}
                className="panel"
                initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
                animate={revealed
                  ? { opacity: 1, y: 0,  filter: "blur(0px)" }
                  : { opacity: 0, y: 20, filter: "blur(6px)" }}
                transition={{ duration: 0.7, ease: EASE, delay: i * 0.12 }}
                style={{
                  minWidth,
                  width,
                  flex: "0 0 auto",
                  height: "100%",
                  overflowY: "auto",
                  borderRadius: "18px",
                  background: "var(--bg)",
                  boxShadow: shadow,
                  scrollSnapAlign: "start",
                  transition: "box-shadow 0.35s cubic-bezier(0.22,1,0.36,1)",
                }}
              >
                <Component />
              </motion.div>
            );
          })}

          {/* Trailing spacer so last panel gets 24px right breathing room */}
          <div style={{ minWidth: "24px", flexShrink: 0 }} />
        </div>
      </main>

      <style>{`
        .panels-container::-webkit-scrollbar { display: none; }
        .panels-container { -ms-overflow-style: none; scrollbar-width: none; }
        .panel::-webkit-scrollbar { width: 0px; }
        .panel { -ms-overflow-style: none; scrollbar-width: none; }

        @keyframes today-pulse {
          0%   { box-shadow: 0 0 0 0px color-mix(in srgb, var(--accent-warm) 40%, transparent); }
          60%  { box-shadow: 0 0 0 5px color-mix(in srgb, var(--accent-warm)  0%, transparent); }
          100% { box-shadow: 0 0 0 0px color-mix(in srgb, var(--accent-warm)  0%, transparent); }
        }
        .today-dot {
          animation: today-pulse 3.5s ease-out infinite;
        }

        @media (max-width: 640px) {
          .home-main { height: auto !important; overflow: visible !important; }
          .panels-right-fade { display: none !important; }
          .panels-container {
            flex-direction: column !important;
            overflow-x: hidden !important;
            overflow-y: visible !important;
            scroll-snap-type: none !important;
            padding: 8px 12px 32px !important;
            gap: 12px !important;
            height: auto !important;
          }
          .panel {
            min-width: unset !important;
            width: 100% !important;
            height: auto !important;
            flex: none !important;
            scroll-snap-align: none !important;
          }
        }
      `}</style>
    </>
  );
}
