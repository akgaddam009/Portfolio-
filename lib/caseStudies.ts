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

/* Tonal palette for inline chips embedded in case study hero titles.
   Mirrors the home About panel H1 chip system. */
export type CaseStudyChipTone = "indigo" | "teal" | "amber" | "violet" | "emerald";

export type CaseStudy = {
  slug: string;
  number: string;
  title: string;
  /** Optional map of phrase → tone. Each phrase found in `title` is rendered
      as an InlineChip in the detail hero. Plain string remains the source of
      truth (used for SEO, OG tags, sitemap, etc.). */
  titleHighlights?: Record<string, CaseStudyChipTone>;
  subtitle: string;
  /** Short impact statement shown on the Selected Work card thumbnail.
      Replaces the subtitle in the card view. should convey the key outcome
      in ≤ 12 words. If absent, falls back to the first metric or subtitle. */
  cardImpact?: string;
  company?: string;
  type?: string;
  role: string;
  timeline?: string;
  team?: string;
  tags: string[];
  summary: string;
  tldr?: { problem: string; approach: string; outcome: string };
  /** Top-of-page metrics. Each metric has:
        value. the headline (rendered big, primary text)
        label. a short eyebrow (mono caps, 1 to 4 words)
        body . optional longer descriptive sentence, sentence-case
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
  problemBreakdown?: { points: string[]; richPoints?: { title: string; bullets: string[] }[]; impact?: string };
  problemImage?: CaseStudyImage;
  insight?: string;
  insightImage?: CaseStudyImage;
  decisionsIntro?: string;
  decisions?: { title: string; body: string; image?: CaseStudyImage; images?: CaseStudyImage[]; imageStack?: boolean; videos?: { src: string; label?: string; caption?: string }[]; persona?: { name: string; role: string; goal: string; pain: string; quote: string }; /** Optional icon glyph name shown beside the decision title. Names map to Icon.tsx exports (e.g. "Scissors", "ChartActivity", "LayoutGrid", "Info"). */ icon?: string }[];
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
  /** Structured learnings block. `northStar` is the headline insight rendered
      large and featured; `items` are the supporting takeaways shown as a
      scannable list below it. When present, replaces the plain `lesson` text
      in the Learnings section for fancode-homepage. */
  learnings?: { northStar: string; items: string[] };
  contribution?: string;
  contributionArtifacts?: string[];
  references?: { label: string; url: string }[];
  confidential?: boolean;
  /** Optional user cards. renders as a 3-column grid showing distinct roles,
      each with bullet points and a core tension line. Used when a case study
      involves multiple distinct user types that need separate representation. */
  users?: { role: string; name: string; bullets: string[]; coreTension: string }[];
  /** Optional UX goals. renders as a two-column grid alongside productGoals. */
  uxGoals?: { title: string; body: string }[];
  /** Optional product goals. renders as a two-column grid alongside uxGoals. */
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
  /** Optional contextCards. structured Context section with multiple
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
  /** Optional problemCards. same idea as contextCards but for the
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
  /** Optional visual stat blocks for the Overview. */
  contextStats?: { stat: string; label: string }[];
  /** Optional app store links rendered in the Overview. */
  appStoreLinks?: { android?: string; ios?: string };
  /** Optional named context section rendered between Overview and Problem. */
  contextSection?: { title: string; intro?: string; cards: { tag: string; body: string }[] };
  /** Optional display stat at the top of the Problem section. */
  problemStat?: { stat: string; label: string };
  /** Optional sub-heading rendered above the problemCards list. */
  problemCardsLabel?: string;
  /** Optional Discovery & Research section rendered after the Problem. */
  discoverySection?: {
    intro?: string;
    stats?: { value: string; label: string }[];
    findings: { title: string; body: string; image?: { src: string; alt: string; caption?: string }; images?: { src: string; alt: string; caption?: string }[] }[];
  };
  /** Optional Core Insight section rendered after Discovery & Research. */
  coreInsight?: {
    heading: string;
    body: string[];
    beforeAfter?: {
      before: { header: string; items: string[]; footnote: string };
      after:  { header: string; items: string[]; footnote: string };
    };
  };
  /** Optional Design Strategy section rendered after Core Insight. */
  designStrategy?: {
    heading: string;
    principles: { title: string; body: string }[];
  };
  /** Optional Design Approach section rendered after Design Strategy. */
  designApproach?: {
    intro: string;
    decisions: { title: string; body: string; image?: { src: string; alt: string; caption?: string; compact?: boolean } }[];
  };
  /** Optional before/after video comparison for the outcomes section. */
  outcomesCompare?: { before: string; after: string };
  /** Figma-canvas-style image boards — keyed by section (e.g. "discovery", "approach"). */
  canvasBoards?: {
    section: "discovery" | "approach";
    images: { src: string; alt: string; caption?: string; span?: "wide" | "tall" | "normal" }[];
  }[];
  /** Static before/after image pair shown before the Result section. */
  beforeAfterImages?: {
    before: { src: string; label: string };
    after:  { src: string; label: string };
  };
  /** Structured result section (fancode-homepage style). */
  resultSection?: {
    heading: string;
    intro: string;
    metrics: { value?: string; icon?: boolean; label: string }[];
    body: string;
    rollout: { value: string; label: string }[];
  };
  /** Optional Homepage Layout section with a phone mockup. */
  homepageLayout?: {
    intro?: string;
    firstFold: { label: string }[];
    belowFold: { label: string; type: "content" | "break" }[];
  };
  /** Optional Key Design Decisions side-by-side cards. */
  keyDecisions?: {
    title: string;
    subtitle: string;
    body: string;
    tags: string[];
    stat?: { value: string; label: string };
  }[];
};

