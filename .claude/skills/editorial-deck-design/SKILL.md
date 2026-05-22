---
name: editorial-deck-design
description: Use when editing the /system/deck slides or related portfolio surfaces. Captures the visual-hierarchy rules, slide composition patterns, and the Painted Lady metaphor that the design system is built around. Loading this skill is required before adding or substantially changing any deck slide.
---

# Editorial deck design

## The system has a source

The design system is presented as a style guide whose colors, restraint, and
discipline are **sourced from a single specimen**: a Painted Lady butterfly
(*Vanessa cardui*). This is not decoration. It is the spine of the manifesto:

- Cocoon → struggle (Origin slide tells the fable).
- Pigment → palette (Specimen + Palette slides show the wing as the source).
- Migration → multi-generational discipline (no single butterfly completes
  the Painted Lady migration; the system was likewise built across many
  failed iterations).

Anything you add must respect this metaphor — or explicitly stand apart
from it. Don't add visual flourishes that compete with it.

## Wing → token map (memorise this)

| Wing zone                          | Hex      | Token                |
| ---------------------------------- | -------- | -------------------- |
| Forewing terracotta wash           | #d17b53  | `--accent-warm`      |
| Wing margin (deep brown-black)     | #1d1d1f  | `--text`             |
| Submarginal white pupil spots      | #ffffff  | `--bg`               |
| Wing veins / smoky bands           | #6e6e73  | `--muted`            |
| Body / antennae / deepest ink      | #424245  | `--muted2`           |
| Cream patch near body              | #f5e9d3  | reserved (no token)  |

The cream patch is intentionally absent from the token system — the system
uses **a subset** of the wing's pigments, the ones with a job to do. Don't
add a cream token unless you have a real role for it.

## Slide composition rules

### Two slide shells

- **`HeroSlide`** — full canvas, no card chrome. Use for **signature moments**:
  Intro, Origin, Specimen, Palette, Manifesto closes. ~1 in 3 slides max.
- **`SlidePanel`** — bounded panel with `tint="surface" | "chrome"`. Use for
  documentary content: tokens, components, examples. The majority.

Alternating Hero ↔ Panel gives the deck rhythm. Two HeroSlides in a row is
allowed only when narratively justified (Origin → Specimen, for example).

### Visual hierarchy ladder

Every slide must have a clear single primary element. The ladder, top → bottom:

1. **Eyebrow** — mono caps, `--text-eyebrow` (9px), `--muted2`, 0.08–0.14em
   tracking. Always present. Labels the slide ("06 · Specimen").
2. **Title** — body font (`--font-body`, Inter), weight 300, large clamp scale
   (40-72px on HeroSlide; 26-44px on SlidePanel). One sentence, manifesto
   register. Letter-spacing -0.025em to -0.035em.
3. **Lead** — body font, `--text-title-sm` (16px) to `--text-lead` (15px),
   line-height 1.7, `--muted2` colour. The "deck" of the slide.
4. **Body** — `--text-body` (13px), `--muted`, line-height 1.6. Supporting
   prose.
5. **Mono captions / hex callouts** — `--font-mono`, `--text-mono` (10px),
   `--muted2`, 0.12em tracking. For technical annotation.

The contrast between (2) and (4) is what makes a slide feel editorial. If
they're the same size or the same color, the slide reads as documentation,
not manifesto. Push title up, body down.

### Don't compete with the metaphor

- The Painted Lady mark (small SVG glyph) appears once per slide MAX,
  usually in the rail or as a section ornament. It is not a watermark.
- The full Specimen plate appears on exactly **one** slide.
- Terracotta (`--accent-warm`) is the only chromatic accent. Don't introduce
  rivals. Greens / reds / yellows from `--accent-*` are for status only, never
  decoration.

## The butterfly mark

`components/PaintedLady.tsx` exports two variants:

- `<PaintedLadyMark size={...} />` — silhouette glyph, single fill via
  `currentColor`. Use for the rail ornament, Origin slide, footer marks.
- `<PaintedLadySpecimen />` — annotated specimen plate. Use exactly once,
  on the Specimen slide.

Never inline a butterfly SVG elsewhere — go through this component so the
metaphor stays consistent if it evolves.

## Adding a new slide — checklist

1. Decide HeroSlide vs SlidePanel based on signature-vs-documentary.
2. Add the id to `SLIDES` and to a `TOC_GROUPS` group.
3. Use the hierarchy ladder. Eyebrow + title at minimum.
4. If the slide introduces an accent colour, justify it against the wing
   palette. If you can't, don't.
5. Verify with a screenshot at 1440×900 before committing. Editorial work
   has to be **looked at**, not just typechecked.

## What this skill is NOT

- Not a license to redesign the whole site. Surface remains
  `/system/deck`. Wider portfolio uses the same tokens but its own
  compositions.
- Not a permission to ship without screenshots. Always verify.
- Not a place for new tokens. Add tokens to `app/globals.css` only when a
  real UI role requires them.
