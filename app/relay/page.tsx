"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Design tokens — Mercury / Superhuman aesthetic ──────────────────
const T = {
  bg:           "#0b0b0b",
  surface:      "#131313",
  surface2:     "#1a1a1a",
  surface3:     "#222222",
  border:       "#272727",
  borderStrong: "#383838",
  text:         "#efefef",
  textMuted:    "#7a7a7a",
  textDim:      "#444",
  amber:        "#f0a500",
  amberDim:     "rgba(240,165,0,0.10)",
  amberBorder:  "rgba(240,165,0,0.22)",
  green:        "#22c55e",
  greenDim:     "rgba(34,197,94,0.10)",
  red:          "#ef4444",
  redDim:       "rgba(239,68,68,0.10)",
  blue:         "#60a5fa",
  blueDim:      "rgba(96,165,250,0.10)",
  purple:       "#a78bfa",
  purpleDim:    "rgba(167,139,250,0.10)",
};

type Risk    = "critical" | "high" | "medium";
type Channel = "whatsapp" | "email" | "call";
type Tab     = "analysis" | "notification" | "approver";

interface Contract {
  id: string;
  title: string;
  clause: string;
  company: string;
  value: string;
  risk: Risk;
  channel: Channel;
  aiReason: string;
  flaggedText: string;
  timeLeft: string;
  assignee: string;
  assigneeInitials: string;
  assigneeRole: string;
  confidence: number;
}

const CONTRACTS: Contract[] = [
  {
    id: "1",
    title: "Master Service Agreement",
    clause: "§12.4 — Indemnification",
    company: "Nexus Logistics Pvt Ltd",
    value: "₹2.4 Cr",
    risk: "critical",
    channel: "whatsapp",
    aiReason: "Unlimited liability exposure detected. This clause removes the standard liability cap, exposing the company to uncapped financial risk in the event of a dispute. Historical analysis of 3,200 similar contracts flags this as a critical deviation requiring CFO and Legal sign-off before countersigning.",
    flaggedText: "\"...shall indemnify and hold harmless the Client from any and all claims, damages, losses, and expenses of any kind, without limitation or cap...\"",
    timeLeft: "1h 42m",
    assignee: "Priya Sharma",
    assigneeInitials: "PS",
    assigneeRole: "CFO",
    confidence: 97,
  },
  {
    id: "2",
    title: "Vendor Supply Agreement",
    clause: "§5.1 — Payment Terms",
    company: "Bharat Steel Works",
    value: "₹68 L",
    risk: "high",
    channel: "email",
    aiReason: "Net-90 payment terms exceed your company's standard Net-30 policy by 60 days. Based on current outstanding receivables, accepting this clause would impact monthly cash flow by an estimated ₹22L. Finance review recommended before countersigning.",
    flaggedText: "\"...payment shall be due within 90 (ninety) calendar days from the date of invoice receipt and verification...\"",
    timeLeft: "4h 15m",
    assignee: "Rohan Mehta",
    assigneeInitials: "RM",
    assigneeRole: "Finance Lead",
    confidence: 91,
  },
  {
    id: "3",
    title: "Software Development Contract",
    clause: "§8.2 — IP Ownership",
    company: "TechBridge Solutions",
    value: "₹1.1 Cr",
    risk: "high",
    channel: "email",
    aiReason: "Vendor claims ownership of all derivative works and custom modules built during the engagement. This directly conflicts with your standard IP assignment clause (§7.1) used in 94% of similar contracts. Legal counsel review required.",
    flaggedText: "\"...all intellectual property, including derivative works, custom modifications, and purpose-built modules shall remain the exclusive property of the Vendor...\"",
    timeLeft: "6h 30m",
    assignee: "Ananya Iyer",
    assigneeInitials: "AI",
    assigneeRole: "Legal Counsel",
    confidence: 88,
  },
  {
    id: "4",
    title: "Distribution Agreement",
    clause: "§3.7 — Exclusivity",
    company: "Prime Distribution Co.",
    value: "₹45 L",
    risk: "medium",
    channel: "email",
    aiReason: "5-year exclusivity clause in a new geographic territory. No immediate red flags — standard deviations only. Regional manager sign-off is advised given the multi-year commitment and territory lock-in.",
    flaggedText: "\"...the Distributor shall have exclusive rights to market, sell, and distribute the Products within the Territory for a period of 5 (five) years from the Effective Date...\"",
    timeLeft: "18h",
    assignee: "Vikram Singh",
    assigneeInitials: "VS",
    assigneeRole: "Regional Head",
    confidence: 79,
  },
];

