"use client";

import { useEffect, useRef } from "react";

const RADIUS = 340; // half of the glow circle diameter

/**
 * Cursor spotlight — follows the mouse via transform: translate()
 * so position updates are handled by the GPU compositor and never
 * trigger layout or paint. Changing `background` on every mousemove
 * (the naive approach) causes continuous repaints that make the
 * cursor feel choppy.
 */
export default function CursorGlow() {
  const circleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = circleRef.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      // Center the circle on the cursor — GPU composited, zero paint cost
      el.style.transform = `translate(${e.clientX - RADIUS}px, ${e.clientY - RADIUS}px)`;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 40,
      }}
    >
      <div
        ref={circleRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width:  RADIUS * 2,
          height: RADIUS * 2,
          borderRadius: "50%",
          background: "radial-gradient(circle, var(--glow-color) 0%, transparent 70%)",
          willChange: "transform",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
