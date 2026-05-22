"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import React, { useRef, useCallback, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import ThemeToggle from "@/components/ThemeToggle";
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- kept for revival; PortfolioChat is hidden from the nav for now
import PortfolioChat from "@/components/PortfolioChat";
import { MapLibreMap } from "@/components/ui/MapLibreMap";
import { caseStudies } from "@/lib/caseStudies";
import ISTClock from "@/components/ISTClock";
import { ArrowUpRight, Compass, Search, Sparkles, LayoutGrid, Menu, X, Users, Briefcase, Path, TreeStructure } from "@/components/ui/Icon";
import { InlineChip, type ChipTone } from "@/components/ui/InlineChip";
import LoadingScreen from "@/components/LoadingScreen";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ── Haptic utility. silently ignored on desktop ── */
const haptic = (pattern: number | number[]) => {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(pattern);
  }
};

/* ── Home nav. name + panel arrows ──
   PANEL_LABELS is derived from PANEL_CONFIGS (defined further down) so the
   two arrays cannot drift out of sync. PANEL_CONFIGS is the single source.
   This works at runtime because every PANEL_LABELS read happens inside a
   React component body (HomeNav, FloatingPanelMenu), which executes after
   all module-level `const` initialization completes. */

/* ── View-mode toggle. Workspace (current dense layout) vs Story.
   Story is a Ben-Roach-style stripped-down single-column resume page:
   bio paragraph, 3 stats, work list, contact. No cards, chips, or panels.
   Uses --bg/--text tokens so it respects the user's theme. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- kept for revival; toggle is hidden from the nav for now
function ViewModeToggle({
  viewMode,
  onChange,
}: {
  viewMode: "workspace" | "story";
  onChange: (m: "workspace" | "story") => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="View mode"
      style={{
        display: "inline-flex",
        alignItems: "center",
        height: "44px",
        padding: "4px",
        borderRadius: "12px",
        background: "var(--surface)",
        boxShadow: "var(--card-shadow)",
        gap: "2px",
      }}
    >
      {(["workspace", "story"] as const).map((m) => {
        const active = viewMode === m;
        return (
          <button
            key={m}
            role="tab"
            aria-selected={active}
            onClick={() => { haptic(8); onChange(m); }}
            style={{
              height: "36px",
              padding: "0 12px",
              borderRadius: "8px",
              border: "none",
              background: active ? "var(--bg)" : "transparent",
              color: "var(--text)",
              fontFamily: "var(--font-logo)",
              fontSize: "var(--text-mono-lg)",
              fontWeight: 500,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              cursor: active ? "default" : "pointer",
              opacity: active ? 1 : 0.55,
              transition: "background 0.25s cubic-bezier(0.22,1,0.36,1), opacity 0.25s",
            }}
            onMouseEnter={e => { if (!active) e.currentTarget.style.opacity = "0.85"; }}
            onMouseLeave={e => { if (!active) e.currentTarget.style.opacity = "0.55"; }}
          >
            {m === "workspace" ? "Workspace" : "Story"}
          </button>
        );
      })}
    </div>
  );
}

function HomeNav({
  onPrev,
  onNext,
  activePanel,
  viewMode,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- kept for revival; ViewModeToggle is hidden from the nav for now
  onViewModeChange,
}: {
  onPrev: () => void;
  onNext: () => void;
  activePanel: number;
  viewMode: "workspace" | "story";
  onViewModeChange: (m: "workspace" | "story") => void;
}) {
  return (
    <header
      className="home-nav"
      style={{
        position: "fixed",
        /* 8px breathing room above the nav so it doesn't sit flush
           against the top edge. same rhythm as the inter-panel gap. */
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
      {/* Name + theme toggle */}
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
        {/* Quick guide + view-mode toggle hidden -focus is on Workspace
            polish for now. Underlying components stay in code so they can
            be restored later. */}
      </div>

      {/* Panel dots + arrows -hidden in Story mode (no panels to navigate). */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          visibility: viewMode === "story" ? "hidden" : "visible",
        }}
        aria-hidden={viewMode === "story"}
      >
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
                /* Inactive dots use --muted (warm taupe) instead of --border —
                   the warm parchment chrome is too close in lightness to --border,
                   so dots disappeared in light theme. --muted gives clear
                   separation while staying clearly inactive vs --text. */
                background: i === activePanel ? "var(--text)" : "var(--muted)",
                opacity: i === activePanel ? 1 : 0.45,
                transition: "width 0.3s cubic-bezier(0.22,1,0.36,1), background 0.3s, opacity 0.3s",
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
                  cursor: disabled ? "default" : "pointer",
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

/* ── Floating panel menu (mobile only) ──
   Bottom-right FAB. Tap to expand a sheet listing all six panels.
   Auto-hides on scroll-down, reappears on scroll-up. Hidden via CSS
   on desktop (≥641px) -desktop has its own dot-nav + arrows in HomeNav. */
function FloatingPanelMenu({
  activePanel,
  onSelect,
}: {
  activePanel: number;
  onSelect: (i: number) => void;
}) {
  const [open, setOpen]     = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY  = useRef(0);
  const ticking = useRef(false);

  /* Auto-hide on scroll-down, restore on scroll-up. rAF-throttled
     to stay within UX-PRO `debounce-throttle` and `main-thread-budget`. */
  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - lastY.current;
        if (Math.abs(delta) > 4) {
          if (delta > 0 && y > 60) setHidden(true);
          else setHidden(false);
          lastY.current = y;
        }
        ticking.current = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Esc closes the sheet. Outside-tap handled by the backdrop layer below. */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {/* Outside-tap backdrop (transparent, only when open) */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setOpen(false)}
            className="floating-panel-menu-backdrop"
            style={{
              position: "fixed", inset: 0, zIndex: 149,
              background: "transparent",
            }}
          />
        )}
      </AnimatePresence>

      <div
        className="floating-panel-menu"
        style={{
          position: "fixed",
          right: "20px",
          bottom: "20px",
          zIndex: 150,
          transform: hidden && !open ? "translateY(140%)" : "translateY(0)",
          transition: "transform 0.32s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        <AnimatePresence>
          {open && (
            <motion.div
              role="menu"
              aria-label="Panel navigation"
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              style={{
                position: "absolute",
                right: 0,
                bottom: "56px",
                minWidth: "180px",
                padding: "6px",
                borderRadius: "16px",
                background: "color-mix(in srgb, var(--bg) 92%, transparent)",
                border: "1px solid var(--border)",
                boxShadow: "var(--card-shadow)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                transformOrigin: "bottom right",
              }}
            >
              {PANEL_LABELS.map((label, i) => (
                <button
                  key={label}
                  role="menuitem"
                  onClick={() => { onSelect(i); setOpen(false); }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    minHeight: "44px",
                    textAlign: "left",
                    padding: "12px 14px",
                    borderRadius: "8px",
                    border: "none",
                    background: i === activePanel ? "var(--surface)" : "transparent",
                    color: i === activePanel ? "var(--text)" : "var(--muted2)",
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--text-mono)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    fontWeight: 400,
                    cursor: "pointer",
                    transition: "background 0.18s, color 0.18s",
                    boxSizing: "border-box",
                  }}
                >
                  {label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* FAB trigger */}
        <button
          onClick={() => setOpen(o => !o)}
          aria-label={open ? "Close panel menu" : "Open panel menu"}
          aria-expanded={open}
          aria-haspopup="menu"
          style={{
            width: "44px", height: "44px",
            borderRadius: "50%",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            color: "var(--text)",
            boxShadow: "var(--card-shadow)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
            padding: 0,
          }}
        >
          {open ? <X size={18} strokeWidth={1.5} /> : <Menu size={18} strokeWidth={1.5} />}
        </button>
      </div>
    </>
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
        fontSize: "var(--text-mono)",
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
/* ── Grayscale-to-colour portrait reveal ── */
function PixelRevealPortrait({ src, alt }: { src: string; alt: string }) {
  const [colorized, setColorized] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setColorized(true), 600);
          observer.disconnect();
        }
      },
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", width: "100%", height: "100%", borderRadius: "16px", overflow: "hidden" }}>
      <img
        src={src}
        alt={alt}
        style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%",
          objectFit: "cover", objectPosition: "center top",
          display: "block",
          filter: colorized ? "grayscale(0%)" : "grayscale(100%)",
          transition: "filter 1.2s cubic-bezier(0.22,1,0.36,1)",
        }}
      />
    </div>
  );
}

