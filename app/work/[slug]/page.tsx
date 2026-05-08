import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCaseStudy, caseStudies } from "@/lib/caseStudies";
import CaseStudyDetail from "@/components/CaseStudyDetail";

/* Slugs that are completely hidden from the public — no static page is
   generated, no metadata, no route. Anyone visiting these URLs gets a
   404. Used for case studies with confidentiality requirements that go
   beyond a password gate (NDA-only, recruiter-direct-link only, etc.).
   Listed here rather than in caseStudies.ts because the hide is a
   routing decision, not a data field. */
const HIDDEN_SLUGS = new Set<string>([
  "fancode-homepage",
  "fancode-ftux",
  "zetwerk-dc",
  "zetwerk-bu-ecosystem",
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
  const title       = `${cs.title} — Arun Gaddam`;
  const description = cs.summary;
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
  return <CaseStudyDetail cs={cs} />;
}
