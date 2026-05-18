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

function isGatedPath(pathname: string): boolean {
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
