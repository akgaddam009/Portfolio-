import type { InboxItem } from "@/types/credit";

export const inboxItems: InboxItem[] = [
  { id: "cr-21368", vendor: { name: "Krishna Engineering", profile: "Manufacturer · pvt ltd · 8% margin", constitution: "Pvt Ltd", bu: "Industrial", region: "North" }, requestedDisplay: "₹3.2 Cr", recommendedDisplay: "—", confidence: "low", status: "draft", waitingHours: 1, assignedTo: "Manoj", submittedBy: "Yash", submittedAtDisplay: "18 May 2026", requestType: "new-vendor", priorReviewCount: 0, temperature: "hot" },
  { id: "cr-21381", vendor: { name: "Gopal Industries", profile: "Trader · proprietorship · 5% margin", constitution: "Proprietorship", bu: "Ecosystem", region: "West" }, requestedDisplay: "₹0.9 Cr", recommendedDisplay: "—", confidence: "low", status: "draft", waitingHours: 4, assignedTo: "Manoj", submittedBy: "Vighesh", submittedAtDisplay: "18 May 2026", requestType: "new-vendor", priorReviewCount: 0, temperature: "warm" },
  { id: "cr-21391", vendor: { name: "Sahu Trading Co.", profile: "Trader · proprietorship · 3.5% margin", constitution: "Proprietorship", bu: "Ecosystem", region: "East" }, requestedDisplay: "₹1.5 Cr", recommendedDisplay: "—", confidence: "low", status: "draft", waitingHours: 8, assignedTo: "Manoj", submittedBy: "Yash", submittedAtDisplay: "17 May 2026", requestType: "new-vendor", priorReviewCount: 0, temperature: "warm" },
  { id: "cr-21324", vendor: { name: "Janta Engineering Works", profile: "Trader · partnership · thin margin", constitution: "Partnership", bu: "Ecosystem", region: "South" }, requestedDisplay: "₹2.0 Cr", recommendedDisplay: "₹1.5 Cr", confidence: "medium", status: "underwriter-reviewing", waitingHours: 6, assignedTo: "Kushagra", submittedBy: "Yash", submittedAtDisplay: "17 May 2026", requestType: "new-vendor", priorReviewCount: 0, temperature: "warm" },
  { id: "cr-21342", vendor: { name: "Sapna Industries", profile: "Trader · proprietorship · 3.1% margin", constitution: "Proprietorship", bu: "Ecosystem", region: "South" }, requestedDisplay: "₹1.2 Cr", recommendedDisplay: "₹0.8 Cr", confidence: "low", status: "underwriter-reviewing", waitingHours: 2, assignedTo: "Kushagra", submittedBy: "Yash", submittedAtDisplay: "18 May 2026", requestType: "new-vendor", priorReviewCount: 0, temperature: "warm" },
  { id: "cr-21356", vendor: { name: "Saraswathi Steels", profile: "Trader · partnership · thin margin", constitution: "Partnership", bu: "Ecosystem", region: "West" }, requestedDisplay: "₹3.5 Cr", recommendedDisplay: "₹3.0 Cr", confidence: "high", status: "underwriter-reviewing", waitingHours: 18, assignedTo: "Kushagra", submittedBy: "Yash", submittedAtDisplay: "16 May 2026", requestType: "limit-increase", priorReviewCount: 3, priorApproval: { approvedAmountDisplay: "₹2.2 Cr", approverName: "Sukesh P", approvedDateDisplay: "18 Sep 2025", lastReviewedDateDisplay: "18 Sep 2025", needsReassessment: true }, temperature: "hot" },
  { id: "cr-21372", vendor: { name: "Bharati Fasteners", profile: "Trader · partnership · 4.5% margin", constitution: "Partnership", bu: "Industrial", region: "North" }, requestedDisplay: "₹1.4 Cr", recommendedDisplay: "₹1.4 Cr", confidence: "high", status: "underwriter-reviewing", waitingHours: 3, assignedTo: "Kushagra", submittedBy: "Vighesh", submittedAtDisplay: "18 May 2026", requestType: "renewal", priorReviewCount: 2, priorApproval: { approvedAmountDisplay: "₹1.4 Cr", approverName: "Sukesh P", approvedDateDisplay: "20 Dec 2024", lastReviewedDateDisplay: "20 Dec 2024", needsReassessment: false }, temperature: "warm" },
  { id: "cr-21331", vendor: { name: "Vishal Components Pvt Ltd", profile: "Manufacturer · pvt ltd · 12% margin", constitution: "Pvt Ltd", bu: "Industrial", region: "South" }, requestedDisplay: "₹4.5 Cr", recommendedDisplay: "₹4.2 Cr", confidence: "high", status: "approver-pending", waitingHours: 22, assignedTo: "Sukesh", submittedBy: "Yash", submittedAtDisplay: "16 May 2026", requestType: "renewal", priorReviewCount: 4, priorApproval: { approvedAmountDisplay: "₹4.0 Cr", approverName: "Sukesh P", approvedDateDisplay: "15 Nov 2024", lastReviewedDateDisplay: "15 Nov 2024", needsReassessment: false }, temperature: "warm" },
  { id: "cr-21361", vendor: { name: "Apex Fasteners LLP", profile: "Manufacturer · LLP · 9% margin", constitution: "LLP", bu: "Ecosystem", region: "West" }, requestedDisplay: "₹2.8 Cr", recommendedDisplay: "₹2.5 Cr", confidence: "medium", status: "approver-pending", waitingHours: 5, assignedTo: "Sukesh", submittedBy: "Yash", submittedAtDisplay: "17 May 2026", requestType: "new-vendor", priorReviewCount: 0, temperature: "hot" },
  { id: "cr-21384", vendor: { name: "Nirmala Metals", profile: "Trader · partnership · 6% margin", constitution: "Partnership", bu: "Industrial", region: "East" }, requestedDisplay: "₹0.8 Cr", recommendedDisplay: "₹0.8 Cr", confidence: "high", status: "approver-pending", waitingHours: 12, assignedTo: "Sukesh", submittedBy: "Yash", submittedAtDisplay: "17 May 2026", requestType: "fresh-review", priorReviewCount: 2, priorApproval: { approvedAmountDisplay: "₹0.8 Cr", approverName: "Raman Kirdolia", approvedDateDisplay: "10 Feb 2025", lastReviewedDateDisplay: "10 Feb 2025", needsReassessment: false }, temperature: "cold" },
  { id: "cr-21210", vendor: { name: "Surya Castings", profile: "Manufacturer · pvt ltd · 10% margin", constitution: "Pvt Ltd", bu: "Industrial", region: "North" }, requestedDisplay: "₹2.0 Cr", recommendedDisplay: "₹1.8 Cr", confidence: "high", status: "approved", waitingHours: 0, assignedTo: "Sukesh", submittedBy: "Yash", submittedAtDisplay: "02 May 2026", requestType: "renewal", priorReviewCount: 5, priorApproval: { approvedAmountDisplay: "₹1.8 Cr", approverName: "Sukesh P", approvedDateDisplay: "14 May 2026", lastReviewedDateDisplay: "14 May 2026", needsReassessment: false }, temperature: "warm" },
  { id: "cr-21195", vendor: { name: "Maple Forgings", profile: "Manufacturer · LLP · 7.5% margin", constitution: "LLP", bu: "Ecosystem", region: "West" }, requestedDisplay: "₹1.5 Cr", recommendedDisplay: "₹1.3 Cr", confidence: "high", status: "approved", waitingHours: 0, assignedTo: "Sukesh", submittedBy: "Vighesh", submittedAtDisplay: "28 Apr 2026", requestType: "new-vendor", priorReviewCount: 0, priorApproval: { approvedAmountDisplay: "₹1.3 Cr", approverName: "Sukesh P", approvedDateDisplay: "12 May 2026", lastReviewedDateDisplay: "12 May 2026", needsReassessment: false }, temperature: "warm" },
];

