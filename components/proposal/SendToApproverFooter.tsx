"use client";

import { useTransition } from "react";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { underwriterSendToApprover } from "@/app/actions/case-flow";

export function SendToApproverFooter({ caseId, amountDisplay }: { caseId: string; amountDisplay: string }) {
  const [isPending, startTransition] = useTransition();
  const canSend = amountDisplay && amountDisplay !== "—";
  const handleSend = () => {
    startTransition(async () => { await underwriterSendToApprover(caseId); });
  };
  return (
    <section aria-label="Send to approver" className="bg-card border border-border rounded-lg px-5 py-5">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">Ready to forward</p>
          <p className="font-sans text-[14px] text-foreground mt-1.5 leading-snug">
            {canSend ? (<>You&apos;ll send a recommendation of <span className="font-serif text-[18px]">{amountDisplay}</span> to the approver.</>) : ("Commit a recommendation above before forwarding to the approver.")}
          </p>
        </div>
        <button type="button" onClick={handleSend} disabled={!canSend || isPending}
          className={cn("inline-flex items-center gap-2 px-5 py-2.5 rounded-lg shrink-0", "font-sans text-[14px] font-medium", "transition-colors",
            canSend && !isPending ? "bg-foreground text-background hover:bg-foreground/90" : "bg-secondary text-muted-foreground cursor-not-allowed")}>
          <Send className="h-4 w-4" aria-hidden strokeWidth={1.75} />
          {isPending ? "Sending…" : "Send to Approver"}
        </button>
      </div>
    </section>
  );
}
