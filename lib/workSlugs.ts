/* Work-route slugs, and nothing else.

   Split out of lib/caseStudies.ts so app/robots.ts can read HIDDEN_SLUGS
   without each file keeping its own hand-maintained copy — they had already
   drifted apart once. caseStudies.ts re-exports this, so it stays the single
   definition.

   Two tiers, matching the model documented in app/work/[slug]/page.tsx:
     HIDDEN_SLUGS      404 outright. NDA-strict, URL not guessable.
     confidential:true renders a gate. Lives in caseStudies.ts, since only
                       the case study data needs to know about it. */

/** Slugs that must 404 on /work/<slug>. */
export const HIDDEN_SLUGS = new Set<string>([
  "zetwerk-dc",
  "zetwerk-bu-ecosystem",
]);
