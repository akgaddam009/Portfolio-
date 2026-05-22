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
    // 35% reduction — was Math.min(W * 0.13, 200). Smaller wordmark
    // sits more comfortably inside the splash; particles don't crowd
    // the viewport edges.
    const fontSize = Math.min(W * 0.085, 130);
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

    const SPRING = 0.04;     // softer pull → no overshoot
    const FRICTION = 0.82;   // higher damping → critical-damped feel
    const REPEL_R = 90;
    const SETTLE_EPS = 0.05; // velocity below this + close to target = snap

    const fill = () =>
      getComputedStyle(document.documentElement).getPropertyValue("--text").trim() || "#1d1d1f";

    let raf = 0;
    const tick = () => {
      // Soft clear via low-alpha rect — gives a subtle motion blur during
      // travel and lets settled particles render crisply. Reading --bg as
      // a raw token works because `var(--bg)` resolves to a hex.
      const bg = getComputedStyle(document.documentElement).getPropertyValue("--bg").trim() || "#ffffff";
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);
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
            p.vx += (mdx / md) * force * 4;
            p.vy += (mdy / md) * force * 4;
          }
        }

        p.vx *= FRICTION;
        p.vy *= FRICTION;
        p.x += p.vx;
        p.y += p.vy;

        // Snap to target once nearly stationary so settled particles
        // don't sub-pixel jitter against the canvas grid.
        if (
          Math.abs(p.vx) < SETTLE_EPS &&
          Math.abs(p.vy) < SETTLE_EPS &&
          Math.abs(dx) < 0.8 &&
          Math.abs(dy) < 0.8
        ) {
          p.x = p.tx;
          p.y = p.ty;
          p.vx = 0;
          p.vy = 0;
        }

        // Anti-aliased disc instead of a 1.6px square — smoother both in
        // motion and at rest. Radius 1.3 keeps the visual weight similar
        // to the old square sample size.
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.3, 0, Math.PI * 2);
        ctx.fill();
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

  // Body inert while the splash is up — keeps focus inside the overlay
  // and prevents AT from reading the underlying page that's visually
  // covered. Cleared on dismiss or unmount.
  useEffect(() => {
    if (!show || fading) return;
    const body = document.body;
    body.setAttribute("inert", "");
    body.setAttribute("aria-hidden", "true");
    return () => {
      body.removeAttribute("inert");
      body.removeAttribute("aria-hidden");
    };
  }, [show, fading]);

  // Keyboard dismiss — Escape, Enter, or Space all close the splash.
  // Keyboard users were stuck waiting the auto-fade before this.
  useEffect(() => {
    if (!show || fading) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setFading(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [show, fading]);

  if (!show) return null;

  return (
    <div
      // Real dialog semantics so screen readers announce "Arun Gaddam"
      // instead of nothing (role="presentation" used to strip it).
      role="dialog"
      aria-modal="true"
      aria-label="Arun Gaddam"
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
    >
      <canvas ref={canvasRef} aria-hidden="true" style={{ display: "block" }} />
      {/* Hint for keyboard + click users alike. */}
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
        Press any key or click to enter
      </p>
    </div>
  );
}
