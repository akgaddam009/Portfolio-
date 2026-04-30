"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

interface CanvasTextProps {
  text: string;
  className?: string;
  colors?: string[];
  animationDuration?: number;
  lineWidth?: number;
  lineGap?: number;
  curveIntensity?: number;
}

function resolveColor(color: string): string {
  if (color.startsWith("var(")) {
    const varName = color.slice(4, -1).trim();
    return getComputedStyle(document.documentElement).getPropertyValue(varName).trim() || color;
  }
  return color;
}

export function CanvasText({
  text,
  className = "",
  colors = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#ffeaa7", "#a29bfe"],
  animationDuration = 5,
  lineWidth = 1.5,
  lineGap = 10,
  curveIntensity = 60,
}: CanvasTextProps) {
  const canvasRef     = useRef<HTMLCanvasElement>(null);
  const textRef       = useRef<HTMLSpanElement>(null);
  const animRef       = useRef<number>(0);
  const startTimeRef  = useRef<number>(0);

  const [bgColor,         setBgColor]         = useState("#ffffff");
  const [resolvedColors,  setResolvedColors]  = useState<string[]>([]);
  const [dimensions,      setDimensions]      = useState({ width: 0, height: 0 });
  const [font,            setFont]            = useState("");

  const updateColors = useCallback(() => {
    const bg = getComputedStyle(document.documentElement).getPropertyValue("--bg").trim();
    setBgColor(bg || "#ffffff");
    setResolvedColors(colors.map(resolveColor));
  }, [colors]);

  // Re-resolve on theme toggle (data-theme attr) or class change
  useEffect(() => {
    updateColors();
    const obs = new MutationObserver(updateColors);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });
    return () => obs.disconnect();
  }, [updateColors]);

  // Track text dimensions
  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    const update = () => {
      const rect     = el.getBoundingClientRect();
      const computed = window.getComputedStyle(el);
      setDimensions({ width: Math.ceil(rect.width) || 400, height: Math.ceil(rect.height) || 60 });
      setFont(`${computed.fontWeight} ${computed.fontSize} ${computed.fontFamily}`);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [text, className]);

  // Canvas animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || resolvedColors.length === 0 || dimensions.width === 0 || !font) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const { width, height } = dimensions;
    const dpr = window.devicePixelRatio || 1;
    canvas.width  = width  * dpr;
    canvas.height = height * dpr;

    ctx.font = font;
    const metrics  = ctx.measureText(text);
    const ascent   = metrics.actualBoundingBoxAscent;
    const descent  = metrics.actualBoundingBoxDescent;
    const baselineY = (height + ascent - descent) / 2;
    const numLines  = Math.floor(height / lineGap) + 10;

    startTimeRef.current = performance.now();

    const animate = (now: number) => {
      const elapsed = (now - startTimeRef.current) / 1000;
      const phase   = (elapsed / animationDuration) * Math.PI * 2;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      // 1. Text silhouette
      ctx.globalCompositeOperation = "source-over";
      ctx.font          = font;
      ctx.textBaseline  = "alphabetic";
      ctx.textAlign     = "left";
      ctx.fillStyle     = "#000";
      ctx.fillText(text, 0, baselineY);

      // 2. Fill silhouette with bg colour (enables clean dark/light)
      ctx.globalCompositeOperation = "source-in";
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);

      // 3. Animated bezier lines clipped to text shape
      ctx.globalCompositeOperation = "source-atop";
      for (let i = 0; i < numLines; i++) {
        const y      = i * lineGap;
        const curve1 = Math.sin(phase) * curveIntensity;
        const curve2 = Math.sin(phase + 0.5) * curveIntensity * 0.6;
        ctx.strokeStyle = resolvedColors[i % resolvedColors.length];
        ctx.lineWidth   = lineWidth;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.bezierCurveTo(width * 0.33, y + curve1, width * 0.66, y + curve2, width, y);
        ctx.stroke();
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [text, font, bgColor, resolvedColors, animationDuration, lineWidth, lineGap, curveIntensity, dimensions]);

  return (
    <span className={`relative inline-block ${className}`}>
      {/* Invisible placeholder — provides layout space + font metrics */}
      <span ref={textRef} className="invisible inline-block" aria-hidden="true">
        {text}
      </span>
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute top-0 left-0"
        style={{ width: dimensions.width || "auto", height: dimensions.height || "auto" }}
        aria-label={text}
        role="img"
      />
    </span>
  );
}
