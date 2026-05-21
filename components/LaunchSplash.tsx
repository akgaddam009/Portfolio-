"use client";

import { useEffect, useRef, useState } from "react";

/* Launch splash — particle-typography "Arun Gaddam" that assembles from
   random positions, reacts to cursor, then dismisses. Shown once per
   session (sessionStorage flag) so it doesn't reappear on every nav.

   - Targets sampled from an offscreen canvas at CSS pixel resolution
   - Particles spring toward targets with friction + cursor repel field
   - Auto-dismisses after ~3s (or on click) with a soft fade
   - prefers-reduced-motion: particles snap to position, no repel, faster fade
   - Theme-aware via --text and --bg tokens */
export default function LaunchSplash() {
  const [show, setShow] = useState(true);
  const [fading, setFading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Once-per-session gating. SSR renders the splash; on client, if the
  // session flag is already set, hide immediately (single frame of flash
  // on subsequent loads is acceptable).
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("launch-splash-seen")) {
      setShow(false);
      return;
    }
    sessionStorage.setItem("launch-splash-seen", "1");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hold = reduced ? 1200 : 2400;
    const fadeMs = 600;
    const t1 = setTimeout(() => setFading(true), hold);
    const t2 = setTimeout(() => setShow(false), hold + fadeMs);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // Particle simulation. Runs while `show` is true.
  useEffect(() => {
    if (!show) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const W = window.innerWidth;
    const H = window.innerHeight;

    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    /* Render text to an offscreen canvas (CSS pixels) and sample alpha
       at a regular grid to build the target-position list. */
    const text = "Arun Gaddam";
    const fontSize = Math.min(W * 0.13, 200);
    const off = document.createElement("canvas");
    off.width = W;
    off.height = H;
    const octx = off.getContext("2d");
    if (!octx) return;
    octx.fillStyle = "#000";
    octx.font = `400 ${fontSize}px Inter, system-ui, sans-serif`;
    octx.textAlign = "center";
    octx.textBaseline = "middle";
    octx.fillText(text, W / 2, H / 2);
    const data = octx.getImageData(0, 0, W, H).data;

    const step = W < 600 ? 5 : 4;
    type P = { x: number; y: number; vx: number; vy: number; tx: number; ty: number };
    const particles: P[] = [];
    for (let y = 0; y < H; y += step) {
      for (let x = 0; x < W; x += step) {
        if (data[(y * W + x) * 4 + 3] > 128) {
          particles.push({
            x: reduced ? x : Math.random() * W,
            y: reduced ? y : Math.random() * H,
            vx: 0,
            vy: 0,
            tx: x,
            ty: y,
          });
        }
      }
    }

    /* Cursor repel field. Only relevant when motion isn't reduced. */
    const mouse = { x: -9999, y: -9999 };
    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    if (!reduced) {
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerleave", onLeave);
    }

    const SPRING = 0.06;
    const FRICTION = 0.88;
    const REPEL_R = 90;

    const fill = () =>
      getComputedStyle(document.documentElement).getPropertyValue("--text").trim() || "#1d1d1f";

    let raf = 0;
    const tick = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = fill();

      for (const p of particles) {
        const dx = p.tx - p.x;
        const dy = p.ty - p.y;
        p.vx += dx * SPRING;
        p.vy += dy * SPRING;

        if (!reduced) {
          const mdx = p.x - mouse.x;
          const mdy = p.y - mouse.y;
          const md2 = mdx * mdx + mdy * mdy;
          if (md2 < REPEL_R * REPEL_R) {
            const md = Math.sqrt(md2) || 1;
            const force = (REPEL_R - md) / REPEL_R;
            p.vx += (mdx / md) * force * 6;
            p.vy += (mdy / md) * force * 6;
          }
        }

        p.vx *= FRICTION;
        p.vy *= FRICTION;
        p.x += p.vx;
        p.y += p.vy;

        ctx.fillRect(p.x, p.y, 1.6, 1.6);
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, [show]);

  if (!show) return null;

  return (
    <div
      role="presentation"
      onClick={() => setFading(true)}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "var(--bg)",
        opacity: fading ? 0 : 1,
        transition: "opacity 600ms cubic-bezier(0.22, 1, 0.36, 1)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      aria-label="Arun Gaddam"
    >
      <canvas ref={canvasRef} aria-hidden="true" style={{ display: "block" }} />
      {/* Skip-tag at the bottom for keyboard users and curiosity */}
      <p
        style={{
          position: "absolute",
          bottom: 32,
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-mono)",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--muted)",
          margin: 0,
          opacity: 0.7,
        }}
      >
        Click to enter
      </p>
    </div>
  );
}
