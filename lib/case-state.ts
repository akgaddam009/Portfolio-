import { cookies } from "next/headers";
import type { CaseStatus, InboxItem } from "@/types/credit";

const COOKIE_NAME = "uw-case-overrides";
const ONE_WEEK = 60 * 60 * 24 * 7;

export type CaseOverride = {
  status: CaseStatus;
  assignedTo?: string;
  decidedBy?: string;
  decidedAt?: string;
  revisionNote?: string;
};

export type CaseOverrides = Record<string, CaseOverride>;

export async function getCaseOverrides(): Promise<CaseOverrides> {
  const store = await cookies();
  const raw = store.get(COOKIE_NAME)?.value;
  if (!raw) return {};
  try { const parsed = JSON.parse(raw); return typeof parsed === "object" && parsed !== null ? parsed : {}; } catch { return {}; }
}

async function writeOverrides(overrides: CaseOverrides): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, JSON.stringify(overrides), {
    httpOnly: true, sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/", maxAge: ONE_WEEK,
  });
}

export async function setCaseOverride(id: string, patch: CaseOverride): Promise<void> {
  const overrides = await getCaseOverrides();
  overrides[id.toLowerCase()] = { ...overrides[id.toLowerCase()], ...patch };
  await writeOverrides(overrides);
}

export async function clearOverrides(): Promise<void> { await writeOverrides({}); }

export function applyOverrideToItem(item: InboxItem, overrides: CaseOverrides): InboxItem {
  const o = overrides[item.id.toLowerCase()];
  if (!o) return item;
  return { ...item, status: o.status, assignedTo: o.assignedTo ?? item.assignedTo };
}

export function effectiveStatus(baseStatus: CaseStatus, override: CaseOverride | undefined): CaseStatus {
  return override?.status ?? baseStatus;
}
