"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { GrainGradient } from "@paper-design/shaders-react";

/* ── Selected Work thumbnail grain ────────────────────────────
   Paper's grain-gradient shader (shaders.paper.design/grain-gradient),
   run as a *treatment* rather than as the picture. It sits above the
   screenshot inside the 6px matte and modulates light across it, so the
   card gains slow motion without the work underneath losing legibility.

   Why soft-light rather than a plain overlay: soft-light lets the light
   stops in the palette brighten and the dark stops darken, which reads
   as a sheen crossing the surface. A normal-blend colour field over a
   product screenshot reads as a tint, which is exactly what this card
   cannot afford — the screenshot is the evidence.

   The palette is deliberately near-neutral. --accent-warm appears once,
   as the single chromatic stop, matching how the accent is used
   everywhere else on the site: punctuation, not colour.

   Motion cost: the library mounts one WebGL canvas per instance but
   already pauses on IntersectionObserver and on `visibilitychange`, so
   off-screen cards cost nothing. It does NOT read prefers-reduced-motion
   — that gate is ours, below. */

/* Near-neutral stops plus one warm note. Same palette in both themes;
   only the layer opacity changes, because soft-light is symmetric —
   it lightens against a dark ground and darkens against a light one. */
const GRAIN_COLORS = ["#ffffff", "#e8e4dc", "#c9c9c4", "#8a8a84", "#d17b53"];

/* Opacity is the only theme-dependent value. Dark thumbnails sit on a
   dark panel and need less help to read as lit; at the light value the
   sheen turned into visible haze. */
/* Set by measurement, not by eye. Screenshotting the panel with this
   layer shown and hidden, then differencing the thumbnail region, gives
   the layer's actual contribution in 0-255 terms:

     opacity 0.14  ->  mean 2, max 7     (below the threshold; invisible)
     opacity 0.30  ->  mean 4, max 15    (present but easy to miss)
     opacity 0.34  ->  mean 5, max 18    (reads as a moving sheen)

   Worth recording because the eye is unreliable here: several of the
   source JPEGs are themselves halftoned or heavily textured, so this
   layer gets blamed for pattern it did not draw. */
const OPACITY = {
  photo: { light: 0.34, dark: 0.26 },
  /* The AI Experiments card is a flat #74aa9c field with no photo to
     protect, so the shader can carry more of the surface there. */
  field: { light: 0.5, dark: 0.42 },
} as const;

export default function ThumbnailGrain({
  index,
  variant = "photo",
}: {
  /** Card position. Varies rotation, scale and the static frame so the
      six thumbnails never drift in lockstep. */
  index: number;
  variant?: "photo" | "field";
}) {
  const [isDark, setIsDark] = useState(false);
  const reduceMotion = useReducedMotion();

  /* Same data-theme observer the other generative thumbnails use. */
  useEffect(() => {
    const check = () => setIsDark(document.documentElement.dataset.theme === "dark");
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  const opacity = OPACITY[variant][isDark ? "dark" : "light"];

  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        opacity,
        mixBlendMode: "soft-light",
        /* Theme swaps run at 420ms elsewhere; match that so the layer
           does not step while the surface under it is still moving. */
        transition: "opacity 420ms var(--ease-expo)",
      }}
    >
      <GrainGradient
        width="100%"
        height="100%"
        colors={GRAIN_COLORS}
        colorBack="#00000000"
        /* wave is the calmest of the seven shapes — one slow swell
           rather than a repeating motif that would read as a pattern
           laid over the work. */
        shape="wave"
        softness={0.95}
        /* Distortion between bands. Above ~0.25 the swell stops being a
           swell and starts breaking the field into separate blotches. */
        intensity={0.18}
        /* The grain itself — the part of the shader this was actually
           about, so it keeps its weight while the colour is dialled
           down around it. Grain is computed against gl_FragCoord and
           u_resolution rather than the graphic, so it lands coarser in
           a 360×189 box than in the 1280×720 demo on Paper's site. */
        noise={0.3}
        /* Reduced motion keeps the texture and drops the movement: a
           fixed frame renders one still field instead of freezing at
           whatever moment the toggle happened to catch. */
        speed={reduceMotion ? 0 : 0.12}
        frame={reduceMotion ? 1000 + index * 700 : undefined}
        scale={1.1 + index * 0.06}
        rotation={(index * 37) % 360}
        /* Cap the render at roughly 1× the thumbnail's CSS box. This is
           a diffuse sheen, not detail — paying for a 2× buffer on six
           simultaneous canvases buys nothing visible. */
        maxPixelCount={400 * 225}
        style={{ display: "block", width: "100%", height: "100%" }}
      />
    </div>
  );
}
