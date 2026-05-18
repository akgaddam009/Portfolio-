import type { NextConfig } from "next";

/* CSP directives shared across every route. Frame-ancestors is overridden
   per-route below — locked down for everything except the Astra prototype
   pages, which are embedded as iframes inside /work/astra. */
const baseCsp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // unsafe-eval: maplibre WebGL shaders; unsafe-inline: Next.js chunks
  "style-src 'self' 'unsafe-inline'",                // unsafe-inline: Framer Motion inline styles
  "img-src 'self' data: blob: https://tiles.openfreemap.org", // blob: for maplibre canvas exports; openfreemap for sprite/marker PNGs
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
        // study can embed them.
        source: "/astra/:path*",
        headers: astraEmbedHeaders,
      },
      {
        /* Confidential case studies — disable shared caching so a CDN /
           reverse proxy can't accidentally serve an unlocked variant of
           the page to a different visitor. The page itself is fast to
           render server-side; this only blocks shared cache, not the
           browser's per-session cache. */
        source: "/work/:slug(planful-esm-tables|apple-business-listings|fancode-homepage)",
        headers: [
          { key: "Cache-Control", value: "private, no-store, max-age=0, must-revalidate" },
        ],
      },
      {
        // Everything else — strictest clickjacking protection.
        // Negative lookahead excludes /astra/* so the route-specific rule
        // above isn't overridden by this catch-all (Next.js applies headers
        // from every matching source; later matches override same-named
        // headers from earlier ones).
        source: "/((?!astra/).*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
