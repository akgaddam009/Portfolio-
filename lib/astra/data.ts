/* ─── Astra mock data ──────────────────────────────────────
   Powers the live prototype at /astra/p1 and /astra/p2.
   The shape mirrors what an early-stage Astra product would carry:
   contracts (with extracted fields), workflows (with conditions
   and approval chains). Names and amounts are realistic mock
   values, not placeholder lorem-ipsum. */

export type ContractStatus =
  | "draft"
  | "in-review"
  | "sent-to-legal"
  | "approved"
  | "returned";

export type FieldStatus = "confident" | "needs-review" | "missing";

export type ExtractedField = {
  id: string;
  label: string;
  value: string;
  status: FieldStatus;
  /** When status === "needs-review", the AI's confidence note */
  note?: string;
  /** Group label for sectioning the review pane */
  group: "Vendor" | "Terms" | "Financial" | "Legal" | "Renewal";
  /** Whether this field has legal-emphasis (highlighted in legal review screen) */
  legalEmphasis?: boolean;
};

export type Contract = {
  id: string;
  name: string;
  vendor: string;
  type: "Software / SaaS" | "Master Services" | "Legal / NDA" | "Renewal" | "SLA / Services";
  value: string;
  status: ContractStatus;
  owner: { initials: string; name: string };
  /** Total fields extracted vs unresolved */
  fieldsTotal: number;
  fieldsUnresolved: number;
  /** Sub-status text shown in the table */
  subText?: string;
  /** Routing path label */
  routing?: string;
  /** When status === "returned", the reason from legal */
  returnReason?: string;
  /** Approval step (e.g., "Step 2 of 3") */
  approvalStep?: string;
};

/* ── The contracts list shown on the procurement landing ── */
export const CONTRACTS: Contract[] = [
  {
    id: "zoho-hr",
    name: "Zoho HR Suite",
    vendor: "Zoho Corp.",
    type: "Software / SaaS",
    value: "₹12,00,000",
    status: "returned",
    owner: { initials: "AR", name: "Ananya R." },
    fieldsTotal: 38,
    fieldsUnresolved: 1,
    subText: "↩ Returned by Legal · action needed",
    returnReason: "Liability cap clause needs correction.",
  },
  {
    id: "infosys-msa",
    name: "Infosys MSA 2024",
    vendor: "Infosys Ltd.",
    type: "Master Services",
    value: "₹48,00,000",
    status: "in-review",
    owner: { initials: "AR", name: "Ananya R." },
    fieldsTotal: 38,
    fieldsUnresolved: 2,
    subText: "35/38 fields · 2 unresolved",
  },
  {
    id: "aws-enterprise",
    name: "AWS Enterprise 2025",
    vendor: "Amazon Web Services",
    type: "Software / SaaS",
    value: "$2,40,000",
    status: "sent-to-legal",
    owner: { initials: "AR", name: "Ananya R." },
    fieldsTotal: 36,
    fieldsUnresolved: 0,
    subText: "Sent to Priya M. · Step 2 of 3",
    approvalStep: "Step 2 of 3",
  },
  {
    id: "wipro-sla",
    name: "Wipro SLA Agreement",
    vendor: "Wipro Ltd.",
    type: "SLA / Services",
    value: "₹22,00,000",
    status: "draft",
    owner: { initials: "KM", name: "Kiran M." },
    fieldsTotal: 0,
    fieldsUnresolved: 0,
    subText: "Pending upload",
  },
  {
    id: "salesforce-renewal",
    name: "Salesforce CRM Renewal",
    vendor: "Salesforce.com",
    type: "Software / SaaS",
    value: "$1,80,000",
    status: "approved",
    owner: { initials: "AR", name: "Ananya R." },
    fieldsTotal: 34,
    fieldsUnresolved: 0,
    subText: "Approved by all parties",
  },
];

/* ── Extracted fields for the contract under review ── */
export const INFOSYS_FIELDS: ExtractedField[] = [
  // Vendor
  { id: "f1", group: "Vendor", label: "Vendor name",          value: "Infosys Limited",                      status: "confident" },
  { id: "f2", group: "Vendor", label: "Registered address",    value: "Electronics City, Bengaluru, 560100",  status: "confident" },
  { id: "f3", group: "Vendor", label: "GSTIN",                  value: "29AAACI4741P1ZG",                      status: "confident" },
  { id: "f4", group: "Vendor", label: "Primary contact",        value: "Rajesh Kumar (rajesh.k@infosys.com)", status: "confident" },
  // Terms
  { id: "f5", group: "Terms", label: "Effective date",          value: "1 April 2024",                          status: "confident" },
  { id: "f6", group: "Terms", label: "Initial term",            value: "24 months",                             status: "confident" },
  { id: "f7", group: "Terms", label: "Auto-renewal",            value: "12 months",                             status: "needs-review", note: "Detected language uses 'rolling 12-month' — interpret as auto-renew or read-only?", legalEmphasis: true },
  { id: "f8", group: "Terms", label: "Notice period",           value: "60 days written",                       status: "confident", legalEmphasis: true },
  // Financial
  { id: "f9",  group: "Financial", label: "Contract value",     value: "₹48,00,000 (annual)",                  status: "confident" },
  { id: "f10", group: "Financial", label: "Payment terms",      value: "Net 30",                                 status: "confident" },
  { id: "f11", group: "Financial", label: "Currency",            value: "INR",                                    status: "confident" },
  { id: "f12", group: "Financial", label: "Late-payment penalty", value: "1.5% per month",                       status: "confident" },
  // Legal — these get emphasized in the legal review screen
  { id: "f13", group: "Legal", label: "Liability cap",            value: "₹50,00,000 OR 12-month fees, whichever higher", status: "needs-review", note: "AI flagged 'whichever higher' — verify intent vs typical 'whichever lower' phrasing.", legalEmphasis: true },
  { id: "f14", group: "Legal", label: "Indemnity scope",          value: "Mutual; carve-outs for IP infringement", status: "confident", legalEmphasis: true },
  { id: "f15", group: "Legal", label: "Governing law",            value: "Karnataka, India",                       status: "confident", legalEmphasis: true },
  { id: "f16", group: "Legal", label: "Dispute resolution",       value: "Arbitration — single arbitrator, Bengaluru", status: "confident", legalEmphasis: true },
  { id: "f17", group: "Legal", label: "Confidentiality term",     value: "",                                       status: "missing", note: "Not detected in document — confirm with vendor.", legalEmphasis: true },
  // Renewal
  { id: "f18", group: "Renewal", label: "Renewal date",          value: "1 April 2026",                           status: "confident" },
  { id: "f19", group: "Renewal", label: "Price escalation",      value: "5% YoY (CPI-linked)",                    status: "confident" },
];