export function getInboxItem(id: string): InboxItem | null {
  return inboxItems.find(item => item.id === id) ?? null;
}

export function inboxForPersona(
  persona: "underwriter" | "approver" | "cpa" | "sales",
  items: InboxItem[] = inboxItems,
): InboxItem[] {
  switch (persona) {
    case "underwriter": return items.filter(i => (i.assignedTo === "Kushagra" && i.status === "underwriter-reviewing") || i.status === "approved");
    case "approver":    return items.filter(i => (i.assignedTo === "Sukesh" && i.status === "approver-pending") || i.status === "approved");
    case "cpa":         return items.filter(i => (i.assignedTo === "Manoj" && i.status === "draft") || i.status === "approved");
    case "sales":       return items.filter(i => i.submittedBy === "Yash");
  }
}

export type QuickFilterId = "all" | "pending-verification" | "on-hold" | "approved" | "unassigned" | "revision-request";
export type QuickFilter = { id: QuickFilterId; label: string };

export function filtersForPersona(persona: "underwriter" | "approver" | "cpa" | "sales"): QuickFilter[] {
  const base: QuickFilter[] = [
    { id: "all", label: "All" },
    { id: "pending-verification", label: "Pending Verification" },
    { id: "on-hold", label: "On Hold" },
    { id: "approved", label: "Approved" },
  ];
  if (persona === "sales") return [...base, { id: "revision-request", label: "Revision Request" }];
  return [...base, { id: "unassigned", label: "Unassigned" }];
}

export function applyQuickFilter(items: InboxItem[], filter: QuickFilterId): InboxItem[] {
  switch (filter) {
    case "all":                  return items;
    case "pending-verification": return items.filter(i => i.status === "draft");
    case "approved":             return items.filter(i => i.status === "approved");
    case "unassigned":           return items.filter(i => !i.assignedTo);
    case "on-hold":              return [];
    case "revision-request":     return [];
  }
}
