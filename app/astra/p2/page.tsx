"use client";

/* ─── Astra · Problem 2 — Approval Workflow Configuration ──
   Admin tool for building and maintaining the rules that route
   contracts through approval chains. Five screens: landing,
   builder steps 1–3, and the returning-admin edit screen.

   The signature design choice is plain-language preview at every
   builder step — the configured rule renders as English so the
   admin can verify intent before activating. */

import Link from "next/link";
import { useEffect, useState } from "react";
import { WORKFLOWS, Workflow, WorkflowCondition, ApprovalStep } from "@/lib/astra/data";

type Screen = "landing" | "build-1" | "build-2" | "build-3" | "edit";

type Draft = {
  name: string;
  category: Workflow["category"];
  conditions: WorkflowCondition[];
  steps: ApprovalStep[];
};

const EMPTY_DRAFT: Draft = {
  name: "",
  category: "Software",
  conditions: [],
  steps: [],
};

export default function P2Page() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [editingId, setEditingId] = useState<string | null>(null);

  /* Same nav surface as P1 — URL params on first load + postMessage from parent. */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const s = params.get("screen");
    if (s && ["landing", "build-1", "build-2", "build-3", "edit"].includes(s)) {
      setScreen(s as Screen);
      if (s === "edit") setEditingId("wf-soft-large");
    }

    const onMessage = (e: MessageEvent) => {
      const data = e.data;
      if (!data || data.type !== "astra-nav") return;
      if (data.screen && ["landing", "build-1", "build-2", "build-3", "edit"].includes(data.screen)) {
        setScreen(data.screen);
        if (data.screen === "build-1") setDraft(EMPTY_DRAFT);
        if (data.screen === "edit")    setEditingId(data.workflowId ?? "wf-soft-large");
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <>
      <nav className="astra-nav">
        <Link href="/work/astra" className="astra-nav-brand">
          Indemn <span className="astra-nav-brand-v">Workflow</span>
        </Link>
        <div className="astra-nav-role-section">
          <span className="astra-role-label">Role</span>
          <div className="astra-role-switcher">
            <button className="astra-role-pill proc active" style={{ color: "#B8DEC8", background: "#1A2A1F", borderColor: "#2E4830" }}>
              Admin
            </button>
          </div>
        </div>
        <Link href="/work/astra" className="astra-nav-back">← Back to case study</Link>
      </nav>

      <div className="astra-screen">
        <StepIndicator screen={screen} setScreen={setScreen} />

        <div className="astra-chrome" style={{ marginTop: "16px" }}>
          <div className="astra-topbar">
            <span className="astra-tb-logo">Indemn</span>
            <span className="astra-tb-sep" />
            <span className="astra-tb-role-chip" style={{ background: "var(--astra-green-bg)", color: "var(--astra-green)", border: "1px solid var(--astra-green-border)" }}>Admin</span>
            {screen !== "landing" && (
              <button className="astra-tb-back" onClick={() => { setScreen("landing"); setDraft(EMPTY_DRAFT); setEditingId(null); }}>
                ← Workflows
              </button>
            )}
            <span className="astra-tb-crumb">
              <span className={screen === "landing" ? "active" : ""}>Workflow rules</span>
              {screen !== "landing" && (
                <>
                  <span style={{ margin: "0 4px" }}>/</span>
                  <span className="active">{crumbLabel(screen, draft.name, editingId)}</span>
                </>
              )}
            </span>
            <div className="astra-tb-right">
              {screen === "landing" && (
                <button
                  className="astra-btn astra-btn-primary astra-btn-sm"
                  onClick={() => { setDraft(EMPTY_DRAFT); setScreen("build-1"); }}
                >
                  + New workflow
                </button>
              )}
            </div>
          </div>

          {screen === "landing" && <Landing onCreate={() => { setDraft(EMPTY_DRAFT); setScreen("build-1"); }} onEdit={id => { setEditingId(id); setScreen("edit"); }} />}
          {screen === "build-1" && <Build1 draft={draft} setDraft={setDraft} setScreen={setScreen} />}
          {screen === "build-2" && <Build2 draft={draft} setDraft={setDraft} setScreen={setScreen} />}
          {screen === "build-3" && <Build3 draft={draft} setDraft={setDraft} setScreen={setScreen} />}
          {screen === "edit"    && <Edit editingId={editingId} setScreen={setScreen} />}
        </div>
      </div>
    </>
  );
}

