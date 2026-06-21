import type { MetadataRoute } from "next";
import { caseStudies } from "@/lib/caseStudies";

const BASE_URL = "https://arungaddamux.vercel.app";

/* HIDDEN_SLUGS kept in sync with app/work/[slug]/page.tsx. */
const HIDDEN_SLUGS = new Set<string>([
  "zetwerk-dc",
  "zetwerk-bu-ecosystem",
]);

export default function sitemap(): MetadataRoute.Sitemap {
  /* Only emit case studies that are both publicly routable AND
     non-confidential. Confidential case studies are reachable via
     direct URL for recruiters but are intentionally absent from the
     sitemap so search engines don't surface them and crawl the gate
     page (which would index the gate text, not the content). */
  const caseStudyEntries = caseStudies
    .filter(cs => !HIDDEN_SLUGS.has(cs.slug))
    .filter(cs => !cs.confidential)
    .map(cs => ({
      url: `${BASE_URL}/work/${cs.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

  const buildDate = new Date("2026-06-21");
  return [
    {
      url: BASE_URL,
      lastModified: buildDate,
      changeFrequency: "weekly" as const,
      priority: 1.0,
    },
    ...caseStudyEntries,
  ];
}
