"use client";

import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function FlowToast({ title, body }: { title: string; body: string }) {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 5000);
    return () => clearTimeout(t);
  }, [title, body]);
  if (!show) return null;
  return (
    <div role="status" aria-live="polite"
      className={cn("fixed top-5 right-5 z-50 max-w-sm", "bg-card border border-signal-positive/30 rounded-lg", "px-4 py-3 shadow-lg", "flex items-start gap-3", "animate-in fade-in slide-in-from-top-2 duration-200")}>
      <span className="mt-0.5 inline-flex items-center justify-center h-5 w-5 rounded-full bg-signal-positive-bg shrink-0">
        <Check className="h-3 w-3 text-signal-positive" strokeWidth={3} aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-sans text-[13px] font-medium text-foreground leading-tight">{title}</p>
        <p className="font-sans text-[12px] text-muted-foreground mt-0.5 leading-snug">{body}</p>
      </div>
      <button type="button" onClick={() => setShow(false)} aria-label="Dismiss" className="text-muted-foreground hover:text-foreground transition-colors">
        <X className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
      </button>
    </div>
  );
}
