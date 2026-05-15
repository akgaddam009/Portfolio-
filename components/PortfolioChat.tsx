"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { NODES, ROOT_CHIPS, chipFor, type ChatNode, type RichOutput } from "@/lib/chatScript";

/* Scripted chat panel — zero LLM calls, all answers from lib/chatScript.ts.
   State model: path[] of nodeIds is the single source of truth.
   Messages reconstruct from path so Back / rewind are trivial.
   createPortal escapes any transformed ancestor's containing block.

   Design notes:
   — Bot bubbles use --surface2 (not --bg) so they have shape in light mode.
     In light mode --bg and --surface are identical (#fff); --surface2 is #f5f5f7.
   — "AG" monogram uses --accent-warm so the header carries brand warmth.
   — Bubble enters are directional: user from x:10 (right), bot from x:-10 (left).
   — Inner refraction shadow on the panel simulates physical edge lighting.
*/

// ─── Types ────────────────────────────────────────────────────────────────

type ChatMessage =
  | { kind: "bot"; text: string; link?: ChatNode["link"]; richOutput?: RichOutput }
  | { kind: "user"; text: string };

// ─── Constants ────────────────────────────────────────────────────────────

const TYPING_DELAY_MS = 380;
const STORAGE_KEY     = "portfolio-chat-path-v1";
const BACK_ID         = "__back__";

/** PRD §14 Q1: warmer than "Written by Arun. Not an AI." */
const DISCLOSURE = "My words. Not an AI's.";
const GREETING_TEXT = "Quick answers about Arun's work and experience. Pick a topic.";

// ─── Motion ───────────────────────────────────────────────────────────────

const EASE = [0.22, 1, 0.36, 1] as const;

/** Crisp snap: stiff enough to feel intentional, damped enough for no bounce. */
const PANEL_SPRING = { type: "spring", stiffness: 340, damping: 32 } as const;

// ─── Helpers ──────────────────────────────────────────────────────────────

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/** Reconstruct full message + chip state from a path of nodeIds. */
function buildStateFromPath(path: string[]): { messages: ChatMessage[]; chips: string[] } {
  const messages: ChatMessage[] = [{ kind: "bot", text: GREETING_TEXT }];
  let chips = ROOT_CHIPS;
  for (const nodeId of path) {
    const node = NODES[nodeId];
    if (!node) break;
    messages.push({ kind: "user", text: node.chip });
    messages.push({ kind: "bot", text: node.answer, link: node.link, richOutput: node.richOutput });
    chips = node.followups ?? ROOT_CHIPS;
  }
  return { messages, chips };
}

// ─── Shared style objects ─────────────────────────────────────────────────

const iconBtn: React.CSSProperties = {
  width: "var(--space-7)", height: "var(--space-7)",
  borderRadius: "8px",
  border: "none",
  background: "transparent",
  color: "var(--muted)",
  cursor: "pointer",
  display: "flex", alignItems: "center", justifyContent: "center",
  transition: "background 0.15s, color 0.15s",
};

const linkBtnStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "var(--space-2)",
  minHeight: "var(--space-8)",
  padding: "var(--space-2) var(--space-3)",
  borderRadius: "999px",
  background: "var(--text)",
  color: "var(--surface)",
  fontFamily: "var(--font-body)", fontSize: "11px",
  fontWeight: 600,
  letterSpacing: "0.02em",
  textDecoration: "none",
};

const crumbBtn: React.CSSProperties = {
  fontFamily: "var(--font-body)", fontSize: "11px",
  fontWeight: 400,
  background: "none", border: "none",
  color: "var(--muted)",
  cursor: "pointer", padding: 0,
  transition: "color 0.15s",
};

// ─── Component ────────────────────────────────────────────────────────────

