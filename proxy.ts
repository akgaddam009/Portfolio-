import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { UNLOCK_COOKIE_NAME, UNLOCK_TOKEN_VALUE } from "@/lib/auth";

/* Asset and route gating.

   The case study page does a server-side cookie check before rendering
   confidential content. This proxy adds a second layer of defense for
   the static assets in /public — without this, an attacker who guessed
   /images/planful/bulk-update.mp4 could download confidential media
   directly, bypassing the React route entirely.

   Gated paths (require valid unlock cookie):
   - /images/planful/*       Planful confidential mockups + videos
   - /images/reputation/*    Reputation confidential data viz
   - /images/zetwerk/*       Zetwerk confidential UI
   - /images/zetwerk-bu/*    Zetwerk Business Unit confidential personas
   - /images/zetwerk-cu/*    Zetwerk Credit Underwriting confidential
   - /images/zetwerk-dc/*    Zetwerk Dispatch Center confidential
   - /images/fancode/*       FanCode confidential UI
   - /images/fancode-ftux/*  FanCode FTUX confidential thumbnails
   - /images/apple*          Apple Business Listings confidential
   - /astra/*                Astra NDA-strict prototype HTML

   Public allowlist (always served, even inside gated folders):
   Certain thumbnail / cover / landing images are referenced by the
   homepage card grid and must remain visible to logged-out visitors
   so the home page renders correctly. These are intentional marketing
   previews — anyone visiting the home page already sees them. Only
   files explicitly listed in PUBLIC_ASSETS are exempt from gating.

   Everything else (favicons, theme assets, public thumbnails, Hyderabad
   map, the CV, etc.) is allowed through.

   On a gate miss we return 404 — not 403 — so we don't even
   acknowledge the path exists. An unauthenticated visitor who probes a
   URL gets the same response as a typo. */

const GATED_PATH_PATTERNS = [
  /^\/images\/planful\//i,
  /^\/images\/reputation\//i,
  /^\/images\/zetwerk\//i,
  /^\/images\/zetwerk-bu\//i,
  /^\/images\/zetwerk-cu\//i,
  /^\/images\/zetwerk-dc\//i,
  /^\/images\/fancode\//i,
  /^\/images\/fancode-ftux\//i,
  /^\/images\/apple/i,
  /^\/astra(\/|$)/i,
];

/* Files inside gated folders that ARE referenced by the public
   homepage. Without this allowlist the home page card thumbnails
   would 404 for logged-out visitors. Mirror this list with the
   actual <img src=...> values in app/page.tsx — anything used in
   the home-page grid must be here. */
const PUBLIC_ASSETS = new Set<string>([
  "/images/astra/cover.jpg",
  "/images/astra/overview.mp4",
  "/images/fancode-ftux/fc-ftux-thumbnail.jpg",
  "/images/fancode/fancode-homepage-after.mp4",
  "/images/fancode/overall-homepage.jpg",
  "/images/planful/landing-page.jpg",
  "/images/planful/planful-product-video.mp4",
  "/images/reputation/after.mp4",
  "/images/reputation/thumbnail.jpg",
  "/images/zetwerk-bu/service-blueprint.png",
  "/images/zetwerk-cu/zw-creditunderwriting-thumbnail.jpg",
  "/images/zetwerk-dc/zw-dc-thumbnail.png",
  "/images/zetwerk/cover.png",
]);

function isGatedPath(pathname: string): boolean {
  if (PUBLIC_ASSETS.has(pathname)) return false;
  return GATED_PATH_PATTERNS.some((re) => re.test(pathname));
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isGatedPath(pathname)) return NextResponse.next();

  const cookie = request.cookies.get(UNLOCK_COOKIE_NAME)?.value;
  if (cookie === UNLOCK_TOKEN_VALUE) {
    // Allowed — but mark the response as private/no-store so a shared
    // cache can't serve the asset to a different visitor.
    const res = NextResponse.next();
    res.headers.set("Cache-Control", "private, no-store, max-age=0");
    res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
    return res;
  }

  // Deny — return an opaque 404. We don't redirect to /unlock because
  // that signals the resource exists.
  return new NextResponse("Not Found", {
    status: 404,
    headers: {
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow",
      "Content-Type": "text/plain",
    },
  });
}

/* Matcher scopes the proxy to only the paths that might be gated. Every
   other request short-circuits at the framework layer with zero proxy
   cost. _next, api, and the favicon shortlist are excluded so the
   framework's own asset pipeline is untouched. */
export const config = {
  matcher: [
    "/images/:path*",
    "/astra/:path*",
  ],
};