const RISK = {
  critical: { label: "Critical",  color: T.red,    dim: T.redDim,    dot: "#ef4444" },
  high:     { label: "High",      color: T.amber,  dim: T.amberDim,  dot: T.amber   },
  medium:   { label: "Medium",    color: T.blue,   dim: T.blueDim,   dot: T.blue    },
};

const CHANNEL = {
  whatsapp: { label: "WhatsApp", sublabel: "Instant · High urgency",  color: "#25d366" },
  email:    { label: "Email",    sublabel: "Async · Standard review", color: T.blue    },
  call:     { label: "Phone",    sublabel: "Escalation · Live",       color: T.purple  },
};

// ── WhatsApp message generator ───────────────────────────────────────
function buildWhatsAppMessage(c: Contract): string[] {
  return [
    `*🔴 Contract Alert — Action Required*`,
    ``,
    `Hi ${c.assignee.split(" ")[0]}, Relay flagged a *${RISK[c.risk].label}-risk clause* in a contract pending your review.`,
    ``,
    `*Contract:* ${c.title}`,
    `*Company:* ${c.company}`,
    `*Value:* ${c.value}`,
    `*Clause:* ${c.clause}`,
    ``,
    `*AI Summary:*`,
    c.aiReason.split(".")[0] + ".",
    ``,
    `*Deadline:* ${c.timeLeft} remaining`,
    ``,
    `Tap below to review and approve or flag for escalation.`,
  ];
}

function buildEmailSubject(c: Contract): string {
  return `[Relay] ${RISK[c.risk].label} clause flagged — ${c.title} · ${c.company}`;
}

function buildEmailBody(c: Contract): string[] {
  return [
    `Hi ${c.assignee.split(" ")[0]},`,
    ``,
    `Relay's AI has flagged a ${RISK[c.risk].label.toLowerCase()}-risk clause in a contract requiring your review.`,
    ``,
    `Contract: ${c.title}`,
    `Company: ${c.company}`,
    `Contract Value: ${c.value}`,
    `Flagged Clause: ${c.clause}`,
    ``,
    `AI Analysis:`,
    c.aiReason,
    ``,
    `Flagged Text:`,
    c.flaggedText,
    ``,
    `Please review and approve or escalate within ${c.timeLeft}.`,
    ``,
    `→ Review contract`,
    `→ Approve as-is`,
    `→ Flag for escalation`,
    ``,
    `— Relay AI`,
    `Powered by your contract review system`,
  ];
}

// ── Subcomponents ────────────────────────────────────────────────────

function RiskBadge({ risk }: { risk: Risk }) {
  const r = RISK[risk];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "2px 8px", borderRadius: 4,
      background: r.dim, border: `1px solid ${r.color}33`,
      color: r.color,
      fontFamily: "var(--font-manrope, sans-serif)",
      fontSize: 10, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase",
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: r.dot, display: "inline-block" }} />
      {r.label}
    </span>
  );
}

function ChannelBadge({ channel }: { channel: Channel }) {
  const ch = CHANNEL[channel];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "2px 8px", borderRadius: 4,
      background: `${ch.color}18`, border: `1px solid ${ch.color}33`,
      color: ch.color,
      fontFamily: "var(--font-manrope, sans-serif)",
      fontSize: 10, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase",
    }}>
      {ch.label}
    </span>
  );
}

