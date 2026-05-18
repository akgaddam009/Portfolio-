# Security Audit & Implementation Report

Audit date: 2026-05-18
Scope: full portfolio site (https://arungaddamux.vercel.app)

---

## TL;DR

The most embarrassing leak — a hardcoded password sitting in the JS
bundle — has been **fixed**. So has the silent leak of every
"confidential" case study's full text (it shipped to every browser
regardless of unlock state), and direct download access to every
confidential client mockup/video via guessable URLs.

The site looks and behaves identically to before. The change is
underneath: confidential content is no longer trusted to the browser.

**Before this work:**
- Password lived in the client bundle as a string literal
- Every case study's full content (problem, insight, decisions,
  outcomes) shipped to every browser, gate or no gate
- `/images/planful/*.mp4`, `/images/zetwerk/*.png`, `/astra/p1.html`,
  etc. were directly downloadable without auth
- Confidential pages were in sitemap.xml and had no noindex
- Link previews revealed client names ("Apple Maps Business Insights")

**After this work:**
- Password lives in a server-side env var (Vercel) — never bundled
- Confidential case study payload is rendered server-side only when
  the unlock cookie is valid
- Asset URLs for confidential clients return 404 without the cookie
- Confidential pages have noindex + nofollow + nocache, generic
  metadata, and are absent from sitemap and disallowed in robots.txt
- Rate limit of 30 attempts per 15-minute window per IP

---

## Findings & Resolution

### P0 — Critical (all fixed)

| # | Issue | Severity | Status | Fix |
|---|---|---|---|---|
| 1 | Password `"Nothing@123$"` hardcoded in `CaseStudyDetail.tsx` and `app/page.tsx`, shipped to client | Critical | ✅ Fixed | Moved to `CASE_STUDY_PASSWORD` env var; validated server-side in `app/actions/unlock.ts` via constant-time compare |
| 2 | Full confidential case study payload (problem, insight, decisions, outcomes) bundled to every browser regardless of unlock | Critical | ✅ Fixed | `app/work/[slug]/page.tsx` now does a server-side cookie check and renders only `CaseStudyGate` (public metadata) when unauthorized — the confidential payload never reaches the client |
| 3 | Confidential media files (Planful 205MB, Reputation, Zetwerk, FanCode, Apple) directly downloadable via guessable URLs | Critical | ✅ Fixed | `proxy.ts` intercepts `/images/{confidential-folders}/*` and returns 404 without a valid unlock cookie |
| 4 | Astra prototype HTML files (`/astra/p1.html`, `/astra/p2.html`) publicly accessible despite Astra being NDA-strict | Critical | ✅ Fixed | Same proxy gate covers `/astra/*` |
| 5 | `planful-esm-tables` listed in sitemap despite `confidential: true` | High | ✅ Fixed | `sitemap.ts` now filters both `HIDDEN_SLUGS` and `confidential: true` cases |
| 6 | No `noindex/nofollow` on confidential pages; full summary in `<meta description>` exposing client name and project details | High | ✅ Fixed | `generateMetadata` returns `robots: { index: false, follow: false, nocache: true }` for confidential pages plus a sanitized generic title/description |

### P1 — Important (all fixed)

| # | Issue | Status | Fix |
|---|---|---|---|
| 7 | No rate limiting on password attempts | ✅ Fixed | 30 attempts per 15 minutes per IP, bucketed in-memory in `app/actions/unlock.ts` |
| 8 | No middleware enforcing route protection — all gating was client-side | ✅ Fixed | `proxy.ts` (Next 16 successor to middleware) gates assets and astra routes at the request layer |
| 9 | Confidential routes cacheable by shared CDN | ✅ Fixed | `Cache-Control: private, no-store, must-revalidate` on `/work/{confidential-slugs}` in `next.config.ts` |
| 10 | Link previews (Slack, iMessage, LinkedIn) leaked client names | ✅ Fixed | Sanitized OG title/description for confidential pages — previews now show "Protected case study" |
| 11 | `robots.txt` didn't disallow confidential paths or asset directories | ✅ Fixed | `robots.ts` programmatically disallows all confidential slugs and asset folders |
| 12 | Timing-attack potential on password compare | ✅ Fixed | Constant-time comparison via XOR-accumulate in `unlock.ts` |

