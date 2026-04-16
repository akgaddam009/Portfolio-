"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useRef, useCallback, useState, useEffect } from "react";
import Cursor from "@/components/Cursor";
import ThemeToggle from "@/components/ThemeToggle";
import LoadingScreen from "@/components/LoadingScreen";
import { caseStudies } from "@/lib/caseStudies";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ── Home nav — name + panel arrows ── */
const PANEL_LABELS = ["About", "Work", "Career", "Testimonials", "AI"];

function HomeNav({ onPrev, onNext, activePanel }: { onPrev: () => void; onNext: () => void; activePanel: number }) {
  return (
    <header
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 200,
        height: "52px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        background: "transparent",
      }}
    >
      {/* Name + theme toggle */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span
          style={{
            fontFamily: "var(--font-logo)",
            fontSize: "13px",
            fontWeight: 500,
            color: "var(--text)",
            letterSpacing: "-0.03em",
            padding: "6px 12px",
            borderRadius: "8px",
            border: "1px solid var(--border)",
            background: "transparent",
            display: "inline-block",
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          Arun Gaddam
        </span>
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
                onClick={disabled ? undefined : fn}
                whileTap={disabled ? {} : { scale: 0.88 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                title={dir === "prev" ? "Previous panel" : "Next panel"}
                aria-label={dir === "prev" ? "Previous panel" : "Next panel"}
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  background: "var(--bg)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background 0.15s, opacity 0.2s",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
                  opacity: disabled ? 0.3 : 1,
                  cursor: disabled ? "default" : "none",
                }}
                onMouseEnter={e => { if (!disabled) e.currentTarget.style.background = "var(--surface2)"; }}
                onMouseLeave={e => { if (!disabled) e.currentTarget.style.background = "var(--bg)"; }}
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
      borderBottom: "1px solid var(--border)",
    }}>
      <p style={{
        fontFamily: "var(--font-mono)",
        fontSize: "9px",
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
/* ── Portrait with magnifying glass lens ── */
function PortraitMagnify() {
  const [lens, setLens] = useState<{ x: number; y: number; visible: boolean }>({ x: 0, y: 0, visible: false });
  const W = 72, H = 84, ZOOM = 2.8, LENS = 88;

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setLens({ x: e.clientX - r.left, y: e.clientY - r.top, visible: true });
  };

  // Background position: centres the zoomed point inside the lens circle
  const bgX = LENS / 2 - lens.x * ZOOM;
  const bgY = LENS / 2 - lens.y * ZOOM;

  return (
    <div
      onMouseMove={onMove}
      onMouseLeave={() => setLens(l => ({ ...l, visible: false }))}
      style={{ position: "relative", width: `${W}px`, height: `${H}px`, flexShrink: 0 }}
    >
      {/* Base image */}
      <div style={{ width: "100%", height: "100%", borderRadius: "10px", overflow: "hidden", border: "1px solid var(--border)" }}>
        <img
          src="/arun.png"
          alt="Arun Gaddam"
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", filter: "grayscale(100%)", display: "block" }}
        />
      </div>

      {/* Lens */}
      {lens.visible && (
        <div style={{
          position: "absolute",
          width: `${LENS}px`,
          height: `${LENS}px`,
          borderRadius: "50%",
          border: "1px solid var(--border)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
          backgroundImage: "url(/arun.png)",
          backgroundSize: `${W * ZOOM}px auto`,
          backgroundPosition: `${bgX}px ${bgY}px`,
          backgroundRepeat: "no-repeat",
          filter: "grayscale(100%)",
          left: `${lens.x - LENS / 2}px`,
          top: `${lens.y - LENS / 2}px`,
          pointerEvents: "none",
          zIndex: 30,
        }} />
      )}
    </div>
  );
}

const infoRows = [
  { label: "Role", value: "Senior Product Designer. I own the full design process — from discovery and strategy to final pixel." },
  { label: "Focus", value: "Enterprise SaaS, B2B AI tools, and consumer products at scale — with user research as a core part of the process." },
  { label: "Experience", value: "8+ years designing complex enterprise apps to consumer mobile app influencing roadmaps, mentoring designers, and collaborating across cross-functional teams." },
  { label: "Superpower", value: "I can hold the big picture and still get into the details that matter." },
];

function AboutPanel() {
  return (
    <div>
      <PanelHeader label="About me" />
      <div style={{ padding: "24px 24px 48px" }}>

        {/* Portrait + availability badge */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE }}
          style={{ display: "flex", alignItems: "flex-end", gap: "12px", marginBottom: "16px" }}
        >
          <PortraitMagnify />
          <div style={{ display: "inline-flex", alignItems: "center", gap: "7px", padding: "5px 10px", borderRadius: "6px", border: "1px solid var(--border)", background: "var(--surface)" }}>
            <span className="availability-dot" />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)" }}>
              Open to opportunities
            </span>
          </div>
        </motion.div>

        {/* Hero headline */}
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.05 }}
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(20px, 2.8vw, 28px)",
            fontWeight: 300,
            lineHeight: 1.25,
            letterSpacing: "-0.03em",
            color: "var(--text)",
            marginBottom: "16px",
          }}
        >
          <span className="text-highlight">Hey, I&apos;m Arun.</span>{" "}
          <span style={{ color: "var(--muted)" }}>
            I design products at the intersection of UX, product thinking, and AI.
          </span>
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
            letterSpacing: "-0.01em",
            color: "var(--muted)",
            marginBottom: "24px",
          }}
        >
          I&apos;m based in Hyderabad, India with my wife and our son — figuring out the balance between designing products, catching up with AI, and raising a tiny human. I&apos;m learning a lot from both.
        </motion.p>

        {/* Links */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.15 }}
          style={{ marginBottom: "32px", display: "flex", alignItems: "center", gap: "4px", flexWrap: "wrap" }}
        >
          {[
            { label: "LinkedIn ↗", href: "https://linkedin.com/in/akgaddam", external: true },
            { label: "Medium ↗", href: "https://medium.com/@akgaddam", external: true },
            { label: "CV ↗", href: "https://drive.google.com/file/d/1VWajNl_cigKjLwMNevZIJXUm1bY3hoOs/view?usp=sharing", external: true },
            { label: "Email", href: "mailto:akgaddam02@gmail.com", external: false },
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
                  borderRadius: "4px",
                  display: "inline-block",
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
              </Link>
              {i < arr.length - 1 && (
                <span style={{ color: "var(--muted)", fontFamily: "var(--font-mono)", fontSize: "9px", userSelect: "none", opacity: 0.4 }}>·</span>
              )}
            </span>
          ))}
        </motion.div>

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
                }}>
                  {row.value}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

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

