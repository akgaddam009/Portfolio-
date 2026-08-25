"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import React, { useRef, useCallback, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import ThemeToggle from "@/components/ThemeToggle";
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- kept for revival; PortfolioChat is hidden from the nav for now
import dynamic from "next/dynamic";
const PortfolioChat = dynamic(() => import("@/components/PortfolioChat"), { ssr: false });
const MapLibreMap = dynamic(() => import("@/components/ui/MapLibreMap").then(m => ({ default: m.MapLibreMap })), { ssr: false });
import { caseStudies } from "@/lib/caseStudies";
import { brandIcons } from "@/lib/brandIcons";
import { DitheredImage } from "@/components/DitheredImage";
import ISTClock from "@/components/ISTClock";
import { ArrowUpRight, Compass, Search, Sparkles, LayoutGrid, Menu, X, Users, Briefcase, Path, TreeStructure, Mail, FileText, LinkedIn, ChartActivity } from "@/components/ui/Icon";
import { InlineChip, type ChipTone } from "@/components/ui/InlineChip";
import LoadingScreen from "@/components/LoadingScreen";
import { installClickSound } from "@/lib/clickSound";
import { trackEmailClick, trackLinkedInClick, trackResumeDownload } from "@/lib/analytics";

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
        borderRadius: "var(--radius-lg)",
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
            borderRadius: "var(--radius-lg)",
            border: "none",
            background: "var(--surface)",
            boxShadow: "var(--chrome-shadow)",
            display: "inline-flex",
            alignItems: "center",
            textDecoration: "none",
            userSelect: "none",
            transition: "box-shadow 200ms var(--ease-out-quart), color 200ms var(--ease-out-quart), background 200ms var(--ease-out-quart)",
          }}
          /* Shadow alone is a weak hover for a white pill on a light canvas,
             so the label lifts to --text-hover as a second, non-spatial
             signal. */
          onMouseEnter={e => { e.currentTarget.style.boxShadow = "var(--chrome-shadow-hover)"; e.currentTarget.style.color = "var(--text-hover)"; e.currentTarget.style.background = "var(--chrome-hover)"; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = "var(--chrome-shadow)"; e.currentTarget.style.color = "var(--text)"; e.currentTarget.style.background = "var(--surface)"; }}
          /* Already on "/", a Link to "/" is a no-op: the router sees the same
             route and does nothing, so the wordmark felt dead on the homepage.
             Reload instead, which replays the load reveal.

             Only when we are actually on "/". From a case-study page the Link
             still does a client-side navigation, which is the faster path and
             the reason to keep this a Link rather than a plain <a href="/">.

             Modified clicks are left alone so cmd/ctrl-click still opens a new
             tab and middle-click still works. */
          onClick={e => {
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
            if (window.location.pathname === "/") {
              e.preventDefault();
              haptic(8);
              window.location.reload();
            }
          }}
        >
          Arun Gaddam
        </Link>
        <ThemeToggle />
        {/* Quick guide + view-mode toggle hidden -focus is on Workspace
            polish for now. Underlying components stay in code so they can
            be restored later. */}
      </div>

      {/* Panel dots + arrows -hidden in Story mode (no panels to navigate).
          <nav> rather than <div>: these prev/next controls are how the site is
          navigated, and the served homepage previously exposed no navigation
          landmark at all. */}
      <nav
        aria-label="Panel navigation"
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
                  borderRadius: "var(--radius-lg)",
                  border: "none",
                  background: "var(--surface)",
                  boxShadow: "var(--chrome-shadow)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "box-shadow 0.25s cubic-bezier(0.22,1,0.36,1), opacity 0.2s",
                  opacity: disabled ? 0.3 : 1,
                  cursor: disabled ? "default" : "pointer",
                }}
                onMouseEnter={e => { if (!disabled) { e.currentTarget.style.boxShadow = "var(--chrome-shadow-hover)"; e.currentTarget.style.background = "var(--chrome-hover)"; } }}
                onMouseLeave={e => { if (!disabled) { e.currentTarget.style.boxShadow = "var(--chrome-shadow)"; e.currentTarget.style.background = "var(--surface)"; } }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d={d} />
                </svg>
              </motion.button>
            );
          })}
        </div>
      </nav>
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
      /* 16px, up a third from 12px. Horizontal stays on the 24px panel gutter. */
      padding: "16px 24px",
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
      {/* Dithered treatment. The grayscale->colour reveal stays on the wrapper
          rather than the image, so it applies to the shader canvas and the
          plain-<img> fallback identically -- CSS filters apply to a <canvas>
          the same way they apply to an <img>. Grid softened twice on request:
          3 -> 1.5 -> 0.75. */}
      <DitheredImage
        src={src}
        alt={alt}
        radius="16px"
        size={0.75}
        colorSteps={6}
        style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%",
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
        <PixelRevealPortrait src="/arun-gaddam.webp" alt="Arun Gaddam" />
      </div>
    </div>
  );
}

/* InlineChip + ChipTone moved to components/ui/InlineChip.tsx so the case
   study detail hero can reuse the same chip system. */


/* Tool label -> brand mark. Only the tools whose marks exist in simple-icons
   appear here; "ChatGPT (Custom GPTs)" and "Pendo" have no entry and fall back
   to text-only, which the chip already handles. Keyed on the exact chip label
   so the skill data stays plain strings. */
const TOOL_ICON: Record<string, string> = {
  "Claude": "claude",
  "Gemini": "gemini",
  "Perplexity": "perplexity",
  "Figma": "figma",
  "Cursor": "cursor",
  "Dovetail": "dovetail",
  "Mixpanel": "mixpanel",
  "Looker": "looker",
  "Notion": "notion",
  "Jira": "jira",
  "Miro": "miro",
  "Pendo": "pendo",
};

/* Inline brand mark. fill="currentColor" so it takes the chip's text colour and
   flips with the theme; aria-hidden because the chip label already names the
   tool, so announcing it twice adds nothing. */
function BrandGlyph({ name }: { name: string }) {
  const icon = brandIcons[name];
  if (!icon) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      width="12"
      height="12"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      style={{ flexShrink: 0, opacity: 0.85 }}
    >
      <path d={icon.path} />
    </svg>
  );
}

/* Single source for the About panel's skill groups. The Contact panel's
   "Skills & Tools" marquee derives from this too -- it used to keep its own
   23-item list, which had already drifted from this one. One array, no drift. */
const SKILL_GROUPS: {
  label: string;
  variant: "prose" | "chips";
  tone?: "violet" | "indigo";
  items: string[];
}[] = [
          {
            label: "Skills",
            variant: "prose" as const,
            items: [
              "Product Thinking",
              "Product Discovery & Strategy",
              "User Research & Validation",
              "Enterprise SaaS & Workflow Design",
              "User Journey Mapping",
              "Service Design",
              "UX Design",
              "Interaction Design",
              "Prototyping",
              "Usability Testing",
              "Usability & Accessibility",
              "Design Systems",
              "Design Ops",
              "Designing for AI",
              "AI-Assisted Design",
              "Metrics & Outcome Measurement",
              "Workshop Facilitation",
              "Cross-functional Leadership",
            ],
          },
          {
            /* Tools and Data Tools merged into one group. The split read as two
               eyebrow headers over two rows of visually identical chips, a
               distinction that carried no meaning for the reader -- they are all
               tools. Design and AI tools first, then research and analytics, so
               the internal order still groups by kind without a second header.
               The Contact panel's marquee flattens this array, so it picks the
               merge up with no change of its own. */
            label: "Tools",
            variant: "chips" as const,
            items: [
              "Claude", "Figma", "Gemini", "Perplexity", "Cursor",
              "Dovetail", "Mixpanel", "Pendo", "Looker",
              "Notion", "Jira", "Miro",
            ],
          }
];

