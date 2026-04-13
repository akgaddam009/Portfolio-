const items = [
  "Enterprise SaaS", "B2B AI", "Workflow Design", "Design Systems",
  "0→1 Products", "Cross-functional Leadership", "Data Visualization",
  "Decision Architecture", "Multi-tenant Platforms", "Trust-Centered AI",
  "Information Architecture", "Staff-Level Thinking",
];

export default function Marquee() {
  const doubled = [...items, ...items];
  return (
    <div
      aria-hidden
      style={{
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
        padding: "12px 0",
        overflow: "hidden",
        background: "var(--bg)",
      }}
    >
      <div className="marquee-track" style={{ display: "flex", alignItems: "center", width: "max-content" }}>
        {doubled.map((item, i) => (
          <span key={i} style={{ display: "inline-flex", alignItems: "center" }}>
            <span style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11px", letterSpacing: "0.04em",
              color: "var(--muted)", whiteSpace: "nowrap", padding: "0 24px",
            }}>{item}</span>
            <span style={{ color: "var(--border)", fontSize: "8px" }}>·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
