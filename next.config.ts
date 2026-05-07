import type { NextConfig } from "next";

/* CSP directives shared across every route. Frame-ancestors is overridden
   per-route below — locked down for everything except the Astra prototype
   pages, which are embedded as iframes inside /work/astra. */
const baseCsp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // unsafe-eval: maplibre WebGL shaders; unsafe-inline: Next.js chunks
  "style-src 'self' 'unsafe-inline'",                // unsafe-inline: Framer Motion inline styles
  "img-src 'self' data: blob:",                      // blob: for maplibre canvas exports
  "media-src 'self'",                                // portfolio videos served from /public
  "connect-src 'self' https://tiles.openfreemap.org", // maplibre vector tiles
  "font-src 'self' https://tiles.openfreemap.org",   // next/font Inter + maplibre glyph PBFs
  "worker-src blob:",                                // maplibre Web Workers
];

/* Default headers — applied to every route. Strictest possible clickjacking
   protection: no frame embedding from anywhere. */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Content-Security-Policy",
    value: [...baseCsp, "frame-ancestors 'none'"].join("; "),
  },
];

/* Astra prototype headers — same security stack, but frame-ancestors 'self'
   and X-Frame-Options: SAMEORIGIN so the case study at /work/astra can
   embed /astra/p1 and /astra/p2 as iframes. Cross-origin framing still
   blocked. */
const astraEmbedHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Content-Security-Policy",
    value: [...baseCsp, "frame-ancestors 'self'"].join("; "),
  },
];

const nextConfig: NextConfig = {
  // Remove the X-Powered-By: Next.js header — no need to advertise the stack
  poweredByHeader: false,

  experimental: {
    viewTransition: true,
  },

  async headers() {
    return [
      {
        // Astra prototype routes — allow same-origin framing so the case
        // study can embed them. More specific match wins over the catch-all.
        source: "/astra/:path*",
        headers: astraEmbedHeaders,
      },
      {
        // Everything else — strictest clickjacking protection.
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