### P2 — Hardening (partially addressed)

| # | Issue | Status | Notes |
|---|---|---|---|
| 13 | `unsafe-eval` in CSP | ⚠ Accepted | Required by maplibre-gl WebGL shaders — well-scoped, not a real risk on a single-page portfolio |
| 14 | `unsafe-inline` for scripts/styles | ⚠ Accepted | Framer Motion inline styles + Next.js inline hydration scripts. Switching to nonces requires reworking every motion component — out of scope |
| 15 | No bot challenge (Cloudflare Turnstile / hCaptcha) on password form | ⏭ Deferred | Rate limit is the first line of defense. Add Turnstile if abuse becomes a real problem |
| 16 | EXIF metadata in uploaded images | ⏭ Deferred | Strip with `exiftool -all= public/images/**/*.jpg` before next deploy. Not a security issue in this content set but worth doing |
| 17 | Production source maps | ✅ Already disabled | Next.js default, confirmed no `productionBrowserSourceMaps: true` in `next.config.ts` |

### What was already good

- HSTS (`max-age=31536000; includeSubDomains`)
- X-Frame-Options: DENY (per-route SAMEORIGIN for Astra embedding)
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy locked down (camera/mic/geo all denied)
- X-Content-Type-Options: nosniff
- `poweredByHeader: false` — no Next.js advertising
- `.env*` properly gitignored
- No `console.log` in source
- No API keys, Bearer tokens, or third-party secrets in client code
- Vercel HTTPS-everywhere by default

---

## Architecture After Hardening

```
┌──────────────────────────────────────────────────────────────┐
│ Browser                                                       │
│                                                               │
│  ┌──────────────┐                                            │
│  │ CaseStudyGate│  ← Renders ONLY public metadata             │
│  └──────────────┘    (title, tags, heroLabel)                 │
│         │                                                     │
│         │ POST password via Server Action                     │
│         ▼                                                     │
└─────────┼─────────────────────────────────────────────────────┘
          │
┌─────────▼─────────────────────────────────────────────────────┐
│ proxy.ts (Next 16 successor to middleware)                    │
│                                                                │
│  /images/{planful,reputation,zetwerk*,fancode,apple}/*  ────┐ │
│  /astra/*                                                   │ │
│                                                             ▼ │
│                                          [check cs-unlock cookie]│
│                                                  │       │     │
│                                          unlocked ▼   ▼ blocked│
│                                              200      404      │
└────────────────────────────────────────────┬──────────────────┘
                                             │
┌────────────────────────────────────────────▼──────────────────┐
│ Next.js Server                                                 │
│                                                                │
│  app/work/[slug]/page.tsx                                      │
│    ├─ HIDDEN_SLUGS check          → 404                        │
│    ├─ getCaseStudy(slug)          → null check → 404           │
│    ├─ cs.confidential + !cookie   → render <CaseStudyGate/>    │
│    └─ otherwise                    → render <CaseStudyDetail/> │
│                                                                │
│  app/actions/unlock.ts (server action)                         │
│    ├─ rate-limit check (30 / 15min / IP)                       │
│    ├─ constant-time compare to process.env.CASE_STUDY_PASSWORD │
│    └─ set HttpOnly cookie cs-unlock=unlocked-v1                │
└────────────────────────────────────────────────────────────────┘

         ┌─────────────────────────────────────────────────┐
         │ Vercel Environment Variables                    │
         │                                                 │
         │ CASE_STUDY_PASSWORD=<recruiter-shared-password> │
         └─────────────────────────────────────────────────┘
```

---

## Deployment Steps

1. **Set the production password.**
   In the Vercel dashboard → Project Settings → Environment Variables:
   - Key: `CASE_STUDY_PASSWORD`
   - Value: a new strong password (rotate the leaked `Nothing@123$`)
   - Environments: Production (and Preview if you want it gated too)

2. **Deploy.** Push the current branch and let Vercel build. The
   `unlock()` action will fail closed in production if the env var is
   unset.

