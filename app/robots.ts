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
    sitemap: "https://arungaddamux.vercel.app/sitemap.xml",
    host: "https://arungaddamux.vercel.app",
  };
}
