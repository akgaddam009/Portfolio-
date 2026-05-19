"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronRight, ShieldCheck, ShieldAlert, ShieldQuestion } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CreditCase, ApproverDecision } from "@/types/credit";
import { ConfidenceIndicator } from "./ConfidenceIndicator";
import { RiskFlagCard } from "./RiskFlagCard";
import { PriorRelationshipPanel } from "./PriorRelationshipPanel";
import { approverApprove, approverReturn } from "@/app/actions/case-flow";

export type BriefSubmit = { decision: ApproverDecision; approverName: string };

export function ApproverBrief({ caseData, approverName = "Sukesh", onSubmit }: { caseData: CreditCase; approverName?: string; onSubmit?: (s: BriefSubmit) => void }) {
  const [submitted, setSubmitted] = useState<ApproverDecision | null>(null);
  const rec = caseData.recommendation;
  const primaryFlag = rec.flags[0] ?? null;
  const comparables = rec.comparables.slice(0, 2);
  const compressedReasons = rec.reasons.map(r => compress(r.text, 24));

  const handleDecide = (decision: ApproverDecision) => {
    setSubmitted(decision);
    onSubmit?.({ decision, approverName });
    setTimeout(() => {
      if (decision === "approved") { approverApprove(caseData.id); }
      else if (decision === "returned") { approverReturn(caseData.id, ""); }
    }, 350);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="px-4 sm:px-6 py-3 flex items-center gap-4 border-b border-border bg-card">
        <Link href={`/case/${caseData.id.toLowerCase()}`} aria-label="Back to Workspace"
          className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden strokeWidth={1.75} />Workspace
        </Link>
        <span className="text-border" aria-hidden>·</span>
        <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">Brief · {caseData.id}</p>
      </header>
      <div className="flex-1 px-4 sm:px-6 py-6 pb-44 sm:pb-32">
        <div className="max-w-[720px] mx-auto space-y-6">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">{caseData.vendor.profile}</p>
            <h1 className="font-serif text-[28px] sm:text-[34px] leading-tight tracking-tight text-foreground mt-1.5">{caseData.vendor.name}</h1>
            <p className="font-sans text-[13px] text-muted-foreground mt-1">{caseData.vendor.sector} · {caseData.vendor.location}</p>
          </div>
          {caseData.priorRelationship && (<PriorRelationshipPanel prior={caseData.priorRelationship} />)}
          <section aria-label="AI Recommendation" className="rounded-lg border border-ai-border bg-ai-soft px-5 py-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-ai mb-2">AI Recommendation</p>
            <div className="flex items-end gap-4 flex-wrap">
              <span className="font-serif text-[64px] sm:text-[80px] leading-[0.9] text-foreground">{rec.recommendedDisplay}</span>
              <div className="flex flex-col items-start gap-0.5 pb-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">Requested</span>
                <span className="font-serif text-[20px] leading-none text-muted-foreground line-through">{rec.requestedDisplay}</span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-ai-border/60">
              <ConfidenceIndicator confidence={rec.confidence} size="md" />
            </div>
          </section>
          <section>
            <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground mb-3">Why</p>
            <ol className="space-y-3">
              {compressedReasons.map((text, idx) => (
                <li key={idx} className="flex gap-3">
                  <span aria-hidden className="font-mono text-[11px] text-muted-foreground mt-1 tabular-nums shrink-0 w-5">{String(idx + 1).padStart(2, "0")}</span>
                  <p className="font-sans text-[15px] leading-relaxed text-foreground flex-1">{text}</p>
                </li>
              ))}
            </ol>
          </section>
          {primaryFlag && (
            <section>
              <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground mb-3">Primary flag</p>
              <RiskFlagCard flag={primaryFlag} />
            </section>
          )}
          {comparables.length > 0 && (
            <section>
              <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground mb-3">Comparable approvals</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {comparables.map(c => (
                  <div key={c.id} className="bg-card border border-border rounded-lg px-4 py-3">
                    <p className="font-sans text-[13px] font-medium text-foreground">{c.vendorName}</p>
                    <p className="font-sans text-[12px] text-muted-foreground mt-0.5 line-clamp-1">{c.profile}</p>
                    <p className="font-serif text-[18px] text-foreground mt-2 leading-none">
                      {c.recommendedDisplay}
                      <span className="font-serif text-[13px] text-muted-foreground line-through ml-1.5">{c.requestedDisplay}</span>
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
          <Link href={`/case/${caseData.id.toLowerCase()}`}
            className={cn("inline-flex items-center gap-1.5 mt-2", "font-sans text-[13px] font-medium text-muted-foreground", "hover:text-foreground transition-colors")}>
            Show full proposal<ChevronRight className="h-3.5 w-3.5" aria-hidden strokeWidth={1.75} />
          </Link>
          {submitted && (
            <div role="status" className={cn("rounded-lg border px-4 py-3 mt-2",
                submitted === "approved" ? "border-signal-positive/40 bg-signal-positive-bg" : submitted === "returned" ? "border-signal-caution/40 bg-signal-caution-bg" : "border-ai-border bg-ai-soft")}>
              <p className={cn("font-mono text-[10px] uppercase tracking-[0.08em]",
                  submitted === "approved" ? "text-signal-positive" : submitted === "returned" ? "text-signal-caution" : "text-ai")}>
                {submitted === "approved" && "Approved by " + approverName}
                {submitted === "returned" && "Returned for clarification"}
                {submitted === "escalated" && "Escalated to higher tier"}
              </p>
              <p className="font-sans text-[13px] text-foreground mt-1">Decision logged to the audit trail. The Underwriter will see this on the Timeline.</p>
            </div>
          )}
        </div>
      </div>
      <div className={cn("sticky bottom-0 left-0 right-0 z-30", "bg-card border-t border-border", "px-4 sm:px-6 py-3", "pb-[max(0.75rem,env(safe-area-inset-bottom))]")}>
        <div className="max-w-[720px] mx-auto grid grid-cols-3 gap-2">
          <button type="button" onClick={() => handleDecide("escalated")} disabled={submitted !== null}
            className={cn("inline-flex items-center justify-center gap-1.5 py-3 rounded-md", "font-sans text-[13px] font-medium", "border border-border bg-card text-foreground", "hover:bg-secondary transition-colors", "disabled:opacity-50 disabled:cursor-not-allowed")}>
            <ShieldQuestion className="h-4 w-4" aria-hidden strokeWidth={1.75} />Escalate
          </button>
          <button type="button" onClick={() => handleDecide("returned")} disabled={submitted !== null}
            className={cn("inline-flex items-center justify-center gap-1.5 py-3 rounded-md", "font-sans text-[13px] font-medium", "border border-signal-caution/40 bg-signal-caution-bg text-signal-caution", "hover:bg-signal-caution-bg/80 transition-colors", "disabled:opacity-50 disabled:cursor-not-allowed")}>
            <ShieldAlert className="h-4 w-4" aria-hidden strokeWidth={1.75} />Return
          </button>
          <button type="button" onClick={() => handleDecide("approved")} disabled={submitted !== null}
            className={cn("inline-flex items-center justify-center gap-1.5 py-3 rounded-md", "font-sans text-[14px] font-medium", "bg-foreground text-background hover:bg-foreground/90 transition-colors", "disabled:opacity-50 disabled:cursor-not-allowed")}>
            <ShieldCheck className="h-4 w-4" aria-hidden strokeWidth={1.75} />Approve
          </button>
        </div>
      </div>
    </div>
  );
}

function compress(text: string, maxWords: number): string {
  const words = text.split(/\s+/);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(" ").replace(/[.,;:]?$/, "") + "…";
}
