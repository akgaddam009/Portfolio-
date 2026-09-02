import type { NextConfig } from "next";

/* Dev-only CSP relaxations. React 19 and Turbopack need real eval() in
   development — for HMR and for reconstructing server callstacks in the
   error overlay. Without it the page ships HTML but never hydrates, so
   local preview renders dead: no theme toggle, no motion, no nav. Neither
   token is emitted in a production build. */
const isDev = process.env.NODE_ENV !== "production";
const devScriptSrc = isDev ? " 'unsafe-eval'" : "";
const devConnectSrc = isDev ? " ws://localhost:* http://localhost:*" : "";

/* CSP directives shared across every route. Frame-ancestors is locked to
   'none' everywhere: nothing on this site is embedded in an iframe. */
const baseCsp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'${devScriptSrc} https://www.googletagmanager.com https://www.clarity.ms`, // GA4 + Clarity
  "style-src 'self' 'unsafe-inline'",                // unsafe-inline: Framer Motion inline styles
  "img-src 'self' data: blob: https://tiles.openfreemap.org https://drive.google.com https://lh3.googleusercontent.com https://lh4.googleusercontent.com https://lh5.googleusercontent.com https://lh6.googleusercontent.com https://www.google-analytics.com", // GA4 pixel
  "media-src 'self'",                                // portfolio videos served from /public
  `connect-src 'self'${devConnectSrc} https://tiles.openfreemap.org https://www.google-analytics.com https://analytics.google.com https://www.clarity.ms`, // GA4 + Clarity beacons
  "font-src 'self' https://tiles.openfreemap.org",   // next/font Inter + maplibre glyph PBFs
  "worker-src blob:",                                // maplibre Web Workers
];

/* Default headers — applied to every route. Strictest possible clickjacking
   protection: no frame embedding from anywhere. */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Content-Security-Policy",
    value: [...baseCsp, "frame-ancestors 'none'"].join("; "),
  },
];

const nextConfig: NextConfig = {
  // Remove the X-Powered-By: Next.js header — no need to advertise the stack
  poweredByHeader: false,

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "drive.google.com" },
      { protocol: "https", hostname: "*.googleusercontent.com" },
    ],
  },

  experimental: {
    viewTransition: true,
  },

  async headers() {
    return [
      {
        /* Confidential case studies — disable shared caching so a CDN /
           reverse proxy can't accidentally serve an unlocked variant of
           the page to a different visitor. The page itself is fast to
           render server-side; this only blocks shared cache, not the
           browser's per-session cache. */
        source: "/work/:slug(apple-business-listings|fancode-homepage)",
        headers: [
          { key: "Cache-Control", value: "private, no-store, max-age=0, must-revalidate" },
        ],
      },
      {
        // Everything else — strictest clickjacking protection. No route
        // opts out of frame-ancestors 'none' any more.
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
