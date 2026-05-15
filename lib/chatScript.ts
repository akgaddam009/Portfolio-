/* Scripted Q&A tree for the Portfolio Chat. No LLM calls, zero cost.
   Authored by Arun, not generated. Edit answers directly in this file.

   Audience priority (chip order is HR + peer designer balanced per PRD):
     1. HR / Recruiter   — fast pattern match, ≤ 90 seconds total
     2. Hiring Designer  — decisions, tradeoffs, AI fluency, ~5 min
     3. Founder / Lead   — scope, outcomes, 0→1, AI-native

   Editing tips:
   - Keep answers short (1 to 3 sentences). HR scans, doesn't read.
   - Lead with numbers when possible. Recruiters pattern-match on metrics.
   - No em dashes. Use commas, colons, periods.
   - One link per node max.
   - Followups should anticipate the next question, not list a menu.
*/

/** Structured output rendered below the text bubble.
 *  - fact-grid: two-column key/value table (availability summary, career facts)
 *  - work-cards: 2×2 mini-card grid linking to case studies
 */
export type RichOutput =
  | { type: "fact-grid"; facts: { label: string; value: string }[] }
  | { type: "work-cards"; cards: { label: string; meta: string; href: string }[] };

export type ChatNode = {
  id: string;
  /** Label shown on the chip button. */
  chip: string;
  /** Bot reply text. Use \n\n for paragraph breaks. */
  answer: string;
  /** Optional CTA rendered below the answer. */
  link?: { label: string; href: string; external?: boolean };
  /** Optional structured output rendered below text + above link CTA. */
  richOutput?: RichOutput;
  /** Ids of follow-up nodes to surface as chips after this answer. */
  followups?: string[];
};

export const GREETING =
  "Quick answers about Arun's experience and work. Pick a topic.";

/** Subtitle in the chat header. Honest positioning: authored content,
 *  not generated. Per PRD disclosure recommendation. */
export const DISCLOSURE = "Written by Arun. Not an AI.";

/** Chips shown when the chat first opens. Six per PRD §4.2:
 *  - Show me strongest work
 *  - How does he work with AI
 *  - What problems does he solve
 *  - Is he available
 *  - What's his philosophy
 *  - TL;DR
 */
export const ROOT_CHIPS = [
  "start-work",
  "start-ai",
  "start-problems",
  "start-availability",
  "start-philosophy",
  "start-tldr",
];

