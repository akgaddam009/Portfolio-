import type { NextConfig } from "next";

const securityHeaders = [
  // Prevent browsers from MIME-sniffing the content-type
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Deny framing by other origins (clickjacking protection)
  { key: "X-Frame-Options", value: "DENY" },
  // Stop sending the full referrer URL cross-origin
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Force HTTPS for 1 year (only meaningful once on a real TLS domain)
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  // Disable access to sensitive browser APIs the portfolio doesn't need
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  // Content Security Policy — tuned for this specific stack:
  //   • Next.js injects inline <script> and <style> tags (needs 'unsafe-inline' for styles)
  //   • Framer Motion uses inline styles extensively
  //   • maplibre-gl uses Web Workers (worker-src blob:) and WebGL eval (script-src 'unsafe-eval')
  //   • Inter font is self-hosted via next/font (no remote font CDN needed)
  //   • Videos/images served from same origin only
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // unsafe-eval: maplibre WebGL shaders; unsafe-inline: Next.js chunks
      "style-src 'self' 'unsafe-inline'",                // unsafe-inline: Framer Motion inline styles
      "img-src 'self' data: blob:",                      // blob: for maplibre canvas exports
      "media-src 'self'",                                // portfolio videos served from /public
      "font-src 'self'",                                 // next/font serves Inter locally
      "connect-src 'self' https://tiles.openfreemap.org", // maplibre fetches vector tiles, glyphs, sprites
      "font-src 'self' https://tiles.openfreemap.org",  // maplibre glyph PBFs served as fonts
      "worker-src blob:",                                // maplibre Web Workers
      "frame-ancestors 'none'",                          // redundant with X-Frame-Options but belt-and-suspenders
    ].join("; "),
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
        // Apply security headers to every route
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
