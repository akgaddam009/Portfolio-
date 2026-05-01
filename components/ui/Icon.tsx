/* ─── Icon component ─────────────────────────────────────────────
   Single source for line icons used across the portfolio. Lucide-style
   geometry: 24px viewBox, 1.5px stroke, round caps and joins. Inherits
   currentColor by default and accepts a size prop. Replaces Unicode
   arrows (↗ → ←) which never matched the type weight properly.
*/
type IconProps = {
  size?: number;
  strokeWidth?: number;
  className?: string;
  style?: React.CSSProperties;
};

const Svg = ({
  size = 14,
  strokeWidth = 1.75,
  children,
  className,
  style,
}: IconProps & { children: React.ReactNode }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={{ display: "inline-block", verticalAlign: "-0.15em", flexShrink: 0, ...style }}
    aria-hidden="true"
  >
    {children}
  </svg>
);

export const ArrowUpRight = (p: IconProps) => (
  <Svg {...p}>
    <path d="M7 17 17 7" />
    <path d="M7 7h10v10" />
  </Svg>
);

export const ArrowRight = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </Svg>
);

export const ArrowLeft = (p: IconProps) => (
  <Svg {...p}>
    <path d="M19 12H5" />
    <path d="m12 19-7-7 7-7" />
  </Svg>
);

export const ArrowDown = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 5v14" />
    <path d="m19 12-7 7-7-7" />
  </Svg>
);