export const caseStudies: CaseStudy[] = [
  /* ── #08 Planful ESM Tables. Excel → web (fresh, verbatim from HTML brief) ── */
  {
    slug: "planful-esm-tables",
    number: "08",
    title: "Moving a critical finance workflow from Excel to the web.",
    titleHighlights: { "Excel": "amber", "the web": "indigo" },
    subtitle:
      "Cut a 3.5 hour finance workflow down to a few minutes, redesigned from Excel to the web.",
    cardImpact: "~95% reduction in time on task. 3.5 hrs → 10 to 15 min",
    company: "Planful",
    type: "Enterprise SaaS · Fintech",
    role: "Senior Product Designer (IC)",
    timeline: "~1 month design · 2 to 3 months rollout",
    team: "Product, Engineering, Implementation Consultants",
    tags: ["Enterprise software", "Data workflow", "Fintech", "Web Application"],
    heroLabel: "Real Work",
    /* Confidential. case study sits behind a password gate. */
    confidential: true,

    sectionLabels: {
      overview: "Context",
      problem: "Problem",
      decisions: "Key design decisions",
      outcomes: "Result",
      lesson: "What I learned",
      references: "References",
    },

    metrics: [
      {
        value: "3.5 hrs → 10 to 15 min",
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

    contextVideo: "/images/planful/planful%20product%20video.mp4",
    chromeUrl: "app.planful.com",

    /* Plain prose at the top of the Context section. no card, no
       box. Sets up Planful, the role of the live financial model,
       and the controlled workspace (ESM) that feeds it. The ESM vs
       OLAP visual diagram renders below this prose, before the
       remaining structured contextCards. */
    context:
      "Planful software is used by core finance teams at large companies to plan budgets and forecasts. When business needs shift, the data in those models has to shift too. Instead of editing the core model directly, teams load updates through an External Source Model, a controlled workspace that feeds the model without disturbing what's already there.",

    /* One remaining context card. the financial-data-models card
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

    /* Problem section. plain prose sets the scene, the Issues
       card carries the screenshot, breakdown grid, and business
       impact. Image is nested inside the card (not standalone). */
    problem:
      "Before ESM Tables existed, this workflow already had a tool. A key part of it lived inside [Spotlight for Microsoft 365](https://planful.com/solution-hub/spotlight-microsoft/solution/), a custom plug in for Excel, PowerPoint, and Word. It worked. but it came with real friction.",

    /* Issues card. single card with the screenshot, breakdown
       grid, and business-impact callout. Image sits inside the
       card so the visual and the diagnosis stay together. */
    problemCards: [
      {
        title: "Issues with the Excel Spotlight",
        image: {
          src: "/images/planful/data-model-comparison.jpg",
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
      /* 1. clearer copy: lead with the user benefit (familiar
         spreadsheet behaviour) instead of the vendor name. */
      {
        title: "A familiar spreadsheet, not a new tool to learn",
        body: "Users already know how spreadsheets work. We built on a battle tested enterprise grid (Syncfusion) so the muscle memory carried over: type, paste, drag, fill. We focused design effort on the workflow itself, not on rebuilding the grid. Scaled to large datasets and met the security standards non negotiable in fintech (SOC 2 Type 2 certified).",
        image: {
          src: "/images/planful/engg-feasibility.jpg",
          alt: "The Syncfusion grid pattern that shaped the technical approach",
          caption: "Syncfusion, the grid pattern that shaped the technical approach",
        },
      },
      /* 2. clearer copy + section walkthrough video. */
      {
        title: "Drag, drop, or paste. no waiting for big files",
        body: "Two ways in, both first class: drop a file, or paste straight from a spreadsheet. For files of 50,000+ rows, the first 1,000 rows preview instantly so users can start working before the full upload finishes.",
        videos: [
          {
            src: "/images/planful/two-ways-in.mp4",
            label: "Drag & drop or paste data",
            caption: "Live preview of the first 1,000 rows while the rest streams in.",
          },
        ],
      },
      /* 3. navigation / discovery decision. Dynamic Planning is the
         key feature; ESM Tables lives inside it, sequenced fourth
         because it is not part of everyday modeling work. */
      {
        title: "Inside Dynamic Planning. fourth in the list, not the daily driver",
        body: "Dynamic Planning is the core modeling surface finance teams use every day. ESM Tables lives inside it as the fourth tab, not the first thing they open. No separate app to install, no new login. discovering the feature meant clicking one tab over from where they already were.",
        image: {
          src: "/images/planful/navigation.jpg",
          alt: "ESM Tables nested inside Dynamic Planning as the fourth tab",
          caption: "Nested inside Dynamic Planning, where the modeling work already happens",
        },
      },
      /* 3. column settings, now with the section walkthrough video
         (no more Navigation image, which moved up to its own
         decision). */
      {
        title: "Column settings without a maze of menus",
        body: "Every column has a type: text, number, date, formula, constant. A side panel opens from the column header showing only the settings relevant to that type. Power users get full control. Casual users aren't overwhelmed.",
        videos: [
          {
            src: "/images/planful/column-settings.mp4",
            label: "Column settings",
            caption: "Type aware side panel surfaces only what's relevant.",
          },
        ],
      },
      /* 4. TLDR'd. Was two paragraphs explaining the trade-off;
         now a single tighter paragraph that keeps the why and the
         alternative considered. */
      {
        title: "Live colour feedback on formulas",
        body: "Colour highlights show which cells a formula touches as the user types. no preview step, no extra click. I considered a preview step (safer, but adds friction to every formula); the live feedback catches mistakes the moment they happen, so the extra safety wasn't worth the cost.",
        image: {
          src: "/images/planful/formula-feedback.png",
          alt: "Live colour feedback in the formula bar as the user types",
          caption: "Live colour feedback as you type, see what changes before it does",
        },
      },
      /* 5. plain language. Drop the "not in a post-submission
         report" jargon; the title and body now describe the
         behaviour in everyday terms. Section walkthrough video. */
      {
        title: "Errors users can find and fix in place",
        body: "When data fails validation, the cell itself flags up. A side panel groups issues by type, and each one carries a row link that takes the user straight to the cell. Fix in place, no need to start over.",
        videos: [
          {
            src: "/images/planful/errors-flagged.mp4",
            label: "Errors in context",
            caption: "Click a row in the side panel; the grid jumps to the cell.",
          },
        ],
      },
      /* 6. renamed: the action is bulk data update; overwrite or
         append are the two modes. Section walkthrough video. */
      {
        title: "Bulk data update. overwrite or append",
        body: "At period close, teams replace the full dataset. Mid cycle, they add rows without touching what's already there. Both modes are explicit at upload time, no scripting, no support ticket. A task that used to require rebuilding the whole table now takes a click.",
        videos: [
          {
            src: "/images/planful/bulk-update.mp4",
            label: "Bulk update",
            caption: "Overwrite replaces. Append adds. Both visible at the moment they matter.",
          },
        ],
      },
      /* 7 (publish flow). REMOVED per the latest direction.
         The end-to-end story is now: load → transform → validate
         → publish → map (next decision). Publish-specific friction
         doesn't earn its own beat. */
      /* 8. Data Maps: the next phase. No static image (the video covers
         it). Title reframes this as a forward-looking project beat,
         not a post-publish step. */
      {
        title: "The next phase of the project",
        body: "Once data is published, the next step is mapping each ESM column to the right dimension in the core financial model. Today the team handles this through a backend handoff. We designed the next project, Data Maps, where finance teams draw those connections visually themselves, closing the loop end to end.",
        videos: [
          {
            src: "/images/planful/maps.mp4",
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
          "Errors in the load corrupt forecast data downstream. zero tolerance",
        ],
        coreTension: "Speed at period close vs. zero tolerance for data errors",
      },
      {
        role: "Business Team Owner",
        name: "Self-service data loading · no mediator",
        bullets: [
          "Owns the data but couldn't load it. always routed through Finance",
          "Updates were delayed by Finance's queue and manual back-and-forth",
          "Needs to load independently without risking the shared model",
          "Doesn't think in database terms. needs the tool to think for them",
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
        coreTension: "Can't review every load personally. but can't afford not to",
      },
    ],

    outcomes: [
      "3.5 hrs → 10 to 15 min. A ~95% reduction in time on task. Simple updates that took half a day now take a coffee break.",
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
    titleHighlights: { "AI": "violet", "Contract Review": "amber", "Approval Workflow": "indigo" },
    subtitle: "What does 85 to 90% AI accuracy look like as a UX? Two flows, built in a weekend with Claude Code.",
    cardImpact: "Full working prototype shipped in a weekend. AI review + approval in 2 flows",
    company: "AI Exploration",
    type: "AI · B2B SaaS",
    role: "AI UX",
    timeline: "2026 · Weekend build",
    team: "Solo (designer + Claude Code)",
    tags: ["AI UX", "B2B SaaS", "Built with Claude"],
    heroLabel: "AI Exploration",
    confidential: false,

    summary:
      "==When an AI is right 85 to 90% of the time, what does the remaining 10 to 15% look like in the interface?== Two flows, built in a weekend with Claude Code. Working through that answer.",

    context:
      "B2B contract intelligence: AI extracts 30 to 40 fields from a vendor contract, a human reviews and corrects, approval routes through a configured workflow. The design problem isn't the upload or the dashboard. It's the seam between what the model extracted and what the reviewer actually trusts.",


    users: [
      {
        role: "Procurement Professional",
        name: "Contract review · data accuracy",
        bullets: [
          "Processes 5 to 15 contracts per day",
          "Reviews AI-extracted fields, corrects mistakes, approves data before it enters the workflow",
          "Errors that slip through have real financial consequences",
          "Needs to move fast without sacrificing accuracy",
        ],
        coreTension: "Speed vs. accuracy at 85 to 90% AI reliability",
      },
      {
        role: "Legal Professional",
        name: "Contract review · risk and liability",
        bullets: [
          "Reviews the same contract as procurement. but for risk, not data accuracy",
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
          "Configures 10 to 15 approval chains across the organisation",
          "Rules vary by contract type, dollar threshold, vendor risk, and department",
          "Currently managed through email. approvals get stuck, skipped, or misrouted",
          "Needs to build and edit rules without engineering support",
        ],
        coreTension: "Complex logic that must feel like plain language",
      },
    ],

    uxGoals: [
      {
        title: "Make AI uncertainty actionable",
        body: "At 85 to 90% accuracy, every field needs an explicit state. confident, needs review, or missing. The reviewer shouldn't have to infer confidence from a percentage or a tooltip.",
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
        body: "Contract review feeds the approval workflow. Designing them separately misses the coupling. the intake quality directly affects what routes through the approval chain.",
      },
    ],

    problem:
      "Most AI products treat model uncertainty as a footnote: a confidence percentage tucked into a tooltip the reviewer never opens. ==That's not a UX solution. It's a UX abdication.==\n\nAt 85 to 90% accuracy, every extracted field is a micro-decision: trust it, flag it, or fix it. That decision needs to be cheap, visible, and impossible to accidentally skip. Designing that interaction, and the routing layer that governs what happens after, is the actual product.",

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
          "An admin building 10 to 15 approval paths shouldn't have to parse condition logic in their head. At every step of the builder, the configured rule renders as plain English: 'Software contracts under $50K go to direct manager only.' That sentence is the verification surface during build, and the artifact they scan on the landing page a month later.",
      },
    ],

    // Live React routes fully interactive, role-switched, mock-data-driven.
    prototypeIframes: [
      { label: "Flow 1: AI Contract Review (procurement + legal)", src: "/astra/p1", height: "820px" },
      { label: "Flow 2: Approval Workflow Configuration (admin)",  src: "/astra/p2", height: "820px" },
    ],

    approach:
      "==6 to 8 hours, problem to live React prototype, with Claude Code.==\n\nClaude was the thought partner throughout, not just for code. Structuring the problem space, pressure-testing interaction hypotheses, iterating wireframes fast enough to throw most of them away. The role-based handoff insight didn't come from a brief; it surfaced asking whose attention an unresolved indemnity clause actually needs.\n\nThe wireframes were the exploration. The React build is the artifact. Both flows are above.",

    outcomes: [
      "Validated by a product-stage B2B company. the interaction model and role-based handoff were reviewed and confirmed as production-ready thinking. Two complete flows shipped in 8 hours.",
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
    titleHighlights: { "Apple Maps": "indigo", "Business Listing": "teal" },
    subtitle: "Reputation partnered with Apple in 2023, but Apple data was missing from the performance dashboard.",
    cardImpact: "~68% weekly adoption from launch. Apple Maps data visible across 100M+ US users",
    company: "Reputation.com",
    type: "Enterprise SaaS · Analytics & Insights",
    role: "Senior UX Designer",
    timeline: "Q4 2024",
    team: "PM, Eng Lead, 3 Backend Engineers, 2 QA",
    tags: ["Enterprise SaaS", "Analytical Dashboard", "Dashboard Design", "Data Visualisation"],
    heroLabel: "Real Work",
    confidential: true,

    sectionLabels: {
      overview: "What's a Business Listing?",
      problem: "The Challenge",
      decisions: "What I Did",
      outcomes: "Result",
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

    contextVideo: "/images/reputation/after.mp4",

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
          "The original dashboard had 20+ widgets with no grouping. common metrics mixed with Google-specific data, making it impossible to scan. The redesign organized everything into 5 clear sections:\n\nOverview: Cross-platform summary (All platforms)\nActions: Calls, directions, website clicks (All platforms)\nImpressions: Listing views breakdown (All platforms)\nDiscovery: Search patterns, device types (Google only)\nAdditional Actions: Platform-unique actions (Per platform)\n\n==Key insight:== By explicitly labeling platform-specific sections, users understood why Apple wasn't everywhere. It's not a gap, it's a capability difference.",
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
    title: "Rethinking the Homepage of India's premier sports app",
    titleHighlights: { "Homepage": "indigo" },
    subtitle: "How a mental-model shift and a reusable component system lifted engagement below the 1st fold of the homepage by 15–20%.",
    cardImpact: "15–20% lift below the 1st fold of the homepage. Designed to match the user's mental model.",
    company: "FanCode",
    type: "Consumer Mobile App · Sports & Streaming",
    role: "UX Manager",
    timeline: "30 days · 2022",
    team: "Product, Data Science, Content, Engineering, CEO",
    tags: ["Consumer Mobile", "Sports", "Information Architecture", "Mental Model Design", "Component Systems", "Content Strategy"],
    heroLabel: "Real Work",
    confidential: true,

    metrics: [
      { value: ">90% disengaged", label: "Before", body: "Below the 1st fold of the homepage, over 90% of users dropped off." },
      { value: "15–20% lifted", label: "After", body: "Engagement below the 1st fold of the homepage lifted 15–20% across user cohorts." },
    ],

    summary: "",

    contextVideo: "/images/fancode/FANCODE%20HOMEPAGE%20BEFORE%20.mp4",

    contextStats: [
      { stat: "100M+ users", label: "FanCode is India's premier live sports streaming platform, part of the Dream Sports group." },
    ],

    appStoreLinks: {
      android: "https://play.google.com/store/apps/details?id=com.fancode.android",
      ios:     "https://apps.apple.com/in/app/fancode/id1461575910",
    },

    contextSection: {
      title: "Context",
      intro: "The homepage was created once and reused. It became a shared billboard where every team competed for the same limited real estate.",
      cards: [
        {
          tag:  "The Contest",
          body: "The first fold was constantly contested. Any team that wanted discovery, adoption, or visibility pushed for prime placement.",
        },
        {
          tag:  "The Paradox",
          body: "It was the only reliable discovery surface in the product, so the pressure was relentless, and the space was finite.",
        },
      ],
    },

    problemStat: {
      stat:  "90%",
      label: "of users dropped off after the first fold.",
    },

    problem: "",

    insight: "The FanCode homepage was organised around what we could produce. It needed to be organised around how users think. Sports fans follow tournaments, teams, and players. Not content formats. Restructuring around that mental model was the single most important design decision of this project.",

    coreInsight: {
      heading: "The mental model shift",
      body: [
        "Every research signal converged on one root cause: the homepage was organized by content format: news, video, multi-sport blocks, sport-specific blocks. But users don't follow content. They follow tournaments, teams, and players.",
        "A fan following the IPL doesn't think in formats. They think in one question: show me everything about IPL right now. The new homepage had to mirror that, not the editorial workflow behind it.",
      ],
      beforeAfter: {
        before: {
          header: "How the homepage was organized",
          items: [
            "News & updates",
            "Video",
            "Multi-sport blocks",
            "Sport-specific blocks",
          ],
          footnote: "Organized by content format",
        },
        after: {
          header: "How users actually think",
          items: [
            "Tournaments",
            "Teams",
            "Players",
          ],
          footnote: "Organized by sports entity",
        },
      },
    },

    discoverySection: {
      intro: "Inputs that shaped the strategy",
      findings: [
        {
          title: "The first-fold turf war",
          body: "Every squad competed for the same strip of real estate with no one accountable for the page's coherence.",
          image: {
            src: "/images/fancode/UX%20REVIEW%20CURRENT%20HOMEPAGE%20FIRST%20FOLD.jpg",
            alt: "UX review of the current first fold",
            caption: "UX review · first fold",
          },
        },
        {
          title: "Content organised for operations, not users",
          body: "Sections were sorted by content type (news, scores, videos), not by what a sports fan actually looks for.",
          image: {
            src: "/images/fancode/OVERALL%20HOMEPAGE.jpg",
            alt: "UX review of overall homepage",
            caption: "UX review of overall homepage",
          },
        },
        {
          title: "Tournament discovery was broken",
          body: "If a tournament wasn't featured in the first fold, users had no reliable way to find it.",
        },
        {
          title: "The page felt stale",
          body: "Some sections hadn't changed in weeks, a serious trust problem for a platform built on real-time sport.",
          images: [
            { src: "/images/fancode/COMPETITIVE%20ANALYSIS.jpg",                                      alt: "Competitive analysis",           caption: "Competitive analysis"         },
            { src: "/images/fancode/COMPETITIVE%20ANALYSIS%20DEEP%20DIVE%20INTO%20THE%20PROBLEM.jpg", alt: "Competitive analysis deep dive", caption: "Deep dive into the problem"   },
          ],
        },
      ],
    },

    designStrategy: {
      heading: "Three principles that guided every decision",
      principles: [
        {
          title: "Align to the user's mental model",
          body: "Organize around sports, tournaments, teams, and players, not content formats. The page should feel built for how fans think, not how we operate internally.",
        },
        {
          title: "Design for scalability and daily content freshness",
          body: "Build a reusable component that can be populated with any story. The structural pattern stays consistent; the content makes it feel new every day.",
        },
        {
          title: "Create multiple journey entry points",
          body: "Every section below the fold should deep-link into specific parts of the app. The homepage becomes a multi-lane launchpad, not a single gateway.",
        },
      ],
    },

    designApproach: {
      intro: "The redesign was built on four interconnected structural decisions. Each one addressed a specific failure mode that the discovery work had surfaced.",
      decisions: [
        {
          title: "The reusable contextual component",
          body: "Built a single Coverage Card that could be populated with any sport, tournament, team, or player story. The structural pattern was fixed; the content logic was configurable. This meant the page could feel fresh every day without requiring a design change.",
          image: {
            src: "/images/fancode/The%20reusable%20contextual%20component.jpg",
            alt: "Reusable Coverage Card component, populated with multiple story types",
            caption: "Reusable Coverage Card component",
          },
        },
        {
          title: "Scroll rhythm: pattern, break, pattern",
          body: "The page alternates between contextual content blocks and pattern breaks: Quick Singles (a visual cricket snapshot) and the Tournaments discovery browser. The breaks prevent the scroll from feeling like a feed, and give users a reason to keep going.",
          image: {
            src: "/images/fancode/NEW%20HOMEPAGE%20CONCEPT%20DESIGN%20WITH%20SEAMLESS%20DESIGN%20PATTERN%20FLOW.jpg",
            alt: "Concept design, seamless pattern flow",
            caption: "Seamless design pattern flow",
          },
        },
        {
          title: "Deep linking throughout and personalisation for new and return users",
          body: "Every component links directly into the relevant part of the app, not to a listing page, but to the actual sport, tournament, or team feed. The homepage becomes an entry point, not a destination. The same architecture supports personalised rails (Continue Watching, Recommended For You) that adapt for new versus returning users.",
          image: {
            src: "/images/fancode/NEW%20HOMEPAGE%20CONCEPT%20DESIGN_FIRST%20TIME%20USERS%20AND%20RETURN%20USERS%20WITH%20HOMEPAGE%20PERSONALISATION%20IDEAS.jpg",
            alt: "Concept design, personalisation states for first-time and returning users",
            caption: "Personalisation concepts for new and returning users",
          },
        },
        {
          title: "A dedicated tournament discovery block",
          body: "A scrollable row of all active tournaments, positioned in the below-fold section. Directly addresses the discovery gap the data surfaced: if a tournament wasn't in the first fold, users couldn't find it.",
          image: {
            src: "/images/fancode/Tour%20Collection.jpg",
            alt: "Tournament collection discovery block",
            caption: "Tournament discovery block",
            compact: true,
          },
        },
      ],
    },

    canvasBoards: [],

    homepageLayout: {
      intro: "The first fold remained unchanged. It was performing well and carried strong broadcast-rights value. Everything below it was restructured.",
      firstFold: [
        { label: "Nudge cards + Live broadcast highlights" },
      ],
      belowFold: [
        { label: "Detailed coverage block (top live or upcoming story)", type: "content" },
        { label: "\"What's Hot Right Now\": trending sport/tournament component", type: "content" },
        { label: "Contextual coverage card (e.g. IPL, team match-day, player story)", type: "content" },
        { label: "Pattern break: \"Quick Singles\", visual cricket snapshot", type: "break" },
        { label: "Contextual coverage card (continued)", type: "content" },
        { label: "Pattern break: Tournaments discovery browser", type: "break" },
        { label: "Additional sport-specific blocks (football, motorsport, etc.)", type: "content" },
      ],
    },

    contribution:
      "With multiple squads, product and design leadership, and the CEO all invested in the homepage, alignment was as important as the design work itself. I ran a structured workshop where I presented the redesign across four distinct user states, not just the final happy path:\n\n1. First-time user. How does the homepage feel on day one? What signals trust, surfaces the product's value immediately, and drives initial activation?\n2. Returning user, no personalization. The baseline experience for most users. Content-led, editorially curated, always fresh through the Coverage Card system.\n3. Returning user, partial personalization. Continue Watching and Recommended for You active. The page begins to recognize you and reflect your history.\n4. Returning user, full personalization. The future state. Homepage fully tailored to followed sports, teams, and players. Built into the architecture today; shipped in a future sprint.\n\nPresenting all four states together did two things. It gave stakeholders a coherent long-term vision: this wasn't a one-off visual refresh, it was a platform with room to grow. And it gave every squad a clear picture of how their content would surface across each state, ==substantially reducing the internal competition for the first fold==. The system now had multiple discovery surfaces. There was room for everyone.",

    contributionArtifacts: [
      "Cross-functional research synthesis",
      "Strategy alignment with CEO + leadership",
      "Reusable component system",
      "IA + content strategy",
      "Staged A/B test plan",
      "4-state stakeholder alignment workshop",
    ],

    outcomesCompare: {
      before: "/images/fancode/FANCODE%20HOMEPAGE%20BEFORE%20.mp4",
      after:  "/images/fancode/FANCODE%20HOMEPAGE%20AFTER%20.mp4",
    },

    beforeAfterImages: {
      before: { src: "/images/fancode/Earlier%20Homepage%20.jpg", label: "Earlier homepage" },
      after:  { src: "/images/fancode/New%20Homepage%20.jpg",     label: "Redesigned homepage"  },
    },

    resultSection: {
      heading: "What the data showed",
      intro: "The redesign was validated through a staged A/B rollout, starting with under 5% of users, monitoring engagement and retention metrics week-on-week, then expanding to 10%, and eventually rolling out to 100% of the user base as the numbers held.",
      metrics: [
        { value: "15–20%", label: "lift in engagement below the first fold" },
        { icon: true, label: "homepage adoption: more users entering multiple app journeys from home" },
      ],
      body: "The 15–20% improvement in below-the-fold engagement was significant not just as a number, but as a validation of the core hypothesis: that organizing content around user mental models, rather than internal content types, would give users a genuine reason to scroll. It did.",
      rollout: [
        { value: "<5%", label: "Initial A/B test" },
        { value: "10%", label: "Expanded rollout" },
        { value: "100%", label: "Full production" },
      ],
    },

    keyDecisions: [
      {
        title: "Cricket-first, built to expand",
        subtitle: "Architecture decision",
        body: "99% cricket audience. New sports slot in as content blocks, no structural rebuild needed.",
        tags: ["Architecture", "Scalability"],
      },
      {
        title: "Partial over full personalization",
        subtitle: "Scope decision",
        body: "Scoped to \"Continue Watching\" and \"Recommended For You.\" Follow buttons seed the system for future use.",
        tags: ["Personalization", "Scoping"],
      },
      {
        title: "The \"too simple\" challenge",
        subtitle: "Stakeholder pushback",
        body: "Stakeholders pushed back on uniformity. The counter: Instagram and YouTube both do this. Predictable structure moves attention to content.",
        tags: ["Stakeholder Management"],
      },
      {
        title: "Stakeholder alignment",
        subtitle: "Alignment as a design deliverable",
        body: "Mapped five personalization states in one workshop. Leadership saw the full picture. Approval followed.",
        tags: ["Workshop", "Alignment"],
      },
    ],

    outcomes: [
      "Shipped through a staged A/B rollout: starting at sub-5% of users, validating week on week before expanding to 10%, then 25%, then full rollout. At each stage, the hypothesis was validated before proceeding.",
      "15–20% increase in engagement below the 1st fold of the homepage, sustained post-launch across cohorts. Directly tied to the structural changes in the redesign.",
      "Homepage adoption broadened: the Coverage Cards, Tournaments Explorer, and partial personalization rails created multiple distinct entry points into the app's core experiences. The homepage stopped being a single gateway. It became a multi-lane on-ramp into the product.",
    ],

    learnings: {
      northStar: "The hardest design problems are rarely visual — they're structural.",
      items: [
        "Reorganize around how users think, not what you can produce. The mental model shift was the real design decision; every visual choice followed from it.",
        "Understand your constraints deeply, ship what moves the needle today, and design with tomorrow already in mind.",
      ],
    },

    reflection:
      "The hypothesis was validated. Organizing content around user mental models (tournaments, teams, trending moments) rather than content formats gave users a reason to scroll. The lift was measurable, sustained, and tied directly to the structural changes.\n\nWhat I'd do differently: instrument the team-level signals from day one. The Coverage Cards captured interest at the surface, but I never measured whether Karan-shaped users (the fantasy player who defaulted to Cricbuzz) opened the competitor less after the redesign. That was the metric the brief actually asked for.\n\nFollow-up work the foundation made possible: a personalization engine running on actual behavior, sport-level customisation as cricket-only stops being the constraint, dynamic content ranking rather than static, and ongoing A/B tests on layout patterns to keep the system learning.",
  },
  {
    slug: "zetwerk-dc",
    number: "03",
    confidential: true,
    title: "Supply chain coordination at scale",
    titleHighlights: { "Supply chain": "amber", "scale": "indigo" },
    subtitle:
      "Designed a digital delivery challan workflow for a 500+ supplier network, turning a paper-based process that tied up 8 employees full-time into a system any ops user could run, with built-in GST compliance for the tax team.",
    cardImpact: "90% user adoption in first 3 months. 800+ monthly challans off paper",
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
      { value: "90%", label: "User adoption", body: "of the warehouse, quality, and logistics teams adopted the new flow in the first 3 months." },
      { value: "800+", label: "Monthly volume", body: "challan requests handled per month after launch." },
      { value: "26", label: "Design QA wins", body: "design QA improvements shipped across the workflow." },
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
    confidential: true,
    title: "Enterprise Service Design & Operations Research",
    titleHighlights: { "Service Design": "indigo", "Operations Research": "amber" },
    subtitle: "Five teams. Five broken workflows. Nobody had ever drawn the full picture.",
    cardImpact: "5 competing backlogs → 1 sequenced plan. first complete view of how ops actually worked",
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
      { value: "5 backlogs → 1", label: "Sequenced roadmap", body: "Competing team roadmaps replaced by a single sequenced plan the PM team could act on." },
    ],

    problem:
      "The platform had one job: keep five teams working from the same picture. In practice, every team had quietly built their own version. The operations team kept personal spreadsheets because the system couldn't show them only their own orders. Finance ran critical calculations in Excel files that only two people in the company understood. Sales managed new inquiries entirely over WhatsApp. The platform was full of data. ==The system existed. The work happened outside it.==",

    problemBreakdown: {
      points: [
        "The system had no way to filter orders by assigned person. Everyone saw everything, all the time",
        "Business Finance managed profit & loss and financial risk positions entirely in personal Excel files",
        "Procurement negotiated supplier quotes over WhatsApp, leaving no record of the conversation anywhere",
        "Every invoice had to route through a third-party service, adding 15 to 20 minutes of waiting per order while loaded vehicles sat idle",
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
        body: "The invoice delay wasn't a vendor performance problem. It was a structural failure nobody had named yet. Every shipment had to route through a third-party service before a vehicle could move: 15 to 20 minutes per order, every time. Internally it was treated as a speed problem: pressure the vendor. Research showed it was structural: three parties, one sequential handoff, no shared visibility into where the delay was occurring. When a process requires sequential action with no shared view of progress, delays are guaranteed regardless of how fast any one party moves. The vendor wasn't the problem. The architecture was.",
      },
      {
        title: "Sales was being used as the system's customer service fallback",
        body: "60 to 65% of orders escalated back to the Sales team. Priya's team was spending a quarter of their working hours chasing deliveries, not closing new customers. This wasn't just an efficiency problem. It was a misdirection problem. The most expensive resource in the business was being used to compensate for a system that couldn't handle its own error states. Every hour spent on an escalation is an hour not spent on growth.",
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
            "Customer asks for a price quote. Procurement contacts 2 to 3 suppliers over WhatsApp to get prices. Sales negotiates terms. The entire process happens outside any system.",
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
        body: "The invoice delay had been treated as a vendor management problem for months: pressure the third-party service, escalate, move faster. Research showed the problem was structural, which meant vendor pressure would never fix it. Three parties, one sequential handoff, no shared visibility into where the delay was occurring. Operations was spending 15 to 20 minutes per order waiting for paperwork while loaded vehicles sat idle. The reframe mattered because it changed what solutions were even possible: if it's a vendor problem, you escalate. If it's a structural problem, you redesign the process, including building a flow that lets Zetwerk create invoices directly instead of waiting. The tradeoff was a longer timeline. There was no quick version of this fix, and pretending otherwise would have repeated the mistake.",
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
          pain: "60 to 65% of orders escalate back to her team. A quarter of her working hours go into resolving delivery problems that should be handled by Operations.",
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
