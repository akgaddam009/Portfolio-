"use client";

import { useEffect, useRef } from "react";

/* ASCII water ripple — canvas grid of monospace characters whose density is
   driven by a 2D digital-wave simulation (Hugo Elias / "fast water") with
   light damping. Reads theme tokens for fill colour so it flips with dark
   mode. Designed to sit behind a slide as a low-opacity background; no
   pointer events so it never blocks interaction. */
export default function AsciiWater({
  charset = " ·:-=+*#@",
  fontSize = 14,
  damping = 0.985,
  impulse = 4,
  fps = 30,
  opacity = 0.35,
  colorVar = "--muted",
  style,
  className,
}: {
  /** Low-to-high density characters. The first should be space. */
  charset?: string;
  /** Cell font size in px. Cell width / line height are derived from this. */
  fontSize?: number;
  /** Wave energy retention per step. 0.985 = soft surface, 0.999 = glassy. */
  damping?: number;
  /** Cursor-move impulse strength. */
  impulse?: number;
  /** Simulation frame rate cap. Keep ≤ 30 for battery. */
  fps?: number;
  /** Canvas opacity. */
  opacity?: number;
  /** CSS variable to read for character colour. */
  colorVar?: string;
  style?: React.CSSProperties;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    const dpr = Math.max(1, window.devicePixelRatio || 1);

    // Approximate monospace cell metrics from font size. Tweak factor if the
    // chosen --font-mono renders narrower / taller than typical.
    const cw = Math.max(6, Math.round(fontSize * 0.6));
    const ch = Math.max(8, Math.round(fontSize * 1.15));

    let W = 0;          // grid cols
    let H = 0;          // grid rows
    let cur: Float32Array  = new Float32Array(0);
    let prev: Float32Array = new Float32Array(0);
    let next: Float32Array = new Float32Array(0);
    const mouse = { x: -1, y: -1, t: 0 };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const px = Math.max(1, rect.width);
      const py = Math.max(1, rect.height);
      canvas.width  = Math.round(px * dpr);
      canvas.height = Math.round(py * dpr);
      W = Math.max(2, Math.ceil(px / cw));
      H = Math.max(2, Math.ceil(py / ch));
      cur  = new Float32Array(W * H);
      prev = new Float32Array(W * H);
      next = new Float32Array(W * H);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      // Drop a single ripple in the centre so the surface isn't blank on
      // first paint when the cursor hasn't entered the canvas yet.
      const cx = Math.floor(W / 2);
      const cy = Math.floor(H / 2);
      cur[cy * W + cx] = 8;
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const inX = e.clientX >= rect.left && e.clientX <= rect.right;
      const inY = e.clientY >= rect.top  && e.clientY <= rect.bottom;
      if (!inX || !inY) { mouse.x = -1; return; }
      mouse.x = Math.floor((e.clientX - rect.left) / cw);
      mouse.y = Math.floor((e.clientY - rect.top)  / ch);
      mouse.t = performance.now();
    };

    const enableInteraction = !isCoarse && !reduced;
    if (enableInteraction) {
      window.addEventListener("pointermove", onMove, { passive: true });
    }

    const readColor = () => {
      const v = getComputedStyle(document.documentElement)
        .getPropertyValue(colorVar)
        .trim();
      return v || "#888";
    };

    const draw = () => {
      const color = readColor();
      // Clear by drawing background — we want transparent so the slide's
      // own background shows through. Use clearRect.
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      ctx.font = `${fontSize}px ui-monospace, var(--font-mono), monospace`;
      ctx.textBaseline = "top";
      ctx.fillStyle = color;

      const last = charset.length - 1;
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const h = cur[y * W + x];
          // Map height to charset. Use abs so positive and negative crests
          // both light up — looks more like surface tension than a wave train.
          const t = Math.min(1, Math.abs(h) * 0.5);
          if (t < 0.02) continue;       // skip flat cells, big perf win
          const idx = Math.min(last, Math.floor(t * (last + 0.999)));
          const c = charset[idx];
          if (c && c !== " ") {
            ctx.fillText(c, x * cw, y * ch);
          }
        }
      }
    };

    const step = () => {
      // Hugo Elias / "fast water" digital wave step:
      //   next = (N + S + E + W) / 2 - prev
      //   then damp toward zero.
      for (let y = 1; y < H - 1; y++) {
        const row = y * W;
        for (let x = 1; x < W - 1; x++) {
          const i = row + x;
          const sum = cur[i - 1] + cur[i + 1] + cur[i - W] + cur[i + W];
          let v = (sum * 0.5) - prev[i];
          v *= damping;
          next[i] = v;
        }
      }

      // Cursor impulse — only if the cursor has moved recently. A static
      // cursor would otherwise dump infinite energy and the surface boils.
      if (enableInteraction && mouse.x >= 1 && mouse.x < W - 1 && mouse.y >= 1 && mouse.y < H - 1) {
        const recency = performance.now() - mouse.t;
        if (recency < 120) {
          const i = mouse.y * W + mouse.x;
          next[i] += impulse;
        }
      }

      // Triple-buffer swap so we don't allocate per frame.
      const tmp = prev;
      prev = cur;
      cur = next;
      next = tmp;
    };

    let raf = 0;
    let last = 0;
    const interval = 1000 / fps;

    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (t - last < interval) return;
      last = t;
      step();
      draw();
    };

    if (reduced) {
      // No animation: draw the initial ripple once and leave it.
      step();
      draw();
    } else {
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      ro.disconnect();
    };
  }, [charset, fontSize, damping, impulse, fps, colorVar]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        opacity,
        ...style,
      }}
    />
  );
}
