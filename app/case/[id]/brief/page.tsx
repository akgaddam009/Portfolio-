import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { getCase } from "@/data/mockData";
import { ApproverBrief } from "@/components/proposal/ApproverBrief";
import { getCurrentPersona } from "@/lib/persona-session";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const cs = getCase(id);
  if (!cs) return { title: "Brief — Underwrite" };
  return {
    title: `${cs.vendor.name} · Approver brief`,
    description: `${cs.recommendation.recommendedDisplay} recommended on a ${cs.requestedDisplay} request. ${cs.recommendation.confidence.level} confidence.`,
  };
}

export default async function BriefPage({ params }: { params: Promise<{ id: string }> }) {
  const persona = await getCurrentPersona();
  if (!persona) redirect("/");
  const { id } = await params;
  const cs = getCase(id);
  if (!cs) notFound();
  return <ApproverBrief caseData={cs} approverName={persona.name} />;
}
