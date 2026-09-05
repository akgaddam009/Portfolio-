---
name: Arun Gaddam Portfolio
description: A warm, light-first editorial workspace of horizontally scrolling panels, built on one typeface and a dense type scale.
colors:
  canvas-light: "#f5f5f5"
  page-light: "#ffffff"
  surface-light: "#ffffff"
  surface-inset-light: "#f5f5f7"
  border-light: "#d2d2d7"
  ink-light: "#1d1d1f"
  ink-display-light: "#3a3a3c"
  ink-secondary-light: "#6e6e73"
  ink-body-light: "#424245"
  about-headline-light: "#113264"
  canvas-dark: "#000000"
  page-dark: "#1a1918"
  surface-dark: "#242422"
  surface-inset-dark: "#2e2e2b"
  border-dark: "#383836"
  ink-dark: "#ffffff"
  ink-display-dark: "#e8e8ed"
  ink-secondary-dark: "#8f8f97"
  ink-body-dark: "#a1a1aa"
  about-headline-dark: "#9fb2d1"
  success: "#34c759"
typography:
  display:
    fontFamily: "Manrope, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "clamp(26px, 4vw, 44px)"
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Manrope, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "clamp(20px, 2.2vw, 24px)"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Manrope, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "18px"
    fontWeight: 500
    lineHeight: 1.35
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Manrope, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "-0.01em"
  label:
    fontFamily: "Manrope, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "10px"
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: "0.1em"
rounded:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  pill: "9999px"
spacing:
  "1": "4px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "5": "20px"
  "6": "24px"
  "7": "32px"
  "8": "44px"
  "9": "48px"
  "10": "64px"
  "11": "96px"
components:
  panel:
    backgroundColor: "{colors.surface-light}"
    textColor: "{colors.ink-light}"
    rounded: "{rounded.lg}"
    padding: "0"
  card:
    backgroundColor: "{colors.surface-light}"
    textColor: "{colors.ink-light}"
    rounded: "{rounded.lg}"
    padding: "16px"
  chip:
    backgroundColor: "{colors.surface-inset-light}"
    textColor: "{colors.ink-body-light}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
  eyebrow:
    textColor: "{colors.ink-secondary-light}"
    typography: "{typography.label}"
---

# Design System: Arun Gaddam Portfolio

## Overview

**Creative North Star: Warm Precision.**

The phrase is the project's own — PRODUCT.md names it as a design principle: "Linear-inspired rigour (tight typography, consistent tokens, intentional hierarchy) softened by warmth (off-white backgrounds, human copy, the availability dot that pulses like a heartbeat)."

This is a portfolio that argues by construction. Its audience is design-literate and spends two to five minutes deciding whether to make contact, so the artefact has to survive the same scrutiny as the case studies inside it. The consequence is a system that is quiet on arrival and rewards inspection: nothing announces itself, everything holds up close.

The organising idea is the **panel** — the site is a horizontally scrolling row of five fixed-width columns rather than a vertical page. Each panel is a self-contained surface with its own header and scroll. Space between panels equals space inside them, so the row reads as one continuous rhythm instead of five boxes.

Restraint is load-bearing, not stylistic. The type scale runs dense and small (8px to 44px, thirteen steps, most of it between 8 and 18), colour is almost entirely achromatic, and the single chromatic token is reserved for one headline. What makes it feel designed is consistency and tightness, not incident.

**Anti-references** (from PRODUCT.md): full-screen video heroes; over-animated Awwwards showcases where motion is the product; generic Framer/Webflow dark-card-grid templates; clinical SaaS white that feels like a hospital.

## Colors

The palette is achromatic by design. There is no brand accent in the usual sense — the only chromatic colour in the entire interface is the About headline, and it appears once.

Both themes are complete and switch on a `data-theme` attribute set on `<html>` before first paint. **Dark is not an inversion.** Light is cool-neutral (Apple-grey lineage); dark is deliberately *warm* — `#1a1918` panels on a pure-black canvas, with a parchment-toned hover ink. Translating a colour between themes means re-choosing it, not flipping it: `--about-h1` goes `#113264` → `#9fb2d1` because a deep navy would vanish on a warm dark panel.

