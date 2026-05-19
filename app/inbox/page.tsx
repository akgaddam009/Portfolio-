import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { applyQuickFilter, filtersForPersona, inboxForPersona, inboxItems, type QuickFilterId } from "@/data/inboxMockData";
import type { InboxItem } from "@/types/credit";
import { getCurrentPersona } from "@/lib/persona-session";
import { applyOverrideToItem, getCaseOverrides } from "@/lib/case-state";
import { InboxDashboardClient } from "./InboxDashboardClient";
import type { PipelineSegment } from "@/components/dashboard/PipelineChart";

export const metadata: Metadata = {
  title: "Credit Enquiries — Underwrite",
  description: "Pending credit requests, queued for review.",
};

const VALID_FILTERS: QuickFilterId[] = ["all", "pending-verification", "on-hold", "approved", "unassigned", "revision-request"];

export default async function InboxPage({ searchParams }: { searchParams: Promise<{ filter?: string }> }) {
  const persona = await getCurrentPersona();
  if (!persona) redirect("/");

  const sp = await searchParams;
  const requested = (sp?.filter ?? "all") as QuickFilterId;
  const active: QuickFilterId = VALID_FILTERS.includes(requested) ? requested : "all";

  const overrides = await getCaseOverrides();
  const effectiveItems = inboxItems.map((item) => applyOverrideToItem(item, overrides));
  const allForPersona = inboxForPersona(persona.id, effectiveItems);
  const filters = filtersForPersona(persona.id);
  const visible = applyQuickFilter(allForPersona, active);

  const counts: Record<QuickFilterId, number> = {
    all: allForPersona.length,
    "pending-verification": applyQuickFilter(allForPersona, "pending-verification").length,
    "on-hold": applyQuickFilter(allForPersona, "on-hold").length,
    approved: applyQuickFilter(allForPersona, "approved").length,
    unassigned: applyQuickFilter(allForPersona, "unassigned").length,
    "revision-request": applyQuickFilter(allForPersona, "revision-request").length,
  };

  const pipelineSegments = buildPipelineSegments(effectiveItems);
  const kpis = buildKpis(effectiveItems, persona.id);

  return (
    <InboxDashboardClient persona={persona} filters={filters} counts={counts} visible={visible} effectiveItems={effectiveItems} pipelineSegments={pipelineSegments} kpis={kpis} active={active} />
  );
}

function buildPipelineSegments(items: InboxItem[]): PipelineSegment[] {
  const counts = {
    draft: items.filter((i) => i.status === "draft").length,
    review: items.filter((i) => i.status === "underwriter-reviewing").length,
    pending: items.filter((i) => i.status === "approver-pending").length,
    approved: items.filter((i) => i.status === "approved").length,
  };
  return [
    { key: "draft",     label: "Pending verification", count: counts.draft,    color: "hsl(245, 50%, 55%)" },
    { key: "review",    label: "Underwriter review",   count: counts.review,   color: "hsl(188, 72%, 38%)" },
    { key: "pending",   label: "Approver pending",     count: counts.pending,  color: "hsl(25, 80%, 52%)"  },
    { key: "approved",  label: "Approved",             count: counts.approved, color: "hsl(160, 55%, 40%)" },
  ];
}

function buildKpis(items: InboxItem[], personaId: "underwriter" | "approver" | "cpa" | "sales") {
  const active = items.filter((i) => i.status !== "approved" && i.status !== "rejected").length;
  const pending = items.filter((i) => i.status === "draft").length;
  const approvedWeek = items.filter((i) => i.status === "approved").length;
  const totalApprovedDisplay = "₹2.8 Cr";
  if (personaId === "sales") {
    return [
      { title: "In pipeline",            value: active,                color: "#3F3FB3", iconKey: "clock" as const,   subtitle: "Your submissions" },
      { title: "Awaiting verification",  value: pending,               color: "#C97A11", iconKey: "warning" as const, subtitle: "With CPA" },
      { title: "Approved",               value: approvedWeek,          color: "#1F8A4E", iconKey: "check" as const,   delta: "+1",   subtitle: "This week" },
      { title: "Approved value",         value: totalApprovedDisplay,  color: "#0F766E", iconKey: "rise" as const,    delta: "+18%", subtitle: "This month" },
    ];
  }
  return [
    { title: "Active cases",           value: active,                color: "#3F3FB3", iconKey: "clock" as const,   subtitle: "Across all stages" },
    { title: "Pending verification",   value: pending,               color: "#C97A11", iconKey: "warning" as const, subtitle: "Awaiting CPA" },
    { title: "Approved this week",     value: approvedWeek,          color: "#1F8A4E", iconKey: "check" as const,   delta: "+2",   subtitle: "vs last week" },
    { title: "Approved volume",        value: totalApprovedDisplay,  color: "#0F766E", iconKey: "rise" as const,    delta: "+18%", subtitle: "This month" },
  ];
}
