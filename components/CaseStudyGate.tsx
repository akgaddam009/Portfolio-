"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { unlock } from "@/app/actions/unlock";
import VideoBlock from "@/components/ui/VideoBlock";

/* Standalone gate component for confidential case studies.

   Replaces the inline gate that previously lived inside CaseStudyDetail.
   Critical change: this component is rendered *instead* of
   CaseStudyDetail when the visitor is not unlocked, so the confidential
   case study data (problem, insight, decisions, etc.) never reaches the
   client at all — not even minified inside a hidden branch.

   Behaviour parity with the old gate:
   - Same lock-icon, headline, subtext, and form layout
   - Same global unlock (one password unlocks every gated case study)
   - Same error-state styling (border colour + mono error line)
   - Soft-reload after unlock via router.refresh() so the now-unlocked
     case study renders immediately, no manual reload required
   - Esc / browser back returns to the work index (no surprise navigation)

   What's new:
   - The unlock() server action lives in app/actions/unlock.ts. It
     compares the submitted value to process.env.CASE_STUDY_PASSWORD on
     the server, in constant time, and sets an HttpOnly cookie on
     success. Nothing about the password reaches the browser. */

const EASE = [0.22, 1, 0.36, 1] as const;

type GateProps = {
  /** Public metadata only — title, tags, etc. Never problem/insight/decisions. */
  title: string;
  tags: string[];
  heroLabel: string;
  /** Public-safe teaser text. Falls back to a generic prompt if absent. */
  teaser?: string;
  /** Public hero — either a single VideoBlock or a before/after pair,
      mirroring how the unlocked case study presents its hero. All
      sources are public assets allowlisted in proxy.ts. */
  cover?:
    | { kind: "single"; src: string; appType: string; chromeUrl?: string }
    | { kind: "pair";   before: string; after: string };
};