/* ── Portrait: parallax tilt on hover ── */
function PortraitMagnify() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [leaving, setLeaving] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width  - 0.5;
    const ny = (e.clientY - rect.top)  / rect.height - 0.5;
    setTilt({ x: nx * 14, y: -ny * 10 });
    setLeaving(false);
  };

  const handleMouseLeave = () => {
    setLeaving(true);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div style={{ perspective: "700px", width: "100%", aspectRatio: "4 / 3" }}>
      <div
        ref={containerRef}
        onMouseEnter={() => setLeaving(false)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          position: "relative",
          width: "100%", height: "100%",
          borderRadius: "16px",
          overflow: "hidden",
          transform: `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
          transition: leaving ? "transform 0.55s cubic-bezier(0.22,1,0.36,1)" : "transform 0.08s linear",
          willChange: "transform",
        }}
      >
        <PixelRevealPortrait src="/arun-gaddam.png" alt="Arun Gaddam" />
      </div>
    </div>
  );
}

/* InlineChip + ChipTone moved to components/ui/InlineChip.tsx so the case
   study detail hero can reuse the same chip system. */


function AboutPanel() {
  const [copied, setCopied] = useState(false);
  const copyEmail = () => {
    navigator.clipboard.writeText("akgaddam02@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <PanelHeader label="About me" />
      <div className="about-panel-body" style={{ padding: "16px 24px 48px" }}>

        {/* Portrait. illustration by default, real photo on hover */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          style={{ marginBottom: "20px" }}
        >
          <PortraitMagnify />
        </motion.div>

        {/* Seniority eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.02 }}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-mono)",
            fontWeight: 500,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--muted)",
            marginBottom: "6px",
          }}
        >
          Senior Product Designer · 8+ years
        </motion.p>

        {/* Hero headline. typography per Figma reference:
            Inter 400 / 18px / line-height 30px / 0 tracking. */}
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.05 }}
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "24px",
            fontWeight: 400,
            lineHeight: 1.6,
            letterSpacing: "-0.03em",
            color: "var(--text-display)",
            marginBottom: "20px",
          }}
        >
          Helping product teams <InlineChip label="reduce ambiguity" tone="amber" scale="match" /> through <InlineChip label="research, rapid validation" tone="violet" scale="match" /> <InlineChip label="structured UX thinking" tone="emerald" scale="match" /></motion.h1>

        {/* Bio. typography per Figma reference:
            Inter 400 / 14px / line-height 26px / 0 tracking. */}
        <motion.p
          className="text-hoverable"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-body-lg)",
            lineHeight: 1.65,
            letterSpacing: "-0.01em",
            color: "var(--muted)",
            marginBottom: "28px",
          }}
        >
          I&apos;m hands on throughout the entire process, from strategy to execution. These days, I lean on AI to move faster and test ideas.
        </motion.p>

        {/* Contact links -moved above Focus, no label. Touch-target safe
            (≥44px tall via 12px×16px padding + 12px text). */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.15 }}
          style={{
            display: "flex", alignItems: "center", gap: "8px",
            flexWrap: "wrap", marginBottom: "20px",
          }}
        >
          {/* Plain-text CTA pattern — used across About panel + case study
              top nav + case study back button. Mono caps, no border, no bg,
              just text + arrow with hover color lift. */}
          <button
            onClick={copyEmail}
            aria-label={copied ? "Email copied" : "Copy email address"}
            style={{
              fontFamily: "var(--font-mono)", fontSize: "var(--text-mono)", fontWeight: 400,
              letterSpacing: "0.08em", textTransform: "uppercase",
              color: copied ? "var(--accent-success)" : "var(--muted)",
              padding: "8px 4px",
              border: "none", background: "transparent",
              cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "4px",
              transition: "color 0.18s",
            }}
            onMouseEnter={e => { if (!copied) { e.currentTarget.style.color = "var(--text)"; } }}
            onMouseLeave={e => { if (!copied) { e.currentTarget.style.color = "var(--muted)"; } }}
          >
            {copied ? "Copied ✓" : "Copy email"}
          </button>

          {[
            { label: "LinkedIn", href: "https://www.linkedin.com/in/akgaddam/", external: true },
            { label: "CV", href: "https://drive.google.com/file/d/1VWajNl_cigKjLwMNevZIJXUm1bY3hoOs/view?usp=sharing", external: true },
          ].map(({ label, href, external }) => (
            <Link
              key={label}
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              style={{
                fontFamily: "var(--font-mono)", fontSize: "var(--text-mono)", fontWeight: 400,
                letterSpacing: "0.08em", textTransform: "uppercase",
                color: "var(--muted)",
                padding: "8px 4px",
                display: "inline-flex", alignItems: "center", gap: "4px",
                transition: "color 0.18s",
                textDecoration: "none",
              }}
              onMouseEnter={e => { e.currentTarget.style.color = "var(--text)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "var(--muted)"; }}
            >
              {label}
              <ArrowUpRight size={11} strokeWidth={1.5} />
            </Link>
          ))}
        </motion.div>

        {/* Experience row */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: EASE, delay: 0.18 }}
          style={{ padding: "16px 0" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
            <p style={{
              fontFamily: "var(--font-mono)", fontSize: "var(--text-eyebrow)",
              letterSpacing: "0.1em", textTransform: "uppercase",
              color: "var(--muted)", whiteSpace: "nowrap", fontWeight: 400,
            }}>
              Experience
            </p>
            <div style={{ flex: 1, borderTop: "1px dashed var(--border)" }} />
          </div>
          <p className="text-hoverable" style={{
            fontFamily: "var(--font-body)", fontSize: "var(--text-body-lg)",
            letterSpacing: "-0.01em",
            color: "var(--muted)", lineHeight: 1.65, fontWeight: 400,
          }}>
            Designing products for startups and large scale platforms with millions of users.
          </p>
        </motion.div>

        {/* Industries row */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: EASE, delay: 0.21 }}
          style={{ padding: "16px 0" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <p style={{
              fontFamily: "var(--font-mono)", fontSize: "var(--text-eyebrow)",
              letterSpacing: "0.1em", textTransform: "uppercase",
              color: "var(--muted)", whiteSpace: "nowrap", fontWeight: 400,
            }}>
              Industries
            </p>
            <div style={{ flex: 1, borderTop: "1px dashed var(--border)" }} />
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {["B2B", "SaaS", "Fintech", "Manufacturing", "Entertainment", "Customer Experience"].map(chip => (
              <span key={chip} style={{
                fontFamily: "var(--font-body)", fontSize: "var(--text-caption)",
                fontWeight: 400, letterSpacing: "-0.01em",
                padding: "4px 10px", borderRadius: "9999px",
                background: "var(--surface)",
                border: "1px solid var(--border)",
                color: "var(--muted2)",
              }}>
                {chip}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Skills marquee */}
        {(() => {
          const skills = [
            "AI UX",
            "Systems Thinking", "Product Strategy",
            "UX Research", "JTBD", "Service Design", "Research Synthesis",
            "Interaction Design", "Information Architecture", "Prototyping", "Design Systems",
            "Claude", "Agentic AI",
          ];
          return (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, ease: EASE, delay: 0.24 }}
              style={{ padding: "12px 0" }}
              className="skills-ticker"
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                <p style={{
                  fontFamily: "var(--font-mono)", fontSize: "var(--text-eyebrow)",
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  color: "var(--muted)", whiteSpace: "nowrap", fontWeight: 400,
                }}>
                  Skills
                </p>
                <div style={{ flex: 1, borderTop: "1px dashed var(--border)" }} />
              </div>

              <div style={{ overflow: "hidden", position: "relative" }}>
                <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "32px", background: "linear-gradient(to right, var(--bg), transparent)", zIndex: 1, pointerEvents: "none" }} />
                <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "32px", background: "linear-gradient(to left, var(--bg), transparent)", zIndex: 1, pointerEvents: "none" }} />
                <div
                  className="marquee-track"
                  style={{
                    ["--marquee-duration" as string]: "32s",
                    display: "flex", alignItems: "center", gap: "0", whiteSpace: "nowrap",
                  }}
                >
                  {skills.map((skill, i) => (
                    <span key={`a-${skill}-${i}`} style={{ display: "inline-flex", alignItems: "center" }}>
                      <span style={{
                        fontFamily: "var(--font-body)", fontSize: "var(--text-caption)", fontWeight: 400,
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
                  <span className="marquee-clone" aria-hidden style={{ display: "inline-flex", alignItems: "center" }}>
                    {skills.map((skill, i) => (
                      <span key={`b-${skill}-${i}`} style={{ display: "inline-flex", alignItems: "center" }}>
                        <span style={{
                          fontFamily: "var(--font-body)", fontSize: "var(--text-caption)", fontWeight: 400,
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
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })()}

      </div>
    </div>
  );
}

/* ── Mesh thumbnail. mouse-reactive radial gradient orbs ── */
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
  /* Current and target orb positions. Mouse drives the target;
     the rAF loop eases the current values toward it for a smooth,
     trailing motion across three layered radial gradients. */
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

  /* rAF loop. lerp orbs toward mouse, paint as background gradients.
     Each orb follows at a slightly different rate, giving the trio a
     parallax-like wobble rather than moving in lockstep. */
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
      x: ((e.clientX - rect.left) / rect.width)  * 100,
      y: ((e.clientY - rect.top)  / rect.height) * 100,
    };
  };

  const startRaf = () => { if (!raf.current) raf.current = requestAnimationFrame(update); };
  const stopRaf  = () => {
    if (raf.current) { cancelAnimationFrame(raf.current); raf.current = null; }
    /* Reset the target to centre when the cursor leaves so the orbs
       drift back toward a neutral resting position next time. */
    mouse.current = { x: 50, y: 50 };
  };

  useEffect(() => () => { if (raf.current) cancelAnimationFrame(raf.current); }, []);

  // Theme-aware colour values
  const badgeBg   = isDark ? "rgba(0,0,0,0.4)"        : "rgba(255,255,255,0.6)";
  const badgeColor = isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.4)";

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={startRaf}
      onMouseLeave={stopRaf}
      style={{
        height: "192px",
        background: palette.base,
        position: "relative", overflow: "hidden",
        /* Rounded top corners so the mesh matches the work-card image
           treatment (the static images use borderRadius "8px 8px 0 0"). */
        borderRadius: "8px 8px 0 0",
      }}
    >
      <div className="paper-grain" />
      {confidential && (
        <div style={{
          position: "absolute", top: "10px", right: "10px",
          background: badgeBg,
          borderRadius: "6px", padding: "4px 8px",
          fontFamily: "var(--font-body)", fontSize: "var(--text-mono-lg)",
          fontWeight: 500, letterSpacing: "-0.01em",
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
  "astra":                "/images/astra/overview.mp4",
  "planful-esm-tables":   "/images/planful/planful-product-video.mp4",
  "apple-business-listings": "/images/reputation/after.mp4",
  "fancode-homepage":     "/images/fancode/fancode-homepage-after.mp4",
  "zetwerk-dc":           "/images/zetwerk/cover.png",
  "zetwerk-bu-ecosystem": "/images/zetwerk-bu/service-blueprint.png",
};

const WORK_POSTERS: Record<string, string> = {
  "astra":                "/images/astra/cover.jpg",
  "planful-esm-tables":   "/images/planful/landing-page.jpg",
  "apple-business-listings": "/images/reputation/thumbnail.jpg",
  "fancode-homepage":     "/images/fancode/overall-homepage.jpg",
};

// Video file extensions that should render through <video> instead of <img>.
const isVideoThumb = (src: string) => /\.(mov|mp4|webm)$/i.test(src);

/* ── Work card thumbnail shimmer wrapper ── */
function WorkCardThumb({
  src, poster, height = 200, borderRadius = "8px 8px 0 0",
}: {
  src: string; poster?: string; height?: number; borderRadius?: string;
}) {
  const [ready, setReady] = useState(false);
  const [inView, setInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isVideo = isVideoThumb(src);

  /* Only trigger video loading when the card is (nearly) visible.
     rootMargin of 120px means the video starts buffering one card-height
     before it scrolls into view — enough lead time for a smooth autoplay,
     without loading off-screen videos on page load.
     Mobile: autoplay works with muted + playsInline on iOS 10+ and
     modern Chrome. Poster fades out once the video signals canplay. */
  useEffect(() => {
    if (!isVideo) return;
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
      { rootMargin: "120px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isVideo]);

  const coverStyle: React.CSSProperties = {
    position: "absolute", inset: 0,
    width: "100%", height: "100%",
    objectFit: "cover", objectPosition: "center top",
    display: "block", borderRadius,
  };

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%", height: "100%" }}>
      {isVideo ? (
        <>
          {/* Shimmer skeleton while the video buffers. No poster image —
              the video plays as-is once canplay fires. */}
          {!ready && (
            <div style={{
              position: "absolute", inset: 0,
              borderRadius,
              background: "linear-gradient(90deg, var(--surface) 25%, var(--surface2) 50%, var(--surface) 75%)",
              backgroundSize: "400% 100%",
              animation: "shimmer 1.4s ease infinite",
              zIndex: 1,
            }} />
          )}
          {inView && (
            <video
              className="work-thumb"
              src={src}
              autoPlay loop muted playsInline
              preload="auto"
              aria-hidden="true"
              onCanPlay={() => setReady(true)}
              style={{
                ...coverStyle,
                opacity: ready ? 1 : 0,
                transition: "opacity 0.4s ease",
                zIndex: 2,
              }}
            />
          )}
        </>
      ) : (
        <>
          {/* Shimmer skeleton until the image fires onLoad. */}
          {!ready && (
            <div style={{
              position: "absolute", inset: 0,
              borderRadius,
              background: "linear-gradient(90deg, var(--surface) 25%, var(--surface2) 50%, var(--surface) 75%)",
              backgroundSize: "400% 100%",
              animation: "shimmer 1.4s ease infinite",
            }} />
          )}
          <img
            className="work-thumb"
            src={src}
            alt="" aria-hidden="true"
            loading="lazy" decoding="async"
            onLoad={() => setReady(true)}
            style={{
              ...coverStyle,
              opacity: ready ? 1 : 0,
              transition: "opacity 0.3s ease",
            }}
          />
        </>
      )}
    </div>
  );
}

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

/* ─── Featured Design System card. leads the Selected Work panel ─────
   The design system extracted from this portfolio. Documents the actual
   tokens, components, and patterns in the live codebase. no speculation. */
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
          {/* Thumbnail. auto-playing screen recording of the portfolio's
              design language in motion. Muted + looped, mirrors the case
              study video thumbnail pattern. */}
          <div style={{ position: "relative", height: "200px", overflow: "hidden", borderRadius: "16px 16px 0 0" }}>
            <WorkCardThumb
              src="/images/system/portfolio-design-language.mp4"
              poster="/images/system/cover.png"
              height={200}
              borderRadius="16px 16px 0 0"
            />
          </div>

          {/* Body */}
          <div style={{ padding: "12px 16px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap", marginBottom: "8px" }}>
              <AccentChip label="AI Exploration" tone="violet" icon={Sparkles} />
              {["Design Language", "Built with Claude"].map(tag => (
                <WorkChip key={tag} label={tag} />
              ))}
            </div>

            <h3 style={{
              fontFamily: "var(--font-body)", fontSize: "var(--text-title-sm)", fontWeight: 500,
              lineHeight: "22px", letterSpacing: 0,
              color: "var(--text)", marginBottom: "4px",
            }}>
              Portfolio Design Language
            </h3>

            <p style={{
              fontFamily: "var(--font-body)", fontSize: "var(--text-body)", fontWeight: 400,
              lineHeight: 1.5, letterSpacing: 0,
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

/* Map a tag string to the most fitting icon. Returns null if no clear match. */
function tagIcon(tag: string) {
  const t = tag.toLowerCase();
  if (t.includes("ai") || t.includes("claude")) return Sparkles;
  if (t.includes("research") || t.includes("ftux")) return Search;
  if (t.includes("enterprise") || t.includes("saas") || t.includes("fintech") || t.includes("b2b")) return Briefcase;
  if (t.includes("consumer") || t.includes("cxm") || t.includes("sports") || t.includes("mobile")) return Users;
  if (t.includes("design system") || t.includes("data") || t.includes("dashboard") || t.includes("workflow") || t.includes("ia") || t.includes("information")) return LayoutGrid;
  if (t.includes("service") || t.includes("operations") || t.includes("supply") || t.includes("strategy") || t.includes("retention") || t.includes("product")) return Compass;
  return LayoutGrid; // sensible fallback
}

/* Shared greyscale chip -icon + label, same mono style as before. */
function WorkChip({ label }: { label: string }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      fontFamily: "var(--font-mono)", fontSize: "var(--text-mono)",
      letterSpacing: "0.06em", textTransform: "uppercase",
      padding: "4px 8px", background: "var(--surface2)",
      border: "1px solid var(--border)",
      color: "var(--text)", borderRadius: "6px",
    }}>
      {label}
    </span>
  );
}

/* Accent chip -tonal category badge (theme-aware). Stands out from the
   standard greyscale WorkChip (e.g. "AI Experiments", "Coming soon"). */
function AccentChip({ label, tone = "violet", icon: Icon }: {
  label: string;
  tone?: ChipTone;
  icon?: (p: { size?: number; strokeWidth?: number; style?: React.CSSProperties }) => React.ReactElement;
}) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      fontFamily: "var(--font-mono)", fontSize: "var(--text-mono)",
      letterSpacing: "0.06em", textTransform: "uppercase",
      padding: "4px 8px",
      background: `var(--chip-${tone}-bg)`,
      border: `1px solid color-mix(in srgb, var(--chip-${tone}-text) 50%, transparent)`,
      color: `var(--chip-${tone}-text)`,
      borderRadius: "6px",
      lineHeight: 1.4,
    }}>
      {label}
    </span>
  );
}

function WorkPanel() {
  // Explicit display order. Only 4 cases shown in the public grid.
  // Confidential cases (zetwerk-dc, zetwerk-bu-ecosystem, astra) are
  // accessible via direct URL only -share with recruiters as needed.
  // Astra is hidden from the public surface; the route 404s.
  const CARD_ORDER = [
    "planful-esm-tables", "apple-business-listings", "fancode-homepage",
  ];
  const EXPLORATION_ORDER = ["astra"];
  const COMING_SOON = new Set<string>();

  const allCards = CARD_ORDER
    .map(slug => caseStudies.find(cs => cs.slug === slug))
    .filter((cs): cs is NonNullable<typeof cs> => !!cs);
  const explorationCards = EXPLORATION_ORDER
    .map(slug => caseStudies.find(cs => cs.slug === slug))
    .filter((cs): cs is NonNullable<typeof cs> => !!cs);

  /* Shared password gate. Client-side password comparison has been
     replaced with a server action (app/actions/unlock.ts) that sets an
     HttpOnly cookie. The visible behaviour is preserved: clicking an
     archived case study opens the password modal; submitting the
     correct password unlocks and opens the case study in a new tab.

     `archivedUnlocked` now reflects a non-sensitive marker cookie
     (cs-unlock-ui) the server sets alongside the real HttpOnly cookie
     — the UI cookie is readable from JS only so the page can render
     "Unlocked" state without an extra round-trip. The real auth cookie
     remains HttpOnly and is the only one the server trusts. */
  const UNLOCK_UI_KEY = "cs-unlock-ui";
  const [archivedUnlocked, setArchivedUnlocked] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const sync = () => {
      const fromCookie = document.cookie
        .split(";")
        .some(c => c.trim().startsWith(`${UNLOCK_UI_KEY}=1`));
      setArchivedUnlocked(fromCookie);
    };
    sync();
    window.addEventListener("focus", sync);
    return () => window.removeEventListener("focus", sync);
  }, []);
  const [pwOpen, setPwOpen] = useState(false);
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState<null | "wrong" | "rate-limited" | "config">(null);
  const [retryInSec, setRetryInSec] = useState<number | null>(null);
  const [pwBusy, setPwBusy] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const handleArchivedClick = (e: React.MouseEvent, href: string) => {
    const fromCookie = typeof document !== "undefined"
      && document.cookie.split(";").some(c => c.trim().startsWith(`${UNLOCK_UI_KEY}=1`));
    if (fromCookie) {
      if (!archivedUnlocked) setArchivedUnlocked(true);
      return; // allow the link to navigate
    }
    e.preventDefault();
    setPendingHref(href);
    setPwInput("");
    setPwError(null);
    setRetryInSec(null);
    setPwOpen(true);
  };
  const submitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError(null);
    setRetryInSec(null);
    setPwBusy(true);
    try {
      const { unlock } = await import("@/app/actions/unlock");
      const fd = new FormData();
      fd.set("password", pwInput);
      const result = await unlock(fd);
      if (result.ok) {
        // Set the JS-readable marker so the UI reflects unlock state
        // without round-tripping. The real auth cookie was already set
        // by the server action and is HttpOnly.
        document.cookie = `${UNLOCK_UI_KEY}=1; Path=/; Max-Age=${60 * 60 * 24 * 30}; SameSite=Lax`;
        setArchivedUnlocked(true);
        setPwOpen(false);
        if (pendingHref) {
          window.open(pendingHref, "_blank", "noopener,noreferrer");
          setPendingHref(null);
        }
      } else {
        setPwError(result.error);
        if (result.error === "rate-limited" && result.retryInSec) {
          setRetryInSec(result.retryInSec);
        }
        setPwInput("");
      }
    } finally {
      setPwBusy(false);
    }
  };
  // Esc closes the password modal — matches behaviour of other overlays.
  useEffect(() => {
    if (!pwOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setPwOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pwOpen]);
  // Lock body scroll while modal is open so the page can't shift behind it
  // on mobile (especially when the soft keyboard opens).
  useEffect(() => {
    if (!pwOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prevOverflow; };
  }, [pwOpen]);
  // Portal mount guard — createPortal must only run client-side after mount.
  const [portalReady, setPortalReady] = useState(false);
  useEffect(() => { setPortalReady(true); }, []);

  return (
    <div id="work-panel">
      <PanelHeader label="Selected Work" />
      <div style={{ padding: "16px 24px 32px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

          {allCards.map((cs, i) => {
            const href = `/work/${cs.slug}`;
            const comingSoon = COMING_SOON.has(cs.slug);
            const CardWrapper = comingSoon
              ? ({ children }: { children: React.ReactNode }) => <div style={{ cursor: "default" }}>{children}</div>
              : ({ children }: { children: React.ReactNode }) => <Link href={href}>{children}</Link>;
            return (
              <motion.div
                key={cs.slug}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={comingSoon ? {} : { y: -2 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{
                  opacity: { duration: 0.5, ease: EASE, delay: i * 0.06 },
                  y: { type: "spring", stiffness: 320, damping: 28 },
                }}
                style={comingSoon ? { opacity: 0.45 } : {}}
              >
                <CardWrapper>
                  <div
                    className="work-card"
                    style={{
                      background: "var(--surface)",
                      borderRadius: "16px",
                      overflow: "hidden",
                      boxShadow: "var(--card-shadow)",
                      transition: "box-shadow 0.25s cubic-bezier(0.22,1,0.36,1), transform 0.25s cubic-bezier(0.22,1,0.36,1)",
                    }}
                    onMouseEnter={e => { if (!comingSoon) e.currentTarget.style.boxShadow = "var(--card-shadow-hover)"; }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = "var(--card-shadow)"; }}
                  >
                    {/* Thumbnail */}
                    <div style={{ position: "relative", height: "220px", overflow: "hidden", borderRadius: "16px 16px 0 0" }}>
                      {WORK_THUMBS[cs.slug] ? (
                        <WorkCardThumb
                          src={WORK_THUMBS[cs.slug]}
                          poster={WORK_POSTERS[cs.slug]}
                          height={220}
                          borderRadius="16px 16px 0 0"
                        />
                      ) : (
                        <MeshThumbnail index={i} type={cs.type} confidential={cs.confidential} />
                      )}
                    </div>

                    {/* Body */}
                    <div style={{ padding: "12px 16px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap", marginBottom: "8px" }}>
                        {cs.slug === "astra"                  && <AccentChip label="AI Experiments"  tone="violet"  icon={Sparkles} />}
                        {cs.slug === "planful-esm-tables"     && <AccentChip label="Fintech"         tone="indigo"  icon={Briefcase} />}
                        {cs.slug === "apple-business-listings"&& <AccentChip label="CXM"             tone="teal"    icon={Users} />}
                        {cs.slug === "fancode-homepage"       && <AccentChip label="Consumer Mobile" tone="emerald" icon={LayoutGrid} />}
                        {cs.slug === "zetwerk-dc"             && <AccentChip label="Supply Chain"    tone="amber"   icon={Path} />}
                        {cs.slug === "zetwerk-bu-ecosystem"   && <AccentChip label="Service Design"  tone="amber"   icon={TreeStructure} />}
                        {cs.tags.slice(0, 2).map(tag => (
                          <WorkChip key={tag} label={tag} />
                        ))}
                        {comingSoon && <AccentChip label="Coming soon" tone="amber" />}
                      </div>
                      <h3 style={{
                        fontFamily: "var(--font-body)", fontSize: "var(--text-title-sm)", fontWeight: 500,
                        lineHeight: "22px", letterSpacing: "-0.02em",
                        color: "var(--text)", marginBottom: "4px",
                      }}>
                        {cs.title}
                      </h3>
                      <p style={{
                        fontFamily: "var(--font-body)", fontSize: "var(--text-body-lg)",
                        letterSpacing: "-0.01em",
                        color: "var(--muted)", lineHeight: 1.65, fontWeight: 400,
                        marginBottom: 0,
                      }}>
                        {cs.cardImpact ?? cs.subtitle}
                      </p>
                    </div>
                  </div>
                </CardWrapper>
              </motion.div>
            );
          })}
        </div>

        {/* AI Exploration — separate section below the main work grid. */}
        {explorationCards.length > 0 && (
          <div style={{ padding: "32px 0 16px" }}>
            <p style={{
              fontFamily: "var(--font-mono)", fontSize: "var(--text-mono-lg)", fontWeight: 400,
              letterSpacing: "0.1em", textTransform: "uppercase",
              color: "var(--muted)", margin: "0 0 12px 0",
            }}>
              AI Exploration
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {explorationCards.map((cs) => {
                const href = `/work/${cs.slug}`;
                return (
                  <motion.div
                    key={cs.slug}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -2 }}
                    viewport={{ once: true, margin: "-20px" }}
                    transition={{
                      opacity: { duration: 0.5, ease: EASE },
                      y: { type: "spring", stiffness: 320, damping: 28 },
                    }}
                  >
                    <Link href={href}>
                      <div className="work-card" style={{
                        background: "var(--surface)",
                        borderRadius: "16px",
                        overflow: "hidden",
                        boxShadow: "var(--card-shadow)",
                        transition: "box-shadow 0.25s cubic-bezier(0.22,1,0.36,1)",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.boxShadow = "var(--card-shadow-hover)"; }}
                      onMouseLeave={e => { e.currentTarget.style.boxShadow = "var(--card-shadow)"; }}
                      >
                        <div style={{ position: "relative", height: "200px", overflow: "hidden", borderRadius: "16px 16px 0 0" }}>
                          <WorkCardThumb
                            src={WORK_THUMBS[cs.slug] || ""}
                            poster={WORK_POSTERS[cs.slug]}
                            height={200}
                            borderRadius="16px 16px 0 0"
                          />
                        </div>
                        <div style={{ padding: "12px 16px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap", marginBottom: "8px" }}>
                            <AccentChip label="AI Exploration" tone="violet" icon={Sparkles} />
                          </div>
                          <h3 style={{
                            fontFamily: "var(--font-body)", fontSize: "var(--text-title-sm)", fontWeight: 500,
                            lineHeight: "22px", letterSpacing: 0,
                            color: "var(--text)", marginBottom: "4px",
                          }}>
                            {cs.title}
                          </h3>
                          <p style={{
                            fontFamily: "var(--font-body)", fontSize: "var(--text-body)", fontWeight: 400,
                            lineHeight: 1.5, letterSpacing: 0,
                            color: "var(--muted)", marginBottom: 0,
                          }}>
                            {cs.subtitle}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
              <SystemFeatureCard />
            </div>
          </div>
        )}

        {/* Archived case studies — PDF links */}
        <div style={{ padding: "0 0 24px" }}>
          <p style={{
            fontFamily: "var(--font-mono)", fontSize: "var(--text-mono-lg)", fontWeight: 400,
            letterSpacing: "0.1em", textTransform: "uppercase",
            color: "var(--muted)", margin: "16px 0 12px 0",
          }}>
            Archived case studies
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {([
              {
                title: "Designed first time user experience",
                subtitle: "Increased user retention by ~18% and subscription growth through UX improvements.",
                accent: <AccentChip label="Consumer Mobile" tone="emerald" icon={LayoutGrid} />,
                tags: ["UX Research", "Onboarding"],
                href: "https://drive.google.com/file/d/1w9phRxE7f3G9shoPu7CVFMAG6xMVaqi9/view?usp=sharing",
                thumbnail: "/images/fancode-ftux/fc-ftux-thumbnail.jpg",
                thumbnailPosition: "center center",
              },
              {
                title: "Vendor credit financing workflow",
                subtitle: "Streamlined faster business decisions with better risk visibility and opportunity assessment.",
                accent: <AccentChip label="Fintech" tone="indigo" icon={Briefcase} />,
                tags: ["Enterprise", "Workflow"],
                href: "https://drive.google.com/file/d/19Q3CF_KYVUfQx6OtYa0oSU2TGutACaW0/view?usp=sharing",
                thumbnail: "/images/zetwerk-cu/zw-creditunderwriting-thumbnail.jpg",
                thumbnailPosition: "center center",
              },
              {
                title: "Logistics and tax compliance in manufacturing",
                subtitle: "Achieved 90% adoption within three months while streamlining operations.",
                accent: <AccentChip label="Supply Chain" tone="amber" icon={Path} />,
                tags: ["B2B", "Enterprise"],
                href: "https://drive.google.com/file/d/1NcnWyM1oO2VF_YIoLjOvgALeAqPTym1k/view?usp=sharing",
                thumbnail: "/images/zetwerk-dc/zw-dc-thumbnail.png",
                thumbnailPosition: "center center",
              },
            ] as { title: string; subtitle: string; accent: React.ReactNode; tags: string[]; href: string; thumbnail?: string; thumbnailPosition?: string }[]).map(({ title, subtitle, accent, tags, href, thumbnail, thumbnailPosition }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -2 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{
                  opacity: { duration: 0.5, ease: EASE, delay: i * 0.06 },
                  y: { type: "spring", stiffness: 320, damping: 28 },
                }}
              >
                <Link
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none" }}
                  onClick={(e) => handleArchivedClick(e, href)}
                >
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
                    {thumbnail && (
                      <div style={{ position: "relative", height: "200px", overflow: "hidden", padding: "12px 12px 0" }}>
                        <div style={{ width: "100%", height: "100%", overflow: "hidden", borderRadius: "8px 8px 0 0", background: "var(--surface2)" }}>
                          <img
                            src={thumbnail}
                            alt={`${title} thumbnail`}
                            loading="lazy"
                            decoding="async"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              objectPosition: thumbnailPosition ?? "center top",
                              display: "block",
                            }}
                          />
                        </div>
                      </div>
                    )}
                    <div style={{ padding: "18px 20px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap", marginBottom: "12px" }}>
                        {accent}
                        {tags.map(tag => <WorkChip key={tag} label={tag} />)}
                      </div>
                      <h3 style={{
                        fontFamily: "var(--font-body)", fontSize: "var(--text-title-sm)", fontWeight: 600,
                        lineHeight: "22px", letterSpacing: "-0.02em",
                        color: "var(--text)", marginBottom: "8px",
                      }}>{title}</h3>
                      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "8px" }}>
                        <p style={{
                          fontFamily: "var(--font-body)", fontSize: "var(--text-body-lg)",
                          letterSpacing: "-0.01em", color: "var(--muted)",
                          lineHeight: 1.65, fontWeight: 400, marginBottom: 0,
                        }}>{subtitle}</p>
                        <span style={{
                          fontFamily: "var(--font-mono)", fontSize: "var(--text-mono)",
                          color: "var(--muted)", flexShrink: 0, opacity: 0.6,
                          lineHeight: 1,
                        }}>↗</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

      </div>

      {/* Password modal for archived case studies — portalled to document.body
          so it escapes the transformed panel ancestors (which would otherwise
          break `position: fixed` and trap the modal off-screen on mobile). */}
      {portalReady && createPortal(
      <AnimatePresence>
        {pwOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPwOpen(false)}
            style={{
              position: "fixed",
              top: 0, left: 0, right: 0,
              // 100dvh tracks the visual viewport on iOS Safari so the modal
              // doesn't get clipped behind the URL bar or the soft keyboard.
              height: "100dvh",
              zIndex: 300,
              background: "rgba(0,0,0,0.72)", backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: "16px",
              // If the modal grows taller than the viewport (very small phones
              // with the keyboard open), let it scroll inside the backdrop.
              overflowY: "auto",
              overscrollBehavior: "contain",
            }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="archived-pw-modal-title"
              initial={{ scale: 0.96, y: 10, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.96, y: 10, opacity: 0 }}
              transition={{ duration: 0.22, ease: EASE }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "var(--surface)", borderRadius: "20px",
                border: "1px solid var(--border)",
                boxShadow: "0 32px 80px -16px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.06)",
                padding: "36px 32px 28px",
                position: "relative",
                maxWidth: "360px", width: "100%",
                maxHeight: "calc(100dvh - 32px)",
                overflowY: "auto",
                marginTop: "max(16px, env(safe-area-inset-top))",
                marginBottom: "max(16px, env(safe-area-inset-bottom))",
              }}
            >
              {/* Close button */}
              <button
                type="button"
                onClick={() => setPwOpen(false)}
                aria-label="Close"
                style={{
                  position: "absolute",
                  top: "16px", right: "16px",
                  width: "28px", height: "28px",
                  borderRadius: "50%",
                  background: "var(--surface2)",
                  border: "none",
                  cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--muted)",
                  fontSize: "16px",
                  lineHeight: 1,
                }}
              >×</button>

              {/* Lock icon */}
              <div
                style={{
                  width: "52px", height: "52px",
                  borderRadius: "50%",
                  background: "var(--surface2)",
                  border: "1px solid var(--border)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: "20px",
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
                  style={{ color: "var(--muted2)" }}
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>

              <h3 id="archived-pw-modal-title" style={{
                fontFamily: "var(--font-body)", fontSize: "var(--text-title)",
                fontWeight: 500, letterSpacing: "-0.02em",
                color: "var(--text)", marginBottom: "6px", lineHeight: 1.25,
              }}>
                Password protected
              </h3>
              <p style={{
                fontFamily: "var(--font-body)", fontSize: "var(--text-body)",
                color: "var(--muted)", lineHeight: 1.55, marginBottom: "24px",
              }}>
                This work is under NDA. Reach out and I&apos;ll share the password.
              </p>

              <form onSubmit={submitPassword} aria-label="Unlock archived case studies" style={{ position: "relative" }}>
                <label htmlFor="archived-pw-input" className="sr-only">
                  Password
                </label>
                <input
                  id="archived-pw-input"
                  autoFocus
                  type="password"
                  name="password"
                  value={pwInput}
                  onChange={(e) => { setPwInput(e.target.value); setPwError(null); }}
                  placeholder="Enter password"
                  disabled={pwBusy}
                  autoComplete="off"
                  aria-invalid={pwError !== null}
                  aria-describedby={pwError ? "archived-pw-error" : undefined}
                  style={{
                    width: "100%", padding: "11px 14px",
                    fontSize: "var(--text-body-lg)",
                    fontFamily: "var(--font-body)", color: "var(--text)",
                    background: "var(--bg)",
                    border: `1.5px solid ${pwError ? "var(--accent-error)" : "var(--border)"}`,
                    borderRadius: "10px", outline: "none",
                    marginBottom: "10px",
                    boxSizing: "border-box",
                    transition: "border-color 0.18s",
                  }}
                />
                {pwError && (
                  <p id="archived-pw-error" role="alert" aria-live="polite" style={{
                    fontSize: "var(--text-caption)", color: "var(--accent-error)", marginBottom: "10px",
                    fontFamily: "var(--font-mono)", letterSpacing: "0.04em",
                  }}>
                    {pwError === "rate-limited"
                      ? `Too many attempts. Try again in ${retryInSec ?? 0}s.`
                      : pwError === "config"
                      ? "Server not configured. Contact me directly."
                      : "Incorrect password. Try again."}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={pwBusy}
                  style={{
                    width: "100%",
                    padding: "12px", fontSize: "var(--text-body-lg)", fontFamily: "var(--font-body)",
                    fontWeight: 500, letterSpacing: "-0.01em",
                    color: "var(--bg)", background: "var(--text)",
                    border: "none", borderRadius: "10px",
                    cursor: pwBusy ? "wait" : "pointer", opacity: pwBusy ? 0.65 : 1,
                    transition: "opacity 0.15s",
                    marginBottom: "10px",
                  }}
                >{pwBusy ? "Unlocking…" : "Unlock"}</button>
                <button
                  type="button"
                  onClick={() => setPwOpen(false)}
                  disabled={pwBusy}
                  style={{
                    width: "100%",
                    padding: "10px", fontSize: "var(--text-body)", fontFamily: "var(--font-body)",
                    color: "var(--muted)", background: "transparent",
                    border: "none", borderRadius: "10px",
                    cursor: "pointer",
                  }}
                >Cancel</button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
      )}
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
  // Work. newest first
  {
    type: "role", startYear: 2025.667, endYear: 2026.25,
    title: "Personal goal pursuit", subtitle: "Career break", minHeight: 72,
    dateLabel: "Sep 2025 - Apr 2026 · 8 mos",
    description: "Took time to focus on family, personal growth, and AI upskilling. Based in Hyderabad, Telangana, India.",
  },
  {
    type: "role", startYear: 2025.167, endYear: 2025.583,
    title: "Senior Product Designer", subtitle: "Planful Software", minHeight: 72,
    dateLabel: "Mar 2025 - Aug 2025", impact: "Fintech", logoDomain: "planful.com",
    link: "https://planful.com/",
    description: "Led end-to-end design of two finance planning features, reducing training time ~30% and supporting migration of core finance workflows from legacy tools to a modern web interface.",
    highlights: [
      "Designed two finance planning features end-to-end, reducing training time by ~30%",
    ],
  },
  {
    type: "role", startYear: 2024.167, endYear: 2025.083,
    title: "Senior UX Designer", subtitle: "Reputation.com", minHeight: 72,
    dateLabel: "Mar 2024 - Feb 2025", impact: "Enterprise SaaS", logoDomain: "reputation.com",
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
    dateLabel: "Apr 2022 - Nov 2023", impact: "Manufacturing startup", logoDomain: "zetwerk.com",
    link: "https://www.zetwerk.com/",
    images: ["/images/career/zetwerk-team.jpg"],
    description: "Led product design initiatives for Zetwerk's Order Management System (OMS), improving workflows to support business operations during a ~6× revenue growth phase.",
    highlights: [
      "Mentored three designers and partnered with leadership to establish UX practices: research, concept validation, usability testing",
      "Replaced guesswork with evidence-based design, improving product quality and reducing backlog ~20 to 30%",
    ],
  },
  {
    type: "role", startYear: 2020.583, endYear: 2022.25,
    title: "Manager UX Designer", subtitle: "FanCode / Dream Sports",
    dateLabel: "Aug 2020 - Apr 2022", impact: "B2C startup", logoDomain: "fancode.com",
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
    dateLabel: "Sep 2016 - Jul 2020", impact: "0→1 founder",
    description: "Founded and ran a boutique UX consultancy, designing 0→1 digital products across healthcare, HRIS, and fintech verticals for early-stage startups and SMEs.",
    highlights: [
      "Designed an award-winning suite of hospital applications, improving operational efficiency, patient management, and clinical decision-making",
      "Designed an HRIS and applicant tracking system that streamlined recruitment workflows and enhanced hiring team collaboration",
      "Designed a mobile ERP solution for MSMEs in India",
    ],
  },
  // Other. education & side roles
  {
    type: "education", startYear: 2023.833, endYear: 2026.25,
    title: "Super Mentor", subtitle: "ADPList", minHeight: 72,
    dateLabel: "Nov 2023 - Present", impact: "Top 1% · 3K+ mins",
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
    dateLabel: "Oct 2023 - Feb 2025", logoDomain: "accredian.com", minHeight: 72,
    description: "Executive Program in Data-Driven Product Management (Accredian, IIT Guwahati), focused on applying data, product strategy, and user-centric approaches across the product lifecycle. Covered customer research, analytics, product strategy, and experimentation, translating insights into product roadmaps, metrics, and iterative, data-informed decisions.",
  },
  {
    type: "education", startYear: 2020.917, endYear: 2021.333,
    title: "Program in UX Design", subtitle: "IIT Bombay",
    dateLabel: "Dec 2020 - May 2021", logoDomain: "iitb.ac.in", minHeight: 72,
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
  { quote: "Arun possesses a remarkable understanding of user needs, seamlessly navigating between design strategy and hands-on execution. His strategic mindset significantly impacted our efforts to enhance retention metrics.", name: "Raissa Fichardo", role: "Director of UX", company: "Fancode", initials: "RF", image: "/images/testimonial/raissa-fichardo.webp" },
  { quote: "I was always impressed by his ability to simplify complex problems and create user-friendly designs. He's a thoughtful, strategic designer who balances business goals with user needs.", name: "Jeff Orshalick", role: "UX Design Manager", company: "Reputation", initials: "JO", image: "/images/testimonial/jeff-orshalick.avif" },
  { quote: "Arun has an exceptional understanding of design and the knack to draw relevant insights to identify the right problems. His business acumen combined with a user-first approach makes him an ideal UX lead.", name: "Vikas Kotian", role: "VP Product Design", company: "Fancode", initials: "VK", image: "/images/testimonial/vikas-kotian.jpeg" },
  { quote: "Arun embodies the core principles of exceptional UX research and design. Our collaboration on numerous uncertain projects highlighted his invaluable contributions. Arun not only drove the research but also championed the significance of user research. He was integral throughout the process, actively shaping the product. A true advocate for the customer's voice, and a definite asset to any team.", name: "Nikhil Bhagya", role: "Product Manager", company: "Zetwerk", initials: "NB", image: "/images/testimonial/nikhil-bhagya.jpeg" },
  { quote: "During the short period we collaborated on the same project I noticed that Arun is very good at UX. As a developer I loved working on his vision. He was always very committed and focused. I was impressed by his UX and research skills.", name: "Bishal Biswas", role: "Engineer", company: "Atlassian", initials: "BB", image: "/images/testimonial/bishal-biswas.jpeg" },
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

  // Per-column overlap. Work column keeps a gentle 6 px overlap; the Other
  // (education) column stacks essentially flush to match the Figma's tighter
  // rhythm -see the layout-sync plan for details.
  const CARD_OVERLAP_WORK = 6;
  const CARD_OVERLAP_EDU  = 1;

  // Pre-compute stacked positions for work cards. slight negative gap
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
        computed[i].top = prevBottom - CARD_OVERLAP_WORK; // overlap adjacent cards
      } else if (gap < 0) {
        computed[i].top = prevBottom; // prevent full collision on distant cards
      }
    }
    return computed;
  })();

  // Pre-compute stacked positions for education cards. same overlap logic
  const stackedEduPositions = (() => {
    const computed = eduItems.map(item => {
      const endYr  = item.endYear ?? (item.startYear + 0.5);
      const height = Math.max((endYr - item.startYear) * YEAR_PX - 4, item.minHeight ?? 44);
      const rawTop = (CAL_END - item.startYear) * YEAR_PX + 4 + TOP_OFFSET - height;
      return { item, top: Math.max(rawTop, 0), height };
    });
    computed.sort((a, b) => a.top - b.top);
    // Always pack flush: the Other column is decoupled from the time axis and
    // mirrors the Figma's tight, uniform stack regardless of date gaps between
    // cards (e.g. between Product Management and Program in UX Design).
    for (let i = 1; i < computed.length; i++) {
      const prevBottom = computed[i - 1].top + computed[i - 1].height;
      computed[i].top = prevBottom - CARD_OVERLAP_EDU;
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
        onMouseEnter={() => setHoveredItem(item)}
        onMouseLeave={() => setHoveredItem(null)}
        onClick={() => isClickable && toggleCard(item)}
        style={{
          position: "absolute",
          top: `${top}px`,
          left: isExpanded ? "22px" : isEdu ? "calc(58% + 4px)" : "22px",
          right: isExpanded ? "16px" : isEdu ? "16px" : "calc(42% + 8px)",
          borderRadius: "16px",
          background: isExpanded ? "var(--bg)" : "var(--surface)",
          // Expanded state keeps a border because its bg matches the canvas;
          // collapsed cards use shadow-only depth like the Work cards.
          border: isExpanded ? "1px solid var(--border)" : "none",
          overflow: "hidden",
          cursor: isClickable ? "pointer" : "default",
          zIndex: isExpanded ? 10 : isHovered ? 5 : 1,
          boxShadow: isExpanded || isHovered
            ? "var(--card-shadow-hover)"
            : "var(--card-shadow)",
          transition: "box-shadow 0.35s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        {/* ── Compact header row. always visible ── */}
        <motion.div layout style={{
          display: "flex", alignItems: "center", gap: "8px",
          padding: isExpanded ? "8px 12px" : naturalH < 40 ? "4px 10px" : "8px 12px",
          minHeight: isExpanded ? undefined : `${naturalH}px`,
          overflow: "hidden",
          borderBottom: isExpanded ? "1px solid var(--border)" : "none",
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{
              fontFamily: "var(--font-body)", fontSize: "var(--text-body)", fontWeight: 500,
              color: "var(--text)", letterSpacing: "-0.02em", lineHeight: 1.25,
              overflow: "hidden", display: "-webkit-box",
              WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
            }}>
              {item.title}
            </p>
            {item.subtitle && (
              <p style={{
                fontFamily: "var(--font-body)", fontSize: "var(--text-body)",
                fontWeight: 400, letterSpacing: "-0.01em",
                color: "var(--muted)", lineHeight: 1.4, marginTop: "2px",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {item.subtitle}
              </p>
            )}
            {!isExpanded && !isEdu && (item.dateLabel || item.impact) && (
              <p style={{
                fontFamily: "var(--font-body)", fontSize: "var(--text-body)",
                fontWeight: 400, letterSpacing: "-0.01em",
                color: isHovered && item.impact ? "var(--text)" : "var(--muted)", marginTop: "2px",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                transition: "color 0.2s",
              }}>
                {isHovered && item.impact ? item.impact : item.dateLabel}
              </p>
            )}
          </div>


          {/* Close. only visible when expanded */}
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

                {/* Company / project link. top */}
                {item.link && (
                  <div style={{ marginBottom: "12px" }}>
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      style={{
                        display: "inline-flex", alignItems: "center", gap: "4px",
                        fontFamily: "var(--font-body)", fontSize: "var(--text-caption)",
                        fontWeight: 500, letterSpacing: "-0.01em",
                        color: "var(--muted)", textDecoration: "none",
                        transition: "color 0.15s",
                      }}
                      onMouseEnter={e => (e.currentTarget.style.color = "var(--text-hover)")}
                      onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}
                    >
                      Visit site <ArrowUpRight size={11} strokeWidth={1.5} />
                    </a>
                  </div>
                )}

                {/* Date label -role cards only */}
                {item.dateLabel && !isEdu && (
                  <p style={{
                    fontFamily: "var(--font-body)", fontSize: "var(--text-body)",
                    fontWeight: 400, letterSpacing: "-0.01em",
                    color: "var(--muted)", lineHeight: 1.4, marginBottom: "12px",
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
                    fontFamily: "var(--font-body)", fontSize: "var(--text-caption)", fontWeight: 400,
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
                      fontFamily: "var(--font-body)", fontSize: "var(--text-mono-lg)",
                      fontWeight: 500, letterSpacing: "-0.01em",
                      color: "var(--muted)", marginBottom: "8px",
                    }}>
                      {item.subtitle === "ADPList" ? "Achievements" : "Worked on"}
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {item.highlights.map((h, i) => (
                        <div key={i} style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                          <span style={{ color: "var(--muted)", fontFamily: "var(--font-body)", fontSize: "var(--text-caption)", lineHeight: 1.5, flexShrink: 0 }}>·</span>
                          <p style={{
                            fontFamily: "var(--font-body)", fontSize: "var(--text-caption)",
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
                          fontFamily: "var(--font-body)", fontSize: "var(--text-caption)",
                          fontWeight: 500, letterSpacing: "-0.01em",
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
                      fontFamily: "var(--font-body)", fontSize: "var(--text-mono-lg)",
                      fontWeight: 500, letterSpacing: "-0.01em",
                      color: "var(--muted)", marginBottom: "8px",
                    }}>
                      Learned
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {item.learnings.map((l, i) => (
                        <div key={i} style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                          <span style={{ color: "var(--muted)", fontFamily: "var(--font-body)", fontSize: "var(--text-caption)", lineHeight: 1.5, flexShrink: 0 }}>·</span>
                          <p style={{
                            fontFamily: "var(--font-body)", fontSize: "var(--text-caption)",
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
                      fontFamily: "var(--font-body)", fontSize: "var(--text-mono-lg)",
                      fontWeight: 500, letterSpacing: "-0.01em",
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
                            fontFamily: "var(--font-body)", fontSize: "var(--text-caption)",
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
                                  fontFamily: "var(--font-body)", fontSize: "var(--text-mono)",
                                  fontWeight: 500, letterSpacing: "-0.01em",
                                  color: "var(--muted)",
                                }}>{r.initials}</span>
                              </div>
                              <div>
                                <span style={{
                                  fontFamily: "var(--font-body)", fontSize: "var(--text-mono-lg)",
                                  fontWeight: 400, letterSpacing: "-0.01em",
                                  color: "var(--muted)", display: "block",
                                }}>{r.role}</span>
                                <span style={{
                                  fontFamily: "var(--font-body)", fontSize: "var(--text-mono-lg)",
                                  fontWeight: 500, letterSpacing: "-0.01em",
                                  color: "var(--text)", display: "block", marginTop: "1px",
                                }}>{r.company}</span>
                              </div>
                            </div>
                            <span style={{
                              fontFamily: "var(--font-body)", fontSize: "var(--text-mono-lg)",
                              fontWeight: 400, letterSpacing: "-0.01em",
                              color: "var(--muted)", flexShrink: 0,
                            }}>{r.date}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Prev / Next navigation. only for work cards */}
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
                      fontFamily: "var(--font-body)", fontSize: "var(--text-caption)", fontWeight: 500,
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
                      fontFamily: "var(--font-body)", fontSize: "var(--text-caption)", fontWeight: 500,
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

        {/* Column headers. single continuous bottom border spans the full panel
            width (year axis + Work + Other) so the line aligns with where the
            year text begins on the left. */}
        <div style={{ display: "flex", borderBottom: "1px solid var(--border)", paddingBottom: "10px" }}>
          <div style={{ width: "52px", flexShrink: 0 }} />
          <div style={{ flex: 1, display: "flex" }}>
            <div style={{ flex: 1, paddingLeft: "24px" }}>
              <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-body)", fontWeight: 400, lineHeight: 1.65, letterSpacing: "-0.01em", color: "var(--muted)" }}>Work</span>
            </div>
            <div style={{ width: "42%", paddingLeft: "8px" }}>
              <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-body)", fontWeight: 400, lineHeight: 1.65, letterSpacing: "-0.01em", color: "var(--muted)" }}>Other</span>
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
                  fontFamily: "var(--font-body)", fontSize: "var(--text-mono-lg)",
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

            {/* Horizontal grid lines. all years, uniform weight */}
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
                fontFamily: "var(--font-body)", fontSize: "var(--text-mono-lg)",
                fontWeight: 500, letterSpacing: "-0.01em",
                color: "var(--accent-warm)", opacity: 0.85,
              }}>Now</span>
            </div>

            {/* Rail connector dots. mark each card's start year on the vertical rail */}
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

            {/* Dismiss overlay. catches outside clicks when a card is expanded */}
            {selectedItem && (
              <div
                onClick={collapseCard}
                style={{ position: "absolute", inset: 0, zIndex: 9, cursor: "default" }}
              />
            )}

            {/* Work cards. stacked with slight overlap */}
            {stackedWorkPositions.map(({ item, top }, i) => renderCard(item, false, i, top))}

            {/* Education cards. stacked with slight overlap */}
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
            fontFamily: "var(--font-body)", fontSize: "var(--text-body)",
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

              {/* Quote body — matches About panel text styling */}
              <p style={{
                fontFamily: "var(--font-body)", fontSize: "var(--text-body-lg)", fontWeight: 400,
                lineHeight: 1.65, color: "var(--muted)", marginBottom: "28px",
                letterSpacing: "-0.01em",
              }}>
                {t.quote}
              </p>

              {/* Author. no border, spacing does the separation */}
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
                        // Soft hue-tinted gradient. color-mix blends with theme surface tones,
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
                        fontFamily: "var(--font-body)", fontSize: "var(--text-body)",
                        fontWeight: 600, letterSpacing: "-0.01em",
                        color: `color-mix(in srgb, ${tint} 65%, var(--text))`,
                      }}>
                        {t.initials}
                      </span>
                    </div>
                  );
                })()}
                <div>
                  <p style={{
                    fontFamily: "var(--font-body)", fontSize: "var(--text-body-lg)", fontWeight: 500,
                    letterSpacing: "-0.01em", color: "var(--text)", lineHeight: 1.35,
                  }}>
                    {t.name}
                  </p>
                  <p style={{
                    fontFamily: "var(--font-body)", fontSize: "var(--text-body)", fontWeight: 400,
                    letterSpacing: "-0.01em",
                    color: "var(--muted)", marginTop: "2px", lineHeight: 1.4,
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

        {/* Headline. typography per Figma reference:
            Inter 400 / 18px / line-height 30px / 0 tracking. */}
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.14 }}
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "20px",
            fontWeight: 500,
            letterSpacing: "-0.02em",
            lineHeight: 1.3,
            color: "var(--text-display)",
            marginBottom: "12px",
          }}
        >
          Let&apos;s talk.
        </motion.h2>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE, delay: 0.15 }}
          style={{
            fontFamily: "var(--font-body)", fontSize: "var(--text-body-lg)",
            lineHeight: 1.65, letterSpacing: "-0.01em",
            color: "var(--muted)", fontWeight: 400,
            marginBottom: "20px",
          }}
        >
          Open to senior IC and lead roles at teams building complex, human-centred products.
        </motion.p>

        {/* CTAs. always visible. marginBottom:24px gives mobile spacing
            before Skills marquee; on desktop the marquee's marginTop:auto
            still pushes it to the panel bottom so this gap is absorbed. */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE, delay: 0.16 }}
          style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "56px" }}
        >
          {/* Contact CTAs — matched to the case study detail page back-link
              pattern: same padding, height (44px), 8px radius, surface fill,
              and hover treatment (color lift + surface2 + card-shadow). */}
          <button
            onClick={copyEmail}
            aria-label={copied ? "Email copied" : "Copy email address"}
            style={{
              fontFamily: "var(--font-mono)", fontSize: "var(--text-mono)", fontWeight: 400,
              letterSpacing: "0.08em", textTransform: "uppercase",
              color: copied ? "var(--accent-success)" : "var(--muted)",
              padding: "8px 12px", minHeight: "var(--space-8)", borderRadius: "8px",
              border: "1px solid var(--border)", background: "var(--surface)",
              cursor: "pointer",
              display: "inline-flex", alignItems: "center", gap: "6px",
              transition: "color 0.18s, border-color 0.18s, background 0.18s, box-shadow 0.18s",
            }}
            onMouseEnter={e => { if (!copied) { e.currentTarget.style.color = "var(--text)"; e.currentTarget.style.background = "var(--surface2)"; e.currentTarget.style.boxShadow = "var(--card-shadow)"; } }}
            onMouseLeave={e => { if (!copied) { e.currentTarget.style.color = "var(--muted)"; e.currentTarget.style.background = "var(--surface)"; e.currentTarget.style.boxShadow = "none"; } }}
          >
            {copied ? "Copied ✓" : "Copy email"}
          </button>

          <Link
            href="https://www.linkedin.com/in/akgaddam/"
            target="_blank" rel="noopener noreferrer"
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
            LinkedIn
            <ArrowUpRight size={11} strokeWidth={1.5} />
          </Link>

          <Link
            href="https://drive.google.com/file/d/1VWajNl_cigKjLwMNevZIJXUm1bY3hoOs/view?usp=sharing"
            target="_blank" rel="noopener noreferrer"
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
            CV
            <ArrowUpRight size={11} strokeWidth={1.5} />
          </Link>
        </motion.div>

        {/* Skills & Tools. matches the about-panel treatment (mono label
            + dashed line + marquee of pills). marginTop: auto pushes it
            and the location card to the bottom of the panel. */}
        {(() => {
          const skills = [
            "AI UX Design",
            "Systems Thinking", "Product Thinking",
            "Product Strategy", "Claude Code", "Agentic AI", "Service Design",
            "Cross functional Leadership", "UX Strategy", "UX Research",
            "Research Synthesis", "Stakeholder Alignment", "Design Systems",
            "Information Architecture", "Interaction Design", "Prototyping",
            "Usability Testing", "Contextual Inquiry", "Service Blueprints",
            "Jobs-to-be-Done", "Figma", "Framer", "Next.js",
          ];
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
                  fontFamily: "var(--font-mono)", fontSize: "var(--text-eyebrow)",
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  color: "var(--muted)", whiteSpace: "nowrap", fontWeight: 400,
                }}>
                  Skills &amp; Tools
                </p>
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
                  {skills.map((skill, i) => (
                    <span key={`a-${skill}-${i}`} style={{ display: "inline-flex", alignItems: "center" }}>
                      <span style={{
                        fontFamily: "var(--font-body)", fontSize: "var(--text-caption)", fontWeight: 400,
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
                  <span className="marquee-clone" aria-hidden style={{ display: "inline-flex", alignItems: "center" }}>
                    {skills.map((skill, i) => (
                      <span key={`b-${skill}-${i}`} style={{ display: "inline-flex", alignItems: "center" }}>
                        <span style={{
                          fontFamily: "var(--font-body)", fontSize: "var(--text-caption)", fontWeight: 400,
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
                  </span>
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
          {/* Map area. MapLibre GL */}
          <div style={{ position: "relative", overflow: "hidden" }}>
            <MapLibreMap height={190} />
          </div>
          <div style={{ padding: "8px 12px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--muted)", flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
              <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-caption)", fontWeight: 400, letterSpacing: "-0.01em", color: "var(--text)" }}>Hyderabad, India</span>
            </div>
            <ISTClock style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-mono)", letterSpacing: "0.05em", color: "var(--muted)", textTransform: "uppercase" }} />
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
            fontFamily: "var(--font-body)", fontSize: "var(--text-mono-lg)",
            fontWeight: 400, letterSpacing: "-0.01em",
            color: "var(--muted)", lineHeight: 1.3,
            marginBottom: "4px",
          }}>
            © 2026 · Arun Gaddam{" "}
            <span style={{
              color: "var(--accent-gold)",
              textShadow: "0 0 6px rgba(234, 179, 8, 0.7)",
              fontWeight: 700,
            }}>ツ</span>
          </p>
          <p style={{
            fontFamily: "var(--font-body)", fontSize: "var(--text-mono-lg)",
            fontWeight: 400, letterSpacing: "-0.01em",
            color: "var(--muted)", lineHeight: 1.3,
          }}>
            <span style={{ opacity: 0.6 }}>Designed with </span>
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="#D97757"
              aria-hidden
              style={{ display: "inline-block", verticalAlign: "-1px", margin: "0 2px" }}
            >
              <path d="M12 2c.5 6 2 7.5 10 10-8 2.5-9.5 4-10 10-.5-6-2-7.5-10-10 8-2.5 9.5-4 10-10z" />
            </svg>
            <span style={{ opacity: 0.6 }}>Claude Code</span>
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

          {/* Featured: AI Contract Review. live React prototype built with Claude */}
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
                  <div style={{ position: "relative", height: "200px", overflow: "hidden", borderRadius: "16px 16px 0 0" }}>
                    {WORK_THUMBS[astra.slug] ? (
                      <WorkCardThumb
                        src={WORK_THUMBS[astra.slug]}
                        poster={WORK_POSTERS[astra.slug]}
                        height={200}
                        borderRadius="16px 16px 0 0"
                      />
                    ) : (
                      <MeshThumbnail index={0} type={astra.type} confidential={astra.confidential} />
                    )}
                  </div>
                  <div style={{ padding: "12px 16px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap", marginBottom: "8px" }}>
                      <WorkChip label="Live Prototype" />
                      {astra.tags.slice(0, 2).map(tag => (
                        <WorkChip key={tag} label={tag} />
                      ))}
                    </div>
                    <h3 style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-title-sm)", fontWeight: 500, lineHeight: "22px", letterSpacing: 0, color: "var(--text)", marginBottom: "4px" }}>
                      {astra.title}
                    </h3>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-body)", fontWeight: 300, lineHeight: 1.5, letterSpacing: 0, color: "var(--muted)" }}>
                      {astra.subtitle}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Portfolio Design Language — meta artifact card. */}
          <SystemFeatureCard />

        </div>
      </div>
    </div>
  );
}

const PANEL_SHADOW_LIGHT = "0 1px 2px rgba(0,0,0,0.04), 0 6px 24px rgba(0,0,0,0.06)";
const PANEL_SHADOW_ACTIVE_LIGHT = "0 2px 4px rgba(0,0,0,0.06), 0 12px 40px rgba(0,0,0,0.10)";
/* Dark panels sit on #050507 canvas. drop shadows are invisible on near-black.
   A white hairline ring defines the panel edge; the surface step (#1c1c1e panel
   vs #050507 canvas) provides the perceived lift. */
const PANEL_SHADOW_DARK  = "0 1px 2px rgba(0,0,0,0.40), 0 6px 24px rgba(0,0,0,0.35)";
const PANEL_SHADOW_ACTIVE_DARK = "0 2px 4px rgba(0,0,0,0.50), 0 12px 40px rgba(0,0,0,0.45)";

/* ── Story View. Stripped-down single-column resume page. ──
   Bio · 3 stats · work list · tenure line · contact.
   Replaces the entire <main> in Story mode -no panels, no chrome,
   no animations beyond the standard load fade. Uses theme tokens
   so it adapts to dark/light. */
const STORY_WORK: { title: string; slug: string | null }[] = [
  { title: "Planful · Senior Product Designer · 2025", slug: "planful-esm-tables" },
  { title: "Reputation.com · Senior UX Designer · 2024–2025", slug: "apple-business-listings" },
  { title: "Zetwerk · Senior Product Designer · 2022–2023", slug: null },
  { title: "FanCode · Manager UX Designer · 2020–2022", slug: "fancode-homepage" },
  { title: "Astra · Solo build · 2025", slug: "astra" },
];

/* Two testimonials, picked for the "simplify complexity" thesis -one
   from a Reputation manager, one from a FanCode VP. Two different
   companies, two seniority levels. Source array is `testimonials`
   (defined further down in this file); kept inline here so Story's
   content stays scannable. */
const STORY_TESTIMONIALS: { quote: string; name: string; role: string; company: string }[] = [
  {
    quote: "I was always impressed by his ability to simplify complex problems and create user-friendly designs. He's a thoughtful, strategic designer who balances business goals with user needs.",
    name: "Jeff Orshalick",
    role: "UX Design Manager",
    company: "Reputation",
  },
  {
    quote: "Arun has an exceptional understanding of design and the knack to draw relevant insights to identify the right problems. His business acumen combined with a user-first approach makes him an ideal UX lead.",
    name: "Vikas Kotian",
    role: "VP Product Design",
    company: "FanCode",
  },
];

function StoryView() {
  /* Inline styles only -Story is small enough that a separate stylesheet
     would be over-engineering. Every value uses tokens so the page
     respects the theme toggle. */
  const divider: React.CSSProperties = {
    border: "none",
    borderTop: "1px solid var(--border)",
    margin: "48px 0",
  };
  const sectionLabel: React.CSSProperties = {
    fontFamily: "var(--font-logo)",
    fontSize: "var(--text-mono-lg)",
    fontWeight: 500,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "var(--muted)",
    margin: "0 0 24px",
  };
  const workLink: React.CSSProperties = {
    fontFamily: "var(--font-body)",
    fontSize: "var(--text-title-sm)",
    fontWeight: 500,
    color: "var(--text)",
    textDecoration: "none",
    lineHeight: 1.4,
    display: "inline-block",
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- kept for revival; StoryView's contact section uses pill buttons instead
  const inlineLink: React.CSSProperties = {
    color: "var(--text)",
    textDecoration: "underline",
    textUnderlineOffset: "3px",
    textDecorationColor: "var(--border)",
  };

  return (
    <main
      id="main-content"
      data-view-mode="story"
      style={{
        paddingTop: "72px",
        minHeight: "100dvh",
        background: "var(--bg)",
        color: "var(--text)",
      }}
    >
      <article
        style={{
          maxWidth: "720px",
          margin: "0 auto",
          padding: "64px 24px 96px",
          fontFamily: "var(--font-body)",
        }}
      >
        {/* Headshot -small, sits above the bio paragraph. */}
        <img
          src="/arun-gaddam.png"
          alt="Arun Gaddam"
          width={64}
          height={64}
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            objectFit: "cover",
            display: "block",
            marginBottom: "32px",
          }}
        />

        {/* Heading + bio -mirrors the workspace About panel (page.tsx:541).
            Same copy, same 24px/14px hierarchy, same InlineChip treatment. */}
        <h1
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "24px",
            fontWeight: 400,
            lineHeight: 1.6,
            letterSpacing: "-0.03em",
            color: "var(--text)",
            margin: 0,
          }}
        >
          Helping businesses design products by aligning user needs, business strategy, and the messy reality in between.
        </h1>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-body-lg)",
            lineHeight: 1.65,
            letterSpacing: "-0.01em",
            color: "var(--muted)",
            margin: "20px 0 0",
          }}
        >
          I&apos;m hands on throughout the entire process, from strategy to execution. These days, I lean on AI to move faster and test ideas.
        </p>

        <hr style={divider} />

        {/* Stats -loud. Display-size mono numerals carry the page proof.
            3-col on desktop, stacks on mobile via grid-auto. */}
        <dl
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            columnGap: "32px",
            rowGap: "32px",
            margin: 0,
          }}
        >
          {[
            { num: "8+", label: "years senior product and UX design" },
            { num: "30%", label: "drop in analyst training time after the Planful redesign" },
            { num: "Apr 26", label: "next available" },
          ].map((s) => (
            <div key={s.num}>
              <dt
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-title-sm)",
                  fontWeight: 500,
                  color: "var(--text)",
                  lineHeight: 1.3,
                  marginBottom: "4px",
                }}
              >
                {s.num}
              </dt>
              <dd
                style={{
                  fontSize: "var(--text-body)",
                  lineHeight: 1.5,
                  color: "var(--muted)",
                  margin: 0,
                  maxWidth: "22ch",
                }}
              >
                {s.label}
              </dd>
            </div>
          ))}
        </dl>

        <hr style={divider} />

        {/* Work list -titles only, no descriptions. Clicking opens the
            case study page (where the full story lives). */}
        <h2 style={sectionLabel}>Recent work</h2>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {STORY_WORK.map((w, i) => (
            <li
              key={w.title}
              style={{
                marginBottom: i === STORY_WORK.length - 1 ? 0 : "16px",
              }}
            >
              {w.slug ? (
                <Link
                  href={`/work/${w.slug}`}
                  style={workLink}
                  onMouseEnter={(e) => { e.currentTarget.style.textDecoration = "underline"; e.currentTarget.style.textUnderlineOffset = "3px"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.textDecoration = "none"; }}
                >
                  {w.title}
                </Link>
              ) : (
                <span style={workLink}>{w.title}</span>
              )}
            </li>
          ))}
        </ul>

        {/* Tenure line */}
        <p
          style={{
            fontSize: "var(--text-lead)",
            color: "var(--muted)",
            lineHeight: 1.6,
            margin: "32px 0 0",
            fontStyle: "italic",
          }}
        >
          The two short stints at Reputation and Planful book-end a planned
          break. Four steady years at Zetwerk and FanCode before that.
        </p>

        <hr style={divider} />

        {/* Testimonials -two quotes, blockquote-styled. No avatars; the
            quote and attribution carry the weight. */}
        <h2 style={sectionLabel}>What people say</h2>
        <div>
          {STORY_TESTIMONIALS.map((t, i) => (
            <blockquote
              key={t.name}
              style={{
                margin: 0,
                paddingLeft: "20px",
                borderLeft: "2px solid var(--border)",
                marginBottom: i === STORY_TESTIMONIALS.length - 1 ? 0 : "28px",
              }}
            >
              <p
                style={{
                  fontSize: "var(--text-title-sm)",
                  lineHeight: 1.6,
                  color: "var(--text)",
                  margin: 0,
                }}
              >
                &ldquo;{t.quote}&rdquo;
              </p>
              <footer
                style={{
                  fontSize: "var(--text-body)",
                  color: "var(--muted)",
                  marginTop: "10px",
                  fontFamily: "var(--font-body)",
                }}
              >
                {t.name}, {t.role} at {t.company}
              </footer>
            </blockquote>
          ))}
        </div>

        <hr style={divider} />

        {/* Contact -three identical pill links matching the workspace About
            panel's CTA pattern (page.tsx:587-630). Same chip style across
            all CTAs so nothing pops harder than anything else. */}
        <h2 style={sectionLabel}>Get in touch</h2>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          {[
            { label: "Email", href: "mailto:akgaddam02@gmail.com?subject=Senior%20IC%20role" },
            { label: "LinkedIn", href: "https://www.linkedin.com/in/akgaddam/" },
            { label: "CV", href: "/cv.pdf" },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") || href.endsWith(".pdf") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              style={{
                fontFamily: "var(--font-mono)", fontSize: "var(--text-mono)", fontWeight: 400,
                letterSpacing: "0.08em", textTransform: "uppercase",
                color: "var(--muted)",
                padding: "8px 12px", minHeight: "var(--space-8)", borderRadius: "8px",
                border: "1px solid var(--border)", background: "var(--surface)",
                textDecoration: "none",
                display: "inline-flex", alignItems: "center", gap: "6px",
                transition: "color 0.18s, border-color 0.18s, background 0.18s, box-shadow 0.18s",
              }}
              onMouseEnter={e => { e.currentTarget.style.color = "var(--text)"; e.currentTarget.style.background = "var(--surface2)"; e.currentTarget.style.boxShadow = "var(--card-shadow)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "var(--muted)"; e.currentTarget.style.background = "var(--surface)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              {label}
              <ArrowUpRight size={10} strokeWidth={1.5} />
            </a>
          ))}
        </div>
      </article>
    </main>
  );
}

const PANEL_CONFIGS = [
  { label: "About",          width: "420px", minWidth: "380px", Component: AboutPanel },
  { label: "Work",           width: "440px", minWidth: "380px", Component: WorkPanel },
  { label: "Career",         width: "420px", minWidth: "380px", Component: CareerPanel },
  { label: "Testimonials",   width: "400px", minWidth: "360px", Component: TestimonialsPanel },
  { label: "Contact",        width: "380px", minWidth: "340px", Component: ContactPanel },
];

/* Derive PANEL_LABELS from the single source above. Adding/removing a panel
   here automatically updates the nav, dot indicator, and floating menu. */
const PANEL_LABELS = PANEL_CONFIGS.map(p => p.label);

/* ── Home ── */
export default function Home() {
  const containerRef  = useRef<HTMLDivElement>(null);
  const [activePanel, setActivePanel] = useState(0);
  const [loading, setLoading]         = useState(true);
  const [revealed, setRevealed]       = useState(false);
  const [isDark, setIsDark]           = useState(false);
  /* viewMode persists across sessions. Default "workspace" so SSR matches
     first paint; saved value hydrates on mount. */
  const [viewMode, setViewMode] = useState<"workspace" | "story">("workspace");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("portfolio-view-mode");
      if (saved === "workspace" || saved === "story") setViewMode(saved);
    } catch { /* localStorage unavailable -keep default */ }
  }, []);

  useEffect(() => {
    try { localStorage.setItem("portfolio-view-mode", viewMode); } catch {}
  }, [viewMode]);

  /* Focus dim. Every panel fades to 0.6 unless it's the active one
     (scrolled to) or being hovered. dimReady waits until the load reveal
     animation finishes so we don't fight framer-motion's opacity stagger. */
  const [dimReady, setDimReady] = useState(false);
  useEffect(() => {
    if (!revealed) return;
    const t = setTimeout(() => setDimReady(true), 1500);
    return () => clearTimeout(t);
  }, [revealed]);

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.dataset.theme === "dark");
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    // Shimmer skeleton exits once fonts are ready, capped at 900ms so a
    // stalled font fetch can't trap the user behind the skeleton.
    const SAFETY_CAP = 900;
    const MIN_TIME   = 350; // brief minimum so it doesn't flash off instantly

    let resolved = false;
    const finish = () => {
      if (resolved) return;
      resolved = true;
      setLoading(false);
      requestAnimationFrame(() => setRevealed(true));
    };

    const fontsReady = document.fonts?.ready ?? Promise.resolve();
    const minTime    = new Promise<void>(r => setTimeout(r, MIN_TIME));
    const cap        = setTimeout(finish, SAFETY_CAP);

    Promise.all([fontsReady, minTime]).then(finish);
    return () => clearTimeout(cap);
  }, []);

  const scrollByPanel = useCallback((dir: 1 | -1) => {
    const el = containerRef.current;
    if (!el) return;
    const panels = el.querySelectorAll<HTMLElement>(".panel");
    const current = panels[activePanel];
    if (!current) return;
    el.scrollBy({ left: dir * (current.offsetWidth + 16), behavior: "smooth" });
  }, [activePanel]);

  /* Scroll directly to a panel by index -used by the mobile FAB menu.
     On desktop scrolls horizontally inside the panels container; on mobile
     uses scrollIntoView since panels are vertically stacked. */
  const scrollToPanel = useCallback((i: number) => {
    const el = containerRef.current;
    if (!el) return;
    const panels = el.querySelectorAll<HTMLElement>(".panel");
    const target = panels[i];
    if (!target) return;
    const isMobile = window.matchMedia("(max-width: 640px)").matches;
    if (isMobile) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      el.scrollTo({ left: target.offsetLeft - 24, behavior: "smooth" });
    }
  }, []);

  /* Mobile-only IntersectionObserver -tracks which panel is most in-view
     and updates activePanel. Desktop Workspace uses its own horizontal
     scroll handler below. Story mode renders no panels, so this is a no-op there. */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const mq = window.matchMedia("(max-width: 640px)");
    let observer: IntersectionObserver | null = null;

    const setup = () => {
      observer?.disconnect();
      observer = null;
      if (!mq.matches) return;
      const panels = Array.from(el.querySelectorAll<HTMLElement>(".panel"));
      if (!panels.length) return;
      observer = new IntersectionObserver(
        (entries) => {
          let bestIdx = -1;
          let bestRatio = 0;
          entries.forEach((entry) => {
            const idx = panels.indexOf(entry.target as HTMLElement);
            if (idx >= 0 && entry.intersectionRatio > bestRatio) {
              bestRatio = entry.intersectionRatio;
              bestIdx = idx;
            }
          });
          if (bestIdx >= 0 && bestRatio > 0.3) setActivePanel(bestIdx);
        },
        { threshold: [0.3, 0.5, 0.7] }
      );
      panels.forEach((p) => observer!.observe(p));
    };

    setup();
    mq.addEventListener("change", setup);
    return () => {
      observer?.disconnect();
      mq.removeEventListener("change", setup);
    };
  }, []);

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
      <HomeNav
        onPrev={() => scrollByPanel(-1)}
        onNext={() => scrollByPanel(1)}
        activePanel={activePanel}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />
      {/* Story view temporarily hidden -toggle is removed from nav, so we
          force Workspace regardless of any persisted viewMode value. */}
      {false ? (
        <StoryView />
      ) : (
      <>
      {/* Mobile-only floating panel menu -hidden ≥641px via CSS */}
      <FloatingPanelMenu activePanel={activePanel} onSelect={scrollToPanel} />

      {/* Right-edge fade. hides on last panel */}
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

      <main id="main-content" className="home-main" style={{ paddingTop: "72px", height: "100dvh", overflow: "hidden", background: "var(--chrome)" }}>
        <div
          ref={containerRef}
          className="panels-container"
          data-dim-ready={dimReady ? "true" : "false"}
          style={{
            display: "flex",
            height: "calc(100dvh - 72px)",
            overflowX: "auto",
            overflowY: "hidden",
            gap: "16px",
            /* Inter-panel gap (16px) — a touch of breathing room
               without separating the panels too far. Top padding
               kept at 8px. */
            padding: "8px 0 16px 24px",
            boxSizing: "border-box",
            /* Scroll-snap removed -the `proximity` mode was tugging the
               scroll mid-gesture and made horizontal scrolling feel
               jerky. Free scrolling now; nav arrows + keyboard still
               jump cleanly via behavior: "smooth". */
            scrollPaddingLeft: "24px",
            /* Stop browser back-swipe from stealing horizontal scroll. */
            overscrollBehaviorX: "contain",
            scrollBehavior: "smooth",
          }}
        >
          {PANEL_CONFIGS.map(({ width, minWidth, Component }, i) => {
            const isActive = activePanel === i;
            const shadow = isDark
              ? (isActive ? PANEL_SHADOW_ACTIVE_DARK  : PANEL_SHADOW_DARK)
              : (isActive ? PANEL_SHADOW_ACTIVE_LIGHT : PANEL_SHADOW_LIGHT);
            const panelClass = `panel${isActive ? " is-active" : ""}`;
            return (
              <motion.div
                key={i}
                className={panelClass}
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
                  borderRadius: "16px",
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

        /* ── Focus dim (desktop only). Every panel fades to 0.6 unless
           it's the active panel (scrolled to) or being hovered. Both
           cursor and scroll position wake a panel. Gated behind
           [data-dim-ready="true"] so the load-time reveal animation
           runs uninhibited. Mobile keeps full contrast (panels are
           stacked vertically anyway).

           Light theme override: opacity-fade reads as washed-out and
           "disabled" on white. In light mode every panel stays at 100%
           opacity; hierarchy is carried by the shadow system instead
           (PANEL_SHADOW_LIGHT vs PANEL_SHADOW_ACTIVE_LIGHT — already
           defined, ~2x ambient depth difference). Dark mode keeps the
           60% fade because near-black surfaces read as receding depth
           when faded, not as dulled content. */
        @media (min-width: 641px) {
          .panels-container[data-dim-ready="true"] .panel {
            transition:
              opacity 0.45s cubic-bezier(0.22,1,0.36,1),
              box-shadow 0.35s cubic-bezier(0.22,1,0.36,1) !important;
          }
          .panels-container[data-dim-ready="true"] .panel:not(.is-active):not(:hover) {
            opacity: 0.6 !important;
          }
          /* Light theme: no opacity fade on inactive panels */
          [data-theme="light"] .panels-container[data-dim-ready="true"] .panel:not(.is-active):not(:hover) {
            opacity: 1 !important;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .panels-container[data-dim-ready="true"] .panel {
            transition: none !important;
          }
        }

        @keyframes today-pulse {
          0%   { box-shadow: 0 0 0 0px color-mix(in srgb, var(--accent-warm) 40%, transparent); }
          60%  { box-shadow: 0 0 0 5px color-mix(in srgb, var(--accent-warm)  0%, transparent); }
          100% { box-shadow: 0 0 0 0px color-mix(in srgb, var(--accent-warm)  0%, transparent); }
        }
        .today-dot {
          animation: today-pulse 3.5s ease-out infinite;
        }

        /* Floating panel menu -desktop hidden, mobile shown */
        .floating-panel-menu, .floating-panel-menu-backdrop { display: none; }
        @media (max-width: 640px) {
          .floating-panel-menu, .floating-panel-menu-backdrop { display: block; }
        }

        @media (max-width: 640px) {
          /* Align nav pill left edge with panel card left edge (both 12px) */
          .home-nav { padding: 0 12px !important; }
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
      )}
    </>
  );
}