function AboutPanel() {
  const [copied, setCopied] = useState(false);
  const copyEmail = () => {
    navigator.clipboard.writeText("akgaddam02@gmail.com");
    trackEmailClick();
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


        {/* Hero headline. typography per Figma reference:
            Manrope 400 / 18px / line-height 30px / 0 tracking. */}
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.05 }}
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "20px",
            fontWeight: 500,
            lineHeight: 1.5,
            letterSpacing: "-0.02em",
            color: "var(--about-h1)",
            marginBottom: "20px",
          }}
        >
          I&apos;m a Product Designer with experience designing enterprise SaaS, B2B, and B2C products across industries.</motion.h1>

        {/* Bio. typography per Figma reference:
            Manrope 400 / 14px / line-height 26px / 0 tracking. */}
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
          I&apos;m hands on throughout the entire process, from strategy to execution.
          I&apos;ve been learning how LLMs work, and I&apos;m excited about designing
          AI product experiences.
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
            className={`btn-cta${copied ? " is-copied" : ""}`}
            style={{
              fontFamily: "var(--font-mono)", fontSize: "var(--text-mono)", fontWeight: 400,
              letterSpacing: "0.08em", textTransform: "uppercase",
              padding: "5px 10px", minHeight: "32px", borderRadius: "var(--radius-lg)",
              display: "inline-flex", alignItems: "center", gap: "6px",
              cursor: "pointer",
            }}
          >
            {!copied && <Mail size={11} strokeWidth={1.5} />}
            {copied ? "Copied ✓" : "Copy email"}
          </button>

          {[
            { label: "LinkedIn", href: "https://www.linkedin.com/in/akgaddam/", external: true, onTrack: trackLinkedInClick, Icon: LinkedIn },
            { label: "CV", href: "https://drive.google.com/file/d/1VWajNl_cigKjLwMNevZIJXUm1bY3hoOs/view?usp=sharing", external: true, onTrack: trackResumeDownload, Icon: FileText },
          ].map(({ label, href, external, onTrack, Icon }) => (
            <Link
              key={label}
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              className="btn-cta"
              style={{
                fontFamily: "var(--font-mono)", fontSize: "var(--text-mono)", fontWeight: 400,
                letterSpacing: "0.08em", textTransform: "uppercase",
                padding: "5px 10px", minHeight: "32px", borderRadius: "var(--radius-lg)",
                display: "inline-flex", alignItems: "center", gap: "6px",
                textDecoration: "none",
              }}
            >
              <Icon size={11} strokeWidth={1.5} />
              {label}
              {/* Trailing arrow kept: it is the affordance for "opens in a new
                  tab", which the leading identity icon does not convey. */}
              <ArrowUpRight size={11} strokeWidth={1.5} />
            </Link>
          ))}
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
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {["B2B", "SaaS", "Fintech", "Manufacturing", "Entertainment", "Customer Experience"].map(chip => (
              <span key={chip} style={{
                fontFamily: "var(--font-body)", fontSize: "var(--text-caption)",
                fontWeight: 400, letterSpacing: "-0.01em",
                padding: "4px 10px", borderRadius: "9999px",
                /* Matches the Tools chips below: surface2 fill, no hairline.
                   These were surface + border, which in the light theme meant no
                   fill contrast at all (--surface and --bg are both #ffffff) so
                   the border carried the whole shape. Two chip groups in one
                   panel, same class of information, should not be built
                   differently. A hairline was tried on top of the fill and
                   removed again -- fill defines the shape, not fill + border. */
                background: "var(--surface2)",
                color: "var(--muted2)",
              }}>
                {chip}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Skill groups.

            Two treatments on purpose, keyed by `variant`:

            - "prose" (Skills) -- eleven capabilities set as one flowing run.
              Chips were wrong for this: eleven pills of very different widths
              wrap into a ragged mosaic with no scan order, each one is a
              container around two or three words that has no function, and they
              were visually identical to the Industries chips directly above, so
              two different kinds of information read as the same thing. Pill
              shapes also imply toggling, which these do not do.

            - "chips" (Tools) -- kept, because these carry brand
              marks and a logo needs a bounded shape to sit in. Concrete products
              get chips; abstract capabilities get text.

            The mono eyebrow header is shared by both, and by the
            Industries block above, which is what keeps them one system. */}
        {SKILL_GROUPS.map(({ label, variant, items, tone }, gi) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: EASE, delay: 0.24 + gi * 0.03 }}
            style={{ padding: "16px 0" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <p style={{
                fontFamily: "var(--font-mono)", fontSize: "var(--text-eyebrow)",
                letterSpacing: "0.1em", textTransform: "uppercase",
                color: "var(--muted)", whiteSpace: "nowrap", fontWeight: 400,
              }}>
                {label}
              </p>

            </div>

            {variant === "prose" ? (
              /* A list that reads as prose. <ul>/<li> rather than a <p> so screen
                 readers still announce "list, 11 items"; the middots are
                 aria-hidden so they are not read out as punctuation. Separators
                 use --muted, which is lighter than the --muted2 text, so the
                 words dominate and the dots recede. */
              <ul style={{
                listStyle: "none", margin: 0, padding: 0,
                fontFamily: "var(--font-body)", fontSize: "var(--text-body)",
                fontWeight: 400, lineHeight: 1.7, letterSpacing: "-0.01em",
                color: "var(--muted2)",
              }}>
                {/* Every item inline, wrapping where the column runs out.

                   Two of these used to be display: block to force a line of
                   their own. That worked at 11 items and fell apart at 18: a
                   block li ends the line before it AND after it, so the run
                   stopped dead at "Usability & Accessibility" and restarted,
                   which reads as broken sequence rather than as grouping.
                   Forced breaks only make sense when the list is short enough
                   to plan; past that, let it wrap. */}
                {items.map((item, ii) => (
                  <li key={item} style={{ display: "inline" }}>
                    {ii > 0 && (
                      <span aria-hidden="true" style={{ color: "var(--muted)", padding: "0 6px" }}>
                        ·
                      </span>
                    )}
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {items.map(item => (
                  <span key={item} style={{
                    display: "inline-flex", alignItems: "center", gap: "6px",
                    fontFamily: "var(--font-body)", fontSize: "var(--text-caption)",
                    fontWeight: 400, letterSpacing: "-0.01em",
                    padding: "4px 10px", borderRadius: "9999px",
                    /* Tinted fill replaces surface + hairline. Measured with
                       --muted2 on the tint: 8.56:1 light / 4.98:1 dark, against
                       a 4.50:1 floor at 12px. */
                    background: "var(--surface2)",
                    color: "var(--muted2)",
                  }}>
                    {TOOL_ICON[item] && <BrandGlyph name={TOOL_ICON[item]} />}
                    {item}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        ))}

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
  /* ── Video thumbnails (existing) ── */
  "astra":                "/images/astra/overview.mp4",
  "planful-esm-tables":   "/images/planful/landing-page.jpg",
  "fancode-homepage":     "/images/fancode/fancode-homepage-after.mp4",
  "zetwerk-dc":           "/images/zetwerk/cover.png",
  "zetwerk-bu-ecosystem": "/images/zetwerk-bu/service-blueprint.png",
};

/* Light/dark thumbnail pairs for Drive-linked cards. */
const THUMB_LIGHT: Record<string, string> = {
  "apple-business-listings":     "/images/reputation/thumbnail.jpg",
  "vendor-credit-financing":     "/images/vendor-credit.png",
  "logistics-tax-compliance":    "/images/logistics.png",
  "financial-planning-workflow": "/images/financial-planning-workflow.jpg",
  "first-time-user-experience":  "/images/ftux.png",
};
const THUMB_DARK: Record<string, string> = {
  "apple-business-listings":     "/images/reputation/thumbnail.jpg",
  "vendor-credit-financing":     "/images/vendor-credit.png",
  "logistics-tax-compliance":    "/images/logistics.png",
  "financial-planning-workflow": "/images/financial-planning-workflow.jpg",
  "first-time-user-experience":  "/images/ftux.png",
};

const WORK_POSTERS: Record<string, string> = {
  "astra":                "/images/astra/cover.jpg",
  "planful-esm-tables":   "/images/planful/landing-page.jpg",
  "apple-business-listings": "/images/reputation/thumbnail.jpg",
  "fancode-homepage":     "/images/fancode/overall-homepage.jpg",
};

// Video file extensions that should render through <video> instead of <img>.
/* Videos that play on hover over an otherwise still card. The still is what
   the card is; the video is a reward for pointing at it.

   Only wired where a card has a real product video worth revealing. Touch
   never reaches this -- see WorkCardThumb for why. */
const WORK_HOVER_VIDEOS: Record<string, string> = {
  "planful-esm-tables": "/images/planful/planful-product-video.mp4",
};

const isVideoThumb = (src: string) => /\.(mov|mp4|webm)$/i.test(src);

/* ── Work card thumbnail shimmer wrapper ── */
function WorkCardThumb({
  src, poster, height = 200, borderRadius = "8px 8px 0 0", hoverVideo,
}: {
  src: string; poster?: string; height?: number; borderRadius?: string; hoverVideo?: string;
}) {
  const [ready, setReady] = useState(false);
  const [inView, setInView] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [hoverReady, setHoverReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const hoverVideoRef = useRef<HTMLVideoElement>(null);
  const isVideo = isVideoThumb(src);

  /* Hover video is opt-in per card, and only on hardware that can hover.

     A phone reports no hover, and a touch that lingers would otherwise fire
     mouseenter and start a download the visitor never asked for. Pointing a
     mouse at something is a deliberate act; resting a finger on it while
     scrolling is not.

     prefers-reduced-motion opts out too: an autoplaying loop is exactly the
     kind of motion that setting exists to stop. */
  const [canHover, setCanHover] = useState(false);
  useEffect(() => {
    if (!hoverVideo || isVideo) return;
    const ok =
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setCanHover(ok);
  }, [hoverVideo, isVideo]);

  /* Mounted on first hover, never before, so a visitor who only scrolls past
     the card pays nothing for a video they never see. Once mounted it stays,
     so a second hover is instant rather than re-buffering. */
  const [hoverMounted, setHoverMounted] = useState(false);
  useEffect(() => {
    if (hovering && canHover) setHoverMounted(true);
  }, [hovering, canHover]);

  useEffect(() => {
    const v = hoverVideoRef.current;
    if (!v) return;
    if (hovering) {
      void v.play().catch(() => {
        /* Autoplay refused. The still underneath is already correct. */
      });
    } else {
      v.pause();
      v.currentTime = 0;
    }
  }, [hovering, hoverMounted]);

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
    <div
      ref={containerRef}
      style={{ position: "relative", width: "100%", height: "100%" }}
      onMouseEnter={canHover ? () => setHovering(true) : undefined}
      onMouseLeave={canHover ? () => setHovering(false) : undefined}
    >
      {isVideo ? (
        <>
          {/* Shimmer skeleton while the video buffers. No poster image —
              the video plays as-is once canplay fires. */}
          {!ready && !poster && (
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
              poster={poster}
              autoPlay loop muted playsInline
              preload="metadata"
              aria-hidden="true"
              onCanPlay={() => setReady(true)}
              onError={() => setReady(true)}
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
            onError={() => setReady(true)}
            style={{
              ...coverStyle,
              opacity: ready ? 1 : 0,
              transition: "opacity 0.3s ease",
            }}
          />
          {/* Sits over the still and fades in once it can actually play, so a
              hover never flashes an empty black rectangle before the first
              frame arrives. */}
          {hoverMounted && (
            <video
              ref={hoverVideoRef}
              className="work-thumb"
              src={hoverVideo}
              loop muted playsInline
              preload="none"
              aria-hidden="true"
              onCanPlay={() => setHoverReady(true)}
              onError={() => setHoverReady(false)}
              style={{
                ...coverStyle,
                opacity: hovering && hoverReady ? 1 : 0,
                transition: "opacity 0.35s var(--ease-out-quart)",
                zIndex: 2,
                pointerEvents: "none",
              }}
            />
          )}
        </>
      )}
    </div>
  );
}

/* ── Google Drive PDF thumbnail with MeshThumbnail fallback on error ── */
function DriveThumb({ src, alt, index, type, confidential }: { src: string; alt: string; index: number; type?: string; confidential?: boolean }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <MeshThumbnail index={index} type={type} confidential={confidential} />;
  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
    />
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
            borderRadius: "16px",
            overflow: "hidden",
            transition: "box-shadow 0.25s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          {/* Thumbnail. auto-playing screen recording of the portfolio's
              design language in motion. Muted + looped, mirrors the case
              study video thumbnail pattern. */}
          <div style={{ position: "relative", aspectRatio: "16 / 9", overflow: "hidden", borderRadius: "16px 16px 0 0" }}>
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
      /* No border: the surface2 fill already separates the chip from the card
         (1.09:1 light / 1.14:1 dark). A hairline on top of a fill was the same
         doubled-up treatment removed from the tool chips and testimonials. */
      color: "var(--text)", borderRadius: "6px",
    }}>
      {label}
    </span>
  );
}

/* Domain badge per work card. Tone encodes the category, which is the whole
   reason this chip is tonal while WorkChip stays greyscale -- one accent
   against neutral tags, not a wall of colour. Cards sharing a domain share a
   tone deliberately (both fintech pieces are indigo).

   Teal is deliberately absent: it is spoken for by the testimonial cards.

   Slugs not listed here render tags only, which is the correct default -- a
   card with no clear single domain should not be given a fabricated one. */
/* Tags that should not become chips on a specific card. Same reasoning as the
   badge filter below: the tag stays in the data, so the case study page keeps
   it, and only the card is trimmed. Cards show two chips at most, so dropping
   one here promotes whatever came next rather than leaving a gap. */
const CARD_CHIP_EXCLUDE: Record<string, string[]> = {
  "first-time-user-experience": ["UX Design"],
};

const CARD_CATEGORY: Record<string, {
  label: string;
  tone: ChipTone;
  icon?: (p: { size?: number; strokeWidth?: number; style?: React.CSSProperties }) => React.ReactElement;
}> = {
  "vendor-credit-financing":     { label: "Fintech",       tone: "indigo",  icon: Briefcase },
  "financial-planning-workflow": { label: "Fintech",       tone: "indigo",  icon: Briefcase },
  "logistics-tax-compliance":    { label: "Supply Chain",  tone: "amber",   icon: Path },
  "apple-business-listings":     { label: "Customer Experience", tone: "emerald", icon: ChartActivity },
  "first-time-user-experience":  { label: "Sports App",    tone: "sage",    icon: Users },
  /* Not currently on the homepage, kept so they carry their badge if revived. */
  "astra":                       { label: "AI Experiments", tone: "violet", icon: Sparkles },
  "planful-esm-tables":          { label: "Fintech",        tone: "indigo", icon: Briefcase },
  "zetwerk-dc":                  { label: "Supply Chain",   tone: "amber",  icon: Path },
  "zetwerk-bu-ecosystem":        { label: "Service Design", tone: "amber",  icon: TreeStructure },
};

/* Accent chip -tonal category badge (theme-aware). Stands out from the
   standard greyscale WorkChip (e.g. "AI Experiments", "Coming soon"). */
function AccentChip({ label, icon: Icon }: {
  label: string;
  /** Retained on the data and call sites; no longer painted. */
  tone?: ChipTone;
  icon?: (p: { size?: number; strokeWidth?: number; style?: React.CSSProperties }) => React.ReactElement;
}) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      fontFamily: "var(--font-mono)", fontSize: "var(--text-mono)",
      letterSpacing: "0.06em", textTransform: "uppercase",
      gap: "5px",
      padding: "4px 8px",
      /* Neutral. Colour on this site now carries exactly one meaning -- "this is
         someone else's voice" -- and lives only on the testimonial and mentee
         review cards. A category badge is Arun describing his own work, so it
         does not qualify.

         The icon is what separates this from a plain WorkChip now that the tint
         is gone. It was being accepted as a prop and silently dropped before,
         so the icons passed by CARD_CATEGORY never rendered at all. */
      background: "var(--surface2)",
      color: "var(--text)",
      borderRadius: "6px",
      lineHeight: 1.4,
    }}>
      {Icon && <Icon size={10} strokeWidth={1.5} />}
      {label}
    </span>
  );
}

function WorkPanel() {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const check = () => setIsDark(document.documentElement.dataset.theme === "dark");
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  const CARD_ORDER = [
    "vendor-credit-financing",
    "apple-business-listings",
    "logistics-tax-compliance",
    "financial-planning-workflow",
    "first-time-user-experience",
  ];
  /* Drive-linked cards that require a password before the PDF opens. */
  const PROTECTED_DRIVE = new Set<string>();
  /* AI Exploration section hidden from the live homepage. Empty array
     collapses the entire "AI Exploration" block (header + Astra card +
     Portfolio Design Language card) via the `explorationCards.length > 0`
     gate further down. Routes for /work/astra and /system still exist
     for direct linking; only the homepage surface is removed. */
  const EXPLORATION_ORDER: string[] = [];
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

  // Focus trap for the password modal — keeps Tab/Shift+Tab cycling
  // within the dialog so keyboard users can't escape into the page
  // behind the backdrop while the modal is open.
  useEffect(() => {
    if (!pwOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const dialog = document.querySelector<HTMLElement>('[aria-labelledby="archived-pw-modal-title"]');
      if (!dialog) return;
      const focusable = dialog.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [pwOpen]);

  return (
    <div id="work-panel">
      <PanelHeader label="Selected Work" />
      <div style={{ padding: "16px 24px 32px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>

          {allCards.map((cs, i) => {
            const href = cs.driveUrl ?? `/work/${cs.slug}`;
            const isExternal = !!cs.driveUrl;
            /* Composed accessible name. Without this the link announces as a
               run-on of the visual chips and title ("Enterprise SaaSFintechLed
               the Vendor Credit..."), because the chips are separate elements
               with no separating text. External cards also state where they go
               and that a new tab opens, which the visual card does not say. */
            /* Titles carry their own terminal period, so appending one here produced
               ".." in every card's accessible name. Strip it before joining. */
            const cardLabel = `${cs.title.replace(/\.$/, "")}. ${cs.tags.join(", ")}${isExternal ? ". Opens a PDF in Google Drive in a new tab" : ""}`;
            const comingSoon = COMING_SOON.has(cs.slug);
            const isProtected = PROTECTED_DRIVE.has(cs.slug);
            const CardWrapper = comingSoon
              ? ({ children }: { children: React.ReactNode }) => <div style={{ cursor: "default" }}>{children}</div>
              : isProtected
                ? ({ children }: { children: React.ReactNode }) => {
                    const openOrGate = (e: React.MouseEvent | React.KeyboardEvent) => {
                      const alreadyUnlocked = archivedUnlocked
                        || (typeof document !== "undefined"
                            && document.cookie.split(";").some(c => c.trim().startsWith(`${UNLOCK_UI_KEY}=1`)));
                      if (alreadyUnlocked) {
                        window.open(href, "_blank", "noopener,noreferrer");
                      } else {
                        handleArchivedClick(e as unknown as React.MouseEvent, href);
                      }
                    };
                    return (
                      <div
                        role="button"
                        tabIndex={0}
                        style={{ cursor: "pointer", display: "contents" }}
                        onClick={openOrGate}
                        onKeyDown={e => { if (e.key === "Enter" || e.key === " ") openOrGate(e); }}
                      >
                        {children}
                      </div>
                    );
                  }
                : ({ children }: { children: React.ReactNode }) => <Link href={href} aria-label={cardLabel} {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{children}</Link>;
            return (
              <motion.div
                key={cs.slug}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{
                  opacity: { duration: 0.5, ease: EASE, delay: i * 0.06 },
                  y: { type: "spring", stiffness: 320, damping: 28 },
                }}
                style={comingSoon ? { opacity: 0.45 } : {}}
              >
                <CardWrapper>
                  <div
                    className={`work-card${comingSoon ? " work-card--static" : ""}`}
                    style={{
                      borderRadius: "16px",
                      overflow: "hidden",
                    }}
                  >
                    {/* Thumbnail */}
                    <div style={{ position: "relative", aspectRatio: "16 / 9", overflow: "hidden", borderRadius: "16px 16px 0 0" }}>
                      {WORK_THUMBS[cs.slug] ? (
                        <WorkCardThumb
                          src={WORK_THUMBS[cs.slug]}
                          poster={WORK_POSTERS[cs.slug]}
                          hoverVideo={WORK_HOVER_VIDEOS[cs.slug]}
                          height={220}
                          borderRadius="16px 16px 0 0"
                        />
                      ) : (THUMB_LIGHT[cs.slug] || THUMB_DARK[cs.slug]) ? (
                        <div style={{ position: "absolute", inset: "16px", borderRadius: "6px", overflow: "hidden", background: isDark ? "#1a1918" : "#f0f0f2" }}>
                            {/* FanCode only. `first-time-user-experience` is the
                              FanCode sports-app card -- the one FanCode entry
                              in CARD_ORDER, so it is the only FanCode thumbnail
                              that renders on the homepage (`fancode-homepage`
                              exists in the data but is not in CARD_ORDER, so
                              nothing reaches it). Every other card keeps the
                              plain <img>: this treatment was asked for on
                              FanCode alone. Grid softened on request:
                              2 -> 1 -> 0.5, then back up to 0.75 (+50%). */}
                          {cs.slug === "first-time-user-experience" ? (
                            <DitheredImage
                              src={isDark ? (THUMB_DARK[cs.slug] ?? THUMB_LIGHT[cs.slug]!) : (THUMB_LIGHT[cs.slug] ?? THUMB_DARK[cs.slug]!)}
                              alt={cs.title}
                              radius="6px"
                              size={0.75}
                              colorSteps={6}
                              style={{ width: "100%", height: "100%" }}
                            />
                          ) : (
                            <img
                              src={isDark ? (THUMB_DARK[cs.slug] ?? THUMB_LIGHT[cs.slug]!) : (THUMB_LIGHT[cs.slug] ?? THUMB_DARK[cs.slug]!)}
                              alt={cs.title}
                              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }}
                            />
                          )}
                        </div>
                      ) : (
                        <MeshThumbnail index={i} type={cs.type} confidential={cs.slug === "apple-business-listings" ? false : cs.confidential} />
                      )}
                    </div>

                    {/* Body */}
                    <div style={{ padding: "16px 16px 18px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "5px", flexWrap: "wrap", marginBottom: "10px" }}>
                        {CARD_CATEGORY[cs.slug] && (
                          <AccentChip
                            label={CARD_CATEGORY[cs.slug].label}
                            tone={CARD_CATEGORY[cs.slug].tone}
                            icon={CARD_CATEGORY[cs.slug].icon}
                          />
                        )}
                        {/* Tags minus anything the category badge already says.
                            Three cards were printing their domain twice --
                            [FINTECH] next to a FINTECH tag -- because the badge
                            label and the tag list are authored separately.
                            Filtering here rather than editing the tag data keeps
                            the tags intact for the case study page, where there
                            is no badge to duplicate. */}
                        {cs.tags
                          .filter(tag =>
                            tag.toLowerCase() !== CARD_CATEGORY[cs.slug]?.label.toLowerCase())
                          .filter(tag =>
                            !CARD_CHIP_EXCLUDE[cs.slug]?.some(
                              x => x.toLowerCase() === tag.toLowerCase()))
                          .slice(0, 2)
                          .map(tag => (
                            <WorkChip key={tag} label={tag} />
                          ))}
                        {comingSoon && <AccentChip label="Coming soon" tone="amber" />}
                      </div>
                      <h3 style={{
                        fontFamily: "var(--font-body)", fontSize: "var(--text-title-sm)", fontWeight: 500,
                        lineHeight: "26px", letterSpacing: "-0.02em",
                        color: "var(--text)", marginBottom: 0,
                      }}>
                        {cs.title}
                      </h3>
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
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
              {explorationCards.map((cs) => {
                const href = `/work/${cs.slug}`;
                return (
                  <motion.div
                    key={cs.slug}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-20px" }}
                    transition={{
                      opacity: { duration: 0.5, ease: EASE },
                      y: { type: "spring", stiffness: 320, damping: 28 },
                    }}
                  >
                    <Link href={href}>
                      <div className="work-card" style={{
                        borderRadius: "16px",
                        overflow: "hidden",
                      }}
                      >
                        <div style={{ position: "relative", aspectRatio: "16 / 9", overflow: "hidden", borderRadius: "16px 16px 0 0" }}>
                          <WorkCardThumb
                            src={WORK_THUMBS[cs.slug] || ""}
                            poster={WORK_POSTERS[cs.slug]}
                            hoverVideo={WORK_HOVER_VIDEOS[cs.slug]}
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
      </div>

      {/* Password modal removed with archived section */}
      {false && portalReady && createPortal(
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
                    borderRadius: "10px",
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
  bullets?: string[];
  highlights?: string[];
  highlightLink?: string;
  highlightLinks?: (string | null)[];
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
    type: "role", startYear: 2025.167, endYear: 2025.583,
    title: "Senior Product Designer", subtitle: "Planful Software", minHeight: 72,
    dateLabel: "Mar 2025 - Aug 2025", impact: "Fintech", logoDomain: "planful.com",
    link: "https://planful.com/",
    description: "Led end-to-end design of two finance planning features, reducing training time ~30% and supporting migration of core finance workflows from legacy tools to a modern web interface.",
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
      "Achievement – Zetwerk Hackathon Winner: Won competing against 11 other teams during an intense 40-hour innovation challenge",
    ],
    highlightLinks: [null, null, "https://www.youtube.com/watch?v=ZJoioJyN4H4"],
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
    /* endYear meets FanCode's startYear (2020.583) rather than sitting at
       Jul 2020's 2020.5. The roles are contiguous -- Jul 2020 ends, Aug 2020
       begins -- so the one-month numeric gap was a month-boundary artefact of
       the scale, not a real break, and it rendered as blank track. dateLabel
       is unchanged and still states the true dates. */
    type: "role", startYear: 2016.667, endYear: 2020.583,
    title: "UX Designer (Founder)", subtitle: "Quazire Consulting",
    dateLabel: "Sep 2016 - Jul 2020", impact: "Design consultancy",
    description: "Founded and ran a boutique UX consultancy.",
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
    dateLabel: "Nov 2023 - Present", impact: "Top 1%",
    link: "https://adplist.org/",
    description: "Recognised as a Super Mentor and Top 1% Contributing Mentor on ADPList, mentoring designers across career transitions, portfolio reviews, and senior IC growth.",
  },
  {
    type: "education", startYear: 2023.75, endYear: 2025.083,
    title: "Product Management", subtitle: "IIT Guwahati · Accredian",
    dateLabel: "Oct 2023 - Feb 2025", logoDomain: "accredian.com", minHeight: 72,
    description: "Executive Program in Data-Driven Product Management (Accredian, IIT Guwahati).",
    bullets: [
      "Applied data, product strategy, and user-centric approaches across the product lifecycle",
      "Covered customer research, analytics, product strategy, and experimentation",
      "Translated insights into product roadmaps, metrics, and iterative data-informed decisions",
    ],
  },
  {
    type: "education", startYear: 2020.917, endYear: 2021.333,
    title: "Program in UX Design", subtitle: "IIT Bombay",
    dateLabel: "Dec 2020 - May 2021", logoDomain: "iitb.ac.in", minHeight: 72,
    description: "Program in User Experience Design from IDC School of Design, IIT Bombay.",
    bullets: [
      "Covered end-to-end UX lifecycle from user research and problem framing to interaction design, testing, and implementation",
      "Completed a hands-on, project-based curriculum with a field research project using contextual inquiry",
      "Translated real-world user behaviours into iterative design solutions",
    ],
    images: ["/images/career/iitb-1.jpg", "/images/career/iitb-2.jpg"],
  },
  {
    type: "education", startYear: 2019.583, endYear: 2019.75,
    title: "Conducting Usability Testing", subtitle: "Interaction Design Foundation",
    dateLabel: "Aug 2019", logoDomain: "interaction-design.org", minHeight: 72,
    description: "Usability Testing certification from Interaction Design Foundation.",
    bullets: [
      "Focused on planning, conducting, and analysing user tests",
      "Drive data-informed design improvements through structured testing methods",
    ],
  },
  {
    type: "education", startYear: 2019.5, endYear: 2019.583,
    title: "Industry Jury", subtitle: "Institute of Product Leadership",
    dateLabel: "Jul 2019", minHeight: 72,
    description: "Institute of Product Leadership — Skillathon format replacing traditional exams.",
    link: "https://www.productleadership.com/user-interface-design-prototyping-skillathon-hyderabad-6-july-2019/",
    bullets: [
      "Top Product Lab UX ideas presented to a live jury of hiring managers and industry experts",
      "Best voted team wins the Skill Champion Trophy and cash award",
    ],
  },
  {
    type: "education", startYear: 2017, endYear: 2017.5,
    title: "Design Thinking & Leadership", subtitle: "DSIL Global",
    dateLabel: "2017", minHeight: 72,
    description: "Global certification in social innovation and leadership.",
    bullets: [
      "Applied human-centred methods and systems thinking through field immersions and cross-sector collaboration",
      "Worked with local communities, social enterprises, and ecosystem leaders across Southeast Asia",
      "Conducted contextual research, facilitated design sprints, and translated insights into actionable solutions through iterative prototyping",
    ],
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

/** Deterministic hue (0-360) derived from initials so each person gets a
    stable, unique tint without us having to hand-pick colours. Used to softly
    tint the monogram avatar background when no headshot is present. */
const hueFromInitials = (initials: string): number => {
  let hash = 0;
  for (let i = 0; i < initials.length; i++) {
    hash = (hash * 31 + initials.charCodeAt(i)) >>> 0;
  }
  return hash % 360;
};

const testimonials: Testimonial[] = [
  { quote: "Arun possesses a remarkable understanding of user needs, seamlessly navigating between design strategy and hands-on execution. His strategic mindset significantly impacted our efforts to enhance retention metrics.", name: "Raissa Fichardo", role: "Director of UX", company: "FanCode", initials: "RF", image: "/images/testimonial/raissa-fichardo.webp" },
  { quote: "I was always impressed by his ability to simplify complex problems and create user-friendly designs. He's a thoughtful, strategic designer who balances business goals with user needs.", name: "Jeff Orshalick", role: "UX Design Manager", company: "Reputation", initials: "JO", image: "/images/testimonial/jeff-orshalick.avif" },
  { quote: "Arun has an exceptional understanding of design and the knack to draw relevant insights to identify the right problems. His business acumen combined with a user-first approach makes him an ideal UX lead.", name: "Vikas Kotian", role: "VP Product Design", company: "FanCode", initials: "VK", image: "/images/testimonial/vikas-kotian.jpeg" },
  { quote: "Arun embodies the core principles of exceptional UX research and design. Our collaboration on numerous uncertain projects highlighted his invaluable contributions. Arun not only drove the research but also championed the significance of user research.", name: "Nikhil Bhagya", role: "Product Manager", company: "Zetwerk", initials: "NB", image: "/images/testimonial/nikhil-bhagya.jpeg" },
  { quote: "During the short period we collaborated on the same project I noticed that Arun is very good at UX. As a developer I loved working on his vision. He was always very committed and focused. I was impressed by his UX and research skills.", name: "Bishal Biswas", role: "Engineer", company: "Atlassian", initials: "BB", image: "/images/testimonial/bishal-biswas.jpeg" },
];

/* ── Panel: AI Experiments ── */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- kept for revival; hidden from PANEL_CONFIGS
function AiExperimentsPanel() {
  return (
    <div>
      <PanelHeader label="AI Experiments" />
      <div style={{ padding: "16px 24px 32px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{
              opacity: { duration: 0.5, ease: EASE },
              y: { type: "spring", stiffness: 320, damping: 28 },
            }}
          >
            {/* Thumbnail is the ChatGPT mark rather than a screenshot: it
                identifies where the GPT lives, and there is no captured asset
                of the GPT itself. Centred at its own size, not stretched --
                it is a logo, not a photograph. Source and licence are recorded
                in public/images/ai/README.txt (public domain, PD-shape).

                The whole card is the link, matching the work cards. It used to
                carry a "View GPT" button instead; removing that without moving
                the href up here would have left the card with no destination. */}
            <Link
              href="https://chatgpt.com/g/g-6a6b5aeb663c81919ca14dbf88115b73-ux-product-research-assistant"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="UX product research assistant. Custom GPT on ChatGPT. Opens in a new tab"
              style={{ textDecoration: "none", display: "block" }}
            >
            <div
              className="work-card"
              style={{
                borderRadius: "16px",
                overflow: "hidden",
                transition: "box-shadow 0.25s cubic-bezier(0.22,1,0.36,1)",
              }}
            >
              {/* Same 16:9 / 16px-top-radius geometry as the work cards. */}
              <div style={{
                position: "relative",
                aspectRatio: "16 / 9",
                overflow: "hidden",
                borderRadius: "16px 16px 0 0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "var(--surface2)",
              }}>
                <img
                  src="/images/ai/chatgpt-logo.svg"
                  alt=""
                  aria-hidden="true"
                  width={88}
                  height={88}
                  loading="lazy"
                  decoding="async"
                  style={{ width: "88px", height: "88px", display: "block", borderRadius: "20px" }}
                />
              </div>

              <div style={{ padding: "16px 16px 18px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap", marginBottom: "10px" }}>
                  <AccentChip label="Custom GPT" tone="violet" icon={Sparkles} />
                  <WorkChip label="UX Research" />
                </div>

                <h3 style={{
                  fontFamily: "var(--font-body)", fontSize: "var(--text-title-sm)",
                  fontWeight: 500, lineHeight: "22px", letterSpacing: 0,
                  color: "var(--text)", marginBottom: "6px",
                }}>
                  UX product research assistant.
                </h3>

                <p style={{
                  fontFamily: "var(--font-body)", fontSize: "var(--text-body)",
                  fontWeight: 400, lineHeight: 1.6, letterSpacing: "-0.01em",
                  color: "var(--muted)", marginBottom: "14px",
                }}>
                  Built and launched a Custom GPT for UX researchers, product designers,
                  and product managers, generating{" "}
                  <strong style={{ color: "var(--text)", fontWeight: 500 }}>
                    73K+ organic LinkedIn impressions
                  </strong>
                  .
                </p>

              </div>
            </div>
            </Link>
          </motion.div>

        </div>
      </div>
    </div>
  );
}

function CareerPanel() {
  const totalH = (CAL_END - CAL_START) * YEAR_PX + TOP_OFFSET;
  const allYears = Array.from({ length: CAL_END - CAL_START + 1 }, (_, i) => CAL_END - i);
  const workItems = careerItems.filter(i => i.type === "role");
  const eduItems  = careerItems.filter(i => i.type === "education");
  const [hoveredItem, setHoveredItem]   = useState<CareerItem | null>(null);
  const [selectedItem, setSelectedItem] = useState<CareerItem | null>(null);

  /* Prev/Next step within the open card's own list. Education and roles are
     two separate sequences on the calendar, so stepping out of one and into
     the other would move the card across the panel with no explanation. */
  const navList       = selectedItem?.type === "education" ? eduItems : workItems;
  const selectedIdx   = selectedItem ? navList.findIndex(w => w.title === selectedItem.title && w.startYear === selectedItem.startYear) : -1;
  const toggleCard    = (item: CareerItem) => setSelectedItem(prev =>
    prev?.title === item.title && prev?.startYear === item.startYear ? null : item);
  const collapseCard  = () => setSelectedItem(null);

  /* Prev / Next fired correctly but read as dead buttons. They sit at the bottom
     of an expanded card that runs 600-900px tall, so the click happens deep in
     the panel's scroll. Selecting a sibling collapses that card back to ~72px,
     the panel's scrollHeight drops by ~700px, the browser clamps scrollTop, and
     the newly expanded card opens only 66-83px from the old one -- well above
     where the eye was. Nothing followed it, so the card appeared not to change.
     navPending marks the selection as keyboard/button-driven so the effect below
     scrolls to it; a direct card click is left alone, since the user is already
     looking at the card they just clicked. */
  const navPending    = useRef(false);
  const cancelRef     = useRef(0);
  const prevCard      = () => { if (selectedIdx > 0) { navPending.current = true; setSelectedItem(navList[selectedIdx - 1]); } };
  const nextCard      = () => { if (selectedIdx < navList.length - 1) { navPending.current = true; setSelectedItem(navList[selectedIdx + 1]); } };

  useEffect(() => {
    if (!navPending.current || !selectedItem) return;
    navPending.current = false;
    const key = `${selectedItem.title}-${selectedItem.startYear}`;
    /* Two frames: the card carries a layout spring, so after one frame it is
       still measured at its pre-expansion box. */
    const r1 = requestAnimationFrame(() => {
      const r2 = requestAnimationFrame(() => {
        document.querySelector(`[data-career-card="${key}"]`)?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          /* nearest, not center: the panel deck scrolls horizontally, and any
             other inline value drags the whole deck sideways. */
          inline: "nearest",
        });
      });
      cancelRef.current = r2;
    });
    return () => { cancelAnimationFrame(r1); cancelAnimationFrame(cancelRef.current); };
  }, [selectedItem]);

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
        data-career-card={`${item.title}-${item.startYear}`}
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
        /* A div with an onClick and nothing else is invisible to a keyboard
           and announced as plain text. Giving it the button role and a tab
           stop makes it a real control -- which is also what puts it in reach
           of the click-sound listener, since that only fires on things that
           present as controls. */
        {...(isClickable ? {
          role: "button",
          tabIndex: 0,
          "aria-expanded": isExpanded,
          onKeyDown: (e: React.KeyboardEvent) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              toggleCard(item);
            }
          },
        } : {})}
        style={{
          position: "absolute",
          top: `${top}px`,
          left: isExpanded ? "22px" : isEdu ? "calc(58% + 4px)" : "22px",
          right: isExpanded ? "16px" : isEdu ? "16px" : "calc(42% + 8px)",
          borderRadius: "16px",
          background: isExpanded ? "var(--bg)" : "var(--surface)",
          // No border in either state. --card-shadow / --card-shadow-hover
          // already open with `0 0 0 1px`, so adding a border here stacked a
          // second 1px ring on top of the shadow's own -- two hairlines at
          // slightly different colours, which read as one heavy edge. The
          // shadow ring alone defines the card, exactly as it does collapsed.
          border: "none",
          overflow: "hidden",
          cursor: isClickable ? "pointer" : "default",
          zIndex: isExpanded ? 10 : isHovered ? 5 : 1,
          /* Flat at rest like a calendar event, lifting only on hover or when
             expanded. --card-ring rather than none: the card fills with
             --surface / --bg, both #ffffff in light theme, so with no ring it
             would have no edge against the panel at all. A real calendar event
             gets away with flat because it is filled with saturated colour. */
          boxShadow: isExpanded || isHovered
            ? "var(--card-lift)"
            : "var(--card-ring)",
          transition: "box-shadow 200ms var(--ease-out-quart)",
        }}
      >
        {/* ── Compact header row. always visible ── */}
        <motion.div layout style={{
          display: "flex", alignItems: "center", gap: "8px",
          padding: isExpanded ? "8px 12px" : naturalH < 40 ? "4px 10px" : "8px 12px",
          minHeight: isExpanded ? undefined : `${naturalH}px`,
          overflow: "hidden",
          /* 50% of --border, not full. At full strength this rule matched the
             card's own outer ring exactly and the two met at the left and right
             edges, so they read as one doubled border rather than an edge plus
             an internal divider. Same idiom as PanelHeader's hairline. */
          borderBottom: isExpanded
            ? "1px solid color-mix(in srgb, var(--border) 50%, transparent)"
            : "none",
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
            {/* Impact only. dateLabel used to sit here at rest and swap to impact
                on hover, but the calendar axis this card is positioned against
                already encodes the timeframe, so the date was saying twice what
                the layout says once. Impact now shows at rest and lifts to
                --text on hover. */}
            {!isExpanded && !isEdu && item.impact && (
              /* The line after the company name takes a fill on interaction.
                 Padding and the offsetting negative margin are constant, so
                 only the background colour changes and the text never shifts
                 as the fill arrives. inline-block keeps the fill hugging the
                 text instead of running the full card width, and max-width
                 preserves the ellipsis on long lines. Prev/Next stay
                 unfilled -- they are on .btn-secondary, transparent with a
                 hairline. */
              <p style={{
                fontFamily: "var(--font-body)", fontSize: "var(--text-body)",
                fontWeight: 400, letterSpacing: "-0.01em",
                color: isHovered ? "var(--text)" : "var(--muted)", marginTop: "2px",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                display: "inline-block", maxWidth: "100%",
                padding: "2px 8px", marginLeft: "-8px",
                borderRadius: "var(--radius-sm)",
                background: isHovered ? "var(--surface2)" : "transparent",
                transition: "color 0.2s, background 0.2s",
              }}>
                {item.impact}
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
                    color: "var(--muted2)", marginBottom: item.bullets ? "8px" : "16px",
                  }}>
                    {item.description}
                  </p>
                )}

                {item.bullets && item.bullets.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "16px" }}>
                    {item.bullets.map((b, i) => (
                      <div key={i} style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                        <span style={{ color: "var(--muted)", fontFamily: "var(--font-body)", fontSize: "var(--text-caption)", lineHeight: 1.5, flexShrink: 0 }}>·</span>
                        <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-caption)", fontWeight: 400, letterSpacing: "-0.01em", lineHeight: 1.65, color: "var(--muted2)", margin: 0 }}>{b}</p>
                      </div>
                    ))}
                  </div>
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
                      {item.highlights.map((h, i) => {
                        const hLink = item.highlightLinks?.[i];
                        return (
                          <div key={i} style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                            <span style={{ color: "var(--muted)", fontFamily: "var(--font-body)", fontSize: "var(--text-caption)", lineHeight: 1.5, flexShrink: 0 }}>·</span>
                            <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-caption)", letterSpacing: "-0.01em", lineHeight: 1.55, color: "var(--text)" }}>
                              {h}{hLink && <>{" "}<a href={hLink} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)", textDecoration: "underline" }}>Watch ↗</a></>}
                            </p>
                          </div>
                        );
                      })}
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
                          /* Tinted, not bordered. These sat inside the expanded
                             career card as bordered cards within a bordered
                             card, and their --surface fill is #ffffff in light
                             theme -- identical to the card behind them -- so the
                             border was load-bearing and could not simply be
                             deleted. Teal is the same tone as the testimonial
                             cards, which is what these are -- so they track the
                             same --surface2 fill. */
                          background: "var(--surface2)", borderRadius: "10px",
                          padding: "10px 12px",
                        }}>
                          <p style={{
                            fontFamily: "var(--font-body)", fontSize: "var(--text-caption)",
                            color: "var(--muted2)", lineHeight: 1.6,
                            /* 14px, up from 8px. The quote wraps to several
                               lines at 1.6, so 8px left the attribution reading
                               as another line of the quote rather than a
                               separate register. */
                            letterSpacing: "-0.01em", marginBottom: "14px",
                          }}>
                            &ldquo;{r.quote}&rdquo;
                          </p>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                            {/* Monogram avatar removed. The role + company lines
                                already identify the reviewer, and at 20px the
                                initials disc read as a bullet rather than a
                                person. `initials` stays in the data -- the main
                                testimonial cards still use it for their
                                fallback avatar. */}
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
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

                {/* Prev / Next navigation, for education as well as roles.
                    Each steps within its own sequence -- see navList. */}
                {<div style={{
                  display: "flex", gap: "6px", paddingTop: "16px",
                }}>
                  {/* Rendered only where they lead somewhere. A disabled
                      button still reads as an offer the card is refusing, and
                      on the first and last card that is a question the visitor
                      has to answer for themselves. Absent, there is nothing to
                      resolve. The remaining button takes the full row through
                      flex: 1, so a single Next reads as deliberate rather than
                      as half a pair with a gap beside it. */}
                  {selectedIdx > 0 && (
                    <motion.button
                      className="btn-secondary career-nav-btn career-nav-btn--prev"
                      onClick={e => { e.stopPropagation(); prevCard(); }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <span className="career-nav-chevron" aria-hidden="true">‹</span>
                      Prev
                    </motion.button>
                  )}
                  {selectedIdx < navList.length - 1 && (
                    <motion.button
                      className="btn-secondary career-nav-btn career-nav-btn--next"
                      onClick={e => { e.stopPropagation(); nextCard(); }}
                      whileTap={{ scale: 0.9 }}
                    >
                      Next
                      <span className="career-nav-chevron" aria-hidden="true">›</span>
                    </motion.button>
                  )}
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

        {/* Cards, but flat. boxShadow removed per request -- which means the
            card needs a hairline border to survive: in the light theme --bg and
            --surface are both #ffffff, so a shadowless card with no border is
            literally invisible against the panel. The border is load-bearing,
            not decoration. Semantic figure/blockquote retained from the text
            pass; the 28px decorative quote glyph stays out. */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          {testimonials.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.5, ease: EASE, delay: i * 0.07 }}
              style={{
                margin: 0,
                borderRadius: "16px",
                /* --surface2, the same fill every chip on the site uses. The
                   card originally had --surface plus a hairline, which in the
                   light theme meant no fill contrast at all (--surface and --bg
                   are both #ffffff) so the border carried the whole edge and
                   read louder than the quote it framed. A teal tint replaced it
                   for a while; this drops the last chip tone so the page has one
                   contained-surface treatment and colour is reserved for
                   --accent-warm.

                   Measured light #f5f5f7 / dark #2e2e2b:
                     quote --text   15.46:1 / 13.62:1
                     name  --muted2  9.20:1 /  5.31:1
                     role  --muted2  9.20:1 /  5.31:1  (AA floor 4.50:1) */
                background: "var(--surface2)",
                padding: "20px",
              }}
            >
              {/* Company wordmark. Stands in for a logo: only Atlassian of the
                  four companies exists in simple-icons, so real marks would put
                  a logo on one card out of five and nothing on the rest, which
                  reads as broken rather than designed. Mono caps gives the same
                  visual anchor with full coverage. */}
              <p style={{
                fontFamily: "var(--font-mono)", fontSize: "var(--text-eyebrow)",
                letterSpacing: "0.12em", textTransform: "uppercase",
                color: "var(--muted)", fontWeight: 400,
                margin: "0 0 12px",
              }}>
                {t.company}
              </p>

              {/* Quote carries --text, not --muted. It is the primary content of
                  the panel and was previously rendered at 5.07:1 while the name
                  beside it sat at 16.83:1, so the attribution read louder than
                  the claim it attributes. Small body text also wants the higher
                  contrast; the softened --text-display exists for large display
                  letterforms, which this is not. */}
              <blockquote style={{
                fontFamily: "var(--font-body)", fontSize: "var(--text-body-lg)", fontWeight: 400,
                lineHeight: 1.65, letterSpacing: "-0.01em",
                color: "var(--text)", margin: "0 0 28px",
              }}>
                {t.quote}
              </blockquote>

              <figcaption style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                {t.image ? (
                  <DitheredImage
                    src={t.image}
                    alt=""
                    radius="50%"
                    /* At 52px a coarse dither destroys the face -- too few
                       pixels remain to read as a person, which defeats the
                       point of a headshot. Softened twice on request:
                       1.5 -> 0.75 -> 0.525, just above the 0.5 floor. */
                    size={0.525}
                    colorSteps={6}
                    style={{
                      /* 52px, up from 40px. The monogram fallback below must
                         stay the same number or the two avatar kinds desync
                         between cards. */
                      width: "52px", height: "52px", borderRadius: "50%",
                      flexShrink: 0,
                      /* outline, not inset box-shadow: an inset shadow paints
                         between background and content, and a replaced element's
                         content covers it -- so the ring was invisible on every
                         avatar that had a photo. outline respects border-radius. */
                      outline: "1px solid color-mix(in srgb, var(--text) 8%, transparent)",
                      outlineOffset: "-1px",
                    }}
                  />
                ) : (() => {
                  const hue = hueFromInitials(t.initials);
                  const tint = `hsl(${hue}, 55%, 55%)`;
                  return (
                    <div
                      aria-hidden="true"
                      style={{
                        /* Matches the photo avatar above at 52px. */
                        width: "52px", height: "52px", borderRadius: "50%",
                        background: `linear-gradient(135deg,
                          color-mix(in srgb, ${tint} 16%, var(--surface2)),
                          color-mix(in srgb, ${tint} 6%, var(--surface)))`,
                        outline: "1px solid color-mix(in srgb, var(--text) 6%, transparent)",
                        outlineOffset: "-1px",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <span style={{
                        fontFamily: "var(--font-body)", fontSize: "var(--text-body-lg)",
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
                    letterSpacing: "-0.01em", color: "var(--muted2)", lineHeight: 1.35,
                  }}>
                    {t.name}
                  </p>
                  <p style={{
                    fontFamily: "var(--font-body)", fontSize: "var(--text-body)", fontWeight: 400,
                    letterSpacing: "-0.01em",
                    /* --muted2, not --muted: on --surface2 the lighter --muted
                       falls to 4.24:1 in dark theme, under the AA floor. The
                       name still outranks this line by size and weight. */
                    color: "var(--muted2)", marginTop: "2px", lineHeight: 1.4,
                  }}>
                    {t.role}
                  </p>
                </div>
              </figcaption>
            </motion.figure>
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
    trackEmailClick();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <PanelHeader label="Contact" />
      <div style={{ padding: "16px 24px 24px", flex: 1, display: "flex", flexDirection: "column" }}>

        {/* Headline. typography per Figma reference:
            Manrope 400 / 18px / line-height 30px / 0 tracking. */}
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
          Open to Senior IC and Lead opportunities with teams building AI-native products, platforms, and experiences.
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
            className={`btn-cta${copied ? " is-copied" : ""}`}
            style={{
              fontFamily: "var(--font-mono)", fontSize: "var(--text-mono)", fontWeight: 400,
              letterSpacing: "0.08em", textTransform: "uppercase",
              padding: "5px 10px", minHeight: "32px", borderRadius: "var(--radius-lg)",
              display: "inline-flex", alignItems: "center", gap: "6px",
              cursor: "pointer",
            }}
          >
            {!copied && <Mail size={11} strokeWidth={1.5} />}
            {copied ? "Copied ✓" : "Copy email"}
          </button>

          <Link
            href="https://www.linkedin.com/in/akgaddam/"
            target="_blank" rel="noopener noreferrer"
            className="btn-cta"
            style={{
              fontFamily: "var(--font-mono)", fontSize: "var(--text-mono)", fontWeight: 400,
              letterSpacing: "0.08em", textTransform: "uppercase",
              padding: "5px 10px", minHeight: "32px", borderRadius: "var(--radius-lg)",
              display: "inline-flex", alignItems: "center", gap: "6px",
              textDecoration: "none",
            }}
          >
            <LinkedIn size={11} />
            LinkedIn
            <ArrowUpRight size={11} strokeWidth={1.5} />
          </Link>

          <Link
            href="https://drive.google.com/file/d/1VWajNl_cigKjLwMNevZIJXUm1bY3hoOs/view?usp=sharing"
            target="_blank" rel="noopener noreferrer"
            className="btn-cta"
            style={{
              fontFamily: "var(--font-mono)", fontSize: "var(--text-mono)", fontWeight: 400,
              letterSpacing: "0.08em", textTransform: "uppercase",
              padding: "5px 10px", minHeight: "32px", borderRadius: "var(--radius-lg)",
              display: "inline-flex", alignItems: "center", gap: "6px",
              textDecoration: "none",
            }}
          >
            <FileText size={11} strokeWidth={1.5} />
            CV
            <ArrowUpRight size={11} strokeWidth={1.5} />
          </Link>
        </motion.div>

        {/* Skills & Tools. matches the about-panel treatment (mono label
            + marquee of pills). marginTop: auto pushes it
            and the location card to the bottom of the panel. */}
        {(() => {
          /* Same data as the About panel's skill groups -- Skills then Tools,
             flattened in order, which is exactly what the "Skills & Tools"
             label promises. */
          const skills = SKILL_GROUPS.flatMap(g => g.items);
          return (
            <motion.div
              className="skills-ticker"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.18 }}
              style={{ marginTop: "auto", marginBottom: "28px" }}
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
                        borderRadius: "9999px",
                        background: "var(--surface2)",
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
                          borderRadius: "9999px",
                          background: "var(--surface2)",
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
            /* Same --surface2 fill as the testimonial cards, but this card
               also needs a border where they do not: the map is opaque and
               covers the fill, so only the label strip shows it and the card
               would otherwise read as edgeless. 60% of --border, the value
               tuned for the testimonial cards before they went fill-only. */
            /* No fill. The map fills the top of this card edge to edge and the
               row beneath it is two short labels, so a --surface2 tint only
               tinted the strip under the map and read as a separate band
               rather than one card. The hairline keeps the edge. */
            background: "transparent",
            border: "1px solid color-mix(in srgb, var(--border) 60%, transparent)",
          }}
        >
          {/* Map area. MapLibre GL */}
          <div style={{ position: "relative", overflow: "hidden" }}>
            <MapLibreMap height={190} />
          </div>
          <div style={{ padding: "8px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--muted)", flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
              <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-caption)", fontWeight: 400, letterSpacing: "-0.01em", color: "var(--text)" }}>Hyderabad, India</span>
            </div>
            <ISTClock style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-mono)", letterSpacing: "0.05em", color: "var(--muted)", textTransform: "uppercase" }} />
          </div>
        </motion.div>

        {/* Footer. role="contentinfo" is explicit on purpose: a bare <footer>
            nested inside a <section> is scoped to that section and does NOT map
            to the page-level contentinfo landmark. This layout has no page-level
            footer to attach one to -- the colophon lives at the bottom of the
            Contact panel -- so the role is declared here. */}
        <motion.footer
          role="contentinfo"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.25 }}
          style={{ marginTop: "16px" }}
        >
          <p style={{
            fontFamily: "var(--font-body)", fontSize: "var(--text-mono-lg)",
            fontWeight: 400, letterSpacing: "-0.01em",
            color: "var(--muted)", lineHeight: 1.3,
            marginBottom: "4px",
          }}>
            © 2026 · Arun Gaddam
          </p>
          <p style={{
            fontFamily: "var(--font-body)", fontSize: "var(--text-mono-lg)",
            fontWeight: 400, letterSpacing: "-0.01em",
            color: "var(--muted)", lineHeight: 1.3,
          }}>
            <span style={{ opacity: 0.6 }}>Designed with </span>
            {/* Claude's own mark from lib/brandIcons.ts, not the generic
                four-point sparkle that used to sit here. Keeps Claude's
                #D97757 rather than currentColor so it reads as the brand
                in both themes. */}
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="#D97757"
              aria-hidden
              focusable="false"
              /* 15px, up from 11px. verticalAlign moves with it: the baseline
                 offset has to grow in step or the larger mark rides high
                 against the text it sits in. */
              style={{ display: "inline-block", verticalAlign: "-3px", margin: "0 2px" }}
            >
              <path d={brandIcons.claude.path} />
            </svg>
            <span style={{ opacity: 0.6 }}>Claude</span>
          </p>
        </motion.footer>

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
              viewport={{ once: true, margin: "-20px" }}
              transition={{ opacity: { duration: 0.5, ease: EASE }, y: { type: "spring", stiffness: 320, damping: 28 } }}
            >
              <Link href={`/work/${astra.slug}`}>
                <div
                  className="work-card"
                  style={{
                    boxShadow: "var(--card-shadow)",
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

/* A hairline ring defines the panel edge; the blur only has to suggest air
   under it. That split is what lets the blur go this light -- the edge no
   longer depends on the shadow being visible, and a shadow you can clearly
   see on a surface this large is too strong by definition.
   Light panels also already sit on --chrome (#f5f5f5), a step below the panel
   fill, so some of the lift is done before any shadow is drawn.
   Rest and active are deliberately close. They used to differ by 4px of
   offset, 16px of blur and 0.04 alpha, which made elevation pulse across the
   rail as you scrolled -- movement in the chrome, competing with the content
   it frames. */


const PANEL_SHADOW_LIGHT = "var(--panel-shadow)";
const PANEL_SHADOW_ACTIVE_LIGHT = "var(--panel-shadow-active)";
/* Dark panels sit on #050507 canvas. drop shadows are invisible on near-black.
   A white hairline ring defines the panel edge; the surface step (#1c1c1e panel
   vs #050507 canvas) provides the perceived lift. */
const PANEL_SHADOW_DARK  = "var(--panel-shadow)";
const PANEL_SHADOW_ACTIVE_DARK = "var(--panel-shadow-active)";

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
          src="/arun-gaddam.webp"
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
          I&apos;m hands on throughout the entire process, from strategy to execution.
        </p>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-body-lg)",
            lineHeight: 1.65,
            letterSpacing: "-0.01em",
            color: "var(--muted)",
            margin: "12px 0 0",
          }}
        >
          I&apos;ve been learning how LLMs work, and I&apos;m excited about designing AI product experiences.
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
                  textDecoration: "none",
                display: "inline-flex", alignItems: "center", gap: "6px",
                  }}
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
  /* AI Experiments hidden again. PANEL_LABELS derives from this array, so the
     nav dots, arrows and floating menu all drop it with no other change.
     Uncomment to bring it back. */
  // { label: "AI Experiments", width: "420px", minWidth: "380px", Component: AiExperimentsPanel },
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

  /* Click sound: one document-level listener for the page. */
  useEffect(() => installClickSound(), []);
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

  /* Wheel anywhere outside a panel scrolls the panels horizontally.

     Before this, the chrome around the panels was dead to the wheel: the top
     nav strip, the bottom padding, the left gutter and the right fade are all
     outside .panel, so a wheel there hit an element with nothing to scroll and
     the page simply sat still. That reads as the site being frozen.

     It deliberately does NOT forward when the pointer is over a panel. Each
     .panel has its own overflowY: auto, so a vertical wheel there must keep
     scrolling that panel's content -- hijacking it would break reading a case
     study. Only wheels landing outside every panel are redirected.

     Two details that matter:
     - deltaX and deltaY are merged, so a mouse wheel (deltaY only) and a
       trackpad swipe (deltaX) both work.
     - The container carries scrollBehavior: "smooth" for the nav arrows and
       keyboard jumps. Assigning scrollLeft under that setting animates every
       single wheel tick, which feels like wading through treacle -- so it is
       flipped to "auto" for the gesture and restored once the wheel goes
       quiet, leaving the arrow/keyboard animation intact. */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let restore: ReturnType<typeof setTimeout> | null = null;

    const onWheel = (e: WheelEvent) => {
      /* Mobile stacks the panels vertically; there is no horizontal axis to
         drive, and stealing the wheel there would break the page outright. */
      if (window.matchMedia("(max-width: 640px)").matches) return;

      const target = e.target as Element | null;
      if (target && target.closest(".panel")) return;

      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (!delta) return;

      e.preventDefault();
      el.style.scrollBehavior = "auto";
      el.scrollLeft += delta;

      if (restore) clearTimeout(restore);
      restore = setTimeout(() => { el.style.scrollBehavior = "smooth"; }, 120);
    };

    /* passive: false because the handler calls preventDefault. */
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", onWheel);
      if (restore) clearTimeout(restore);
    };
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
            gap: "24px",
            /* Inter-panel gap (24px) — matches the panel's own 24px inner
               gutter, so the space between two panels reads as the same
               interval as the space inside one. Top padding kept at 8px.
               Mobile stacks vertically at 12px via .panels-container. */
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
          {PANEL_CONFIGS.map(({ label, width, minWidth, Component }, i) => {
            const isActive = activePanel === i;
            const shadow = isDark
              ? (isActive ? PANEL_SHADOW_ACTIVE_DARK  : PANEL_SHADOW_DARK)
              : (isActive ? PANEL_SHADOW_ACTIVE_LIGHT : PANEL_SHADOW_LIGHT);
            const panelClass = `panel${isActive ? " is-active" : ""}`;
            return (
              <motion.section
                key={i}
                className={panelClass}
                aria-label={label}
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
                {/* Visually-hidden section heading. Repairs the h1 -> h3 jump:
                    panel card titles are h3, so the outline needs an h2 between
                    them and the hero h1. Skipped for the first panel, which
                    already contains the page h1 -- emitting an h2 there would
                    place it before the h1 in document order and invert the
                    hierarchy we are fixing. The <section> still gets its
                    accessible name from aria-label above. */}
                {i > 0 && <h2 className="sr-only">{label}</h2>}
                <Component />
              </motion.section>
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
          /* Dimming of inactive panels removed — all panels stay at full opacity */
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
