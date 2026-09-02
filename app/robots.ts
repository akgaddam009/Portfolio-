import type { MetadataRoute } from "next";
import { caseStudies } from "@/lib/caseStudies";

const SITE_URL = "https://arungaddamux.vercel.app";

const HIDDEN_SLUGS = new Set<string>([
  "zetwerk-dc",
  "zetwerk-bu-ecosystem",
]);

export default function robots(): MetadataRoute.Robots {
  /* Confidential case study paths and their corresponding asset
     directories. Disallow tells well-behaved crawlers (Google, Bing)
     to skip the URL. Combined with noindex meta on the gate page and
     proxy.ts asset gating, this means:
       1. Crawlers won't follow links to confidential work
       2. If a crawler ignores robots.txt, the page returns noindex +
          a gate
       3. If a crawler probes asset URLs directly, the proxy returns 404 */
  const disallowed: string[] = [
    "/ai/",
    "/images/reputation/",
    "/images/zetwerk/",
    "/images/zetwerk-bu/",
    "/images/zetwerk-cu/",
    "/images/zetwerk-dc/",
    "/images/fancode/",
    "/images/fancode-ftux/",
    "/images/apple/",
    "/images/apple-business-listings/",
  ];

  for (const cs of caseStudies) {
    if (HIDDEN_SLUGS.has(cs.slug) || cs.confidential) {
      disallowed.push(`/work/${cs.slug}`);
    }
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: disallowed,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
