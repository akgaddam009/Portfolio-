import type {
  AnalysisSubSection, CaseBackground, Citation, ComparableDeal,
  CreditCase, KeyMetric, PDDetails, Recommendation, RiskFlag, TimelineEvent,
} from "@/types/credit";

const citProbe42p4: Citation = { id: "cit-probe42-p4", label: "Probe42 · p.4", document: "Probe42 Report", page: 4, detail: "Probe42 net-worth section. Reports ₹4.2 Cr net worth as of 31-Mar-2024." };
const citFSp12: Citation = { id: "cit-fs-p12", label: "FS · p.12", document: "Financial Statement (FY24)", page: 12, detail: "Audited P&L showing turnover of ₹38.4 Cr (FY24) vs ₹32.1 Cr (FY23)." };
const citFSp18: Citation = { id: "cit-fs-p18", label: "FS · p.18", document: "Financial Statement (FY24)", page: 18, detail: "Balance sheet — total debt ₹6.8 Cr against tangible net worth ₹4.2 Cr." };
const citGSTRp3: Citation = { id: "cit-gstr-p3", label: "GSTR · p.3", document: "GSTR-3B (Apr-24 to Mar-25)", page: 3, detail: "12 months of filed returns, zero late filings. Turnover ₹41.1 Cr on calendar year." };
const citCAMp7: Citation = { id: "cit-cam-p7", label: "CAM · p.7", document: "CAM Report", page: 7, detail: "Customer concentration — top 3 buyers contribute 71% of FY24 turnover." };
const citBankp2: Citation = { id: "cit-bank-p2", label: "Citi · p.2", document: "Citi Bank Statement", page: 2, detail: "Average bank balance ₹62 L over last 6 months. Two ECS returns in Nov-24, both regularised within 48 hours." };

const caseBackground: CaseBackground = {
  provenance: "ai-drafted",
  draftedAt: "2026-05-18T08:14:00+05:30",
  paragraphs: [
    "Janta Engineering Works is a Coimbatore-based partnership firm engaged in trading and light-fabrication of industrial fasteners since 2009. The firm operates under two active partners — Mr. Rajesh Kumar Janta (founder, 64%) and Mrs. Lalita Janta (36%) — with a tenured floor team of 28. Annual turnover has grown from ₹32.1 Cr in FY23 to ₹38.4 Cr in FY24, with GST-reported turnover for the trailing 12 months at ₹41.1 Cr.",
    "The request is for an Open Credit limit of ₹2.0 Cr against a 60-day tenure, intended to support a recurring order book from three buyers in the auto-ancillary and HVAC segments. The firm has a prior working relationship with our largest BU buyer (Vendor ID V-1182, onboarded Apr-2021) with a clean payment record across 47 completed orders.",
    "Financial structure is characteristic of a thin-margin trader — EBITDA margin of 4.8%, total debt at ₹6.8 Cr against tangible net worth of ₹4.2 Cr (leverage 1.62x). Operating cycle is 47 days. Buyer concentration is elevated, with the top three customers contributing 71% of FY24 turnover.",
  ],
};

const keyPoints: KeyMetric[] = [
  { id: "kp-turnover-fy24", label: "Turnover (FY24)", value: "₹38.4 Cr", delta: "+19.6% YoY", citation: citFSp12 },
  { id: "kp-net-worth", label: "Tangible net worth", value: "₹4.2 Cr", citation: citProbe42p4 },
  { id: "kp-leverage", label: "Debt / Net worth", value: "1.62x", citation: citFSp18 },
  { id: "kp-ebitda-margin", label: "EBITDA margin", value: "4.8%", citation: citFSp12 },
  { id: "kp-operating-cycle", label: "Operating cycle", value: "47 days", citation: citFSp18 },
  { id: "kp-buyer-concentration", label: "Top-3 buyer share", value: "71%", citation: citCAMp7 },
];

