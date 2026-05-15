"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  NODES, SECTION_CHIPS, isSectionId, chipFor,
  DISCLOSURE,
  type ChatNode, type RichOutput,
} from "@/lib/chatScript";

/* Click-and-pick portfolio explorer.
   Not a chat — no message history, no typing dots. One view at a time.
   Pick a section, see content, pick a sub-option, see new content.
   Same scripted tree as before (NODES from chatScript.ts); different model.
   createPortal escapes any transformed ancestor's containing block. */

// ─── Constants ────────────────────────────────────────────────────────────

const STORAGE_KEY = "portfolio-guide-path-v1";

// ─── Motion ───────────────────────────────────────────────────────────────

const EASE = [0.22, 1, 0.36, 1] as const;
const PANEL_SPRING = { type: "spring", stiffness: 340, damping: 32 } as const;

// ─── Helpers ──────────────────────────────────────────────────────────────

function parseChatParam(): string[] {
  if (typeof window === "undefined") return [];
  const url = new URL(window.location.href);
  const raw = url.searchParams.get("chat");
  if (!raw) return [];
  return raw.split(".").filter(id => id.length > 0 && id in NODES);
}

function writeChatParam(path: string[]): void {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  if (path.length === 0) url.searchParams.delete("chat");
  else url.searchParams.set("chat", path.join("."));
  window.history.replaceState({}, "", url.toString());
}

// ─── Shared style ────────────────────────────────────────────────────────

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
  display: "inline-flex", alignItems: "center", gap: "var(--space-2)",
  minHeight: "var(--space-8)",
  padding: "var(--space-2) var(--space-3)",
  borderRadius: "999px",
  background: "var(--text)",
  color: "var(--surface)",
  fontFamily: "var(--font-body)", fontSize: "11px",
  fontWeight: 600, letterSpacing: "0.02em",
  textDecoration: "none",
};

// ─── Component ────────────────────────────────────────────────────────────

