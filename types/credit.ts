/* Shared credit-domain types for Underwrite. */

export type Severity = "blocking" | "caution" | "informational";
export type ConfidenceLevel = "high" | "medium" | "low";

export type Provenance = "ai-drafted" | "ai-computed" | "ai-suggested" | "manual";

export type Citation = {
  id: string; label: string; document: string; page?: number; detail: string;
};

export type Confidence = { level: ConfidenceLevel; basis: string };

export type Reason = { id: string; text: string; citations: Citation[] };

export type RiskFlag = { id: string; severity: Severity; title: string; body: string; source?: Citation };

export type ComparableDeal = {
  id: string; vendorName: string; profile: string;
  requestedDisplay: string; recommendedDisplay: string;
  outcome: "approved" | "rejected" | "withdrawn";
  whenMonthsAgo: number; approver: string;
};

export type Recommendation = {
  requestedAmountInr: number; requestedDisplay: string;
  recommendedAmountInr: number; recommendedDisplay: string;
  confidence: Confidence; reasons: Reason[];
  flags: RiskFlag[]; comparables: ComparableDeal[];
};

export type CaseBackground = {
  paragraphs: string[]; provenance: Provenance;
  draftedAt: string; lastEditedBy?: string;
};

export type KeyMetric = { id: string; label: string; value: string; delta?: string; citation?: Citation };

export type AnalysisSubSection = {
  id: "bank" | "utilization" | "gstr";
  title: string; paragraphs: string[]; confidence: Confidence;
};

export type PDStructuredNotes = { comforts: string[]; discomforts: string[]; recommendation: string };

export type PDDetails = { suggestedQuestions: string[]; rawNotes?: string; structured?: PDStructuredNotes };

export type TimelineActor = "ai" | "underwriter" | "approver" | "cpa" | "system";

export type OverrideReason = "customer-context-not-in-docs" | "additional-verification-data" | "policy-cap-applied" | "calibration-against-precedent" | "other";

export type TimelineEvent = {
  id: string; timestamp: string; actor: TimelineActor; actorName?: string;
  action: string; detail?: string; overrideReason?: OverrideReason;
  meta?: Record<string, string | number>;
};

export type CaseStatus = "draft" | "cpa-verified" | "underwriter-reviewing" | "approver-pending" | "approved" | "rejected";

export type ApproverDecision = "approved" | "returned" | "escalated";

export type RequestType = "new-vendor" | "limit-increase" | "renewal" | "fresh-review";

export type PaymentBehavior = "clean" | "minor-delays" | "concerns";

export type PriorRelationship = {
  firstApprovedDate: string;
  lastReviewedAt: string;
  lastReviewedBy: string;
  currentLimitDisplay: string;
  currentTenureDays: number;
  paymentBehavior: PaymentBehavior;
  ordersCompleted: number;
  averageUtilization: string;
  notes?: string;
};

export type CreditCase = {
  id: string;
  vendor: { name: string; profile: string; sector: string; location: string; gstin: string };
  requestedAmountInr: number; requestedDisplay: string; tenureMonths: number;
  status: CaseStatus; assignedTo?: string;
  submittedBy: string; submittedAt: string;
  requestType: RequestType;
  priorRelationship: PriorRelationship | null;
  caseBackground: CaseBackground;
  keyPoints: KeyMetric[];
  analysis: AnalysisSubSection[];
  pdDetails: PDDetails;
  recommendation: Recommendation;
  timeline: TimelineEvent[];
};

export type LeadTemperature = "hot" | "warm" | "cold";

export type InboxPriorApproval = {
  approvedAmountDisplay: string; approverName: string;
  approvedDateDisplay: string; lastReviewedDateDisplay: string;
  needsReassessment: boolean;
};

export type InboxItem = {
  id: string;
  vendor: { name: string; profile: string; constitution: string; bu: string; region: string };
  requestedDisplay: string; recommendedDisplay: string;
  confidence: ConfidenceLevel; status: CaseStatus;
  waitingHours: number; assignedTo?: string;
  submittedBy: string; submittedAtDisplay: string;
  requestType: RequestType; priorReviewCount: number;
  priorApproval?: InboxPriorApproval; temperature: LeadTemperature;
};