function Avatar({ initials, color }: { initials: string; color: string }) {
  return (
    <div style={{
      width: 28, height: 28, borderRadius: "50%",
      background: `${color}22`, border: `1px solid ${color}44`,
      display: "flex", alignItems: "center", justifyContent: "center",
      color, fontFamily: "var(--font-manrope, sans-serif)",
      fontSize: 10, fontWeight: 600, letterSpacing: "0.04em", flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────
export default function RelayPage() {
  const [selected, setSelected] = useState<string>(CONTRACTS[0].id);
  const [tab, setTab]           = useState<Tab>("analysis");
  const [approved, setApproved] = useState<Set<string>>(new Set());
  const [escalated, setEscalated] = useState<Set<string>>(new Set());

  const contract = CONTRACTS.find(c => c.id === selected)!;
  const waLines  = buildWhatsAppMessage(contract);
  const emLines  = buildEmailBody(contract);

  const handleApprove = () => setApproved(prev => new Set([...prev, selected]));
  const handleEscalate = () => setEscalated(prev => new Set([...prev, selected]));

  const isApproved  = approved.has(selected);
  const isEscalated = escalated.has(selected);

  return (
    <div style={{
      minHeight: "100vh", background: T.bg,
      fontFamily: "var(--font-manrope, -apple-system, sans-serif)",
      color: T.text, display: "flex", flexDirection: "column",
    }}>

      {/* ── Top bar ─────────────────────────────────────────────── */}
      <div style={{
        height: 52, borderBottom: `1px solid ${T.border}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 20px", background: T.surface, flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Logo mark */}
          <div style={{
            width: 26, height: 26, borderRadius: 7,
            background: T.amber, display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M7 2l5 5-5 5" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.02em", color: T.text }}>
            Relay
          </span>
          <span style={{
            padding: "1px 7px", borderRadius: 4, background: T.amberDim,
            border: `1px solid ${T.amberBorder}`, color: T.amber,
            fontFamily: "var(--font-manrope, sans-serif)", fontSize: 9,
            letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 500,
          }}>
            AI
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{
            fontFamily: "var(--font-manrope, sans-serif)", fontSize: 10,
            color: T.textMuted, letterSpacing: "0.06em", textTransform: "uppercase",
          }}>
            {CONTRACTS.filter(c => !approved.has(c.id) && !escalated.has(c.id)).length} pending
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: T.green }} />
            <span style={{
              fontFamily: "var(--font-manrope, sans-serif)", fontSize: 10,
              color: T.textMuted, letterSpacing: "0.06em",
            }}>
              AI active
            </span>
          </div>
        </div>
      </div>

      {/* ── Body ────────────────────────────────────────────────── */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* ── Sidebar: contract inbox ──────────────────────────── */}
        <div style={{
          width: 300, borderRight: `1px solid ${T.border}`,
          background: T.surface, display: "flex", flexDirection: "column", flexShrink: 0,
          overflowY: "auto",
        }}>
          <div style={{
            padding: "14px 16px 10px",
            borderBottom: `1px solid ${T.border}`,
          }}>
            <p style={{
              fontFamily: "var(--font-manrope, sans-serif)", fontSize: 9,
              color: T.textMuted, letterSpacing: "0.12em", textTransform: "uppercase",
              margin: 0, fontWeight: 500,
            }}>
              Flagged contracts
            </p>
          </div>

          {CONTRACTS.map(c => {
            const isSelected = selected === c.id;
            const isDone = approved.has(c.id) || escalated.has(c.id);
            return (
              <div
                key={c.id}
                onClick={() => { setSelected(c.id); setTab("analysis"); }}
                style={{
                  padding: "14px 16px",
                  borderBottom: `1px solid ${T.border}`,
                  cursor: "pointer",
                  background: isSelected ? T.surface2 : "transparent",
                  borderLeft: isSelected ? `2px solid ${T.amber}` : "2px solid transparent",
                  opacity: isDone ? 0.45 : 1,
                  transition: "background 0.15s, opacity 0.2s",
                }}
                onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLDivElement).style.background = T.surface2; }}
                onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: T.text, lineHeight: 1.3, flex: 1, marginRight: 8 }}>
                    {c.title}
                  </span>
                  {isDone ? (
                    <span style={{
                      fontFamily: "var(--font-manrope, sans-serif)", fontSize: 9,
                      color: approved.has(c.id) ? T.green : T.purple,
                      letterSpacing: "0.06em", textTransform: "uppercase",
                    }}>
                      {approved.has(c.id) ? "Done" : "Escalated"}
                    </span>
                  ) : (
                    <RiskBadge risk={c.risk} />
                  )}
                </div>

                <p style={{ fontSize: 11, color: T.textMuted, margin: "0 0 8px", lineHeight: 1.4 }}>
                  {c.company}
                </p>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <ChannelBadge channel={c.channel} />
                  <span style={{
                    fontFamily: "var(--font-manrope, sans-serif)", fontSize: 10,
                    color: c.risk === "critical" ? T.red : T.textDim,
                  }}>
                    {isDone ? "—" : c.timeLeft}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Main panel ──────────────────────────────────────────── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

          {/* Contract header */}
          <div style={{
            padding: "18px 28px 16px",
            borderBottom: `1px solid ${T.border}`,
            background: T.surface,
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
              <div>
                <h1 style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.02em", color: T.text, margin: "0 0 4px" }}>
                  {contract.title}
                </h1>
                <p style={{ fontSize: 12, color: T.textMuted, margin: 0 }}>
                  {contract.company} · {contract.value}
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <RiskBadge risk={contract.risk} />
                <ChannelBadge channel={contract.channel} />
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: 2 }}>
              {(["analysis", "notification", "approver"] as Tab[]).map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  style={{
                    padding: "6px 14px", borderRadius: 6, border: "none",
                    background: tab === t ? T.surface3 : "transparent",
                    color: tab === t ? T.text : T.textMuted,
                    fontFamily: "var(--font-manrope, sans-serif)",
                    fontSize: 10, fontWeight: 500, letterSpacing: "0.06em",
                    textTransform: "uppercase", cursor: "pointer",
                    transition: "background 0.15s, color 0.15s",
                  }}
                >
                  {t === "analysis" ? "AI Analysis" : t === "notification" ? "Notification" : "Approver View"}
                </button>
              ))}
            </div>
          </div>

          {/* Tab content */}
          <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={`${selected}-${tab}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18 }}
              >

                {/* ── AI Analysis tab ─────────────────────────── */}
                {tab === "analysis" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 680 }}>

                    {/* Flagged clause */}
                    <div style={{
                      background: T.surface2, border: `1px solid ${T.border}`,
                      borderRadius: 10, padding: "16px 20px",
                    }}>
                      <p style={{
                        fontFamily: "var(--font-manrope, sans-serif)", fontSize: 9,
                        color: T.textMuted, letterSpacing: "0.12em", textTransform: "uppercase",
                        margin: "0 0 10px", fontWeight: 500,
                      }}>
                        Flagged clause
                      </p>
                      <p style={{
                        fontSize: 12, fontFamily: "var(--font-manrope, sans-serif)",
                        color: T.amber, lineHeight: 1.7, margin: 0,
                        background: T.amberDim, border: `1px solid ${T.amberBorder}`,
                        borderRadius: 6, padding: "10px 14px",
                      }}>
                        {contract.flaggedText}
                      </p>
                      <p style={{ fontSize: 11, color: T.textMuted, margin: "8px 0 0" }}>
                        {contract.clause}
                      </p>
                    </div>

                    {/* AI reasoning */}
                    <div style={{
                      background: T.surface2, border: `1px solid ${T.border}`,
                      borderRadius: 10, padding: "16px 20px",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                        <p style={{
                          fontFamily: "var(--font-manrope, sans-serif)", fontSize: 9,
                          color: T.textMuted, letterSpacing: "0.12em", textTransform: "uppercase",
                          margin: 0, fontWeight: 500,
                        }}>
                          AI reasoning
                        </p>
                        <span style={{
                          fontFamily: "var(--font-manrope, sans-serif)", fontSize: 10,
                          color: contract.confidence >= 90 ? T.red : T.amber,
                          background: contract.confidence >= 90 ? T.redDim : T.amberDim,
                          border: `1px solid ${contract.confidence >= 90 ? T.red : T.amber}33`,
                          padding: "2px 8px", borderRadius: 4,
                        }}>
                          {contract.confidence}% confidence
                        </span>
                      </div>
                      <p style={{ fontSize: 13, color: T.text, lineHeight: 1.7, margin: 0 }}>
                        {contract.aiReason}
                      </p>
                    </div>

                    {/* Routing decision */}
                    <div style={{
                      background: T.surface2, border: `1px solid ${T.border}`,
                      borderRadius: 10, padding: "16px 20px",
                    }}>
                      <p style={{
                        fontFamily: "var(--font-manrope, sans-serif)", fontSize: 9,
                        color: T.textMuted, letterSpacing: "0.12em", textTransform: "uppercase",
                        margin: "0 0 14px", fontWeight: 500,
                      }}>
                        Channel routing decision
                      </p>

                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {(["whatsapp", "email", "call"] as Channel[]).map(ch => {
                          const selected_ch = contract.channel === ch;
                          const cfg = CHANNEL[ch];
                          return (
                            <div key={ch} style={{
                              display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
                              borderRadius: 8, border: `1px solid ${selected_ch ? cfg.color + "44" : T.border}`,
                              background: selected_ch ? `${cfg.color}0f` : "transparent",
                            }}>
                              <div style={{
                                width: 8, height: 8, borderRadius: "50%",
                                background: selected_ch ? cfg.color : T.borderStrong, flexShrink: 0,
                              }} />
                              <div style={{ flex: 1 }}>
                                <span style={{ fontSize: 12, color: selected_ch ? cfg.color : T.textMuted, fontWeight: selected_ch ? 500 : 400 }}>
                                  {cfg.label}
                                </span>
                                <span style={{ fontSize: 11, color: T.textDim, marginLeft: 8 }}>
                                  {cfg.sublabel}
                                </span>
                              </div>
                              {selected_ch && (
                                <span style={{
                                  fontFamily: "var(--font-manrope, sans-serif)", fontSize: 9,
                                  color: cfg.color, background: `${cfg.color}18`,
                                  border: `1px solid ${cfg.color}33`,
                                  padding: "2px 7px", borderRadius: 4, letterSpacing: "0.08em", textTransform: "uppercase",
                                }}>
                                  AI selected
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14, paddingTop: 14, borderTop: `1px solid ${T.border}` }}>
                        <Avatar initials={contract.assigneeInitials} color={CHANNEL[contract.channel].color} />
                        <div>
                          <p style={{ fontSize: 12, color: T.text, margin: 0, fontWeight: 500 }}>{contract.assignee}</p>
                          <p style={{ fontSize: 11, color: T.textMuted, margin: 0 }}>{contract.assigneeRole}</p>
                        </div>
                        <div style={{ marginLeft: "auto" }}>
                          <button
                            onClick={() => setTab("notification")}
                            style={{
                              padding: "7px 16px", borderRadius: 7, border: `1px solid ${T.amber}55`,
                              background: T.amberDim, color: T.amber, fontSize: 12, fontWeight: 500,
                              cursor: "pointer", letterSpacing: "-0.01em",
                            }}
                          >
                            Preview notification →
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Notification preview tab ─────────────────── */}
                {tab === "notification" && (
                  <div style={{ display: "flex", gap: 24, maxWidth: 800 }}>

                    {/* Left: message preview */}
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
                      <div style={{
                        background: T.surface2, border: `1px solid ${T.border}`,
                        borderRadius: 10, padding: "16px 20px",
                      }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                          <p style={{
                            fontFamily: "var(--font-manrope, sans-serif)", fontSize: 9,
                            color: T.textMuted, letterSpacing: "0.12em", textTransform: "uppercase",
                            margin: 0, fontWeight: 500,
                          }}>
                            {contract.channel === "whatsapp" ? "WhatsApp message" : "Email draft"}
                          </p>
                          <ChannelBadge channel={contract.channel} />
                        </div>

                        {contract.channel === "email" && (
                          <div style={{
                            padding: "8px 12px", borderRadius: 6,
                            background: T.surface3, border: `1px solid ${T.border}`,
                            marginBottom: 12,
                          }}>
                            <p style={{
                              fontFamily: "var(--font-manrope, sans-serif)", fontSize: 9,
                              color: T.textMuted, letterSpacing: "0.08em", textTransform: "uppercase",
                              margin: "0 0 2px",
                            }}>Subject</p>
                            <p style={{ fontSize: 12, color: T.text, margin: 0 }}>{buildEmailSubject(contract)}</p>
                          </div>
                        )}

                        <div style={{
                          padding: "12px 14px", borderRadius: 8,
                          background: contract.channel === "whatsapp" ? "#0d1f13" : T.surface3,
                          border: `1px solid ${contract.channel === "whatsapp" ? "#25d36633" : T.border}`,
                          fontFamily: contract.channel === "whatsapp" ? "var(--font-manrope, sans-serif)" : "var(--font-manrope, sans-serif)",
                          fontSize: 12.5, lineHeight: 1.75, color: T.text,
                          whiteSpace: "pre-line",
                        }}>
                          {(contract.channel === "whatsapp" ? waLines : emLines).join("\n")}
                        </div>
                      </div>

                      {/* Send CTA */}
                      <div style={{ display: "flex", gap: 10 }}>
                        <button
                          onClick={() => setTab("approver")}
                          style={{
                            flex: 1, padding: "10px 0", borderRadius: 8,
                            border: "none", background: T.amber, color: "#000",
                            fontSize: 13, fontWeight: 600, cursor: "pointer",
                            letterSpacing: "-0.01em",
                          }}
                        >
                          Send to {contract.assignee.split(" ")[0]}
                        </button>
                        <button style={{
                          padding: "10px 16px", borderRadius: 8,
                          border: `1px solid ${T.border}`, background: "transparent",
                          color: T.textMuted, fontSize: 13, cursor: "pointer",
                        }}>
                          Edit
                        </button>
                      </div>
                    </div>

                    {/* Right: recipient info */}
                    <div style={{ width: 220, display: "flex", flexDirection: "column", gap: 12 }}>
                      <div style={{
                        background: T.surface2, border: `1px solid ${T.border}`,
                        borderRadius: 10, padding: "16px",
                      }}>
                        <p style={{
                          fontFamily: "var(--font-manrope, sans-serif)", fontSize: 9,
                          color: T.textMuted, letterSpacing: "0.12em", textTransform: "uppercase",
                          margin: "0 0 12px", fontWeight: 500,
                        }}>
                          Recipient
                        </p>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <Avatar initials={contract.assigneeInitials} color={CHANNEL[contract.channel].color} />
                          <div>
                            <p style={{ fontSize: 12, color: T.text, margin: 0, fontWeight: 500 }}>{contract.assignee}</p>
                            <p style={{ fontSize: 11, color: T.textMuted, margin: 0 }}>{contract.assigneeRole}</p>
                          </div>
                        </div>
                      </div>

                      <div style={{
                        background: T.surface2, border: `1px solid ${T.border}`,
                        borderRadius: 10, padding: "16px",
                      }}>
                        <p style={{
                          fontFamily: "var(--font-manrope, sans-serif)", fontSize: 9,
                          color: T.textMuted, letterSpacing: "0.12em", textTransform: "uppercase",
                          margin: "0 0 10px", fontWeight: 500,
                        }}>
                          Deadline
                        </p>
                        <p style={{
                          fontSize: 20, fontWeight: 700, color: contract.risk === "critical" ? T.red : T.amber,
                          margin: 0, letterSpacing: "-0.03em",
                        }}>
                          {contract.timeLeft}
                        </p>
                        <p style={{ fontSize: 11, color: T.textMuted, margin: "2px 0 0" }}>remaining</p>
                      </div>

                      <div style={{
                        background: T.surface2, border: `1px solid ${T.border}`,
                        borderRadius: 10, padding: "16px",
                      }}>
                        <p style={{
                          fontFamily: "var(--font-manrope, sans-serif)", fontSize: 9,
                          color: T.textMuted, letterSpacing: "0.12em", textTransform: "uppercase",
                          margin: "0 0 10px", fontWeight: 500,
                        }}>
                          AI confidence
                        </p>
                        <p style={{
                          fontSize: 20, fontWeight: 700,
                          color: contract.confidence >= 90 ? T.red : T.amber,
                          margin: 0, letterSpacing: "-0.03em",
                        }}>
                          {contract.confidence}%
                        </p>
                        <div style={{
                          height: 4, background: T.surface3, borderRadius: 2, marginTop: 8, overflow: "hidden",
                        }}>
                          <div style={{
                            height: "100%", width: "100%",
                            transform: `scaleX(${contract.confidence / 100})`,
                            transformOrigin: "left",
                            background: contract.confidence >= 90 ? T.red : T.amber,
                            transition: "transform 0.4s ease",
                          }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Approver view tab ────────────────────────── */}
                {tab === "approver" && (
                  <div style={{ display: "flex", gap: 24, maxWidth: 800, alignItems: "flex-start" }}>

                    {/* Phone mockup for WhatsApp / email client */}
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>

                      {/* Device frame */}
                      <div style={{
                        background: T.surface2, border: `1px solid ${T.border}`,
                        borderRadius: 12, padding: "16px 20px",
                      }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                          <p style={{
                            fontFamily: "var(--font-manrope, sans-serif)", fontSize: 9,
                            color: T.textMuted, letterSpacing: "0.12em", textTransform: "uppercase",
                            margin: 0, fontWeight: 500,
                          }}>
                            What {contract.assignee.split(" ")[0]} sees
                          </p>
                          <ChannelBadge channel={contract.channel} />
                        </div>

                        {/* Message bubble simulation */}
                        {contract.channel === "whatsapp" ? (
                          <div style={{
                            background: "#111b11", borderRadius: 10, padding: "12px",
                            border: "1px solid #25d36622",
                          }}>
                            {/* WA header */}
                            <div style={{
                              display: "flex", alignItems: "center", gap: 10,
                              paddingBottom: 10, borderBottom: "1px solid #25d36618", marginBottom: 12,
                            }}>
                              <div style={{
                                width: 32, height: 32, borderRadius: "50%",
                                background: T.amberDim, border: `1px solid ${T.amberBorder}`,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 14,
                              }}>⚡</div>
                              <div>
                                <p style={{ fontSize: 13, fontWeight: 600, color: "#25d366", margin: 0 }}>Relay AI</p>
                                <p style={{ fontSize: 10, color: T.textMuted, margin: 0 }}>Contract Intelligence</p>
                              </div>
                              <span style={{ marginLeft: "auto", fontSize: 10, color: T.textDim }}>now</span>
                            </div>

                            {/* Message */}
                            <div style={{
                              background: "#1f2b1f", borderRadius: "12px 12px 12px 2px",
                              padding: "10px 14px", maxWidth: "90%",
                              fontSize: 13, lineHeight: 1.7, color: "#e8e8e8",
                              whiteSpace: "pre-line",
                            }}>
                              {waLines.join("\n")}
                            </div>

                            {/* Action buttons */}
                            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                              <button
                                onClick={handleApprove}
                                disabled={isApproved || isEscalated}
                                style={{
                                  flex: 1, padding: "9px 0", borderRadius: 8,
                                  border: "none",
                                  background: isApproved ? T.greenDim : "#25d366",
                                  color: isApproved ? T.green : "#000",
                                  fontSize: 12, fontWeight: 600, cursor: isApproved || isEscalated ? "default" : "pointer",
                                }}
                              >
                                {isApproved ? "✓ Approved" : "Approve"}
                              </button>
                              <button
                                onClick={handleEscalate}
                                disabled={isApproved || isEscalated}
                                style={{
                                  flex: 1, padding: "9px 0", borderRadius: 8,
                                  border: `1px solid ${T.border}`,
                                  background: isEscalated ? T.purpleDim : T.surface3,
                                  color: isEscalated ? T.purple : T.textMuted,
                                  fontSize: 12, cursor: isApproved || isEscalated ? "default" : "pointer",
                                }}
                              >
                                {isEscalated ? "↑ Escalated" : "Escalate"}
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* Email client simulation */
                          <div style={{
                            background: T.surface3, borderRadius: 10, padding: "16px",
                            border: `1px solid ${T.border}`,
                          }}>
                            <div style={{ borderBottom: `1px solid ${T.border}`, paddingBottom: 12, marginBottom: 12 }}>
                              <p style={{ fontSize: 14, fontWeight: 600, color: T.text, margin: "0 0 4px", lineHeight: 1.3 }}>
                                {buildEmailSubject(contract)}
                              </p>
                              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
                                <Avatar initials="RA" color={T.amber} />
                                <div>
                                  <p style={{ fontSize: 11, color: T.text, margin: 0 }}>Relay AI &lt;relay@yourcompany.com&gt;</p>
                                  <p style={{ fontSize: 10, color: T.textMuted, margin: 0 }}>to {contract.assignee}</p>
                                </div>
                                <span style={{ marginLeft: "auto", fontSize: 10, color: T.textDim }}>just now</span>
                              </div>
                            </div>

                            <div style={{
                              fontSize: 12.5, lineHeight: 1.8, color: T.text,
                              whiteSpace: "pre-line", marginBottom: 16,
                            }}>
                              {emLines.join("\n")}
                            </div>

                            <div style={{ display: "flex", gap: 8 }}>
                              <button
                                onClick={handleApprove}
                                disabled={isApproved || isEscalated}
                                style={{
                                  padding: "8px 20px", borderRadius: 7, border: "none",
                                  background: isApproved ? T.greenDim : T.amber,
                                  color: isApproved ? T.green : "#000",
                                  fontSize: 12, fontWeight: 600, cursor: isApproved || isEscalated ? "default" : "pointer",
                                }}
                              >
                                {isApproved ? "✓ Approved" : "→ Approve as-is"}
                              </button>
                              <button
                                onClick={handleEscalate}
                                disabled={isApproved || isEscalated}
                                style={{
                                  padding: "8px 20px", borderRadius: 7,
                                  border: `1px solid ${T.border}`, background: "transparent",
                                  color: isEscalated ? T.purple : T.textMuted,
                                  fontSize: 12, cursor: isApproved || isEscalated ? "default" : "pointer",
                                }}
                              >
                                {isEscalated ? "↑ Escalated" : "↑ Escalate"}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Post-action status */}
                      {(isApproved || isEscalated) && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          style={{
                            padding: "14px 18px", borderRadius: 10,
                            background: isApproved ? T.greenDim : T.purpleDim,
                            border: `1px solid ${isApproved ? T.green : T.purple}44`,
                            display: "flex", alignItems: "center", gap: 12,
                          }}
                        >
                          <div style={{
                            width: 28, height: 28, borderRadius: "50%",
                            background: isApproved ? `${T.green}22` : `${T.purple}22`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 14,
                          }}>
                            {isApproved ? "✓" : "↑"}
                          </div>
                          <div>
                            <p style={{ fontSize: 13, fontWeight: 500, color: isApproved ? T.green : T.purple, margin: 0 }}>
                              {isApproved ? "Contract approved" : "Escalated to legal team"}
                            </p>
                            <p style={{ fontSize: 11, color: T.textMuted, margin: "2px 0 0" }}>
                              {isApproved
                                ? "AI has logged the decision and updated the contract status."
                                : "Legal team has been notified. Contract is on hold pending review."}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </div>

                    {/* Right: decision context */}
                    <div style={{ width: 220, display: "flex", flexDirection: "column", gap: 12 }}>
                      <div style={{
                        background: T.surface2, border: `1px solid ${T.border}`,
                        borderRadius: 10, padding: "16px",
                      }}>
                        <p style={{
                          fontFamily: "var(--font-manrope, sans-serif)", fontSize: 9,
                          color: T.textMuted, letterSpacing: "0.12em", textTransform: "uppercase",
                          margin: "0 0 12px", fontWeight: 500,
                        }}>
                          Why this channel?
                        </p>
                        <p style={{ fontSize: 12, color: T.text, lineHeight: 1.6, margin: 0 }}>
                          {contract.channel === "whatsapp"
                            ? "Critical risk requires immediate attention. WhatsApp ensures the approver sees this within minutes, not hours."
                            : "Standard risk level. Email provides the detail and audit trail needed for a considered review."}
                        </p>
                      </div>

                      <div style={{
                        background: T.surface2, border: `1px solid ${T.border}`,
                        borderRadius: 10, padding: "16px",
                      }}>
                        <p style={{
                          fontFamily: "var(--font-manrope, sans-serif)", fontSize: 9,
                          color: T.textMuted, letterSpacing: "0.12em", textTransform: "uppercase",
                          margin: "0 0 10px", fontWeight: 500,
                        }}>
                          Decision options
                        </p>
                        {["Approve as-is", "Request redline", "Escalate to legal", "Reject clause"].map((opt, i) => (
                          <div key={opt} style={{
                            display: "flex", alignItems: "center", gap: 8,
                            padding: "7px 0",
                            borderBottom: i < 3 ? `1px solid ${T.border}` : "none",
                          }}>
                            <div style={{
                              width: 6, height: 6, borderRadius: "50%",
                              background: i === 0 ? T.green : i === 3 ? T.red : T.textDim, flexShrink: 0,
                            }} />
                            <span style={{ fontSize: 11, color: i === 0 ? T.text : T.textMuted }}>{opt}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <div style={{
        height: 40, borderTop: `1px solid ${T.border}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 20px", background: T.surface, flexShrink: 0,
      }}>
        <span style={{
          fontFamily: "var(--font-manrope, sans-serif)", fontSize: 9,
          color: T.textDim, letterSpacing: "0.1em", textTransform: "uppercase",
        }}>
          Relay · AI-powered contract approval routing · Concept by Arun Gaddam
        </span>
        <span style={{
          fontFamily: "var(--font-manrope, sans-serif)", fontSize: 9,
          color: T.textDim, letterSpacing: "0.06em",
        }}>
          {approved.size + escalated.size} of {CONTRACTS.length} resolved
        </span>
      </div>
    </div>
  );
}
