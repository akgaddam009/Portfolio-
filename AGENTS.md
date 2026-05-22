<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:launch-qa-rule -->
# Launch QA rule

Before any significant set of changes is pushed live (merged into `main` and deployed to production), perform a complete production-readiness review covering: functionality, responsiveness, performance, accessibility, SEO/metadata, analytics, security, and visual/premium polish. Categorize findings as Critical / Major / Minor and fix critical + major before merge.

After deployment, test the live site at least twice within 24 hours — once during the day and once at night — to catch regressions, broken integrations, perf drops, and deployment-related inconsistencies that may not surface immediately after release.
<!-- END:launch-qa-rule -->