export default function CaseStudyGate({ title, tags, heroLabel, teaser, cover }: GateProps) {
  const router = useRouter();
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState<null | "wrong" | "rate-limited" | "config">(null);
  const [retryInSec, setRetryInSec] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPwError(null);
    setRetryInSec(null);
    const fd = new FormData();
    fd.set("password", pwInput);
    startTransition(async () => {
      const result = await unlock(fd);
      if (result.ok) {
        // Soft refresh — re-renders the page server-side, which now reads
        // the just-set cookie and returns the full content branch.
        router.refresh();
      } else {
        setPwError(result.error);
        if (result.error === "rate-limited" && result.retryInSec) {
          setRetryInSec(result.retryInSec);
        }
        setPwInput("");
      }
    });
  };

  return (
    <>
      <main id="main-content" style={{ paddingTop: "52px" }}>
        {/* Hero band */}
        <section style={{ padding: "var(--space-8) 0", borderBottom: "1px solid var(--border)" }}>
          <div className="page-pad">
            <Link
              href="/#work"
              className="cs-back-link"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-mono)",
                fontWeight: 400,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--muted)",
                padding: "8px 4px",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                marginBottom: "var(--space-8)",
                transition: "color 0.18s",
              }}
              onMouseEnter={e => { e.currentTarget.style.color = "var(--text)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "var(--muted)"; }}
            >
              {/* Material Design `arrow_back` — matches the icon used inside
                  the unlocked case study so the back affordance is consistent
                  across gate and detail. */}
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
              </svg>
              Back
            </Link>

            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
              {tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--text-mono)",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    padding: "3px 8px",
                    background: "var(--surface2)",
                    color: "var(--muted)",
                    borderRadius: "4px",
                  }}
                >
                  {tag}
                </span>
              ))}
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-mono)",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  padding: "3px 8px",
                  background: "var(--surface2)",
                  color: "var(--muted)",
                  borderRadius: "4px",
                }}
              >
                {heroLabel}
              </span>
            </div>

            <h1
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(26px, 4vw, 44px)",
                fontWeight: 300,
                lineHeight: 1.15,
                letterSpacing: "-0.03em",
                color: "var(--text)",
                marginBottom: "16px",
              }}
            >
              {title}
            </h1>
          </div>
        </section>

        {/* Public hero — single VideoBlock OR a before/after pair,
            matching the same pattern the unlocked case study uses. */}
        {cover && (
          <section style={{ padding: "var(--space-8) 0 0" }}>
            <div className="page-pad">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: EASE, delay: 0.05 }}
                style={{ maxWidth: "1120px", margin: "0 auto" }}
              >
                {cover.kind === "single" ? (
                  <VideoBlock src={cover.src} appType={cover.appType} chromeUrl={cover.chromeUrl} />
                ) : (
                  // Before / After pair — mirrors outcomesCompare from CaseStudyDetail
                  <div className="cs-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    {([
                      { label: "Before", src: cover.before },
                      { label: "After",  src: cover.after  },
                    ] as const).map(({ label, src }) => (
                      <div key={label} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-eyebrow)", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)" }}>{label}</span>
                        <div style={{ borderRadius: "16px", overflow: "hidden", background: "var(--surface2)", border: "1px solid var(--border)" }}>
                          <video
                            src={src}
                            autoPlay loop muted playsInline preload="auto"
                            style={{ width: "100%", display: "block" }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>
          </section>
        )}

        {/* Gate card */}
        <div style={{ padding: "var(--space-10) 0 120px" }}>
          <div className="page-pad">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: EASE }}
              style={{
                borderRadius: "20px",
                padding: "52px 44px 44px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: "0",
                background: "var(--surface)",
                border: "1px solid var(--border)",
                boxShadow: "0 2px 4px rgba(0,0,0,0.04), 0 16px 48px rgba(0,0,0,0.08)",
                maxWidth: "480px",
                margin: "0 auto",
              }}
            >
              {/* Lock icon in a circle */}
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  background: "var(--surface2)",
                  border: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "24px",
                  flexShrink: 0,
                }}
              >
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ color: "var(--muted2)" }}
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>

              {/* Eyebrow */}
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-eyebrow)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                  marginBottom: "10px",
                }}
              >
                Confidential
              </p>

              {/* Heading */}
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-title-lg)",
                  fontWeight: 500,
                  letterSpacing: "-0.025em",
                  color: "var(--text)",
                  marginBottom: "10px",
                  lineHeight: 1.25,
                }}
              >
                This case study is password protected
              </p>

              {/* Subtext */}
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-body)",
                  color: "var(--muted)",
                  lineHeight: 1.65,
                  maxWidth: "340px",
                  marginBottom: "32px",
                }}
              >
                {teaser ?? "Much of my work is under NDA. Reach out and I'll share the password."}
              </p>

              {/* Form — stacked layout */}
              <form
                onSubmit={handleSubmit}
                aria-label="Unlock this case study"
                style={{ width: "100%", maxWidth: "320px" }}
              >
                <label htmlFor="cs-gate-password" className="sr-only">
                  Password
                </label>
                <input
                  id="cs-gate-password"
                  type="password"
                  name="password"
                  value={pwInput}
                  onChange={(e) => {
                    setPwInput(e.target.value);
                    setPwError(null);
                  }}
                  placeholder="Enter password"
                  autoComplete="off"
                  disabled={isPending}
                  aria-invalid={pwError !== null}
                  aria-describedby={pwError ? "cs-gate-error" : undefined}
                  style={{
                    width: "100%",
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--text-body-lg)",
                    letterSpacing: "-0.01em",
                    color: "var(--text)",
                    background: "var(--bg)",
                    // Soften the error border: mix system red toward the warm
                    // brand accent so it reads as "wrong" without breaking the
                    // warm palette. Apple systemRed against terracotta felt
                    // surgical / out-of-system.
                    border: `1.5px solid ${pwError ? "color-mix(in srgb, var(--accent-error) 55%, var(--accent-warm) 45%)" : "var(--border)"}`,
                    borderRadius: "10px",
                    padding: "11px 14px",
                    outline: "none",
                    transition: "border-color 0.18s",
                    marginBottom: "10px",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    if (!pwError) e.currentTarget.style.borderColor = "var(--text)";
                  }}
                  onBlur={(e) => {
                    if (!pwError) e.currentTarget.style.borderColor = "var(--border)";
                  }}
                />

                <AnimatePresence>
                  {pwError && (
                    <motion.p
                      id="cs-gate-error"
                      role="alert"
                      aria-live="polite"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2, ease: EASE }}
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "var(--text-mono)",
                        // Message uses --muted2 instead of bright systemRed.
                        // The softened border already signals "wrong"; the
                        // message just carries the detail. Quieter, in-system.
                        color: "var(--muted2)",
                        letterSpacing: "0.04em",
                        marginBottom: "10px",
                        textAlign: "left",
                      }}
                    >
                      {pwError === "rate-limited"
                        ? `Too many attempts. Try again in ${retryInSec ?? 0}s.`
                        : pwError === "config"
                        ? "Server not configured. Contact me directly."
                        : "Incorrect password. Try again."}
                    </motion.p>
                  )}
                </AnimatePresence>

                <motion.button
                  type="submit"
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  disabled={isPending}
                  style={{
                    width: "100%",
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--text-body-lg)",
                    fontWeight: 500,
                    letterSpacing: "-0.01em",
                    padding: "12px 20px",
                    background: "var(--text)",
                    color: "var(--bg)",
                    border: "none",
                    borderRadius: "10px",
                    cursor: isPending ? "wait" : "pointer",
                    opacity: isPending ? 0.65 : 1,
                    transition: "opacity 0.15s",
                  }}
                >
                  {isPending ? "Unlocking…" : "Unlock"}
                </motion.button>
              </form>

            </motion.div>
          </div>
        </div>
      </main>
    </>
  );
}
