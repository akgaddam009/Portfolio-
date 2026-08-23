"use client";

/* Dithered image treatment built on @paper-design/shaders-react.

   Why a wrapper rather than dropping <ImageDithering> in at each call site:

   1. WebGL contexts are a capped resource (browsers allow roughly 8-16, and
      the oldest is dropped when the cap is hit). This site already runs a
      MapLibre context in the Contact panel, and the Testimonials panel alone
      wants five avatars. Mounting them all at once is how avatars start
      rendering blank on Safari. So the shader mounts only while the element is
      actually on screen, and unmounts when it leaves.

   2. Until it mounts -- and if WebGL is unavailable, or the visitor prefers
      reduced motion -- a plain <img> renders in exactly the same box. The
      shader is an enhancement over a working image, never a prerequisite for
      one.

   `speed` defaults to 0: this is an image treatment, not an animation. At zero
   the shader renders one frame and stops, so there is no continuous GPU work
   and nothing for prefers-reduced-motion to object to.

   `size` here is a dither grid in ACTUAL PIXELS (0.5 to 20), so the value
   scales with how large the element is on screen, not with its aspect. */

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ImageDithering } from "@paper-design/shaders-react";

type DitheringType = "random" | "2x2" | "4x4" | "8x8";

export type DitheredImageProps = {
  src: string;
  alt?: string;
  /** Rounding applied to both the shader canvas and the fallback image. */
  radius?: string;
  /** Dither grid coarseness in px, 0.5-20. Small elements need small values. */
  size?: number;
  /** Bayer matrix / noise mode. 8x8 is the smoothest. */
  type?: DitheringType;
  /** 1-7. Higher keeps more tonal range, so less banding. */
  colorSteps?: number;
  /** Keep the photo's own colours rather than a two-tone palette. */
  originalColors?: boolean;
  style?: CSSProperties;
  className?: string;
};

export function DitheredImage({
  src,
  alt = "",
  radius = "50%",
  size = 2,
  type = "8x8",
  colorSteps = 6,
  originalColors = true,
  style,
  className,
}: DitheredImageProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;

    /* Reduced motion also opts out of the shader entirely. Even at speed 0 the
       swap from <img> to canvas is a visible change of appearance, and the
       plain photo is the calmer result. */
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return;

    const io = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      /* A little margin so the shader is ready by the time the panel settles,
         without mounting things three screens away. */
      { rootMargin: "200px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const box: CSSProperties = {
    width: "100%",
    height: "100%",
    borderRadius: radius,
    objectFit: "cover",
    display: "block",
  };

  return (
    <div
      ref={hostRef}
      className={className}
      style={{ position: "relative", overflow: "hidden", borderRadius: radius, ...style }}
    >
      {active ? (
        <ImageDithering
          image={src}
          type={type}
          size={size}
          colorSteps={colorSteps}
          originalColors={originalColors}
          speed={0}
          fit="cover"
          style={box}
        />
      ) : (
        <img src={src} alt={alt} loading="lazy" decoding="async" style={box} />
      )}
    </div>
  );
}
