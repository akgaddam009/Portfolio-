import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCaseStudy, caseStudies } from "@/lib/caseStudies";
import CaseStudyDetail from "@/components/CaseStudyDetail";
import CaseStudyGate from "@/components/CaseStudyGate";
import { isUnlocked } from "@/lib/auth";

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
  "astra",
]);

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

  /* Server-side gate. If the case study is confidential and the visitor
     doesn't have a valid unlock cookie, render ONLY the gate component
     with public-safe metadata. The confidential payload (problem,
     insight, decisions, outcomes) is never sent to the browser. */
  if (cs.confidential && !(await isUnlocked())) {
    return (
      <CaseStudyGate
        title={cs.title}
        tags={cs.tags ?? []}
        heroLabel={cs.heroLabel}
      />
    );
  }

  return <CaseStudyDetail cs={cs} />;
}
