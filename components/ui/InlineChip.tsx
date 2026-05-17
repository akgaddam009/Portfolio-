/* ── Inline concept chip — stroke icon + tinted pill embedded in prose ──
   Shared between the home About panel H1, the Contact panel subtext, and
   the case study detail hero title.

   Tones map to theme-aware CSS variables (--chip-{tone}-text/bg) so chips
   auto-adapt between light and dark themes. */

export type ChipTone = "indigo" | "teal" | "amber" | "violet" | "emerald";

export function InlineChip({ icon: Icon, label, tone, scale = "default", variant = "chip" }: {
  icon?: (p: { size?: number; strokeWidth?: number; style?: React.CSSProperties }) => React.ReactElement;
  label: string;
  tone: ChipTone;
  /** "default" → 12px chip for body prose; "match" → inherits parent font-size for headings. */
  scale?: "default" | "match";
  /** "chip" (default) → rounded pill, tinted text; "strip" → rectangular highlight, text stays --text. */
  variant?: "chip" | "strip";
}) {
  const isMatch = scale === "match";
  const hasIcon = Boolean(Icon);
  /* Line-height contract: chip's effective rendered height must NOT exceed the
     parent paragraph's line-height. Otherwise chip-bearing lines render taller
     than text-only lines and the paragraph rhythm breaks. */
  /* Alignment contract for headings (match scale):
     - display: inline-block so the chip's baseline IS its text baseline
       (inline-flex's baseline is the bottom edge, which threw chip text
       above the surrounding text baseline).
     - verticalAlign: baseline so chip text and plain text share the
       same baseline.
     - lineHeight: a tight 1.25 (smaller than the parent's line-height) so
       the chip background box is shorter than the line slot. Otherwise
       chip-bearing lines on consecutive rows overlap visually because each
       chip background fills the full line.
     - Parent (H1, body) MUST have lineHeight ≥ 1.5 to give chips breathing
       room between rows.
     - Icon sits inline next to text with its own vertical-align so it
       optical-centers on the cap height of the label.

     For body prose (default scale), the centered inline-flex layout
     remains because the visual difference is sub-pixel at 12px. */
  if (isMatch) {
    const isStrip = variant === "strip";
    return (
      <span style={{
        display: "inline-block",
        /* Padding tuned for breathing room without overpowering surrounding
           text. Horizontal 14 px so the chip body isn't cramped at small
           sizes; vertical 0.1em (proportional, ≈1.4 px at 14 px Contact,
           2.4 px at 24 px H1) so the bg has a sliver of space above/below
           the cap height.
           Strip: slightly more vertical breathing (0.15em) so the highlight
           band has presence without enlarging the line box. Radius 2px —
           rectangular highlighter, not a pill. */
        padding: isStrip
          ? (hasIcon ? "0.15em 12px 0.15em 9px" : "0.15em 12px")
          : (hasIcon ? "0.1em 14px 0.1em 10px" : "0.1em 14px"),
        borderRadius: isStrip ? "3px" : "0.3em",
        background: isStrip ? `var(--chip-${tone}-strip)` : `var(--chip-${tone}-bg)`,
        color: isStrip ? "var(--text)" : `var(--chip-${tone}-text)`,
        fontFamily: "var(--font-body)",
        fontSize: "inherit",
        /* fontWeight + letterSpacing inherit so chip text shares the
           parent's typographic rhythm. Without this, chips would override
           H1 (-0.03em) and body (-0.01em) tracking with a single value
           that fits neither. */
        fontWeight: "inherit",
        letterSpacing: "inherit",
        lineHeight: 1.25,
        verticalAlign: "baseline",
        whiteSpace: "nowrap",
      }}>
        {Icon && (
          <Icon
            size={13}
            strokeWidth={1.5}
            style={{ verticalAlign: "middle", marginRight: "4px", marginTop: "-0.15em" }}
          />
        )}
        {label}
      </span>
    );
  }

  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: hasIcon ? "3px" : "0",
      padding: hasIcon ? "0 8px 0 5px" : "0 8px",
      borderRadius: "5px",
      background: `var(--chip-${tone}-bg)`,
      color: `var(--chip-${tone}-text)`,
      fontFamily: "var(--font-body)",
      fontSize: "var(--text-caption)",
      fontWeight: 400, letterSpacing: "-0.01em",
      lineHeight: 1.6,
      verticalAlign: "middle",
      whiteSpace: "nowrap",
    }}>
      {Icon && <Icon size={11} strokeWidth={1.5} style={{ flexShrink: 0 }} />}
      {label}
    </span>
  );
}

/* Render a title with chip-highlighted spans. Splits the source title on each
   highlighted phrase and wraps the matching segment in <InlineChip scale="match">.
   First match wins per phrase to avoid duplicate-replace surprises. */
export function renderTitleWithChips(
  title: string,
  highlights?: Record<string, ChipTone>,
): React.ReactNode {
  if (!highlights || Object.keys(highlights).length === 0) return title;

  /* Build a regex of all phrases, escaped, longest-first so "Apple Maps" wins
     before "Apple". Order matters because regex alternation is left-to-right. */
  const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const phrases = Object.keys(highlights).sort((a, b) => b.length - a.length);
  const pattern = new RegExp(`(${phrases.map(escapeRegex).join("|")})`, "g");

  const parts = title.split(pattern);
  return parts.map((part, i) => {
    const tone = highlights[part];
    if (tone) return <InlineChip key={i} label={part} tone={tone} scale="match" />;
    return <span key={i}>{part}</span>;
  });
}
