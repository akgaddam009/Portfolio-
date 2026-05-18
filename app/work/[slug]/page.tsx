import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCaseStudy, caseStudies } from "@/lib/caseStudies";
import CaseStudyDetail from "@/components/CaseStudyDetail";

export async function generateStaticParams() {
  return caseStudies.map((cs) => ({ slug: cs.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
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
      url: `https://arungaddam.com/work/${slug}`,
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
  const cs = getCaseStudy(slug);
  if (!cs) notFound();
  return <CaseStudyDetail cs={cs} />;
}
