export type CaseStudyImage = {
  src: string;
  alt: string;
  caption?: string;
  width?: string;
  objectPosition?: string;
  displayHeight?: string;
  zoomLens?: boolean;
};

export type TaskFlowStage = {
  number: string;
  label: string;
  description: string;
  meta?: { label: string; value: string }[];
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
  context?: string;
  contextImage?: CaseStudyImage;
  problem: string;
  problemBreakdown?: { points: string[]; impact: string };
  problemImage?: CaseStudyImage;
  insight?: string;
  insightImage?: CaseStudyImage;
  decisions: { title: string; body: string; image?: CaseStudyImage; images?: CaseStudyImage[] }[];
  taskFlow?: { heading?: string; stages: TaskFlowStage[] };
  prototypeVideo?: string;
  outcomesImage?: CaseStudyImage;
  outcomesImages?: CaseStudyImage[];
  outcomes: string[];
  insightDiagram?: "olap-vs-esm";
  researchEvidence?: string;
  scrappedDirections?: { title: string; reason: string }[];
  reflection?: string;
  lesson?: string;
  contribution?: string;
  contributionArtifacts?: string[];
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
    type: "Enterprise SaaS, Fintech",
    role: "Senior Product Designer",
    timeline: "2025",
    team: "PM, Engineering, Finance SMEs",
    tags: ["Enterprise SaaS", "Fintech", "Workflow Design", "Trust Design"],
    heroLabel: "Real Work",
    context:
      "Planful is a financial planning and analysis platform. Companies use it to build and manage the financial models that drive budgets, forecasts, and headcount plans. As business needs change, the data inside those models has to change too. Rather than editing the core financial model directly, teams load updated data through an External Source Model: a controlled workspace that feeds into it without touching what is already there.",
    summary:
      "The process to update financial data already existed inside Planful. But in practice, only a few power users could run it. For everyone else, it was either too complex to attempt or too slow to be practical.\n\nThis project was about making that same workflow accessible to any team member who needed to update financial data, without removing the controls that finance teams rely on.",
    metrics: [
      { value: "~95%", label: "Reduction in time on task" },
    ],
    problem:
      "Teams were using Excel Spotlight, a Windows-based application that used Microsoft Excel as the interface for building and updating financial models inside Planful. It worked for the power users who had mastered it. For everyone else, it was a barrier. ==Simple updates took 4–5 hours. Complex ones took weeks.==",
    problemBreakdown: {
      points: [
        "Windows-only, desktop-bound",
        "Manual save and refresh cycles",
        "Lacked real-time sharing or collaboration",
        "Difficult to maintain across versions",
        "Required advanced Excel knowledge",
        "Intimidating for new or non-power users",
      ],
      impact:
        "This created a bottleneck where only a few finance power users could confidently build or update models, slowing decision-making across departments.",
    },
    problemImage: {
      src: "/images/planful/data-model-comparison.png",
      alt: "Excel Spotlight, the legacy tool it replaced",
      caption: "Excel Spotlight, the tool teams were using before",
    },
    insight:
      "The tool wasn't the bottleneck. The workflow was. Every stage of updating a financial model required a human to make a judgement the system could have made instead. Is this valid? Is this the right version? Did this reach the right place? The design opportunity was to answer those questions before the user had to ask them.",
    insightImage: undefined,
    insightDiagram: "olap-vs-esm",
    researchEvidence:
      "Validation was a week-on-week process. Regular reviews with the PM, leadership, and the development lead shaped the concept as it evolved. Once the design was stable, we brought in Solution Consultants, the people who build financial models for customers every day.",
    prototypeVideo: "/images/planful/Untitled.mp4",
    taskFlow: {
      heading: "The new workflow, four clear stages",
      stages: [
        {
          number: "01",
          label: "Define",
          description: "Set up the model structure: dimensions, members, and accounts. Build the skeleton before any numbers enter.",
          meta: [
            { label: "Who", value: "Finance lead" },
            { label: "Output", value: "Model skeleton" },
          ],
        },
        {
          number: "02",
          label: "Prepare",
          description: "Load data into the draft workspace. Spreadsheet editing, formulas, bulk imports, all in a safe non-live environment.",
          meta: [
            { label: "Who", value: "Any team member" },
            { label: "Output", value: "Draft dataset" },
          ],
        },
        {
          number: "03",
          label: "Validate",
          description: "Catch errors before they matter. Inline validation surfaces format mismatches, missing values, and formula failures in context, in real time.",
          meta: [
            { label: "Who", value: "Any team member" },
            { label: "Output", value: "Error-free draft" },
          ],
        },
        {
          number: "04",
          label: "Publish",
          description: "One deliberate action moves approved data to the live plan. No accidents. No guesswork about what's live.",
          meta: [
            { label: "Who", value: "Approver" },
            { label: "Output", value: "Live model" },
          ],
        },
      ],
    },
    decisions: [
      {
        title: "Built on an enterprise grid, not a custom one",
        body: "Engineering pointed me to Syncfusion early on, an existing grid with audit trails, export controls, and accessibility compliance already built in. Building our own would have meant 6+ months retrofitting governance onto custom interactions. We chose the library. It narrowed what was possible. But the tool was trustworthy before anyone touched it.",
        image: {
          src: "/images/planful/Engg feasibility .png",
          alt: "Syncfusion JavaScript Spreadsheet Editor, the enterprise grid pattern engineering referenced",
          caption: "Syncfusion, the grid pattern that shaped the technical approach",
          width: "90%",
        },
      },
      {
        title: "ESM Tables sit inside Dynamic Planning, where the work already happens",
        body: "ESM Tables is not a daily tool. It is used occasionally, when data needs to be updated. We sequenced it at the end of Dynamic Planning: present when needed, out of the way when not. A standalone entry point would have given it more visibility. We gave that up. A user mid-forecast shouldn't need to leave the place they're working to load the data that feeds it.",
        image: {
          src: "/images/planful/Navigation.png",
          alt: "ESM Tables within the Dynamic Planning module",
          caption: "ESM Tables inside Dynamic Planning, where the modeling work happens",
          width: "33%",
        },
      },
      {
        title: "A familiar grid, with everything fixed underneath",
        body: "The landing page shows a simple list of tables. No folders, no Excel files to hunt through. Inside each table, the interface is a grid: rows, columns, column headers, formulas. Finance teams had years of muscle memory here and we didn't want to break it. What changed was everything underneath: the edit states, the formula bar, the column type system, the validation layer. We couldn't add drag-to-reorder or contextual panels without breaking the familiarity people relied on. We accepted that tradeoff.",
        image: {
          src: "/images/planful/landing-page.jpg",
          alt: "ESM Tables landing page, list of models, easy to find or start a new one",
          caption: "The landing page. Find or create a table without navigating folders.",
        },
      },
      {
        title: "Errors shown in the cell, not after publishing",
        body: "When a user uploads data with format mismatches, the system flags each error directly in the affected cells, not in a modal, not in a separate review step. They can see exactly which rows failed and why, fix them in place, and re-upload without losing their work. We chose inline errors over a consolidated validation panel. For bulk loads with many errors, that meant working through them one at a time. Friction for the edge case. It was the right call for the majority.",
        image: {
          src: "/images/planful/error-handling.png",
          alt: "Inline error validation surfacing data format mismatches contextually",
          caption: "Errors flagged in context. Fix in place, no need to start over.",
        },
      },
      {
        title: "Two explicit ways to update data: overwrite or append",
        body: "At period close, finance teams replace the full dataset. Mid-cycle, they add new rows without touching what's already there. We made both modes explicit with a single choice at upload time. Overwrite replaces everything, Append adds to the bottom. No scripting, no support ticket. The right option is visible at the moment it matters. We said no to a merge option because merge logic introduces too many failure states in a system where a wrong number has real consequences.",
        images: [
          {
            src: "/images/planful/bulk-update.png",
            alt: "Overwrite mode: replace the full dataset in one action",
            caption: "Overwrite: replace the dataset",
          },
          {
            src: "/images/planful/ESM - Append Table_9.png",
            alt: "Append mode: add rows to an existing dataset without touching what's there",
            caption: "Append: add to existing data",
          },
        ],
      },
      {
        title: "A guided formula bar with live visual feedback",
        body: "Once data is loaded, users can apply formulas to transform it based on their business logic. As they type, colour highlights show exactly which cells are affected, giving immediate visual confirmation that the formula is working as intended. We debated whether to show a preview of the affected range before applying — a safer pattern, but one that added a step to every formula. We kept the live feedback and accepted that it required users to understand what they were typing. The visual confirmation catches the mistake quickly enough that it doesn't matter.",
        image: {
          src: "/images/planful/formula-feedback.png",
          alt: "Formula bar with live colour highlights showing affected cells",
          caption: "Live colour feedback as you type, see what changes before it does",
        },
      },
      {
        title: "What comes next: Maps",
        body: "Once data is published from an ESM Table, the finance team takes over. The published data needs to be mapped to the right accounts, time periods, and dimensions inside the OLAP model, so the numbers actually drive the forecast. At launch, this step was handled from the backend by implementation teams. The next concept in the pipeline was Maps: a visual interface where the finance team can draw the connections between ESM columns and the OLAP model themselves, without needing backend support. ESM handles the data entry. Maps closes the loop into the model.",
        image: {
          src: "/images/planful/DP Map.png",
          alt: "Dynamic Planning Maps, a visual interface for mapping ESM Table columns to model dimensions",
          caption: "Dynamic Planning Maps, closing the loop from data entry to model impact",
          zoomLens: true,
        },
      },
    ],
    outcomes: [
      "Task time dropped from 3.5 hours to 10–15 minutes",
      "For the first time, non-finance teams could load their own data without needing a finance team member to mediate every update",
    ],
    contribution: "End-to-end ownership across the full design process, from initial problem framing through to shipped interaction.",
    contributionArtifacts: [
      "Problem framing",
      "Scoping",
      "Research",
      "UX Design",
      "Interaction Design",
      "Prototyping",
    ],
    lesson:
      "The real challenge wasn't moving features. It was translating decades of spreadsheet habits into a clean, intuitive web experience. This project taught me that enterprise UX is about balance: giving experts power, while making complex systems approachable for everyone.",
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