export default function PortfolioChat() {
  const [open, setOpen]         = useState(false);
  const [portalReady, setReady] = useState(false);
  const [path, setPath]         = useState<string[]>([]);

  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setReady(true); }, []);

  // Restore on mount: URL > sessionStorage.
  useEffect(() => {
    const urlPath = parseChatParam();
    if (urlPath.length > 0) {
      setPath(urlPath); setOpen(true);
      return;
    }
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (Array.isArray(saved?.path)) {
          setPath(saved.path.filter((id: string) => id in NODES));
        }
      }
    } catch { /* ignore */ }
  }, []);

  // Persist + URL. URL only mirrors path while the chat is OPEN; on close
  // the param is cleared so reloads don't re-auto-open the chat.
  useEffect(() => {
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ path })); } catch { /* ignore */ }
    writeChatParam(open ? path : []);
  }, [path, open]);

  // Global open trigger.
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("portfolio-chat:open", handler);
    return () => window.removeEventListener("portfolio-chat:open", handler);
  }, []);

  // Scroll body to top on view change.
  useEffect(() => {
    if (!open || !bodyRef.current) return;
    bodyRef.current.scrollTo({ top: 0, behavior: "smooth" });
  }, [path, open]);

  // Body scroll lock + ESC.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && e.shiftKey) { e.preventDefault(); setPath([]); }
      else if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
  }, [open]);

  // ── Navigation ────────────────────────────────────────────────────────

  const pickOption = useCallback((nodeId: string) => {
    if (!(nodeId in NODES)) return;
    setPath(prev => isSectionId(nodeId) ? [nodeId] : [...prev, nodeId]);
  }, []);

  const goBack  = useCallback(() => setPath(prev => prev.slice(0, -1)), []);
  const goHome  = useCallback(() => setPath([]), []);

  const currentNode: ChatNode | null = path.length === 0 ? null : NODES[path[path.length - 1]] ?? null;
  const sectionId = path[0];
  const sectionLabel = sectionId ? chipFor(sectionId) : null;
  const isInSection = path.length === 1;
  const isDeep      = path.length > 1;

  // ── Render ────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Trigger pill ──────────────────────────────────────────────── */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open quick guide to Arun's work"
        title="Open quick guide to Arun's work"
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
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="18" x2="14" y2="18" />
        </svg>
        <span className="chat-trigger-label">Quick guide</span>
      </button>

      {/* ── Portal ────────────────────────────────────────────────────── */}
      {portalReady && createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              key="guide-backdrop"
              role="dialog" aria-modal="true" aria-labelledby="guide-title"
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
                key="guide-panel"
                initial={{ opacity: 0, y: 32, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 32, scale: 0.96 }}
                transition={PANEL_SPRING}
                style={{
                  width: "min(440px, 100%)",
                  maxHeight: "min(720px, calc(100dvh - 32px))",
                  background: "var(--surface)",
                  borderRadius: "24px",
                  boxShadow: [
                    "0 32px 72px rgba(0,0,0,0.28)",
                    "0 4px 16px rgba(0,0,0,0.12)",
                    "inset 0 1px 0 rgba(255,255,255,0.14)",
                  ].join(", "),
                  display: "flex", flexDirection: "column", overflow: "hidden",
                  border: "1px solid var(--border)",
                }}
              >
                {/* ── Header ─────────────────────────────────────────── */}
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "var(--space-3) var(--space-5)",
                  borderBottom: "1px solid var(--border)",
                  flexShrink: 0,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                    <div style={{
                      width: "var(--space-7)", height: "var(--space-7)", borderRadius: "10px",
                      background: "var(--accent-warm)",
                      color: "#fff",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "var(--font-logo)", fontSize: "11px", fontWeight: 700,
                      letterSpacing: "0.08em", flexShrink: 0,
                    }}>AG</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
                      <div id="guide-title" style={{
                        fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 600,
                        color: "var(--text)", lineHeight: "16px",
                      }}>Arun&rsquo;s portfolio</div>
                      <div style={{
                        fontFamily: "var(--font-body)", fontSize: "10px",
                        color: "var(--muted)", lineHeight: "12px",
                      }}>{DISCLOSURE}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-1)" }}>
                    {path.length > 0 && (
                      <button
                        onClick={goHome}
                        aria-label="Back to topics"
                        title="Back to topics"
                        style={iconBtn}
                        onMouseEnter={e => { e.currentTarget.style.background = "var(--surface2)"; e.currentTarget.style.color = "var(--text)"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--muted)"; }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                          <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                      </button>
                    )}
                    <motion.button
                      onClick={() => setOpen(false)}
                      aria-label="Close"
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
                </div>

                {/* ── Breadcrumb (only when inside a node) ──────────── */}
                {path.length > 0 && (
                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "var(--space-2) var(--space-5)",
                    borderBottom: "1px solid var(--border)",
                    background: "var(--surface2)",
                    flexShrink: 0,
                  }}>
                    <button
                      onClick={isDeep ? goBack : goHome}
                      style={{
                        display: "inline-flex", alignItems: "center", gap: "4px",
                        background: "none", border: "none",
                        color: "var(--muted)", cursor: "pointer", padding: "2px 0",
                        fontFamily: "var(--font-body)", fontSize: "11px",
                        transition: "color 0.15s",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.color = "var(--text)"; }}
                      onMouseLeave={e => { e.currentTarget.style.color = "var(--muted)"; }}
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                      </svg>
                      Back
                    </button>
                    <div style={{
                      fontFamily: "var(--font-body)", fontSize: "10px",
                      color: "var(--muted)", textTransform: "uppercase",
                      letterSpacing: "0.08em", textAlign: "right",
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                      maxWidth: "60%",
                    }}>
                      {isInSection ? sectionLabel : `${sectionLabel} · ${currentNode?.chip}`}
                    </div>
                  </div>
                )}

                {/* ── Body ──────────────────────────────────────────── */}
                <div
                  ref={bodyRef}
                  style={{
                    flex: 1, overflowY: "auto",
                    padding: "var(--space-4) var(--space-5)",
                  }}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {path.length === 0 ? (
                      <HomeView key="home" onPick={pickOption} />
                    ) : currentNode ? (
                      <NodeView
                        key={path.join(".")}
                        node={currentNode}
                        onPick={pickOption}
                        onClose={() => setOpen(false)}
                      />
                    ) : null}
                  </AnimatePresence>
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

