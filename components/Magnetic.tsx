"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface MagneticProps {
  children: React.ReactNode;
  strength?: number;   // 0–1, how far the element pulls toward cursor
  disabled?: boolean;
  style?: React.CSSProperties;
}

/**
 * Wraps children so they drift toward the cursor when hovered,
 * then spring back to rest on mouse leave.
 */
export default function Magnetic({
  children,
  strength = 0.38,
  disabled = false,
  style,
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 180, damping: 16, mass: 0.9 });
  const y = useSpring(rawY, { stiffness: 180, damping: 16, mass: 0.9 });

  if (disabled) return <>{children}</>;

  return (
    <motion.div
      ref={ref}
      style={{ x, y, display: "inline-flex", ...style }}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        rawX.set((e.clientX - rect.left  - rect.width  / 2) * strength);
        rawY.set((e.clientY - rect.top   - rect.height / 2) * strength);
      }}
      onMouseLeave={() => {
        rawX.set(0);
        rawY.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}
