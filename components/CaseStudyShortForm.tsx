"use client";

import Link from "next/link";
import { motion } from "framer-motion";

/* Minimal short-form case study layout — used for exploration-style
   builds (Astra, the recreated Reputation dashboard) where the
   artifact is a quick proof of concept, not a multi-month project
   that deserves a full narrative. Title, tags, a single contextual
   paragraph, optional media, and one "built with" line. */

const EASE = [0.22, 1, 0.36, 1] as const;

export type ShortFormProps = {
  title: string;
  tags: string[];
  paragraphs: string[];
  builtWith: string;
  media?: { src: string; appType?: string; chromeUrl?: string };
};

export default function CaseStudyShortForm({ title, tags, paragraphs, builtWith, media }: ShortFormProps) {
  return (
    <main id="main-content" style={{ paddingTop: "80px" }}>
      <section style={{ padding: "var(--space-9) 0 var(--space-7)" }}>
        <div className="page-pad">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE }}
          >
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

            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
              {tags.map(tag => (
                <span key={tag} style={{
                  fontFamily: "var(--font-mono)", fontSize: "var(--text-eyebrow)",
                  letterSpacing: "0.08em", textTransform: "uppercase",
                  padding: "4px 8px", background: "var(--surface2)",
                  color: "var(--muted)", borderRadius: "6px",
                }}>
                  {tag}
                </span>
              ))}
            </div>

            <h1 style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(26px, 4vw, 44px)",
              fontWeight: 300,
              lineHeight: 1.25,
              letterSpacing: "-0.03em",
              color: "var(--text)",
              marginBottom: "24px",
              maxWidth: "720px",
            }}>
              {title}
            </h1>

            <div style={{ maxWidth: "640px", marginBottom: "32px" }}>
              {paragraphs.map((p, i) => (
                <p key={i} style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-body-lg)",
                  lineHeight: 1.7,
                  color: "var(--muted2)",
                  marginBottom: i < paragraphs.length - 1 ? "16px" : "0",
                }}>
                  {p}
                </p>
              ))}
            </div>

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
              {builtWith}
            </p>
          </motion.div>
        </div>
      </section>

      {media && (
        <section style={{ padding: "var(--space-7) 0 var(--space-9)" }}>
          <div className="page-pad">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: EASE, delay: 0.1 }}
              style={{ maxWidth: "1120px", margin: "0 auto" }}
            >
              <video
                src={media.src}
                autoPlay loop muted playsInline preload="metadata"
                style={{
                  width: "100%",
                  display: "block",
                  borderRadius: "16px",
                  background: "var(--surface)",
                  boxShadow: "var(--card-shadow)",
                }}
              />
            </motion.div>
          </div>
        </section>
      )}
    </main>
  );
}
