# Enterprise Case Study Template
**Growth.design-style · Tailored for enterprise UX hiring expectations**

Use this template for every case study in the portfolio. Each section maps to a specific hiring manager signal. Fill every field — leave none blank. If something is confidential, abstract it without losing the signal.

---

## How to use

1. Copy the data block below into `lib/caseStudies.ts`
2. Fill every field using the writing guide in each section
3. Run `npm run dev` and check the visual output
4. Export Figma screens to `/public/images/[slug]/` with the filenames referenced below

---

## Data block (copy into caseStudies.ts)

```ts
{
  slug: "your-slug",
  number: "01",
  title: "",
  subtitle: "",
  company: "",
  type: "",           // e.g. "Enterprise SaaS — Fintech"
  role: "",           // e.g. "Senior Product Designer"
  timeline: "",       // e.g. "2024"
  team: "",           // e.g. "PM, Engineering, Data Science"
  tags: [],           // e.g. ["Enterprise SaaS", "Workflow Design", "Trust Design"]
  heroLabel: "",      // e.g. "Real Work" | "B2B Hero" | "Confidential"
  confidential: false,

  // ─── 1. The Brief ──────────────────────────────────────
  summary: "",

  // ─── Metrics bar ───────────────────────────────────────
  metrics: [
    { value: "", label: "" },
  ],

  // ─── 2. Context ────────────────────────────────────────
  context: "",

  // ─── 3. The Problem ────────────────────────────────────
  problem: "",
  problemImage: {
    src: "/images/[slug]/problem.png",
    alt: "",
    caption: "",
  },

  // ─── 4. Core Insight ───────────────────────────────────
  insight: "",
  insightImage: {
    src: "/images/[slug]/insight.png",
    alt: "",
    caption: "",
  },

  // ─── 5. Research & Validation ──────────────────────────
  researchEvidence: "",

  // ─── 6. Prototype ──────────────────────────────────────
  prototypeVideo: "/images/[slug]/prototype.mp4",

  // ─── 7. Key Design Decisions ───────────────────────────
  decisions: [
    {
      title: "",
      body: "",
      image: {
        src: "/images/[slug]/decision-1.png",
        alt: "",
        caption: "",
      },
    },
  ],

  // ─── 8. What We Tried & Killed ─────────────────────────
  scrappedDirections: [
    {
      title: "",
      reason: "",
    },
  ],

  // ─── Outcomes ──────────────────────────────────────────
  outcomesImages: [
    {
      src: "/images/[slug]/outcome-1.png",
      alt: "",
      caption: "",
    },
  ],
  outcomes: [],

  // ─── 9. What I Owned ───────────────────────────────────
  contribution: "",

  // ─── 10a. What I Learned ───────────────────────────────
  lesson: "",

  // ─── 10b. What I'd Do Differently ─────────────────────
  reflection: "",
},
```

---

## Writing guide — section by section

### 1. The Brief
**Signal:** Can you summarise the stakes in 3 sentences?
**Format:** Problem → what changed → why it mattered
**Test:** A non-domain hiring manager should understand in 10 seconds
**Avoid:** "I designed a..." openers. Start with the user or the problem.

> **Example:** "Most tools put the burden of accuracy on the user. This one should have protected them from it. I redesigned how financial data gets updated — separating where work happens from what becomes official."

---

### Metrics bar
**Signal:** There was a measurable outcome
**Rules:**
- 1–3 metrics max. One strong number beats three weak ones.
- Use UX language: "Reduction in time on task" not "99% faster"
- If you don't have a metric, use a qualitative shift: "Expert-only → cross-functional"
- Never fabricate. If unconfirmed, write "~" or "target"

---

### 2. Context
**Signal:** You understand the business and users, not just the UI
**Format:** What the product does → who uses it → why accuracy/speed/trust matters here
**Length:** 2–3 sentences. Non-jargon. No acronyms without explanation.

> **Example:** "Planful is a financial planning platform. The users are finance analysts. When their data is wrong, executive decisions are wrong. The stakes aren't abstract."

---

### 3. The Problem
**Signal:** You identified the right problem, not just the obvious one
**Format:** What existed → what it forced users to do → the consequence
**Technique:** Use `==text==` around the key stat to trigger the highlight animation
**Avoid:** "Users were frustrated" — show the behaviour, not the emotion

> **Example:** "Only a handful of power users could confidently work in it. ==Simple updates took 4–5 hours. Complex ones took weeks.== That told me everything I needed to know."

---

### 4. Core Insight
**Signal:** You reframed — you didn't just execute the brief
**Format:** "The problem wasn't X — it was Y"
**Test:** The insight should make the solution feel inevitable in hindsight
**Avoid:** "cognitive burden", "mental model", "pain points" — plain language only

> **Example:** "What looked like a complex tool was actually a system that put every mistake on the user."

---