// ─── Home view ───────────────────────────────────────────────────────────

function HomeView({ onPick }: { onPick: (id: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.2, ease: EASE }}
    >
      <div style={{
        fontFamily: "var(--font-body)", fontSize: "10px",
        color: "var(--muted)", textTransform: "uppercase",
        letterSpacing: "0.08em", marginBottom: "var(--space-3)",
      }}>Pick a topic</div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
        {SECTION_CHIPS.map((id, i) => (
          <motion.button
            key={id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: i * 0.04, ease: EASE }}
            onClick={() => onPick(id)}
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "var(--space-3) var(--space-4)",
              borderRadius: "12px",
              border: "1px solid var(--border)",
              background: "var(--surface)",
              cursor: "pointer",
              textAlign: "left",
              transition: "background 0.15s, border-color 0.15s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "var(--surface2)";
              e.currentTarget.style.borderColor = "var(--text)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "var(--surface)";
              e.currentTarget.style.borderColor = "var(--border)";
            }}
          >
            <span style={{
              fontFamily: "var(--font-body)", fontSize: "13px",
              fontWeight: 500, color: "var(--text)",
            }}>{chipFor(id)}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ color: "var(--muted)", flexShrink: 0 }}>
              <path d="M9 18l6-6-6-6" />
            </svg>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Node view ───────────────────────────────────────────────────────────

function NodeView({
  node, onPick, onClose,
}: {
  node: ChatNode;
  onPick: (id: string) => void;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.2, ease: EASE }}
    >
      {/* Heading */}
      <h2 style={{
        fontFamily: "var(--font-body)", fontSize: "18px", fontWeight: 600,
        color: "var(--text)", lineHeight: "24px",
        margin: 0, marginBottom: "var(--space-3)",
        letterSpacing: "-0.01em",
      }}>{node.chip}</h2>

      {/* Body text */}
      <div style={{
        fontFamily: "var(--font-body)", fontSize: "14px",
        color: "var(--muted2, var(--text))", lineHeight: "22px",
        whiteSpace: "pre-wrap",
      }}>{node.answer}</div>

      {/* Rich output */}
      {node.richOutput && (
        <div style={{ marginTop: "var(--space-4)" }}>
          <RichOutputBlock output={node.richOutput} onClose={onClose} />
        </div>
      )}

      {/* Link CTA */}
      {node.link && (
        <div style={{ marginTop: "var(--space-4)" }}>
          {node.link.external ? (
            <a href={node.link.href} target="_blank" rel="noreferrer" style={linkBtnStyle}>
              {node.link.label}
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M7 17L17 7M9 7h8v8" />
              </svg>
            </a>
          ) : (
            <Link href={node.link.href} onClick={onClose} style={linkBtnStyle}>
              {node.link.label}
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M7 17L17 7M9 7h8v8" />
              </svg>
            </Link>
          )}
        </div>
      )}

      {/* Followup options */}
      {node.followups && node.followups.length > 0 && (
        <div style={{ marginTop: "var(--space-5)" }}>
          <div style={{
            fontFamily: "var(--font-body)", fontSize: "10px",
            color: "var(--muted)", textTransform: "uppercase",
            letterSpacing: "0.08em", marginBottom: "var(--space-2)",
          }}>Go deeper</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
            {node.followups.map((id, i) => (
              <motion.button
                key={id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18, delay: i * 0.03, ease: EASE }}
                onClick={() => onPick(id)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "var(--space-2) var(--space-3)",
                  borderRadius: "10px",
                  border: "1px solid var(--border)",
                  background: "var(--surface)",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "background 0.15s, border-color 0.15s",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "var(--surface2)";
                  e.currentTarget.style.borderColor = "var(--text)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "var(--surface)";
                  e.currentTarget.style.borderColor = "var(--border)";
                }}
              >
                <span style={{
                  fontFamily: "var(--font-body)", fontSize: "12px",
                  fontWeight: 500, color: "var(--text)",
                }}>{chipFor(id)}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ color: "var(--muted)", flexShrink: 0 }}>
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ─── Rich output renderers ─────────────────────────────────────────────────

function FactGrid({ facts }: { facts: { label: string; value: string }[] }) {
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "auto 1fr",
      rowGap: "6px", columnGap: "var(--space-4)",
      background: "var(--surface2)",
      border: "1px solid var(--border)",
      borderRadius: "12px",
      padding: "var(--space-3) var(--space-4)",
    }}>
      {facts.map(({ label, value }) => (
        <React.Fragment key={label}>
          <span style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--muted)", whiteSpace: "nowrap", lineHeight: "18px" }}>{label}</span>
          <span style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--text)", fontWeight: 500, lineHeight: "18px" }}>{value}</span>
        </React.Fragment>
      ))}
    </div>
  );
}

