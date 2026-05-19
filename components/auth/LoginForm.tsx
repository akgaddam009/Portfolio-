"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { PERSONAS, accentClasses, type Persona } from "@/lib/personas";
import { signIn } from "@/app/actions/persona";

const errorCopy: Record<"missing-fields" | "unknown-user" | "wrong-password", string> = {
  "missing-fields":  "Enter both email and password.",
  "unknown-user":    "No persona with this email. Pick one from Demo credentials.",
  "wrong-password":  "Wrong password. The personas use simple demo passwords.",
};

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<keyof typeof errorCopy | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleFill = (p: Persona) => {
    setEmail(p.email);
    setPassword(p.password);
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const fd = new FormData();
    fd.set("email", email);
    fd.set("password", password);
    startTransition(async () => {
      const result = await signIn(fd);
      if (result.ok) {
        router.push(result.landingPath);
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  };

  return (
    <main className="min-h-screen bg-background py-10 px-5">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10 text-center sm:text-left">
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">Demo · Underwrite</p>
          <h1 className="font-serif text-[40px] sm:text-[52px] leading-[0.95] tracking-tight text-foreground mt-3">Sign in to continue.</h1>
          <p className="font-sans text-[15px] text-muted-foreground mt-3 max-w-lg">
            Pick a persona to see the workflow from that role&apos;s point of view. Each role sees a different inbox, a different primary surface, and a different set of available actions.
          </p>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-8 items-start">
          <section aria-labelledby="login-heading" className="bg-card border border-border rounded-lg px-6 py-6">
            <h2 id="login-heading" className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">Sign in</h2>
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label htmlFor="login-email" className="block font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground mb-1.5">Email</label>
                <input id="login-email" type="email" autoComplete="email" value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(null); }}
                  placeholder="you@zetwerk.com"
                  className={cn("w-full bg-background border rounded-md px-3 py-2", "font-sans text-[14px] text-foreground placeholder:text-muted-foreground", "focus:outline-none transition-colors",
                    error === "unknown-user" || error === "missing-fields" ? "border-signal-blocking/50 focus:border-signal-blocking" : "border-border focus:border-foreground")} />
              </div>
              <div>
                <label htmlFor="login-password" className="block font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground mb-1.5">Password</label>
                <input id="login-password" type="password" autoComplete="current-password" value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(null); }}
                  placeholder="••••••••"
                  className={cn("w-full bg-background border rounded-md px-3 py-2", "font-sans text-[14px] text-foreground placeholder:text-muted-foreground", "focus:outline-none transition-colors",
                    error === "wrong-password" || error === "missing-fields" ? "border-signal-blocking/50 focus:border-signal-blocking" : "border-border focus:border-foreground")} />
              </div>
              {error && (<p role="alert" className="font-mono text-[11px] text-signal-blocking">{errorCopy[error]}</p>)}
              <button type="submit" disabled={isPending}
                className={cn("w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-md", "font-sans text-[14px] font-medium",
                  isPending ? "bg-secondary text-muted-foreground cursor-wait" : "bg-foreground text-background hover:bg-foreground/90", "transition-colors")}>
                <LogIn className="h-4 w-4" aria-hidden strokeWidth={1.75} />
                {isPending ? "Signing in…" : "Sign in"}
              </button>
            </form>
          </section>
          <section aria-labelledby="demo-creds-heading">
            <div className="flex items-center justify-between mb-3">
              <h2 id="demo-creds-heading" className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">Demo credentials · click to fill</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.values(PERSONAS).map((p) => {
                const accent = accentClasses[p.accent];
                return (
                  <button key={p.id} type="button" onClick={() => handleFill(p)}
                    className={cn("group/p text-left bg-card border rounded-lg p-4", "hover:bg-secondary/40 transition-colors", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", accent.border)}>
                    <div className="flex items-center gap-3">
                      <span className={cn("h-9 w-9 rounded-full inline-flex items-center justify-center shrink-0", "font-mono text-[11px] font-semibold tracking-tight", accent.fg)}>{p.initials}</span>
                      <div className="min-w-0 flex-1">
                        <p className="font-sans text-[14px] font-medium text-foreground leading-tight truncate">{p.name}</p>
                        <p className={cn("font-mono text-[10px] uppercase tracking-[0.08em] mt-0.5", accent.text)}>{p.role}</p>
                      </div>
                    </div>
                    <p className="font-sans text-[12px] text-muted-foreground leading-snug mt-2">{p.tagline}</p>
                    <div className="mt-3 pt-3 border-t border-border space-y-0.5">
                      <p className="font-mono text-[11px] text-foreground">{p.email}</p>
                      <p className="font-mono text-[11px] text-muted-foreground"><span className="opacity-60">password:</span> {p.password}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground mt-12 text-center sm:text-left">Demo only · no real auth. Phase 3 swaps this for Clerk magic-link.</p>
      </div>
    </main>
  );
}