export default function PortfolioChat() {
  const [open, setOpen]         = useState(false);
  const [portalReady, setReady] = useState(false);
  const [path, setPath]         = useState<string[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([{ kind: "bot", text: GREETING_TEXT }]);
  const [chips, setChips]       = useState<string[]>(ROOT_CHIPS);
  const [isTyping, setTyping]   = useState(false);
  const [liveText, setLiveText] = useState("");

  const scrollRef   = useRef<HTMLDivElement>(null);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const chipRowRef  = useRef<HTMLDivElement>(null);

  useEffect(() => { setReady(true); }, []);

  // Restore from sessionStorage on mount.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved: string[] = JSON.parse(raw);
        if (Array.isArray(saved) && saved.length > 0) {
          const restored = buildStateFromPath(saved);
          setPath(saved);
          setMessages(restored.messages);
          setChips(restored.chips);
        }
      }
    } catch { /* ignore malformed storage */ }
  }, []);

  // Persist path on every change.
  useEffect(() => {
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(path)); }
    catch { /* private-mode or storage full */ }
  }, [path]);

  // Global open trigger — dispatched by the hero "Ask me anything" CTA.
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("portfolio-chat:open", handler);
    return () => window.removeEventListener("portfolio-chat:open", handler);
  }, []);

  // Auto-scroll to latest message.
  useEffect(() => {
    if (!open || !scrollRef.current) return;
    scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping, open]);

  // Body scroll lock + ESC to close.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
  }, [open]);

  useEffect(() => () => { if (typingTimer.current) clearTimeout(typingTimer.current); }, []);

  // ── Navigation ────────────────────────────────────────────────────────

  const applyState = useCallback((newPath: string[]) => {
    if (typingTimer.current) clearTimeout(typingTimer.current);
    const { messages, chips } = buildStateFromPath(newPath);
    setPath(newPath);
    setMessages(messages);
    setChips(chips);
    setTyping(false);
  }, []);

  const handleBack  = useCallback(() => { if (path.length) applyState(path.slice(0, -1)); }, [path, applyState]);
  const handleReset = useCallback(() => applyState([]), [applyState]);
  const rewindTo    = useCallback((idx: number) => applyState(idx < 0 ? [] : path.slice(0, idx + 1)), [path, applyState]);

  // ── Chip selection ────────────────────────────────────────────────────

  const handleChip = useCallback((nodeId: string) => {
    const node = NODES[nodeId];
    if (!node) return;
    const newPath = [...path, nodeId];

    // Commit path + echo immediately; bot reply arrives after delay.
    setPath(newPath);
    setMessages(prev => [...prev, { kind: "user", text: node.chip }]);
    setChips([]);

    const delay = prefersReducedMotion() ? 0 : TYPING_DELAY_MS;
    if (delay === 0) {
      setMessages(prev => [...prev, { kind: "bot", text: node.answer, link: node.link, richOutput: node.richOutput }]);
      setChips(node.followups ?? ROOT_CHIPS);
      setLiveText(node.answer);
      return;
    }
    setTyping(true);
    if (typingTimer.current) clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, { kind: "bot", text: node.answer, link: node.link, richOutput: node.richOutput }]);
      setChips(node.followups ?? ROOT_CHIPS);
      setLiveText(node.answer);
    }, delay);
  }, [path]);

  // Arrow-key navigation within the chip row.
  const handleChipKeyDown = useCallback((e: React.KeyboardEvent<HTMLButtonElement>, idx: number) => {
    const btns = chipRowRef.current?.querySelectorAll<HTMLButtonElement>("button");
    if (!btns) return;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); btns[Math.min(idx + 1, btns.length - 1)]?.focus(); }
    if (e.key === "ArrowLeft"  || e.key === "ArrowUp")   { e.preventDefault(); btns[Math.max(idx - 1, 0)]?.focus(); }
  }, []);

  // Hide chips (including Back) while typing indicator is active.
  const visibleChips = isTyping ? [] : path.length > 0 ? [BACK_ID, ...chips] : chips;

  // ── Render ────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Trigger pill in the nav ─────────────────────────────────── */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Chat about Arun's work"
        title="Chat about Arun's work"
        style={{
          height: "var(--space-8)",
          padding: "0 var(--space-4)",
          borderRadius: "12px",
          border: "none",
          background: "var(--surface)",
          boxShadow: "var(--card-shadow)",
          display: "inline-flex", alignItems: "center", gap: "var(--space-2)",
          fontFamily: "var(--font-logo)", fontSize: "12px", fontWeight: 500,
          color: "var(--text)", letterSpacing: "0.06em", textTransform: "uppercase",
          cursor: "pointer", userSelect: "none",
          transition: "box-shadow 0.25s cubic-bezier(0.22,1,0.36,1)",
        }}
        onMouseEnter={e => { e.currentTarget.style.boxShadow = "var(--card-shadow-hover)"; }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = "var(--card-shadow)"; }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
        <span className="chat-trigger-label">Chat</span>
      </button>

      {/* ── Screen-reader live region ───────────────────────────────── */}
      <div
        role="status" aria-live="polite" aria-atomic="true"
        style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap", pointerEvents: "none" }}
      >{liveText}</div>

      {/* ── Portal ─────────────────────────────────────────────────── */}
      {portalReady && createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              key="chat-backdrop"
              role="dialog" aria-modal="true" aria-labelledby="chat-title"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
              style={{
                position: "fixed", inset: 0, zIndex: 1000,
                background: "rgba(0,0,0,0.45)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                display: "flex", alignItems: "flex-end", justifyContent: "flex-end",
                padding: "var(--space-4)",
                paddingTop: "max(var(--space-4), env(safe-area-inset-top))",
                paddingBottom: "max(var(--space-4), env(safe-area-inset-bottom))",
              }}
            >
              <motion.div
                key="chat-panel"
                initial={{ opacity: 0, y: 32, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 32, scale: 0.96 }}
                transition={PANEL_SPRING}
                style={{
                  width: "min(420px, 100%)",
                  maxHeight: "min(720px, calc(100dvh - 32px))",
                  background: "var(--surface)",
                  borderRadius: "24px",
                  /* Outer depth + inner refraction edge (top highlight simulates
                     light catching the physical top edge of the panel). */
                  boxShadow: [
                    "0 32px 72px rgba(0,0,0,0.28)",
                    "0 4px 16px rgba(0,0,0,0.12)",
                    "inset 0 1px 0 rgba(255,255,255,0.14)",
                  ].join(", "),
                  display: "flex", flexDirection: "column", overflow: "hidden",
                  border: "1px solid var(--border)",
                }}
              >

                {/* ── Header ─────────────────────────────────────── */}
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "var(--space-3) var(--space-5)",
                  borderBottom: path.length > 0 ? "none" : "1px solid var(--border)",
                  flexShrink: 0,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                    {/* Monogram — accent-warm gives the header brand warmth and
                        prevents the flat-black-square read. */}
                    <div style={{
                      width: "var(--space-7)", height: "var(--space-7)", borderRadius: "10px",
                      background: "var(--accent-warm)",
                      color: "#fff",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "var(--font-logo)", fontSize: "11px", fontWeight: 700,
                      letterSpacing: "0.08em", flexShrink: 0,
                    }}>AG</div>
                    <div>
                      <div id="chat-title" style={{
                        fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 600,
                        color: "var(--text)", lineHeight: "16px",
                      }}>Chat with Arun</div>
                      <div style={{
                        fontFamily: "var(--font-body)", fontSize: "11px",
                        color: "var(--muted)", lineHeight: "14px", marginTop: "2px",
                      }}>{DISCLOSURE}</div>
                    </div>
                  </div>
                  <motion.button
                    onClick={() => setOpen(false)}
                    aria-label="Close chat"
                    whileTap={{ scale: 0.92 }}
                    style={iconBtn}
                    onMouseEnter={e => { e.currentTarget.style.background = "var(--surface2)"; e.currentTarget.style.color = "var(--text)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--muted)"; }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </motion.button>
                </div>

                {/* ── Breadcrumb strip ────────────────────────────
                    Slides in once the visitor has navigated.
                    Left: ↺ Start over. Right: Home › node › node. */}
                <AnimatePresence>
                  {path.length > 0 && (
                    <motion.div
                      key="breadcrumb"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: EASE }}
                      style={{ overflow: "hidden", flexShrink: 0 }}
                    >
                      <div style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "var(--space-2) var(--space-5)",
                        borderBottom: "1px solid var(--border)",
                        gap: "var(--space-3)",
                      }}>
                        <button
                          onClick={handleReset}
                          aria-label="Start over"
                          style={{
                            fontFamily: "var(--font-body)", fontSize: "11px",
                            color: "var(--muted)", background: "none", border: "none",
                            cursor: "pointer", padding: "2px 0", flexShrink: 0,
                            display: "inline-flex", alignItems: "center", gap: "4px",
                            transition: "color 0.15s",
                          }}
                          onMouseEnter={e => { e.currentTarget.style.color = "var(--text)"; }}
                          onMouseLeave={e => { e.currentTarget.style.color = "var(--muted)"; }}
                        >
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                            <path d="M3 3v5h5" />
                          </svg>
                          Start over
                        </button>

                        <div style={{ display: "flex", alignItems: "center", gap: "3px", overflow: "hidden", flex: 1, justifyContent: "flex-end", minWidth: 0 }}>
                          <button
                            onClick={() => rewindTo(-1)}
                            style={crumbBtn}
                            onMouseEnter={e => { e.currentTarget.style.color = "var(--text)"; }}
                            onMouseLeave={e => { e.currentTarget.style.color = "var(--muted)"; }}
                          >Home</button>
                          {path.map((nodeId, i) => {
                            const label = NODES[nodeId]?.chip ?? nodeId;
                            const truncated = label.length > 18 ? label.slice(0, 17) + "…" : label;
                            const isCurrent = i === path.length - 1;
                            return (
                              <span key={nodeId} style={{ display: "inline-flex", alignItems: "center", gap: "3px", minWidth: 0, overflow: "hidden" }}>
                                <span style={{ color: "var(--border)", fontSize: "11px", flexShrink: 0, userSelect: "none" }}>›</span>
                                <button
                                  onClick={() => !isCurrent && rewindTo(i)}
                                  disabled={isCurrent}
                                  title={label}
                                  style={{
                                    ...crumbBtn,
                                    fontWeight: isCurrent ? 600 : 400,
                                    color: isCurrent ? "var(--text)" : "var(--muted)",
                                    cursor: isCurrent ? "default" : "pointer",
                                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                                    maxWidth: "110px",
                                  }}
                                  onMouseEnter={e => { if (!isCurrent) e.currentTarget.style.color = "var(--text)"; }}
                                  onMouseLeave={e => { if (!isCurrent) e.currentTarget.style.color = "var(--muted)"; }}
                                >{truncated}</button>
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* ── Messages ────────────────────────────────────
                    Past exchanges mute to 45% — greeting stays full.
                    Bubbles enter directionally: user from right (x:10),
                    bot from left (x:-10). Matches visual alignment. */}
                <div
                  ref={scrollRef}
                  style={{
                    flex: 1, overflowY: "auto",
                    padding: "var(--space-4) var(--space-5)",
                    display: "flex", flexDirection: "column", gap: "var(--space-3)",
                  }}
                >
                  {messages.map((m, i) => {
                    const isMuted = i !== 0 && i < messages.length - 2;
                    return <Bubble key={i} msg={m} isMuted={isMuted} onClose={() => setOpen(false)} />;
                  })}
                  {isTyping && <TypingDots />}
                </div>

                {/* ── Chips ───────────────────────────────────────
                    Back (← Back) prepended when path.length > 0.
                    Touch targets: 36px min-height (compromise between
                    chat-UI density and WCAG 2.5.8's 24px minimum).
                    Arrow keys cycle focus within the row. */}
                <div style={{
                  padding: "var(--space-3) var(--space-5)",
                  borderTop: "1px solid var(--border)",
                  background: "var(--surface)",
                  minHeight: "76px", flexShrink: 0,
                }}>
                  <div style={{
                    fontFamily: "var(--font-body)", fontSize: "10px",
                    color: "var(--muted)", textTransform: "uppercase",
                    letterSpacing: "0.08em", marginBottom: "var(--space-2)",
                  }}>Pick one</div>
                  <div ref={chipRowRef} style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)", minHeight: "36px" }}>
                    <AnimatePresence mode="popLayout" initial={false}>
                      {visibleChips.map((id, i) => {
                        const isBack = id === BACK_ID;
                        return (
                          <motion.button
                            key={id}
                            layout
                            initial={{ opacity: 0, y: 6, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -4, scale: 0.95 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.18, delay: i * 0.03, ease: EASE }}
                            onClick={() => isBack ? handleBack() : handleChip(id)}
                            onKeyDown={(e) => handleChipKeyDown(e, i)}
                            style={{
                              minHeight: "36px",
                              padding: "var(--space-2) var(--space-3)",
                              borderRadius: "999px",
                              border: "1px solid var(--border)",
                              background: isBack ? "transparent" : "var(--bg)",
                              color: isBack ? "var(--muted)" : "var(--text)",
                              fontFamily: "var(--font-body)", fontSize: "12px",
                              fontWeight: isBack ? 400 : 500,
                              cursor: "pointer",
                              display: "inline-flex", alignItems: "center", gap: "4px",
                              transition: "background 0.15s, border-color 0.15s, color 0.15s",
                            }}
                            onMouseEnter={e => {
                              e.currentTarget.style.background = "var(--surface2)";
                              e.currentTarget.style.borderColor = isBack ? "var(--muted)" : "var(--text)";
                              if (isBack) e.currentTarget.style.color = "var(--text)";
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.background = isBack ? "transparent" : "var(--bg)";
                              e.currentTarget.style.borderColor = "var(--border)";
                              if (isBack) e.currentTarget.style.color = "var(--muted)";
                            }}
                          >
                            {isBack && (
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                              </svg>
                            )}
                            {isBack ? "Back" : chipFor(id)}
                          </motion.button>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </div>

                {/* ── Footer — persistent contact shortcuts ────── */}
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  gap: "var(--space-3)",
                  padding: "var(--space-3) var(--space-5) var(--space-4)",
                  borderTop: "1px solid var(--border)",
                  background: "var(--surface)", flexShrink: 0,
                }}>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--muted)" }}>
                    Skip the chat?
                  </span>
                  <div style={{ display: "flex", gap: "var(--space-2)" }}>
                    {[
                      { label: "Email", href: "mailto:akgaddam02@gmail.com", external: false },
                      { label: "LinkedIn", href: "https://linkedin.com/in/akgaddam/", external: true },
                    ].map(({ label, href, external }) => (
                      <a
                        key={label}
                        href={href}
                        {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                        style={{
                          minHeight: "var(--space-8)",
                          display: "inline-flex", alignItems: "center",
                          padding: "var(--space-2) var(--space-3)",
                          borderRadius: "999px",
                          border: "1px solid var(--border)",
                          background: "var(--bg)",
                          color: "var(--text)",
                          fontFamily: "var(--font-body)", fontSize: "11px",
                          fontWeight: 600, letterSpacing: "0.02em",
                          textDecoration: "none",
                          transition: "background 0.15s, border-color 0.15s, box-shadow 0.15s",
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = "var(--surface2)";
                          e.currentTarget.style.borderColor = "var(--text)";
                          e.currentTarget.style.boxShadow = "var(--card-shadow)";
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = "var(--bg)";
                          e.currentTarget.style.borderColor = "var(--border)";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      >{label}</a>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}

// ─── TypingDots ───────────────────────────────────────────────────────────

function TypingDots() {
  return (
    <div
      aria-label="Typing"
      style={{
        alignSelf: "flex-start",
        padding: "var(--space-3) var(--space-4)",
        borderRadius: "16px 16px 16px 4px",
        /* Match bot bubble surface so the dots feel cohesive. */
        background: "var(--surface2)",
        border: "1px solid var(--border)",
        display: "inline-flex", gap: "var(--space-1)",
        width: "fit-content",
      }}
    >
      {[0, 1, 2].map(i => (
        <motion.span
          key={i}
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
          transition={{ duration: 0.85, repeat: Infinity, delay: i * 0.14, ease: "easeInOut" }}
          style={{ width: "5px", height: "5px", borderRadius: "999px", background: "var(--muted)", display: "inline-block" }}
        />
      ))}
    </div>
  );
}

// ─── Rich output renderers ─────────────────────────────────────────────────

/** Two-column key/value table. Used for availability summary. */
function FactGrid({ facts }: { facts: { label: string; value: string }[] }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "auto 1fr",
      rowGap: "6px",
      columnGap: "var(--space-4)",
      background: "var(--surface2)",
      border: "1px solid var(--border)",
      borderRadius: "12px",
      padding: "var(--space-3) var(--space-4)",
      maxWidth: "92%",
    }}>
      {facts.map(({ label, value }) => (
        <React.Fragment key={label}>
          <span style={{
            fontFamily: "var(--font-body)", fontSize: "11px",
            color: "var(--muted)", whiteSpace: "nowrap",
            lineHeight: "18px",
          }}>{label}</span>
          <span style={{
            fontFamily: "var(--font-body)", fontSize: "11px",
            color: "var(--text)", fontWeight: 500,
            lineHeight: "18px",
          }}>{value}</span>
        </React.Fragment>
      ))}
    </div>
  );
}

/** 2×2 mini-card grid linking directly to case study pages. */
function WorkCards({ cards, onClose }: { cards: { label: string; meta: string; href: string }[]; onClose: () => void }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "var(--space-2)",
      maxWidth: "92%",
    }}>
      {cards.map(card => (
        <Link
          key={card.href}
          href={card.href}
          onClick={onClose}
          style={{
            padding: "var(--space-3) var(--space-3)",
            borderRadius: "10px",
            border: "1px solid var(--border)",
            background: "var(--surface2)",
            textDecoration: "none",
            display: "flex", flexDirection: "column", gap: "2px",
            transition: "border-color 0.15s, background 0.15s",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = "var(--text)";
            e.currentTarget.style.background = "var(--bg)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.background = "var(--surface2)";
          }}
        >
          <span style={{
            fontFamily: "var(--font-body)", fontSize: "12px",
            fontWeight: 600, color: "var(--text)", lineHeight: "16px",
          }}>{card.label}</span>
          <span style={{
            fontFamily: "var(--font-body)", fontSize: "10px",
            color: "var(--muted)", lineHeight: "14px",
          }}>{card.meta}</span>
        </Link>
      ))}
    </div>
  );
}

/** Dispatches to the correct rich output renderer. */
function RichOutputBlock({ output, onClose }: { output: RichOutput; onClose: () => void }) {
  if (output.type === "fact-grid") return <FactGrid facts={output.facts} />;
  if (output.type === "work-cards") return <WorkCards cards={output.cards} onClose={onClose} />;
  return null;
}

// ─── Bubble ───────────────────────────────────────────────────────────────

function Bubble({ msg, isMuted, onClose }: { msg: ChatMessage; isMuted: boolean; onClose: () => void }) {
  if (msg.kind === "user") {
    return (
      <motion.div
        initial={{ opacity: 0, x: 10, y: 4 }}
        animate={{ opacity: isMuted ? 0.45 : 1, x: 0, y: 0 }}
        transition={{ duration: 0.2, ease: EASE }}
        style={{ display: "flex", justifyContent: "flex-end" }}
      >
        <div style={{
          maxWidth: "82%",
          padding: "var(--space-2) var(--space-4)",
          borderRadius: "16px 16px 4px 16px",
          /* User bubble: always fully inverted — readable in both themes. */
          background: "var(--text)", color: "var(--surface)",
          fontFamily: "var(--font-body)", fontSize: "13px",
          lineHeight: "19px", fontWeight: 500,
        }}>{msg.text}</div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -10, y: 4 }}
      animate={{ opacity: isMuted ? 0.45 : 1, x: 0, y: 0 }}
      transition={{ duration: 0.22, ease: EASE }}
      style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "var(--space-2)" }}
    >
      {/* Bot bubble: --surface2 gives shape in light mode (#f5f5f7 vs panel #fff).
          In dark mode: #242424 vs panel #1c1c1c — equally readable.
          A 1px border reinforces the edge in both themes. */}
      <div style={{
        maxWidth: "92%",
        padding: "var(--space-3) var(--space-4)",
        borderRadius: "4px 16px 16px 16px",
        background: "var(--surface2)",
        border: "1px solid var(--border)",
        color: "var(--text)",
        fontFamily: "var(--font-body)", fontSize: "13px",
        lineHeight: "20px", whiteSpace: "pre-wrap",
      }}>{msg.text}</div>

      {/* Rich output — rendered between text and link CTA. */}
      {msg.richOutput && <RichOutputBlock output={msg.richOutput} onClose={onClose} />}

      {msg.link && (
        msg.link.external ? (
          <a href={msg.link.href} target="_blank" rel="noreferrer" style={linkBtnStyle}>
            {msg.link.label}
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M7 17L17 7M9 7h8v8" />
            </svg>
          </a>
        ) : (
          <Link href={msg.link.href} onClick={onClose} style={linkBtnStyle}>
            {msg.link.label}
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </Link>
        )
      )}
    </motion.div>
  );
}