function MeshThumbnail({ index, type, number, confidential }: {
  index: number; type: string; number: string; confidential?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const raf = useRef<number | null>(null);
  const mouse = useRef({ x: 50, y: 50 });
  const current = useRef({ x: 50, y: 50, x2: 30, y2: 70, x3: 70, y3: 30 });
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

  const update = () => {
    const c = current.current;
    const m = mouse.current;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    c.x  = lerp(c.x,  m.x,       0.06);
    c.y  = lerp(c.y,  m.y,       0.06);
    c.x2 = lerp(c.x2, 100 - m.x, 0.04);
    c.y2 = lerp(c.y2, m.y * 0.7, 0.04);
    c.x3 = lerp(c.x3, m.x * 0.6, 0.035);
    c.y3 = lerp(c.y3, 100 - m.y, 0.035);

    if (ref.current) {
      const p = document.documentElement.dataset.theme === "dark"
        ? meshPalettes.dark[index % meshPalettes.dark.length]
        : meshPalettes.light[index % meshPalettes.light.length];
      ref.current.style.background = [
        `radial-gradient(ellipse 60% 55% at ${c.x}% ${c.y}%, ${p.orbs[0]}ee, transparent 70%)`,
        `radial-gradient(ellipse 50% 60% at ${c.x2}% ${c.y2}%, ${p.orbs[1]}bb, transparent 65%)`,
        `radial-gradient(ellipse 55% 50% at ${c.x3}% ${c.y3}%, ${p.orbs[2]}aa, transparent 60%)`,
        p.base,
      ].join(", ");
    }
    raf.current = requestAnimationFrame(update);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouse.current = {
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top)  / rect.height) * 100,
    };
  };

  const startRaf = () => { if (!raf.current) raf.current = requestAnimationFrame(update); };
  const stopRaf  = () => {
    if (raf.current) { cancelAnimationFrame(raf.current); raf.current = null; }
    mouse.current = { x: 50, y: 50 };
  };

  useEffect(() => () => { if (raf.current) cancelAnimationFrame(raf.current); }, []);

  // Theme-aware colour values
  const numColor      = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)";
  const labelColor    = isDark ? "rgba(255,255,255,0.3)"  : "rgba(0,0,0,0.4)";
  const badgeBg       = isDark ? "rgba(0,0,0,0.4)"        : "rgba(255,255,255,0.6)";
  const badgeColor    = isDark ? "rgba(255,255,255,0.35)"  : "rgba(0,0,0,0.4)";

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={startRaf}
      onMouseLeave={stopRaf}
      style={{
        height: "120px",
        background: palette.base,
        position: "relative", overflow: "hidden",
        display: "flex", alignItems: "flex-end",
        padding: "12px 16px",
      }}
    >
      <div className="paper-grain" />
      {/* Large faint number */}
      <span style={{
        position: "absolute", right: "12px", top: "50%",
        transform: "translateY(-50%)",
        fontFamily: "var(--font-body)", fontSize: "64px", fontWeight: 300,
        letterSpacing: "-0.04em", lineHeight: 1,
        color: numColor,
        userSelect: "none", pointerEvents: "none",
        transition: "color 0.3s",
      }}>
        {number}
      </span>
      {/* Domain label */}
      <span style={{
        fontFamily: "var(--font-mono)", fontSize: "8px",
        letterSpacing: "0.08em", textTransform: "uppercase",
        color: labelColor, position: "relative", zIndex: 1,
        transition: "color 0.3s",
      }}>
        {type.split("—")[0].trim()}
      </span>
      {confidential && (
        <div style={{
          position: "absolute", top: "10px", right: "10px",
          background: badgeBg,
          borderRadius: "4px", padding: "3px 8px",
          fontFamily: "var(--font-mono)", fontSize: "8px",
          letterSpacing: "0.08em", textTransform: "uppercase",
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

function WorkPanel() {
  return (
    <div id="work-panel">
      <PanelHeader label="Selected Work" />
      <div style={{ padding: "16px 24px 32px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {caseStudies.map((cs, i) => {
            const href = cs.confidential ? "/contact" : `/work/${cs.slug}`;
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
                    style={{
                      background: "var(--surface)",
                      borderRadius: "12px",
                      overflow: "hidden",
                      border: "1px solid var(--border)",
                      transition: "border-color 0.2s cubic-bezier(0.22,1,0.36,1), box-shadow 0.2s cubic-bezier(0.22,1,0.36,1)",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = "var(--muted)";
                      e.currentTarget.style.boxShadow = "0 2px 16px rgba(0,0,0,0.07)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = "var(--border)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    {/* Mesh thumbnail */}
                    <MeshThumbnail
                      index={i}
                      type={cs.type}
                      number={cs.number}
                      confidential={cs.confidential}
                    />

                    {/* Body */}
                    <div style={{ padding: "12px 16px 16px" }}>
                      {/* Number + tags row */}
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                        <span style={{
                          fontFamily: "var(--font-mono)", fontSize: "9px",
                          letterSpacing: "0.06em", color: "var(--muted)",
                        }}>
                          {cs.number}
                        </span>
                        <span style={{ color: "var(--border)", fontFamily: "var(--font-mono)", fontSize: "9px" }}>·</span>
                        {cs.tags.slice(0, 2).map(tag => (
                          <span key={tag} style={{
                            fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.06em",
                            padding: "2px 7px", background: "var(--surface2)",
                            color: "var(--muted)", borderRadius: "4px",
                          }}>
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Title */}
                      <h3 style={{
                        fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 400,
                        lineHeight: 1.3, letterSpacing: "-0.02em",
                        color: "var(--text)", marginBottom: "4px",
                      }}>
                        {cs.title}
                      </h3>

                      {/* Subtitle */}
                      <p style={{
                        fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 400,
                        lineHeight: 1.4, letterSpacing: "-0.01em",
                        color: "var(--muted)", marginBottom: "12px",
                      }}>
                        {cs.subtitle}
                      </p>

                      {/* Metrics */}
                      <div style={{
                        paddingTop: "12px", borderTop: "1px solid var(--border)",
                        display: "flex", gap: "16px",
                      }}>
                        {cs.metrics.slice(0, 2).map(m => (
                          <div key={m.label}>
                            <p style={{
                              fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 400,
                              letterSpacing: "-0.03em", color: "var(--text)",
                              lineHeight: 1, marginBottom: "3px",
                            }}>
                              {m.value}
                            </p>
                            <p style={{
                              fontFamily: "var(--font-mono)", fontSize: "8px",
                              letterSpacing: "0.06em", color: "var(--muted)",
                              textTransform: "uppercase",
                            }}>
                              {m.label}
                            </p>
                          </div>
                        ))}
                      </div>
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
  learnings?: string[];
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
    description: "Led end-to-end design for Planful's AI-powered FP&A platform — translating the complexity of enterprise financial planning into interfaces finance teams actually want to use.",
    highlights: [
      "Redesigned the scenario planning module, cutting user training time by 30%",
      "Built a component library adopted by 3 product teams within a single quarter",
      "Ran user research with 15+ enterprise finance directors across North America",
    ],
    learnings: [
      "Enterprise finance workflows have deep domain complexity — skip the assumptions, go talk to the CFO",
      "Design systems pay back fastest when you build them for engineers first, designers second",
      "In FP&A tools, trust is the product — every UI decision is a trust decision",
    ],
  },
  {
    type: "role", startYear: 2024.25, endYear: 2025.083,
    title: "Senior UX Designer", subtitle: "Reputation.com", minHeight: 72,
    dateLabel: "Apr 2024 — Feb 2025", impact: "−40% task time", logoDomain: "reputation.com",
    description: "Designed core features for Reputation's enterprise CX platform — helping global brands manage their online presence across thousands of locations at scale.",
    highlights: [
      "Cut average task completion time by 40% across key multi-location workflows",
      "Rebuilt the reviews management dashboard for enterprise accounts with 500+ locations",
      "Shipped a new analytics reporting suite used by 500+ enterprise clients at launch",
    ],
    learnings: [
      "Multi-location products need radical information hierarchy — geography is the primary axis",
      "Dashboards succeed when they tell a story, not just render a dataset",
      "Tight, daily PM collaboration is a design force multiplier",
    ],
  },
  {
    type: "role", startYear: 2022.417, endYear: 2023.833,
    title: "Senior Product Designer", subtitle: "Zetwerk",
    dateLabel: "Jun 2022 — Nov 2023", impact: "~6× revenue growth", logoDomain: "zetwerk.com",
    description: "Shaped the UX of Zetwerk's B2B manufacturing marketplace through a period of exceptional scale — from Series D through ~6× revenue growth.",
    highlights: [
      "Designed the supplier onboarding flow adopted by 10,000+ manufacturers across India",
      "Led design for the procurement tracking and order management suite",
      "Built and scaled a cross-platform design system from first token to full adoption",
    ],
    learnings: [
      "Supply chain is incredibly domain-specific — embed with the ops team before touching Figma",
      "At scale, consistency beats cleverness every single time",
      "A design system is a company asset, not a design team deliverable",
    ],
  },
  {
    type: "role", startYear: 2020.583, endYear: 2022.25,
    title: "Manager UX Designer", subtitle: "FanCode / Dream Sports",
    dateLabel: "Aug 2020 — Apr 2022", impact: "+18% retention", logoDomain: "fancode.com",
    description: "Led the UX team at FanCode — a sports commerce and content platform by Dream Sports — driving an 18% improvement in user retention through design and product decisions.",
    highlights: [
      "Managed a team of 4 designers across iOS, Android, and web",
      "Redesigned the live sports viewing experience for mobile — the core engagement surface",
      "Shipped FanCode Store, a 0→1 sports merchandise platform, in 3 months",
    ],
    learnings: [
      "Managing designers means creating clarity, not controlling output",
      "Sports fans are a uniquely passionate audience — design for the emotional peak, not the average moment",
      "Retention is a habit loop problem, not a feature problem",
    ],
  },
  {
    type: "role", startYear: 2016.667, endYear: 2020.5,
    title: "UX Designer (Founder)", subtitle: "Quazire Consulting",
    dateLabel: "Sep 2016 — Jul 2020", impact: "0→1 founder",
    description: "Founded and ran a boutique UX consultancy working with early-stage startups and SMEs across India — building 0→1 digital products from concept to launch.",
    highlights: [
      "Designed and shipped 12+ products across fintech, edtech, and healthtech verticals",
      "Worked directly with founders to define product strategy alongside visual design",
      "Grew a small team of 3 designers and managed all client relationships solo",
    ],
    learnings: [
      "Running a business taught me to design for outcomes, not deliverables",
      "The best founders trust the process — and make you faster because of it",
      "Working across industries early in your career builds a breadth of intuition that's impossible to learn any other way",
    ],
  },
  // Education & Side roles
  {
    type: "education", startYear: 2023.833, title: "Super Mentor", subtitle: "ADPList", minHeight: 72,
    dateLabel: "Nov 2023 — Present", impact: "Top 1% · 3K+ mins",
    description: "Recognised as a Super Mentor and Top 1% Contributing Mentor on ADPList — mentoring designers across career transitions, portfolio reviews, and senior IC growth.",
    highlights: [
      "Top 1% Mentor Recognition — Feb, Mar, May & Jun 2024 (Expertise of Design)",
      "3,000+ mentorship minutes milestone — Feb 2026",
      "Ongoing 1:1 sessions on product design, career strategy, and portfolio critique",
    ],
  },
  { type: "education", startYear: 2020.917, endYear: 2021.333, title: "Program in UX Design",         subtitle: "IIT Bombay",   dateLabel: "Dec 2020 — May 2021", logoDomain: "iitb.ac.in", minHeight: 72 },
  { type: "education", startYear: 2019,     endYear: 2019.5,   title: "PM Certification",             subtitle: "IIT Guwahati", dateLabel: "2019",               minHeight: 72 },
  { type: "education", startYear: 2017,     endYear: 2017.5,   title: "Design Thinking & Leadership", subtitle: "DSIL Global",  dateLabel: "2017",               minHeight: 72 },
];

const testimonials = [
  { quote: "Arun possesses a remarkable understanding of user needs, seamlessly navigating between design strategy and hands-on execution. His strategic mindset significantly impacted our efforts to enhance retention metrics.", name: "Raissa Fichardo", role: "Director of UX", company: "Fancode", initials: "RF" },
  { quote: "I was always impressed by his ability to simplify complex problems and create user-friendly designs. He's a thoughtful, strategic designer who balances business goals with user needs.", name: "Jeff Orshalick", role: "UX Design Manager", company: "Reputation", initials: "JO" },
  { quote: "Arun has an exceptional understanding of design and the knack to draw relevant insights to identify the right problems. His business acumen combined with a user-first approach makes him an ideal UX lead.", name: "Vikas Kotian", role: "VP Product Design", company: "Fancode", initials: "VK" },
];

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
    const isClickable = !isEdu || !!item.description;
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
          borderRadius: "10px",
          background: isExpanded ? "var(--bg)" : "var(--surface)",
          border: `1px solid ${isHovered && !isExpanded ? "var(--muted)" : "var(--border)"}`,
          overflow: "hidden",
          cursor: isClickable ? "pointer" : "default",
          zIndex: isExpanded ? 10 : isHovered ? 5 : 1,
          boxShadow: isExpanded ? "0 4px 32px rgba(0,0,0,0.09)" : "none",
        }}
      >
        {/* ── Compact header row — always visible ── */}
        <motion.div layout style={{
          display: "flex", alignItems: "center", gap: "8px",
          padding: isExpanded ? "8px 12px" : naturalH < 40 ? "4px 10px" : "8px 12px",
          height: isExpanded ? "auto" : `${naturalH}px`,
          overflow: "hidden",
          borderBottom: isExpanded ? "1px solid var(--border)" : "none",
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{
              fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 400,
              color: "var(--text)", letterSpacing: "-0.02em", lineHeight: 1.25,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              {item.title}
            </p>
            {item.subtitle && (
              <p style={{
                fontFamily: "var(--font-mono)", fontSize: "8px",
                color: "var(--muted)", letterSpacing: "0.08em",
                textTransform: "uppercase", lineHeight: 1.2, marginTop: "3px",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {item.subtitle}
              </p>
            )}
            {!isExpanded && (item.dateLabel || item.impact) && (
              <p style={{
                fontFamily: "var(--font-mono)", fontSize: "8px",
                color: isHovered && item.impact ? "var(--text)" : "var(--muted)",
                letterSpacing: "0.08em", textTransform: "uppercase", marginTop: "3px",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
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

                {/* Date label */}
                {item.dateLabel && (
                  <p style={{
                    fontFamily: "var(--font-mono)", fontSize: "8px",
                    letterSpacing: "0.1em", textTransform: "uppercase",
                    color: "var(--muted)", marginBottom: "12px",
                  }}>
                    {item.dateLabel}
                  </p>
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
                      fontFamily: "var(--font-mono)", fontSize: "7px",
                      letterSpacing: "0.1em", textTransform: "uppercase",
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
                  </div>
                )}

                {/* Learnings */}
                {item.learnings && item.learnings.length > 0 && (
                  <div style={{ marginBottom: "12px" }}>
                    <p style={{
                      fontFamily: "var(--font-mono)", fontSize: "7px",
                      letterSpacing: "0.1em", textTransform: "uppercase",
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

                {/* ADPList mentee reviews — native design language */}
                {item.subtitle === "ADPList" && (
                  <div style={{ marginBottom: "12px" }}>
                    <p style={{
                      fontFamily: "var(--font-mono)", fontSize: "7px",
                      letterSpacing: "0.1em", textTransform: "uppercase",
                      color: "var(--muted)", marginBottom: "10px",
                    }}>
                      Mentee reviews
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {[
                        {
                          quote: "I got a lot of value from just one hour session. I was feeling stuck navigating my self taught UX journey and Arun cleared a lot of doubts and helped improve my confidence. His tips and guidance are incredibly helpful.",
                          initials: "SD", role: "Senior Analyst", company: "Ernst & Young", date: "Mar 2026",
                        },
                        {
                          quote: "Arun was incredibly helpful during my job hunt! He listened to what I needed and made suggestions on different approaches I could take to find more jobs and improve my applications. He also thought ahead and anticipated other needs — I would highly recommend booking a session.",
                          initials: "AZ", role: "Freelance UX/UI Designer", company: "Self Employed", date: "Jun 2024",
                        },
                        {
                          quote: "I have learned a lot of things from Arun in just one meet. He has great product thinking and analytical thinking — showed me frameworks to build a good product along with real life examples.",
                          initials: "JS", role: "UI/UX Designer", company: "Goldenflitch", date: "May 2024",
                        },
                        {
                          quote: "Arun's attention to detail, proactive approach, and analytic mindset were truly impressive. His positive attitude, constructive feedback, and receptiveness to new ideas created a collaborative and growth-oriented environment.",
                          initials: "DG", role: "Senior UX Designer", company: "Salesforce", date: "Dec 2023",
                        },
                      ].map((r, i) => (
                        <div key={i} style={{
                          background: "var(--surface)", borderRadius: "8px",
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
                                  fontFamily: "var(--font-mono)", fontSize: "7px",
                                  color: "var(--muted)", letterSpacing: "0.04em",
                                }}>{r.initials}</span>
                              </div>
                              <div>
                                <span style={{
                                  fontFamily: "var(--font-mono)", fontSize: "8px",
                                  color: "var(--muted)", letterSpacing: "0.06em",
                                  textTransform: "uppercase", display: "block",
                                }}>{r.role}</span>
                                <span style={{
                                  fontFamily: "var(--font-mono)", fontSize: "8px",
                                  color: "var(--text)", letterSpacing: "0.06em",
                                  textTransform: "uppercase", display: "block", marginTop: "1px",
                                }}>{r.company}</span>
                              </div>
                            </div>
                            <span style={{
                              fontFamily: "var(--font-mono)", fontSize: "7px",
                              color: "var(--muted)", letterSpacing: "0.06em",
                              textTransform: "uppercase", flexShrink: 0,
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
                      flex: 1, height: "28px",
                      borderRadius: "6px", border: "1px solid var(--border)",
                      background: "var(--surface)", color: "var(--text)",
                      fontFamily: "var(--font-mono)", fontSize: "8px",
                      letterSpacing: "0.08em", textTransform: "uppercase",
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
                      flex: 1, height: "28px",
                      borderRadius: "6px", border: "1px solid var(--border)",
                      background: "var(--surface)", color: "var(--text)",
                      fontFamily: "var(--font-mono)", fontSize: "8px",
                      letterSpacing: "0.08em", textTransform: "uppercase",
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
    <div>
      <PanelHeader label="Career" />
      <div style={{ padding: "12px 0 32px 0" }}>

        {/* Column headers — anchored with bottom border */}
        <div style={{ display: "flex", marginBottom: "0" }}>
          <div style={{ width: "52px", flexShrink: 0 }} />
          <div style={{ flex: 1, display: "flex" }}>
            <div style={{
              flex: 1, paddingLeft: "24px", paddingBottom: "10px",
              borderBottom: "1px solid var(--border)",
            }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)" }}>Work</span>
            </div>
            <div style={{
              width: "42%", paddingLeft: "8px", paddingBottom: "10px",
              borderBottom: "1px solid var(--border)",
            }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)" }}>Education</span>
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
                  fontFamily: "var(--font-mono)", fontSize: "9px",
                  letterSpacing: "0.06em",
                  color: isYearActive(yr) ? "var(--text)" : yr === 2026 ? "var(--text)" : "var(--muted)",
                  fontWeight: 400,
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
                background: "#ef4444", flexShrink: 0,
              }} />
              <span style={{
                fontFamily: "var(--font-mono)", fontSize: "8px",
                letterSpacing: "0.1em", textTransform: "uppercase",
                color: "#ef4444", opacity: 0.75,
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
                borderRadius: "12px",
                background: "var(--surface)",
                border: "1px solid var(--border)",
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
                <div style={{
                  width: "32px", height: "32px", borderRadius: "50%",
                  background: "var(--surface2)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <span style={{
                    fontFamily: "var(--font-mono)", fontSize: "8px",
                    fontWeight: 400, color: "var(--muted)", letterSpacing: "0.08em",
                  }}>
                    {t.initials}
                  </span>
                </div>
                <div>
                  <p style={{
                    fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 400,
                    letterSpacing: "-0.01em", color: "var(--muted2)", lineHeight: 1.3,
                  }}>
                    {t.name}
                  </p>
                  <p style={{
                    fontFamily: "var(--font-mono)", fontSize: "8px", fontWeight: 400,
                    letterSpacing: "0.08em", textTransform: "uppercase",
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
const aiExplorations = [
  {
    number: "01",
    title: "AI-Assisted Research Synthesis",
    tags: ["Claude", "Dovetail"],
    body: "Built a workflow using Claude to synthesise raw interview transcripts into themes, opportunity statements, and HMW questions in minutes — work that used to take days. Now a core part of my discovery process.",
    status: "In use",
  },
  {
    number: "02",
    title: "Prompt-Driven Wireframing",
    tags: ["Cursor", "Figma AI"],
    body: "Experimenting with prompt-to-wireframe pipelines using Cursor and Figma AI. The output is rough, but it's a forcing function — it surfaces structural decisions before I get attached to any visual direction.",
    status: "Ongoing",
  },
  {
    number: "03",
    title: "This Portfolio",
    tags: ["Claude Code", "Next.js"],
    body: "Designed and shipped entirely using Claude Code. No separate dev handoff — I wrote the brief, Claude wrote the code, I directed the output. Proof that a designer with the right tools can own the full stack.",
    status: "Shipped",
  },
  {
    number: "04",
    title: "LLM UX Copy Reviewer",
    tags: ["GPT-4", "Figma"],
    body: "A Figma plugin prototype that runs selected copy through an LLM and flags tone, reading level, and clarity issues — with suggested rewrites. Reduces back-and-forth with content designers on early-stage screens.",
    status: "Prototype",
  },
  {
    number: "05",
    title: "AI Decision Audit Trail",
    tags: ["Claude", "Notion"],
    body: "A structured prompt system that captures design decisions with rationale, tradeoffs, and alternatives considered. Feeds directly into Notion as a living decision log. Useful for async teams and post-mortems.",
    status: "In use",
  },
];

const statusColors: Record<string, string> = {
  "In use":   "#16a34a",
  "Ongoing":  "#2563eb",
  "Shipped":  "#7c3aed",
  "Prototype":"#d97706",
};

function AIExplorationsPanel() {
  return (
    <div>
      <PanelHeader label="AI Explorations" />
      <div style={{ padding: "16px 24px 48px" }}>

        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          style={{ fontFamily: "var(--font-body)", fontSize: "13px", lineHeight: 1.65, letterSpacing: "-0.01em", color: "var(--muted)", marginBottom: "24px", fontWeight: 400 }}
        >
          Side experiments at the intersection of AI and design practice. Some are workflows, some are tools, some are just curiosity.
        </motion.p>

        <div style={{ borderTop: "1px solid var(--border)" }}>
          {aiExplorations.map((item, i) => (
            <motion.div
              key={item.number}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.5, ease: EASE, delay: i * 0.06 }}
              style={{
                padding: "20px 0",
                borderBottom: "1px solid var(--border)",
                transition: "opacity 0.2s cubic-bezier(0.22,1,0.36,1)",
              }}
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
              {/* Number + status */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                <span data-label="true" style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.08em", color: "var(--muted)", transition: "color 0.2s cubic-bezier(0.22,1,0.36,1)" }}>
                  {item.number}
                </span>
                <span style={{
                  fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "0.08em",
                  padding: "3px 8px", borderRadius: "4px",
                  background: statusColors[item.status] + "18",
                  color: statusColors[item.status],
                  textTransform: "uppercase",
                }}>
                  {item.status}
                </span>
              </div>

              {/* Title */}
              <h3 style={{ fontFamily: "var(--font-body)", fontSize: "15px", fontWeight: 400, color: "var(--text)", letterSpacing: "-0.02em", lineHeight: 1.3, marginBottom: "8px" }}>
                {item.title}
              </h3>

              {/* Tags */}
              <div style={{ display: "flex", gap: "6px", marginBottom: "10px", flexWrap: "wrap" }}>
                {item.tags.map(tag => (
                  <span key={tag} style={{
                    fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "0.08em",
                    padding: "2px 7px", background: "var(--surface2)",
                    color: "var(--muted)", borderRadius: "4px", textTransform: "uppercase",
                  }}>
                    {tag}
                  </span>
                ))}
              </div>

              {/* Body */}
              <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", lineHeight: 1.65, letterSpacing: "-0.01em", color: "var(--muted2)", fontWeight: 400 }}>
                {item.body}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <div style={{ marginTop: "32px" }}>
          <motion.h2
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: EASE }}
            style={{ fontFamily: "var(--font-body)", fontSize: "20px", fontWeight: 400, letterSpacing: "-0.025em", lineHeight: 1.25, color: "var(--text)", marginBottom: "8px" }}
          >
            Have a hard problem?
          </motion.h2>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", lineHeight: 1.65, letterSpacing: "-0.01em", color: "var(--muted)", marginBottom: "20px", fontWeight: 400 }}>
            I&apos;m always interested in complex design challenges at the intersection of product, data, and AI.
          </p>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <a
              href="mailto:akgaddam02@gmail.com"
              className="btn-primary"
              style={{ fontSize: "13px", padding: "10px 20px", borderRadius: "7px" }}
            >
              Say hello →
            </a>
            <Link
              href="https://linkedin.com/in/akgaddam"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
              style={{ fontSize: "13px", padding: "10px 20px", borderRadius: "7px" }}
            >
              LinkedIn ↗
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: "48px", paddingTop: "24px", borderTop: "1px solid var(--border)" }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 400, letterSpacing: "-0.01em", color: "var(--muted)", lineHeight: 1.3 }}>
            © 2026 · Arun Gaddam · Hyderabad, India
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Panel shadow helpers ── */
const PANEL_SHADOW_LIGHT = "0 1px 2px rgba(0,0,0,0.04), 0 6px 24px rgba(0,0,0,0.06)";
const PANEL_SHADOW_ACTIVE_LIGHT = "0 2px 4px rgba(0,0,0,0.06), 0 12px 40px rgba(0,0,0,0.10)";
const PANEL_SHADOW_DARK  = "0 0 0 1px rgba(255,255,255,0.06), 0 6px 24px rgba(0,0,0,0.5)";
const PANEL_SHADOW_ACTIVE_DARK = "0 0 0 1px rgba(255,255,255,0.09), 0 12px 40px rgba(0,0,0,0.7)";

const PANEL_CONFIGS = [
  { label: "About",          width: "420px", minWidth: "380px", Component: AboutPanel },
  { label: "Work",           width: "440px", minWidth: "380px", Component: WorkPanel },
  { label: "Career",         width: "420px", minWidth: "380px", Component: CareerPanel },
  { label: "Testimonials",   width: "400px", minWidth: "360px", Component: TestimonialsPanel },
  { label: "AI Explorations",width: "420px", minWidth: "380px", Component: AIExplorationsPanel },
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
    const t = setTimeout(() => {
      setLoading(false);
      setTimeout(() => setRevealed(true), 80); // slight delay so panels animate after loader exits
    }, 1300);
    return () => clearTimeout(t);
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
      <Cursor />
      <HomeNav onPrev={() => scrollByPanel(-1)} onNext={() => scrollByPanel(1)} activePanel={activePanel} />

      {/* Right-edge fade — hides on last panel */}
      <motion.div
        className="panels-right-fade"
        animate={{ opacity: isLastPanel ? 0 : 1 }}
        transition={{ duration: 0.3, ease: EASE }}
        style={{
          position: "fixed", top: "52px", right: 0,
          width: "80px", height: "calc(100vh - 52px)",
          background: "linear-gradient(to right, transparent, var(--chrome))",
          pointerEvents: "none", zIndex: 100,
        }}
      />

      <main className="home-main" style={{ paddingTop: "52px", height: "100vh", overflow: "hidden", background: "var(--chrome)" }}>
        <div
          ref={containerRef}
          className="panels-container"
          style={{
            display: "flex",
            height: "calc(100vh - 52px)",
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
                initial={{ opacity: 0, y: 16 }}
                animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                transition={{ duration: 0.55, ease: EASE, delay: i * 0.07 }}
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
          0%   { box-shadow: 0 0 0 0px rgba(239,68,68,0.4); }
          60%  { box-shadow: 0 0 0 5px rgba(239,68,68,0); }
          100% { box-shadow: 0 0 0 0px rgba(239,68,68,0); }
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
