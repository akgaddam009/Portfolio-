"use client";

import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const Pointer = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    stroke="currentColor" fill="currentColor" strokeWidth="1"
    strokeLinecap="round" strokeLinejoin="round"
    viewBox="0 0 16 16" height="1em" width="1em"
    xmlns="http://www.w3.org/2000/svg" {...props}
  >
    <path d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z" />
  </svg>
);

export function PointerHighlight({
  children,
  pointerColor = "var(--text)",
  borderColor  = "var(--text)",
}: {
  children: React.ReactNode;
  pointerColor?: string;
  borderColor?: string;
}) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const [dim, setDim] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const r = el.getBoundingClientRect();
      setDim({ width: r.width, height: r.height });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <span ref={containerRef} style={{ position: "relative", display: "inline-block" }}>
      {children}

      {dim.width > 0 && dim.height > 0 && (
        <motion.span
          style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* Animated border rectangle */}
          <motion.span
            style={{
              position: "absolute", inset: 0,
              border: `1px solid ${borderColor}`,
              display: "block",
            }}
            initial={{ width: 0, height: 0 }}
            whileInView={{ width: dim.width, height: dim.height }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />

          {/* Pointer icon at bottom-right */}
          <motion.span
            style={{
              position: "absolute",
              pointerEvents: "none",
              rotate: "-90deg",
              color: pointerColor,
              fontSize: "18px",
              lineHeight: 1,
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1, x: dim.width + 4, y: dim.height + 4 }}
            viewport={{ once: true }}
            transition={{
              opacity: { duration: 0.1 },
              duration: 1,
              ease: "easeInOut",
            }}
          >
            <Pointer />
          </motion.span>
        </motion.span>
      )}
    </span>
  );
}
