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
  approach?: string;
  researchFindings?: { title: string; body: string }[];
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
