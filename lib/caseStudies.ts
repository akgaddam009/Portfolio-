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
  /** Top-of-page metrics. Each metric has:
        value — the headline (rendered big, primary text)
        label — a short eyebrow (mono caps, 1–4 words)
        body  — optional longer descriptive sentence, sentence-case
                body text. Use when the explanation is too long to
                read comfortably as mono caps. */
  metrics?: { value: string; label: string; body?: string }[];
  context?: string;
  contextImage?: CaseStudyImage;
  /** Hero video shown at the top of the case study, right after the summary.
      Useful for mobile-app prototypes where a single screen recording sets context
      better than a static image. Rendered through VideoBlock with appType-aware
      styling (no browser chrome for mobile case studies). */
  contextVideo?: string;
  /** Optional hero video placeholder. Renders a styled empty state in
      the contextVideo position so the page reserves room for a video
      that's planned but not yet recorded. Ignored if `contextVideo`
      is set. */
  videoPlaceholder?: {
    label?: string;
    title?: string;
    sub?: string;
  };
  problem: string;
  problemBreakdown?: { points: string[]; impact: string };
  problemImage?: CaseStudyImage;
  insight?: string;
  insightImage?: CaseStudyImage;
  decisionsIntro?: string;
  decisions: { title: string; body: string; image?: CaseStudyImage; images?: CaseStudyImage[]; imageStack?: boolean; videos?: { src: string; label?: string; caption?: string }[]; persona?: { name: string; role: string; goal: string; pain: string; quote: string }; /** Optional icon glyph name shown beside the decision title. Names map to Icon.tsx exports (e.g. "Scissors", "ChartActivity", "LayoutGrid", "Info"). */ icon?: string }[];
  taskFlow?: { heading?: string; stages: TaskFlowStage[] };
  prototypeVideo?: string;
  /** One or more interactive prototypes embedded as iframes. Each block
      renders inline in the Prototype section, with its label as a sub-heading.
      `screens` is an optional jump-navigation: a tab strip the visitor can
      use to scrub directly to a specific screen via postMessage to the iframe.
      The target page must listen for `{ type: 'astra-nav', screen, role? }`
      messages see /app/astra/p1/page.tsx for the reference implementation. */
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
  /** Optional user cards — renders as a 3-column grid showing distinct roles,
      each with bullet points and a core tension line. Used when a case study
      involves multiple distinct user types that need separate representation. */
  users?: { role: string; name: string; bullets: string[]; coreTension: string }[];
  /** Optional UX goals — renders as a two-column grid alongside productGoals. */
  uxGoals?: { title: string; body: string }[];
  /** Optional product goals — renders as a two-column grid alongside uxGoals. */
  productGoals?: { title: string; body: string }[];
  heroLabel: string;
  /** Optional override for the URL/label shown in the browser chrome above
      the contextVideo and prototypeVideo. When unset, falls back to the
      auto-derived `app.{company}.com`. Use it to put a page title or section
      label in the chrome instead of a generic URL. */
  chromeUrl?: string;
  /** Optional Project Goals card row. Renders as a labelled card grid
      between the Challenge and the Decisions, framing the three lenses
      a project is being evaluated against. */
  projectGoals?: {
    business: string;
    ux: string;
    user: string;
  };
  /** Optional User Segments section. Renders as a 2-card grid (one
      segment per card) followed by a closing paragraph. Used when a
      case study needs to compare two distinct user types side by side
      before getting into the design decisions. */
  userSegments?: {
    intro?: string;
    closing?: string;
    segments: { label: string; name: string; roles: string; body: string }[];
  };
  /** Optional contextCards — structured Context section with multiple
      titled cards. Each card may carry a lead paragraph and / or a
      bullet list. Used when the Context can't be told as one prose
      block. */
  contextCards?: {
    title: string;
    lead?: string;
    points?: string[];
    /** Optional model-pair diagram (left → right) within the card. */
    modelPair?: { leftTag: string; leftName: string; leftDesc: string; rightTag: string; rightName: string; rightDesc: string };
    /** Optional vs-grid (two side-by-side labelled descriptions). */
    vsGrid?: { leftLabel: string; leftDesc: string; rightLabel: string; rightDesc: string };
  }[];
  /** Optional problemCards — same idea as contextCards but for the
      Problem section. Each card has a title plus either a lead or a
      bullet list (often both). Replaces the simple `problem` string
      when present. An optional `image` after a card lets the
      screenshot/illustration sit right after the card it relates to,
      not at the bottom of the section. An optional `breakdown` block
      lets a card carry a secondary section (e.g. "Why it was hard")
      with its own bullets and an impact callout, so the entire
      problem story can live inside one card instead of spilling into
      sibling cards. */
  problemCards?: {
    title: string;
    lead?: string;
    points?: string[];
    image?: CaseStudyImage;
    breakdown?: {
      title?: string;
      points: string[];
      impact?: { title?: string; text: string };
    };
  }[];
  /** Per-case-study overrides for the labels of the major narrative sections.
      Each case study can opt into its own voice for section headings (e.g.
      "What's a Business Listing?" instead of the generic "Overview"), so the
      portfolio doesn't read like a template. Any unset key falls back to the
      renderer's default label. */
  sectionLabels?: {
    overview?: string;
    problem?: string;
    approach?: string;
    research?: string;
    goals?: string;
    decisions?: string;
    outcomes?: string;
    lesson?: string;
    references?: string;
  };
};

