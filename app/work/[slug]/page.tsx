import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCaseStudy, caseStudies, HIDDEN_SLUGS } from "@/lib/caseStudies";
import CaseStudyDetail from "@/components/CaseStudyDetail";
import CaseStudyGate from "@/components/CaseStudyGate";
import CaseStudyShortForm from "@/components/CaseStudyShortForm";
import { isUnlocked } from "@/lib/auth";

/* Slugs that render the minimal short-form layout instead of the full
   CaseStudyDetail narrative. These are exploration-style builds — quick
   Claude Code proofs of concept — that don't need the full multi-section
   case study treatment. */
const SHORT_FORM_SLUGS: Record<string, { paragraphs: string[]; builtWith: string; media?: { src: string } }> = {};

/* Slugs that embed a Google Drive PDF/folder instead of the full case
   study detail. The embedUrl is loaded in a full-screen iframe. */
const DRIVE_EMBEDS: Record<string, string> = {
  "apple-business-listings": "https://drive.google.com/embeddedfolderview?id=1Hdt07pFd18jstGzcJO0DorEzllqT7r1d#list",
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
/* HIDDEN_SLUGS now imported from lib/caseStudies (single source of truth). */

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

  const SITE_URL = "https://arungaddamux.vercel.app";
  const title       = `${cs.title} — Arun Gaddam`;
  // Strip ==highlight== markers from the meta description so social previews
  // don't surface "==text==" literally.
  const description = cs.summary?.replace(/==(.+?)==/g, "$1");
  // Use the first decision image as OG image if available
  const ogImage = cs.decisions?.find(d => d.image?.src)?.image?.src;
  const pageUrl = `${SITE_URL}/work/${slug}`;
  return {
    title,
    description,
    alternates: { canonical: pageUrl },
    keywords: [...(cs.tags ?? []), "Arun Gaddam", "Product Designer", "UX Case Study"],
    openGraph: {
      title,
      description,
      type: "article",
      url: pageUrl,
      siteName: "Arun Gaddam",
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630, alt: cs.title }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@akgaddam",
      site: "@akgaddam",
      ...(ogImage ? { images: [ogImage] } : {}),
    },
    /* Case studies whose card opens a Google Drive PDF are orphaned: nothing
       in the site links to /work/<slug> for them (app/page.tsx prefers
       cs.driveUrl), so the page is reachable only by direct URL and presents a
       thinner version of work the PDF tells better. Noindex those to avoid
       competing duplicate content, but keep follow so link equity still flows.
       Studies without a driveUrl are still routable and stay indexable. */
    robots: cs.driveUrl
      ? {
          index: false,
          follow: true,
          googleBot: { index: false, follow: true },
        }
      : {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
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

  const SITE_URL = "https://arungaddamux.vercel.app";
  const pageUrl  = `${SITE_URL}/work/${slug}`;
  const cleanSummary = cs.summary?.replace(/==(.+?)==/g, "$1");

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

  if (DRIVE_EMBEDS[slug]) {
    return (
      <div className="fixed inset-0 w-full h-full">
        <iframe
          src={DRIVE_EMBEDS[slug]}
          className="w-full h-full border-0"
          allowFullScreen
          title={cs.title}
        />
      </div>
    );
  }

  const jsonLd = !cs.confidential ? {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: cs.title,
    url: pageUrl,
    description: cleanSummary,
    keywords: cs.tags?.join(", "),
    author: {
      "@type": "Person",
      name: "Arun Gaddam",
      url: SITE_URL,
    },
    inLanguage: "en-US",
  } : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <CaseStudyDetail cs={cs} />
    </>
  );
}