const analysis: AnalysisSubSection[] = [
  {
    id: "bank", title: "Bank statement analysis",
    confidence: { level: "high", basis: "6 months of bank data, fully reconciled with FS" },
    paragraphs: [
      "Average month-end balance of ₹62 L across Citi current account; lowest month-end balance was ₹41 L (Sep-24). Day-end balances dip below ₹20 L for ~4 days/month on average, consistent with payment-cycle compression at the trader profile.",
      "Two ECS returns observed in Nov-24, both regularised within 48 hours. No cheque dishonours in the 6-month window. No round-tripping signatures.",
    ],
  },
  {
    id: "utilization", title: "Limit utilization analysis",
    confidence: { level: "medium", basis: "Limited prior-limit history with our BU; relying on Probe42 utilization summary" },
    paragraphs: [
      "Existing limits at two other lenders aggregate to ₹4.5 Cr; Probe42 reports average utilization of 78% across last 12 months. No overdrawn instances.",
      "Requested ₹2.0 Cr from us would take aggregate exposure to ₹6.5 Cr, against a tangible net worth of ₹4.2 Cr — a 1.55x cover before our limit, 1.20x cover after. Above the policy floor of 1.10x but tight.",
    ],
  },
  {
    id: "gstr", title: "GSTR consistency",
    confidence: { level: "high", basis: "12 months of filed returns, zero late filings" },
    paragraphs: [
      "GSTR-3B and GSTR-1 reconcile within ±2% over the trailing 12 months. Filing on or before the 20th in 12 of 12 months. No notices on the GSTN portal as of 16-May-2026.",
      "Turnover on GSTR (calendar) is ₹41.1 Cr vs ₹38.4 Cr on FS (fiscal) — a 7% drift, within the expected reporting-period band.",
    ],
  },
];

const comparables: ComparableDeal[] = [
  { id: "cmp-1", vendorName: "Saraswathi Steels", profile: "Trader · partnership · thin margin · auto-ancillary", requestedDisplay: "₹3.0 Cr", recommendedDisplay: "₹2.2 Cr", outcome: "approved", whenMonthsAgo: 8, approver: "Sukesh" },
  { id: "cmp-2", vendorName: "Bharati Fasteners", profile: "Trader · partnership · leverage 1.7x · HVAC adjacency", requestedDisplay: "₹1.8 Cr", recommendedDisplay: "₹1.4 Cr", outcome: "approved", whenMonthsAgo: 5, approver: "Sukesh" },
];

const flags: RiskFlag[] = [
  { id: "flag-buyer-concentration", severity: "caution", title: "Buyer concentration above 70%", body: "Top 3 buyers contribute 71% of FY24 turnover. Loss of any single relationship would compress operating cash by ~₹2.4 Cr quarterly.", source: citCAMp7 },
];

const pdDetails: PDDetails = {
  suggestedQuestions: [
    "What is your hedging strategy if the largest buyer reduces order volume by 30% next quarter?",
    "How are you funding the 47-day operating cycle today — own working capital, supplier credit, or a hidden line we don't see on Probe42?",
    "What were the two ECS returns in Nov-24 — was that a calendar issue or a genuine liquidity event?",
    "Your EBITDA margin sits at 4.8% — are you pricing in any expected commodity tailwind, or is this the steady-state?",
    "If we approved ₹1.5 Cr instead of ₹2.0 Cr, where would the gap come from operationally?",
  ],
};

const recommendation: Recommendation = {
  requestedAmountInr: 20_000_000, requestedDisplay: "₹2.0 Cr",
  recommendedAmountInr: 15_000_000, recommendedDisplay: "₹1.5 Cr",
  confidence: { level: "medium", basis: "Strong filing history; medium because of buyer concentration and tight cover after limit." },
  reasons: [
    { id: "rsn-leverage", text: "Leverage at 1.62x is within policy but the requested ₹2.0 Cr would tighten total cover to 1.20x — below the comfort band of 1.35x used in comparable approvals.", citations: [citFSp18] },
    { id: "rsn-concentration", text: "Top-3 buyer concentration at 71% suggests credit risk is correlated with three specific relationships, not diversified across the order book.", citations: [citCAMp7] },
    { id: "rsn-precedent", text: "Two recent comparable approvals (Saraswathi Steels, Bharati Fasteners) landed at 73–78% of the requested amount with similar leverage and sector profiles.", citations: [] },
  ],
  flags, comparables,
};

