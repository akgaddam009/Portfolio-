/* Work-route slugs, and nothing else.

   This module exists so `proxy.ts` can decide whether a /work/<slug> URL is
   real without importing `lib/caseStudies`. That import would pull every case
   study's full prose — including confidential text — into the proxy bundle,
   which runs on every matching request. Slug strings are not confidential;
   the content is.

   Two tiers, matching the model documented in app/work/[slug]/page.tsx:
     HIDDEN_SLUGS      404 outright. NDA-strict, URL not guessable.
     confidential:true renders a gate. Lives in caseStudies.ts, not here,
                       because the proxy does not need to know about it.

   Keep PUBLIC_WORK_SLUGS in step with caseStudies.ts. `assertSlugsInSync`
   below is called from caseStudies.ts in development and throws loudly if the
   two drift, which is the failure this split would otherwise invite. */

/** Slugs that must 404 on /work/<slug>. */
export const HIDDEN_SLUGS = new Set<string>([
  "zetwerk-dc",
  "zetwerk-bu-ecosystem",
]);

/** Every slug that is a real, publicly routable /work/<slug> page. Anything
    not in here gets a real 404 from the proxy, with a real status line. */
export const PUBLIC_WORK_SLUGS = new Set<string>([
  "apple-business-listings",
  "fancode-homepage",
  "financial-planning-workflow",
  "first-time-user-experience",
  "vendor-credit-financing",
  "logistics-tax-compliance",
]);

/** Throws if this file has drifted from the case study data. Called from
    caseStudies.ts in dev only — a hard failure at import time is the point,
    since silent drift here means either a live page 404s or a hidden one
    stops 404ing. */
export function assertSlugsInSync(allSlugs: string[]): void {
  const expected = allSlugs.filter(s => !HIDDEN_SLUGS.has(s)).sort();
  const actual = [...PUBLIC_WORK_SLUGS].sort();
  const missing = expected.filter(s => !PUBLIC_WORK_SLUGS.has(s));
  const extra = actual.filter(s => !expected.includes(s));
  if (missing.length || extra.length) {
    throw new Error(
      "lib/workSlugs.ts is out of sync with lib/caseStudies.ts.\n" +
      (missing.length ? `  Add to PUBLIC_WORK_SLUGS: ${missing.join(", ")}\n` : "") +
      (extra.length ? `  Remove from PUBLIC_WORK_SLUGS: ${extra.join(", ")}\n` : "")
    );
  }
}
