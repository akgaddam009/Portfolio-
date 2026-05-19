import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getCase } from "@/data/mockData";
import { getInboxItem } from "@/data/inboxMockData";
import { CaseWorkspace } from "@/components/proposal/CaseWorkspace";
import { CPAVerificationView } from "@/components/cpa/CPAVerificationView";
import { MobileWorkspaceIntercept } from "@/components/proposal/MobileWorkspaceIntercept";
import { PersonaSwitcher } from "@/components/auth/PersonaSwitcher";
import { getCurrentPersona } from "@/lib/persona-session";
import { getCaseOverrides, applyOverrideToItem } from "@/lib/case-state";

/* Case route — chooses the right surface per persona and effective state. */

export default async function CasePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const persona = await getCurrentPersona();
  if (!persona) redirect("/");

  const { id } = await params;
  const overrides = await getCaseOverrides();
  const baseItem = getInboxItem(id);

  if (!baseItem) {
    const cs = getCase(id);
    if (!cs) notFound();
    return renderWorkspace(cs, persona);
  }

  const item = applyOverrideToItem(baseItem, overrides);
  const fullCase = getCase(id);

  if (persona.id === "cpa" && item.status === "draft") {
    return <CPAVerificationView item={item} persona={persona} />;
  }
  if (persona.id === "approver" && item.status === "approver-pending") {
    redirect(`/case/${id}/brief`);
  }
  if (item.status === "approved") {
    return <ApprovedView item={item} override={overrides[id.toLowerCase()]} />;
  }
  if (persona.id === "underwriter" && item.status === "underwriter-reviewing" && fullCase) {
    return renderWorkspace(fullCase, persona);
  }
  return <MovedStub item={item} personaName={persona.name} personaRole={persona.role} />;
}

function renderWorkspace(cs: ReturnType<typeof getCase>, persona: NonNullable<Awaited<ReturnType<typeof getCurrentPersona>>>) {
  if (!cs) return null;
  return (
    <>
      <MobileWorkspaceIntercept caseData={cs} />
      <main className="hidden lg:block min-h-screen bg-background py-5 px-4 sm:px-5 lg:px-6">
        <div className="max-w-7xl mx-auto">
          <CaseWorkspace caseData={cs} underwriterName={persona.name} />
          <div className="fixed top-3 right-4 z-10">
            <div className="bg-card border border-border rounded-md px-2 py-1 shadow-sm">
              <PersonaSwitcher persona={persona} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

function ApprovedView({ item, override }: { item: ReturnType<typeof getInboxItem>; override: { decidedBy?: string; decidedAt?: string } | undefined }) {
  if (!item) return null;
  const decidedBy = override?.decidedBy ?? item.priorApproval?.approverName ?? "Sukesh P";
  const decidedAt = override?.decidedAt
    ? new Date(override.decidedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
    : item.priorApproval?.approvedDateDisplay ?? "—";
  return (
    <main className="min-h-screen bg-background py-12 px-5 sm:px-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/inbox" className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground hover:text-foreground transition-colors mb-10">
          <ArrowLeft className="h-3 w-3" aria-hidden strokeWidth={1.75} />
          Back to enquiries
        </Link>
        <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-signal-positive">Approved</p>
        <h1 className="font-serif text-[48px] leading-tight tracking-tight text-foreground mt-3">{item.vendor.name}</h1>
        <p className="font-sans text-[15px] text-muted-foreground mt-2">{item.vendor.constitution} · {item.vendor.bu} · {item.vendor.region}</p>
        <div className="mt-10 bg-card border border-border rounded-xl p-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">Final decision</p>
          <p className="font-serif text-[40px] leading-none text-foreground mt-3">{item.recommendedDisplay !== "—" ? item.recommendedDisplay : item.requestedDisplay}</p>
          <p className="font-sans text-[14px] text-muted-foreground mt-3">Approved by <span className="text-foreground">{decidedBy}</span> on <span className="text-foreground">{decidedAt}</span>.</p>
        </div>
      </div>
    </main>
  );
}

function MovedStub({ item, personaName, personaRole }: { item: ReturnType<typeof getInboxItem>; personaName: string; personaRole: string }) {
  if (!item) return null;
  const whereNow = whereDescription(item.status, item.assignedTo);
  return (
    <main className="min-h-screen bg-background py-12 px-5 sm:px-8">
      <div className="max-w-xl mx-auto">
        <Link href="/inbox" className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground hover:text-foreground transition-colors mb-10">
          <ArrowLeft className="h-3 w-3" aria-hidden strokeWidth={1.75} />
          Back to enquiries
        </Link>
        <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground">{item.id.toUpperCase()}</p>
        <h1 className="font-serif text-[40px] leading-tight tracking-tight text-foreground mt-2">{item.vendor.name}</h1>
        <div className="mt-8 bg-secondary/40 border border-border rounded-lg p-5">
          <p className="font-sans text-[15px] leading-relaxed text-foreground">
            <span className="font-medium">{personaName},</span> this case has moved past the{" "}
            <span className="font-medium">{personaRole}</span> step. {whereNow}
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground mt-4">Switch personas using the chip in the corner to follow it.</p>
        </div>
      </div>
    </main>
  );
}

function whereDescription(status: string, assignedTo: string | undefined): string {
  switch (status) {
    case "draft": return "It's sitting with the CPA for document verification.";
    case "underwriter-reviewing": return `It's now with ${assignedTo ?? "the underwriter"} for review.`;
    case "approver-pending": return `It's now with ${assignedTo ?? "the approver"} for sign-off.`;
    case "approved": return "It's been approved.";
    case "rejected": return "It was rejected.";
    default: return "It's no longer in your queue.";
  }
}