const timeline: TimelineEvent[] = [
  { id: "tl-1", timestamp: "2026-05-17T11:02:00+05:30", actor: "system", action: "Case created", detail: "Originated by BU Sales — Yash Khanna" },
  { id: "tl-2", timestamp: "2026-05-17T16:48:00+05:30", actor: "cpa", actorName: "Manoj", action: "CPA verified", detail: "All 4 documents present, GSTR cross-check passed" },
  { id: "tl-3", timestamp: "2026-05-18T08:14:00+05:30", actor: "ai", action: "Drafted Case Background", detail: "From entity, promoter, and project data" },
  { id: "tl-4", timestamp: "2026-05-18T08:14:00+05:30", actor: "ai", action: "Generated AI Recommendation", detail: "₹1.5 Cr, medium confidence" },
];

export const jantaEngineeringCase: CreditCase = {
  id: "CR-21324",
  vendor: { name: "Janta Engineering Works", profile: "Trader · partnership · thin margin", sector: "Industrial fasteners", location: "Coimbatore, TN", gstin: "33ABCDE1234F1Z5" },
  requestedAmountInr: 20_000_000, requestedDisplay: "₹2.0 Cr", tenureMonths: 2,
  status: "underwriter-reviewing", assignedTo: "Kushagra",
  submittedBy: "Yash", submittedAt: "2026-05-17T11:02:00+05:30",
  requestType: "new-vendor", priorRelationship: null,
  caseBackground, keyPoints, analysis, pdDetails, recommendation, timeline,
};

export const saraswathiSteelsCase: CreditCase = {
  id: "CR-21356",
  vendor: { name: "Saraswathi Steels", profile: "Trader · partnership · thin margin", sector: "Auto-ancillary", location: "Pune, MH", gstin: "27SARWA1234A1B2" },
  requestedAmountInr: 35_000_000, requestedDisplay: "₹3.5 Cr", tenureMonths: 2,
  status: "underwriter-reviewing", assignedTo: "Kushagra",
  submittedBy: "Yash", submittedAt: "2026-05-16T09:30:00+05:30",
  requestType: "limit-increase",
  priorRelationship: {
    firstApprovedDate: "2023-04-12", lastReviewedAt: "2025-09-18", lastReviewedBy: "Sukesh",
    currentLimitDisplay: "₹2.2 Cr", currentTenureDays: 60,
    paymentBehavior: "clean", ordersCompleted: 47, averageUtilization: "82%",
    notes: "Anchor vendor for the auto-ancillary BU. No payment-cycle deviation in 24 months.",
  },
  caseBackground, keyPoints, analysis, pdDetails, recommendation, timeline,
};

export const krishnaEngineeringCase: CreditCase = {
  id: "CR-21368",
  vendor: { name: "Krishna Engineering", profile: "Manufacturer · pvt ltd · 8% margin", sector: "Precision machining", location: "Pune, MH", gstin: "27KRISH9876B1Z0" },
  requestedAmountInr: 32_000_000, requestedDisplay: "₹3.2 Cr", tenureMonths: 2,
  status: "draft", assignedTo: "Manoj",
  submittedBy: "Yash", submittedAt: "2026-05-18T09:00:00+05:30",
  requestType: "new-vendor", priorRelationship: null,
  caseBackground, keyPoints, analysis, pdDetails, recommendation, timeline,
};

export const casesById: Record<string, CreditCase> = {
  "cr-21324": jantaEngineeringCase,
  "cr-21356": saraswathiSteelsCase,
  "cr-21368": krishnaEngineeringCase,
};

export function getCase(id: string): CreditCase | null {
  return casesById[id.toLowerCase()] ?? null;
}
