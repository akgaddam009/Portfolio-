"use client";

/* Story view — the alternate, linear reading of the portfolio, offered
   behind the workspace/story toggle in the nav.

   Extracted from app/page.tsx. It was the most separable thing in that
   file: a self-contained view whose only two dependencies were the two
   data arrays directly above it, which came with it. Nothing else in
   page.tsx referenced them.

   A move, not a rewrite. */

import Link from "next/link";
import { ArrowUpRight } from "@/components/ui/Icon";

/* ── Story View. Stripped-down single-column resume page. ──
   Bio · 3 stats · work list · tenure line · contact.
   Replaces the entire <main> in Story mode -no panels, no chrome,
   no animations beyond the standard load fade. Uses theme tokens
   so it adapts to dark/light. */
const STORY_WORK: { title: string; slug: string | null }[] = [
  { title: "Planful · Senior Product Designer · 2025", slug: null },
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

export default function StoryView() {
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
