export type CaseStudyImage = {
  src: string;
  alt: string;
  caption?: string;
  width?: string;
  objectPosition?: string;
  displayHeight?: string;
  zoomLens?: boolean;
  fullBleed?: boolean;
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
  type?: string;
  role: string;
  timeline?: string;
  team?: string;
  tags: string[];
  summary: string;
  tldr?: { problem: string; approach: string; outcome: string };
  metrics?: { value: string; label: string }[];
  context?: string;
  contextImage?: CaseStudyImage;
  /** Hero video shown at the top of the case study, right after the summary.
      Useful for mobile-app prototypes where a single screen recording sets context
      better than a static image. Rendered through VideoBlock with appType-aware
      styling (no browser chrome for mobile case studies). */
  contextVideo?: string;
  problem: string;
  problemBreakdown?: { points: string[]; impact: string };
  problemImage?: CaseStudyImage;
  insight?: string;
  insightImage?: CaseStudyImage;
  decisionsIntro?: string;
  decisions: { title: string; body: string; image?: CaseStudyImage; images?: CaseStudyImage[]; imageStack?: boolean; videos?: { src: string; label?: string; caption?: string }[]; persona?: { name: string; role: string; goal: string; pain: string; quote: string } }[];
  taskFlow?: { heading?: string; stages: TaskFlowStage[] };
  prototypeVideo?: string;
  /** One or more interactive prototypes embedded as iframes. Each block
      renders inline in the Prototype section, with its label as a sub-heading.
      `screens` is an optional jump-navigation: a tab strip the visitor can
      use to scrub directly to a specific screen via postMessage to the iframe.
      The target page must listen for `{ type: 'astra-nav', screen, role? }`
      messages — see /app/astra/p1/page.tsx for the reference implementation. */
  prototypeIframes?: {
    label: string;
    src: string;
    height?: string;
    screens?: { label: string; screen: string; role?: "procurement" | "legal" }[];
  }[];
  outcomesImage?: CaseStudyImage;
  outcomesImages?: CaseStudyImage[];
  outcomes: string[];
  insightDiagram?: "olap-vs-esm";
  researchEvidence?: string;
  approach?: string;
  researchFindings?: { title: string; body: string }[];
  scrappedDirections?: { title: string; reason: string }[];
  reflection?: string;
  lesson?: string;
  contribution?: string;
  contributionArtifacts?: string[];
  references?: { label: string; url: string }[];
  confidential?: boolean;
  heroLabel: string;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "astra",
    number: "00",
    title: "AI Contract Review & Approval Workflow",
    subtitle: "What does 85–90% AI accuracy look like as a UX? Two flows, built in a weekend with Claude Code.",
    company: "Speculative · Built with Claude",
    type: "AI · B2B SaaS · Speculative",
    role: "Solo · designer who codes",
    timeline: "2026 · Weekend build",
    team: "Solo (designer + Claude Code)",
    tags: ["AI UX", "B2B SaaS", "Speculative", "Built with Claude", "Contract Intelligence", "Designer Who Codes"],
    heroLabel: "AI Exploration",
    confidential: false,

    summary:
      "==When an AI is right 85–90% of the time, what does the remaining 10–15% look like in the interface?== Two flows, built in a weekend with Claude Code — working through that answer.",

    context:
      "B2B contract intelligence: AI extracts 30–40 fields from a vendor contract, a human reviews and corrects, approval routes through a configured workflow. The design problem isn't the upload or the dashboard — it's the seam between what the model extracted and what the reviewer actually trusts.",


    tldr: {
      problem:  "At 85–90% accuracy, every extracted field is either trusted, flagged, or missing. The interface has to make sweeping those decisions fast — without the reviewer re-reading a 40-page contract.",
      approach: "Two flows, designed as a system. Contract intake as a role-based handoff — procurement resolves, legal approves — and workflow configuration as a plain-language builder. Neither works without the other.",
      outcome:  "Live interactive prototype — click through both flows above. Three-state field resolution, role switching, and a workflow builder that compiles every rule into a sentence a human can actually read.",
    },

    problem:
      "Most AI products treat model uncertainty as a footnote — a confidence percentage tucked into a tooltip the reviewer never opens. ==That's not a UX solution. It's a UX abdication.==\n\nAt 85–90% accuracy, every extracted field is a micro-decision: trust it, flag it, or fix it. That decision needs to be cheap, visible, and impossible to accidentally skip. Designing that interaction — and the routing layer that governs what happens after — is the actual product.",

    insight:
      "==This isn't a screen for reviewing AI output. It's the moment a contract enters the company.== Procurement and legal read the same document with different jobs. One shared review surface buries that handoff under an output list.",

    decisions: [
      {
        title: "Two roles, two tracks — same contract, different emphasis",
        body:
          "Procurement resolves factual gaps; legal scrutinizes indemnity, SLAs, and liability terms. A shared screen forces each role to scroll past noise they don't own. The flow separates them: procurement clears the unresolved queue and hands off — legal sees only what matters to them, in the order it matters.",
      },
      {
        title: "Three explicit field states — not a confidence score",
        body:
          "Confident, needs review, missing — every extracted field carries one. The reviewer sweeps unresolved fields first. The title bar shows a live count. Approval is gated on zero remaining. ==The queue is the work, not the document.==",
      },
      {
        title: "Every workflow rule compiles to a sentence a human can read",
        body:
          "An admin building 10–15 approval paths shouldn't have to parse condition logic in their head. At every step of the builder, the configured rule renders as plain English: 'Software contracts under $50K go to direct manager only.' That sentence is the verification surface during build — and the artifact they scan on the landing page a month later.",
      },
    ],

    // Live React routes — fully interactive, role-switched, mock-data-driven.
    prototypeIframes: [
      { label: "Flow 1 — AI Contract Review (procurement + legal)", src: "/astra/p1", height: "820px" },
      { label: "Flow 2 — Approval Workflow Configuration (admin)",  src: "/astra/p2", height: "820px" },
    ],

    approach:
      "==6–8 hours, problem to live React prototype, with Claude Code.==\n\nClaude was the thought partner throughout — not just for code. Structuring the problem space, pressure-testing interaction hypotheses, iterating wireframes fast enough to throw most of them away. The role-based handoff insight didn't come from a brief; it surfaced asking whose attention an unresolved indemnity clause actually needs.\n\nThe wireframes were the exploration. The React build is the artifact — both flows are above.",

    outcomes: [
      "AI uncertainty as first-class UX: three field states that make the model's gaps actionable, not invisible",
      "The real insight wasn't in the problem statement — procurement and legal read the same contract differently. The interface separates them because the work does",
      "Claude as design collaborator, not code generator — from problem framing to wireframes to shipped prototype, in a weekend",
      "Two flows as a system beat two polished screens built in isolation. The coupling between intake and routing is the product thinking",
    ],

    lesson:
      "AI UX isn't about making the model look smarter. It's about making the human's correction work feel effortless. ==The interface that earns trust makes uncertainty visible, actionable, and impossible to skip.==",

    reflection:
      "The role-based handoff is a hypothesis, not a finding. The real question — do procurement and legal want separate surfaces or a shared negotiation space — needs users, not wireframes. Speculative work earns its keep by making the bet explicit enough to disprove.",
  },
  {
    slug: "planful-esm",
    number: "01",
    title: "Financial Data Management",
    subtitle: "Designed a finance workflow by removing human judgment from every stage the system could own, expanding data access from a handful of power users to any team member in the company.",
    company: "Planful",
    type: "Enterprise SaaS, Fintech",
    role: "Senior Product Designer",
    timeline: "2025",
    team: "PM, Engineering, Finance SMEs",
    tags: ["Enterprise SaaS", "Fintech", "Workflow Design", "Trust Design"],
    heroLabel: "Real Work",
    confidential: true,
    context:
      "Planful is a financial planning and analysis platform. Companies use it to build and manage the financial models that drive budgets, forecasts, and headcount plans. As business needs change, the data inside those models has to change too. Rather than editing the core financial model directly, teams load updated data through an External Source Model: a controlled workspace that feeds into it without touching what is already there.",
    summary:
      "The process to update financial data already existed inside Planful. But in practice, only a few power users could run it. For everyone else, it was either too complex to attempt or too slow to be practical.\n\nThis project was about making that same workflow accessible to any team member who needed to update financial data, without removing the controls that finance teams rely on.",
    metrics: [
      { value: "~95%", label: "Reduction in time on task" },
    ],
    tldr: {
      problem:
        "Updating financial data inside Planful needed Excel Spotlight: a Windows-only tool that took 4–5 hours for simple updates and weeks for complex ones. Only a handful of finance power users could run it.",
      approach:
        "The tool wasn't the bottleneck. The workflow was. Every stage required a human to make a judgement the system could have made instead. I rebuilt the workflow around four clear stages that take the judgement off the user.",
      outcome:
        "Task time dropped from 3.5 hours to 10–15 minutes. For the first time, non-finance teams could load their own data without finance mediating every update.",
    },
    problem:
      "Finance teams had a process that worked, but only for power users.\n\nSimple updates took 4–5 hours. Complex ones took weeks. Only a handful of finance experts could confidently run them. Everyone else either avoided it or waited in a bottleneck, slowing business decisions across departments.\n\nWhy it was hard: The legacy tool (Excel Spotlight) was Windows-only, slow, and required advanced Excel knowledge. But that wasn't the real bottleneck.\n\nThe real constraint: Every stage of updating financial data required a human to make a judgment the system could have made instead.",
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
        "Users were asking the system questions instead of the system answering them automatically.",
    },
    problemImage: {
      src: "/images/planful/data-model-comparison.png",
      alt: "Excel Spotlight, the legacy tool it replaced",
      caption: "Excel Spotlight, the tool teams were using before",
    },
    insight:
      "==The tool wasn't the bottleneck. The workflow was.==\n\nThe design opportunity wasn't to build a faster interface. It was to answer those three questions before the user had to ask them. ==Remove human judgment where the system could be certain.==",
    insightImage: undefined,
    insightDiagram: "olap-vs-esm",
    contextVideo: "/images/planful/Untitled.mp4",
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
    decisionsIntro:
      "Six decisions. One throughline: ==remove uncertainty before it reaches the user.==\n\nEvery call here traded design novelty for predictability. A familiar grid over a custom one. Errors in context instead of after submission. Explicit modes instead of hidden logic. Each decision was a bet that removing a judgment call at design time saves hours in the field.",
    decisions: [
      {
        title: "Built on an enterprise grid, not a custom interface.",
        body: "Finance teams have years of spreadsheet muscle memory. A novel UI would require relearning before it delivered any value. We borrowed Syncfusion's enterprise grid pattern, the same conventions for security, audit, and accessibility that finance tools already trust based on inputs from engineering team.",
        image: {
          src: "/images/planful/Engg feasibility .png",
          alt: "Syncfusion JavaScript Spreadsheet Editor, the enterprise grid pattern engineering referenced",
          caption: "Syncfusion, the grid pattern that shaped the technical approach",
        },
      },
      {
        title: "Nested inside Dynamic Planning, not a standalone tool",
        body: "ESM Tables is not a daily workflow. Users reach for it occasionally. Making it a separate entry point would have created a context switch at the worst moment, when someone is mid-forecast and needs to update a number.",
        image: {
          src: "/images/planful/Navigation.png",
          alt: "ESM Tables within the Dynamic Planning module",
          caption: "ESM Tables inside Dynamic Planning, where the modeling work happens",
          width: "100%",
        },
      },
      {
        title: "Errors flagged inline, not in a post-submission report",
        body: "When data fails validation, the system flags the specific cell, not a modal, not a separate review step. Users see exactly what broke and fix it in place without losing their upload.",
        image: {
          src: "/images/planful/error-handling.png",
          alt: "Inline error validation surfacing data format mismatches contextually",
          caption: "Errors flagged in context. Fix in place, no need to start over.",
        },
      },
      {
        title: "Two explicit update modes: overwrite or append",
        body: "At period close, teams replace the full dataset. Mid-cycle, they add rows without touching what's already there. Made both modes explicit at upload time. No scripting, no support ticket, the right option is visible at the moment it matters.",
        image: {
          src: "/images/planful/bulk-update.png",
          alt: "Overwrite and append modes shown side by side",
          caption: "Two explicit modes at upload time. No hidden logic.",
        },
      },
      {
        title: "Live color feedback on formulas, no preview step",
        body: "As users type a formula, color highlights show exactly which cells are affected. Considered adding a preview step before applying, safer, but adds a click to every formula. Live feedback catches mistakes quickly enough that the extra safety is not worth the friction.",
        image: {
          src: "/images/planful/formula-feedback.png",
          alt: "Formula bar with live colour highlights showing affected cells",
          caption: "Live colour feedback as you type, see what changes before it does",
        },
      },
      {
        title: "What comes next: Maps",
        body: "Data gets cleaned and published through the four-stage flow. But then someone has to route it to the right place in the financial model. At launch, implementation teams did this from the backend. The next concept in the pipeline is Maps: a visual interface where finance teams draw the connections between ESM columns and OLAP dimensions themselves, without needing backend support. Four-step entry plus Maps equals end-to-end control without developer bottlenecks.",
        image: {
          src: "/images/planful/DP Map.png",
          alt: "Dynamic Planning Maps, a visual interface for mapping ESM Table columns to model dimensions",
          caption: "Dynamic Planning Maps, closing the loop from data entry to model impact",
          zoomLens: true,
        },
      },
    ],
    outcomes: [
      "Task time dropped from 3.5 hours to 10–15 minutes.",
      "For the first time, non-finance teams could load their own data without finance mediating every update.",
    ],
    contribution: "I provided design support and QA throughout development: problem diagnosis, research, UX design, interaction details, and design validation as the product was built. I validated weekly with the PM, leadership, and engineering. I brought in customer implementation consultants to validate that the workflow matched real forecasting rhythms. During development, I conducted design QA to ensure shipped interactions matched intent.",
    contributionArtifacts: [
      "Problem framing",
      "Scoping",
      "Research",
      "UX Design",
      "Interaction Design",
      "Prototyping",
    ],
    lesson:
      "Accessible enterprise systems aren't built by simplifying complexity. They're built by removing unnecessary judgment, making remaining decisions explicit, and respecting how people already think.\n\nThe 95% time reduction didn't come from a faster grid. It came from asking: \"What decisions can the system make so humans only decide when it matters?\"",
  },
  {
    slug: "reputation-listings",
    number: "05",
    title: "Listings Analytics Across Google, Apple, Facebook and Bing",
    subtitle: "Adding Apple to a dashboard already running Google, Facebook, and Bing. Easy on paper. Not in practice.",
    company: "Reputation.com",
    type: "Enterprise SaaS · Analytics & Insights",
    role: "Senior UX Designer",
    timeline: "2024",
    team: "Cross-functional team of 9 · External: Apple Inc.",
    tags: ["Enterprise SaaS", "Analytics", "Data Visualisation", "Dashboard Design"],
    heroLabel: "Real Work",
    confidential: true,

    metrics: [
      { value: "4 platforms", label: "Google, Apple, Facebook, Bing on one page" },
      { value: "45 days", label: "from kickoff to ship" },
    ],

    tldr: {
      problem:
        "Apple Maps wasn't in the dashboard at all. The widgets for Google, Facebook, and Bing were inconsistent. Each platform had its own definition of what a customer action even meant.",
      approach:
        "Started with a data inventory before any layout. Killed the cleanest direction (tabs per platform) because it broke the screenshot. Treated the dashboard as a screenshot first, an interactive surface second.",
      outcome:
        "Same dashboard, redrawn. Cross-platform parity, Apple Insights in context, brand colour stripped where it was hurting readability. The page now works as a screenshot, which is how marketing managers actually use it.",
    },

    summary:
      "Adding a fourth platform to a dashboard sounds like a slot. ==It wasn't. Each platform defined a customer action differently, so the page had to decide what it was actually saying.==",

    contextVideo: "/images/reputation/after.mov",

    context:
      "Businesses with hundreds of locations (hospital networks, dealership chains) track listing performance across Google, Apple, Facebook, and Bing on one dashboard. Apple Maps was the missing piece. Adding it sounded like a slot. It wasn't.",

    contextImage: {
      src: "/images/reputation/Thumbnail .png",
      alt: "Listings Performance dashboard",
    },

    problem:
      "Apple Maps was absent. Google, Facebook, and Bing widgets were inconsistent: each platform tracked different actions, so the same metric meant different things depending on source. ==The real problem wasn't missing data. Each platform defines a customer action differently.== You can't just add a fourth source. You have to decide what the page is saying.",

    insight:
      "==The dashboard's most important feature was the screenshot.== Marketing managers don't demo this to leadership. They paste it into slides. Static has to carry the value. Interaction can add, never replace.",

    decisions: [
      {
        title: "Data inventory with the PM before touching any layout",
        body:
          "Before drawing anything, the PM and I mapped every action each platform tracked. ==Three actions overlapped across all four: calls, directions, website. Beyond that, divergence.== Apple had 8 unique action types. Google split Maps and Search. Bing had its own taxonomy.\n\n==Impact:== No widget got designed without data behind it. The map made clear why tabs wouldn't work.",
        image: {
          src: "/images/reputation/Data points .png",
          alt: "Spreadsheet mapping action types across Google, Apple, and Bing: three shared action types highlighted, platform-exclusive actions listed below",
          caption: "Three shared actions across all platforms. Everything else diverged.",
        },
      },
      {
        title: "Tabs per platform: rejected",
        body:
          "Cleanest direction: one tab per source. Killed because comparing Google to Apple meant holding numbers in your head across tabs. ==That's not analysis. That's cognitive overhead.==\n\n==Impact:== Forced the team into the harder problem early: four platforms on one page without hiding the differences.",
        image: {
          src: "/images/reputation/multi tab exploration.png",
          alt: "Rejected tab-based architecture with All, Google, Apple, and Bing tabs",
          caption: "Tabbed exploration: clean, but each platform's data lived in isolation",
        },
      },
      {
        title: "Cross-platform treemap: rejected",
        body:
          "Interactive treemap sized by action volume, with drill-through. Looked good. ==Useless in a screenshot.== Extracting value required interaction. Dev cost was high. Both arguments pointed the same way.\n\n==Impact:== Set the principle the rest of the page leaned on: any chart that needs interaction to be readable doesn't belong here.",
        image: {
          src: "/images/reputation/Interactive Treemap.png",
          alt: "Rejected interactive treemap: source actions and drill-down exploration",
        },
      },
      {
        title: "Additional Actions: the final call",
        body:
          "Static section at the bottom showing source-level breakdown for every platform. Page sequence: common metrics → Google → Discovery → Additional Actions. ==Common first (everyone uses them). Source detail last (not everyone does). The order is the logic.==\n\n==Impact:== Single source of truth for cross-platform comparison, visible in the same screenshot marketing was already pasting into slides.",
        image: {
          src: "/images/reputation/Additional Actions.png",
          alt: "Additional Actions section: source-level breakdown of actions, always visible, no interaction required",
        },
      },
      {
        title: "Overview cards: brand colour removed",
        body:
          "The overview cards leaned on brand colour. Looked polished. ==Made the data harder to read.== Colour was decorating, not communicating. I stripped it back: neutral backgrounds, high-contrast values, consistent type scale.\n\n==Impact:== Headline numbers became readable at a glance. Marketing pushed back on the loss of brand colour. Data legibility won.",
        image: {
          src: "/images/reputation/overview before:after .png",
          alt: "Overview cards before and after: brand colour removed in favour of neutral, data-legible design",
        },
      },
      {
        title: "Drill-down on the donut: interaction as additive, not required",
        body:
          "Actions donut: total volume split by type (Calls, Directions, Website) in the static view. Click a segment, it breaks down by source. ==Static tells the story. Interaction just goes deeper.== Opposite of the treemap, where interaction was required to get any value at all.\n\n==Impact:== Power users got drill-down. Everyone else got a screenshot that still works in a slide.",
        image: {
          src: "/images/reputation/Sunburst Chart Interaction.jpg",
          alt: "Sunburst chart interaction: top-level Actions breakdown, click-through showing source-level distribution",
          caption: "Click a segment, the chart shows source-level breakdown. The screenshot still works without it.",
        },
      },
      {
        title: "Honest about what Apple can't show",
        body:
          "Pilot data showed Apple metrics stuck at zero for some users. Looked like a bug. We talked to Apple. ==Apple suppresses metrics below a privacy threshold and reports them as zero.== We added a plain-language notice on the Apple section with a concrete next step (try a longer date range).\n\n==Impact:== Support tickets about Apple zero-states stopped. Users got the explanation in context instead of filing a bug.",
        image: {
          src: "/images/reputation/Honest about what Apple can't show.jpg",
          alt: "Apple data suppression notice on the Listings Performance dashboard",
        },
      },
      {
        title: "What shipped",
        body:
          "Same dashboard, redrawn. ==The data didn't change. The order did.== Before: Google-heavy, Apple absent, brand colour over readability. After: cross-platform parity, Apple Insights surfaced in context, suppression notice in plain language at the top, source-level breakdown in Additional Actions at the bottom.\n\n==Impact:== One screenshot now told the full cross-platform story. The page that used to need a tab tour was a single scroll.",
        image: {
          src: "/images/reputation/Before:After image .jpg",
          alt: "Before and after of the Listings Performance dashboard, showing the redesigned page with Apple Insights, neutral overview cards, and the Additional Actions section",
        },
      },
    ],

    approach:
      "Design was fast. Coordination wasn't. Nine people across product, engineering, QA, marketing, leadership, plus Apple. ==Every direction went into a working session and either survived or got killed.== One rule never moved: the page has to work as a screenshot.",

    outcomes: [
      "Marketing managers could land on the page and read the headline numbers without scrolling. The page held them longer than the version it replaced.",
      "The release hit its targets on the three signals we tracked: page visits, engagement with the Apple Insights widgets, and Apple delegation completions.",
    ],

    lesson:
      "One page. Eight decisions. 45 days. The hard part wasn't the design. It was navigating around it: what each platform's data means, which interactions are safe to depend on, what users do with the page after they close it. ==The details nobody sees are what held it together.== Labels, tooltips, copy, sequence. None of it shows in a presentation. All of it shows in the product.",

    references: [
      { label: "Reputation launches integration with Apple Business Connect (Reputation press room)", url: "https://reputation.com/press-room/reputation-launches-integration-with-apple-business-connect/" },
      { label: "Three big customer benefits of Reputation's integration with Apple Business Connect", url: "https://reputation.com/resources/articles/reputation-integration-with-apple-business-connect" },
      { label: "Reputation launches integration with Apple Business Connect (PR Newswire)", url: "https://www.prnewswire.com/news-releases/reputation-launches-integration-with-apple-business-connect-301720451.html" },
      { label: "Introducing Apple Business Connect (Apple Newsroom)", url: "https://www.apple.com/newsroom/2023/01/introducing-apple-business-connect/" },
    ],
  },

  /* ── #06 — FanCode Homepage Redesign ── */
  {
    slug: "fancode-homepage",
    number: "06",
    title: "FanCode Homepage Redesign",
    subtitle: "We were sorting the homepage by content. Our users were sorting it by tournament.",
    company: "FanCode",
    type: "Consumer Mobile App · Sports & Streaming",
    role: "Manager UX (IC)",
    timeline: "1 month",
    team: "Product, Data, Content, Engineering",
    tags: ["Consumer Mobile", "Sports", "Homepage", "Retention", "IA", "Design Systems"],
    heroLabel: "Real Work",
    confidential: false,

    metrics: [
      { value: ">90%", label: "of users dropped past the first fold (before)" },
      { value: "3M+", label: "monthly active users on FanCode at the time" },
    ],

    tldr: {
      problem:
        "More than 90% of users dropped past the first fold. Match cards absorbed nearly every click across every cohort. Below the fold was a dead zone.",
      approach:
        "I refused to redesign until I knew what was actually broken. The data, the team, the CEO, and the old research all pointed at the same thing: we'd built the page around the content we had, not around how users think.",
      outcome:
        "The dead zone became a real surface. Sections that sat at single-digit consumption started getting reached, scrolled, and clicked. The homepage moved from one entry point (match card) to many.",
    },

    summary:
      "More than 90% of FanCode users dropped past the first fold. India's all-in-one sports app (live streaming, scores, news, shop, 3M+ monthly active users) was running on a homepage where most of the page was dying below the fold. ==I restructured around how cricket fans actually think: tournament first, then match, then teams and players. The dead zone reversed.==",

    contextVideo: "/images/fancode/hp-overview.mov",

    context:
      "The homepage had become the company's growth bottleneck. Every new feature, content investment, or campaign had to fight for first-fold space because below the fold didn't work. Promotional placements, content launches, partnerships: every team was lobbying for the one slot that converted. Fixing the dead zone wasn't a UX project. It was a growth unlock for the entire product.",

    problem:
      "From the original brief: data suggests users scroll on the Homepage, but very few click or consume anything below the first fold.",

    problemBreakdown: {
      points: [
        "More than 90% of users dropped past the first fold without tapping anything below it",
        "Match cards absorbed almost every click across every cohort (Organic, Marketing, Dream11 fantasy users)",
        "New and diverse content struggled to gain visibility against this concentration",
      ],
      impact: "Saurabh (the first-time user we built the brief around) opened the app from an ad, scrolled, and left without tapping anything past the match card.",
    },

    insight:
      "==The homepage sorted by content format. Cricket fans sort by tournament.== Match the structure to how users actually think, and the rest of the page starts working.",

    approach:
      "The team had been trying to fix this homepage for a while. The metric wasn't moving.\n\nSo before touching the design, I asked a different question: are we even solving the right problem?\n\nI pulled together everything we already knew. The scroll data. What PMs across teams kept saying. The CEO's repeated feedback. Old research that had never gone anywhere. Put it all on one wall.\n\nThe same thing kept showing up. We'd built the homepage around the content we had: Live Updates, Top Videos, Trending. But our users weren't thinking that way. A cricket fan opens the app thinking 'IPL today, India tour next.' Not 'I want to look at Top Videos.' The page was speaking a different language than its users.\n\n==That single shift, sort by tournament not by content type, became the whole strategy.== Every design move came from there. Pattern-based IA. Tournament-shaped blocks. Personalisation as a roadmap, not a launch feature.\n\nThe rest was execution. Scroll audit, competitor benchmark, stakeholder deck, handoff, design QA, post-launch numbers in Looker. The work everyone shows off in a case study. But the actual unlock happened before any of that, when I refused to redesign until I'd asked the right question.",

    researchFindings: [
      {
        title: "Two named users we designed for",
        body: "The brief defined two scenarios. Saurabh: 21-25, cricket-only fan, downloaded FanCode from an ad. Spends time on the homepage trying to understand what the app offers. Karan: 21-25, cricket-only, plays fantasy sports, mid-income, Android plus a Firestick. Already a FanCode user but defaults to Cricbuzz for daily news and scores. His own words from the research: 'FanCode to me should be working, functioning like Cricbuzz, with the value add of live streaming and shopping.' Both followed the same mental model: tournaments, then matches, then teams and players, then updates.",
      },
      {
        title: "What leadership signalled",
        body: "Direct feedback from the CEO lined up with the data. One: make it easy to navigate and find things. Two: explore if we can reduce the size of the nudge in the first fold. Three: it lacks a sense of separation, it's hard to focus on content pieces in the homepage. The third call was the strongest signal that the structural problem was visible to leadership, not just the data.",
      },
      {
        title: "Content team constraints",
        body: "Sessions with the content team showed what was actually possible. Original and partnership content carried different freshness windows and licensing rules. Some sections could be repackaged, like Hot Right Now from breaking news. Others could not, like sponsored Featured Videos. Knowing what could be moved meant the new IA fit content reality, not fought it.",
      },
      {
        title: "The big-tournament exception",
        body: "During IPL (India's biggest annual cricket tournament), one below-fold block pulled an order of magnitude more engagement than every other section. That gap was the proof point. The model could work below the fold when the content was high-value and the user was the right kind of fan. The fix was not teaching users to scroll. It was making every below-fold section earn its place the way IPL already did.",
      },
    ],

    decisions: [
      {
        title: "First fold: lead with what users already click",
        body: "Match cards already absorbed nearly every click across every cohort. So I rebuilt the fold around what users were already doing. Live matches and key highlights got primary slots. I shrank the promo nudge directly addressing the CEO's call: explore if we can reduce the size of the nudge. That gave Featured Videos room to surface below. Match card structure stayed the same because the data proved it was the homepage's primary value. Featured Video size was being A/B tested at handoff. The 'New from FanCode' label was being trialled for removal.\n\n==Impact:== Featured Videos got the visual weight the click data already proved they deserved. The fold stopped competing with itself. The highest-value zone (live match cards) got room to breathe.",
        image: {
          src: "/images/fancode/hp-card-use-case.jpg",
          alt: "Redesigned first fold: contextual filter chips at the top, match-card-led layout below, with the shrunk nudge giving Featured Videos room to surface",
          caption: "the redesigned first fold: filter chips on top, match cards leading, Featured Videos given room below the shrunk nudge",
          displayHeight: "600px",
          objectPosition: "top",
        },
      },
      {
        title: "Tournament-shaped, not content-shaped",
        body: "I reorganised the homepage into modular tournament-based sections. Each tournament got one entry point for everything from it: matches, updates, videos, news. Content from the same tournament stopped scattering across unrelated sections elsewhere on the page. This matched how Karan and Saurabh both navigated. The page finally read coherently for the way fans think.\n\n==Impact:== Below-fold sections stopped feeling random. Cricket fans could scan the page by the only unit that mattered to them: the tournament. The same content that previously got ignored started getting clicked, because users could now find it.",
        image: {
          src: "/images/fancode/hp-new-concepts.jpg",
          alt: "New FanCode homepage concept: each tournament gets its own block with matches, updates, and videos grouped together instead of scattered across content-format sections",
          caption: "each tournament gets one block on the homepage with its matches, updates, and videos grouped together",
          displayHeight: "700px",
          objectPosition: "top",
        },
      },
      {
        title: "One shape, repeated. Learned once, scanned everywhere.",
        body: "The biggest differentiator. I codified the page into one repeating shape. Every tournament-level section followed the same structure:\n\n[Tournament]\n  → Matches\n  → Updates\n  → Videos\n(repeat)\n\nThis created rhythm, reduced cognitive load, and improved scanability. The CEO's call about lack of separation was directly addressed. Users learned the pattern once and could scan the rest. Pattern Breaks like Featured Videos and FanCode Exclusives were used as deliberate interruptions, adding interest without randomness.\n\n==Impact:== The 'lacks separation' problem went away because every section now had the same shape. New content could ship into the existing pattern without redesigning the page, which is what unblocked the PMs lobbying for first-fold space.",
        image: {
          src: "/images/fancode/hp-concept-strategy.jpg",
          alt: "Concept strategy diagram showing the repeating layout pattern applied across tournament-level sections of the homepage",
          caption: "the concept strategy in full: one shape repeated across every tournament section, with deliberate pattern breaks to add interest",
          displayHeight: "700px",
          objectPosition: "top",
        },
      },
      {
        title: "Each tournament got its own back-room",
        body: "I built a dedicated detail page for every tournament. Hero video, every match, every news article, every video clip from that tournament, all in one place. The homepage linked into it via tournament names and a 'See full coverage' CTA. The homepage became the entry point. The tournament page became the depth. This took pressure off the homepage to surface everything itself.\n\n==Impact:== Content distributed across the scroll instead of overloading the top. Each tournament absorbed its full coverage into one page. The homepage stopped trying to be everything for every fan.",
        images: [
          {
            src: "/images/fancode/hp-hybrid-listing.jpg",
            alt: "Tournament detail page for IPL Auction 2022: hero video at top, mixed feed of articles and videos from the same tournament below",
            caption: "the tournament back-room: hero video at top, every article and video from that tournament in one scrollable list",
            displayHeight: "600px",
            objectPosition: "top",
          },
          {
            src: "/images/fancode/hp-hybrid-listing-scroll.jpg",
            alt: "Tournament detail page scrolled, with the tournament name now sticky in the top navigation bar",
            caption: "on scroll, the tournament name sticks in the header so users always know where they are",
            displayHeight: "600px",
            objectPosition: "top",
          },
        ],
      },
      {
        title: "Personalisation as a roadmap, not a launch feature",
        body: "Continue Watching and a Recommended for You row shipped immediately, sourced from preference collection at tournament, team, and player level. The behaviour-based personalisation tier (Recommended for You drawn from what users actually watched, not just what they followed) was deferred until the consumption data pipeline was ready. A clear data milestone marked the upgrade path.\n\n==Impact:== Returning users got a personalisation surface today, not in six months. The structural fix didn't have to wait for the data pipeline. The two tracks ran in parallel, with each tier shipping when its dependencies were ready.",
        image: {
          src: "/images/fancode/hp-user-state-exploration.jpg",
          alt: "Design exploration showing the four homepage states across the personalisation roadmap: first-time user, repeat user with no signal, with partial preferences, and with full behavioural personalisation",
          caption: "the four homepage states the personalisation roadmap was designed for, from first-time user to fully personalised",
          displayHeight: "600px",
          objectPosition: "top",
        },
      },
    ],

    prototypeVideo: "/images/fancode/hp-prototype.mov",

    outcomesImage: {
      src: "/images/fancode/hp-final-ui.jpg",
      alt: "Final FanCode homepage design: first scroll state on the left, light theme and dark theme post-scroll views on the right",
      caption: "final design: first scroll state and the homepage post-first-fold in light and dark themes",
    },

    outcomes: [
      "The dead zone reversed. Sections that previously sat at single-digit consumption started getting reached, scrolled, and clicked.",
      "Behaviour shifted, not just clicks. Dream11 users (almost entirely match-card-only before launch) started opening tournament pages and detail surfaces.",
      "The homepage stopped being a single-lane road. PMs stopped lobbying for the one slot that worked, because there were now many.",
    ],

    scrappedDirections: [
      {
        title: "Partial personalisation now vs full personalisation later",
        reason: "Option A (chose): ship partial personalisation immediately, sourced from preference collection. Continue Watching and a Recommended row went live with the redesign. Option B (rejected): wait for the consumption data pipeline to mature, then ship full personalisation in one release. Why A: six weeks of engineering vs six months. Users got a personalisation surface today. The pipeline matures separately, with a clear data milestone marking when the behavioural layer lands.",
      },
      {
        title: "Cricket-first IA vs multisport parity at launch",
        reason: "Option A (chose): cricket-heavy IA, designed to extend cleanly to other sports later. The cricket experience went deep. Option B (rejected): full parity across football, kabaddi, and NBA from launch. Why A: cricket was the sole priority sport for the next year. Stretching design and content effort across multisport would have weakened the cricket fix that was actually moving the metric. Multisport joins later, on a structure built to receive it.",
      },
      {
        title: "Shrunk nudge vs denser first-fold for promo space",
        reason: "Option A (chose): shrink the promo nudge, give match cards and Featured Videos room. Option B (rejected): denser first-fold with more promotional surface area for campaigns and brand pushes. Why A: data showed match cards absorbed nearly every click. The CEO directly asked to shrink the nudge. Real estate for above-fold promotion was lost, but first-fold clarity was gained, which is what the metric actually needed.",
      },
    ],

    lesson:
      "When one surface underperforms, the cost shows up everywhere else. Teams start lobbying for the one slot that works. Below-fold disengagement was not just a UX problem at FanCode. It was a growth bottleneck. Fixing it unblocked every other team that needed homepage exposure for whatever they were shipping next.",

    reflection:
      "The CEO's feedback (hard to focus, lacks separation, reduce the nudge) was confirmed by the data before we ever heard it. That alignment made the decisions easier. Post-launch, I reviewed the numbers in Looker directly. The drop-off below the fold visibly reversed. But the deeper question, did Karan-shaped users open the competitor less, was never measured. That was the metric the brief actually asked for, and we never built the instrument to answer it.\n\nNext steps: a personalisation engine running on actual behaviour. Sport-level customisation as cricket-only stops being the constraint. Dynamic content ranking rather than static. A/B tests on layout patterns and modules to keep the system learning.",
  },

  {
    slug: "fancode-ftux",
    number: "02",
    title: "First-Time User Experience",
    subtitle: "Users were deleting the app within 2 hours of download. The product worked. The first minute didn't.",
    company: "FanCode",
    type: "Consumer Mobile App — Sports & Media",
    role: "Manager UX",
    timeline: "2021",
    team: "Product, Engineering, Marketing, Content, UI Design",
    tags: ["Consumer Mobile", "Retention Design", "FTUX", "Research"],
    heroLabel: "Real Work",
    confidential: false,

    summary:
      "During IPL, FanCode was acquiring users fast and losing them faster. New users downloaded the app expecting to watch live cricket. Most found no live match. Those who did hit an immediate paywall. The app had no answer for the gap between what users expected and what they actually got. I led the research and redesign across onboarding, the match page, and the homepage to change what new users saw, felt, and decided in those first 60 seconds.",

    metrics: [
      { value: "~2 hrs", label: "Time before new IPL users deleted the app" },
      { value: "15", label: "Remote user interviews across Tier 1 and Tier 2 cities" },
    ],

    context:
      "FanCode is India's premier sports streaming app. It serves two very different users: cricket fans who want live scores and match coverage, and fantasy players building teams for real money. Both arrive through the same front door. During IPL, that door saw its highest traffic of the year — and the highest churn.",

    problem:
      "A user downloads the app to watch something live. There is no live match at that exact moment. Even if there is, clicking it shows a paywall. No instant value. No reason to trust a brand they don't know. ==Users were deleting the app within 2 hours of downloading it.== Competitors like Cricbuzz and Cricinfo didn't have this problem — not because they had better content, but because new users knew what they were getting from the first tap.",

    approach:
      "Before any design, I needed to understand why users were leaving and whether the problem was the product or the experience. I chose remote user interviews over surveys because I wanted to observe behaviour, not collect opinions. I recruited two specific groups: primary Cricbuzz users who had also installed FanCode, and FanCode users who had downloaded and not returned. Both groups had experienced the same first-minute gap from different sides. After synthesis, I ran a stakeholder workshop with product, marketing, and engineering before presenting recommendations — so the findings shaped decisions together rather than being handed down. The output wasn't a report. It was a shared roadmap.",

    researchEvidence:
      "Fifteen interviews, 1 hour each, across 16 cities — Tier 1 and Tier 2. During sessions I asked users to open both apps and show me how they normally used them. They didn't narrate. They navigated. On Cricbuzz, users moved quickly and confidently. On FanCode, they slowed down, looked around, and stopped. The pattern was the same across every session: land on the homepage, tap a match, hit the paywall, pause. The decision to delete wasn't made after extended use. It was made in that one sequence.",

    researchFindings: [
      {
        title: "Trust before transaction",
        body: "Users compared FanCode against apps they already trusted. They were running a trust audit in the first minute. The paywall arrived before they had any reason to believe the product was worth it.",
      },
      {
        title: "Perception of speed",
        body: "Empty screens during loading read as broken, not slow. The old splash showed player images that users tapped past quickly — landing on a homepage that hadn't finished loading.",
      },
      {
        title: "Conflicting personas, one front door",
        body: "Cricket fans and fantasy players had fundamentally different first tasks. The experience was built for neither. For new users who came for live cricket, the default Fantasy tab on the match page was the wrong place to start.",
      },
      {
        title: "Ads don't matter until trust is established",
        body: "Users said they disliked ads. But observation showed they ignored them entirely on Cricbuzz because the core product had already earned their attention. Ads-free was not a reason to switch.",
      },
    ],

    insight:
      "The problem wasn't the paywall. Users had no reason to trust FanCode before they hit it. Every session showed the same pattern: a trust audit in the first 60 seconds. We weren't giving them anything to pass it.",

    decisions: [
      {
        title: "Logo animation as the illusion of speed",
        body: "The old splash used player imagery. Users tapped through it and landed on a homepage still loading — an empty screen that read as broken. We replaced it with a logo animation: the FC mark expanding to the FANCODE wordmark on the brand's orange. The homepage preloaded behind it. Users perceived the app as fast. The tradeoff was losing player faces at the very top of the funnel. We accepted it because brand recall and perceived speed mattered more at this stage than imagery.",
        image: {
          src: "/images/fancode/splash-animation.png",
          alt: "Old player-led splash versus new FC logo animation expanding to FANCODE wordmark on orange",
          caption: "Old splash vs new: logo animation buys time for the homepage to load",
        },
      },
      {
        title: "5 minutes free before the paywall",
        body: "New users had no basis to judge whether FanCode was worth paying for. We introduced a 5-minute free trial on live match pages: Watch Free Now, Free Preview, Playing Video, Free Trial Ended, Buy a Pass. Users could see and verify the actual stream quality before any money changed hands. The tradeoff was giving away paid content. We accepted it because trust had to come before transaction, and a user who experienced the product was far more likely to pay than one who hadn't.",
        image: {
          src: "/images/fancode/free-trial-flow.png",
          alt: "5-minute free trial sequence from Watch Free Now through to Free Trial Ended and Buy a Pass",
          caption: "Free trial flow: Watch Free Now to Free Preview to trial end to purchase prompt",
        },
      },
      {
        title: "Info tab first, Fantasy tab second",
        body: "When a user tapped a match before it started, they landed on the Fantasy tab by default. For non-fantasy users — the majority of new arrivals — this was the wrong starting point. It assumed context they didn't have. We changed the default pre-match landing to the Info tab: teams, match details, tournament context. Pure cricket fans could orient. Fantasy users still had their tab one tap away. The tradeoff was leading with the tab that doesn't drive FanCode's primary monetisation. We accepted it because for a first-time user, context had to come before conversion.",
        image: {
          src: "/images/fancode/match-tab-default.png",
          alt: "Match detail page: Info tab default for FTU left, Fantasy tab default right",
          caption: "Info tab as the default: orient the new user before asking them to transact",
        },
      },
      {
        title: "Upfront registration as a retention bet",
        body: "Data showed registered users had significantly higher retention than guests. The existing app let anyone browse without registering. We designed an upfront registration flow — splash, welcome screen, phone number, OTP, homepage — and ran it as an A/B test. The tradeoff was early friction. Some users would drop before completing registration. But the users who completed it were more likely to come back. We accepted the tradeoff because the goal was retention, not just installs.",
        image: {
          src: "/images/fancode/registration-ab.png",
          alt: "Upfront registration A/B test flow: splash to welcome to phone entry to OTP to homepage",
          caption: "Registration A/B: early commitment in exchange for higher long-term retention",
        },
      },
      {
        title: "Homepage restructured around Watch Live",
        body: "The existing homepage buried live content inside a nav tab. New users arrived looking for live cricket and couldn't find it immediately. We restructured for the first-time experience: Watch Live card prominent at the top, personalised content segments below, and a bottom bar that surfaced Live before Fantasy Stats and Shop. We also explored moving Profile and Explore to the top nav. The tradeoff was running multiple navigation experiments in parallel, which risked muddying the signal. We scoped the first release to the live card and bottom bar only, and deferred the top nav change.",
        image: {
          src: "/images/fancode/homepage-nav.png",
          alt: "Homepage navigation redesign: Watch Live card at top and restructured bottom navigation bar",
          caption: "Watch Live as the first thing users see: what they came for, where they expect it",
        },
      },
    ],

    scrappedDirections: [
      {
        title: "Multisport as a retention hook",
        reason: "Research showed the overwhelming majority of users came for cricket. Surfacing Football and Kabaddi content during onboarding added noise without value for the primary user. Multisport was deprioritised from the first-time experience entirely.",
      },
      {
        title: "Ads-free experience as a value proposition",
        reason: "We considered leading with FanCode's cleaner ad experience in onboarding. Research showed users had tuned out ads on Cricbuzz entirely — they didn't notice them because the core product had already earned their trust. Ads-free was not a reason to switch.",
      },
      {
        title: "Multi-language onboarding",
        reason: "We explored onboarding in Hindi and regional languages. Research showed most users in Tier 2 cities still preferred English. The complexity of localisation wasn't justified by the lift it would have produced at this stage.",
      },
    ],

    outcomes: [
      "Research delivered end-to-end: brief, 15 interviews, affinity mapping, user journey map, and an executive summary that became the input for the product roadmap",
      "Shaped what didn't get built: multisport deprioritised for FTUX, Tour 360 Experience sequenced into the next product cycle — the research gave the team a shared basis for those decisions",
      "Splash redesign shipped: logo animation replaced player imagery, eliminating the empty homepage state on arrival",
      "5-minute free trial introduced on live match pages, giving new users a chance to experience the product before being asked to pay",
      "Match page default landing tab changed from Fantasy to Info for first-time users",
      "Upfront registration A/B test launched to measure the retention impact of early commitment",
      "Homepage restructured with Watch Live as the primary entry point for new users",
    ],

    contribution:
      "I owned the full arc from research planning to shipped designs. I wrote the research brief, defined the recruitment criteria, moderated all 15 interviews, and led synthesis sessions with cross-functional team members as note takers. I facilitated the stakeholder workshop that aligned product, marketing, and engineering on priority order before any design began. I designed the FTUX wireframes, the free trial flow, the match page tab logic, and the homepage restructure. I set the scope constraints that kept navigation experiments phased — one surface at a time — to avoid conflating signals across tests.",

    contributionArtifacts: [
      "Research brief",
      "User interviews",
      "Affinity mapping",
      "Journey mapping",
      "Stakeholder workshop",
      "Wireframes",
      "Interaction design",
      "Prototyping",
    ],

    lesson:
      "New users don't evaluate apps on features. They evaluate them on trust. Every decision in this project was ultimately answering one question: why should I believe this app is worth my time right now? Getting the org aligned on that question — before any design started — was the most valuable thing I did.",

    reflection:
      "I'd involve the growth team earlier in the free trial design. We landed on 5 minutes without access to their conversion window data. That data would have shaped the decision from the start instead of being factored in after the fact.",
  },
  {
    slug: "zetwerk-dc",
    number: "03",
    title: "Supply Chain for Manufacturing",
    subtitle:
      "Zetwerk's rapid expansion exposed inefficiencies in its delivery processes — before, during, and after movement of goods.",
    company: "Zetwerk",
    type: "Enterprise Application — Supply Chain",
    role: "Sr. Product Designer",
    timeline: "2 Months",
    team: "PM, Development, QA, Business Analyst, Data Science, Business Operations",
    tags: ["Enterprise SaaS", "Supply Chain", "Workflow Design", "Operations"],
    heroLabel: "Real Work",

    context:
      "Zetwerk is a fast-growing manufacturing unicorn that simplifies the manufacturing process through a suite of seven proprietary applications. With ~493% YoY growth, its manual delivery operations couldn't keep pace — a 500+ supplier network, 800+ monthly challan requests, and 8 employees bottlenecked in a process that was entirely paper-based, handwritten across multiple languages, and reconciled through spreadsheets and email.",

    summary:
      "Zetwerk needed to digitise its delivery challan workflow — the legal compliance document that travels with every goods shipment. I led end-to-end design of the Delivery Challan module, from user research through Design QA, turning a paper-based, error-prone process into a structured digital workflow embedded in Zetwerk's enterprise supply chain platform.",

    metrics: [
      { value: "90%", label: "User adoption in first 3 months" },
      { value: "800+", label: "Monthly challan requests handled" },
      { value: "26", label: "Design QA improvements shipped" },
    ],

    problem:
      "Every goods shipment at Zetwerk required a Delivery Challan — a legal compliance document. But the process was entirely paper-based, handwritten in multiple languages, and reconciled through spreadsheets and emails. ==With ~493% YoY growth, 8 employees were spending significant time creating challans, errors were causing incorrect shipments, and the tax team had no reliable way to track compliance status.==",

    problemBreakdown: {
      points: [
        "Manual data entry prone to errors and typos",
        "No real-time visibility into delivery or inventory status",
        "Paper challans in multiple languages, hard to standardise",
        "Slow, error-prone communication across warehouse, quality, and logistics teams",
        "8 employees tied up in challan creation for 800+ monthly requests",
        "Compliance risk: delayed or inaccurate tax filings due to missing data",
      ],
      impact:
        "Zetwerk's ~493% YoY growth outpaced its manual delivery processes, creating operational bottlenecks and compliance risks across a 500+ supplier network.",
    },

    approach:
      "Before designing anything, I ran structured user research across two groups with fundamentally different goals: Business Operations (who create challans daily) and Tax Specialists (who use them for GST compliance months later). I chose different methods for each: 1:1 in-depth interviews for the 5 Business Ops users to trace their individual workflows step by step, and a group interview for the 4 Tax Specialists to surface conflicting pain points in one session. I collaborated with data science and product to anchor observations in 4 months of operational data before any design began.",

    researchEvidence:
      "Nine users across two sessions: 5 Business Operations team members in 1:1 in-depth interviews, and 4 Tax Specialists (Chartered Accountants) in a group interview. I also gathered relevant data from the Government GST Portal and existing paper delivery challan documents to understand compliance requirements alongside user workflows.",

    researchFindings: [
      {
        title: "Paper is the root of the error chain",
        body: "The reliance on paper-based processes introduced frequent typos and inconsistencies, compounded by challans being handwritten in multiple languages across India. Each manual error downstream required reconciliation through slow email chains, often delaying shipments and tax filings alike.",
      },
      {
        title: "No visibility meant no accountability",
        body: "Business Operations had no way to track delivery status in real time. Tax Specialists couldn't cross-reference challan data for GST reporting without hunting through physical documents. Neither team could close the loop without the other — and neither had the tools to do it.",
      },
    ],

    insight:
      "The challan wasn't just an operational document — it was a compliance artifact with a second life months later. Every design decision had to serve two completely different users simultaneously: the Business Ops team member creating it under time pressure, and the Tax Specialist who would use it for a government filing. ==Designing for speed without designing for accuracy would have just digitised the chaos.==",

    taskFlow: {
      heading: "Create a challan: five clear stages",
      stages: [
        {
          number: "01",
          label: "DC Page",
          description:
            "View all active, closed, and cancelled delivery challans. Filter, search, export — or create a new one.",
          meta: [
            { label: "Who", value: "Business Ops" },
            { label: "Output", value: "Challan list" },
          ],
        },
        {
          number: "02",
          label: "Create DC",
          description:
            "Enter transaction type, supply type, linked PO, and Bill From / Bill To parties. Auto-populated from the order system.",
          meta: [
            { label: "Who", value: "Business Ops" },
            { label: "Output", value: "DC draft" },
          ],
        },
        {
          number: "03",
          label: "Fill Details",
          description:
            "Add DC items: material codes, quantities, CGST/SGST. All fields validated inline before proceeding.",
          meta: [
            { label: "Who", value: "Business Ops" },
            { label: "Output", value: "Validated items" },
          ],
        },
        {
          number: "04",
          label: "Preview & Download",
          description:
            "A formatted PDF preview of the challan before it is created — catch errors before they become compliance issues.",
          meta: [
            { label: "Who", value: "Business Ops" },
            { label: "Output", value: "Verified challan" },
          ],
        },
        {
          number: "05",
          label: "DC Summary",
          description:
            "The created challan with document attached, E-way bill linked, and transport details recorded. Ready for dispatch.",
          meta: [
            { label: "Who", value: "Business Ops / Tax" },
            { label: "Output", value: "Compliance record" },
          ],
        },
      ],
    },

    decisions: [
      {
        title: "A list-first landing page with clear status filters",
        body: "The existing process had no central view of challans — they lived across emails and spreadsheets. The landing page gives Business Ops a single place to find any challan by status (Active, Closed, Cancelled), search by DC number, filter, or export to CSV. We put 'Create New DC' in the top right. Clear, persistent, not buried. The tradeoff was keeping the list dense — no card view, no summary tiles. For an ops user moving fast through 800+ monthly challans, scan speed mattered more than visual polish.",
        image: {
          src: "/images/zetwerk/dc-landing.png",
          alt: "Delivery Challan landing page showing Active/Closed/Cancelled filter tabs and DC list with Create New DC button",
          caption: "The DC list: one place for every challan, with status filters and direct creation",
        },
      },
      {
        title: "Structured creation form linked to the existing order system",
        body: "Rather than building a standalone form, we integrated the challan creation directly with the existing order system. When a user enters a Supplier PO number, the Bill From and Bill To addresses auto-populate from the order record. This eliminated a major source of manual errors — wrong addresses, mismatched GST numbers — without requiring users to change their mental model of how an order becomes a challan. The tradeoff was a dependency on data quality in the order system. We accepted it because the order system was already the source of truth; keeping it that way was the right call.",
        image: {
          src: "/images/zetwerk/dc-create.png",
          alt: "Create Delivery Challan form showing transaction details, supply type selection, and auto-populated Bill From and Bill To sections",
          caption: "Create DC form: auto-populate from the order system to eliminate address errors",
        },
      },
      {
        title: "A formatted preview before the challan is created",
        body: "A Delivery Challan is a legal document. Once created, it cannot simply be deleted — it becomes a compliance record. We added a preview step that shows the exact formatted PDF the user is about to generate, including all party details, item lines, GST calculations, and transport info. The user can download the preview or go back to edit. The tradeoff was an extra step in the creation flow. We accepted it because the cost of an error in a compliance document far outweighed the cost of an extra screen.",
        image: {
          src: "/images/zetwerk/dc-preview.png",
          alt: "Preview of Delivery Challan showing formatted PDF with CNH Manufacturing as sender, item descriptions, quantities, and GST amounts",
          caption: "DC preview: see the exact legal document before it becomes a compliance record",
        },
      },
      {
        title: "One detail page: DC document, E-way bill, and transport details together",
        body: "After a challan is created, the Business Ops and Tax teams need different things from it: Ops needs the transport details, Tax needs the linked E-way bill and GST amounts. Rather than separate views, we brought everything onto one detail page — the DC document as a downloadable PDF, the linked E-way bill with creation and expiry dates, and transport details. The tradeoff was a denser detail page. We chose density over navigation because these users were reconciling across three documents simultaneously; making them switch contexts would have replicated the spreadsheet problem we were trying to solve.",
        image: {
          src: "/images/zetwerk/dc-detail.png",
          alt: "Delivery Challan detail view showing DC document attached, E-way bill with dates, and transportation details including logistics company",
          caption: "DC detail: document, E-way bill, and transport details in one place",
        },
      },
      {
        title: "Return and Dispatch tracking built into the same challan",
        body: "After goods are dispatched, they sometimes come back — for returns, rework, or job work. The Tax team needed to track these movements for accurate GST compliance. We added a Return or Dispatch tab directly on the DC detail page: users can mark individual goods as dispatched or returned, with each action creating a time-stamped record linked to the original challan and the corresponding invoice. The tradeoff was adding scope mid-project. We accepted it because the tax compliance case — tracking goods movements on job work challans — was a regulatory requirement, not a nice-to-have.",
        image: {
          src: "/images/zetwerk/dc-return-dispatch.png",
          alt: "Return or Dispatch tab on DC detail showing Mark Dispatch and Mark Return actions with reference IDs, dates, and return/dispatch types",
          caption: "Return or Dispatch: track goods movement on the same challan, with a compliance record for each action",
        },
      },
    ],

    outcomes: [
      "Achieved 90% user adoption within the first three months, showcasing the system's usability and effectiveness",
      "Users gained instant access to delivery schedules and status updates — real-time visibility replaced the spreadsheet-and-email loop for Business Operations",
      "Streamlined communication with transportation partners enabled faster resolution of customer inquiries and reduced disputes",
      "26 design improvements identified and shipped through a structured Design QA process, in close collaboration with product managers and developers",
    ],

    contribution:
      "End-to-end design ownership across the full project arc: research planning, moderation of both interview formats (1:1 in-depth and group), synthesis and data collaboration, concept design, usability testing, final designs, and Design QA. I worked across a cross-functional team of PM, Development, QA, Business Analysts, Data Science, and Business Operations throughout.",

    contributionArtifacts: [
      "User Research",
      "Concept Design",
      "Concept Testing",
      "Prototyping",
      "Usability Testing",
      "Design QA",
    ],

    lesson:
      "In manufacturing, every workflow has a compliance shadow — a tax implication, a government requirement, a supplier dependency. The real lesson at Zetwerk was that earning stakeholder trust meant making empathy visible: showing that deeply understanding user workflows was how you reduced regulatory risk, not just improved satisfaction. Great design here wasn't about solving today's problem — it was about building something that scaled with the company's explosive growth.",
  },
  {
    slug: "zetwerk-bu-ecosystem",
    number: "04",
    title: "Enterprise — Service Design & Operations Research",
    subtitle: "Five teams. Five broken workflows. Nobody had ever drawn the full picture.",
    company: "Zetwerk",
    type: "User Research",
    role: "User Research & UX Strategy",
    team: "PM, UX Designer, OPEX",
    tags: ["Enterprise SaaS", "Service Design", "Research", "Operations"],
    heroLabel: "Real Work",

    context:
      "Every company has an official system and a shadow system. The official one is in the org chart. The shadow system is the spreadsheet three people maintain, the WhatsApp group where decisions actually get made, the person whose phone you call when the platform doesn't have the answer.\n\nZetwerk was growing at nearly 500% year-on-year. That kind of growth doesn't just stress the product — it stresses every process underneath it. The platform built to coordinate five teams across hundreds of monthly orders was being systematically bypassed. Not broken. Bypassed. Everyone had quietly built their own version of how to get work done.",

    summary:
      "Zetwerk was growing at nearly 500% year-on-year and the PM team had a backlog. Every team had their own version of what needed fixing. Nobody disagreed there was a problem — they disagreed about where it was. I was brought in to answer one question: why isn't the platform working, and what should we build next?\n\nThe answer required mapping how work actually moved across five teams — not how it was supposed to. The output was a service blueprint, a set of personas, and a prioritised roadmap. For the first time, the PM team had a shared, evidence-based basis for what to build and why.",

    tldr: {
      problem: "Five teams had quietly bypassed the platform. Nobody had mapped where work actually flowed.",
      approach: "Role-based interviews + a service blueprint reviewed and corrected by every team.",
      outcome: "Replaced five competing team backlogs with one evidence-based product roadmap.",
    },

    metrics: [
      { value: "5 backlogs → 1", label: "Competing team roadmaps replaced by a single sequenced plan the PM team could act on" },
    ],

    problem:
      "The platform had one job: keep five teams working from the same picture. In practice, every team had quietly built their own version. The operations team kept personal spreadsheets because the system couldn't show them only their own orders. Finance ran critical calculations in Excel files that only two people in the company understood. Sales managed new inquiries entirely over WhatsApp. The platform was full of data. ==The system existed. The work happened outside it.==",

    problemBreakdown: {
      points: [
        "The system had no way to filter orders by assigned person — everyone saw everything, all the time",
        "Business Finance managed profit & loss and financial risk positions entirely in personal Excel files",
        "Procurement negotiated supplier quotes over WhatsApp, leaving no record of the conversation anywhere",
        "Every invoice had to route through a third-party service — adding 15–20 minutes of waiting per order while loaded vehicles sat idle",
        "No real-time delivery tracking — operations managers called drivers directly to find out where shipments were",
        "Sales spent 1 in 4 working hours resolving delivery problems that the system should have prevented",
      ],
      impact:
        "This research gave the PM team their first complete view of how the business operated — replacing five competing team backlogs with a single evidence-based roadmap, and surfacing operational risks the product had never accounted for.",
    },

    approach:
      "Before the first session, I wrote three research questions: How does work actually flow across teams versus how the platform assumes it flows? Where are the highest-leverage points of failure — and who currently owns them? What would it take for each team to trust a shared system over the workarounds they'd already built?\n\nI proposed a service blueprint as the primary research artifact — a cross-functional process map that shows not just what each team does, but where their work depends on, blocks, or is invisible to everyone else's. The PM had already tried fixing the screens. It hadn't moved the numbers. The blueprint was the case for going deeper before going further.\n\nI structured sessions by role, not by division — all Operations users together regardless of which part of the business they worked in. Six people across five roles is a small sample for a system this complex. I addressed it by triangulating against four months of operational data from the data science team, and by treating the blueprint as a working document each team reviewed and corrected before it was used to make any decisions.\n\nOne scope decision I got wrong. Finance wasn't in the original research plan. I'd flagged them as relevant before we started — payment approvals appeared in my pre-research mapping of the system. The PM pushed back: Finance doesn't interact with the platform directly. I accepted the constraint. Two weeks of Operations interviews pointing at invoice approvals later, I made the case again and got Finance added. I should have held the line in week one.",

    researchEvidence:
      "In-person sessions with six people across five roles: Operations (Bhoopendra and Mithilesh, the latter leading a 16-person regional team), Business Finance (Akansha, added mid-project), Procurement (Rama), and Sales (Priya). Each session traced a full day-to-day workflow with specific focus on when and why they reached for something outside the platform. Findings were triangulated against four months of operational data from the data science team. The completed blueprint was reviewed and corrected in a working session with each team before being used as a decision-making tool.",

    researchFindings: [
      {
        title: "My opening hypothesis was wrong",
        body: "I went in expecting the core problem to be the platform's interface — too generic, no role-based filtering, hard to navigate under time pressure. Two sessions in, that hypothesis was wrong. The interface problems were real but secondary. The platform was built to a process model nobody was actually following. Fixing the UI would have made it slightly less frustrating to use a system that wasn't solving the right problem. Catching this early enough to reorient the interview guide was what made the rest of the research useful.",
      },
      {
        title: "The platform was a record-keeper, not a workflow tool",
        body: "People logged completed actions in the system but did the actual work elsewhere. Bhoopendra kept a personal Excel sheet because the platform couldn't filter to his own orders. Akansha ran financial calculations in spreadsheets only she and one colleague understood. The platform captured what had happened — not what needed to happen next. For five teams coordinating hundreds of moving parts, that distinction isn't a usability issue. It's an operational failure.",
      },
      {
        title: "The invoice delay was a process design failure, not a vendor problem",
        body: "The invoice delay wasn't a vendor performance problem — it was a structural failure nobody had named yet. Every shipment had to route through a third-party service before a vehicle could move: 15–20 minutes per order, every time. Internally it was treated as a speed problem — pressure the vendor. Research showed it was structural: three parties, one sequential handoff, no shared visibility into where the delay was occurring. When a process requires sequential action with no shared view of progress, delays are guaranteed regardless of how fast any one party moves. The vendor wasn't the problem. The architecture was.",
      },
      {
        title: "Sales was being used as the system's customer service fallback",
        body: "60–65% of orders escalated back to the Sales team. Priya's team was spending a quarter of their working hours chasing deliveries, not closing new customers. This wasn't just an efficiency problem — it was a misdirection problem. The most expensive resource in the business was being used to compensate for a system that couldn't handle its own error states. Every hour spent on an escalation is an hour not spent on growth.",
      },
      {
        title: "Finance was carrying a risk the product had never accounted for — and I found it two weeks late",
        body: "This finding arrived later than it should have. Finance wasn't in the original scope — I'd accepted a PM constraint I shouldn't have. When I finally got to Akansha, the risk was deeper than expected: the financial positions protecting the company against material cost swings were managed entirely in a spreadsheet only two people understood. If either was unavailable, those operations stopped. The product had never accounted for it. The delay meant this risk sat undiscovered for longer than it needed to. What I should have done is in the reflection.",
      },
    ],

    insight:
      "The platform was built to record what happened. The business was run by the people filling the gaps between records. Every Excel sheet, every WhatsApp group, every direct call to a driver — those weren't workarounds. They were the actual system. ==The blueprint didn't just map what was broken. It showed what the product had never designed for.==",

    insightImage: {
      src: "/images/zetwerk-bu/service-blueprint.png",
      alt: "BU Ecosystem service blueprint mapping five workflow stages: Customer/ZW Discovery, Enquiry Side Flow, Order Confirmation, Supply Side Flow, and Collections — showing customer actions, front-stage and back-stage employee interactions, support processes, and opportunity areas",
      caption: "The service blueprint: five stages, six user types, and every point where the work left the system",
      width: "100%",
    },

    taskFlow: {
      heading: "Five stages, one system",
      stages: [
        {
          number: "01",
          label: "Discovery",
          description:
            "A potential customer is identified. The sales team assesses whether it's worth pursuing — checking creditworthiness, fit, and margin. If yes, they begin onboarding.",
          meta: [
            { label: "Who", value: "Sales" },
            { label: "Tools", value: "WhatsApp, referrals" },
          ],
        },
        {
          number: "02",
          label: "Enquiry",
          description:
            "Customer asks for a price quote. Procurement contacts 2–3 suppliers over WhatsApp to get prices. Sales negotiates terms. The entire process happens outside any system.",
          meta: [
            { label: "Who", value: "Sales, Procurement" },
            { label: "Tools", value: "Email, WhatsApp, calls" },
          ],
        },
        {
          number: "03",
          label: "Order Confirmation",
          description:
            "Customer sends a formal purchase order. Sales logs it in the platform. Finance approves it. The order is handed off to Operations to arrange delivery.",
          meta: [
            { label: "Who", value: "Sales, Finance" },
            { label: "Tools", value: "Internal platform" },
          ],
        },
        {
          number: "04",
          label: "Fulfilment",
          description:
            "Operations arranges the full delivery: confirming supplier orders, waiting for invoices from a third-party service, loading the vehicle, and tracking delivery — almost entirely over phone and WhatsApp.",
          meta: [
            { label: "Who", value: "Operations" },
            { label: "Tools", value: "Platform, Excel, WhatsApp, phone" },
          ],
        },
        {
          number: "05",
          label: "Collections",
          description:
            "Material delivered. Customer makes payment. The Collections team follows up on any outstanding payments. Finance closes out the order's financials. The cycle ends — or escalates back to Sales if something went wrong.",
          meta: [
            { label: "Who", value: "Collections, Finance" },
            { label: "Tools", value: "Platform, phone" },
          ],
        },
      ],
    },

    decisions: [
      {
        title: "A service blueprint before any wireframes",
        body: "The blueprint proved my opening hypothesis wrong — in the right direction. I'd expected to find interface failures. What I found instead was that the failures weren't in the screens at all: they lived in the handoffs between teams. The invoice delay lived between Operations and a third-party service. The Sales escalation problem lived between Operations and the customer. The Finance risk lived between two people and a spreadsheet. None of those were fixable by improving a UI. The tradeoff was delaying visible output by several weeks. The PM accepted it because the previous attempt — fixing screens — hadn't changed anything.",
        image: {
          src: "/images/zetwerk-bu/service-blueprint.png",
          alt: "Full BU Ecosystem service blueprint with five workflow stages across customer actions, front-stage interactions, back-stage interactions, support processes, and opportunity areas",
          caption: "The service blueprint — the primary output that shaped all subsequent product decisions",
          width: "100%",
          zoomLens: true,
        },
      },
      {
        title: "Researching by role, not by division",
        body: "Grouping by role instead of by division was a deliberate structural choice — and it paid off. Zetwerk had three divisions. The natural approach was to go division by division. I structured it differently: all Operations users together regardless of division, all Finance together. The same gaps appeared in every group — no order visibility, invoice delays, the spreadsheet dependency. This wasn't a local problem. It was a system failure that had reproduced itself everywhere. The tradeoff was losing the ability to compare how the same role performed differently across divisions. That comparison would have been useful for a different research question. It wasn't the question we were here to answer.",
        persona: {
          name: "Bhoopendra",
          role: "Operations",
          goal: "Get through his order list and close each one without chasing people manually.",
          pain: "The system shows every department's orders. There's no way to filter to his own — so he keeps a personal Excel sheet instead.",
          quote: "I call the driver directly to find out where the truck is. The system doesn't tell me.",
        },
      },
      {
        title: "Mapping the invoice flow as a systemic failure, not a vendor issue",
        body: "The invoice delay had been treated as a vendor management problem for months — pressure the third-party service, escalate, move faster. Research showed the problem was structural, which meant vendor pressure would never fix it. Three parties, one sequential handoff, no shared visibility into where the delay was occurring. Operations was spending 15–20 minutes per order waiting for paperwork while loaded vehicles sat idle. The reframe mattered because it changed what solutions were even possible: if it's a vendor problem, you escalate. If it's a structural problem, you redesign the process — including building a flow that lets Zetwerk create invoices directly instead of waiting. The tradeoff was a longer timeline. There was no quick version of this fix, and pretending otherwise would have repeated the mistake.",
        persona: {
          name: "Mithilesh",
          role: "Regional Operations Lead · 16-person team",
          goal: "Keep vehicles moving and customers satisfied across a team of 16.",
          pain: "Every invoice requires back-and-forth chasing. Vehicles can't move until paperwork arrives — and the wait happens with a loaded truck sitting at the warehouse.",
          quote: "I do most of my work in the field. I need this on my phone, not a desktop.",
        },
      },
      {
        title: "The team nobody thought to include — including me, initially",
        body: "Finance wasn't in the original scope, and I share responsibility for that. I'd mapped them as relevant before the project started — payment approvals appeared in my pre-research system diagram. The PM reasoned they didn't interact with the platform directly, so they were outside the brief. I accepted that. I shouldn't have. When Operations interviews kept surfacing invoice approval delays as a blocker, I made the case again. This time it landed. When I got to Akansha, the risk was deeper than the invoice flow: the financial positions protecting the company against material cost swings were managed entirely in a spreadsheet only two people understood. If either was unavailable, those operations stopped. The product had never accounted for it. The tradeoff was two additional weeks to synthesis. The alternative was shipping a roadmap with a critical blind spot.",
        persona: {
          name: "Akansha",
          role: "Business Finance",
          goal: "Manage the company's financial risk positions accurately and respond quickly when leadership needs a report.",
          pain: "All of her calculations and risk positions live in a personal Excel sheet that only she and one colleague understand. If either is unavailable, those operations stop.",
          quote: "Whenever Marketing needs a report, I spend two full days recalculating everything from scratch.",
        },
      },
      {
        title: "One shared map instead of five competing backlogs",
        body: "The blueprint becoming a roadmap wasn't automatic — it required a two-day prioritisation workshop with all five team leads. Every proposed initiative had to be placed on the map and defend its system-level leverage. Teams argued for their priorities against that evidence. The roadmap that came out wasn't what any single team had wanted. It was what the system showed was needed first.\n\nThe Operations lead said it plainly in the first workshop session: 'This is interesting, but it doesn't help me fix my quarter.' He was right. We spent an additional session with him translating the system findings into near-term priorities his team could act on. That session turned him from a critic of the roadmap into a sponsor of it. Without it, the blueprint would have been an artefact everyone acknowledged and nobody used.\n\nThe tradeoff was that the sequencing made some local fixes look lower priority than they felt to the teams experiencing them. We held the line because the alternative — each team advocating for their own pain — was exactly how decisions had been made before the research. It's why there had been five backlogs and no coherent plan.",
        persona: {
          name: "Priya",
          role: "Sales",
          goal: "Grow her region by closing new customers — not managing existing deliveries.",
          pain: "60–65% of orders escalate back to her team. A quarter of her working hours go into resolving delivery problems that should be handled by Operations.",
          quote: "I want to sell. Right now I'm doing operations work.",
        },
      },
    ],

    outcomes: [
      "A two-day prioritisation workshop using the blueprint as the working document produced the first roadmap all five teams had agreed on — each initiative sequenced by system-level leverage, not by which team shouted loudest",
      "An invoice delay blamed on a slow vendor for months was reframed as a structural process failure — opening solutions the business could actually control, including a direct invoice creation flow that shipped as the Delivery Challan module the following quarter",
      "A critical risk the product had never accounted for was surfaced and escalated: key company operations were running through a spreadsheet only two people could read — this was brought to leadership and added to the risk register",
      "The blueprint became the standing reference document for product planning — referenced in quarterly roadmap sessions for the two quarters that followed",
      "Cross-functional system mapping was adopted as a standard step before major feature work — a direct result of the PM team seeing, for the first time, what scoping without that map had been costing them",
    ],

    contribution:
      "I owned the research strategy, methodology, and execution end-to-end: writing the research questions, scoping the participant set (including making the case for Finance mid-project), designing and moderating all six sessions, building the service blueprint, running the two-day prioritisation workshop with team leads, synthesising into personas and opportunity areas, and presenting the phased roadmap to the product team and leadership. I set the scope, made the methodology calls, and defended the findings when they created friction. A junior UX designer I was mentoring owned design execution throughout — which meant I could stay fully in the research and strategic layer without splitting attention.",

    contributionArtifacts: [
      "Research Strategy",
      "In-person Interviews",
      "Service Blueprint",
      "Persona Development",
      "Synthesis",
      "Initiative Roadmap",
      "Design Mentorship",
    ],

    reflection:
      "I would involve Finance from session one and push harder on that call in week one. The argument I accepted — 'they don't interact with the platform directly' — was never sufficient for a cross-functional system study. I had already noted them in my pre-research mapping. Accepting the constraint meant the Finance research was compressed into one session when two would have produced sharper findings. It also meant a critical risk sat undiscovered for two weeks longer than it needed to. In a project where the entire value is seeing the full system, partial scope is a structural compromise — and I made it when I shouldn't have.",

    lesson:
      "The hardest part of this project wasn't building the blueprint. It was holding the line on scope. I let a reasonable-sounding argument override a research instinct I had already documented. Finance was in my pre-research system map. I flagged them. I let the constraint stand anyway. The lesson isn't about service blueprints or synthesis methods. It's about research independence: when you've mapped the system and identified a dependency, 'they don't use the platform directly' is not sufficient grounds for exclusion. Scope decisions made before the research starts should require the same standard of evidence as the findings that come out of it.",
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((cs) => cs.slug === slug);
}
