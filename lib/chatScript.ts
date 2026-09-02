/* Scripted Q&A tree for the Portfolio Chat. No LLM calls, zero cost.
   Authored by Arun, not generated. Edit answers directly in this file.
   Predefined responses presented through an AI-style chat UI — the chat
   itself is a portfolio piece demonstrating AI UX thinking without paying
   per-token costs for traffic that is mostly recruiter screens.

   IA model (May 15 rewrite):
   - Top-level chips are SECTIONS (nouns), not questions. Always visible.
   - Inside each section, contextual followups go deeper. No redundancy
     with rich output. Cards do the obvious navigation; chips offer the
     angles a visitor wouldn't pick themselves.

   Voice rules:
   - Chip labels  : noun phrases (menu items in a click-and-pick explorer,
                    not chat questions). "Design philosophy", not
                    "Your design philosophy?".
   - Answers      : first person (Arun speaking: "I", "my").
   - No em dashes. Use commas, colons, periods.
   - No buzzwords. No vague claims.
   - Lead with the answer in sentence 1. Inverted pyramid.
*/

/** Structured output rendered below the text bubble. */
export type RichOutput =
  | { type: "fact-grid";     facts: { label: string; value: string }[] }
  | { type: "work-cards";    cards: { label: string; meta: string; href: string }[] }
  | { type: "tag-cloud";     tags: string[] }
  | { type: "mini-timeline"; milestones: { period: string; role: string; company: string }[] }
  | { type: "quote-cards";   quotes: { quote: string; name: string; role: string; company: string }[] };

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
  /** Ids of follow-up nodes to surface as contextual chips after this answer. */
  followups?: string[];
};

export const GREETING =
  "Pick a section above to explore.";

/** Subtitle in the chat header. */
export const DISCLOSURE = "My words. Not an AI's.";

/** Six section chips — always visible as the persistent nav strip.
    These are entry points, not questions. Each opens a self-contained
    rabbit hole; switching sections preserves chat history. */
export const SECTION_CHIPS = [
  "section-about",
  "section-work",
  "section-career",
  "section-ai",
  "section-testimonials",
  "section-contact",
];

/** Back-compat alias — older code that imported ROOT_CHIPS keeps working. */
export const ROOT_CHIPS = SECTION_CHIPS;

