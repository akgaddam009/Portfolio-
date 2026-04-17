export type CaseStudyImage = {
  src: string;
  alt: string;
  caption?: string;
};

export type CaseStudy = {
  slug: string;
  number: string;
  title: string;
  subtitle: string;
  company?: string;
  type: string;
  role: string;
  timeline?: string;
  team?: string;
  tags: string[];
  summary: string;
  metrics: { value: string; label: string }[];
  problem: string;
  problemImage?: CaseStudyImage;
  insight?: string;
  insightImage?: CaseStudyImage;
  decisions: { title: string; body: string; image?: CaseStudyImage }[];
  outcomesImage?: CaseStudyImage;
  outcomes: string[];
  lesson?: string;
  contribution?: string;
  confidential?: boolean;
  heroLabel: string;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "planful-esm",
    number: "01",
    title: "Financial Data Management",
    subtitle: "Designing for trust in a system where mistakes have real consequences",
    company: "Planful",
    type: "Enterprise SaaS — Fintech",
    role: "Senior Product Designer",
    timeline: "2025",
    team: "PM, Engineering, Finance SMEs",
    tags: ["Enterprise SaaS", "Fintech", "Workflow Design", "Trust Design"],
    heroLabel: "Real Work",
    summary:
      "Most tools put the burden of accuracy on the user. This one should have protected them from it. I redesigned how financial data gets updated — separating where work happens from what becomes official, so teams could move freely without risking the numbers the company runs on.",
    metrics: [
      { value: "~99%", label: "Reduction in time on task" },
    ],
    problem:
      "The tool — Excel Spotlight — was Windows-only, required advanced spreadsheet knowledge to operate, and had no real-time collaboration. Building or updating a financial model felt like starting from scratch every time. Only a handful of power users could confidently work in it. ==Simple updates took 4–5 hours. Complex ones took weeks.== That told me everything I needed to know.",
    problemImage: {
      src: "/images/planful/task-flow.png",
      alt: "4-step task flow: Create → Prepare → Review → Publish",
      caption: "The new workflow — four clear stages replacing an open-ended, error-prone process",
    },
    insight:
      "The problem wasn't just usability — it was where the responsibility sat. Every update required intense focus because the system never caught mistakes — it offloaded validation, error detection, and coordination entirely to the user. What looked like complexity was actually cognitive burden.",
    insightImage: {
      src: "/images/planful/data-model-comparison.png",
      alt: "OLAP core model vs ESM staging model comparison",
      caption: "The ESM sits in front of the core financial model — same data, safer to work with",
    },
    decisions: [
      {
        title: "Keep what people know, fix what's broken underneath",
        body: "Finance teams had been using spreadsheets for years. Replacing that familiarity entirely would have caused more problems than it solved. So we kept the grid and spreadsheet structure people already knew, and quietly improved everything around it.",
        image: {
          src: "/images/planful/landing-page.png",
          alt: "ESM Tables landing page — list of models, easy to find or start a new one",
          caption: "The landing page — familiar list view, no complex folder navigation",
        },
      },
      {
        title: "Nothing goes live until it's ready",
        body: "The draft-first model was the central design decision. We removed the ability to edit the live financial model directly — every change happens in a private workspace instead. Users can prepare, check, and revise freely. Only a deliberate publish action moves data to the live plan. We considered allowing admin-level direct edits as an escape hatch. We said no — one exception becomes the norm, and the safety guarantee disappears.",
      },
      {
        title: "Lock in the right foundation before building",
        body: "I pushed for choosing a grid system that already had enterprise compliance built in, rather than designing custom interactions and retrofitting governance later. It meant some interaction patterns I wanted were off the table. But it gave users something more valuable than polish — a tool they could trust was auditable and secure from day one.",
        image: {
          src: "/images/planful/formula-feedback.png",
          alt: "Formula bar with live colour highlights showing affected cells",
          caption: "Live formula feedback — colour highlights show what's changing as you type",
        },
      },
      {
        title: "Make mistakes easy to catch and fix",
        body: "When something was wrong, users needed to know exactly what, where, and how to fix it — without losing their work. Clear error markers and specific guidance meant no one was ever stuck or forced to start over.",
        image: {
          src: "/images/planful/error-handling.png",
          alt: "Inline error validation surfacing data format mismatches contextually",
          caption: "Errors caught in the workspace — not after publishing to the live model",
        },
      },
    ],
    outcomesImage: {
      src: "/images/planful/bulk-update.png",
      alt: "Overwrite and append flow — bulk data updates in a few clicks",
      caption: "Bulk updates in seconds — overwrite or append without recreating tables",
    },
    outcomes: [
      "Task time dropped from 3.5 hours to ~4 minutes — a ~99% reduction",
      "Four teams now contribute to financial planning directly — Finance, HR, Operations, and Sales",
      "Finance is no longer the bottleneck — business teams update the plan independently",
      "The draft workspace eliminated the category of errors that previously reached the live model",
    ],
    contribution:
      "I led problem framing, task flow architecture, and error state design end-to-end. I defined the draft-to-publish model with the PM and set the grid technology constraints with engineering before any interface work began. Navigation placement, formula feedback, bulk update patterns, and the lock/publish flows were all under my ownership.",
    lesson:
      "The interface wasn't the problem. The stakes were. When a single mistake can ripple across an entire company's financials, no one moves with confidence. The real design challenge was building a system people could trust — not just one they could use.",
  },
  {
    slug: "ai-workspace",
    number: "02",
    title: "AI Workspace Assistant",
    subtitle: "Designing ambient intelligence for enterprise teams",
    type: "B2B AI Tool — Enterprise Productivity",
    role: "Lead Product Designer (0→1)",
    tags: ["AI/ML", "Enterprise", "B2B", "Design Leadership"],
    heroLabel: "B2B Hero",
    summary:
      "Enterprise teams were drowning in context-switching across Slack, email, Jira, docs, and meeting tools. I led the 0→1 design of an AI workspace that reduced cognitive load without removing human judgment from the loop.",
    metrics: [
      { value: "↓38%", label: "Context switches per task" },
      { value: "↑52%", label: "Meeting-to-action conversion" },
      { value: "↓41%", label: "Time-to-decision" },
    ],
    problem:
      "Enterprise teams were drowning in context-switching — moving between Slack, email, Jira, docs, and meeting tools with no unified workspace. Productivity tools existed but none were designed for how enterprise teams actually collaborate. The result was cognitive overload, dropped context, and decisions that required 3x the coordination effort they should.",
    insight:
      "The failure mode in enterprise AI is not capability — it's trust. Teams rejected AI suggestions not because they were wrong, but because they felt authoritative. I reframed the product around AI as ambient intelligence: always present, never blocking.",
    decisions: [
      {
        title: "AI as whispers, not commands",
        body: "Suggestions were designed to be visible but dismissible — appearing in context without interrupting flow. No modal overlays, no mandatory review steps. The AI informed; the human decided.",
      },
      {
        title: "Confidence-banded outputs",
        body: "Every AI output showed a confidence band. Instead of hiding uncertainty, we surfaced it. Teams trusted the system more when it admitted what it didn't know.",
      },
      {
        title: "Persistent context sidebar",
        body: "A sidebar aggregated signals across connected tools without requiring manual input — surfacing relevant Jira tickets, Slack threads, and meeting notes automatically based on current task context.",
      },
      {
        title: "Override-and-train flows",
        body: "Every AI suggestion had a one-click override. Each override was a training signal. The system improved based on team behavior, not global model updates.",
      },
    ],
    outcomes: [
      "Reduced context switches per task by 38%",
      "Increased meeting-to-action conversion by 52%",
      "Decreased time-to-decision for cross-functional teams by 41%",
      "Adopted by 3 enterprise pilot teams within 60 days of beta launch",
    ],
    lesson:
      "Enterprise AI fails when it tries to replace judgment. It succeeds when it reduces the friction around judgment. Every design decision I made optimized for trust, not capability.",
  },
  {
    slug: "ai-decision",
    number: "03",
    title: "AI Decision Companion",
    subtitle: "Making AI trustworthy in high-stakes consumer decisions",
    type: "B2C AI Tool — Consumer Decision Support",
    role: "Lead Product Designer (0→1)",
    tags: ["AI/ML", "B2C", "Trust Design", "Consumer"],
    heroLabel: "B2C Hero",
    summary:
      "Consumers facing high-stakes decisions — financial, medical, career — were overwhelmed and paralyzed by existing tools that either oversimplified or overwhelmed. I designed a companion that made AI feel trustworthy, not authoritative.",
    metrics: [
      { value: "↑67%", label: "Decision completion rate" },
      { value: "↓44%", label: "Decision reversal within 48h" },
      { value: "4.8★", label: "Trust score (exit survey)" },
    ],
    problem:
      "Consumers faced with high-stakes decisions (financial, medical, career) were overwhelmed by information and paralyzed by choice. Existing tools either oversimplified (single recommendation) or overwhelmed (100-page reports). The psychological burden of uncertainty was not addressed by any product on the market.",
    insight:
      "The line between helpful and paternalistic is extremely thin in consumer AI. When the AI speaks with too much confidence, users feel manipulated. When it speaks with too little, they feel abandoned. The design challenge was calibrating authority to match the emotional state of the user.",
    decisions: [
      {
        title: "Perspective mode over single recommendations",
        body: "Instead of one answer, the product showed multiple valid viewpoints — framed as 'perspectives from people who've faced this decision.' Users chose their own frame rather than accepting a prescribed one.",
      },
      {
        title: "Confidence transparency",
        body: "The AI explicitly stated what it didn't know. 'I don't have enough information about your risk tolerance to weigh in on this' was a feature, not a failure mode. It built trust by demonstrating intellectual honesty.",
      },
      {
        title: "Emotional state detection",
        body: "A lightweight emotional state detector (3 questions, not a survey) modulated information density. Users in high-anxiety states saw simplified views; users in research mode saw full depth.",
      },
      {
        title: "Human escalation always visible",
        body: "Every screen had a 'Talk to a human' path. Not buried. Not a last resort. A visible option that communicated: we know AI has limits. This reduced anxiety and paradoxically increased AI engagement.",
      },
    ],
    outcomes: [
      "Decision completion rate increased 67% vs. incumbent tool",
      "Decision reversals within 48h dropped 44%",
      "Trust score of 4.8★ in post-decision exit surveys",
      "Selected as finalist for Fast Company Innovation by Design 2024",
    ],
    lesson:
      "Trust in AI is not built by capability — it's built by honesty about limitation. Every design decision that acknowledged what the AI didn't know increased user trust more than any feature we added.",
  },
  {
    slug: "compass",
    number: "04",
    title: "Compass",
    subtitle: "Rebuilding competitive intelligence for four stakeholder types",
    company: "Reputation.com",
    type: "B2B SaaS — Competitive Intelligence Platform",
    role: "Sr. UX Designer — Wireframe, Prototype, Interaction Design",
    timeline: "3 months",
    team: "PM, Engineering, Data Science, Marketing",
    tags: ["B2B SaaS", "Competitive Intelligence", "Data Visualization"],
    heroLabel: "Real Work",
    summary:
      "Customers found Reputation.com's CI platform too complex, fragmented, and limited. Low adoption was creating significant revenue risk. I consolidated four fragmented experiences into one coherent system serving four fundamentally different user mental models.",
    metrics: [
      { value: "↑40%", label: "Adoption target (achieved)" },
      { value: "4→1", label: "Fragmented views consolidated" },
      { value: "0", label: "Excel exports needed post-launch" },
    ],
    problem:
      "Customers found the existing CI platform too complex, fragmented across tenants, limited in insights, with poor performance. The platform had grown organically — four separate tabs serving four user types with no shared context or filters. Result: low adoption, significant churn risk, and users exporting to Excel to do analysis the product should have provided.",
    insight:
      "Enterprise product failures are almost always information architecture problems masquerading as UI problems. The visual design was fine. The mental model was wrong. Four user types had four fundamentally different goals — and the product treated them as one.",
    decisions: [
      {
        title: "Single navigation with global filters",
        body: "Consolidated 4 fragmented tabs into a single navigation layer with persistent global filters (Location, Sub-brands, Competitor Location, City, Business Type). Any user type could orient in under 10 seconds.",
      },
      {
        title: "Brand Comparison as centerpiece",
        body: "The primary view became a ranked competitor table: Reputation Score, Review Volume, Sentiment, Response Rate, Star Rating, Search Impression Score — all sortable, all filterable. Executives got a snapshot; analysts got depth.",
      },
      {
        title: "Geographic Competitor Groups",
        body: "A map view with radius-based filtering let regional managers see performance in geographic context — the mental model they actually used, not the database structure the platform was built around.",
      },
      {
        title: "Role-adaptive information density",
        body: "The same dataset presented at different densities based on the user's role context. Executives saw KPIs; analysts saw trend lines and raw scores; managers saw action items.",
      },
    ],
    outcomes: [
      "Adoption target of ↑40% met within 90 days of launch",
      "Reduced 4 fragmented views to 1 unified interface",
      "Eliminated Excel export dependency entirely",
      "Served all 4 stakeholder types from a single interface without divergent codebases",
    ],
    lesson:
      "Enterprise product failures are almost always information architecture problems masquerading as UI problems. When you fix the mental model, the UI problems often solve themselves.",
  },
  {
    slug: "cx-enterprise",
    number: "05",
    title: "CX Enterprise App",
    subtitle: "Multi-tenant platform for four stakeholder tiers",
    type: "Enterprise SaaS — Customer Experience Management",
    role: "Sr. UX Designer",
    tags: ["Enterprise SaaS", "Multi-tenant", "CX Management"],
    heroLabel: "Confidential",
    confidential: true,
    summary:
      "Multi-tenant CX management platform serving four stakeholder types — from frontline agents to C-suite — using progressive disclosure architecture to surface the right depth of data for each role without fragmenting the product.",
    metrics: [
      { value: "4", label: "Stakeholder tiers served" },
      { value: "0→1", label: "Progressive disclosure architecture" },
      { value: "↑35%", label: "Task completion across roles" },
    ],
    problem:
      "A CX management platform needed to serve frontline agents (granular ticket data), team leads (performance trends), CX directors (strategic KPIs), and C-suite (executive dashboards) — all from one product, one codebase, one design system. Previous attempts had created four separate products with mounting maintenance debt.",
    insight:
      "Progressive disclosure is not about hiding information — it's about sequencing it to match the decision horizon of each role. C-suite doesn't need less data; they need data at the right altitude.",
    decisions: [
      {
        title: "Progressive disclosure architecture",
        body: "The same underlying data model was presented at four levels of abstraction — each triggered by role, not by navigation. Frontline agents saw ticket queues; C-suite saw margin impact. Same data, different altitude.",
      },
      {
        title: "Role-based entry points",
        body: "Login context determined the initial view and information density. No settings panel required — the system inferred the correct starting point from the authenticated role.",
      },
      {
        title: "Unified design system across tiers",
        body: "Rather than building four products, I designed one component library with role-conditional display logic. This reduced engineering complexity by ~60% versus the previous multi-product approach.",
      },
    ],
    outcomes: [
      "Task completion rate improved 35% across all stakeholder tiers",
      "Eliminated 3 redundant product codebases",
      "Design system adopted across 2 additional internal products",
      "Full case study available on request",
    ],
    lesson:
      "The most powerful enterprise design constraint is also the most invisible: role-based altitude. Design for the decision horizon, not the data volume.",
  },
  {
    slug: "design-system",
    number: "06",
    title: "Enterprise Design System",
    subtitle: "Building the foundation that scales across 6 product surfaces",
    type: "Design Infrastructure — Component Library",
    role: "Design System Lead",
    timeline: "6 months",
    team: "Engineering, Product, Brand",
    tags: ["Design Systems", "Figma", "Component Library"],
    heroLabel: "Infrastructure",
    summary:
      "A fragmented product suite with 6 surfaces, 3 teams, and no shared visual language. I led the 0→1 design of an enterprise design system that unified components, tokens, and documentation — reducing design-to-engineering handoff time by half.",
    metrics: [
      { value: "↓52%", label: "Design-to-dev handoff time" },
      { value: "6", label: "Product surfaces unified" },
      { value: "200+", label: "Components shipped" },
    ],
    problem:
      "Six product surfaces were built independently — each with its own component patterns, spacing systems, and interaction models. Engineers were rebuilding the same components in parallel. Designers were making inconsistent decisions. The product felt like six different companies.",
    insight:
      "A design system is not a UI kit. It's an opinion about how the product should feel — encoded in tokens, documented in principles, and enforced through process. The hardest part is not the components. It's getting teams to adopt them.",
    decisions: [
      { title: "Tokens first", body: "Before a single component was built, we defined the token layer: color, spacing, radius, elevation. This gave engineering a source of truth that components could reference — and meant global theming was possible from day one." },
      { title: "Documentation as a product", body: "Each component had decision rationale, accessibility notes, and anti-patterns documented alongside the Figma file. Adoption doubled when teams understood why, not just what." },
      { title: "Contribution model", body: "Rather than a gated system owned by one designer, we built a contribution model where any team could propose additions with a clear review process. This created ownership without chaos." },
    ],
    outcomes: [
      "Reduced design-to-engineering handoff time by 52%",
      "Unified 6 product surfaces under one visual language",
      "Shipped 200+ components with full documentation and accessibility coverage",
      "Adopted by 3 engineering teams within 4 months of launch",
    ],
    lesson: "The best design systems are invisible. When teams stop asking 'what should this look like?' and start shipping, the system is working.",
  },
  {
    slug: "mentorship-platform",
    number: "07",
    title: "Mentorship Platform Redesign",
    subtitle: "Redesigning booking and discovery for 50M+ users",
    type: "Consumer Product — Mobile & Web",
    role: "Lead Product Designer",
    tags: ["Consumer", "Mobile", "Growth"],
    heroLabel: "Consumer Scale",
    confidential: true,
    summary:
      "A mentorship platform at consumer scale had a discovery and booking experience that hadn't been rethought since launch. I redesigned the core flow — cutting drop-off by 34% and doubling session completion — without changing the underlying matching algorithm.",
    metrics: [
      { value: "↓34%", label: "Booking drop-off" },
      { value: "↑2×", label: "Session completion rate" },
      { value: "50M+", label: "User base" },
    ],
    problem:
      "The discovery and booking flow was optimized for supply (mentors) rather than demand (mentees). Users landed on a search-heavy interface that assumed they knew what kind of mentor they needed. Most didn't. Drop-off at the first screen was over 60%.",
    insight:
      "Consumer products fail at discovery when they put the taxonomy before the need. Users don't know they want a 'senior engineer who specializes in career transitions' — they know they feel stuck and need help. The design challenge was translating an emotional state into a structured search query without making users do the work.",
    decisions: [
      { title: "Need-first discovery", body: "Replaced keyword search with 5 goal-oriented prompts that mapped to mentor specialties on the backend. Users picked their situation; the system translated it to filters." },
      { title: "Social proof in context", body: "Surface-level ratings were replaced with specific session outcomes — '3 people landed offers after working with this mentor' — placed at the moment of decision, not in a separate profile page." },
      { title: "Friction-free scheduling", body: "Reduced booking from 7 steps to 3. Time zone conversion, calendar sync, and confirmation were handled automatically. Users focused on choosing a mentor, not managing logistics." },
    ],
    outcomes: [
      "Booking drop-off reduced by 34%",
      "Session completion rate doubled",
      "Shipped to 50M+ users with zero increase in support tickets",
      "Full case study available on request",
    ],
    lesson: "At consumer scale, every percentage point of drop-off is thousands of people who didn't get help they needed. Designing for emotional states, not taxonomies, is what moves that number.",
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((cs) => cs.slug === slug);
}
