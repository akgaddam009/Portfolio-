"use client";

import Link from "next/link";
import { LayoutGrid, Inbox, Users, BarChart3, Settings2, LogOut, Sparkles } from "lucide-react";
import { useTransition } from "react";
import { cn } from "@/lib/utils";
import { accentClasses, type Persona } from "@/lib/personas";
import { signOut } from "@/app/actions/persona";

type NavItem = { href: string; label: string; icon: typeof LayoutGrid };

const NAV: NavItem[] = [
  { href: "/inbox?view=overview", label: "Overview",   icon: LayoutGrid },
  { href: "/inbox",               label: "Enquiries",  icon: Inbox },
  { href: "/inbox#vendors",       label: "Vendors",    icon: Users },
  { href: "/inbox#reports",       label: "Reports",    icon: BarChart3 },
  { href: "/inbox#settings",      label: "Settings",   icon: Settings2 },
];

export function Sidebar({ persona, activeHref = "/inbox" }: { persona: Persona; activeHref?: string }) {
  const [isPending, startTransition] = useTransition();
  const handleSignOut = () => startTransition(() => signOut() as unknown as void);
  const accent = accentClasses[persona.accent];
  return (
    <aside aria-label="Primary" className="hidden lg:flex flex-col items-center w-16 shrink-0 border-r border-border bg-elevated">
      <Link href="/inbox" aria-label="Underwrite home" className={cn("mt-4 mb-5 h-10 w-10 rounded-xl", "inline-flex items-center justify-center", "bg-foreground text-background", "hover:scale-[1.04] transition-transform")}>
        <Sparkles className="h-4.5 w-4.5" aria-hidden strokeWidth={2} />
      </Link>
      <nav className="flex flex-col items-center gap-1 mt-2 flex-1">
        {NAV.map((item) => {
          const isActive = activeHref === item.href || (item.href === "/inbox" && activeHref === "/inbox");
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} aria-label={item.label} aria-current={isActive ? "page" : undefined}
              className={cn("group/nav relative h-10 w-10 rounded-lg", "inline-flex items-center justify-center", "transition-colors", isActive ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground")}>
              {isActive && (<span aria-hidden className="absolute -left-2 top-1.5 bottom-1.5 w-[2px] bg-foreground rounded-full" />)}
              <Icon className="h-4.5 w-4.5" aria-hidden strokeWidth={1.75} />
              <span aria-hidden className={cn("absolute left-12 top-1/2 -translate-y-1/2 z-10", "px-2 py-1 rounded-md", "bg-foreground text-background", "font-mono text-[10px] uppercase tracking-[0.06em] whitespace-nowrap", "opacity-0 group-hover/nav:opacity-100 pointer-events-none", "transition-opacity")}>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="pb-4 flex flex-col items-center gap-2">
        <button type="button" onClick={handleSignOut} disabled={isPending} aria-label="Sign out"
          className={cn("group/out h-10 w-10 rounded-lg", "inline-flex items-center justify-center", "text-muted-foreground hover:bg-secondary/60 hover:text-foreground", "transition-colors", "disabled:opacity-50")}>
          <LogOut className="h-4 w-4" aria-hidden strokeWidth={1.75} />
        </button>
        <div aria-label={`${persona.name}, ${persona.role}`} className={cn("h-10 w-10 rounded-full inline-flex items-center justify-center", "font-mono text-[11px] font-semibold", accent.fg)}>{persona.initials}</div>
      </div>
    </aside>
  );
}
