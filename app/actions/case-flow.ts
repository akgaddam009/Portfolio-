"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { setCaseOverride } from "@/lib/case-state";
import { getCurrentPersona } from "@/lib/persona-session";

/* Workflow mutations — the actions personas take that move a case
   from one stage to the next. Each writes a CaseOverride into the
   demo state cookie and revalidates the inbox so the queue updates
   immediately on persona switch.

   Authorization: each action verifies the persona has permission
   to take it (CPA forwards; Underwriter sends; Approver decides).
   In production this is a Postgres row + Drizzle RLS — here we
   short-circuit at the action boundary. */

export async function cpaForwardToUnderwriter(caseId: string) {
  const persona = await getCurrentPersona();
  if (!persona || persona.id !== "cpa") {
    throw new Error("Only CPA can forward to underwriter.");
  }
  await setCaseOverride(caseId, {
    status: "underwriter-reviewing",
    assignedTo: "Kushagra",
  });
  revalidatePath("/inbox");
  revalidatePath(`/case/${caseId}`);
  redirect("/inbox?forwarded=" + caseId);
}

export async function underwriterSendToApprover(caseId: string) {
  const persona = await getCurrentPersona();
  if (!persona || persona.id !== "underwriter") {
    throw new Error("Only underwriter can send to approver.");
  }
  await setCaseOverride(caseId, {
    status: "approver-pending",
    assignedTo: "Sukesh",
  });
  revalidatePath("/inbox");
  revalidatePath(`/case/${caseId}`);
  redirect("/inbox?sent=" + caseId);
}

export async function approverApprove(caseId: string) {
  const persona = await getCurrentPersona();
  if (!persona || persona.id !== "approver") {
    throw new Error("Only approver can approve.");
  }
  await setCaseOverride(caseId, {
    status: "approved",
    assignedTo: undefined,
    decidedBy: persona.name,
    decidedAt: new Date().toISOString(),
  });
  revalidatePath("/inbox");
  revalidatePath(`/case/${caseId}`);
  redirect("/inbox?approved=" + caseId);
}

export async function approverReturn(caseId: string, note: string = "") {
  const persona = await getCurrentPersona();
  if (!persona || persona.id !== "approver") {
    throw new Error("Only approver can return.");
  }
  await setCaseOverride(caseId, {
    status: "underwriter-reviewing",
    assignedTo: "Kushagra",
    revisionNote: note,
  });
  revalidatePath("/inbox");
  revalidatePath(`/case/${caseId}`);
  redirect("/inbox?returned=" + caseId);
}
