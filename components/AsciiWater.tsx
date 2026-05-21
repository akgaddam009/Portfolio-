"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

/* ASCII water ripple — canvas grid of monospace characters whose density is
   driven by a 2D digital-wave simulation (Hugo Elias / "fast water") with
   light damping. Reads theme tokens for fill colour so it flips with dark
   mode. Designed to sit behind a slide as a low-opacity background; no
   pointer events so it never blocks interaction.

   Exposes an imperative handle so callers can fire one-off drops (e.g. on
   keystroke, on submit) without rebuilding the simulation. */
export type AsciiWaterHandle = {
  /** Add an impulse at fractional coordinates [0,1]; defaults to random. */
  impulse: (xFrac?: number, yFrac?: number, strength?: number) => void;
};

type Props = {
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
  /** Disable the cursor-driven impulse on this instance (e.g. for splash
      backgrounds where the page underneath should own the cursor). */
  disableCursor?: boolean;
  style?: React.CSSProperties;
  className?: string;
};

const AsciiWater = forwardRef<AsciiWaterHandle, Props>(function AsciiWater(
  {
    charset = " ·:-=+*#@",
    fontSize = 14,
    damping = 0.985,
    impulse = 4,
    fps = 30,
    opacity = 0.35,
    colorVar = "--muted",
    disableCursor = false,
    style,
    className,
  },
  ref,
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Held in a ref so useImperativeHandle can call into the live simulation.
  // Replaced on every resize because W/H/cur change.
  const impulseFnRef = useRef<(xFrac?: number, yFrac?: number, strength?: number) => void>(() => {});

  useImperativeHandle(
    ref,
    () => ({
      impulse: (xFrac, yFrac, strength) => impulseFnRef.current(xFrac, yFrac, strength),
    }),
    [],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    const dpr = Math.max(1, window.devicePixelRatio || 1);

    const cw = Math.max(6, Math.round(fontSize * 0.6));
    const ch = Math.max(8, Math.round(fontSize * 1.15));

    let W = 0;
    let H = 0;
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
      const cx = Math.floor(W / 2);
      const cy = Math.floor(H / 2);
      cur[cy * W + cx] = 8;

      // Refresh the imperative impulse closure so it sees the latest W/H/cur.
      impulseFnRef.current = (xFrac, yFrac, strength = 10) => {
        const fx = xFrac == null ? Math.random() : Math.max(0, Math.min(1, xFrac));
        const fy = yFrac == null ? Math.random() : Math.max(0, Math.min(1, yFrac));
        const ix = Math.floor(fx * W);
        const iy = Math.floor(fy * H);
        if (ix >= 1 && ix < W - 1 && iy >= 1 && iy < H - 1) {
          cur[iy * W + ix] += strength;
        }
      };
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

    const enableInteraction = !disableCursor && !isCoarse && !reduced;
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
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      ctx.font = `${fontSize}px ui-monospace, var(--font-mono), monospace`;
      ctx.textBaseline = "top";
      ctx.fillStyle = color;

      const last = charset.length - 1;
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const h = cur[y * W + x];
          const t = Math.min(1, Math.abs(h) * 0.5);
          if (t < 0.02) continue;
          const idx = Math.min(last, Math.floor(t * (last + 0.999)));
          const c = charset[idx];
          if (c && c !== " ") {
            ctx.fillText(c, x * cw, y * ch);
          }
        }
      }
    };

    const step = () => {
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

      if (enableInteraction && mouse.x >= 1 && mouse.x < W - 1 && mouse.y >= 1 && mouse.y < H - 1) {
        const recency = performance.now() - mouse.t;
        if (recency < 120) {
          const i = mouse.y * W + mouse.x;
          next[i] += impulse;
        }
      }

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
  }, [charset, fontSize, damping, impulse, fps, colorVar, disableCursor]);

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
});

export default AsciiWater;