export const caseStudies: CaseStudy[] = [
  /* ── #08 Planful ESM Tables — Excel → web (fresh, verbatim from HTML brief) ── */
  {
    slug: "planful-esm-tables",
    number: "08",
    title: "Moving a critical finance workflow from Excel to the web.",
    subtitle:
      "Cut a 3.5 hour finance workflow down to a few minutes, redesigned from Excel to the web.",
    company: "Planful",
    type: "Enterprise SaaS · Fintech",
    role: "Senior Product Designer (IC)",
    timeline: "~1 month design · 2–3 months rollout",
    team: "Product, Engineering, Implementation Consultants",
    tags: ["Enterprise software", "Data workflow", "Fintech", "Web Application"],
    heroLabel: "Real Work",
    /* Confidential — case study sits behind a password gate. */
    confidential: true,

    sectionLabels: {
      overview: "Context",
      problem: "Problem",
      decisions: "Key design decisions",
      outcomes: "Outcome",
      lesson: "What I learned",
      references: "References",
    },

    metrics: [
      {
        value: "3.5 hrs → 10–15 min",
        label: "Time on task",
        body: "~95% reduction. Simple updates that took half a day now take a coffee break.",
      },
      {
        value: "Finance → Any team",
        label: "Data ownership",
        body: "Non-finance teams now load their own data without finance mediating every update.",
      },
    ],

    summary:
      "Moving a critical finance workflow from Excel to the web. Planful's data preparation tool only worked through a complicated Excel plug-in on Windows machines. I designed it as a modern web app.",

    contextVideo: "/images/planful/planful%20product%20video.mov",
    chromeUrl: "app.planful.com",

    /* Plain prose at the top of the Context section — no card, no
       box. Sets up Planful, the role of the live financial model,
       and the controlled workspace (ESM) that feeds it. The ESM vs
       OLAP visual diagram renders below this prose, before the
       remaining structured contextCards. */
    context:
      "Planful software is used by core finance teams at large companies to plan budgets and forecasts. When business needs shift, the data in those models has to shift too. Instead of editing the core model directly, teams load updates through an External Source Model, a controlled workspace that feeds the model without disturbing what's already there.",

    /* One remaining context card — the financial-data-models card
       with the ESM → Core Financial Model pair. The earlier
       "Planful in one line" card was promoted to plain prose
       (above), and the "ESM vs OLAP shapes of data" card was
       removed because the diagram already carries that message. */
    contextCards: [
      {
        title: "How financial data models are managed",
        lead: "Rather than editing the live financial model directly, teams load updated data through a controlled workspace that feeds into it without touching what's already there.",
        modelPair: {
          leftTag: "2D data model",
          leftName: "External Source Model (ESM)",
          leftDesc: "A controlled workspace where teams load, transform, and validate data before it goes anywhere near the live plan.",
          rightTag: "3D data model",
          rightName: "Core financial model",
          rightDesc: "The data driving budgets, forecasts, and headcount plans. Never edited directly.",
        },
      },
    ],

    /* Triggers the existing ESM vs OLAP visual diagram (table grid
       + cube SVGs). Now rendered between the context prose and the
       contextCards, so the reader sees the two data shapes before
       reading about how the workspace feeds the model. */
    insightDiagram: "olap-vs-esm",

    /* Problem section — plain prose sets the scene, the Issues
       card carries the screenshot, breakdown grid, and business
       impact. Image is nested inside the card (not standalone). */
    problem:
      "Before ESM Tables existed, this workflow already had a tool. A key part of it lived inside [Spotlight for Microsoft 365](https://planful.com/solution-hub/spotlight-microsoft/solution/), a custom plug in for Excel, PowerPoint, and Word. It worked — but it came with real friction.",

    /* Issues card — single card with the screenshot, breakdown
       grid, and business-impact callout. Image sits inside the
       card so the visual and the diagnosis stay together. */
    problemCards: [
      {
        title: "Issues with the Excel Spotlight",
        image: {
          src: "/images/planful/data-model-comparison.png",
          alt: "Excel Spotlight, the legacy tool it replaced",
          caption: "Excel Spotlight, the tool teams were using before",
        },
        breakdown: {
          points: [
            "Windows only and desktop bound",
            "Required manual install and regular updates",
            "Couldn't be used on a Mac or in a browser",
            "Hard to use and requires significant training cost. Demands high user cognition during the task",
          ],
          impact: {
            title: "What it cost the business",
            text: "Only a small group of experts could confidently use it. Slower decisions and delayed forecasts. A knowledge bottleneck that didn't scale as the business grew.",
          },
        },
      },
    ],

    userSegments: {
      segments: [
        {
          label: "User group 1",
          name: "Occasional contributor",
          roles: "Sales ops · Marketing · HR",
          body: "Owns a slice of the company's data and updates it on a schedule. Not a finance person. Wants to be in and out fast, drop in numbers, see they look right, get back to the day job.",
        },
        {
          label: "User group 2",
          name: "Senior finance team",
          roles: "FP&A · Finance analysts",
          body: "Maintains the structure itself, defining tables, writing the calculation logic, deciding when data is ready to publish. Years of Excel experience. Cares deeply about precision and won't accept a tool that takes away control.",
        },
      ],
      closing:
        "The challenge wasn't designing for one or the other. It was finding a level of clarity where the contributor could work alone without help, and the finance team didn't feel they'd lost any control.",
    },

    contribution:
      "I led design end to end as Senior Product Designer, from problem framing and scoping through research, UX, interaction details, prototyping, and design QA.\n\nValidated weekly with the PM, leadership, and engineering. Brought in customer implementation consultants to make sure the workflow matched real forecasting rhythms, not what the team imagined them to be. During development, I ran design QA to ensure shipped interactions matched intent.",

    taskFlow: {
      heading: "A clear four-step journey",
      stages: [
        { number: "01", label: "Add",       description: "Upload a file or paste in data" },
        { number: "02", label: "Transform", description: "Apply calculations and shape the data" },
        { number: "03", label: "Validate",  description: "Find and fix anything wrong" },
        { number: "04", label: "Publish",   description: "Send it into the company forecast" },
      ],
    },

    decisions: [
      /* 1 — clearer copy: lead with the user benefit (familiar
         spreadsheet behaviour) instead of the vendor name. */
      {
        title: "A familiar spreadsheet, not a new tool to learn",
        body: "Users already know how spreadsheets work. We built on a battle tested enterprise grid (Syncfusion) so the muscle memory carried over: type, paste, drag, fill. We focused design effort on the workflow itself, not on rebuilding the grid. Scaled to large datasets and met the security standards non negotiable in fintech (SOC 2 Type 2 certified).",
        image: {
          src: "/images/planful/Engg feasibility .png",
          alt: "The Syncfusion grid pattern that shaped the technical approach",
          caption: "Syncfusion, the grid pattern that shaped the technical approach",
        },
      },
      /* 2 — clearer copy + section walkthrough video. */
      {
        title: "Drag, drop, or paste — no waiting for big files",
        body: "Two ways in, both first class: drop a file, or paste straight from a spreadsheet. For files of 50,000+ rows, the first 1,000 rows preview instantly so users can start working before the full upload finishes.",
        videos: [
          {
            src: "/images/planful/Two%20ways%20in,%20with%20progress%20that%20doesn't%20make%20people%20wait%20.mov",
            label: "Drag & drop or paste data",
            caption: "Live preview of the first 1,000 rows while the rest streams in.",
          },
        ],
      },
      /* 3 — navigation / discovery decision. Dynamic Planning is the
         key feature; ESM Tables lives inside it, sequenced fourth
         because it is not part of everyday modeling work. */
      {
        title: "Inside Dynamic Planning — fourth in the list, not the daily driver",
        body: "Dynamic Planning is the core modeling surface finance teams use every day. ESM Tables lives inside it as the fourth tab, not the first thing they open. No separate app to install, no new login — discovering the feature meant clicking one tab over from where they already were.",
        image: {
          src: "/images/planful/Navigation.png",
          alt: "ESM Tables nested inside Dynamic Planning as the fourth tab",
          caption: "Nested inside Dynamic Planning, where the modeling work already happens",
        },
      },
      /* 3 — column settings, now with the section walkthrough video
         (no more Navigation image, which moved up to its own
         decision). */
      {
        title: "Column settings without a maze of menus",
        body: "Every column has a type: text, number, date, formula, constant. A side panel opens from the column header showing only the settings relevant to that type. Power users get full control. Casual users aren't overwhelmed.",
        videos: [
          {
            src: "/images/planful/%20Column%20settings%20without%20a%20maze%20of%20menus.mov",
            label: "Column settings",
            caption: "Type aware side panel surfaces only what's relevant.",
          },
        ],
      },
      /* 4 — TLDR'd. Was two paragraphs explaining the trade-off;
         now a single tighter paragraph that keeps the why and the
         alternative considered. */
      {
        title: "Live colour feedback on formulas",
        body: "Colour highlights show which cells a formula touches as the user types — no preview step, no extra click. I considered a preview step (safer, but adds friction to every formula); the live feedback catches mistakes the moment they happen, so the extra safety wasn't worth the cost.",
        image: {
          src: "/images/planful/formula-feedback.png",
          alt: "Live colour feedback in the formula bar as the user types",
          caption: "Live colour feedback as you type, see what changes before it does",
        },
      },
      /* 5 — plain language. Drop the "not in a post-submission
         report" jargon; the title and body now describe the
         behaviour in everyday terms. Section walkthrough video. */
      {
        title: "Errors users can find and fix in place",
        body: "When data fails validation, the cell itself flags up. A side panel groups issues by type, and each one carries a row link that takes the user straight to the cell. Fix in place, no need to start over.",
        videos: [
          {
            src: "/images/planful/Errors%20flagged%20in%20context,%20not%20in%20a%20post-submission%20report.mov",
            label: "Errors in context",
            caption: "Click a row in the side panel; the grid jumps to the cell.",
          },
        ],
      },
      /* 6 — renamed: the action is bulk data update; overwrite or
         append are the two modes. Section walkthrough video. */
      {
        title: "Bulk data update — overwrite or append",
        body: "At period close, teams replace the full dataset. Mid cycle, they add rows without touching what's already there. Both modes are explicit at upload time, no scripting, no support ticket. A task that used to require rebuilding the whole table now takes a click.",
        videos: [
          {
            src: "/images/planful/Bulk%20Update%20Video.mov",
            label: "Bulk update",
            caption: "Overwrite replaces. Append adds. Both visible at the moment they matter.",
          },
        ],
      },
      /* 7 (publish flow) — REMOVED per the latest direction.
         The end-to-end story is now: load → transform → validate
         → publish → map (next decision). Publish-specific friction
         doesn't earn its own beat. */
      /* 8 — Data Maps: the next phase. No static image (the video covers
         it). Title reframes this as a forward-looking project beat,
         not a post-publish step. */
      {
        title: "The next phase of the project",
        body: "Once data is published, the next step is mapping each ESM column to the right dimension in the core financial model. Today the team handles this through a backend handoff. We designed the next project, Data Maps, where finance teams draw those connections visually themselves, closing the loop end to end.",
        videos: [
          {
            src: "/images/planful/MAPS.mov",
            label: "Data Maps",
            caption: "Visual mapping from ESM columns to financial model dimensions.",
          },
        ],
      },
    ],

    users: [
      {
        role: "Finance Analyst",
        name: "Data preparation · period close",
        bullets: [
          "Manages ESM table updates at quarter and period close",
          "Runs data loads, validates column types, and publishes to the core financial model",
          "Previously tied to a Windows machine running the Excel plug-in",
          "Errors in the load corrupt forecast data downstream — zero tolerance",
        ],
        coreTension: "Speed at period close vs. zero tolerance for data errors",
      },
      {
        role: "Business Team Owner",
        name: "Self-service data loading · no mediator",
        bullets: [
          "Owns the data but couldn't load it — always routed through Finance",
          "Updates were delayed by Finance's queue and manual back-and-forth",
          "Needs to load independently without risking the shared model",
          "Doesn't think in database terms — needs the tool to think for them",
        ],
        coreTension: "Autonomy without the guardrails Finance used to provide",
      },
      {
        role: "Finance Manager",
        name: "Model integrity · data governance",
        bullets: [
          "Accountable for everything that enters the core financial model",
          "Historically gatekept access to prevent costly load errors",
          "Goal: let teams self-serve without losing oversight",
          "A single bad publish can ripple through quarterly forecasts",
        ],
        coreTension: "Can't review every load personally — but can't afford not to",
      },
    ],

    outcomes: [
      "3.5 hrs → 10–15 min. A ~95% reduction in time on task. Simple updates that took half a day now take a coffee break.",
      "Finance → Any team. Non-finance teams now load their own data without finance mediating every update.",
    ],

    references: [
      { label: "Spotlight for Microsoft 365 (Planful)", url: "https://planful.com/solution-hub/spotlight-microsoft/solution/" },
      { label: "Syncfusion enterprise UI components", url: "https://www.syncfusion.com/" },
    ],

    lesson:
      "Accessible enterprise systems aren't built by simplifying complexity. They're built by removing unnecessary judgment, making remaining decisions explicit, and respecting how people already think.\n\nThe 95% time reduction didn't come from a faster grid. It came from asking: \"What decisions can the system make so users only decide when it matters?\"",
  },
  {
    slug: "astra",
    number: "00",
    title: "AI Contract Review & Approval Workflow",
    subtitle: "What does 85–90% AI accuracy look like as a UX? Two flows, built in a weekend with Claude Code.",
    company: "AI Exploration",
    type: "AI · B2B SaaS",
    role: "AI UX",
    timeline: "2026 · Weekend build",
    team: "Solo (designer + Claude Code)",
    tags: ["AI UX", "B2B SaaS", "Built with Claude"],
    heroLabel: "AI Exploration",
    confidential: false,

    summary:
      "==When an AI is right 85–90% of the time, what does the remaining 10–15% look like in the interface?== Two flows, built in a weekend with Claude Code. Working through that answer.",

    context:
      "B2B contract intelligence: AI extracts 30–40 fields from a vendor contract, a human reviews and corrects, approval routes through a configured workflow. The design problem isn't the upload or the dashboard. It's the seam between what the model extracted and what the reviewer actually trusts.",


    users: [
      {
        role: "Procurement Professional",
        name: "Contract review · data accuracy",
        bullets: [
          "Processes 5–15 contracts per day",
          "Reviews AI-extracted fields, corrects mistakes, approves data before it enters the workflow",
          "Errors that slip through have real financial consequences",
          "Needs to move fast without sacrificing accuracy",
        ],
        coreTension: "Speed vs. accuracy at 85–90% AI reliability",
      },
      {
        role: "Legal Professional",
        name: "Contract review · risk and liability",
        bullets: [
          "Reviews the same contract as procurement — but for risk, not data accuracy",
          "Scrutinizes indemnity clauses, SLAs, liability terms",
          "Errors that slip through have real legal consequences",
          "Needs a view scoped to what legal actually owns",
        ],
        coreTension: "Shared document, completely different job",
      },
      {
        role: "Procurement Manager",
        name: "Workflow configuration · approval routing",
        bullets: [
          "Configures 10–15 approval chains across the organisation",
          "Rules vary by contract type, dollar threshold, vendor risk, and department",
          "Currently managed through email — approvals get stuck, skipped, or misrouted",
          "Needs to build and edit rules without engineering support",
        ],
        coreTension: "Complex logic that must feel like plain language",
      },
    ],

    uxGoals: [
      {
        title: "Make AI uncertainty actionable",
        body: "At 85–90% accuracy, every field needs an explicit state — confident, needs review, or missing. The reviewer shouldn't have to infer confidence from a percentage or a tooltip.",
      },
      {
        title: "Separate the two review jobs",
        body: "Procurement and legal read the same contract but own different decisions. One shared surface forces each role to scroll past work that isn't theirs.",
      },
      {
        title: "Make rule-building feel like writing a sentence",
        body: "A procurement manager building approval paths shouldn't have to think in condition logic. Every rule should compile to plain English they can read back and verify.",
      },
    ],

    productGoals: [
      {
        title: "Replace email-based approval routing",
        body: "Approvals currently get stuck, skipped, or sent to the wrong person. A configurable workflow layer removes the manual dependency and makes the process auditable.",
      },
      {
        title: "Reduce errors entering the approval chain",
        body: "Wrong data approved by procurement becomes a legal or financial liability downstream. The review interface is the last line of defence before data is treated as fact.",
      },
      {
        title: "Ship two flows that work as a system",
        body: "Contract review feeds the approval workflow. Designing them separately misses the coupling — the intake quality directly affects what routes through the approval chain.",
      },
    ],

    problem:
      "Most AI products treat model uncertainty as a footnote: a confidence percentage tucked into a tooltip the reviewer never opens. ==That's not a UX solution. It's a UX abdication.==\n\nAt 85–90% accuracy, every extracted field is a micro-decision: trust it, flag it, or fix it. That decision needs to be cheap, visible, and impossible to accidentally skip. Designing that interaction, and the routing layer that governs what happens after, is the actual product.",

    decisions: [
      {
        title: "Two roles, two tracks: same contract, different emphasis",
        body:
          "Procurement resolves factual gaps; legal scrutinizes indemnity, SLAs, and liability terms. A shared screen forces each role to scroll past noise they don't own. The flow separates them: procurement clears the unresolved queue and hands off. Legal sees only what matters to them, in the order it matters.",
      },
      {
        title: "Three explicit field states, not a confidence score",
        body:
          "Confident, needs review, missing: every extracted field carries one. The reviewer sweeps unresolved fields first. The title bar shows a live count. Approval is gated on zero remaining. ==The queue is the work, not the document.==",
      },
      {
        title: "Every workflow rule compiles to a sentence a human can read",
        body:
          "An admin building 10–15 approval paths shouldn't have to parse condition logic in their head. At every step of the builder, the configured rule renders as plain English: 'Software contracts under $50K go to direct manager only.' That sentence is the verification surface during build, and the artifact they scan on the landing page a month later.",
      },
    ],

    // Live React routes fully interactive, role-switched, mock-data-driven.
    prototypeIframes: [
      { label: "Flow 1: AI Contract Review (procurement + legal)", src: "/astra/p1", height: "820px" },
      { label: "Flow 2: Approval Workflow Configuration (admin)",  src: "/astra/p2", height: "820px" },
    ],

    approach:
      "==6–8 hours, problem to live React prototype, with Claude Code.==\n\nClaude was the thought partner throughout, not just for code. Structuring the problem space, pressure-testing interaction hypotheses, iterating wireframes fast enough to throw most of them away. The role-based handoff insight didn't come from a brief; it surfaced asking whose attention an unresolved indemnity clause actually needs.\n\nThe wireframes were the exploration. The React build is the artifact. Both flows are above.",

    outcomes: [
      "Validated by a product-stage B2B company — the interaction model and role-based handoff were reviewed and confirmed as production-ready thinking. Two complete flows shipped in 8 hours.",
    ],

    lesson:
      "AI UX isn't about making the model look smarter. It's about making the human's correction work feel effortless. ==The interface that earns trust makes uncertainty visible, actionable, and impossible to skip.==",

    reflection:
      "The role-based handoff is a hypothesis, not a finding. The real question (do procurement and legal want separate surfaces or a shared negotiation space?) needs users, not wireframes. Speculative work earns its keep by making the bet explicit enough to disprove.",
  },
  /* ── #07 Bringing Apple into Business Listing Performance (fresh, verbatim) ── */
  {
    slug: "apple-business-listings",
    number: "07",
    title: "Bringing Apple Maps into Business Listing Performance",
    subtitle: "Reputation partnered with Apple in 2023, but Apple data was missing from the performance dashboard.",
    company: "Reputation.com",
    type: "Enterprise SaaS · Analytics & Insights",
    role: "Senior UX Designer",
    timeline: "Q4 2024",
    team: "PM, Eng Lead, 3 Backend Engineers, 2 QA",
    tags: ["Enterprise SaaS", "Analytics", "Dashboard Design", "Data Visualisation"],
    heroLabel: "Real Work",
    confidential: false,

    sectionLabels: {
      overview: "What's a Business Listing?",
      problem: "The Challenge",
      decisions: "What I Did",
      outcomes: "The Impact",
      lesson: "What This Taught Me",
    },

    chromeUrl: "app.reputation.com",

    metrics: [
      {
        value: "~68%",
        label: "Weekly adoption",
        body: "of customers check Apple Maps data week on week.",
      },
    ],

    summary:
      "Bringing Apple into a Google-dominant dashboard without making it look broken, while giving all platforms equal respect.",

    contextVideo: "/images/reputation/after.mov",

    context:
      "When you search \"coffee shop near me\" on your phone, the results come from platforms like Google Maps, Apple Maps, or Bing. Each platform shows business information: hours, phone number, photos, reviews. Enterprises with hundreds or thousands of locations need to manage how they appear across all these platforms and track which ones actually bring customers through the door. That's what Reputation does, and the Business Listing Performance dashboard is where customers go to see if their listings are working.",

    contextImage: {
      src: "/images/reputation/Thumbnail .png",
      alt: "Listings Performance dashboard",
    },

    problem:
      "Reputation partnered with Apple in 2023, but Apple data was missing from the performance dashboard. Multi-location businesses managing hundreds of locations couldn't see how their Apple Maps listings were performing, a critical blind spot when 100M+ US customers use Apple Maps daily.\n\nThe real problem wasn't just adding Apple. The existing dashboard was:\n\n- 80% Google-specific widgets (search patterns, calling times, geographic data)\n- 20+ cluttered sections with no clear grouping\n- Lacking clear structure (common metrics mixed with platform-specific data)\n\nThe design question: How do you integrate Apple's limited data into a Google-dominant dashboard without making it look broken, while giving all platforms equal respect?",

    projectGoals: {
      business:
        "Reputation partnered with Apple in 2023. The dashboard hadn't caught up.\n\n- Deliver on the Apple partnership promise by surfacing Apple Business Connect performance data\n- Close the blind spot for 100M+ iOS users who use Apple Maps as default navigation\n- Strengthen Reputation's position as the only platform with unified multi-platform listing insights at enterprise scale",
      ux:
        "- Create platform equity when data capabilities vary dramatically (Google = rich behavioral data, Apple/Bing = basic engagement metrics)\n- Avoid making the dashboard feel like \"Google insights with other platforms tacked on\"\n- Prevent empty states that would make Apple integration look broken or incomplete\n- Enable unified cross-platform performance view without sacrificing valuable platform-specific insights",
      user:
        "- Marketing managers and local SEO specialists managing dozens to thousands of locations\n- Can customers find us on Apple Maps?\n- Which platform drives more direction requests, Google or Apple?\n- Why is our Austin location underperforming on Apple compared to Dallas?\n- Did updating our photos across platforms actually increase engagement?",
    },

    decisions: [
      {
        title: "Made tough calls to create balance",
        body:
          "Removed low-value Google widgets:\n\n- Deprecated APIs (Google was sunsetting them anyway)\n- Niche insights with low engagement (time-of-day calling patterns)\n- Redundant visualizations (had both donut + line chart for many metrics)\n\nResult:\n- Reduced from 20 widgets → 12 focused sections\n- Cut scroll length by 40%\n- Increased value per widget\n\n==This was risky== (customers relied on some of those insights), but data showed users wanted breadth over depth: quick answers across all platforms, not exhaustive detail on one.",
        image: {
          src: "/images/reputation/overview before:after .png",
          alt: "Overview cards before and after: brand colour removed in favour of neutral, data-legible design",
        },
      },
      {
        title: "Designed interactive visualizations for progressive disclosure",
        body:
          "Sunburst chart with drill-down.\n\n==Benefits:== Unified view AND platform-specific insights. No tab-switching or modals needed. Users explore at their own pace.",
        image: {
          src: "/images/reputation/Sunburst Chart Interaction.jpg",
          alt: "Sunburst chart interaction: top-level Actions breakdown, click-through showing source-level distribution",
          caption: "Left: Default view showing action types across all platforms (Calls, Directions, Website). Right: Drill-down view showing platform breakdown after clicking \"Website\".",
        },
      },
      {
        title: "Restructured the entire dashboard into 5 clear sections",
        body:
          "The original dashboard had 20+ widgets with no grouping — common metrics mixed with Google-specific data, making it impossible to scan. The redesign organized everything into 5 clear sections:\n\nOverview: Cross-platform summary (All platforms)\nActions: Calls, directions, website clicks (All platforms)\nImpressions: Listing views breakdown (All platforms)\nDiscovery: Search patterns, device types (Google only)\nAdditional Actions: Platform-unique actions (Per platform)\n\n==Key insight:== By explicitly labeling platform-specific sections, users understood why Apple wasn't everywhere. It's not a gap, it's a capability difference.",
        image: {
          src: "/images/reputation/Before:After image .jpg",
          alt: "Before and after of the Listings Performance dashboard: from a wall of 20+ Google-heavy widgets to a clear 5-section structure with Apple integrated alongside Google, Bing, and Facebook",
          caption: "before: 20+ widgets, no grouping, Google-heavy. After: 5 clear sections, platform equity, Apple integrated.",
        },
      },
      {
        title: "Turned a constraint into education",
        body:
          "During live testing, we discovered Apple suppresses metrics below a privacy threshold (undocumented in their API). Some customers saw zeros and thought it was broken.\n\nSolution: Added a dismissible banner explaining Apple's privacy policy and suggesting longer date ranges for accurate data.\n\n==Proactive transparency > reactive support tickets.==",
        image: {
          src: "/images/reputation/Honest about what Apple can't show.jpg",
          alt: "Apple data suppression notice on the Listings Performance dashboard",
        },
      },
    ],

    outcomesImage: {
      src: "/images/reputation/Listings Performance_Final Design.jpg",
      alt: "Final design of the Listings Performance dashboard: 5-section structure with Apple integrated alongside Google, Bing, and Facebook",
      caption: "the final dashboard: 5 sections, platform equity, Apple integrated.",
    },

    outcomes: [
      "~68% of customers check Apple Maps data week on week.",
    ],

    lesson:
      "Small tasks aren't always small. What started as \"add Apple to the dashboard\" became a 3-month strategic redesign involving weeks of stakeholder alignment, iterative exploration, and post-launch discovery.\n\nPatience through consensus-building pays off. 45 days to finalize the approach felt slow, but that collaborative process with PM, engineering, and leadership created buy-in that made execution smooth and led to a better solution.\n\nSometimes the best UX isn't changing the system. It's helping users understand it. We couldn't change Apple's privacy threshold, but we could educate users about why it exists and what to do about it.",

    references: [
      { label: "Reputation launches integration with Apple Business Connect (Reputation press room)", url: "https://reputation.com/press-room/reputation-launches-integration-with-apple-business-connect/" },
      { label: "Three big customer benefits of Reputation's integration with Apple Business Connect", url: "https://reputation.com/resources/articles/reputation-integration-with-apple-business-connect" },
      { label: "Reputation launches integration with Apple Business Connect (PR Newswire)", url: "https://www.prnewswire.com/news-releases/reputation-launches-integration-with-apple-business-connect-301720451.html" },
      { label: "Introducing Apple Business Connect (Apple Newsroom)", url: "https://www.apple.com/newsroom/2023/01/introducing-apple-business-connect/" },
    ],
  },

  /* ── #06 FanCode Homepage Redesign ── */
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

    uxGoals: [
      {
        title: "Match tournament-first navigation",
        body: "Cricket fans open the app thinking 'IPL today, India tour next' — not 'I want Top Videos'. Every below-fold section should answer a tournament question, not a content-format question.",
      },
      {
        title: "Make below-the-fold scannable",
        body: "More than 90% of users dropped past the first fold without tapping. The structure needed to earn scroll — clear section shapes, consistent rhythm, and deliberate pattern breaks that signal value at a glance.",
      },
      {
        title: "Teach the pattern once, apply it everywhere",
        body: "Each tournament section follows the same structure: matches → updates → videos. Learn it once on IPL and the entire page becomes legible. Cognitive load should drop with every new section, not reset.",
      },
    ],

    productGoals: [
      {
        title: "Reverse below-fold drop-off",
        body: "The dead zone below the first fold wasn't a scroll problem — it was a trust problem. The goal was to turn single-digit below-fold consumption into real traffic distributed across the page.",
      },
      {
        title: "Give PMs more than one slot",
        body: "Every team was lobbying for first-fold space because nothing else converted. Fixing the structure meant unlocking multiple distribution points, so campaigns, partnerships, and content launches had somewhere to land.",
      },
      {
        title: "Ship personalisation in two phases",
        body: "Preference-based personalisation (Continue Watching, Recommended for You) ships immediately. Behaviour-based personalisation waits for the consumption pipeline. Two tracks, clear data milestone between them.",
      },
    ],

    researchEvidence:
      "Before touching any designs, I mapped everything the team already knew: scroll data, PM feedback, CEO input, and months of old research that had never gone anywhere. Four signals kept appearing.",

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
    type: "Consumer Mobile App Sports & Media",
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
      "FanCode is India's premier sports streaming app. It serves two very different users: cricket fans who want live scores and match coverage, and fantasy players building teams for real money. Both arrive through the same front door. During IPL, that door saw its highest traffic of the year. And the highest churn.",

    problem:
      "A user downloads the app to watch something live. There is no live match at that exact moment. Even if there is, clicking it shows a paywall. No instant value. No reason to trust a brand they don't know. ==Users were deleting the app within 2 hours of downloading it.== Competitors like Cricbuzz and Cricinfo didn't have this problem. Not because they had better content, but because new users knew what they were getting from the first tap.",

    approach:
      "Before any design, I needed to understand why users were leaving and whether the problem was the product or the experience. I chose remote user interviews over surveys because I wanted to observe behaviour, not collect opinions. I recruited two specific groups: primary Cricbuzz users who had also installed FanCode, and FanCode users who had downloaded and not returned. Both groups had experienced the same first-minute gap from different sides. After synthesis, I ran a stakeholder workshop with product, marketing, and engineering before presenting recommendations so the findings shaped decisions together rather than being handed down. The output wasn't a report. It was a shared roadmap.",

    researchEvidence:
      "Fifteen interviews, 1 hour each, across 16 cities: Tier 1 and Tier 2. During sessions I asked users to open both apps and show me how they normally used them. They didn't narrate. They navigated. On Cricbuzz, users moved quickly and confidently. On FanCode, they slowed down, looked around, and stopped. The pattern was the same across every session: land on the homepage, tap a match, hit the paywall, pause. The decision to delete wasn't made after extended use. It was made in that one sequence.",

    researchFindings: [
      {
        title: "Trust before transaction",
        body: "Users compared FanCode against apps they already trusted. They were running a trust audit in the first minute. The paywall arrived before they had any reason to believe the product was worth it.",
      },
      {
        title: "Perception of speed",
        body: "Empty screens during loading read as broken, not slow. The old splash showed player images that users tapped past quickly, landing on a homepage that hadn't finished loading.",
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
        body: "The old splash used player imagery. Users tapped through it and landed on a homepage still loading: an empty screen that read as broken. We replaced it with a logo animation: the FC mark expanding to the FANCODE wordmark on the brand's orange. The homepage preloaded behind it. Users perceived the app as fast. The tradeoff was losing player faces at the very top of the funnel. We accepted it because brand recall and perceived speed mattered more at this stage than imagery.",
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
        body: "When a user tapped a match before it started, they landed on the Fantasy tab by default. For non-fantasy users (the majority of new arrivals) this was the wrong starting point. It assumed context they didn't have. We changed the default pre-match landing to the Info tab: teams, match details, tournament context. Pure cricket fans could orient. Fantasy users still had their tab one tap away. The tradeoff was leading with the tab that doesn't drive FanCode's primary monetisation. We accepted it because for a first-time user, context had to come before conversion.",
        image: {
          src: "/images/fancode/match-tab-default.png",
          alt: "Match detail page: Info tab default for FTU left, Fantasy tab default right",
          caption: "Info tab as the default: orient the new user before asking them to transact",
        },
      },
      {
        title: "Upfront registration as a retention bet",
        body: "Data showed registered users had significantly higher retention than guests. The existing app let anyone browse without registering. We designed an upfront registration flow (splash, welcome screen, phone number, OTP, homepage) and ran it as an A/B test. The tradeoff was early friction. Some users would drop before completing registration. But the users who completed it were more likely to come back. We accepted the tradeoff because the goal was retention, not just installs.",
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
        reason: "We considered leading with FanCode's cleaner ad experience in onboarding. Research showed users had tuned out ads on Cricbuzz entirely. They didn't notice them because the core product had already earned their trust. Ads-free was not a reason to switch.",
      },
      {
        title: "Multi-language onboarding",
        reason: "We explored onboarding in Hindi and regional languages. Research showed most users in Tier 2 cities still preferred English. The complexity of localisation wasn't justified by the lift it would have produced at this stage.",
      },
    ],

    outcomes: [
      "Research delivered end-to-end: brief, 15 interviews, affinity mapping, user journey map, and an executive summary that became the input for the product roadmap",
      "Shaped what didn't get built: multisport deprioritised for FTUX, Tour 360 Experience sequenced into the next product cycle. The research gave the team a shared basis for those decisions",
      "Splash redesign shipped: logo animation replaced player imagery, eliminating the empty homepage state on arrival",
      "5-minute free trial introduced on live match pages, giving new users a chance to experience the product before being asked to pay",
      "Match page default landing tab changed from Fantasy to Info for first-time users",
      "Upfront registration A/B test launched to measure the retention impact of early commitment",
      "Homepage restructured with Watch Live as the primary entry point for new users",
    ],

    contribution:
      "I owned the full arc from research planning to shipped designs. I wrote the research brief, defined the recruitment criteria, moderated all 15 interviews, and led synthesis sessions with cross-functional team members as note takers. I facilitated the stakeholder workshop that aligned product, marketing, and engineering on priority order before any design began. I designed the FTUX wireframes, the free trial flow, the match page tab logic, and the homepage restructure. I set the scope constraints that kept navigation experiments phased (one surface at a time) to avoid conflating signals across tests.",

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
      "New users don't evaluate apps on features. They evaluate them on trust. Every decision in this project was ultimately answering one question: why should I believe this app is worth my time right now? Getting the org aligned on that question before any design started was the most valuable thing I did.",

    reflection:
      "I'd involve the growth team earlier in the free trial design. We landed on 5 minutes without access to their conversion window data. That data would have shaped the decision from the start instead of being factored in after the fact.",
  },
  {
    slug: "zetwerk-dc",
    number: "03",
    title: "Supply chain coordination at scale",
    subtitle:
      "Designed a digital delivery challan workflow for a 500+ supplier network, turning a paper-based process that tied up 8 employees full-time into a system any ops user could run, with built-in GST compliance for the tax team.",
    company: "Zetwerk",
    type: "Enterprise Application, Supply Chain",
    role: "Sr. Product Designer",
    timeline: "2 Months",
    team: "PM, Development, QA, Business Analyst, Data Science, Business Operations",
    tags: ["Enterprise SaaS", "Supply Chain", "Workflow Design", "Operations"],
    heroLabel: "Real Work",

    tldr: {
      problem:
        "At 493% YoY growth, every shipment still needed a paper compliance document, written by hand and reconciled over email. Eight people were tied up on it, errors blocked shipments, and the tax team had no visibility until weeks later.",
      approach:
        "Replaced paper with a digital workflow built around one shared record, so the operations team creating it and the tax team using it months later could work from the same source of truth.",
      outcome:
        "90% adoption in three months. Operations got their time back, and the tax team got real-time compliance visibility for the first time.",
    },

    context:
      "Zetwerk is a manufacturing unicorn orchestrating 10,000+ factories, growing at 493% YoY.",

    summary:
      "Its delivery operations were bottlenecked on paper challans handwritten in multiple languages, reconciled through spreadsheets and email. I led end-to-end design of the Delivery Challan module, turning paper into a structured digital workflow embedded in the supply chain platform.",

    metrics: [
      { value: "90%", label: "User adoption in first 3 months" },
      { value: "800+", label: "Monthly challan requests handled" },
      { value: "26", label: "Design QA improvements shipped" },
    ],

    problem:
      "At 493% year-over-year growth, Zetwerk's delivery process was producing 800+ challans a month. Eight people, 500+ suppliers, multiple Indian languages, all on paper, handwritten, reconciled through spreadsheets and email.\n\n==On the surface, the failure looked like delays and compliance risk. Underneath, it was structural.==",

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
      "Nine users, two formats chosen for what each would yield. Five Business Ops users in one-on-one interviews to trace individual workflows step by step. Four Tax Specialists in a single group session: four tax specialists in one room argue with each other faster than four interviews can reconcile them. Anchored in four months of operational data from data science before any design began.",

    researchFindings: [
      {
        title: "Paper is the root of the error chain",
        body: "The reliance on paper-based processes introduced frequent typos and inconsistencies, compounded by challans being handwritten in multiple languages across India. Each manual error downstream required reconciliation through slow email chains, often delaying shipments and tax filings alike.",
      },
      {
        title: "No visibility meant no accountability",
        body: "Business Operations had no way to track delivery status in real time. Tax Specialists couldn't cross-reference challan data for GST reporting without hunting through physical documents. Neither team could close the loop without the other, and neither had the tools to do it.",
      },
    ],

    insight:
      "==Every team was looking at yesterday's version of today's problem.==\n\nBizOps reconstructed status from spreadsheets. Tax validated compliance weeks after goods had shipped. Logistics coordinated over email and WhatsApp. Each team knew what had happened. No team could see what was happening.\n\nWhat made it harder: the same artifact had to serve two users with completely different jobs at completely different times.",

    taskFlow: {
      heading: "Create a challan: five clear stages",
      stages: [
        {
          number: "01",
          label: "DC Page",
          description:
            "View all active, closed, and cancelled delivery challans. Filter, search, export, or create a new one.",
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
            "A formatted PDF preview of the challan before it is created catch errors before they become compliance issues.",
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
        title: "PO-driven auto-population",
        body: "Integrated challan creation directly with the existing order system: enter a Supplier PO and Bill From, Bill To, GST inherit from the order record. The largest class of manual error vanished, in exchange for a hard dependency on order-data quality.",
        image: {
          src: "/images/zetwerk/dc-create.png",
          alt: "Create Delivery Challan form showing transaction details, supply type selection, and auto-populated Bill From and Bill To sections",
          caption: "Enter a Supplier PO. Bill From, Bill To, GST inherit from the order record.",
        },
      },
      {
        title: "Mandatory preview before creation",
        body: "A challan is a legal document that can't be deleted once created, so we added a formatted PDF preview of the exact document about to be generated. The preview is the moment BizOps' speed and Tax's accuracy meet, against the small cost of one extra screen.",
        image: {
          src: "/images/zetwerk/dc-preview.png",
          alt: "Preview of Delivery Challan showing formatted PDF with CNH Manufacturing as sender, item descriptions, quantities, and GST amounts",
          caption: "Preview the exact legal document before it becomes a compliance record.",
        },
      },
      {
        title: "One detail page, three documents",
        body: "Brought the DC document, linked E-way bill, and transport details onto a single detail page rather than three separate views. Density beats navigation when the original failure was context-switching.",
        image: {
          src: "/images/zetwerk/dc-detail.png",
          alt: "Delivery Challan detail view showing DC document attached, E-way bill with dates, and transportation details including logistics company",
          caption: "DC, E-way bill, and transport on one page. Reconciliation stops being three tabs.",
        },
      },
      {
        title: "Return and Dispatch tracking, added scope",
        body: "Added a Return or Dispatch tab on the DC detail so individual goods can be marked dispatched or returned, each action time-stamped to the original challan and invoice. Tax surfaced this as a regulatory requirement in research, so we took the scope hit in exchange for a tighter timeline.",
        image: {
          src: "/images/zetwerk/dc-return-dispatch.png",
          alt: "Return or Dispatch tab on DC detail showing Mark Dispatch and Mark Return actions with reference IDs, dates, and return/dispatch types",
          caption: "Return or Dispatch: full lifecycle of the goods, on the same record.",
        },
      },
    ],

    outcomes: [
      "90% adoption within 3 months, on an internal workflow where users had spent years optimizing around spreadsheets.",
      "BizOps stopped opening four spreadsheets to find one challan.",
      "Tax stopped chasing missing data three months after the fact.",
      "26 design improvements identified and shipped through structured Design QA with PMs and engineers.",
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
      "In manufacturing, every workflow has a compliance shadow: a tax implication, a government requirement, a supplier dependency. The real lesson at Zetwerk was that earning stakeholder trust meant making empathy visible: showing that deeply understanding user workflows was how you reduced regulatory risk, not just improved satisfaction. Great design here wasn't about solving today's problem. It was about building something that scaled with the company's explosive growth.",
  },
  {
    slug: "zetwerk-bu-ecosystem",
    number: "04",
    title: "Enterprise Service Design & Operations Research",
    subtitle: "Five teams. Five broken workflows. Nobody had ever drawn the full picture.",
    company: "Zetwerk",
    type: "User Research",
    role: "User Research & UX Strategy",
    team: "PM, UX Designer, OPEX",
    tags: ["Enterprise SaaS", "Service Design", "Research", "Operations"],
    heroLabel: "Real Work",

    context:
      "Every company has an official system and a shadow system. The official one is in the org chart. The shadow system is the spreadsheet three people maintain, the WhatsApp group where decisions actually get made, the person whose phone you call when the platform doesn't have the answer.\n\nZetwerk was growing at nearly 500% year-on-year. That kind of growth doesn't just stress the product. It stresses every process underneath it. The platform built to coordinate five teams across hundreds of monthly orders was being systematically bypassed. Not broken. Bypassed. Everyone had quietly built their own version of how to get work done.",

    summary:
      "Zetwerk was growing at nearly 500% year-on-year and the PM team had a backlog. Every team had their own version of what needed fixing. Nobody disagreed there was a problem. They disagreed about where it was. I was brought in to answer one question: why isn't the platform working, and what should we build next?\n\nThe answer required mapping how work actually moved across five teams, not how it was supposed to. The output was a service blueprint, a set of personas, and a prioritised roadmap. For the first time, the PM team had a shared, evidence-based basis for what to build and why.",

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
        "The system had no way to filter orders by assigned person. Everyone saw everything, all the time",
        "Business Finance managed profit & loss and financial risk positions entirely in personal Excel files",
        "Procurement negotiated supplier quotes over WhatsApp, leaving no record of the conversation anywhere",
        "Every invoice had to route through a third-party service, adding 15–20 minutes of waiting per order while loaded vehicles sat idle",
        "No real-time delivery tracking: operations managers called drivers directly to find out where shipments were",
        "Sales spent 1 in 4 working hours resolving delivery problems that the system should have prevented",
      ],
      impact:
        "This research gave the PM team their first complete view of how the business operated, replacing five competing team backlogs with a single evidence-based roadmap, and surfacing operational risks the product had never accounted for.",
    },

    approach:
      "Before the first session, I wrote three research questions: How does work actually flow across teams versus how the platform assumes it flows? Where are the highest-leverage points of failure, and who currently owns them? What would it take for each team to trust a shared system over the workarounds they'd already built?\n\nI proposed a service blueprint as the primary research artifact: a cross-functional process map that shows not just what each team does, but where their work depends on, blocks, or is invisible to everyone else's. The PM had already tried fixing the screens. It hadn't moved the numbers. The blueprint was the case for going deeper before going further.\n\nI structured sessions by role, not by division. All Operations users together regardless of which part of the business they worked in. Six people across five roles is a small sample for a system this complex. I addressed it by triangulating against four months of operational data from the data science team, and by treating the blueprint as a working document each team reviewed and corrected before it was used to make any decisions.\n\nOne scope decision I got wrong. Finance wasn't in the original research plan. I'd flagged them as relevant before we started. Payment approvals appeared in my pre-research mapping of the system. The PM pushed back: Finance doesn't interact with the platform directly. I accepted the constraint. Two weeks of Operations interviews pointing at invoice approvals later, I made the case again and got Finance added. I should have held the line in week one.",

    researchEvidence:
      "In-person sessions with six people across five roles: Operations (Bhoopendra and Mithilesh, the latter leading a 16-person regional team), Business Finance (Akansha, added mid-project), Procurement (Rama), and Sales (Priya). Each session traced a full day-to-day workflow with specific focus on when and why they reached for something outside the platform. Findings were triangulated against four months of operational data from the data science team. The completed blueprint was reviewed and corrected in a working session with each team before being used as a decision-making tool.",

    researchFindings: [
      {
        title: "My opening hypothesis was wrong",
        body: "I went in expecting the core problem to be the platform's interface: too generic, no role-based filtering, hard to navigate under time pressure. Two sessions in, that hypothesis was wrong. The interface problems were real but secondary. The platform was built to a process model nobody was actually following. Fixing the UI would have made it slightly less frustrating to use a system that wasn't solving the right problem. Catching this early enough to reorient the interview guide was what made the rest of the research useful.",
      },
      {
        title: "The platform was a record-keeper, not a workflow tool",
        body: "People logged completed actions in the system but did the actual work elsewhere. Bhoopendra kept a personal Excel sheet because the platform couldn't filter to his own orders. Akansha ran financial calculations in spreadsheets only she and one colleague understood. The platform captured what had happened, not what needed to happen next. For five teams coordinating hundreds of moving parts, that distinction isn't a usability issue. It's an operational failure.",
      },
      {
        title: "The invoice delay was a process design failure, not a vendor problem",
        body: "The invoice delay wasn't a vendor performance problem. It was a structural failure nobody had named yet. Every shipment had to route through a third-party service before a vehicle could move: 15–20 minutes per order, every time. Internally it was treated as a speed problem: pressure the vendor. Research showed it was structural: three parties, one sequential handoff, no shared visibility into where the delay was occurring. When a process requires sequential action with no shared view of progress, delays are guaranteed regardless of how fast any one party moves. The vendor wasn't the problem. The architecture was.",
      },
      {
        title: "Sales was being used as the system's customer service fallback",
        body: "60–65% of orders escalated back to the Sales team. Priya's team was spending a quarter of their working hours chasing deliveries, not closing new customers. This wasn't just an efficiency problem. It was a misdirection problem. The most expensive resource in the business was being used to compensate for a system that couldn't handle its own error states. Every hour spent on an escalation is an hour not spent on growth.",
      },
      {
        title: "Finance was carrying a risk the product had never accounted for, and I found it two weeks late",
        body: "This finding arrived later than it should have. Finance wasn't in the original scope. I'd accepted a PM constraint I shouldn't have. When I finally got to Akansha, the risk was deeper than expected: the financial positions protecting the company against material cost swings were managed entirely in a spreadsheet only two people understood. If either was unavailable, those operations stopped. The product had never accounted for it. The delay meant this risk sat undiscovered for longer than it needed to. What I should have done is in the reflection.",
      },
    ],

    insight:
      "The platform was built to record what happened. The business was run by the people filling the gaps between records. Every Excel sheet, every WhatsApp group, every direct call to a driver: those weren't workarounds. They were the actual system. ==The blueprint didn't just map what was broken. It showed what the product had never designed for.==",

    insightImage: {
      src: "/images/zetwerk-bu/service-blueprint.png",
      alt: "BU Ecosystem service blueprint mapping five workflow stages: Customer/ZW Discovery, Enquiry Side Flow, Order Confirmation, Supply Side Flow, and Collections showing customer actions, front-stage and back-stage employee interactions, support processes, and opportunity areas",
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
            "A potential customer is identified. The sales team assesses whether it's worth pursuing, checking creditworthiness, fit, and margin. If yes, they begin onboarding.",
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
            "Operations arranges the full delivery: confirming supplier orders, waiting for invoices from a third-party service, loading the vehicle, and tracking delivery almost entirely over phone and WhatsApp.",
          meta: [
            { label: "Who", value: "Operations" },
            { label: "Tools", value: "Platform, Excel, WhatsApp, phone" },
          ],
        },
        {
          number: "05",
          label: "Collections",
          description:
            "Material delivered. Customer makes payment. The Collections team follows up on any outstanding payments. Finance closes out the order's financials. The cycle ends, or escalates back to Sales if something went wrong.",
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
        body: "The blueprint proved my opening hypothesis wrong, in the right direction. I'd expected to find interface failures. What I found instead was that the failures weren't in the screens at all: they lived in the handoffs between teams. The invoice delay lived between Operations and a third-party service. The Sales escalation problem lived between Operations and the customer. The Finance risk lived between two people and a spreadsheet. None of those were fixable by improving a UI. The tradeoff was delaying visible output by several weeks. The PM accepted it because the previous attempt (fixing screens) hadn't changed anything.",
        image: {
          src: "/images/zetwerk-bu/service-blueprint.png",
          alt: "Full BU Ecosystem service blueprint with five workflow stages across customer actions, front-stage interactions, back-stage interactions, support processes, and opportunity areas",
          caption: "The service blueprint: the primary output that shaped all subsequent product decisions",
          width: "100%",
          zoomLens: true,
        },
      },
      {
        title: "Researching by role, not by division",
        body: "Grouping by role instead of by division was a deliberate structural choice, and it paid off. Zetwerk had three divisions. The natural approach was to go division by division. I structured it differently: all Operations users together regardless of division, all Finance together. The same gaps appeared in every group: no order visibility, invoice delays, the spreadsheet dependency. This wasn't a local problem. It was a system failure that had reproduced itself everywhere. The tradeoff was losing the ability to compare how the same role performed differently across divisions. That comparison would have been useful for a different research question. It wasn't the question we were here to answer.",
        persona: {
          name: "Bhoopendra",
          role: "Operations",
          goal: "Get through his order list and close each one without chasing people manually.",
          pain: "The system shows every department's orders. There's no way to filter to his own, so he keeps a personal Excel sheet instead.",
          quote: "I call the driver directly to find out where the truck is. The system doesn't tell me.",
        },
      },
      {
        title: "Mapping the invoice flow as a systemic failure, not a vendor issue",
        body: "The invoice delay had been treated as a vendor management problem for months: pressure the third-party service, escalate, move faster. Research showed the problem was structural, which meant vendor pressure would never fix it. Three parties, one sequential handoff, no shared visibility into where the delay was occurring. Operations was spending 15–20 minutes per order waiting for paperwork while loaded vehicles sat idle. The reframe mattered because it changed what solutions were even possible: if it's a vendor problem, you escalate. If it's a structural problem, you redesign the process, including building a flow that lets Zetwerk create invoices directly instead of waiting. The tradeoff was a longer timeline. There was no quick version of this fix, and pretending otherwise would have repeated the mistake.",
        persona: {
          name: "Mithilesh",
          role: "Regional Operations Lead · 16-person team",
          goal: "Keep vehicles moving and customers satisfied across a team of 16.",
          pain: "Every invoice requires back-and-forth chasing. Vehicles can't move until paperwork arrives, and the wait happens with a loaded truck sitting at the warehouse.",
          quote: "I do most of my work in the field. I need this on my phone, not a desktop.",
        },
      },
      {
        title: "The team nobody thought to include, including me, initially",
        body: "Finance wasn't in the original scope, and I share responsibility for that. I'd mapped them as relevant before the project started. Payment approvals appeared in my pre-research system diagram. The PM reasoned they didn't interact with the platform directly, so they were outside the brief. I accepted that. I shouldn't have. When Operations interviews kept surfacing invoice approval delays as a blocker, I made the case again. This time it landed. When I got to Akansha, the risk was deeper than the invoice flow: the financial positions protecting the company against material cost swings were managed entirely in a spreadsheet only two people understood. If either was unavailable, those operations stopped. The product had never accounted for it. The tradeoff was two additional weeks to synthesis. The alternative was shipping a roadmap with a critical blind spot.",
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
        body: "The blueprint becoming a roadmap wasn't automatic. It required a two-day prioritisation workshop with all five team leads. Every proposed initiative had to be placed on the map and defend its system-level leverage. Teams argued for their priorities against that evidence. The roadmap that came out wasn't what any single team had wanted. It was what the system showed was needed first.\n\nThe Operations lead said it plainly in the first workshop session: 'This is interesting, but it doesn't help me fix my quarter.' He was right. We spent an additional session with him translating the system findings into near-term priorities his team could act on. That session turned him from a critic of the roadmap into a sponsor of it. Without it, the blueprint would have been an artefact everyone acknowledged and nobody used.\n\nThe tradeoff was that the sequencing made some local fixes look lower priority than they felt to the teams experiencing them. We held the line because the alternative (each team advocating for their own pain) was exactly how decisions had been made before the research. It's why there had been five backlogs and no coherent plan.",
        persona: {
          name: "Priya",
          role: "Sales",
          goal: "Grow her region by closing new customers, not managing existing deliveries.",
          pain: "60–65% of orders escalate back to her team. A quarter of her working hours go into resolving delivery problems that should be handled by Operations.",
          quote: "I want to sell. Right now I'm doing operations work.",
        },
      },
    ],

    outcomes: [
      "A two-day prioritisation workshop using the blueprint as the working document produced the first roadmap all five teams had agreed on, each initiative sequenced by system-level leverage, not by which team shouted loudest",
      "An invoice delay blamed on a slow vendor for months was reframed as a structural process failure, opening solutions the business could actually control, including a direct invoice creation flow that shipped as the Delivery Challan module the following quarter",
      "A critical risk the product had never accounted for was surfaced and escalated: key company operations were running through a spreadsheet only two people could read. This was brought to leadership and added to the risk register",
      "The blueprint became the standing reference document for product planning, referenced in quarterly roadmap sessions for the two quarters that followed",
      "Cross-functional system mapping was adopted as a standard step before major feature work, a direct result of the PM team seeing, for the first time, what scoping without that map had been costing them",
    ],

    contribution:
      "I owned the research strategy, methodology, and execution end-to-end: writing the research questions, scoping the participant set (including making the case for Finance mid-project), designing and moderating all six sessions, building the service blueprint, running the two-day prioritisation workshop with team leads, synthesising into personas and opportunity areas, and presenting the phased roadmap to the product team and leadership. I set the scope, made the methodology calls, and defended the findings when they created friction. A junior UX designer I was mentoring owned design execution throughout, which meant I could stay fully in the research and strategic layer without splitting attention.",

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
      "I would involve Finance from session one and push harder on that call in week one. The argument I accepted ('they don't interact with the platform directly') was never sufficient for a cross-functional system study. I had already noted them in my pre-research mapping. Accepting the constraint meant the Finance research was compressed into one session when two would have produced sharper findings. It also meant a critical risk sat undiscovered for two weeks longer than it needed to. In a project where the entire value is seeing the full system, partial scope is a structural compromise, and I made it when I shouldn't have.",

    lesson:
      "The hardest part of this project wasn't building the blueprint. It was holding the line on scope. I let a reasonable-sounding argument override a research instinct I had already documented. Finance was in my pre-research system map. I flagged them. I let the constraint stand anyway. The lesson isn't about service blueprints or synthesis methods. It's about research independence: when you've mapped the system and identified a dependency, 'they don't use the platform directly' is not sufficient grounds for exclusion. Scope decisions made before the research starts should require the same standard of evidence as the findings that come out of it.",
  },

];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((cs) => cs.slug === slug);
}
