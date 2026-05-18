import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/system/", "/ai/"],
      },
    ],
    sitemap: "https://arungaddam.com/sitemap.xml",
    host: "https://arungaddam.com",
  };
}
