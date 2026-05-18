"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

interface ScrambleTextProps {
  text: string;
  style?: React.CSSProperties;
  className?: string;
  /** ms per iteration step — default 35 */
  speed?: number;
}

/**
 * Renders text that scrambles through random characters on hover,
 * resolving left-to-right back to the original string.
 */
export default function ScrambleText({
  text,
  style,
  className,
  speed = 35,
}: ScrambleTextProps) {
  const [display, setDisplay] = useState(text);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scramble = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    let iteration = 0;
    const chars = text.split("");
    // 2 random frames per character so each letter visibly flickers before resolving
    const maxIter = chars.length * 2;

    intervalRef.current = setInterval(() => {
      setDisplay(
        chars
          .map((char, i) => {
            if (char === " ") return " ";
            // Characters to the left of the resolution front are locked in
            if (i < Math.floor(iteration / 2)) return char;
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );
      iteration++;
      if (iteration > maxIter) {
        clearInterval(intervalRef.current!);
        setDisplay(text);
      }
    }, speed);
  }, [text, speed]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <span
      style={{
        fontVariantNumeric: "tabular-nums",
        display: "inline-block",
        ...style,
      }}
      className={className}
      onMouseEnter={scramble}
    >
      {display}
    </span>
  );
}
