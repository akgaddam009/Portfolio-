/* ─── Icon component ─────────────────────────────────────────────
   Single source for line icons used across the portfolio.

   Mixed-source strategy:
   - Chip / category icons (Briefcase, LayoutGrid, Users, Compass, Search,
     Sparkles) come from @phosphor-icons/react — Phosphor's Regular weight
     has more refined endpoints, better optical compensation, and a more
     editorial feel than hand-drawn Lucide-style paths. These are the icons
     a viewer reads most often (hero chips, work card tags), so the upgrade
     is concentrated where it matters most.
   - Structural icons (arrows, menu, info, etc.) stay as hand-drawn SVGs to
     keep type-weight consistency with custom illustrations elsewhere.

   The Phosphor wrappers preserve the same prop API (size, strokeWidth, style,
   className) so no call site changes are required. strokeWidth is mapped to
   Phosphor's `weight` token for visual parity.
*/
import {
  SquaresFour as PhSquaresFour,
  Users as PhUsers,
  Compass as PhCompass,
  Sparkle as PhSparkle,
  Briefcase as PhBriefcase,
  MagnifyingGlass as PhMagnifyingGlass,
  Path as PhPath,
  TreeStructure as PhTreeStructure,
  Check as PhCheck,
  X as PhX,
} from "@phosphor-icons/react";

type IconProps = {
  size?: number;
  strokeWidth?: number;
  className?: string;
  style?: React.CSSProperties;
};

/* Bridge Lucide-style strokeWidth (numeric) to Phosphor weight (semantic).
   Default 1.5 → "regular"; thinner values → "light"/"thin". */
const phWeight = (sw?: number): "thin" | "light" | "regular" | "bold" => {
  if (sw === undefined) return "regular";
  if (sw <= 1) return "thin";
  if (sw <= 1.5) return "light";
  if (sw <= 2) return "regular";
  return "bold";
};

const phStyle = (style?: React.CSSProperties): React.CSSProperties => ({
  display: "inline-block",
  verticalAlign: "-0.15em",
  flexShrink: 0,
  ...style,
});

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

export const Mail = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" />
    <path d="m3.6 6.4 8.4 6.4 8.4-6.4" />
  </Svg>
);

export const FileText = (p: IconProps) => (
  <Svg {...p}>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" />
    <path d="M14 3v5h5" />
    <path d="M9 13h6" />
    <path d="M9 17h4" />
  </Svg>
);

/* LinkedIn mark. Only the "in" glyph from LinkedIn's own icon file on Wikimedia
   Commons (PD-textlogo -- simple geometry, ineligible for copyright), drawn in
   currentColor instead of white-on-blue so it inherits the button's text colour
   and flips with the theme like every other mark here.

   Filled, not stroked, so it does NOT use the Svg wrapper above -- and the
   viewBox stays at the source's 72 rather than being rescaled to 24 by hand,
   so the published coordinates are used verbatim.

   Trademark remains LinkedIn's; used nominatively to link to Arun's profile. */
export const LinkedIn = ({ size = 16, className, style }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 72 72"
    fill="currentColor"
    className={className}
    style={{ display: "inline-block", verticalAlign: "-0.15em", flexShrink: 0, ...style }}
    aria-hidden="true"
  >
    <path d="M62,62 L51.315625,62 L51.315625,43.8021149 C51.315625,38.8127542 49.4197917,36.0245323 45.4707031,36.0245323 C41.1746094,36.0245323 38.9300781,38.9261103 38.9300781,43.8021149 L38.9300781,62 L28.6333333,62 L28.6333333,27.3333333 L38.9300781,27.3333333 L38.9300781,32.0029283 C38.9300781,32.0029283 42.0260417,26.2742151 49.3825521,26.2742151 C56.7356771,26.2742151 62,30.7644705 62,40.051212 L62,62 Z M16.349349,22.7940133 C12.8420573,22.7940133 10,19.9296567 10,16.3970067 C10,12.8643566 12.8420573,10 16.349349,10 C19.8566406,10 22.6970052,12.8643566 22.6970052,16.3970067 C22.6970052,19.9296567 19.8566406,22.7940133 16.349349,22.7940133 Z M11.0325521,62 L21.769401,62 L21.769401,27.3333333 L11.0325521,27.3333333 L11.0325521,62 Z" />
  </svg>
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

/* ─── Concept icons (lucide geometry) ──────────────────────────
   Used in case-study sections that benefit from a visual cue
   alongside labels — kept consistent with arrow icons above so
   the page reads as one icon family. */

export const Briefcase = (p: IconProps) => (
  <PhBriefcase size={p.size ?? 14} weight={phWeight(p.strokeWidth)} className={p.className} style={phStyle(p.style)} aria-hidden="true" />
);

export const LayoutGrid = (p: IconProps) => (
  <PhSquaresFour size={p.size ?? 14} weight={phWeight(p.strokeWidth)} className={p.className} style={phStyle(p.style)} aria-hidden="true" />
);

export const Users = (p: IconProps) => (
  <PhUsers size={p.size ?? 14} weight={phWeight(p.strokeWidth)} className={p.className} style={phStyle(p.style)} aria-hidden="true" />
);

export const Scissors = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="6" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <line x1="20" y1="4" x2="8.12" y2="15.88" />
    <line x1="14.47" y1="14.48" x2="20" y2="20" />
    <line x1="8.12" y1="8.12" x2="12" y2="12" />
  </Svg>
);

