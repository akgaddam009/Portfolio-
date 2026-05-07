/* ── Inline concept chip — stroke icon + tinted pill embedded in prose ──
   Shared between the home About panel H1, the Contact panel subtext, and
   the case study detail hero title.

   Tones map to theme-aware CSS variables (--chip-{tone}-text/bg) so chips
   auto-adapt between light and dark themes. */

export type ChipTone = "indigo" | "teal" | "amber" | "violet" | "emerald";

export function InlineChip({ icon: Icon, label, tone, scale = "default" }: {
  icon?: (p: { size?: number; strokeWidth?: number; style?: React.CSSProperties }) => React.ReactElement;
  label: string;
  tone: ChipTone;
  /** "default" → 12px chip for body prose; "match" → inherits parent font-size for headings. */
  scale?: "default" | "match";
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
     - lineHeight: inherit so the chip box is exactly the parent's line
       height, no taller, no shorter.
     - Icon sits inline next to text with its own vertical-align so it
       optical-centers on the cap height of the label.

     For body prose (default scale), the centered inline-flex layout
     remains because the visual difference is sub-pixel at 12px. */
  if (isMatch) {
    return (
      <span style={{
        display: "inline-block",
        padding: hasIcon ? "0 10px 0 8px" : "0 10px",
        borderRadius: "8px",
        background: `var(--chip-${tone}-bg)`,
        color: `var(--chip-${tone}-text)`,
        fontFamily: "var(--font-body)",
        fontSize: "inherit",
        fontWeight: 400, letterSpacing: "-0.01em",
        lineHeight: "inherit",
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
      fontSize: "12px",
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
