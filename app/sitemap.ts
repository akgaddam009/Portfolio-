import type { MetadataRoute } from "next";

const BASE_URL = "https://arungaddam.com";

const caseStudySlugs = [
  "planful-esm-tables",
  "astra",
  "apple-business-listings",
  "fancode-homepage",
  "fancode-ftux",
  "zetwerk-dc",
  "zetwerk-bu-ecosystem",
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