export const ChartActivity = (p: IconProps) => (
  <Svg {...p}>
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </Svg>
);

export const Info = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </Svg>
);

/** Single-person silhouette — friendly head + shoulders shape,
 *  used in user-segment cards. Sits in a 24×24 viewbox like the
 *  rest of the icon family. */
export const UserCircle = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21v-1a8 8 0 0 1 16 0v1" />
  </Svg>
);

export const Calendar = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </Svg>
);

/** Clipboard with list lines — procurement / data review */
export const ClipboardList = (p: IconProps) => (
  <Svg {...p}>
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <line x1="9" y1="12" x2="15" y2="12" />
    <line x1="9" y1="16" x2="15" y2="16" />
  </Svg>
);

/** Balance scale — legal review / fairness */
export const Scale = (p: IconProps) => (
  <Svg {...p}>
    <line x1="12" y1="3" x2="12" y2="21" />
    <path d="m3 6 9 2 9-2" />
    <path d="M6 6 3 15a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1L6 6Z" />
    <path d="m18 6-3 9a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1L18 6Z" />
  </Svg>
);

/** Branching paths — approval routing / workflow manager */
export const GitBranch = (p: IconProps) => (
  <Svg {...p}>
    <line x1="6" y1="3" x2="6" y2="15" />
    <circle cx="18" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <path d="M18 9a9 9 0 0 1-9 9" />
  </Svg>
);

/** Compass — direction-finding metaphor for Strategy (Phosphor Regular) */
export const Compass = (p: IconProps) => (
  <PhCompass size={p.size ?? 14} weight={phWeight(p.strokeWidth)} className={p.className} style={phStyle(p.style)} aria-hidden="true" />
);

/** Magnifying glass — Research (Phosphor Regular) */
export const Search = (p: IconProps) => (
  <PhMagnifyingGlass size={p.size ?? 14} weight={phWeight(p.strokeWidth)} className={p.className} style={phStyle(p.style)} aria-hidden="true" />
);

/** Path — flowing line, used as Supply Chain category icon on work cards.
 *  Phosphor Regular so it matches the rest of the chip-icon family
 *  (Briefcase, Users, Compass, LayoutGrid, Sparkles, MagnifyingGlass). */
export const Path = (p: IconProps) => (
  <PhPath size={p.size ?? 14} weight={phWeight(p.strokeWidth)} className={p.className} style={phStyle(p.style)} aria-hidden="true" />
);

/** Tree structure — branching nodes, used as Service Design category icon
 *  on work cards. Phosphor Regular for chip-icon family consistency. */
export const TreeStructure = (p: IconProps) => (
  <PhTreeStructure size={p.size ?? 14} weight={phWeight(p.strokeWidth)} className={p.className} style={phStyle(p.style)} aria-hidden="true" />
);

/** Check — affirmative inline marker. Phosphor Regular so it matches the
 *  rest of the chip-icon family at small sizes. Use this instead of the
 *  Unicode ✓ character. */
export const Check = (p: IconProps) => (
  <PhCheck size={p.size ?? 14} weight={phWeight(p.strokeWidth)} className={p.className} style={phStyle(p.style)} aria-hidden="true" />
);

/** XMark — negative inline marker (paired with Check). Named XMark to avoid
 *  clashing with the hand-drawn `X` close icon used in nav. Phosphor Regular. */
export const XMark = (p: IconProps) => (
  <PhX size={p.size ?? 14} weight={phWeight(p.strokeWidth)} className={p.className} style={phStyle(p.style)} aria-hidden="true" />
);

/** Sparkle — AI signal (Phosphor Regular, single sparkle for cleaner read at small sizes) */
export const Sparkles = (p: IconProps) => (
  <PhSparkle size={p.size ?? 14} weight={phWeight(p.strokeWidth)} className={p.className} style={phStyle(p.style)} aria-hidden="true" />
);

/** Three-line hamburger — mobile floating menu trigger */
export const Menu = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 6h16" /><path d="M4 12h16" /><path d="M4 18h16" />
  </Svg>
);

/** X — close icon, paired with Menu */
export const X = (p: IconProps) => (
  <Svg {...p}>
    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
  </Svg>
);