export const NODES: Record<string, ChatNode> = {
  // ── Root entries ───────────────────────────────────────────────

  "start-work": {
    id: "start-work",
    chip: "Show me his strongest work",
    answer: "Four case studies. Open one or ask me about a specific project below.",
    richOutput: {
      type: "work-cards",
      cards: [
        { label: "Planful", meta: "Finance planning · Enterprise SaaS", href: "/work/planful-esm-tables" },
        { label: "Apple Maps", meta: "Multi-location listings · Enterprise", href: "/work/apple-business-listings" },
        { label: "FanCode", meta: "Homepage & FTUX · 50M+ users", href: "/work/fancode-homepage" },
        { label: "Astra", meta: "AI contract review · Solo build", href: "/work/astra" },
      ],
    },
    followups: ["cs-planful", "cs-apple", "cs-fancode", "cs-astra"],
  },

  "start-ai": {
    id: "start-ai",
    chip: "How does he work with AI?",
    answer:
      "Two ways. Day to day: prototyping flows in Claude Code and Figma Make to validate ideas before committing eng time. As a product surface: designing AI interaction models where the model is right 85 to 90% of the time, and the rest needs human handoff.",
    followups: ["ai-example", "ai-philosophy", "ai-tools"],
  },

  "start-problems": {
    id: "start-problems",
    chip: "What problems does he solve?",
    answer:
      "Enterprise SaaS workflows where data, decisions, and humans collide. Specifically: finance planning, multi-location enterprise tools, AI handoff design, marketplace and supply chain operations. He's drawn to dense product surfaces, not consumer brand work.",
    followups: ["problems-industries", "start-work", "start-ai"],
  },

  "start-availability": {
    id: "start-availability",
    chip: "Is he available to hire?",
    answer: "Yes. Short version below.",
    richOutput: {
      type: "fact-grid",
      facts: [
        { label: "Available", value: "Apr 2026" },
        { label: "Level", value: "Senior IC / Design Lead" },
        { label: "Location", value: "Hyderabad, India (IST)" },
        { label: "Open to", value: "Remote, hybrid" },
        { label: "Contact", value: "akgaddam02@gmail.com" },
      ],
    },
    link: { label: "Email Arun", href: "mailto:akgaddam02@gmail.com" },
    followups: ["tenure-honest", "companies-list", "contact"],
  },

  "start-philosophy": {
    id: "start-philosophy",
    chip: "What's his design philosophy?",
    answer:
      "Three lines.\n\n1. Talk to users first, design second.\n2. Cut hard, ship lean. Every screen earns its place.\n3. AI is a partner for shortening the loop, not for replacing the loop.\n\nDesign is a craft of decisions, not a craft of pixels.",
    followups: ["phil-evidence", "start-ai", "start-work"],
  },

  "start-tldr": {
    id: "start-tldr",
    chip: "TL;DR",
    answer:
      "Nine years senior product and UX design. Currently on a planned career break, available from Apr 2026. Most recent: Senior Product Designer at Planful. Based in Hyderabad. Open to remote and hybrid roles.",
    link: { label: "Email Arun", href: "mailto:akgaddam02@gmail.com" },
    followups: ["start-work", "start-availability", "tenure-honest"],
  },

  // ── Supporting branches ────────────────────────────────────────

  "problems-industries": {
    id: "problems-industries",
    chip: "Which industries?",
    answer:
      "FinTech (Planful), Enterprise SaaS and Reputation Management (Reputation.com), Manufacturing and supply chain (Zetwerk), Consumer sports (FanCode), AI-native tools (Astra). Four years before that running a UX consultancy across sectors.",
    followups: ["companies-list", "start-work"],
  },

  "phil-evidence": {
    id: "phil-evidence",
    chip: "Show me this in practice",
    answer:
      "Astra tests philosophy 3 most clearly. A working AI handoff model designed and built in 6 to 8 hours. FanCode tests philosophy 2: he cut the onboarding tutorial because research showed users skipped it. Every case study lists what he cut.",
    followups: ["cs-astra", "cs-fancode", "start-work"],
  },

  "tenure-honest": {
    id: "tenure-honest",
    chip: "Why the recent short stints?",
    answer:
      "Honest version. Reputation (11 months): joined for AI verticals work, role scoped tighter than expected. Planful (5 months): owned solid work, then role ended in a company restructure. Career break (Sep 2025 to Apr 2026): chose to take time for family and to go deep on AI before the next role. Nine years of senior work and four years running a consultancy sit behind these.",
    followups: ["companies-list", "start-work", "contact"],
  },

  "companies-list": {
    id: "companies-list",
    chip: "What companies has he worked at?",
    answer:
      "Planful (Senior PD, 2025), Reputation.com (Senior UX, 2024 to 2025), Zetwerk (Senior PD, 2022 to 2023), FanCode / Dream Sports (Manager UX, 2020 to 2022), Quazire Consulting (Founder, 2016 to 2020).",
    followups: ["tenure-honest", "start-work"],
  },

  "contact": {
    id: "contact",
    chip: "How do I reach him?",
    answer:
      "Best: akgaddam02@gmail.com. Also responsive on LinkedIn. Based in Hyderabad (IST), happy to take calls in US morning hours.",
    link: { label: "Email Arun", href: "mailto:akgaddam02@gmail.com" },
    followups: ["start-availability", "start-work"],
  },

  // ── Case studies ────────────────────────────────────────────────

  "cs-planful": {
    id: "cs-planful",
    chip: "Planful — finance planning",
    answer:
      "Owned end to end design for two finance planning features. The hard part: migrating analyst spreadsheet muscle memory into a modern web interface without slowing them down. Training time dropped ~30%.",
    link: { label: "Open Planful case study", href: "/work/planful-esm-tables" },
    followups: ["planful-decision", "planful-cut", "planful-outcome"],
  },

  "cs-apple": {
    id: "cs-apple",
    chip: "Apple Business Listings",
    answer:
      "Designed how multi-location enterprises manage their Apple Maps presence. The challenge: bridging Apple's strict data model and how messy real business data actually is. About 68% of customers check Apple Maps data weekly after launch.",
    link: { label: "Open Apple case study", href: "/work/apple-business-listings" },
    followups: ["apple-decision", "apple-cut", "apple-outcome"],
  },

  "cs-fancode": {
    id: "cs-fancode",
    chip: "FanCode — homepage and FTUX",
    answer:
      "Led UX for first time user retention across a 50M+ user base. Research showed first session confusion was the main drop off. Reframed the homepage as the discovery surface. Retention up ~18%, subscriptions followed.",
    link: { label: "Open FanCode case study", href: "/work/fancode-homepage" },
    followups: ["fancode-decision", "fancode-cut", "fancode-outcome"],
  },

  "cs-astra": {
    id: "cs-astra",
    chip: "Astra — AI contract review",
    answer:
      "Designed and built solo in 6 to 8 hours using Claude Code. Two flows: procurement view and legal view. The question it explores: when AI is right 85 to 90% of the time, what does the other 10 to 15% look like? Answer: structured handoff between roles, not a single approval button.",
    link: { label: "Open Astra case study", href: "/work/astra" },
    followups: ["astra-decision", "astra-cut", "astra-outcome"],
  },

  // ── Case study follow-ups (decision / cut / outcome) ────────────

  "planful-decision": {
    id: "planful-decision",
    chip: "Hardest decision?",
    answer:
      "Whether to keep the spreadsheet metaphor or break it. Kept it, added structure underneath. Analysts kept their muscle memory while gaining versioning, audit, and role separation.",
    followups: ["planful-cut", "planful-outcome", "cs-planful"],
  },
  "planful-cut": {
    id: "planful-cut",
    chip: "What did he cut?",
    answer:
      "A second-level filter system. Power users didn't use it, casual users didn't notice. Cut it to keep the surface scannable.",
    followups: ["planful-decision", "planful-outcome", "cs-planful"],
  },
  "planful-outcome": {
    id: "planful-outcome",
    chip: "What was the outcome?",
    answer:
      "Training time down ~30%. Migration of core finance workflows from legacy tools to the modern web interface stayed on track.",
    followups: ["planful-decision", "planful-cut", "cs-planful"],
  },

  "apple-decision": {
    id: "apple-decision",
    chip: "Hardest decision?",
    answer:
      "How honest to be about Apple's rejection reasons. Surfaced the actual API error, not a softened version. Enterprise users said it saved them hours of guessing.",
    followups: ["apple-cut", "apple-outcome", "cs-apple"],
  },
  "apple-cut": {
    id: "apple-cut",
    chip: "What did he cut?",
    answer:
      "An auto-suggest layer for fixing rejected listings. Felt magic in demos, broke down on edge cases with multi-location data. Held it back as a feature flag for v2.",
    followups: ["apple-decision", "apple-outcome", "cs-apple"],
  },
  "apple-outcome": {
    id: "apple-outcome",
    chip: "What was the outcome?",
    answer:
      "~68% of customers check Apple Maps data weekly after launch. The workflow became a primary revenue driver for the verticals team.",
    followups: ["apple-decision", "apple-cut", "cs-apple"],
  },

  "fancode-decision": {
    id: "fancode-decision",
    chip: "Hardest decision?",
    answer:
      "Where to put new users. The old homepage assumed they knew what they wanted. Research said they didn't. Reframed homepage as a discovery surface, not a destination.",
    followups: ["fancode-cut", "fancode-outcome", "cs-fancode"],
  },
  "fancode-cut": {
    id: "fancode-cut",
    chip: "What did he cut?",
    answer:
      "A first run tutorial layer over the homepage. Users skipped it in testing. Removed it and let the homepage teach itself through the content surface.",
    followups: ["fancode-decision", "fancode-outcome", "cs-fancode"],
  },
  "fancode-outcome": {
    id: "fancode-outcome",
    chip: "What was the outcome?",
    answer:
      "Retention up ~18%. Subscriptions followed. Homepage became the most reliable discovery surface in the app.",
    followups: ["fancode-decision", "fancode-cut", "cs-fancode"],
  },

  "astra-decision": {
    id: "astra-decision",
    chip: "Hardest decision?",
    answer:
      "Whether to give the AI a single approval button or split the flow by role. Split it. Procurement and legal see different views with structured handoff between them. That handoff was the takeaway the AI contract intelligence team pushed back on hardest, and what stayed.",
    followups: ["astra-cut", "astra-outcome", "cs-astra"],
  },
  "astra-cut": {
    id: "astra-cut",
    chip: "What did he cut?",
    answer:
      "An 'approve all' bulk action. Felt powerful but undid the point of the role split. Kept per-clause approval, added keyboard shortcuts to keep speed.",
    followups: ["astra-decision", "astra-outcome", "cs-astra"],
  },
  "astra-outcome": {
    id: "astra-outcome",
    chip: "What was the outcome?",
    answer:
      "Two working prototypes shipped in 6 to 8 hours with Claude Code. Reviewed with an AI contract intelligence team. It's a designed experiment, not a launched product.",
    followups: ["astra-decision", "astra-cut", "cs-astra"],
  },

  // ── AI deep dives ───────────────────────────────────────────────

  "ai-example": {
    id: "ai-example",
    chip: "Show me an example",
    answer:
      "Astra. AI contract review tool, designed and built solo in 6 to 8 hours. Two flows, procurement and legal, with structured handoff between them. Reviewed with an AI contract intelligence team for feedback.",
    link: { label: "Open Astra case study", href: "/work/astra" },
    followups: ["cs-astra", "ai-philosophy"],
  },
  "ai-philosophy": {
    id: "ai-philosophy",
    chip: "What's his POV on AI in UX?",
    answer:
      "Less about replacing the designer, more about shortening the loop between idea and validated prototype. The win isn't 'AI helps you design,' it's 'a working interaction model goes from sketch to reviewable artifact in a single weekend.'",
    followups: ["ai-example", "ai-tools"],
  },
  "ai-tools": {
    id: "ai-tools",
    chip: "What tools?",
    answer:
      "Claude (chat and Claude Code), Figma, Figma Make, Google Stitch. Dovetail for research synthesis. Pendo and Mixpanel for analytics.",
    followups: ["ai-example", "ai-philosophy"],
  },
};

/** Helper for the chat component. Returns the chip label for a node id. */
export const chipFor = (id: string) => NODES[id]?.chip ?? id;
