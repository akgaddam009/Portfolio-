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
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: hasIcon ? (isMatch ? "4px" : "3px") : "0",
      padding: isMatch
        ? (hasIcon ? "0 10px 0 8px" : "0 10px")
        : (hasIcon ? "0 8px 0 5px" : "0 8px"),
      borderRadius: isMatch ? "8px" : "5px",
      background: `var(--chip-${tone}-bg)`,
      color: `var(--chip-${tone}-text)`,
      fontFamily: "var(--font-body)",
      fontSize: isMatch ? "inherit" : "12px",
      fontWeight: 400, letterSpacing: "-0.01em",
      lineHeight: isMatch ? 1.4 : 1.6,
      verticalAlign: "middle", whiteSpace: "nowrap",
    }}>
      {Icon && <Icon size={isMatch ? 13 : 11} strokeWidth={1.5} style={{ flexShrink: 0 }} />}
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
