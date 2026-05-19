"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { ArrowLeft, Check, FileText, AlertCircle, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import type { InboxItem } from "@/types/credit";
import type { Persona } from "@/lib/personas";
import { cpaForwardToUnderwriter } from "@/app/actions/case-flow";

const REQUIRED_DOCS = [
  { id: "pan",       name: "PAN Card",                 type: "Identity" },
  { id: "gst",       name: "GST Registration",         type: "Compliance" },
  { id: "itr",       name: "ITR (last 2 years)",       type: "Financial" },
  { id: "bank",      name: "Bank Statement (6 months)", type: "Financial" },
  { id: "balance",   name: "Balance Sheet (audited)",   type: "Financial" },
  { id: "vendor-app",name: "Vendor Application Form",   type: "Application" },
] as const;

type DocId = (typeof REQUIRED_DOCS)[number]["id"];
type DocState = "pending" | "verified" | "flagged";

export function CPAVerificationView({ item, persona }: { item: InboxItem; persona: Persona }) {
  const [docs, setDocs] = useState<Record<DocId, DocState>>(
    () => Object.fromEntries(REQUIRED_DOCS.map(d => [d.id, "pending"])) as Record<DocId, DocState>,
  );
  const [note, setNote] = useState("");
  const [isPending, startTransition] = useTransition();

  const verifiedCount = Object.values(docs).filter(s => s === "verified").length;
  const flaggedCount = Object.values(docs).filter(s => s === "flagged").length;
  const allVerified = verifiedCount === REQUIRED_DOCS.length;
  const canForward = allVerified && flaggedCount === 0;
  const handleForward = () => { startTransition(async () => { await cpaForwardToUnderwriter(item.id); }); };

  return (
    <main className="min-h-screen bg-background py-8 px-5 sm:px-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/inbox" className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="h-3 w-3" aria-hidden strokeWidth={1.75} />Back to enquiries
        </Link>
        <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground">{item.id.toUpperCase()} · Pending verification</p>
        <h1 className="font-serif text-[40px] sm:text-[48px] leading-tight tracking-tight text-foreground mt-2">{item.vendor.name}</h1>
        <p className="font-sans text-[14px] text-muted-foreground mt-1.5">{item.vendor.constitution} · {item.vendor.bu} · {item.vendor.region}</p>
        <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-muted-foreground mt-3">
          Requested <span className="text-foreground normal-case tracking-normal">{item.requestedDisplay}</span>
          {" · "}<span className="text-foreground normal-case tracking-normal">{item.submittedBy}</span> originated
          {" · "}<span className="normal-case tracking-normal">{item.submittedAtDisplay}</span>
        </p>
        <div className="mt-8 p-4 bg-secondary/40 border border-border rounded-lg">
          <p className="font-sans text-[14px] text-foreground leading-relaxed">
            <span className="font-medium">{persona.name},</span> verify that every required document is on file and consistent with the GST &amp; PAN data. Flag any that&apos;s missing or off, then forward the packet to the underwriter.
          </p>
        </div>
        <section aria-labelledby="docs-heading" className="mt-8">
          <div className="flex items-baseline justify-between mb-3">
            <h2 id="docs-heading" className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">Required documents</h2>
            <p className="font-mono text-[11px] text-muted-foreground">
              <span className="text-foreground">{verifiedCount}</span>{" / "}{REQUIRED_DOCS.length} verified
              {flaggedCount > 0 && (<span className="text-signal-blocking ml-2">· {flaggedCount} flagged</span>)}
            </p>
          </div>
          <ul className="space-y-2">
            {REQUIRED_DOCS.map((doc) => {
              const state = docs[doc.id];
              return (
                <li key={doc.id} className="bg-card border border-border rounded-lg p-4 flex items-center gap-4">
                  <FileText className="h-4 w-4 text-muted-foreground shrink-0" aria-hidden strokeWidth={1.5} />
                  <div className="flex-1 min-w-0">
                    <p className="font-sans text-[14px] font-medium text-foreground leading-tight">{doc.name}</p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground mt-0.5">{doc.type}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button type="button" onClick={() => setDocs(d => ({ ...d, [doc.id]: state === "verified" ? "pending" : "verified" }))} aria-pressed={state === "verified"}
                      className={cn("inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md", "font-mono text-[10px] uppercase tracking-[0.08em]", "border transition-colors",
                        state === "verified" ? "bg-signal-positive-bg text-signal-positive border-signal-positive/40" : "bg-card text-muted-foreground border-border hover:bg-secondary")}>
                      <Check className="h-3 w-3" strokeWidth={2} aria-hidden />{state === "verified" ? "Verified" : "Verify"}
                    </button>
                    <button type="button" onClick={() => setDocs(d => ({ ...d, [doc.id]: state === "flagged" ? "pending" : "flagged" }))} aria-pressed={state === "flagged"}
                      className={cn("inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md", "font-mono text-[10px] uppercase tracking-[0.08em]", "border transition-colors",
                        state === "flagged" ? "bg-signal-blocking-bg text-signal-blocking border-signal-blocking/40" : "bg-card text-muted-foreground border-border hover:bg-secondary")}>
                      <AlertCircle className="h-3 w-3" strokeWidth={2} aria-hidden />{state === "flagged" ? "Flagged" : "Flag"}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
        {flaggedCount > 0 && (
          <section className="mt-6">
            <label htmlFor="cpa-note" className="block font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground mb-2">Note for sales (optional)</label>
            <textarea id="cpa-note" rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Bank statement is from 4 months ago — please share the latest."
              className="w-full bg-card border border-border rounded-lg px-3 py-2.5 font-sans text-[14px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/40 transition-colors resize-none" />
          </section>
        )}
        <div className="mt-8 pt-6 border-t border-border flex items-center justify-between gap-4 flex-wrap">
          <p className="font-sans text-[13px] text-muted-foreground">
            {canForward ? "All documents are good. Forward this packet to the underwriter." : flaggedCount > 0 ? "Resolve flagged docs first, or send back to Sales." : "Verify each document before forwarding."}
          </p>
          <button type="button" onClick={handleForward} disabled={!canForward || isPending}
            className={cn("inline-flex items-center gap-2 px-5 py-2.5 rounded-lg", "font-sans text-[14px] font-medium", "transition-colors",
              canForward && !isPending ? "bg-foreground text-background hover:bg-foreground/90" : "bg-secondary text-muted-foreground cursor-not-allowed")}>
            <Send className="h-4 w-4" aria-hidden strokeWidth={1.75} />
            {isPending ? "Forwarding…" : "Send to Underwriter"}
          </button>
        </div>
      </div>
    </main>
  );
}
