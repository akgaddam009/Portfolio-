"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { QuickFilter, QuickFilterId } from "@/data/inboxMockData";

export function QuickFilterBar({ filters, counts, active, className }: { filters: QuickFilter[]; counts: Record<QuickFilterId, number>; active: QuickFilterId; className?: string }) {
  return (
    <nav aria-label="Filter enquiries" className={cn("flex items-center gap-1 -mx-2 overflow-x-auto", className)}>
      {filters.map((f) => {
        const isActive = active === f.id;
        const count = counts[f.id] ?? 0;
        return (
          <Link key={f.id} href={`/inbox${f.id === "all" ? "" : `?filter=${f.id}`}`}
            className={cn("relative inline-flex items-center gap-2 px-3 py-2.5", "font-sans text-[14px] whitespace-nowrap", "transition-colors", isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground")}>
            <span className={cn(isActive && "font-medium")}>{f.label}</span>
            <span className={cn("font-mono text-[11px]", isActive ? "text-foreground/60" : "text-muted-foreground/60")}>{count}</span>
            {isActive && (<span aria-hidden className="absolute inset-x-2 -bottom-px h-[2px] bg-foreground rounded-full" />)}
          </Link>
        );
      })}
    </nav>
  );
}
