"use client";

/* ─── Astra · Problem 1 — AI Contract Review ──────────────
   The full procurement → legal handoff flow. Eight screens
   total, role-switched. Procurement uploads, reviews AI
   extraction, sends to legal. Legal reviews with legal-emphasis
   fields, approves and forwards.

   State drives navigation between screens. No external state
   library — useState in the page component, callbacks drilled
   one level into screen sub-components. */

import Link from "next/link";
import { useEffect, useState } from "react";
import { CONTRACTS, INFOSYS_FIELDS, LEGAL_QUEUE, ExtractedField, FieldStatus } from "@/lib/astra/data";

type Role = "procurement" | "legal";
type ProcScreen = "landing" | "upload" | "processing" | "review-unresolved" | "review-resolved";
type LegalScreen = "queue" | "review" | "approve";

export default function P1Page() {
  const [role, setRole] = useState<Role>("procurement");
  const [procScreen, setProcScreen] = useState<ProcScreen>("landing");
  const [legalScreen, setLegalScreen] = useState<LegalScreen>("queue");

  // Mutable copy of the Infosys fields so resolution updates the UI.
  const [fields, setFields] = useState<ExtractedField[]>(INFOSYS_FIELDS);

  /* External navigation surface — when this page is iframed inside the case
     study, the parent posts { type: 'astra-nav', role, screen } messages to
     jump to a specific screen. URL query params do the same on first load
     (so deep links like /astra/p1?role=legal&screen=review work). */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const r = params.get("role");
    const s = params.get("screen");
    if (r === "legal" || r === "procurement") setRole(r);
    if (s) {
      if (["landing", "upload", "processing", "review-unresolved", "review-resolved"].includes(s)) {
        setProcScreen(s as ProcScreen);
      } else if (["queue", "review", "approve"].includes(s)) {
        setLegalScreen(s as LegalScreen);
      }
    }

    const onMessage = (e: MessageEvent) => {
      const data = e.data;
      if (!data || data.type !== "astra-nav") return;
      if (data.role === "procurement" || data.role === "legal") setRole(data.role);
      if (data.screen) {
        if (["landing", "upload", "processing", "review-unresolved", "review-resolved"].includes(data.screen)) {
          setProcScreen(data.screen);
        } else if (["queue", "review", "approve"].includes(data.screen)) {
          setLegalScreen(data.screen);
        }
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const resolveField = (id: string, newValue?: string) => {
    setFields(prev => prev.map(f =>
      f.id === id
        ? { ...f, status: "confident" as FieldStatus, value: newValue ?? f.value }
        : f
    ));
  };

  const unresolved = fields.filter(f => f.status !== "confident").length;

  return (
    <>
      {/* ─── Branded nav with role switcher ─── */}
      <nav className="astra-nav">
        <Link href="/work/astra" className="astra-nav-brand">
          Indemn <span className="astra-nav-brand-v">Review</span>
        </Link>
        <div className="astra-nav-role-section">
          <span className="astra-role-label">Role</span>
          <div className="astra-role-switcher">
            <button
              className={`astra-role-pill proc ${role === "procurement" ? "active" : ""}`}
              onClick={() => setRole("procurement")}
            >
              Procurement
            </button>
            <button
              className={`astra-role-pill legal ${role === "legal" ? "active" : ""}`}
              onClick={() => setRole("legal")}
            >
              Legal
            </button>
          </div>
        </div>
        <Link href="/work/astra" className="astra-nav-back">← Back to case study</Link>
      </nav>

      <div className="astra-screen">
        {role === "procurement" ? (
          <ProcurementFlow
            screen={procScreen}
            setScreen={setProcScreen}
            fields={fields}
            unresolved={unresolved}
            resolveField={resolveField}
          />
        ) : (
          <LegalFlow
            screen={legalScreen}
            setScreen={setLegalScreen}
            fields={fields}
          />
        )}
      </div>
    </>
  );
}

/* ════════════════════════════════════════════════
   PROCUREMENT FLOW
   ════════════════════════════════════════════════ */

function ProcurementFlow({
  screen, setScreen, fields, unresolved, resolveField,
}: {
  screen: ProcScreen;
  setScreen: (s: ProcScreen) => void;
  fields: ExtractedField[];
  unresolved: number;
  resolveField: (id: string, value?: string) => void;
}) {
  return (
    <>
      {/* Step indicator */}
      <ProcStepIndicator screen={screen} setScreen={setScreen} />

      <div className="astra-chrome" style={{ marginTop: "16px" }}>
        <div className="astra-topbar">
          <span className="astra-tb-logo">Indemn</span>
          <span className="astra-tb-sep" />
          <span className="astra-tb-role-chip proc">Procurement</span>
          {screen !== "landing" && (
            <button className="astra-tb-back" onClick={() => setScreen("landing")}>← Contracts</button>
          )}
          <span className="astra-tb-crumb">
            <span className={screen === "landing" ? "active" : ""}>Contracts</span>
            {screen !== "landing" && <><span style={{ margin: "0 4px" }}>/</span>
              <span className="active">{crumbLabel(screen)}</span>
            </>}
          </span>
          <div className="astra-tb-right">
            {screen === "landing" && (
              <>
                <button className="astra-btn astra-btn-ghost astra-btn-sm">Filter</button>
                <button
                  className="astra-btn astra-btn-primary astra-btn-sm"
                  onClick={() => setScreen("upload")}
                >
                  + New contract
                </button>
              </>
            )}
          </div>
        </div>

        {screen === "landing"           && <ProcLanding setScreen={setScreen} />}
        {screen === "upload"            && <ProcUpload setScreen={setScreen} />}
        {screen === "processing"        && <ProcProcessing setScreen={setScreen} />}
        {screen === "review-unresolved" && <ProcReview unresolved={unresolved} fields={fields} resolveField={resolveField} variant="unresolved" setScreen={setScreen} />}
        {screen === "review-resolved"   && <ProcReview unresolved={unresolved} fields={fields} resolveField={resolveField} variant="resolved"   setScreen={setScreen} />}
      </div>
    </>
  );
}

function crumbLabel(screen: ProcScreen): string {
  return ({
    upload: "New contract",
    processing: "New contract · Processing",
    "review-unresolved": "Infosys MSA 2024 · Review",
    "review-resolved":   "Infosys MSA 2024 · Ready to send",
  } as Record<ProcScreen, string>)[screen] ?? "";
}

function ProcStepIndicator({ screen, setScreen }: { screen: ProcScreen; setScreen: (s: ProcScreen) => void }) {
  const steps: { id: ProcScreen; label: string }[] = [
    { id: "landing",            label: "Landing"   },
    { id: "upload",             label: "Upload"    },
    { id: "processing",         label: "Processing"},
    { id: "review-unresolved",  label: "Review"    },
    { id: "review-resolved",    label: "Send"      },
  ];
  const activeIdx = steps.findIndex(s => s.id === screen);
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "8px",
      fontFamily: "var(--astra-font-mono)", fontSize: "10px",
      letterSpacing: "0.06em", textTransform: "uppercase",
      color: "var(--astra-text-3)",
      flexWrap: "wrap",
    }}>
      <span>Procurement flow</span>
      <span>·</span>
      {steps.map((s, i) => (
        <button
          key={s.id}
          onClick={() => setScreen(s.id)}
          style={{
            background: i === activeIdx ? "var(--astra-yellow-bg)" : "transparent",
            border: "none", cursor: "pointer",
            padding: "2px 6px",
            fontFamily: "inherit", fontSize: "inherit", letterSpacing: "inherit", textTransform: "inherit",
            color: i === activeIdx ? "var(--astra-text-1)" : "var(--astra-text-3)",
            fontWeight: i === activeIdx ? 600 : 400,
            borderRadius: "3px",
          }}
        >
          {String(i + 1).padStart(2, "0")} {s.label}
        </button>
      ))}
    </div>
  );
}

