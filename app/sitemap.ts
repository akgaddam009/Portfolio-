import type { MetadataRoute } from "next";

const BASE_URL = "https://arungaddamux.vercel.app";

// Only public case studies are indexed. Confidential cases
// (zetwerk-dc, zetwerk-bu-ecosystem, fancode-homepage) are
// intentionally omitted so search engines don't surface them —
// recruiters get direct URLs as needed.
const caseStudySlugs = [
  "planful-esm-tables",
  "astra",
  "apple-business-listings",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const caseStudyEntries = caseStudySlugs.map((slug) => ({
    url: `${BASE_URL}/work/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    ...caseStudyEntries,
  ];
}
