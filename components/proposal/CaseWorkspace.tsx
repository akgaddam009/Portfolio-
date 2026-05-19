"use client";

import { useCallback, useReducer } from "react";
import type { CreditCase, TimelineEvent } from "@/types/credit";
import { AIRecommendation, type AIRecommendationAction } from "./AIRecommendation";
import { Header, type HeaderCommittedDecision } from "./Header";
import { Timeline } from "./Timeline";
import { CaseBackground, type CaseBackgroundCommit } from "./Sections/CaseBackground";
import { KeyPoints } from "./Sections/KeyPoints";
import { Analysis } from "./Sections/Analysis";
import { PDDetails, type PDCommit } from "./Sections/PDDetails";
import { PriorRelationshipPanel } from "./PriorRelationshipPanel";
import { SendToApproverFooter } from "./SendToApproverFooter";

type LocalEvent = {
  id: string; timestamp: string; actor: TimelineEvent["actor"]; actorName?: string;
  action: string; detail?: string; overrideReason?: TimelineEvent["overrideReason"];
};

type WorkspaceState = { events: TimelineEvent[]; committed: HeaderCommittedDecision; nextId: number };

type WorkspaceAction =
  | { type: "PREPEND_EVENT"; event: LocalEvent }
  | { type: "COMMIT_DECISION"; committed: HeaderCommittedDecision; event: LocalEvent };

function reducer(state: WorkspaceState, action: WorkspaceAction): WorkspaceState {
  switch (action.type) {
    case "PREPEND_EVENT": {
      const id = `tl-local-${state.nextId}`;
      const event: TimelineEvent = { ...action.event, id };
      return { ...state, events: [event, ...state.events], nextId: state.nextId + 1 };
    }
    case "COMMIT_DECISION": {
      const id = `tl-local-${state.nextId}`;
      const event: TimelineEvent = { ...action.event, id };
      return { events: [event, ...state.events], committed: action.committed, nextId: state.nextId + 1 };
    }
  }
}

export function CaseWorkspace({ caseData, underwriterName = "Kushagra" }: { caseData: CreditCase; underwriterName?: string }) {
  const [state, dispatch] = useReducer(reducer, {
    events: caseData.timeline,
    committed: { amountDisplay: caseData.recommendation.recommendedDisplay, origin: "ai-rec" },
    nextId: 1,
  });

  const handleAIAction = useCallback((a: AIRecommendationAction) => {
    const now = new Date().toISOString();
    switch (a.kind) {
      case "accept":
        dispatch({ type: "COMMIT_DECISION", committed: { amountDisplay: a.amountDisplay, origin: "ai-accepted" }, event: { id: "", timestamp: now, actor: "underwriter", actorName: underwriterName, action: "Accepted AI Recommendation", detail: a.amountDisplay } });
        return;
      case "override":
        dispatch({ type: "COMMIT_DECISION", committed: { amountDisplay: a.submit.amountDisplay, origin: "overridden" }, event: { id: "", timestamp: now, actor: "underwriter", actorName: underwriterName, action: "Overrode AI Recommendation", detail: a.submit.notes ? `${a.submit.amountDisplay} · "${a.submit.notes}"` : a.submit.amountDisplay, overrideReason: a.submit.reason } });
        return;
      case "regenerate":
        dispatch({ type: "PREPEND_EVENT", event: { id: "", timestamp: now, actor: "ai", action: "Regenerated AI Recommendation", detail: a.source === "live" ? "Live Gemini response" : "Demo-mode fallback" } });
        return;
      case "discuss":
        dispatch({ type: "PREPEND_EVENT", event: { id: "", timestamp: now, actor: "underwriter", actorName: underwriterName, action: "Opened Discuss with AI", detail: "Conversation panel ships in Phase 2" } });
        return;
    }
  }, [underwriterName]);

  const handleBackgroundCommit = useCallback((c: CaseBackgroundCommit) => {
    const now = new Date().toISOString();
    dispatch({ type: "PREPEND_EVENT", event: { id: "", timestamp: now, actor: c.origin === "revert" ? "ai" : "underwriter", actorName: c.origin === "revert" ? undefined : underwriterName, action: c.origin === "revert" ? "Reverted Case Background to AI draft" : "Edited Case Background", detail: `${c.paragraphs.length} paragraph${c.paragraphs.length === 1 ? "" : "s"} · provenance → ${c.provenance.replace("-", " ")}` } });
  }, [underwriterName]);

  const handlePDCommit = useCallback((c: PDCommit) => {
    const now = new Date().toISOString();
    switch (c.kind) {
      case "questions-toggled":
        dispatch({ type: "PREPEND_EVENT", event: { id: "", timestamp: now, actor: "underwriter", actorName: underwriterName, action: c.hidden ? "Hid PD suggested questions" : "Showed PD suggested questions" } });
        return;
      case "notes-structured":
        dispatch({ type: "PREPEND_EVENT", event: { id: "", timestamp: now, actor: "ai", action: "Structured PD notes", detail: `${c.structured.comforts.length} comforts · ${c.structured.discomforts.length} discomforts · ${c.source === "live" ? "live" : "demo-mode"}` } });
        return;
      case "structured-cleared":
        dispatch({ type: "PREPEND_EVENT", event: { id: "", timestamp: now, actor: "underwriter", actorName: underwriterName, action: "Cleared structured PD notes" } });
        return;
    }
  }, [underwriterName]);

  return (
    <div className="space-y-5">
      <Header caseData={caseData} committed={state.committed} view="workspace" />
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-5 items-start">
        <div className="space-y-5 min-w-0">
          <div className="px-1">
            <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">{caseData.id} · {caseData.status.replace(/-/g, " ")}</p>
            <h1 className="font-serif text-[40px] leading-none tracking-tight text-foreground mt-2">{caseData.vendor.name}</h1>
            <p className="font-sans text-[14px] text-muted-foreground mt-1.5">{caseData.vendor.profile} · {caseData.vendor.sector} · {caseData.vendor.location}</p>
            <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground mt-3">Requested {caseData.requestedDisplay} · {caseData.tenureMonths} months</p>
          </div>
          {caseData.priorRelationship && (<PriorRelationshipPanel prior={caseData.priorRelationship} />)}
          <AIRecommendation initial={caseData.recommendation} caseId={caseData.id.toLowerCase()} initialSource="fallback" onAction={handleAIAction} />
          <CaseBackground initial={caseData.caseBackground} onCommit={handleBackgroundCommit} />
          <KeyPoints metrics={caseData.keyPoints} />
          <Analysis subSections={caseData.analysis} />
          <PDDetails initial={caseData.pdDetails} onCommit={handlePDCommit} />
          <SendToApproverFooter caseId={caseData.id} amountDisplay={state.committed.amountDisplay} />
        </div>
        <Timeline events={state.events} className="lg:sticky lg:top-5" />
      </div>
    </div>
  );
}
