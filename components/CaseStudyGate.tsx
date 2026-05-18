"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { unlock } from "@/app/actions/unlock";

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
};

export default function CaseStudyGate({ title, tags, heroLabel, teaser }: GateProps) {
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
        {/* Hero band — matches the look of CaseStudyDetail so the page
           feels like a real case study with a gate on top, not a 403. */}
        <section style={{ padding: "var(--space-8) 0", borderBottom: "1px solid var(--border)" }}>
          <div className="page-pad">
            <Link
              href="/#work"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-eyebrow)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--muted)",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                marginBottom: "var(--space-8)",
              }}
            >
              ← Back to work
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
                    background: "var(--surface)",
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
                  background: "var(--surface)",
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

        {/* Gate card */}
        <div style={{ padding: "var(--space-9) 0 120px" }}>
          <div className="page-pad">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: EASE }}
              style={{
                borderRadius: "16px",
                padding: "56px 40px 48px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: "20px",
                background: "var(--surface)",
                boxShadow: "var(--card-shadow)",
                maxWidth: "560px",
                margin: "0 auto",
              }}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: "var(--muted)" }}
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>

              <div>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--text-title)",
                    fontWeight: 400,
                    letterSpacing: "-0.02em",
                    color: "var(--text)",
                    marginBottom: "8px",
                    lineHeight: 1.3,
                  }}
                >
                  This case study is password protected
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--text-body)",
                    color: "var(--muted)",
                    lineHeight: 1.65,
                    maxWidth: "320px",
                  }}
                >
                  {teaser ?? "Much of my work is confidential. Please reach out for the password."}
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="cs-pw-form"
                aria-label="Unlock this case study"
                style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "340px" }}
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
                  placeholder="Password"
                  autoComplete="off"
                  disabled={isPending}
                  aria-invalid={pwError !== null}
                  aria-describedby={pwError ? "cs-gate-error" : undefined}
                  style={{
                    flex: 1,
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--text-body-lg)",
                    letterSpacing: "-0.01em",
                    color: "var(--text)",
                    background: "var(--bg)",
                    border: `1px solid ${pwError ? "var(--accent-error)" : "var(--border)"}`,
                    borderRadius: "10px",
                    padding: "10px 14px",
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => {
                    if (!pwError) e.currentTarget.style.borderColor = "var(--text)";
                  }}
                  onBlur={(e) => {
                    if (!pwError) e.currentTarget.style.borderColor = "var(--border)";
                  }}
                />
                <motion.button
                  type="submit"
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  disabled={isPending}
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--text-body-lg)",
                    fontWeight: 400,
                    letterSpacing: "-0.01em",
                    padding: "10px 20px",
                    background: "var(--text)",
                    color: "var(--bg)",
                    border: "none",
                    borderRadius: "10px",
                    cursor: isPending ? "wait" : "pointer",
                    whiteSpace: "nowrap",
                    opacity: isPending ? 0.7 : 1,
                  }}
                >
                  {isPending ? "..." : "Unlock"}
                </motion.button>
              </form>

              <AnimatePresence>
                {pwError && (
                  <motion.p
                    id="cs-gate-error"
                    role="alert"
                    aria-live="polite"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25, ease: EASE }}
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "var(--text-mono)",
                      color: "var(--accent-error)",
                      letterSpacing: "0.04em",
                      marginTop: "-8px",
                    }}
                  >
                    {pwError === "rate-limited"
                      ? `Too many attempts. Try again in ${retryInSec ?? 0}s.`
                      : pwError === "config"
                      ? "Server not configured. Please contact me directly."
                      : "Incorrect password. Try again."}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </main>
    </>
  );
}