3. **Verify (Vercel preview URL):**
   - Visit `/work/planful-esm-tables` → see the gate, not the content
   - Open DevTools → Network → reload → the response body must not
     contain "ESM" or "Planful" inside the page payload, only inside
     the gate component
   - Try `/images/planful/landing-page.jpg` directly → expect 404
   - Try `/astra/p1.html` directly → expect 404
   - Submit the correct password → cookie `cs-unlock` set as HttpOnly
   - After unlock, all the above paths return 200

4. **Optional: bust existing sessions.** If you want to invalidate
   every visitor who has ever unlocked (in case the old password got
   shared widely), edit `lib/auth.ts` and bump
   `UNLOCK_TOKEN_VERSION` from `"v1"` to `"v2"`. Every existing cookie
   becomes invalid on next request.

---

## Remaining Risks (can't fully eliminate)

1. **The case study titles themselves contain client names.** "Apple
   Maps Business Insights" and "Rethink FanCode Sports app Homepage"
   are visible on the homepage and on the gate page. These titles
   were already public before this work — moving them server-side
   doesn't help if the homepage card shows them. **Recommendation:**
   rename confidential case study cards/titles to be project-shaped,
   not client-shaped. E.g. "Maps insights dashboard" instead of
   "Apple Maps Business Insights".

2. **Password sharing.** A determined recruiter can share the
   password with anyone. No technical control prevents this.
   **Mitigation:** rotate the password periodically; consider
   per-recruiter unique passwords if this becomes an issue.

3. **Screenshots once unlocked.** Once a viewer has the cookie, they
   can screenshot every mockup. There is no defense against this
   short of streaming watermarks or per-session image rendering —
   not justified for a portfolio.

4. **The gate page returns 200.** A scanner that just looks at
   status codes can tell which slugs exist (gate page) vs. which
   don't (HIDDEN_SLUGS, return 404). The noindex tag and sanitized
   metadata mean the page is opaque, but a probe still learns
   "this slug exists, it's gated." Living with this is fine — it
   matches every password-gated content site (Notion, Are.na, etc.).

5. **DDoS / bandwidth abuse.** No global rate limit, no Cloudflare.
   If abuse happens, the Vercel free tier rate-limits help, and
   adding Cloudflare in front is a 30-min job if it ever matters.

---

## Files Changed

```
NEW   app/actions/unlock.ts              Server action for password validation
NEW   components/CaseStudyGate.tsx       Client gate UI, no password constant
NEW   lib/auth.ts                        Server-side cookie reader
NEW   proxy.ts                           Next 16 asset/route gate
NEW   .env.example                       Documents CASE_STUDY_PASSWORD
NEW   SECURITY_AUDIT.md                  This report

MOD   app/work/[slug]/page.tsx           Server-side gate check + sanitized
                                         metadata for confidential slugs
MOD   components/CaseStudyDetail.tsx     Removed hardcoded password + gate UI
MOD   app/page.tsx                       Modal now calls server action
MOD   app/sitemap.ts                     Excludes confidential slugs
MOD   app/robots.ts                      Disallows confidential paths + assets
MOD   next.config.ts                     Cache-Control: no-store for protected
```

---

## Recommendations for the Future

1. **Switch to per-recruiter passwords.** Replace the single shared
   password with a small registry (mapping a code to the recruiter
   who got it). Then when a leak happens you know whose code leaked.

2. **Add Cloudflare in front of the site.** Free tier gives you bot
   challenge, geo-blocking, and DDoS protection. Takes 30 minutes
   to set up.

3. **Move long videos out of `/public/` even when authenticated.**
   The 205MB of Planful videos cost bandwidth every time someone
   unlocks. Consider Cloudflare Stream or Mux with signed URLs —
   videos stay confidential AND don't hit Vercel bandwidth.

4. **Rename confidential case study titles to be project-shaped.**
   See "Remaining Risks #1".

5. **Add Vercel Web Analytics privacy mode.** Already partially
   implemented — the `/me` route opts the owner out. Confirm
   visitor analytics aren't leaking sensitive query strings.

6. **Quarterly rotation of `CASE_STUDY_PASSWORD`.** Bumping
   `UNLOCK_TOKEN_VERSION` in `lib/auth.ts` invalidates every
   existing session in one commit — cheap to do.