| Role | Light | Dark | Notes |
|---|---|---|---|
| Canvas | `#f5f5f5` | `#000000` | The ground panels float on |
| Page / panel | `#ffffff` | `#1a1918` | Panel fill |
| Surface | `#ffffff` | `#242422` | Cards; in dark, a wider gap from panel for visible elevation |
| Surface inset | `#f5f5f7` | `#2e2e2b` | Hover, inset, chips |
| Border | `#d2d2d7` | `#383836` | Opaque hairlines — not semi-transparent white |
| Ink | `#1d1d1f` | `#ffffff` | Titles and primary text |
| Ink display | `#3a3a3c` | `#e8e8ed` | Large display type — softer than ink on purpose; max contrast at display size reads as harsh |
| Ink secondary | `#6e6e73` | `#8f8f97` | Eyebrows, metadata |
| Ink body | `#424245` | `#a1a1aa` | Body copy, descriptions, bullets |
| About headline | `#113264` | `#9fb2d1` | The only chromatic colour in the system |
| Success | `#34c759` | `#34c759` | Status only |

**Contrast is a constraint, not an afterthought.** Every text token clears WCAG AA against its surface, and the token comments record the measured ratios. `--muted` in dark is documented at ≈4.9:1 on `#1a1918`.

## Typography

**One family: Manrope.** Body, mono and logo all resolve to it, loaded via `next/font/google` at weights 300, 400, 500, 600 with `display: swap`.

The critical thing an agent must know: **`--font-mono` is not a monospaced family.** Manrope publishes no mono cut. `--font-mono` is a *style tier* — uppercase, `letter-spacing: 0.1em`, small size — used for eyebrows and labels. It does not have fixed advance width. Anything needing true monospace (a character grid, ASCII, code) must name real mono faces directly; `var(--font-mono)` will not do it, and does not resolve inside a canvas font string at all.

Weights in practice: **400 for reading, 500 for emphasis and navigation**, 600 once. 300 is loaded but effectively unused. Two weights carry the whole interface.

The scale is dense and small, because the panels are narrow (340–440px) and information-rich:

| Token | Size | Use |
|---|---|---|
| `--text-micro` | 8px | Tiniest eyebrows in dense cards |
| `--text-eyebrow` | 9px | Section eyebrows |
| `--text-mono` / `-lg` | 10 / 11px | Mono-tier labels |
| `--text-caption` | 12px | Captions, secondary bullets |
| `--text-body` | 13px | Default body |
| `--text-body-lg` | 14px | Card headlines |
| `--text-lead` | 15px | Lead paragraphs |
| `--text-title-sm` / `--text-title` | 16 / 18px | Card and section titles |
| `--text-title-lg` | `clamp(20px, 2.2vw, 24px)` | Panel titles |
| `--text-display` | `clamp(26px, 4vw, 44px)` | Hero |

Negative letter-spacing scales with size: `-0.01em` at body, `-0.02em` at title, `-0.03em` at display. Line-height runs tight at display (1.15) and generous at body (1.5–1.65).

## Layout

**Horizontal panel row, not a vertical page.** Five panels of fixed width — About 420, Career 420, Work 440, Testimonials 400, Contact 380 — each with a `minWidth` floor, in a horizontally scrolling flex container at `calc(100dvh - 72px)`.

**The 24px interval is the system.** Gap between panels, panel inner gutter and container left padding are all 24px, so the space between two panels reads as the same interval as the space inside one. `scrollPaddingLeft` matches.

Scroll-snap is deliberately **off** — `proximity` tugged the scroll mid-gesture and made it feel jerky. Free scrolling, with nav arrows and keyboard doing clean `behavior: smooth` jumps instead. `overscrollBehaviorX: contain` stops browser back-swipe stealing the gesture.

**Mobile stacks vertically** at a 12px gap; scroll-snap and panel dots are disabled.

Spacing is a 4px ladder from 4 to 96px. `--space-8` is 44px and is not arbitrary: it is the WCAG 2.5.5 touch-target floor, and it is a spacing token so the constraint stays visible in layout code.

## Elevation & Depth

**Layered, not flat — and the two themes solve it differently.**

Light separates surfaces by *tone*: panels are white on a `#f5f5f5` canvas, so elevation reads from the value step. Dark cannot do that — a warm dark card on a warm dark panel needs help — so it separates by *ring and shadow*, with an inset white highlight along the top edge simulating a light source.

Shadows are multi-layer and composed, never a single blur:

