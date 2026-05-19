"use client";

import Link from "next/link";
import { Check, AlertCircle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { InboxItem } from "@/types/credit";

export function InboxCard({ item, hideTemperature = false, className }: { item: InboxItem; hideTemperature?: boolean; className?: string }) {
  const isReturning = item.priorReviewCount > 0 && item.priorApproval;
  const showWarm = !hideTemperature && item.temperature !== "cold";
  return (
    <Link href={`/case/${item.id}`}
      className={cn("group/inbox block bg-card border border-border rounded-xl", "px-6 py-5", "hover:border-foreground/25 hover:shadow-[0_1px_2px_rgba(0,0,0,0.04)]", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", "transition-[border-color,box-shadow]", className)}>
      {showWarm && (
        <div className="flex justify-end -mt-1 -mr-1 mb-1">
          <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-signal-caution">Warm</span>
        </div>
      )}
      <div className="flex items-baseline justify-between gap-6">
        <h3 className="font-serif text-[20px] sm:text-[22px] leading-tight tracking-tight text-foreground truncate">{item.vendor.name}</h3>
        <span className="font-serif text-[24px] sm:text-[26px] leading-none tracking-tight text-foreground shrink-0">{item.requestedDisplay}</span>
      </div>
      <p className="font-sans text-[13px] text-muted-foreground mt-2">{item.vendor.constitution} · {item.vendor.bu} · {item.vendor.region}</p>
      <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-muted-foreground mt-3">
        {item.id.toUpperCase()}
        {!hideTemperature && (<><span className="mx-1.5 text-border" aria-hidden>·</span><span className="normal-case tracking-normal text-foreground">{item.submittedBy}</span><span className="text-muted-foreground"> originated</span></>)}
        <span className="mx-1.5 text-border" aria-hidden>·</span>
        <span className="normal-case tracking-normal">{item.submittedAtDisplay}</span>
      </p>
      {isReturning && item.priorApproval && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <p className="font-sans text-[13px] text-muted-foreground">
              Previously approved <span className="text-foreground">{item.priorApproval.approvedAmountDisplay}</span>
              <span className="inline-flex items-center justify-center align-middle ml-1 w-3.5 h-3.5 rounded-full bg-signal-positive-bg"><Check className="h-2.5 w-2.5 text-signal-positive" strokeWidth={3} aria-hidden /></span>
              {" "}by <span className="text-foreground">{item.priorApproval.approverName}</span><span className="text-muted-foreground"> on {item.priorApproval.approvedDateDisplay}</span>
            </p>
            {item.priorApproval.needsReassessment && (<span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-signal-caution"><AlertCircle className="h-3 w-3" aria-hidden strokeWidth={2} />Update assessment</span>)}
          </div>
        </div>
      )}
      <p aria-hidden className="mt-4 font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground inline-flex items-center gap-1 opacity-0 group-hover/inbox:opacity-100 transition-opacity">
        Open <ArrowRight className="h-3 w-3" strokeWidth={1.75} />
      </p>
    </Link>
  );
}
