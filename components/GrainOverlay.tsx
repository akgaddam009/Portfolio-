"use client";

import { useEffect, useRef } from "react";

export default function GrainOverlay() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Generate a single 256×256 noise texture once — tiled by CSS
    const size = 256;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const img = ctx.createImageData(size, size);
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const v = (Math.random() * 255) | 0;
      d[i] = d[i + 1] = d[i + 2] = v;
      d[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    if (ref.current) {
      ref.current.style.backgroundImage = `url(${canvas.toDataURL()})`;
    }
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="grain-overlay"
    />
  );
}