function crumbLabel(screen: Screen, draftName: string, editingId: string | null): string {
  if (screen === "edit") {
    const wf = WORKFLOWS.find(w => w.id === editingId);
    return wf?.name ?? "Edit";
  }
  const stepLabel = screen === "build-1" ? "Step 1: Conditions" : screen === "build-2" ? "Step 2: Chain" : "Step 3: Review";
  return `New workflow · ${stepLabel}${draftName ? ` · ${draftName}` : ""}`;
}

function StepIndicator({ screen, setScreen }: { screen: Screen; setScreen: (s: Screen) => void }) {
  const steps: { id: Screen; label: string }[] = [
    { id: "landing", label: "Workflows" },
    { id: "build-1", label: "Conditions" },
    { id: "build-2", label: "Chain" },
    { id: "build-3", label: "Activate" },
    { id: "edit",    label: "Edit"      },
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
      <span>Admin flow</span>
      <span>·</span>
      {steps.map((s, i) => (
        <button
          key={s.id}
          onClick={() => setScreen(s.id)}
          style={{
            background: i === activeIdx ? "var(--astra-green-bg)" : "transparent",
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

/* ════════════════════════════════════════════════
   Screen 1: Landing — list of all workflows
   ════════════════════════════════════════════════ */

function Landing({ onCreate, onEdit }: { onCreate: () => void; onEdit: (id: string) => void }) {
  const grouped = groupByCategory(WORKFLOWS);
  return (
    <div style={{ padding: "20px 24px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "3px" }}>Workflow rules</div>
          <div style={{ fontSize: "11px", color: "var(--astra-text-2)" }}>
            {WORKFLOWS.length} active rules · drag to reorder priority within a group
          </div>
        </div>
      </div>

      {/* Conflict banner if any */}
      {WORKFLOWS.some(w => w.conflict) && (
        <div style={{
          background: "var(--astra-yellow-bg)", border: "1px solid var(--astra-yellow-border)",
          padding: "10px 14px", borderRadius: "5px", marginBottom: "16px",
          display: "flex", alignItems: "center", gap: "10px",
          fontSize: "11px", color: "var(--astra-yellow)",
        }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--astra-yellow-dot)", flexShrink: 0 }} />
          <span style={{ flex: 1 }}>
            <strong>1 routing conflict detected</strong> — &quot;Master Services Agreements&quot; overlaps with &quot;Software contracts over ₹50L&quot; for software MSAs ≥ ₹1Cr. Review priority order.
          </span>
        </div>
      )}

      {/* Groups */}
      {grouped.map(g => (
        <div key={g.category} style={{ marginBottom: "20px" }}>
          <div style={{
            fontFamily: "var(--astra-font-mono)", fontSize: "10px",
            color: "var(--astra-text-3)", letterSpacing: "0.08em",
            textTransform: "uppercase", marginBottom: "8px",
            paddingBottom: "6px", borderBottom: "1px solid var(--astra-border-light)",
          }}>
            {g.category} ({g.workflows.length})
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {g.workflows.map(w => (
              <div
                key={w.id}
                onClick={() => onEdit(w.id)}
                style={{
                  background: "var(--astra-surface)",
                  border: "1px solid var(--astra-border-light)",
                  borderRadius: "5px",
                  padding: "12px 14px",
                  cursor: "pointer",
                  display: "grid",
                  gridTemplateColumns: "auto 1fr auto auto auto",
                  gap: "12px",
                  alignItems: "center",
                  transition: "border-color 0.12s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--astra-text-2)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--astra-border-light)"; }}
              >
                <div style={{ fontSize: "12px", color: "var(--astra-text-3)", fontFamily: "var(--astra-font-mono)" }}>⋮⋮</div>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 500, marginBottom: "2px" }}>{w.name}</div>
                  <div style={{ fontSize: "11px", color: "var(--astra-text-2)" }}>{w.preview}</div>
                </div>
                {w.inFlight && w.inFlight > 0 ? (
                  <span style={{
                    fontSize: "10px", fontFamily: "var(--astra-font-mono)",
                    padding: "2px 6px", borderRadius: "3px",
                    background: "var(--astra-bg)", color: "var(--astra-text-2)",
                    letterSpacing: "0.04em",
                  }}>{w.inFlight} in flight</span>
                ) : <span />}
                <span className={`astra-chip ${w.active ? "astra-chip-approved" : "astra-chip-draft"}`}>
                  <span className="astra-chip-dot" />
                  {w.active ? "Active" : "Disabled"}
                </span>
                <button
                  className="astra-btn astra-btn-ghost astra-btn-sm"
                  style={{ fontSize: "10px" }}
                  onClick={e => { e.stopPropagation(); onEdit(w.id); }}
                >Edit</button>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div style={{
        marginTop: "16px",
        fontSize: "11px", color: "var(--astra-text-3)",
        textAlign: "center", fontStyle: "italic",
      }}>
        Click <strong style={{ color: "var(--astra-text-1)" }}>+ New workflow</strong> above to walk through the builder, or click any rule to edit.
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   Screen 2: Build · Step 1 — Conditions
   ════════════════════════════════════════════════ */

function Build1({ draft, setDraft, setScreen }: { draft: Draft; setDraft: (d: Draft) => void; setScreen: (s: Screen) => void }) {
  const addCondition = (cond: Partial<WorkflowCondition>) => {
    setDraft({
      ...draft,
      conditions: [...draft.conditions, {
        id: `c-${Date.now()}`,
        type: cond.type ?? "contract-type",
        operator: cond.operator ?? "is",
        value: cond.value ?? "",
      }],
    });
  };
  const removeCondition = (id: string) => {
    setDraft({ ...draft, conditions: draft.conditions.filter(c => c.id !== id) });
  };

  const preview = buildPreview(draft);

  return (
    <div style={{ padding: "24px 28px", maxWidth: "780px", margin: "0 auto" }}>
      {/* Step header */}
      <BuilderStepHeader step={1} total={3} title="Define conditions" subtitle="When should this workflow apply?" />

      {/* Empty state vs filled */}
      {draft.conditions.length === 0 && (
        <div style={{
          background: "var(--astra-surface)",
          border: "1px dashed var(--astra-border)",
          borderRadius: "6px",
          padding: "32px 24px",
          textAlign: "center",
          marginBottom: "16px",
        }}>
          <div style={{ fontSize: "13px", fontWeight: 500, marginBottom: "6px" }}>No conditions yet</div>
          <div style={{ fontSize: "11px", color: "var(--astra-text-2)", marginBottom: "16px" }}>
            Start with the contract type. Add more conditions to narrow the rule (amount, vendor risk, department).
          </div>
          <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              className="astra-btn astra-btn-ghost astra-btn-sm"
              onClick={() => addCondition({ type: "contract-type", value: "Software / SaaS" })}
            >+ Contract type</button>
            <button
              className="astra-btn astra-btn-ghost astra-btn-sm"
              onClick={() => addCondition({ type: "amount", operator: "<", value: "50,00,000" })}
            >+ Amount</button>
            <button
              className="astra-btn astra-btn-ghost astra-btn-sm"
              onClick={() => addCondition({ type: "department", operator: "is", value: "Engineering" })}
            >+ Department</button>
          </div>
        </div>
      )}

      {/* Condition list */}
      {draft.conditions.length > 0 && (
        <div className="astra-card" style={{ marginBottom: "16px" }}>
          {draft.conditions.map((c, i) => (
            <div key={c.id} style={{
              display: "grid",
              gridTemplateColumns: "auto 1fr 80px 1fr auto",
              gap: "10px", alignItems: "center",
              padding: "10px 0",
              borderTop: i > 0 ? "1px solid var(--astra-border-light)" : "none",
            }}>
              <span style={{ fontFamily: "var(--astra-font-mono)", fontSize: "10px", color: "var(--astra-text-3)" }}>
                {i === 0 ? "WHEN" : "AND"}
              </span>
              <span style={{ fontSize: "12px", fontWeight: 500 }}>{condTypeLabel(c.type)}</span>
              <span style={{ fontSize: "11px", color: "var(--astra-text-2)", textAlign: "center" }}>
                {c.operator}
              </span>
              <span style={{ fontSize: "12px", color: "var(--astra-text-1)" }}>{c.value || "—"}</span>
              <button
                onClick={() => removeCondition(c.id)}
                style={{
                  background: "transparent", border: "none", cursor: "pointer",
                  fontSize: "11px", color: "var(--astra-text-3)", padding: "3px 6px",
                }}
              >×</button>
            </div>
          ))}

          <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid var(--astra-border-light)" }}>
            <button
              className="astra-btn astra-btn-ghost astra-btn-sm"
              onClick={() => addCondition({ type: "amount", operator: "<", value: "50,00,000" })}
              style={{ fontSize: "11px" }}
            >
              + Add condition
            </button>
          </div>
        </div>
      )}

      {/* Plain-language preview */}
      <PlainLanguagePreview preview={preview} hint="The workflow runs when all conditions match." />

      {/* Footer */}
      <BuilderFooter
        onBack={() => setScreen("landing")}
        backLabel="Cancel"
        canContinue={draft.conditions.length > 0}
        onContinue={() => setScreen("build-2")}
      />
    </div>
  );
}

/* ════════════════════════════════════════════════
   Screen 3: Build · Step 2 — Approval chain
   ════════════════════════════════════════════════ */

function Build2({ draft, setDraft, setScreen }: { draft: Draft; setDraft: (d: Draft) => void; setScreen: (s: Screen) => void }) {
  const addStep = () => {
    setDraft({
      ...draft,
      steps: [...draft.steps, {
        id: `s-${Date.now()}`,
        approver: "",
        role: "",
        notify: "email",
      }],
    });
  };
  const updateStep = (id: string, patch: Partial<ApprovalStep>) => {
    setDraft({
      ...draft,
      steps: draft.steps.map(s => s.id === id ? { ...s, ...patch } : s),
    });
  };
  const removeStep = (id: string) => {
    setDraft({ ...draft, steps: draft.steps.filter(s => s.id !== id) });
  };

  const preview = buildPreview(draft);

  return (
    <div style={{ padding: "24px 28px", maxWidth: "780px", margin: "0 auto" }}>
      <BuilderStepHeader step={2} total={3} title="Configure approval chain" subtitle="Who reviews, in what order?" />

      {draft.steps.length === 0 && (
        <div style={{
          background: "var(--astra-surface)",
          border: "1px dashed var(--astra-border)",
          borderRadius: "6px",
          padding: "32px 24px",
          textAlign: "center",
          marginBottom: "16px",
        }}>
          <div style={{ fontSize: "13px", fontWeight: 500, marginBottom: "6px" }}>No approvers yet</div>
          <div style={{ fontSize: "11px", color: "var(--astra-text-2)", marginBottom: "16px" }}>
            Add the first approver. Multiple steps run sequentially — each waits for the previous to complete.
          </div>
          <button className="astra-btn astra-btn-primary astra-btn-sm" onClick={addStep}>
            + Add first approver
          </button>
        </div>
      )}

      {draft.steps.map((s, i) => (
        <div key={s.id} className="astra-card" style={{ marginBottom: "10px", padding: "14px 16px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: "12px", alignItems: "center", marginBottom: "10px" }}>
            <div style={{
              width: "24px", height: "24px", borderRadius: "50%",
              background: "var(--astra-text-1)", color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "11px", fontWeight: 600, fontFamily: "var(--astra-font-mono)",
            }}>{i + 1}</div>
            <input
              type="text"
              value={s.approver}
              onChange={e => updateStep(s.id, { approver: e.target.value })}
              placeholder="Approver (e.g. VP Procurement)"
              style={inputStyle}
            />
            <button
              onClick={() => removeStep(s.id)}
              style={{
                background: "transparent", border: "none", cursor: "pointer",
                fontSize: "13px", color: "var(--astra-text-3)", padding: "3px 6px",
              }}
            >×</button>
          </div>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center", marginLeft: "36px", fontSize: "11px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--astra-text-2)" }}>
              <input
                type="checkbox"
                checked={s.optional ?? false}
                onChange={e => updateStep(s.id, { optional: e.target.checked })}
              />
              Optional step
            </label>
            <span style={{ color: "var(--astra-text-3)" }}>·</span>
            <label style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--astra-text-2)" }}>
              Notify:
              <select
                value={s.notify}
                onChange={e => updateStep(s.id, { notify: e.target.value as ApprovalStep["notify"] })}
                style={selectStyle}
              >
                <option value="email">Email</option>
                <option value="slack">Slack</option>
                <option value="both">Both</option>
              </select>
            </label>
          </div>
        </div>
      ))}

      {draft.steps.length > 0 && (
        <button className="astra-btn astra-btn-ghost astra-btn-sm" onClick={addStep} style={{ marginBottom: "16px" }}>
          + Add another approver
        </button>
      )}

      <PlainLanguagePreview preview={preview} hint="Steps run in order. The contract waits at each step until that approver responds." />

      <BuilderFooter
        onBack={() => setScreen("build-1")}
        backLabel="← Back"
        canContinue={draft.steps.length > 0 && draft.steps.every(s => s.approver.trim().length > 0)}
        onContinue={() => setScreen("build-3")}
      />
    </div>
  );
}

/* ════════════════════════════════════════════════
   Screen 4: Build · Step 3 — Review & Activate
   ════════════════════════════════════════════════ */

function Build3({ draft, setDraft, setScreen }: { draft: Draft; setDraft: (d: Draft) => void; setScreen: (s: Screen) => void }) {
  const preview = buildPreview(draft);
  const canActivate = draft.name.trim().length > 0;

  return (
    <div style={{ padding: "24px 28px", maxWidth: "780px", margin: "0 auto" }}>
      <BuilderStepHeader step={3} total={3} title="Review & activate" subtitle="Read it back, name it, ship it." />

      {/* Plain-language summary — large, prominent */}
      <div style={{
        background: "var(--astra-blue-bg)",
        border: "1px solid var(--astra-blue-border)",
        borderRadius: "6px",
        padding: "20px 22px",
        marginBottom: "16px",
        textAlign: "center",
      }}>
        <div style={{
          fontFamily: "var(--astra-font-mono)", fontSize: "10px",
          color: "var(--astra-blue)", letterSpacing: "0.08em",
          textTransform: "uppercase", marginBottom: "10px",
        }}>The rule, in plain language</div>
        <div style={{
          fontSize: "16px", fontWeight: 500, lineHeight: 1.5,
          color: "var(--astra-text-1)",
        }}>
          {preview}
        </div>
      </div>

      {/* Conditions summary */}
      <div className="astra-card" style={{ marginBottom: "10px" }}>
        <div style={{ fontFamily: "var(--astra-font-mono)", fontSize: "10px", color: "var(--astra-text-3)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "10px" }}>
          Conditions ({draft.conditions.length})
        </div>
        {draft.conditions.map((c, i) => (
          <div key={c.id} style={{ fontSize: "12px", color: "var(--astra-text-2)", marginBottom: i < draft.conditions.length - 1 ? "4px" : 0 }}>
            <strong style={{ color: "var(--astra-text-1)" }}>{condTypeLabel(c.type)}</strong> {c.operator} {c.value}
          </div>
        ))}
      </div>

      {/* Chain summary */}
      <div className="astra-card" style={{ marginBottom: "16px" }}>
        <div style={{ fontFamily: "var(--astra-font-mono)", fontSize: "10px", color: "var(--astra-text-3)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "10px" }}>
          Approval chain ({draft.steps.length} steps)
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          {draft.steps.map((s, i) => (
            <div key={s.id} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{
                padding: "6px 12px",
                background: "var(--astra-surface-2)",
                border: "1px solid var(--astra-border-light)",
                borderRadius: "4px",
                fontSize: "12px",
                fontWeight: 500,
              }}>
                {s.approver}
                {s.optional && <span style={{ marginLeft: "6px", fontSize: "10px", color: "var(--astra-text-3)" }}>(optional)</span>}
              </div>
              {i < draft.steps.length - 1 && <span style={{ color: "var(--astra-text-3)" }}>→</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Name input */}
      <div style={{ marginBottom: "16px" }}>
        <label style={{ display: "block", fontSize: "11px", fontFamily: "var(--astra-font-mono)", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--astra-text-3)", marginBottom: "6px" }}>
          Workflow name
        </label>
        <input
          type="text"
          value={draft.name}
          onChange={e => setDraft({ ...draft, name: e.target.value })}
          placeholder="e.g. Software contracts under ₹50L"
          style={{ ...inputStyle, fontSize: "14px", padding: "10px 12px" }}
        />
      </div>

      <BuilderFooter
        onBack={() => setScreen("build-2")}
        backLabel="← Back"
        canContinue={canActivate}
        continueLabel="Activate workflow →"
        onContinue={() => setScreen("landing")}
        secondaryAction={{ label: "Save as draft", onClick: () => setScreen("landing") }}
      />
    </div>
  );
}

/* ════════════════════════════════════════════════
   Screen 5: Edit — returning admin
   ════════════════════════════════════════════════ */

function Edit({ editingId, setScreen }: { editingId: string | null; setScreen: (s: Screen) => void }) {
  const wf = WORKFLOWS.find(w => w.id === editingId);
  const [dirty, setDirty] = useState(false);
  if (!wf) return <div style={{ padding: "40px", textAlign: "center" }}>Workflow not found.</div>;

  return (
    <div style={{ padding: "24px 28px", maxWidth: "780px", margin: "0 auto" }}>
      <BuilderStepHeader step={null} total={null} title={wf.name} subtitle="Editing — changes save when you click Save below." />

      {wf.inFlight && wf.inFlight > 0 && (
        <div style={{
          background: "var(--astra-yellow-bg)", border: "1px solid var(--astra-yellow-border)",
          padding: "10px 14px", borderRadius: "5px", marginBottom: "16px",
          display: "flex", alignItems: "center", gap: "10px",
          fontSize: "11px", color: "var(--astra-yellow)",
        }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--astra-yellow-dot)", flexShrink: 0 }} />
          <span><strong>{wf.inFlight} contracts</strong> are mid-approval using this workflow. Changes apply only to new contracts entering the system after save.</span>
        </div>
      )}

      <div className="astra-card" style={{ marginBottom: "10px" }}>
        <div style={{ fontFamily: "var(--astra-font-mono)", fontSize: "10px", color: "var(--astra-text-3)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "10px" }}>
          Conditions
        </div>
        {wf.conditions.map((c, i) => (
          <div key={c.id} style={{
            display: "grid", gridTemplateColumns: "auto 1fr 80px 1fr auto",
            gap: "10px", alignItems: "center",
            padding: "10px 0",
            borderTop: i > 0 ? "1px solid var(--astra-border-light)" : "none",
          }}>
            <span style={{ fontFamily: "var(--astra-font-mono)", fontSize: "10px", color: "var(--astra-text-3)" }}>
              {i === 0 ? "WHEN" : "AND"}
            </span>
            <span style={{ fontSize: "12px", fontWeight: 500 }}>{condTypeLabel(c.type)}</span>
            <span style={{ fontSize: "11px", color: "var(--astra-text-2)", textAlign: "center" }}>{c.operator}</span>
            <input
              type="text"
              defaultValue={c.value}
              onChange={() => setDirty(true)}
              style={inputStyle}
            />
            <button style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: "11px", color: "var(--astra-text-3)" }}>×</button>
          </div>
        ))}
      </div>

      <div className="astra-card" style={{ marginBottom: "16px" }}>
        <div style={{ fontFamily: "var(--astra-font-mono)", fontSize: "10px", color: "var(--astra-text-3)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "10px" }}>
          Approval chain
        </div>
        {wf.steps.map((s, i) => (
          <div key={s.id} style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: "10px", alignItems: "center", padding: "8px 0", borderTop: i > 0 ? "1px solid var(--astra-border-light)" : "none" }}>
            <div style={{
              width: "20px", height: "20px", borderRadius: "50%",
              background: "var(--astra-text-1)", color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "10px", fontWeight: 600,
            }}>{i + 1}</div>
            <input type="text" defaultValue={s.approver} onChange={() => setDirty(true)} style={inputStyle} />
            <button style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: "11px", color: "var(--astra-text-3)" }}>×</button>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
        <button className="astra-btn astra-btn-ghost astra-btn-sm">Duplicate</button>
        <button className="astra-btn astra-btn-ghost astra-btn-sm">{wf.active ? "Disable" : "Enable"}</button>
        <button className="astra-btn astra-btn-ghost astra-btn-sm" style={{ color: "var(--astra-red)", borderColor: "var(--astra-red-border)" }}>Delete</button>
      </div>

      {/* Save bar — appears on dirty */}
      {dirty && (
        <div style={{
          position: "sticky", bottom: 0,
          background: "var(--astra-surface)",
          padding: "16px 0",
          borderTop: "1px solid var(--astra-border-light)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          gap: "12px", flexWrap: "wrap",
        }}>
          <div style={{ fontSize: "11px", color: "var(--astra-text-2)" }}>You have unsaved changes</div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button className="astra-btn astra-btn-ghost astra-btn-sm" onClick={() => { setDirty(false); setScreen("landing"); }}>Discard</button>
            <button className="astra-btn astra-btn-primary astra-btn-sm" onClick={() => { setDirty(false); setScreen("landing"); }}>Save changes</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════
   Helpers + shared sub-components
   ════════════════════════════════════════════════ */

function BuilderStepHeader({ step, total, title, subtitle }: { step: number | null; total: number | null; title: string; subtitle: string }) {
  return (
    <div style={{ marginBottom: "20px" }}>
      {step != null && total != null && (
        <div style={{ fontFamily: "var(--astra-font-mono)", fontSize: "10px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--astra-text-3)", marginBottom: "6px" }}>
          Step {step} of {total}
        </div>
      )}
      <div style={{ fontSize: "18px", fontWeight: 600, marginBottom: "3px" }}>{title}</div>
      <div style={{ fontSize: "12px", color: "var(--astra-text-2)" }}>{subtitle}</div>
    </div>
  );
}

function BuilderFooter({
  onBack, backLabel, canContinue, onContinue, continueLabel = "Continue →", secondaryAction,
}: {
  onBack: () => void;
  backLabel: string;
  canContinue: boolean;
  onContinue: () => void;
  continueLabel?: string;
  secondaryAction?: { label: string; onClick: () => void };
}) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      paddingTop: "16px", marginTop: "16px",
      borderTop: "1px solid var(--astra-border-light)",
      gap: "8px", flexWrap: "wrap",
    }}>
      <button className="astra-btn astra-btn-ghost astra-btn-sm" onClick={onBack}>{backLabel}</button>
      <div style={{ display: "flex", gap: "8px" }}>
        {secondaryAction && (
          <button className="astra-btn astra-btn-ghost astra-btn-sm" onClick={secondaryAction.onClick}>
            {secondaryAction.label}
          </button>
        )}
        <button
          className="astra-btn astra-btn-primary astra-btn-sm"
          onClick={onContinue}
          disabled={!canContinue}
          style={{ opacity: canContinue ? 1 : 0.4, cursor: canContinue ? "pointer" : "not-allowed" }}
        >
          {continueLabel}
        </button>
      </div>
    </div>
  );
}

function PlainLanguagePreview({ preview, hint }: { preview: string; hint: string }) {
  return (
    <div style={{
      background: "var(--astra-blue-bg)",
      border: "1px solid var(--astra-blue-border)",
      borderRadius: "5px",
      padding: "12px 14px",
      marginBottom: "16px",
      display: "flex", alignItems: "flex-start", gap: "10px",
    }}>
      <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--astra-blue-dot)", marginTop: "6px", flexShrink: 0 }} />
      <div>
        <div style={{ fontFamily: "var(--astra-font-mono)", fontSize: "10px", color: "var(--astra-blue)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "4px", fontWeight: 600 }}>
          Plain-language preview
        </div>
        <div style={{ fontSize: "13px", color: "var(--astra-text-1)", marginBottom: "4px", fontWeight: 500 }}>
          {preview}
        </div>
        <div style={{ fontSize: "11px", color: "var(--astra-text-2)" }}>{hint}</div>
      </div>
    </div>
  );
}

function buildPreview(draft: Draft): string {
  const condParts = draft.conditions.map(c => {
    if (c.type === "contract-type") return `${c.value} contracts`;
    if (c.type === "amount")        return `${c.operator} ₹${c.value || "?"}`;
    if (c.type === "department")    return `from ${c.value || "[department]"}`;
    if (c.type === "vendor-risk")   return `with ${c.value || "[risk level]"} vendor risk`;
    return c.value;
  });
  const condStr = condParts.length === 0 ? "[Add a condition]" : condParts.join(" ");

  const stepStr = draft.steps.length === 0
    ? "[Add at least one approver]"
    : draft.steps.map(s => s.approver || "[?]").join(" → ");

  return `${condStr} go to ${stepStr}.`;
}

function condTypeLabel(t: WorkflowCondition["type"]): string {
  return ({
    "contract-type": "Contract type",
    "amount":        "Amount",
    "vendor-risk":   "Vendor risk",
    "department":    "Department",
  } as Record<string, string>)[t] ?? t;
}

function groupByCategory(workflows: Workflow[]) {
  const map = new Map<Workflow["category"], Workflow[]>();
  workflows.forEach(w => {
    const arr = map.get(w.category) ?? [];
    arr.push(w);
    map.set(w.category, arr);
  });
  return Array.from(map, ([category, workflows]) => ({ category, workflows }));
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  fontFamily: "var(--astra-font-body)",
  fontSize: "12px",
  padding: "6px 10px",
  border: "1px solid var(--astra-border)",
  borderRadius: "4px",
  background: "var(--astra-surface)",
  color: "var(--astra-text-1)",
  outline: "none",
};

const selectStyle: React.CSSProperties = {
  fontFamily: "var(--astra-font-body)",
  fontSize: "11px",
  padding: "3px 6px",
  border: "1px solid var(--astra-border)",
  borderRadius: "3px",
  background: "var(--astra-surface)",
  color: "var(--astra-text-1)",
  outline: "none",
};