function WorkCards({ cards, onClose }: { cards: { label: string; meta: string; href: string }[]; onClose: () => void }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-2)" }}>
      {cards.map(card => (
        <Link
          key={card.href}
          href={card.href}
          onClick={onClose}
          style={{
            padding: "var(--space-3)",
            borderRadius: "10px",
            border: "1px solid var(--border)",
            background: "var(--surface2)",
            textDecoration: "none",
            display: "flex", flexDirection: "column", gap: "2px",
            transition: "border-color 0.15s, background 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--text)"; e.currentTarget.style.background = "var(--bg)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "var(--surface2)"; }}
        >
          <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 600, color: "var(--text)", lineHeight: "16px" }}>{card.label}</span>
          <span style={{ fontFamily: "var(--font-body)", fontSize: "10px", color: "var(--muted)", lineHeight: "14px" }}>{card.meta}</span>
        </Link>
      ))}
    </div>
  );
}

function TagCloud({ tags }: { tags: string[] }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-1)" }}>
      {tags.map(tag => (
        <span key={tag} style={{
          fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 500,
          color: "var(--text)",
          padding: "3px var(--space-3)",
          borderRadius: "999px",
          border: "1px solid var(--border)",
          background: "var(--surface2)",
          lineHeight: "18px", whiteSpace: "nowrap",
        }}>{tag}</span>
      ))}
    </div>
  );
}

function MiniTimeline({ milestones }: { milestones: { period: string; role: string; company: string }[] }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", gap: "1px",
      background: "var(--surface2)",
      border: "1px solid var(--border)",
      borderRadius: "12px",
      overflow: "hidden",
    }}>
      {milestones.map((m, i) => (
        <div key={i} style={{
          display: "grid", gridTemplateColumns: "64px 1fr",
          gap: "var(--space-3)",
          padding: "var(--space-2) var(--space-4)",
          borderBottom: i < milestones.length - 1 ? "1px solid var(--border)" : "none",
          background: "var(--surface2)",
        }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--muted)", lineHeight: "18px", whiteSpace: "nowrap" }}>{m.period}</span>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 600, color: "var(--text)", lineHeight: "16px" }}>{m.role}</div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: "10px", color: "var(--muted)", lineHeight: "14px" }}>{m.company}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function QuoteCards({ quotes }: { quotes: { quote: string; name: string; role: string; company: string }[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
      {quotes.map(q => (
        <div key={q.name} style={{
          padding: "var(--space-3) var(--space-4)",
          borderRadius: "12px",
          background: "var(--surface2)",
          border: "1px solid var(--border)",
        }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", fontStyle: "italic", color: "var(--text)", lineHeight: "18px", margin: 0, marginBottom: "var(--space-2)" }}>
            &ldquo;{q.quote}&rdquo;
          </p>
          <div style={{ fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 600, color: "var(--text)", lineHeight: "14px" }}>{q.name}</div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: "10px", color: "var(--muted)", lineHeight: "14px", marginTop: "1px" }}>{q.role} · {q.company}</div>
        </div>
      ))}
    </div>
  );
}

function RichOutputBlock({ output, onClose }: { output: RichOutput; onClose: () => void }) {
  if (output.type === "fact-grid")     return <FactGrid facts={output.facts} />;
  if (output.type === "work-cards")    return <WorkCards cards={output.cards} onClose={onClose} />;
  if (output.type === "tag-cloud")     return <TagCloud tags={output.tags} />;
  if (output.type === "mini-timeline") return <MiniTimeline milestones={output.milestones} />;
  if (output.type === "quote-cards")   return <QuoteCards quotes={output.quotes} />;
  return null;
}
