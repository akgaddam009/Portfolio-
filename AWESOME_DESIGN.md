# AWESOME_DESIGN.md
**Design system for Arun Gaddam's portfolio — a senior UX/Product Designer portfolio.**
Tailored from the [awesome-design-md](https://github.com/VoltAgent/awesome-design-md) pattern.
AI agents working on this project must read this file before writing any UI code.

---

## 1. Visual Theme & Atmosphere

**Mood:** Calm, confident, editorial. No noise, no decoration for its own sake.
**Density:** Low — generous whitespace, deliberate hierarchy.
**Philosophy:** Senior designers don't need to show off. Every element earns its place. If something doesn't communicate, cut it.
**Reference feel:** Linear.app, Stripe Docs, Mackenzie Child's portfolio. Quiet authority.

The background of the chrome (nav/outer shell) is `#eeeeed` — warm off-white, not pure white. Panel cards sit on `#ffffff`, creating a subtle lift effect without shadows being prominent.

---

## 2. Color Palette & Roles

| Token | Value | Role |
|-------|-------|------|
| `--bg` | `#ffffff` | Panel card backgrounds, primary surfaces |
| `--surface` | `#f5f5f5` | Secondary surfaces — card hover states, inline tags |
| `--surface2` | `#ebebeb` | Tertiary — chips, muted badges |
| `--border` | `#e5e5e5` | All borders, dividers, grid lines |
| `--text` | `#0a0a0a` | Primary text — headlines, key data |
| `--muted` | `#737373` | Secondary text — labels, captions, metadata |
| `--muted2` | `#404040` | Body copy — readable but not dominant |
| Chrome bg | `#eeeeed` | Nav bar and outer page shell |

**Color rules:**
- No brand colors in UI chrome. Color is used only for status badges (green = in use, blue = ongoing, purple = shipped, amber = prototype).
- No colored borders or left-accent strips on cards.
- Testimonial cards: solid `var(--surface)` only — no tinted backgrounds.
- Red `#ef4444` is reserved exclusively for the "today" marker in the career timeline.

---

## 3. Typography Rules

**Fonts:**
- Body / Display: `Inter` — variable weight, optical size aware
- Mono / Labels: `DM Mono` — used for all metadata, tags, panel headers, timestamps

**Type scale:**

| Usage | Size | Weight | Family | Letter-spacing | Line-height |
|-------|------|--------|--------|----------------|-------------|
| Hero headline | `clamp(20px, 2.8vw, 28px)` | 300 | Inter | `-0.03em` | 1.25 |
| Section heading | `20px` | 400 | Inter | `-0.025em` | 1.25 |
| Card title | `14px` | 400 | Inter | `-0.02em` | 1.3 |
| Body copy | `14px` | 400 | Inter | `-0.01em` | 1.65 |
| Small body | `13px` | 400 | Inter | `-0.01em` | 1.65 |
| Timeline card | `12px` | 400 | Inter | `-0.01em` | 1.25 |
| Panel label | `9px` | 400 | DM Mono | `0.1em` | — |
| Mono label | `8–10px` | 400 | DM Mono | `0.05–0.08em` | — |
| Metric value | `14px` | 400 | Inter | `-0.03em` | 1 |
| Metric label | `8px` | 400 | DM Mono | `0.06em` | — |

**Rules:**
- All mono text is `uppercase` with `letter-spacing: 0.08em` or higher.
- No bold weights (`600+`) anywhere — weight 300 for hero, 400 for everything else.
- Negative letter-spacing (`-0.01em` to `-0.03em`) on all Inter text.

---

## 4. Component Styling

### Nav Bar
```
height: 52px
padding: 0 24px (equal left/right)
background: #eeeeed
font: 13px Inter 400, letter-spacing -0.02em
```
- "Arun Gaddam" left-aligns with the leftmost panel card content.
- Arrow buttons: `32×32px`, `border-radius: 8px`, `border: 1px solid var(--border)`.

### Panel Cards
```
border-radius: 18px
background: var(--bg)
box-shadow: 0 1px 3px rgba(0,0,0,0.05), 0 4px 20px rgba(0,0,0,0.04)
overflow-y: auto
scroll-snap-align: start
```

### Panel Header (sticky)
```
padding: 12px 24px
background: rgba(255,255,255,0.88) + backdrop-filter: blur(14px)
border-bottom: 1px solid var(--border)
label: 9px DM Mono, uppercase, letter-spacing 0.1em, color var(--muted)
```

### Work Cards
```
border-radius: 12px
background: var(--surface)
thumbnail height: 130px
body padding: 12px 16px 16px
gap between cards: 8px
```
- Tag chips: `9px DM Mono`, `padding: 2px 7px`, `border-radius: 4px`, `background: var(--surface2)`
- CTA button (dark): `background: var(--text)`, `color: var(--bg)`, `padding: 6px 12px`, `border-radius: 5px`
- CTA button (muted): `background: var(--surface2)`, `color: var(--muted)`

### Career Timeline Cards
```
border-radius: 7px
background: var(--surface)  ← same for both work and education
border: 1px solid var(--border)  ← no color accent
padding: 8px 12px
font-size: 12px Inter 400
subtitle: 8px DM Mono, color var(--muted)
```
- No colored left-border accent strips.
- Work column: left 60%, right 40%+ gap.
- Education column: right 40%.
- Today dot: `9px`, `#ef4444`, `box-shadow: 0 0 0 3px rgba(239,68,68,0.18)`.

### Testimonial Cards
```
border-radius: 12px
background: var(--surface)  ← no tinted colors
padding: 20px
quote mark: 28px, opacity 0.15
body: 14px, line-height 1.7
avatar: 36×36px circle, background rgba(0,0,0,0.08)
```

### AI Exploration Items
```
border-bottom: 1px solid var(--border)
padding: 24px 0
status badge: background = color + "18" opacity, text = color, 8px DM Mono uppercase
```

### Buttons (CTA)
```
primary: background var(--text), color var(--bg), padding 10px 20px, border-radius 7px, 13px Inter
secondary: background var(--surface2), color var(--muted), same sizing
hover: opacity 0.75
```

---

## 5. Layout Principles

### Spacing Scale
Use only these values: `4px · 6px · 8px · 12px · 16px · 20px · 24px · 32px · 48px`

### Panels Container
```
padding: 0 0 16px 24px  (top flush, 24px left, right flush)
gap: 8px between panels
```

### Panel Widths
| Panel | min-width | width |
|-------|-----------|-------|
| About | 380px | 420px |
| Work | 380px | 440px |
| Career | 380px | 420px |
| Testimonials | 360px | 400px |
| AI Explorations | 360px | 400px |

### About Panel
```
content padding: 28px 24px 48px
info row padding: 12px 0
```

### Info Rows
- Label + dashed rule on same line: `1px dashed var(--border)` extending right.
- Value text below: `14px Inter`, `color: var(--muted2)`.

---

## 6. Depth & Elevation

Two levels only:
1. **Chrome** — `#eeeeed` outer shell, no shadow.
2. **Panel cards** — `box-shadow: 0 1px 3px rgba(0,0,0,0.05), 0 4px 20px rgba(0,0,0,0.04)`. Subtle lift, not dramatic.

No drop shadows on elements within cards. Hierarchy within cards is achieved through color (`--text` vs `--muted` vs `--muted2`), size, and spacing only.

---

## 7. Animation & Interaction

```
--ease-expo: cubic-bezier(0.22, 1, 0.36, 1)
--dur-fast: 180ms
--dur-base: 320ms
--dur-slow: 650ms
```

- Framer Motion `whileInView` with `viewport: { once: true }` for scroll-triggered reveals.
- Stagger: `0.05–0.08s` between children.
- Hover on work cards: `whileHover={{ y: -2 }}`, spring `stiffness: 300, damping: 30`.
- Link hover: `opacity: 0.5` (no underlines, no color change for nav-level links).
- Nav arrows: `background` transition on hover only.

---

## 8. Do's and Don'ts

### Do
- Use whitespace as a design element — more is almost always better.
- Let content breathe: `24px` padding inside panels, `8px` gaps between cards.
- Use DM Mono for all metadata — dates, labels, tags, panel headers.
- Keep Inter weights at 300 (hero) or 400 (everything else).
- Use negative letter-spacing (`-0.01em` to `-0.03em`) on all Inter text.
- Align nav name horizontally with the first panel's content left edge.
- Keep all borders `1px solid var(--border)` — no colored borders.
- Use `border-radius: 18px` for panels, `12px` for cards, `7–8px` for small elements.

### Don't
- Don't add color to cards, borders, or backgrounds beyond the token set.
- Don't use font weights above 400 anywhere in the UI.
- Don't add shadows within cards — elevation is a panel-level concept only.
- Don't add decorative icons, illustrations, or gradients.
- Don't use tinted/colored card backgrounds (testimonials, career, etc.).
- Don't add left-border accent strips to timeline cards.
- Don't use `border-radius` above 18px.
- Don't mix shorthand and longhand border properties on the same element (causes React warning).

---

## 9. Agent Prompt Guide

**Quick references for AI:**
- Primary bg: `#ffffff` (panels) / `#eeeeed` (chrome)
- Text: `#0a0a0a` | Muted: `#737373` | Subtle body: `#404040`
- Border: `#e5e5e5` | Surface: `#f5f5f5` | Surface2: `#ebebeb`
- Body font: `Inter 400` | Mono font: `DM Mono 400`
- Animation ease: `cubic-bezier(0.22, 1, 0.36, 1)`

**Prompt templates:**

> "Build this component following AWESOME_DESIGN.md. Use Inter 400, DM Mono for labels, white panels on #eeeeed chrome, 1px border var(--border), no color accents, spacing from the 8/12/16/24/32/48px scale."

> "Add a new panel. Use PanelHeader for the sticky label, 24px horizontal content padding, 8px card gaps, border-radius 12px cards on surface background."

> "Fix spacing. Apply the spacing scale: 8, 12, 16, 24, 32, 48px only. Remove any odd values like 14px, 28px, 33px, 40px."
