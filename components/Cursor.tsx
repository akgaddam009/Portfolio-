"use client";

import { useEffect, useRef, useState } from "react";

export default function Cursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [visible,  setVisible]  = useState(false);
  const [isTouch,  setIsTouch]  = useState<boolean | null>(null);

  // Detect touch-only devices — cursor is irrelevant there
  useEffect(() => {
    setIsTouch(window.matchMedia("(hover: none)").matches);
  }, []);

  useEffect(() => {
    if (isTouch !== false) return; // wait until we know it's a pointer device

    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0, frame: number;
    const HALF = 18; // half of fixed 36px ring — constant, no centering jitter
    // Local object instead of closing over `visible` state — avoids stale closure
    // where setVisible(true) would fire on every mousemove.
    const shown = { value: false };

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX; mouseY = e.clientY;
      if (!shown.value) { shown.value = true; setVisible(true); }
      if (dotRef.current)
        dotRef.current.style.transform = `translate(${mouseX - 3}px, ${mouseY - 3}px)`;
    };

    const HOVER_SELECTOR = "a, button, [role='button']";
    const hovered = { value: false };

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const animate = () => {
      ringX = lerp(ringX, mouseX, 0.15);
      ringY = lerp(ringY, mouseY, 0.15);
      if (ringRef.current)
        ringRef.current.style.transform = `translate(${ringX - HALF}px, ${ringY - HALF}px)`;

      // Detect hover via elementFromPoint each frame — immune to element
      // transforms (e.g. Framer whileHover lifts) that fire spurious
      // mouseover/mouseout events even when the mouse hasn't moved.
      const el = document.elementFromPoint(mouseX, mouseY) as Element | null;
      const over = !!(el?.closest?.(HOVER_SELECTOR));
      if (over !== hovered.value) {
        hovered.value = over;
        if (ringRef.current) ringRef.current.style.borderColor = over ? "var(--muted)" : "var(--border)";
        if (dotRef.current)  dotRef.current.style.opacity = over ? "0" : "1";
      }

      frame = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    frame = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(frame);
    };
  }, [isTouch]);

  // Nothing to render on touch devices or during the one-frame isTouch detection
  if (isTouch !== false) return null;

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden
        style={{
          position: "fixed", top: 0, left: 0,
          width: "6px", height: "6px", borderRadius: "50%",
          background: "var(--text)", pointerEvents: "none",
          zIndex: 9999,
          opacity: visible ? 1 : 0, transition: "opacity 0.3s",
          willChange: "transform",
        }}
      />
      <div
        ref={ringRef}
        aria-hidden
        style={{
          position: "fixed", top: 0, left: 0,
          width: "36px", height: "36px", borderRadius: "50%",
          border: "1px solid var(--border)", pointerEvents: "none",
          zIndex: 9998,
          opacity: visible ? 1 : 0, transition: "border-color 0.2s, opacity 0.3s",
          willChange: "transform",
        }}
      />
    </>
  );
}