export const NODES: Record<string, ChatNode> = {

  // ── Sections ──────────────────────────────────────────────────────────────

  "section-about": {
    id: "section-about",
    chip: "About Arun",
    answer:
      "Quick version.\n\n• 8+ years senior product and UX design\n• Last role: Senior PD at Planful\n• Hyderabad, India. Remote or hybrid.\n• Available April 2026\n\nI work on dense enterprise products. Finance, AI, multi-role workflows.",
    followups: ["about-philosophy", "about-pattern", "about-hottake", "about-problems"],
  },

  "section-work": {
    id: "section-work",
    chip: "Selected Work",
    answer:
      "Three companies, one solo build. Pick how you want to look at it.",
    followups: ["work-pickone", "work-pattern", "work-recent"],
  },

  "section-career": {
    id: "section-career",
    chip: "Career",
    answer: "Most recent first. Four senior roles after four years running my own UX consultancy.",
    richOutput: {
      type: "mini-timeline",
      milestones: [
        { period: "2025",        role: "Senior Product Designer",  company: "Planful" },
        { period: "2024–2025",   role: "Senior UX Designer",       company: "Reputation.com" },
        { period: "2022–2023",   role: "Senior Product Designer",  company: "Zetwerk" },
        { period: "2020–2022",   role: "Manager, UX Design",       company: "FanCode / Dream Sports" },
        { period: "2016–2020",   role: "Founder",                  company: "Quazire Consulting" },
      ],
    },
    followups: ["tenure-honest", "companies-list", "problems-industries"],
  },

  "section-ai": {
    id: "section-ai",
    chip: "AI Approach",
    answer:
      "Two layers.\n\nDay to day, I prototype in Claude Code and Figma Make before devs touch it.\n\nIn product, I design the interaction model for when AI is right 85 to 90 percent of the time. The 10 to 15 percent it isn't is the design problem.",
    followups: ["ai-example", "ai-philosophy", "ai-tools"],
  },

  "section-testimonials": {
    id: "section-testimonials",
    chip: "Testimonials",
    answer: "From past managers.",
    richOutput: {
      type: "quote-cards",
      quotes: [
        {
          quote: "I was always impressed by his ability to simplify complex problems and create user-friendly designs. He's a thoughtful, strategic designer who balances business goals with user needs.",
          name: "Jeff Orshalick",
          role: "UX Design Manager",
          company: "Reputation",
        },
        {
          quote: "Arun has an exceptional understanding of design and the knack to draw relevant insights to identify the right problems. His business acumen combined with a user-first approach makes him an ideal UX lead.",
          name: "Vikas Kotian",
          role: "VP Product Design",
          company: "FanCode",
        },
      ],
    },
    followups: ["section-work", "section-contact"],
  },

  "section-contact": {
    id: "section-contact",
    chip: "Contact",
    answer: "Available from April 2026. Email is the fastest path.",
    richOutput: {
      type: "fact-grid",
      facts: [
        { label: "Available",  value: "Apr 2026" },
        { label: "Level",      value: "Senior IC / Design Lead" },
        { label: "Location",   value: "Hyderabad, India (IST)" },
        { label: "Open to",    value: "Remote, hybrid" },
        { label: "Overlap",    value: "US morning / EU afternoon" },
        { label: "Contact",    value: "akgaddam02@gmail.com" },
      ],
    },
    link: { label: "Email me", href: "mailto:akgaddam02@gmail.com" },
    followups: ["tenure-honest", "section-career"],
  },

  // ── About: deeper nodes ───────────────────────────────────────────────────

  "about-philosophy": {
    id: "about-philosophy",
    chip: "Design philosophy",
    answer:
      "Three lines.\n\n1. Understand the users, the project, and the context before drawing anything.\n2. Design collaboratively. I bring the team into the work, not present finished pixels at them.\n3. Cut hard, ship lean. Every screen earns its place. AI compresses the loop, it doesn't replace it.\n\nDesign is a craft of decisions, not a craft of pixels.",
    followups: ["about-pattern", "about-problems", "section-work"],
  },

  "about-pattern": {
    id: "about-pattern",
    chip: "The common thread",
    answer:
      "Every project I'm proud of started with users compensating: workarounds, spreadsheets outside the tool, Slack threads acting as a system. That gap between the product and how users actually got things done was always the real design brief.",
    followups: ["about-philosophy", "section-work", "section-ai"],
  },

  // TODO: Arun to rewrite or replace. The text below is the AI's read of
  // the POV already present in your other answers (pattern + AI philosophy).
  // If you have a sharper take, swap it in.
  "about-hottake": {
    id: "about-hottake",
    chip: "A hot take",
    answer:
      "Most 'enterprise UX' is design theater. The real leverage is where users are already working around your product. Build for the workaround, not the spec.\n\nSecond one: in AI products, the win is admitting where the model is wrong, not hiding it. The 10–15% handoff is the design problem, not the 85–90% that just works.",
    followups: ["about-pattern", "about-philosophy", "ai-philosophy"],
  },

  "about-problems": {
    id: "about-problems",
    chip: "Problems I solve",
    answer:
      "Dense enterprise product spaces, not consumer brand work:\n\n• Finance planning and workflow tools\n• Keeping data accurate across 100+ locations\n• AI-assisted review and approval flows\n• Supply chain and manufacturing ops",
    followups: ["about-pattern", "section-work", "problems-industries"],
  },

  // ── Work: meta-chips (not case-study restatements) ────────────────────────

  "work-pattern": {
    id: "work-pattern",
    chip: "Common thread across projects",
    answer:
      "Users compensating with manual work. Planful: analysts living in Excel. Apple: businesses guessing why their listings rejected. FanCode: new users not knowing what the app was for. The design leverage is where the system loses to manual effort.",
    followups: ["work-pickone", "about-philosophy", "section-work"],
  },

  "work-pickone": {
    id: "work-pickone",
    chip: "Where to start",
    answer:
      "Depends what you want to see:\n\n• Planful. Enterprise rigor. Spreadsheet muscle memory migrated into a modern web tool without slowing analysts down.\n• Apple. Data accuracy across 100+ locations, inside an enterprise dashboard.\n• FanCode. Consumer scale. 50M users, fixed first-session drop-off.",
    followups: ["cs-planful", "cs-apple", "cs-fancode"],
  },

  "work-recent": {
    id: "work-recent",
    chip: "Most recent project",
    answer:
      "Planful, 2025. End-to-end design for two finance planning features. Training time on the modernised workflows dropped ~30%.",
    link: { label: "Open Planful case study", href: "/work/planful-esm-tables" },
    followups: ["cs-planful", "work-pickone", "section-work"],
  },

  // ── Career: deeper nodes (existing IDs kept for stability) ────────────────

  "tenure-honest": {
    id: "tenure-honest",
    chip: "The recent short stints",
    answer:
      "Honest answers:\n\n• Reputation (11 months): joined for AI verticals work, the role scoped tighter than expected.\n• Planful (5 months): owned solid work, role ended in a restructure.\n• Break (Sep 2025 to Apr 2026): deliberate. Family and going deep on AI before the next thing.\n\n8+ years of senior IC work and 4 years running my own consultancy sit behind these.",
    followups: ["companies-list", "section-career", "section-contact"],
  },

  "companies-list": {
    id: "companies-list",
    chip: "All companies",
    answer:
      "Planful (Senior PD, 2025), Reputation.com (Senior UX, 2024–2025), Zetwerk (Senior PD, 2022–2023), FanCode / Dream Sports (Manager UX, 2020–2022), Quazire Consulting (Founder, 2016–2020).",
    followups: ["tenure-honest", "section-career"],
  },

  "problems-industries": {
    id: "problems-industries",
    chip: "Industries",
    answer: "Across 8+ years I've worked in:",
    richOutput: {
      type: "tag-cloud",
      tags: ["FinTech", "Enterprise SaaS", "Reputation Mgmt", "Manufacturing", "Supply Chain", "Consumer Sports", "AI Tools", "UX Consulting"],
    },
    followups: ["section-career", "section-work"],
  },

  // ── Case studies (reachable via work-cards in section-work) ───────────────

  "cs-planful": {
    id: "cs-planful",
    chip: "Planful",
    answer:
      "Finance analysts were living in Excel. My job: move them to a web tool without slowing them down.\n\n• Challenge: preserve the spreadsheet muscle memory while adding versioning, audit trails, and role separation.",
    link: { label: "Open Planful case study", href: "/work/planful-esm-tables" },
    followups: ["planful-decision", "planful-cut", "planful-outcome"],
  },

  "cs-apple": {
    id: "cs-apple",
    chip: "Apple Business Listings",
    answer:
      "Businesses with 100+ locations were losing customers because their Apple Maps data was wrong. I designed the tool that fixed it.\n\n• Challenge: Apple's data model is strict. Real business data is messy. Bridging them at scale was the problem.\n• Outcome: ~68% of customers check their Maps data weekly post-launch.",
    link: { label: "Open Apple case study", href: "/work/apple-business-listings" },
    followups: ["apple-decision", "apple-cut", "apple-outcome"],
  },

  "cs-fancode": {
    id: "cs-fancode",
    chip: "FanCode",
    answer:
      "50M users. First-session confusion was the main drop-off. I had to fix the homepage.\n\n• Problem: new users landed and didn't know what to do. The homepage assumed they already had a team or sport in mind.\n• Move: reframe it as a discovery surface. Let content pull them in.\n• Outcome: retention up ~18%. Paid subscriptions climbed the following month.",
    link: { label: "Open FanCode case study", href: "/work/fancode-homepage" },
    followups: ["fancode-decision", "fancode-cut", "fancode-outcome"],
  },

  // ── Case study deep dives ─────────────────────────────────────────────────

  "planful-decision": {
    id: "planful-decision",
    chip: "Spreadsheets or break them",
    answer:
      "Whether to keep the spreadsheet metaphor or break it. I kept it, added structure underneath. Analysts kept their muscle memory while gaining versioning, audit, and role separation.",
    followups: ["planful-cut", "planful-outcome", "cs-planful"],
  },
  "planful-cut": {
    id: "planful-cut",
    chip: "What I cut",
    answer:
      "A second-level filter system. Power users didn't use it, casual users didn't notice it was missing. I cut it to keep the surface scannable.",
    followups: ["planful-decision", "planful-outcome", "cs-planful"],
  },
  "planful-outcome": {
    id: "planful-outcome",
    chip: "The outcome",
    answer:
      "Training time dropped ~30%. The migration didn't slip. Analysts moved to the web tool and didn't go back to Excel.",
    followups: ["planful-decision", "planful-cut", "cs-planful"],
  },

  "apple-decision": {
    id: "apple-decision",
    chip: "Surfacing rejection errors honestly",
    answer:
      "How honest to be about Apple's rejection reasons. I surfaced the actual API error, not a softened version. Enterprise users said it saved them hours of guessing.",
    followups: ["apple-cut", "apple-outcome", "cs-apple"],
  },
  "apple-cut": {
    id: "apple-cut",
    chip: "What I cut",
    answer:
      "An auto-suggest layer for fixing rejected listings. It felt magic in demos but broke down on edge cases with multi-location data. I held it back as a feature flag for v2.",
    followups: ["apple-decision", "apple-outcome", "cs-apple"],
  },
  "apple-outcome": {
    id: "apple-outcome",
    chip: "The outcome",
    answer:
      "~68% of customers check their Maps data weekly post-launch. Enterprise clients could see their Apple Maps performance for the first time. It became a core part of the Reputation platform pitch.",
    followups: ["apple-decision", "apple-cut", "cs-apple"],
  },

  "fancode-decision": {
    id: "fancode-decision",
    chip: "Reframing where users land",
    answer:
      "The old homepage assumed they knew what they wanted. Research said they didn't. I reframed the homepage as a place to explore, not a destination.",
    followups: ["fancode-cut", "fancode-outcome", "cs-fancode"],
  },
  "fancode-cut": {
    id: "fancode-cut",
    chip: "What I cut",
    answer:
      "A first-run tutorial layer over the homepage. Users skipped it in testing. I removed it and let the homepage teach itself through the content.",
    followups: ["fancode-decision", "fancode-outcome", "cs-fancode"],
  },
  "fancode-outcome": {
    id: "fancode-outcome",
    chip: "The outcome",
    answer:
      "Retention up ~18%. Paid subscriptions started climbing the following month. The homepage became the most reliable place to find something new in the app.",
    followups: ["fancode-decision", "fancode-cut", "cs-fancode"],
  },

  // ── AI deep dives ─────────────────────────────────────────────────────────

  "ai-example": {
    id: "ai-example",
    chip: "An example",
    answer:
      "A Custom GPT I built and launched for UX and product professionals. Designed, written and shipped solo. It has since generated 73K+ organic LinkedIn impressions.",
    link: {
      label: "Open the Custom GPT",
      href: "https://chatgpt.com/g/g-6a6b5aeb663c81919ca14dbf88115b73-ux-product-research-assistant",
      external: true,
    },
    followups: ["ai-philosophy", "ai-tools", "section-work"],
  },
  "ai-philosophy": {
    id: "ai-philosophy",
    chip: "My POV on AI in UX",
    answer:
      "Less about replacing myself, more about compressing the time between idea and validated prototype. The win isn't 'AI helps you design'. It's that I can go from sketch to reviewable artifact in a single weekend.",
    followups: ["ai-example", "ai-tools", "section-work"],
  },
  "ai-tools": {
    id: "ai-tools",
    chip: "Tools I use",
    answer:
      "• Design and prototyping: Claude Code, Figma, Figma Make, Google Stitch\n• Research synthesis: Dovetail\n• Analytics: Pendo, Mixpanel",
    followups: ["ai-example", "ai-philosophy", "section-work"],
  },
};

/** Helper for the chat component. Returns the chip label for a node id. */
export const chipFor = (id: string) => NODES[id]?.chip ?? id;

/** True if the given node id is a top-level section.
 *  Used by the component to render section nav vs contextual chips. */
export const isSectionId = (id: string) => SECTION_CHIPS.includes(id);