### 5. Research & Validation
**Signal:** The insight was grounded in evidence, not assumption
**Format:** Method → what you observed → what it confirmed
**Key:** Describe what you *saw*, not what users *said*. Behaviour over self-report.
**Avoid:** "User interviews revealed..." — be specific about what the sessions showed

> **Example:** "Every session showed the same pattern: users moved deliberately slowly, double-checked every entry, and interrupted their own workflow to re-verify. The fear of making a mistake was visible — not from interviews, but from watching."

---

### 6. Prototype
**Signal:** It shipped. Here's proof.
**Format:** Looping video — autoplay, muted, desktop chrome frame
**File:** Export from Figma as `.mp4`, drop into `/public/images/[slug]/`

---

### 7. Key Design Decisions
**Signal:** You made tradeoffs, not just choices
**Format per decision:**
- **Title** — the principle, not the feature ("Nothing goes live until it's ready")
- **Body** — what you did + why + the tradeoff you accepted
- **Image** — Figma screenshot shown as background band

**The tradeoff rule:** Every decision must name what you gave up. "We chose X. It meant Y was off the table." No tradeoff = no decision, just execution.

**Iteration rule:** At least one decision should mention what changed between rounds — what you tried first and why you moved away from it.

---

### 8. What We Tried & Killed
**Signal:** You can kill your darlings — the rarest senior designer signal
**Format:** Struck-through title + one-sentence reason it was wrong
**Rule:** Be specific. "Didn't test well" is not a reason. Name the actual failure mode.
**Aim for 2–3 directions.** One feels like a token. Four feels like thrash.

> **Example:**
> ~~Wizard-style guided flow~~
> "Tested well in isolation, but created overhead for repeated tasks. Finance teams update data constantly — a wizard is the wrong pattern for habitual work."

---

### Outcomes
**Signal:** The work had a measurable impact
**Format:** Numbered list — specific, before→after where possible
**Last outcome:** Should be qualitative — the cultural or organisational shift

---

### 9. What I Owned
**Signal:** Ownership is clear — no ambiguity about what you did vs the team
**Format:** End-to-end ownership + key collaborations + specific artifacts
**Must include:** What decisions you made, what you set constraints on, what shipped under your name

---

### 10a. What I Learned
**Signal:** Self-awareness
**Format:** Large display text — one strong, honest insight
**Test:** It should not be obvious. "Communication is important" is not a lesson.

---

### 10b. What I'd Do Differently
**Signal:** Intellectual honesty — the rarest signal of all
**Format:** Short, specific, not self-flagellating
**Rule:** One concrete thing. Not "I'd do more research" — name what you'd research, and why it would have changed the outcome.
**Avoid:** Turning this into humility performance. State it plainly.

> **Example:** "I'd involve finance SMEs earlier in the technology constraint conversation. The decision was made before they fully understood the tradeoffs. We got alignment eventually — but it cost two extra feedback rounds."

---

## Image file checklist

Drop exports into `/public/images/[slug]/` before publishing:

| File | What to export | Notes |
|------|----------------|-------|
| `problem.png` | Legacy experience or task flow diagram | Before state — not the solution |
| `insight.png` | Reframe diagram or model comparison | The "aha" moment visualised |
| `decision-1.png` | First key decision artifact | Wireframe, flow, or annotated screen |
| `decision-2.png` | Second key decision artifact | |
| `decision-3.png` | Third key decision artifact | |
| `decision-4.png` | Fourth key decision artifact | |
| `outcome-1.png` | Final shipped screen or modal | Show the shipped state |
| `outcome-2.png` | Second outcome visual | Side-by-side in one card |
| `prototype.mp4` | Looping prototype video | Export from Figma slide with video fill |

---

## Visual rhythm check

Before publishing, verify the page alternates correctly:

```
Text section       ← The Brief
Text section       ← Context
Text + image       ← The Problem
Callout + image    ← Core Insight  ← visual break
Text section       ← Research
Full-width video   ← Prototype     ← visual break
Text + bg images   ← Decisions     ← alternating
Struck-out list    ← Scrapped      ← visual break
Text list          ← Outcomes
Image card         ← Outcome images
Text section       ← What I owned
Large text         ← What I learned
Text section       ← What I'd do differently
```

No two consecutive full-text sections without a visual break. If you have them, add an image or move sections.

---

## Copy rules (from AWESOME_DESIGN.md + UX Case Study Writer)

- **No bold** anywhere — not in copy, not in component code
- **No jargon** without plain-language equivalent in the same sentence
- **Before → after framing** wherever there's a metric or improvement
- **Specific over general** — name the error types, name the teams, name the decision
- **Active voice** — "I pushed for X" not "X was decided"
- **Short sentences** — if a sentence has two ideas, split it
- **No "seamless", "leverage", "pain points", "iterate", "stakeholders"** as nouns

---

## Confidential case studies

If the case study is confidential:
- Set `confidential: true` — a badge renders automatically
- Keep the copy specific enough to be credible, abstract enough to not expose IP
- Use `heroLabel: "Confidential"` for the work card
- End outcomes with: `"Full case study available on request"`
