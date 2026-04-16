"use client";

import { useEffect, useRef, useState } from "react";

export default function Cursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0, ringSize = 36, frame: number;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX; mouseY = e.clientY;
      if (!visible) setVisible(true);
      if (dotRef.current)
        dotRef.current.style.transform = `translate(${mouseX - 3}px, ${mouseY - 3}px)`;
    };

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const animate = () => {
      ringX = lerp(ringX, mouseX, 0.11);
      ringY = lerp(ringY, mouseY, 0.11);
      // always centre on cursor using current ring size
      if (ringRef.current)
        ringRef.current.style.transform = `translate(${ringX - ringSize / 2}px, ${ringY - ringSize / 2}px)`;
      frame = requestAnimationFrame(animate);
    };

    const onEnter = () => {
      ringSize = 40;
      if (ringRef.current) { ringRef.current.style.width = "40px"; ringRef.current.style.height = "40px"; ringRef.current.style.borderColor = "rgba(10,10,10,0.5)"; }
      if (dotRef.current) dotRef.current.style.opacity = "0";
    };
    const onLeave = () => {
      ringSize = 36;
      if (ringRef.current) { ringRef.current.style.width = "36px"; ringRef.current.style.height = "36px"; ringRef.current.style.borderColor = "rgba(10,10,10,0.15)"; }
      if (dotRef.current) dotRef.current.style.opacity = "1";
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    frame = requestAnimationFrame(animate);

    const attach = () => {
      document.querySelectorAll("a, button, [role='button']").forEach(el => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
      });
    };
    attach();
    const obs = new MutationObserver(attach);
    obs.observe(document.body, { childList: true, subtree: true });

    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(frame); obs.disconnect(); };
  }, []);

  return (
    <>
      <div ref={dotRef} style={{ position: "fixed", top: 0, left: 0, width: "6px", height: "6px", borderRadius: "50%", background: "var(--text)", pointerEvents: "none", zIndex: 9999, opacity: visible ? 1 : 0, transition: "opacity 0.3s", willChange: "transform" }} aria-hidden />
      <div ref={ringRef} style={{ position: "fixed", top: 0, left: 0, width: "36px", height: "36px", borderRadius: "50%", border: "1px solid rgba(10,10,10,0.15)", pointerEvents: "none", zIndex: 9998, opacity: visible ? 1 : 0, transition: "width 0.3s cubic-bezier(0.22,1,0.36,1), height 0.3s cubic-bezier(0.22,1,0.36,1), border-color 0.25s, opacity 0.3s", willChange: "transform" }} aria-hidden />
    </>
  );
}
