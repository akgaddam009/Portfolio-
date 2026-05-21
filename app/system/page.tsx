"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";
import Footer from "@/components/Footer";

/* Minimal landing for the portfolio's design system documentation.
   Replaces the prior long-form docs page with a one-paragraph framing.
   The actual design tokens live in app/globals.css; the system this
   page documents is the live one rendering everything around it. */

const EASE = [0.22, 1, 0.36, 1] as const;

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

      <main style={{ paddingTop: "120px", minHeight: "calc(100vh - 200px)" }}>
        <section style={{ padding: "var(--space-9) 0" }}>
          <div className="page-pad">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: EASE }}
              style={{ maxWidth: "640px" }}
            >
              <Link
                href="/"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-mono)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                  padding: "8px 4px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  marginBottom: "32px",
                  transition: "color 0.18s",
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
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-eyebrow)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--muted)",
                marginBottom: "12px",
              }}>
                Portfolio Design Language
              </p>

              <h1 style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 300,
                lineHeight: 1.25,
                letterSpacing: "-0.03em",
                color: "var(--text)",
                marginBottom: "24px",
              }}>
                Design system documentation
              </h1>

              <p style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-body-lg)",
                lineHeight: 1.7,
                color: "var(--muted2)",
                marginBottom: "16px",
              }}>
                This is the design system documentation of this portfolio — the tokens, type scale, motion vocabulary, and interaction patterns that power every page you've been browsing.
              </p>

              <p style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-body-lg)",
                lineHeight: 1.7,
                color: "var(--muted2)",
                marginBottom: "32px",
              }}>
                Maintained as code, not as Figma. The system you see rendered around you is the same system documented here.
              </p>

              <p style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-mono)",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "var(--muted)",
                padding: "10px 14px",
                background: "var(--surface2)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                display: "inline-block",
              }}>
                Documented in code — see <code style={{ fontFamily: "var(--font-mono)" }}>app/globals.css</code>
              </p>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
