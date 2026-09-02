# Arun Gaddam — Portfolio

A Next.js 16 portfolio site built around an opinionated design system. Every visual
decision is pinned to a CSS variable; the site renders its own documentation at
[`/system`](./app/system/page.tsx).

---

## Design system

The full design system documentation lives in-product at `/system`. It is the
canonical reference — not a separate Figma file, not a Storybook export. The site
you render locally is the system.

```bash
npm install
npm run dev
# open http://localhost:3000/system
```

### Architecture

Four layers, each depending only on the one below.

| Layer        | Lives in                                          |
| ------------ | ------------------------------------------------- |
| **Pages**      | `app/page.tsx`, `app/work/[slug]/page.tsx`        |
| **Patterns**   | `app/**/page.tsx` (composed component groupings)  |
| **Components** | `components/ui/` — Button, Badge, Input, Chip, …  |
| **Tokens**     | `app/globals.css` — colors, type, spacing, motion |

Pages never reach past components to touch tokens directly. Components never
bypass tokens with hardcoded values. Theming and refactors are safe because the
layers respect their boundaries.

### Tokens

Live in [`app/globals.css`](./app/globals.css). Light and dark themes are
redefinitions of the same token set — no separate palette files.

| Category | Token examples                                                |
| -------- | ------------------------------------------------------------- |
| Color    | `--bg`, `--surface`, `--text`, `--muted`, `--border`          |
| Accent   | `--accent-warm`, `--accent-success`, `--accent-error`         |
| Chip     | `--chip-indigo-bg`, `--chip-teal-text` (six tones × 2 modes)  |
| Type     | `--text-display`, `--text-title`, `--text-body`, `--text-mono`|
| Spacing  | `--space-1` (4px) … `--space-11` (96px)                       |
| Radius   | `--radius-xs` (4px) … `--radius-pill` (9999px)                |
| Motion   | `--dur-fast`, `--dur-base`, `--dur-slow`, `--ease-expo`       |

### Components

Located in [`components/ui/`](./components/ui/). Each component reads tokens and
never hardcodes values.

| Component   | Purpose                                          | File                |
| ----------- | ------------------------------------------------ | ------------------- |
| `Button`    | Three tiers (chrome / inline / tag), no primary  | `button.tsx`        |
| `Badge`     | Tag chips — default / accent / success           | `badge.tsx`         |
| `Input`     | Text input, animated focus border                | `input.tsx`         |
| `InlineChip`| Six-tone inline emphasis chips for prose         | `InlineChip.tsx`    |
| `VideoBlock`| Web chrome / phone frame video container         | `VideoBlock.tsx`    |

---

## AI-assisted workflow

The portfolio was developed using a two-mode workflow.

| Mode              | Tool         | Role                                          |
| ----------------- | ------------ | --------------------------------------------- |
| Plan & research   | Claude AI    | Principle synthesis, plan documents, copy     |
| Build & verify    | Claude Code  | Code generation, dev server, browser testing  |

Plan files are the contract between the two modes. Every non-trivial change passes
through a plan that names the files it touches, lists the tradeoffs it considered,
and states what is explicitly out of scope. Only after the plan is approved does
the build begin.

See `/system#ai-workflow` in the running app for the full explanation.

---

## Development

### Stack

- **Framework:** Next.js 16 (App Router) with Turbopack
- **Language:** TypeScript
- **Styling:** Tailwind v4 + CSS variables in `globals.css`
- **Animation:** Framer Motion
- **UI primitives:** Radix UI (`@radix-ui/react-slot`, `tabs`, `separator`)
- **Utilities:** `class-variance-authority`, `clsx`, `tailwind-merge`

### Commands

```bash
npm run dev          # start dev server (port 3000)
npm run build        # production build
npm run start        # serve production build
npm run lint         # eslint
```

### Branches

| Branch                       | Purpose                                          |
| ---------------------------- | ------------------------------------------------ |
| `main`                       | Production. Deployed via Vercel. Don't push without approval. |
| `local/with-explorations`    | In-progress work — includes hidden case studies (Design System) |

---

## Confidential case studies

Confidential work uses a server-side gate with HttpOnly cookie auth. See:

- `lib/auth.ts` — cookie verification
- `lib/unlock.ts` — constant-time password check, rate limiting
- `proxy.ts` — middleware-level asset gating (confidential images return 404 without a valid cookie)
- `components/CaseStudyGate.tsx` — the gate UI

Hidden case studies (NDA-strict, 404 by default) are listed in
`HIDDEN_SLUGS` inside `app/work/[slug]/page.tsx`.

---

## Routes

| Route                     | Purpose                                          |
| ------------------------- | ------------------------------------------------ |
| `/`                       | Home — work index                                |
| `/system`                 | Design system documentation (this is the system) |
| `/work/[slug]`            | Case study (server-side gated if confidential)   |
| `/api/case-study/unlock`  | Password verification endpoint                   |

---

## Deployment

```bash
git push origin main   # triggers Vercel deployment
```

Live: [arungaddamux.vercel.app](https://arungaddamux.vercel.app)
