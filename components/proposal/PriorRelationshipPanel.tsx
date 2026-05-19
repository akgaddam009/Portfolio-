import { Check, AlertCircle, Clock, TrendingUp, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PriorRelationship, PaymentBehavior } from "@/types/credit";

const behaviorMeta: Record<PaymentBehavior, { label: string; classes: string; Icon: typeof Check }> = {
  clean: { label: "Clean payment record", classes: "text-signal-positive bg-signal-positive-bg border-signal-positive/40", Icon: Check },
  "minor-delays": { label: "Minor payment delays", classes: "text-signal-caution bg-signal-caution-bg border-signal-caution/40", Icon: AlertCircle },
  concerns: { label: "Payment concerns on file", classes: "text-signal-blocking bg-signal-blocking-bg border-signal-blocking/40", Icon: AlertCircle },
};

function formatDateDisplay(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export function PriorRelationshipPanel({ prior, className }: { prior: PriorRelationship; className?: string }) {
  const behavior = behaviorMeta[prior.paymentBehavior];
  const BehaviorIcon = behavior.Icon;
  return (
    <section aria-labelledby="prior-relationship-heading" className={cn("bg-card border border-border rounded-lg px-5 py-4", className)}>
      <div className="flex items-baseline justify-between gap-3 flex-wrap">
        <h2 id="prior-relationship-heading" className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">Prior relationship</h2>
        <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
          First approved <span className="text-foreground normal-case tracking-normal">{formatDateDisplay(prior.firstApprovedDate)}</span>
          {" · "}
          Last reviewed <span className="text-foreground normal-case tracking-normal">{formatDateDisplay(prior.lastReviewedAt)}</span> by <span className="text-foreground normal-case tracking-normal">{prior.lastReviewedBy}</span>
        </p>
      </div>
      <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Stat icon={<TrendingUp className="h-3 w-3" strokeWidth={1.75} />} label="Active limit" valueClassName="font-serif text-[20px] text-foreground" value={prior.currentLimitDisplay} hint={`${prior.currentTenureDays}-day terms`} />
        <Stat icon={<Clock className="h-3 w-3" strokeWidth={1.75} />} label="Avg utilisation" valueClassName="font-serif text-[20px] text-foreground" value={prior.averageUtilization} hint="over last 12 months" />
        <Stat icon={<Package className="h-3 w-3" strokeWidth={1.75} />} label="Orders completed" valueClassName="font-serif text-[20px] text-foreground" value={prior.ordersCompleted.toString()} hint="since first approval" />
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground inline-flex items-center gap-1">
            <BehaviorIcon className="h-3 w-3" strokeWidth={1.75} aria-hidden />Payment record
          </p>
          <p className={cn("mt-1.5 inline-flex items-center gap-1.5 px-2 py-1 rounded-md border", "font-mono text-[11px]", behavior.classes)}>
            <BehaviorIcon className="h-3 w-3" strokeWidth={2} aria-hidden />{behavior.label}
          </p>
        </div>
      </div>
      {prior.notes && (
        <p className="font-sans text-[13px] leading-relaxed text-muted-foreground mt-4 pt-3 border-t border-border">
          <span className="text-foreground">Note.</span> {prior.notes}
        </p>
      )}
    </section>
  );
}

function Stat({ icon, label, value, hint, valueClassName }: { icon: React.ReactNode; label: string; value: string; hint?: string; valueClassName?: string }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground inline-flex items-center gap-1">{icon}{label}</p>
      <p className={cn("mt-1.5 leading-none", valueClassName)}>{value}</p>
      {hint && (<p className="font-mono text-[10px] text-muted-foreground mt-1">{hint}</p>)}
    </div>
  );
}
