/* Painted Lady (Vanessa cardui) — the specimen the system was sampled from.
   Two exports:
     - <PaintedLadyMark>     small currentColor silhouette (rail, ornaments)
     - <PaintedLadySpecimen> annotated plate with wing zones in palette colours

   Geometry is hand-built, symmetric across the vertical axis. Both wings are
   drawn as a `<g>` and mirrored with transform="scale(-1 1)" so edits stay
   in one place. */

export function PaintedLadyMark({
  size = 22,
  color,
  style,
}: {
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}) {
  // Icon-scale silhouette. Reads as a butterfly down to ~16px because
  // each wing is a single rotated ellipse and the body is a visible
  // capsule, not a hairline. Currentcolor-filled so it themes with text.
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      style={{ display: "inline-block", color, ...style }}
      fill="currentColor"
    >
      {/* forewings */}
      <ellipse cx="6"  cy="9"  rx="6"   ry="4"   transform="rotate(-18 6 9)" />
      <ellipse cx="18" cy="9"  rx="6"   ry="4"   transform="rotate(18 18 9)" />
      {/* hindwings — slightly smaller, tilted opposite */}
      <ellipse cx="7"  cy="16" rx="5"   ry="3.4" transform="rotate(20 7 16)" />
      <ellipse cx="17" cy="16" rx="5"   ry="3.4" transform="rotate(-20 17 16)" />
      {/* body */}
      <rect x="11.3" y="4" width="1.4" height="16" rx="0.7" />
      {/* head */}
      <circle cx="12" cy="4" r="1.3" />
      {/* antennae */}
      <path
        d="M12 3 L 10 0.5 M 12 3 L 14 0.5"
        stroke="currentColor"
        strokeWidth="0.7"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function PaintedLadySpecimen({
  width = 560,
  showAnnotations = true,
  style,
}: {
  width?: number;
  showAnnotations?: boolean;
  style?: React.CSSProperties;
}) {
  // Wing-zone palette — sampled from Vanessa cardui reference photography.
  // Sampled from Vanessa cardui reference photography. Every value
  // either IS a token already in the system or is the one reserved
  // pigment (cream) that the system has chosen not to use.
  const TERRACOTTA = "var(--accent-warm, #d17b53)";
  const INK        = "var(--text, #1d1d1f)";
  const SMOKE      = "var(--muted, #6e6e73)";
  const PAPER      = "var(--bg, #ffffff)";
  const CREAM      = "#f5e9d3";   // reserved pigment, not a token
  const BORDER     = "var(--border, #d2d2d7)";

  // viewBox is widened to 190 (vs the 130 the butterfly occupies) so the
  // leader-line annotations on either side have room without being
  // clipped. Aspect ratio is locked here and the width prop scales the
  // whole composition uniformly.
  const aspect = 90 / 190;

  return (
    <svg
      width={width}
      height={width * aspect}
      viewBox="-95 -45 190 90"
      aria-label="Painted Lady (Vanessa cardui) specimen, annotated"
      style={{ display: "block", overflow: "visible", ...style }}
    >
      {/* ============== Specimen ============== */}
      <g>
        {/* body */}
        <ellipse cx="0" cy="0" rx="1.8" ry="24" fill={INK} />
        {/* abdomen segmentation (subtle) */}
        {[-12, -4, 4, 12, 20].map((y) => (
          <ellipse key={y} cx="0" cy={y} rx="2" ry="1.3" fill={SMOKE} opacity="0.55" />
        ))}
        {/* head */}
        <ellipse cx="0" cy="-26" rx="2.8" ry="3.6" fill={INK} />
        {/* antennae */}
        <path d="M-1 -28 Q -6 -38 -9 -44" stroke={INK} strokeWidth="0.6" fill="none" strokeLinecap="round" />
        <path d="M1 -28 Q 6 -38 9 -44" stroke={INK} strokeWidth="0.6" fill="none" strokeLinecap="round" />
        <circle cx="-9" cy="-44" r="0.9" fill={INK} />
        <circle cx="9" cy="-44" r="0.9" fill={INK} />

        {/* Wings — drawn once on the left, mirrored to the right via scale(-1 1). */}
        {(["", "scale(-1 1)"] as const).map((t, idx) => (
          <g key={idx} transform={t}>
            {/* --- FOREWING --- */}
            {/* terracotta base */}
            <path
              d="M -2 -22 C -20 -38 -44 -34 -54 -18 C -58 -6 -46 -2 -32 -3 C -16 -5 -6 -12 -2 -19 Z"
              fill={TERRACOTTA}
            />
            {/* cream patch near body — outlined hair-thin in border so
                it doesn't vanish into the page on light surfaces. */}
            <path
              d="M -3 -19 C -10 -19 -16 -16 -18 -10 C -16 -6 -10 -5 -4 -7 C -3 -12 -3 -16 -3 -19 Z"
              fill={CREAM}
              stroke={BORDER}
              strokeWidth="0.25"
            />
            {/* dark apex (outer corner) */}
            <path
              d="M -36 -34 C -48 -30 -56 -22 -54 -14 C -46 -14 -38 -20 -32 -28 C -32 -32 -34 -33 -36 -34 Z"
              fill={INK}
            />
            {/* white submarginal pupils */}
            <circle cx="-44" cy="-22" r="1.2" fill={PAPER} />
            <circle cx="-49" cy="-18" r="0.9" fill={PAPER} />
            <circle cx="-40" cy="-26" r="0.9" fill={PAPER} />
            <circle cx="-35" cy="-30" r="0.7" fill={PAPER} />
            {/* veining — thin smoky lines */}
            <path d="M -3 -19 C -16 -22 -28 -22 -38 -18" stroke={SMOKE} strokeWidth="0.4" fill="none" opacity="0.6" />
            <path d="M -3 -15 C -14 -16 -26 -14 -34 -10" stroke={SMOKE} strokeWidth="0.4" fill="none" opacity="0.5" />

            {/* --- HINDWING --- */}
            {/* terracotta base */}
            <path
              d="M -2 2 C -18 0 -38 8 -46 24 C -40 36 -22 38 -10 30 C -4 22 -2 14 -2 6 Z"
              fill={TERRACOTTA}
            />
            {/* cream inner patch */}
            <path
              d="M -3 4 C -10 4 -16 8 -16 16 C -10 16 -6 12 -4 8 Z"
              fill={CREAM}
              stroke={BORDER}
              strokeWidth="0.25"
            />
            {/* outer margin band */}
            <path
              d="M -22 32 C -32 32 -42 30 -46 24 C -44 32 -36 38 -22 38 Z"
              fill={INK}
            />
            {/* eyespots — row of dark dots near hindwing margin */}
            <circle cx="-12" cy="32" r="1.5" fill={INK} />
            <circle cx="-20" cy="33" r="1.5" fill={INK} />
            <circle cx="-28" cy="32" r="1.4" fill={INK} />
            <circle cx="-36" cy="30" r="1.2" fill={INK} />
            {/* veining */}
            <path d="M -3 6 C -16 10 -28 18 -36 26" stroke={SMOKE} strokeWidth="0.4" fill="none" opacity="0.55" />
            <path d="M -3 12 C -14 16 -22 22 -28 28" stroke={SMOKE} strokeWidth="0.4" fill="none" opacity="0.5" />
          </g>
        ))}
      </g>

      {/* ============== Annotations ==============
          Leader lines + hex callouts. Drawn on top, only when requested.
          Kept to the LEFT half so the right half can carry token names. */}
      {showAnnotations && (
        <g
          fontFamily="var(--font-mono), 'DM Mono', monospace"
          fontSize="2.6"
          letterSpacing="0.12em"
          fill="var(--muted2, #424245)"
          style={{ textTransform: "uppercase" }}
        >
          {/* === LEFT SIDE === */}
          {/* Forewing terracotta → --accent-warm */}
          <line x1="-32" y1="-12" x2="-72" y2="-12" stroke="var(--border, #d2d2d7)" strokeWidth="0.25" />
          <circle cx="-32" cy="-12" r="0.6" fill="var(--muted2, #424245)" />
          <text x="-74" y="-13" textAnchor="end">#D17B53</text>
          <text x="-74" y="-9" textAnchor="end" fill="var(--muted, #6e6e73)" fontSize="2">--ACCENT-WARM</text>

          {/* Forewing apex dark → --text */}
          <line x1="-44" y1="-22" x2="-72" y2="-28" stroke="var(--border, #d2d2d7)" strokeWidth="0.25" />
          <circle cx="-44" cy="-22" r="0.6" fill="var(--muted2, #424245)" />
          <text x="-74" y="-29" textAnchor="end">#1D1D1F</text>
          <text x="-74" y="-25" textAnchor="end" fill="var(--muted, #6e6e73)" fontSize="2">--TEXT</text>

          {/* White pupil → --bg */}
          <line x1="-40" y1="-26" x2="-72" y2="-40" stroke="var(--border, #d2d2d7)" strokeWidth="0.25" />
          <text x="-74" y="-41" textAnchor="end">#FFFFFF</text>
          <text x="-74" y="-37" textAnchor="end" fill="var(--muted, #6e6e73)" fontSize="2">--BG</text>

          {/* === RIGHT SIDE === */}
          {/* Cream patch (reserved) */}
          <line x1="14" y1="-13" x2="72" y2="-12" stroke="var(--border, #d2d2d7)" strokeWidth="0.25" />
          <circle cx="14" cy="-13" r="0.6" fill="var(--muted2, #424245)" />
          <text x="74" y="-13" textAnchor="start">#F5E9D3</text>
          <text x="74" y="-9" textAnchor="start" fill="var(--muted, #6e6e73)" fontSize="2">RESERVED</text>

          {/* Hindwing veining → --muted */}
          <line x1="20" y1="20" x2="72" y2="20" stroke="var(--border, #d2d2d7)" strokeWidth="0.25" />
          <circle cx="20" cy="20" r="0.6" fill="var(--muted2, #424245)" />
          <text x="74" y="19" textAnchor="start">#6E6E73</text>
          <text x="74" y="23" textAnchor="start" fill="var(--muted, #6e6e73)" fontSize="2">--MUTED</text>

          {/* Body ink → --muted2 */}
          <line x1="2" y1="14" x2="72" y2="36" stroke="var(--border, #d2d2d7)" strokeWidth="0.25" />
          <circle cx="2" cy="14" r="0.6" fill="var(--muted2, #424245)" />
          <text x="74" y="35" textAnchor="start">#424245</text>
          <text x="74" y="39" textAnchor="start" fill="var(--muted, #6e6e73)" fontSize="2">--MUTED2</text>
        </g>
      )}
    </svg>
  );
}
