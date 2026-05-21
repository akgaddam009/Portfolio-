import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCaseStudy, caseStudies } from "@/lib/caseStudies";
import CaseStudyDetail from "@/components/CaseStudyDetail";
import CaseStudyGate from "@/components/CaseStudyGate";
import CaseStudyShortForm from "@/components/CaseStudyShortForm";
import { isUnlocked } from "@/lib/auth";

/* Slugs that render the minimal short-form layout instead of the full
   CaseStudyDetail narrative. These are exploration-style builds — quick
   Claude Code proofs of concept — that don't need the full multi-section
   case study treatment. */
const SHORT_FORM_SLUGS: Record<string, { paragraphs: string[]; builtWith: string; media?: { src: string } }> = {
  "astra": {
    paragraphs: [
      "Astra is an exploration of what AI-assisted contract review could look like inside a B2B SaaS workflow — covering the parts where the model is confident, and the parts where it isn't.",
      "Two flows: an AI-led first pass that surfaces clause-level risks and recommended edits, and an approval flow for the human reviewer to accept, reject, or escalate each suggestion.",
      "Designed and built end-to-end as a working prototype, not a Figma file — the prototype runs, the flows are clickable, the AI suggestions are real.",
    ],
    builtWith: "Built solo in 6–8 hours with Claude Code",
    media: { src: "/images/astra/overview.mp4" },
  },
  "apple-business-listings": {
    paragraphs: [
      "A self-directed rebuild of the Reputation.com Business Listings dashboard — the project I shipped in 2024 to bring Apple Maps performance data into the same view as Google and Facebook.",
      "I recreated the core dashboard surface as a working prototype to see how quickly I could go from spec to interactive screen using Claude Code. Same information architecture, same metrics grouping, same density principles I shipped in production.",
    ],
    builtWith: "Rebuilt in 1–2 hours with Claude Code",
    media: { src: "/images/reputation/after.mp4" },
  },
};

/* Slugs that are completely hidden from the public — no static page is
   generated, no metadata, no route. Anyone visiting these URLs gets a
   404. Used for case studies with confidentiality requirements that go
   beyond a password gate (NDA-only, recruiter-direct-link only, etc.).

   Two-tier confidentiality model:
   - HIDDEN_SLUGS (this set):   404. NDA-strict. URL is not guessable.
                                Examples: zetwerk-dc, zetwerk-bu-ecosystem, astra.
   - confidential: true (data): Renders a gate. Confidential content
                                ONLY ships to the browser after the
                                server-side cookie check passes —
                                unauthenticated browsers receive the
                                gate component and never see the full
                                data structure.

   `fancode-homepage` deliberately stays OUT of this list — it's
   password-gated but recruiter-reachable via direct link. Listed here
   rather than in caseStudies.ts because the hide is a routing decision,
   not a data field. */
const HIDDEN_SLUGS = new Set<string>([
  "zetwerk-dc",
  "zetwerk-bu-ecosystem",
]);

/* Public hero media per confidential slug — mirrors the homepage WORK_THUMBS
   / WORK_POSTERS maps in app/page.tsx. These are non-confidential preview
   assets allowlisted in proxy.ts: same media a visitor sees on the home
   card, just embedded inside the gate so the first fold has something to
   show before the unlock prompt. */
/* Per-slug hero media for the gate. Either a single VideoBlock-style
   src, or a before/after pair that mirrors the unlocked case study's
   `outcomesCompare` layout. Both shapes are public assets allowlisted
   in proxy.ts. */
type GateCover =
  | { kind: "single"; src: string; appType: string; chromeUrl?: string }
  | { kind: "pair";   before: string; after: string };

const GATE_COVERS: Record<string, GateCover> = {
  "planful-esm-tables":      { kind: "single", src: "/images/planful/planful-product-video.mp4", appType: "Enterprise SaaS · Fintech",   chromeUrl: "app.planful.com" },
  "apple-business-listings": { kind: "single", src: "/images/reputation/after.mp4",              appType: "Enterprise SaaS · Analytics", chromeUrl: "app.reputation.com" },
  "fancode-homepage":        { kind: "pair",   before: "/images/fancode/fancode-homepage-before.mp4", after: "/images/fancode/fancode-homepage-after.mp4" },
};

// Slugs not emitted by generateStaticParams (including HIDDEN_SLUGS)
// return 404 directly — no server-side render attempt, no leak.
export const dynamicParams = false;

export async function generateStaticParams() {
  // Only emit static params for slugs that are publicly routable.
  return caseStudies
    .filter(cs => !HIDDEN_SLUGS.has(cs.slug))
    .map(cs => ({ slug: cs.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (HIDDEN_SLUGS.has(slug)) return {};
  const cs = getCaseStudy(slug);
  if (!cs) return {};

  /* For confidential case studies, return a sanitized metadata block
     that reveals NOTHING about the project. The page is still
     reachable via direct URL but search engines, link previews, and
     social shares will only see a generic "password protected" label.
     This prevents:
       - Google indexing the summary text even with noindex (some
         engines cache metadata before honoring noindex)
       - Slack/iMessage/LinkedIn previews leaking client names and
         project details
       - Browser tab titles revealing which company the case study
         covers */
  if (cs.confidential) {
    const sanitizedTitle = "Protected case study — Arun Gaddam";
    const sanitizedDescription =
      "Confidential client work. Reach out for the password.";
    return {
      title: sanitizedTitle,
      description: sanitizedDescription,
      robots: {
        index: false,
        follow: false,
        nocache: true,
        googleBot: { index: false, follow: false, noimageindex: true },
      },
      openGraph: {
        title: sanitizedTitle,
        description: sanitizedDescription,
        type: "article",
        url: `https://arungaddamux.vercel.app/work/${slug}`,
      },
      twitter: {
        card: "summary",
        title: sanitizedTitle,
        description: sanitizedDescription,
      },
    };
  }

  const title       = `${cs.title} — Arun Gaddam`;
  // Strip ==highlight== markers from the meta description so social previews
  // don't surface "==text==" literally.
  const description = cs.summary?.replace(/==(.+?)==/g, "$1");
  // Use the first decision image as OG image if available
  const ogImage = cs.decisions?.find(d => d.image?.src)?.image?.src;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: `https://arungaddamux.vercel.app/work/${slug}`,
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630, alt: cs.title }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (HIDDEN_SLUGS.has(slug)) notFound();
  const cs = getCaseStudy(slug);
  if (!cs) notFound();

  /* Short-form layout for exploration-style builds — skips the gate
     and the full narrative, renders the minimal template instead. */
  if (SHORT_FORM_SLUGS[slug]) {
    const sf = SHORT_FORM_SLUGS[slug];
    return (
      <CaseStudyShortForm
        title={cs.title}
        tags={cs.tags ?? []}
        paragraphs={sf.paragraphs}
        builtWith={sf.builtWith}
        media={sf.media}
      />
    );
  }

  /* Server-side gate. If the case study is confidential and the visitor
     doesn't have a valid unlock cookie, render ONLY the gate component
     with public-safe metadata. The confidential payload (problem,
     insight, decisions, outcomes) is never sent to the browser. */
  if (cs.confidential && !(await isUnlocked())) {
    const cover = GATE_COVERS[slug];
    return (
      <CaseStudyGate
        title={cs.title}
        tags={cs.tags ?? []}
        heroLabel={cs.heroLabel}
        cover={cover}
      />
    );
  }

  return <CaseStudyDetail cs={cs} />;
}
