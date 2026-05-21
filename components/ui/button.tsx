"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva("", {
  variants: {
    variant: {
      chrome: "",
      inline: "",
      tag: "",
    },
  },
  defaultVariants: { variant: "chrome" },
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const STYLES: Record<string, React.CSSProperties> = {
  chrome: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    height: "44px",
    padding: "0 18px",
    borderRadius: "12px",
    background: "var(--surface)",
    boxShadow: "var(--card-shadow)",
    border: "none",
    fontFamily: "var(--font-body)",
    fontSize: "var(--text-body-lg)",
    fontWeight: 400,
    color: "var(--text)",
    cursor: "pointer",
    transition: "box-shadow var(--dur-fast) var(--ease-expo), color var(--dur-fast) var(--ease-expo)",
    whiteSpace: "nowrap",
  },
  inline: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    padding: "8px 14px",
    borderRadius: "8px",
    background: "var(--surface)",
    border: "1px solid var(--border)",
    fontFamily: "var(--font-mono)",
    fontSize: "var(--text-mono-lg)",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    fontWeight: 400,
    color: "var(--text)",
    cursor: "pointer",
    transition: "background var(--dur-fast) var(--ease-expo), color var(--dur-fast) var(--ease-expo)",
    whiteSpace: "nowrap",
  },
  tag: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "4px 8px",
    borderRadius: "6px",
    background: "var(--surface2)",
    border: "none",
    fontFamily: "var(--font-mono)",
    fontSize: "var(--text-eyebrow)",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    fontWeight: 400,
    color: "var(--muted)",
    cursor: "pointer",
    transition: "background var(--dur-fast) var(--ease-expo)",
    whiteSpace: "nowrap",
  },
};

const HOVER_STYLES: Record<string, Partial<React.CSSProperties>> = {
  chrome: { boxShadow: "var(--card-shadow-hover)", color: "var(--text-hover)" },
  inline: { background: "var(--surface2)" },
  tag: { background: "var(--border)" },
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "chrome", asChild = false, style, onMouseEnter, onMouseLeave, ...props }, ref) => {
    const v = variant ?? "chrome";
    const baseStyle = STYLES[v];
    const hoverStyle = HOVER_STYLES[v];

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
      Object.assign(e.currentTarget.style, hoverStyle);
      onMouseEnter?.(e);
    };
    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
      Object.assign(e.currentTarget.style, Object.fromEntries(
        Object.keys(hoverStyle).map(k => [k, (baseStyle as Record<string, unknown>)[k] ?? ""])
      ));
      onMouseLeave?.(e);
    };

    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant }), className)}
        style={{ ...baseStyle, ...style }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