/* ── Approval workflows ── */
export type ApprovalStep = {
  id: string;
  approver: string;
  role: string;
  optional?: boolean;
  notify?: "email" | "slack" | "both";
};

export type WorkflowCondition = {
  id: string;
  type: "contract-type" | "amount" | "vendor-risk" | "department";
  operator: string;
  value: string;
};

export type Workflow = {
  id: string;
  name: string;
  category: "Software" | "Services" | "Legal" | "Renewals" | "Other";
  active: boolean;
  conditions: WorkflowCondition[];
  steps: ApprovalStep[];
  /** Plain-language preview of the rule */
  preview: string;
  /** Whether this workflow has unresolved conflicts with another */
  conflict?: string;
  /** Number of contracts currently in flight using this workflow */
  inFlight?: number;
};

export const WORKFLOWS: Workflow[] = [
  {
    id: "wf-soft-small",
    name: "Software contracts under ₹50L",
    category: "Software",
    active: true,
    conditions: [
      { id: "c1", type: "contract-type", operator: "is", value: "Software / SaaS" },
      { id: "c2", type: "amount",        operator: "<",  value: "50,00,000" },
    ],
    steps: [
      { id: "s1", approver: "Direct manager", role: "Reporting manager", notify: "email" },
    ],
    preview: "Software contracts under ₹50L go to direct manager only.",
    inFlight: 3,
  },
  {
    id: "wf-soft-large",
    name: "Software contracts over ₹50L",
    category: "Software",
    active: true,
    conditions: [
      { id: "c1", type: "contract-type", operator: "is", value: "Software / SaaS" },
      { id: "c2", type: "amount",        operator: ">", value: "50,00,000" },
    ],
    steps: [
      { id: "s1", approver: "VP Procurement", role: "VP",  notify: "both" },
      { id: "s2", approver: "CFO",            role: "CFO", notify: "email" },
    ],
    preview: "Software contracts over ₹50L go to VP Procurement, then CFO.",
    inFlight: 1,
  },
  {
    id: "wf-legal-nda",
    name: "Legal & NDA review",
    category: "Legal",
    active: true,
    conditions: [
      { id: "c1", type: "contract-type", operator: "is", value: "Legal / NDA" },
    ],
    steps: [
      { id: "s1", approver: "Legal team",  role: "Legal review", notify: "email" },
      { id: "s2", approver: "VP Legal",     role: "VP Legal",     notify: "email" },
    ],
    preview: "All NDAs and legal-only contracts route through Legal team, then VP Legal.",
  },
  {
    id: "wf-renewal-auto",
    name: "Renewals — auto-approve if unchanged",
    category: "Renewals",
    active: true,
    conditions: [
      { id: "c1", type: "contract-type", operator: "is", value: "Renewal" },
    ],
    steps: [
      { id: "s1", approver: "Auto-approve", role: "System", notify: "email", optional: false },
    ],
    preview: "Renewals with unchanged terms auto-approve. Changed terms route to the original chain.",
    inFlight: 5,
  },
  {
    id: "wf-msa-large",
    name: "Master Services Agreements",
    category: "Services",
    active: true,
    conditions: [
      { id: "c1", type: "contract-type", operator: "is", value: "Master Services" },
      { id: "c2", type: "amount",        operator: ">", value: "1,00,00,000" },
    ],
    steps: [
      { id: "s1", approver: "Department head",    role: "Dept lead",       notify: "email" },
      { id: "s2", approver: "VP Procurement",     role: "VP Procurement",  notify: "both" },
      { id: "s3", approver: "CFO",                 role: "CFO",             notify: "email" },
      { id: "s4", approver: "CEO",                 role: "CEO",             notify: "email", optional: true },
    ],
    preview: "MSAs over ₹1Cr go through dept head → VP Procurement → CFO. CEO is optional.",
    conflict: "Overlaps with 'Software contracts over ₹50L' for software MSAs ≥ ₹1Cr.",
    inFlight: 2,
  },
];

/* ── Legal queue (different perspective on the same contracts) ── */
export type LegalQueueItem = {
  contractId: string;
  receivedFrom: string;
  receivedAt: string;
  priority: "high" | "normal" | "low";
  flagged?: string;
};

export const LEGAL_QUEUE: LegalQueueItem[] = [
  { contractId: "aws-enterprise",  receivedFrom: "Ananya R.", receivedAt: "2 hours ago",  priority: "high",   flagged: "Indemnity scope" },
  { contractId: "infosys-msa",      receivedFrom: "Ananya R.", receivedAt: "Yesterday",   priority: "normal", flagged: "Liability cap" },
  { contractId: "salesforce-renewal", receivedFrom: "Auto-routed", receivedAt: "3 days ago", priority: "low" },
];
