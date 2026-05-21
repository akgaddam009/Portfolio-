"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, style, onFocus, onBlur, ...props }, ref) => {
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      e.currentTarget.style.borderColor = "var(--text)";
      onFocus?.(e);
    };
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      e.currentTarget.style.borderColor = "var(--border)";
      onBlur?.(e);
    };

    return (
      <input
        ref={ref}
        className={cn(className)}
        style={{
          width: "100%",
          fontFamily: "var(--font-body)",
          fontSize: "var(--text-body-lg)",
          letterSpacing: "-0.01em",
          color: "var(--text)",
          background: "var(--bg)",
          border: "1.5px solid var(--border)",
          borderRadius: "10px",
          padding: "11px 14px",
          outline: "none",
          transition: "border-color var(--dur-fast) var(--ease-expo)",
          boxSizing: "border-box",
          ...style,
        }}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
