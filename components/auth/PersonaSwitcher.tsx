"use client";

import { useTransition } from "react";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { accentClasses, type Persona } from "@/lib/personas";
import { signOut } from "@/app/actions/persona";

export function PersonaSwitcher({ persona, className }: { persona: Persona; className?: string }) {
  const accent = accentClasses[persona.accent];
  const [isPending, startTransition] = useTransition();
  const handleSignOut = () => { startTransition(async () => { await signOut(); }); };
  return (
    <div className={cn("inline-flex items-center gap-2.5", className)}>
      <span aria-hidden className={cn("h-7 w-7 rounded-full inline-flex items-center justify-center shrink-0", "font-mono text-[10px] font-semibold tracking-tight", accent.fg)}>{persona.initials}</span>
      <div className="min-w-0 hidden sm:block">
        <p className="font-sans text-[12px] font-medium text-foreground leading-tight truncate">{persona.name}</p>
        <p className={cn("font-mono text-[9px] uppercase tracking-[0.08em] leading-tight", accent.text)}>{persona.role}</p>
      </div>
      <button type="button" onClick={handleSignOut} disabled={isPending} aria-label="Switch persona"
        className={cn("inline-flex items-center gap-1 px-2 py-1 rounded-md", "font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground", "hover:bg-secondary hover:text-foreground transition-colors", "disabled:opacity-50")}>
        <LogOut className="h-3 w-3" aria-hidden strokeWidth={1.75} />
        Switch
      </button>
    </div>
  );
}