```
--panel-shadow:        inset 0 1px 0 rgba(255,255,255,0.08),
                       0 1px 2px rgba(0,0,0,0.20),
                       0 6px 24px rgba(0,0,0,0.18);
--panel-shadow-active: inset 0 1px 0 rgba(255,255,255,0.11),
                       0 2px 4px rgba(0,0,0,0.25),
                       0 12px 40px rgba(0,0,0,0.22);
```

The active panel carries a distinctly heavier stack — elevation signals focus, not just depth. In dark, cards additionally carry a `0 0 0 1px rgba(255,255,255,0.08)` ring, because a shadow alone does nothing against near-black.

Motion easing is shared: `--ease-expo: cubic-bezier(0.22, 1, 0.36, 1)` is the house curve. Backgrounds transition at 420ms, text at 320ms — larger surfaces need more time to feel intentional. `prefers-reduced-motion` is honoured.

## Shapes

Squared-off and calm. Nothing is a lozenge except things that should be.

| Token | Value | Use |
|---|---|---|
| `--radius-xs` | 4px | Hairline rounds — scrollbar, focus ring |
| `--radius-sm` | 8px | Small buttons, mono labels |
| `--radius-md` | 12px | Default card / panel |
| `--radius-lg` | 16px | Large card, hero media |
| `--radius-xl` | 24px | Feature media |
| `--radius-pill` | 9999px | Chips only |

16px is the most-used value in practice. Cards whose media meets the card edge use `16px 16px 0 0` so the top corners match the container and the bottom stays square against the body.

Borders are **opaque hairlines** (`#d2d2d7` / `#383836`), not semi-transparent white. In light theme, `--surface` and `--bg` are both `#ffffff`, so a border is the only thing defining a card edge — it cannot be decorative.

## Components

**Panel.** Fixed width, own header, own scroll, `--radius-lg`, shadow stack from the elevation set with a heavier variant when active. Order lives in a single `PANEL_CONFIGS` array from which nav dots, arrows, keyboard navigation and the mobile menu all derive — one source, no drift.

**Card.** `--surface` fill, hairline border, `--radius-lg`, 16px padding. Hover lifts the shadow one step. Cards that expand use `role="button"`, `tabIndex={0}`, `aria-expanded`, and Enter/Space handling — a div with an onClick is not a control.

**Chip.** `--surface2` fill, no hairline, `--radius-pill`, 12px caption type. Used for concrete nouns (industries, tools) and never for abstract capabilities — pill shapes imply toggling, and eleven pills of different widths wrap into a ragged mosaic with no scan order. Capabilities are set as flowing prose instead.

**Eyebrow.** The mono style tier: `--text-eyebrow` or `--text-mono`, uppercase, `0.1em` tracking, `--muted`. Shared across every section header, which is what makes the panels read as one system.

**Body copy.** `--muted2` at `--text-caption` or `--text-body`, line-height 1.5–1.65. Within a single card, all body copy uses one ink — `--text` is reserved for the title. Mixing `--text` and `--muted2` as body in the same card is invisible in light (17 L\* apart) and obvious in dark (33.5 L\*).

## Do's and Don'ts

**Do**
- Use tokens for every colour. There should be no hex in component code.
- Keep 24px as the layout interval — panel gap, gutter, scroll padding.
- Reserve `--text` for titles; body copy is `--muted2`.
- Re-choose colours per theme rather than inverting them.
- Give expanding or clickable non-button elements `role`, `tabIndex`, `aria-expanded` and key handling.
- Compose shadows in layers, with an inset highlight on dark.
- Give images intrinsic `width`/`height` so they reserve their box.
- Check contrast against the *actual* surface and record the ratio in a comment.

**Don't**
- Don't use `var(--font-mono)` expecting fixed advance width — it is Manrope with tracking. Name real mono faces when you need a grid.
- Don't add a second chromatic accent. `--about-h1` is the only one, used once.
- Don't animate `width`, `height`, `padding` or `margin`. Use transform and opacity.
- Don't put chips around abstract capabilities.
- Don't reach for max contrast at display sizes — `--text-display` is deliberately softer than `--text`.
- Don't re-enable scroll-snap on the panel row.
- Don't introduce full-bleed video heroes, showcase motion, or dark-card-grid template patterns. They are named anti-references.
