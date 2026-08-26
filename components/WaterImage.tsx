"use client";

/* Water shader over a still image, from @paper-design/shaders-react.

   Built to the same shape as DitheredImage: the shader mounts only once the
   element is near the viewport, and a plain <img> renders in exactly the same
   box whenever it does not. The treatment is an enhancement over a working
   image, never a prerequisite for one.

   One deliberate difference. DitheredImage runs at speed 0 -- it renders a
   single frame and stops, so there is no ongoing GPU work. Water is an
   animation, so it keeps drawing for as long as it is mounted. That is the
   point of it, but it is also why `active` is driven by an IntersectionObserver
   that both mounts AND unmounts: a card scrolled off screen stops costing
   anything, rather than animating forever behind the fold.

   prefers-reduced-motion skips the shader entirely. A continuously moving
   surface is precisely what that setting exists to stop, and the still photo
   is the calmer result. */

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Water } from "@paper-design/shaders-react";

export type WaterImageProps = {
  src: string;
  alt?: string;
  /** Rounding applied to both the shader canvas and the fallback image. */
  radius?: string;
  colorBack?: string;
  colorHighlight?: string;
  highlights?: number;
  layering?: number;
  edges?: number;
  waves?: number;
  caustic?: number;
  size?: number;
  speed?: number;
  scale?: number;
  fit?: "none" | "contain" | "cover";
  style?: CSSProperties;
  className?: string;
};

export function WaterImage({
  src,
  alt = "",
  radius = "6px",
  /* Defaults are the values Arun dialled in on Paper's playground. */
  colorBack = "#8f8f8f",
  colorHighlight = "#ffffff",
  highlights = 0.08,
  layering = 0.5,
  edges = 0.38,
  waves = 0,
  caustic = 0.01,
  size = 1,
  speed = 1,
  scale = 0.8,
  fit = "contain",
  style,
  className,
}: WaterImageProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return;

    const io = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      /* Enough margin that it is running by the time the card settles, without
         mounting shaders three screens away. */
      { rootMargin: "200px" },
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
        <Water
          image={src}
          colorBack={colorBack}
          colorHighlight={colorHighlight}
          highlights={highlights}
          layering={layering}
          edges={edges}
          waves={waves}
          caustic={caustic}
          size={size}
          speed={speed}
          scale={scale}
          fit={fit}
          style={box}
        />
      ) : (
        <img src={src} alt={alt} loading="lazy" decoding="async" style={box} />
      )}
    </div>
  );
}