/* ─── Screen 1: Landing ─── */

function ProcLanding({ setScreen }: { setScreen: (s: ProcScreen) => void }) {
  return (
    <div className="astra-app-shell">
      <LeftNav active="contracts" />
      <div className="astra-main">
        {/* Returned banner */}
        <div style={{
          display: "flex", alignItems: "center", gap: "10px",
          background: "var(--astra-red-bg)", border: "1px solid var(--astra-red-border)",
          padding: "10px 14px", borderRadius: "5px", marginBottom: "12px",
          fontSize: "12px", color: "var(--astra-red)",
        }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--astra-red-dot)", flexShrink: 0 }} />
          <span style={{ flex: 1 }}>
            <strong>Zoho HR Suite</strong> returned by Legal — &quot;Liability cap clause needs correction.&quot;
            <span style={{ textDecoration: "underline", cursor: "pointer", marginLeft: "6px", fontWeight: 500 }}>Review now →</span>
          </span>
        </div>

        {/* Queue awareness banner */}
        <div style={{
          display: "flex", alignItems: "center", gap: "14px",
          background: "var(--astra-yellow-bg)", border: "1px solid var(--astra-yellow-border)",
          padding: "12px 16px", borderRadius: "5px", marginBottom: "20px",
        }}>
          <div style={{
            width: "32px", height: "32px", borderRadius: "50%",
            background: "var(--astra-yellow)", color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 600, fontSize: "13px",
          }}>4</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--astra-text-1)" }}>
              4 contracts awaiting your review
            </div>
            <div style={{ fontSize: "11px", color: "var(--astra-text-2)", marginTop: "2px" }}>
              Oldest: Infosys MSA · started 2h ago · 2 unresolved fields
            </div>
          </div>
          <button
            className="astra-btn astra-btn-primary astra-btn-sm"
            onClick={() => setScreen("review-unresolved")}
          >
            Continue reviewing →
          </button>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
          <div style={{ fontSize: "13px", fontWeight: 600 }}>All Contracts</div>
          <div style={{ fontSize: "10px", color: "var(--astra-text-3)", fontFamily: "var(--astra-font-mono)" }}>
            {CONTRACTS.length} contracts
          </div>
        </div>

        {/* Contracts table */}
        <div style={{
          background: "var(--astra-surface)", border: "1px solid var(--astra-border-light)", borderRadius: "5px", overflow: "hidden",
        }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr 1.2fr",
            gap: "12px",
            padding: "10px 14px",
            background: "var(--astra-surface-2)",
            borderBottom: "1px solid var(--astra-border-light)",
            fontSize: "10px",
            fontFamily: "var(--astra-font-mono)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--astra-text-3)",
          }}>
            <span>Contract</span><span>Type</span><span>Value</span><span>Status</span><span>Owner</span>
          </div>
          {CONTRACTS.map((c, i) => (
            <div
              key={c.id}
              onClick={() => c.id === "infosys-msa" && setScreen("review-unresolved")}
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr 1fr 1.2fr",
                gap: "12px",
                padding: "12px 14px",
                borderBottom: i < CONTRACTS.length - 1 ? "1px solid var(--astra-border-light)" : "none",
                fontSize: "12px",
                background: c.status === "returned" ? "var(--astra-red-bg)" : "transparent",
                cursor: c.id === "infosys-msa" ? "pointer" : "default",
                transition: "background 0.12s",
                alignItems: "center",
              }}
              onMouseEnter={e => { if (c.id === "infosys-msa") e.currentTarget.style.background = "var(--astra-yellow-bg)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = c.status === "returned" ? "var(--astra-red-bg)" : "transparent"; }}
            >
              <div>
                <div style={{ fontWeight: 500, color: "var(--astra-text-1)" }}>{c.name}</div>
                <div style={{ fontSize: "11px", color: c.status === "returned" ? "var(--astra-red)" : "var(--astra-text-3)", marginTop: "2px" }}>
                  {c.subText}
                </div>
              </div>
              <span style={{ fontSize: "11px", color: "var(--astra-text-3)" }}>{c.type}</span>
              <span>{c.value}</span>
              <div><StatusChip status={c.status} /></div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px" }}>
                <div style={{
                  width: "20px", height: "20px", borderRadius: "50%",
                  background: "var(--astra-text-1)", color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "9px", fontWeight: 500,
                }}>{c.owner.initials}</div>
                {c.owner.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Screen 2: Upload + type selection ─── */

function ProcUpload({ setScreen }: { setScreen: (s: ProcScreen) => void }) {
  const [type, setType] = useState<string>("Software / SaaS");
  return (
    <div style={{ padding: "32px 28px", maxWidth: "720px", margin: "0 auto" }}>

      {/* Mode toggle */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr",
        gap: "8px", marginBottom: "16px",
      }}>
        <ModeOpt selected icon="📄" label="Single upload"  sub="One contract · full review" />
        <ModeOpt          icon="📚" label="Bulk upload"    sub="Multiple contracts · queue" />
      </div>

      {/* Step 1: Type */}
      <div className="astra-card" style={{ marginBottom: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
          <StepBadge state="done" n={1} />
          <span style={{ fontSize: "13px", fontWeight: 500 }}>Step 1 — Contract type</span>
        </div>
        <div style={{ fontSize: "11px", color: "var(--astra-text-2)", marginBottom: "10px", lineHeight: 1.5 }}>
          Select contract type to configure the correct approval routing before uploading.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "12px" }}>
          {["Software / SaaS", "Master Services", "Legal / NDA", "Renewal"].map(t => (
            <TypeOpt key={t} label={t} desc={typeDesc(t)} selected={type === t} onClick={() => setType(t)} />
          ))}
        </div>
        <div style={{
          background: "var(--astra-blue-bg)", border: "1px solid var(--astra-blue-border)",
          padding: "10px 12px", borderRadius: "4px",
          display: "flex", alignItems: "flex-start", gap: "8px",
          fontSize: "11px", lineHeight: 1.5, color: "var(--astra-blue)",
        }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--astra-blue-dot)", marginTop: "5px", flexShrink: 0 }} />
          <span><strong>{type} routing:</strong> Under ₹50L → Direct manager. Over ₹50L → Legal review → VP Procurement → CFO. AI will detect value and apply the correct chain.</span>
        </div>
      </div>

      {/* Step 2: Upload */}
      <div className="astra-card">
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
          <StepBadge state="active" n={2} />
          <span style={{ fontSize: "13px", fontWeight: 500 }}>Step 2 — Upload PDF</span>
        </div>
        <div
          onClick={() => setScreen("processing")}
          style={{
            border: "1.5px dashed var(--astra-border)",
            borderRadius: "6px",
            padding: "32px 20px",
            textAlign: "center",
            cursor: "pointer",
            transition: "border-color 0.15s, background 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--astra-text-2)"; e.currentTarget.style.background = "var(--astra-bg)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--astra-border)"; e.currentTarget.style.background = "transparent"; }}
        >
          <div style={{ fontSize: "13px", fontWeight: 500, marginBottom: "4px" }}>Upload contract PDF</div>
          <div style={{ fontSize: "11px", color: "var(--astra-text-2)", marginBottom: "8px" }}>Drag & drop or click to browse</div>
          <div style={{ fontSize: "10px", color: "var(--astra-text-3)", fontFamily: "var(--astra-font-mono)", marginBottom: "12px" }}>
            PDF only · max 50 MB · text-based preferred (not scanned)
          </div>
          <button className="astra-btn astra-btn-primary astra-btn-sm" onClick={e => { e.stopPropagation(); setScreen("processing"); }}>
            Browse files
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Screen 3: Processing ─── */

function ProcProcessing({ setScreen }: { setScreen: (s: ProcScreen) => void }) {
  return (
    <div style={{ padding: "60px 28px", maxWidth: "560px", margin: "0 auto", textAlign: "center" }}>
      <div className="astra-card" style={{ padding: "40px 28px" }}>
        <div style={{
          width: "48px", height: "48px", borderRadius: "8px",
          background: "var(--astra-text-1)", color: "#fff",
          fontFamily: "var(--astra-font-mono)", fontSize: "11px",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 20px",
        }}>PDF</div>

        <div style={{ fontSize: "14px", fontWeight: 500, marginBottom: "6px" }}>Infosys_MSA_2024.pdf</div>
        <div style={{ fontSize: "11px", color: "var(--astra-text-2)", marginBottom: "20px" }}>32 pages · 4.8 MB</div>

        <div style={{
          height: "3px", background: "var(--astra-bg)", borderRadius: "2px", overflow: "hidden",
          marginBottom: "16px", maxWidth: "320px", marginInline: "auto",
        }}>
          <div style={{
            width: "60%", height: "100%", background: "var(--astra-text-1)",
            animation: "astra-progress 1.4s ease-in-out infinite",
            transformOrigin: "left",
          }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxWidth: "320px", margin: "0 auto" }}>
          <ProcStage label="Reading document"       done />
          <ProcStage label="Identifying field types" done />
          <ProcStage label="Extracting values"       active />
          <ProcStage label="Validating"              />
        </div>

        <button
          className="astra-btn astra-btn-primary astra-btn-sm"
          style={{ marginTop: "24px" }}
          onClick={() => setScreen("review-unresolved")}
        >
          Continue → (skip wait, go to review)
        </button>
      </div>

      <style>{`
        @keyframes astra-progress {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(166%); }
        }
      `}</style>
    </div>
  );
}

function ProcStage({ label, done, active }: { label: string; done?: boolean; active?: boolean }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "10px",
      fontSize: "11px", textAlign: "left",
      color: done ? "var(--astra-text-2)" : active ? "var(--astra-text-1)" : "var(--astra-text-3)",
      opacity: done || active ? 1 : 0.5,
    }}>
      <div style={{
        width: "12px", height: "12px", borderRadius: "50%",
        flexShrink: 0,
        background: done ? "var(--astra-green-dot)" : active ? "transparent" : "transparent",
        border: active ? "2px solid var(--astra-yellow-dot)" : done ? "none" : "1.5px solid var(--astra-border)",
        borderTopColor: active ? "transparent" : undefined,
        animation: active ? "astra-spin 0.8s linear infinite" : undefined,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {done && <svg width="8" height="8" viewBox="0 0 24 24" fill="white"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>}
      </div>
      <span style={{ fontWeight: active ? 500 : 400 }}>{label}</span>
      <style>{`@keyframes astra-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* ─── Screens 4 + 5: Review (unresolved + resolved) ─── */

function ProcReview({
  unresolved, fields, resolveField, variant, setScreen,
}: {
  unresolved: number;
  fields: ExtractedField[];
  resolveField: (id: string, value?: string) => void;
  variant: "unresolved" | "resolved";
  setScreen: (s: ProcScreen) => void;
}) {
  const groups = groupFields(fields);
  const isResolved = unresolved === 0;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", minHeight: "640px" }}>
      {/* Left: PDF preview placeholder */}
      <div style={{
        background: "var(--astra-surface-2)",
        borderRight: "1px solid var(--astra-border-light)",
        padding: "16px",
      }}>
        <div style={{
          fontFamily: "var(--astra-font-mono)", fontSize: "10px",
          color: "var(--astra-text-3)", letterSpacing: "0.06em",
          textTransform: "uppercase", marginBottom: "10px",
        }}>Source PDF</div>
        <div style={{
          background: "#fff", border: "1px solid var(--astra-border)", borderRadius: "4px",
          padding: "20px 16px", fontSize: "10px", lineHeight: 1.6,
          color: "var(--astra-text-2)", height: "560px", overflow: "hidden",
          fontFamily: "var(--astra-font-mono)",
        }}>
          <div style={{ textAlign: "center", marginBottom: "16px", color: "var(--astra-text-1)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.04em" }}>
            MASTER SERVICES AGREEMENT
          </div>
          <div style={{ marginBottom: "8px" }}>This Master Services Agreement (&quot;Agreement&quot;) is made and entered into as of 1 April 2024 by and between Infosys Limited, having its registered office at Electronics City, Bengaluru, and the Customer.</div>
          <div style={{ marginBottom: "8px" }}>1. INITIAL TERM. This Agreement shall commence on the Effective Date and continue for a period of twenty-four (24) months unless terminated earlier...</div>
          <div style={{ marginBottom: "8px" }}>2. AUTO-RENEWAL. Following the Initial Term, this Agreement shall renew on a rolling 12-month basis unless either party provides 60 days written notice...</div>
          <div style={{ marginBottom: "8px" }}>3. LIABILITY. The total aggregate liability of either party shall not exceed ₹50,00,000 OR 12 months of fees, whichever is higher...</div>
          <div style={{ color: "var(--astra-text-3)" }}>(scrolling here loads more of the source)</div>
        </div>
      </div>

      {/* Right: extracted fields */}
      <div style={{ padding: "20px 24px", overflow: "auto", maxHeight: "640px" }}>
        {/* Status header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: "20px", flexWrap: "wrap", gap: "10px",
        }}>
          <div>
            <div style={{ fontSize: "15px", fontWeight: 600, color: "var(--astra-text-1)", marginBottom: "4px" }}>
              Infosys MSA 2024
            </div>
            <div style={{ fontSize: "11px", color: "var(--astra-text-2)" }}>
              {isResolved ? `All ${fields.length} fields resolved · ready to send` : `${fields.length - unresolved} of ${fields.length} resolved · ${unresolved} unresolved`}
            </div>
          </div>
          {!isResolved && (
            <div style={{
              display: "flex", alignItems: "center", gap: "6px",
              background: "var(--astra-yellow-bg)", border: "1px solid var(--astra-yellow-border)",
              padding: "5px 10px", borderRadius: "4px",
              fontSize: "11px", color: "var(--astra-yellow)", fontWeight: 500,
            }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--astra-yellow-dot)" }} />
              {unresolved} unresolved
            </div>
          )}
        </div>

        {/* Fields by group */}
        {groups.map(g => (
          <div key={g.label} style={{ marginBottom: "20px" }}>
            <div style={{
              fontFamily: "var(--astra-font-mono)", fontSize: "10px",
              color: "var(--astra-text-3)", letterSpacing: "0.08em",
              textTransform: "uppercase", marginBottom: "6px",
              paddingBottom: "6px", borderBottom: "1px solid var(--astra-border-light)",
            }}>
              {g.label} ({g.fields.length})
            </div>
            {g.fields.map(f => (
              <FieldRow
                key={f.id}
                field={f}
                onResolve={() => resolveField(f.id, f.status === "missing" ? "Confirmed with vendor — 5-year confidentiality" : f.value)}
                showResolve={f.status !== "confident" && variant === "unresolved"}
              />
            ))}
          </div>
        ))}

        {/* Send to legal CTA — visible only when resolved */}
        {variant === "resolved" && (
          <div style={{
            position: "sticky", bottom: 0,
            background: "var(--astra-surface)",
            padding: "16px 0",
            borderTop: "1px solid var(--astra-border-light)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            gap: "12px", flexWrap: "wrap",
          }}>
            <div style={{
              fontSize: "12px", color: "var(--astra-text-2)",
            }}>
              All fields confirmed. Ready to route to legal for review.
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                className="astra-btn astra-btn-ghost astra-btn-sm"
                onClick={() => setScreen("landing")}
              >Save draft</button>
              <button
                className="astra-btn astra-btn-primary astra-btn-sm"
                onClick={() => setScreen("landing")}
              >Send to Legal →</button>
            </div>
          </div>
        )}

        {variant === "unresolved" && unresolved === 0 && (
          <div style={{
            background: "var(--astra-green-bg)", border: "1px solid var(--astra-green-border)",
            padding: "12px 14px", borderRadius: "6px", marginTop: "16px",
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px",
          }}>
            <span style={{ fontSize: "12px", color: "var(--astra-green)", fontWeight: 500 }}>
              All fields resolved. Move on?
            </span>
            <button className="astra-btn astra-btn-primary astra-btn-sm" onClick={() => setScreen("review-resolved")}>
              Review and send →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function FieldRow({ field, onResolve, showResolve }: { field: ExtractedField; onResolve: () => void; showResolve: boolean }) {
  return (
    <div className="astra-field" style={{
      background: field.status === "needs-review" ? "var(--astra-yellow-bg)" : field.status === "missing" ? "var(--astra-red-bg)" : "transparent",
      borderLeft: field.status === "needs-review" ? "2px solid var(--astra-yellow-dot)" : field.status === "missing" ? "2px solid var(--astra-red-dot)" : "2px solid transparent",
      paddingLeft: "10px",
      marginLeft: "-10px",
    }}>
      <div className="astra-field-label">{field.label}</div>
      <div>
        <div className={`astra-field-value ${field.status === "missing" ? "muted" : ""}`}>
          {field.status === "missing" ? "Not detected — needs confirmation" : field.value}
        </div>
        {field.note && (
          <div style={{ fontSize: "11px", color: "var(--astra-text-2)", marginTop: "4px", fontStyle: "italic" }}>
            {field.note}
          </div>
        )}
        {showResolve && (
          <button
            onClick={onResolve}
            className="astra-btn astra-btn-ghost astra-btn-sm"
            style={{ marginTop: "8px", fontSize: "10px" }}
          >
            ✓ Confirm value
          </button>
        )}
      </div>
      <div className={`astra-field-status-dot ${field.status}`} />
    </div>
  );
}

function groupFields(fields: ExtractedField[]) {
  const groups = ["Vendor", "Terms", "Financial", "Legal", "Renewal"] as const;
  return groups.map(label => ({
    label,
    fields: fields.filter(f => f.group === label),
  })).filter(g => g.fields.length > 0);
}

/* ════════════════════════════════════════════════
   LEGAL FLOW
   ════════════════════════════════════════════════ */

function LegalFlow({
  screen, setScreen, fields,
}: {
  screen: LegalScreen;
  setScreen: (s: LegalScreen) => void;
  fields: ExtractedField[];
}) {
  return (
    <>
      <LegalStepIndicator screen={screen} setScreen={setScreen} />

      <div className="astra-chrome" style={{ marginTop: "16px" }}>
        <div className="astra-topbar">
          <span className="astra-tb-logo">Indemn</span>
          <span className="astra-tb-sep" />
          <span className="astra-tb-role-chip legal">Legal</span>
          {screen !== "queue" && (
            <button className="astra-tb-back" onClick={() => setScreen("queue")}>← Queue</button>
          )}
          <span className="astra-tb-crumb">
            <span className={screen === "queue" ? "active" : ""}>Legal queue</span>
            {screen !== "queue" && <><span style={{ margin: "0 4px" }}>/</span>
              <span className="active">Infosys MSA 2024</span>
            </>}
          </span>
        </div>

        {screen === "queue"   && <LegalQueue setScreen={setScreen} />}
        {screen === "review"  && <LegalReview fields={fields} setScreen={setScreen} />}
        {screen === "approve" && <LegalApprove setScreen={setScreen} />}
      </div>
    </>
  );
}

function LegalStepIndicator({ screen, setScreen }: { screen: LegalScreen; setScreen: (s: LegalScreen) => void }) {
  const steps: { id: LegalScreen; label: string }[] = [
    { id: "queue",   label: "Queue"   },
    { id: "review",  label: "Review"  },
    { id: "approve", label: "Approve" },
  ];
  const activeIdx = steps.findIndex(s => s.id === screen);
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "8px",
      fontFamily: "var(--astra-font-mono)", fontSize: "10px",
      letterSpacing: "0.06em", textTransform: "uppercase",
      color: "var(--astra-text-3)",
      flexWrap: "wrap",
    }}>
      <span>Legal flow</span>
      <span>·</span>
      {steps.map((s, i) => (
        <button
          key={s.id}
          onClick={() => setScreen(s.id)}
          style={{
            background: i === activeIdx ? "var(--astra-purple-bg)" : "transparent",
            border: "none", cursor: "pointer",
            padding: "2px 6px",
            fontFamily: "inherit", fontSize: "inherit", letterSpacing: "inherit", textTransform: "inherit",
            color: i === activeIdx ? "var(--astra-text-1)" : "var(--astra-text-3)",
            fontWeight: i === activeIdx ? 600 : 400,
            borderRadius: "3px",
          }}
        >
          {String(i + 1).padStart(2, "0")} {s.label}
        </button>
      ))}
    </div>
  );
}

function LegalQueue({ setScreen }: { setScreen: (s: LegalScreen) => void }) {
  return (
    <div className="astra-app-shell">
      <LeftNav active="approvals" role="legal" />
      <div className="astra-main">
        <div style={{ marginBottom: "16px" }}>
          <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "4px" }}>
            Your queue — Priya M.
          </div>
          <div style={{ fontSize: "11px", color: "var(--astra-text-2)" }}>
            3 contracts awaiting your review · personalized by routing
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {LEGAL_QUEUE.map(item => {
            const c = CONTRACTS.find(c => c.id === item.contractId);
            if (!c) return null;
            const isActive = item.contractId === "infosys-msa";
            return (
              <div
                key={c.id}
                onClick={() => isActive && setScreen("review")}
                style={{
                  border: "1px solid var(--astra-border-light)",
                  borderRadius: "5px",
                  padding: "12px 14px",
                  background: "var(--astra-surface)",
                  display: "grid",
                  gridTemplateColumns: "1fr auto auto auto",
                  gap: "16px",
                  alignItems: "center",
                  cursor: isActive ? "pointer" : "default",
                  transition: "border-color 0.12s, background 0.12s",
                }}
                onMouseEnter={e => { if (isActive) e.currentTarget.style.borderColor = "var(--astra-text-2)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--astra-border-light)"; }}
              >
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 500, marginBottom: "3px" }}>{c.name}</div>
                  <div style={{ fontSize: "11px", color: "var(--astra-text-2)" }}>
                    From {item.receivedFrom} · {item.receivedAt}
                    {item.flagged && <span style={{ color: "var(--astra-yellow)", marginLeft: "8px" }}>⚐ {item.flagged}</span>}
                  </div>
                </div>
                <span style={{ fontSize: "11px", color: "var(--astra-text-3)" }}>{c.type}</span>
                <span style={{ fontSize: "11px" }}>{c.value}</span>
                <PriorityChip priority={item.priority} />
              </div>
            );
          })}
        </div>

        <div style={{ fontSize: "11px", color: "var(--astra-text-3)", marginTop: "16px", fontStyle: "italic" }}>
          Click <strong style={{ color: "var(--astra-text-1)" }}>Infosys MSA 2024</strong> to walk through legal review.
        </div>
      </div>
    </div>
  );
}

function LegalReview({ fields, setScreen }: { fields: ExtractedField[]; setScreen: (s: LegalScreen) => void }) {
  // Filter to legal-emphasis fields, but show all in a collapsible
  const legalFields = fields.filter(f => f.legalEmphasis);
  const otherFields = fields.filter(f => !f.legalEmphasis);
  return (
    <div style={{ padding: "20px 24px" }}>
      <div style={{
        background: "var(--astra-purple-bg)", border: "1px solid var(--astra-purple-border)",
        padding: "12px 16px", borderRadius: "5px", marginBottom: "20px",
        display: "flex", alignItems: "center", gap: "12px",
      }}>
        <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--astra-purple-dot)" }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "12px", color: "var(--astra-purple)", fontWeight: 600, marginBottom: "2px" }}>
            Legal-emphasis review
          </div>
          <div style={{ fontSize: "11px", color: "var(--astra-text-2)" }}>
            Liability, indemnity, governing law, and renewal terms surfaced first. Procurement-resolved fields are below.
          </div>
        </div>
      </div>

      <div style={{
        fontFamily: "var(--astra-font-mono)", fontSize: "10px",
        color: "var(--astra-purple)", letterSpacing: "0.08em",
        textTransform: "uppercase", marginBottom: "8px",
      }}>
        Legal terms ({legalFields.length})
      </div>
      {legalFields.map(f => (
        <FieldRow key={f.id} field={f} onResolve={() => {}} showResolve={false} />
      ))}

      <details style={{ marginTop: "20px" }}>
        <summary style={{
          fontFamily: "var(--astra-font-mono)", fontSize: "10px",
          color: "var(--astra-text-3)", letterSpacing: "0.08em",
          textTransform: "uppercase", cursor: "pointer", padding: "8px 0",
          listStyle: "none",
        }}>
          ▾ Other extracted fields ({otherFields.length})
        </summary>
        <div style={{ marginTop: "10px" }}>
          {otherFields.map(f => (
            <FieldRow key={f.id} field={f} onResolve={() => {}} showResolve={false} />
          ))}
        </div>
      </details>

      <div style={{
        position: "sticky", bottom: 0,
        background: "var(--astra-surface)",
        padding: "16px 0", marginTop: "20px",
        borderTop: "1px solid var(--astra-border-light)",
        display: "flex", justifyContent: "flex-end", gap: "8px",
      }}>
        <button className="astra-btn astra-btn-ghost astra-btn-sm">Return to procurement</button>
        <button className="astra-btn astra-btn-ghost astra-btn-sm">Add comment</button>
        <button className="astra-btn astra-btn-primary astra-btn-sm" onClick={() => setScreen("approve")}>
          Approve →
        </button>
      </div>
    </div>
  );
}

function LegalApprove({ setScreen }: { setScreen: (s: LegalScreen) => void }) {
  return (
    <div style={{ padding: "60px 28px", maxWidth: "560px", margin: "0 auto", textAlign: "center" }}>
      <div className="astra-card" style={{ padding: "40px 28px", borderColor: "var(--astra-green-border)", background: "var(--astra-green-bg)" }}>
        <div style={{
          width: "44px", height: "44px", borderRadius: "50%",
          background: "var(--astra-green-dot)", color: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 16px",
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
        </div>
        <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--astra-green)", marginBottom: "8px" }}>
          Approved by Legal
        </div>
        <div style={{ fontSize: "12px", color: "var(--astra-text-2)", marginBottom: "20px", lineHeight: 1.6 }}>
          Forwarding to <strong>VP Procurement</strong> for final approval.
          <br />
          Procurement (Ananya R.) will be notified.
        </div>

        <div style={{
          background: "#fff", border: "1px solid var(--astra-green-border)",
          padding: "12px 14px", borderRadius: "5px", textAlign: "left",
          fontSize: "11px", lineHeight: 1.6, color: "var(--astra-text-2)",
          marginBottom: "20px",
        }}>
          <div style={{ fontFamily: "var(--astra-font-mono)", fontSize: "10px", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--astra-text-3)", marginBottom: "8px" }}>
            Routing path
          </div>
          <div>Procurement (Ananya R.) → <strong style={{ color: "var(--astra-green)" }}>Legal (Priya M.) ✓</strong> → VP Procurement → CFO</div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
          <button className="astra-btn astra-btn-ghost astra-btn-sm" onClick={() => setScreen("queue")}>
            Back to queue
          </button>
          <button className="astra-btn astra-btn-primary astra-btn-sm" onClick={() => setScreen("queue")}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   Shared sub-components
   ════════════════════════════════════════════════ */

function LeftNav({ active, role = "procurement" }: { active: string; role?: Role }) {
  const items = role === "procurement"
    ? ["contracts", "vendors", "approvals"]
    : ["queue", "approved", "returned"];
  return (
    <div className="astra-left-nav">
      <div className="astra-ln-section">Workspace</div>
      {items.map(i => (
        <div key={i} className={`astra-ln-item ${active === i ? "active" : ""}`}>
          <div className="astra-ln-dot" style={{ background: active === i ? "var(--astra-text-1)" : "var(--astra-wire-dark)" }} />
          {i.charAt(0).toUpperCase() + i.slice(1)}
        </div>
      ))}
      <div className="astra-ln-section" style={{ marginTop: "14px" }}>Settings</div>
      <div className="astra-ln-item">
        <div className="astra-ln-dot" style={{ background: "var(--astra-wire-dark)" }} />
        Workflow rules
      </div>
    </div>
  );
}

function StatusChip({ status }: { status: string }) {
  const map: Record<string, string> = {
    draft: "draft", "in-review": "review", "sent-to-legal": "legal", approved: "approved", returned: "returned",
  };
  const label: Record<string, string> = {
    draft: "Draft", "in-review": "In review", "sent-to-legal": "Sent to Legal", approved: "Approved", returned: "Returned",
  };
  return (
    <span className={`astra-chip astra-chip-${map[status]}`}>
      <span className="astra-chip-dot" />
      {label[status]}
    </span>
  );
}

function PriorityChip({ priority }: { priority: string }) {
  const map: Record<string, { bg: string; fg: string; border: string; label: string }> = {
    high:   { bg: "var(--astra-red-bg)",    fg: "var(--astra-red)",    border: "var(--astra-red-border)",    label: "High"   },
    normal: { bg: "var(--astra-yellow-bg)", fg: "var(--astra-yellow)", border: "var(--astra-yellow-border)", label: "Normal" },
    low:    { bg: "var(--astra-bg)",        fg: "var(--astra-text-3)", border: "var(--astra-border)",        label: "Low"    },
  };
  const m = map[priority];
  return (
    <span style={{
      fontFamily: "var(--astra-font-mono)", fontSize: "9px",
      letterSpacing: "0.04em", textTransform: "uppercase",
      padding: "3px 7px", borderRadius: "3px", fontWeight: 500,
      background: m.bg, color: m.fg, border: `1px solid ${m.border}`,
    }}>{m.label}</span>
  );
}

function ModeOpt({ icon, label, sub, selected }: { icon: string; label: string; sub: string; selected?: boolean }) {
  return (
    <div style={{
      padding: "12px 14px",
      border: `1px solid ${selected ? "var(--astra-text-2)" : "var(--astra-border-light)"}`,
      borderRadius: "5px",
      background: selected ? "var(--astra-bg)" : "var(--astra-surface)",
      display: "flex", alignItems: "center", gap: "10px",
      cursor: "pointer",
    }}>
      <div style={{ fontSize: "20px" }}>{icon}</div>
      <div>
        <div style={{ fontSize: "12px", fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: "10px", color: "var(--astra-text-3)", marginTop: "2px" }}>{sub}</div>
      </div>
    </div>
  );
}

function StepBadge({ state, n }: { state: "done" | "active" | "pending"; n: number }) {
  return (
    <div style={{
      width: "20px", height: "20px", borderRadius: "50%",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: "10px", fontFamily: "var(--astra-font-mono)", fontWeight: 600,
      background: state === "done" ? "var(--astra-green-dot)" : state === "active" ? "var(--astra-text-1)" : "var(--astra-bg)",
      color: state === "pending" ? "var(--astra-text-3)" : "#fff",
      border: state === "pending" ? "1px solid var(--astra-border)" : "none",
      flexShrink: 0,
    }}>
      {state === "done" ? "✓" : n}
    </div>
  );
}

function TypeOpt({ label, desc, selected, onClick }: { label: string; desc: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "transparent",
        textAlign: "left",
        padding: "10px 12px",
        border: `1px solid ${selected ? "var(--astra-text-1)" : "var(--astra-border-light)"}`,
        borderRadius: "5px",
        cursor: "pointer",
        display: "flex", alignItems: "center", gap: "10px",
        fontFamily: "inherit",
        transition: "border-color 0.12s, background 0.12s",
      }}
    >
      <div style={{
        width: "14px", height: "14px", borderRadius: "50%",
        border: `2px solid ${selected ? "var(--astra-text-1)" : "var(--astra-border)"}`,
        background: selected ? "var(--astra-text-1)" : "transparent",
        boxShadow: selected ? "inset 0 0 0 3px #fff" : "none",
        flexShrink: 0,
      }} />
      <div>
        <div style={{ fontSize: "12px", fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: "10px", color: "var(--astra-text-3)", marginTop: "2px" }}>{desc}</div>
      </div>
    </button>
  );
}

function typeDesc(t: string): string {
  return ({
    "Software / SaaS":  "Subscriptions, licenses",
    "Master Services":  "MSA, framework agreements",
    "Legal / NDA":      "NDAs, confidentiality",
    "Renewal":          "Contract renewals",
  } as Record<string, string>)[t] ?? "";
}
