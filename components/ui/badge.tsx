import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva("", {
  variants: {
    variant: { default: "", accent: "", success: "" },
  },
  defaultVariants: { variant: "default" },
});

const BADGE_STYLES: Record<string, React.CSSProperties> = {
  default: {
    display: "inline-flex",
    alignItems: "center",
    padding: "3px 8px",
    borderRadius: "var(--radius-xs)",
    background: "var(--surface2)",
    border: "1px solid var(--border)",
    fontFamily: "var(--font-mono)",
    fontSize: "var(--text-eyebrow)",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    fontWeight: 400,
    color: "var(--muted)",
    whiteSpace: "nowrap",
  },
  accent: {
    display: "inline-flex",
    alignItems: "center",
    padding: "3px 8px",
    borderRadius: "var(--radius-xs)",
    background: "var(--chip-indigo-bg)",
    border: "1px solid transparent",
    fontFamily: "var(--font-mono)",
    fontSize: "var(--text-eyebrow)",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    fontWeight: 400,
    color: "var(--chip-indigo-text)",
    whiteSpace: "nowrap",
  },
  success: {
    display: "inline-flex",
    alignItems: "center",
    padding: "3px 8px",
    borderRadius: "var(--radius-xs)",
    background: "rgba(22, 163, 74, 0.08)",
    border: "1px solid transparent",
    fontFamily: "var(--font-mono)",
    fontSize: "var(--text-eyebrow)",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    fontWeight: 400,
    color: "var(--accent-success)",
    whiteSpace: "nowrap",
  },
};

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant = "default", style, ...props }: BadgeProps) {
  return (
    <span
      className={cn(badgeVariants({ variant }), className)}
      style={{ ...BADGE_STYLES[variant ?? "default"], ...style }}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
