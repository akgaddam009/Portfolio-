/* Career timeline data. Lived in app/page.tsx until the Scroll view needed
   the same records: CareerPanel and ScrollView now read one source instead of
   two copies drifting apart. Pure data, no JSX, no client hooks. */

export type CareerItem = {
  type: "role" | "education" | "label";
  startYear: number;
  endYear?: number;
  title: string;
  subtitle?: string;
  dateLabel?: string;
  impact?: string;
  logoDomain?: string;
  description?: string;
  bullets?: string[];
  highlights?: string[];
  highlightLink?: string;
  highlightLinks?: (string | null)[];
  learnings?: string[];
  link?: string;
  images?: string[];
  minHeight?: number;
};

// Month helper: year + (month-1)/12
// Jan=0, Feb=0.083, Mar=0.167, Apr=0.25, May=0.333, Jun=0.417,
// Jul=0.5, Aug=0.583, Sep=0.667, Oct=0.75, Nov=0.833, Dec=0.917
export const careerItems: CareerItem[] = [
  // Work. newest first
  {
    type: "role", startYear: 2025.167, endYear: 2025.583,
    title: "Senior Product Designer", subtitle: "Planful Software", minHeight: 72,
    dateLabel: "Mar 2025 - Aug 2025", impact: "Fintech", logoDomain: "planful.com",
    link: "https://planful.com/",
    description: "Led end-to-end design of two finance planning features, reducing training time ~30% and supporting migration of core finance workflows from legacy tools to a modern web interface.",
  },
  {
    type: "role", startYear: 2024.167, endYear: 2025.083,
    title: "Senior UX Designer", subtitle: "Reputation.com", minHeight: 72,
    dateLabel: "Mar 2024 - Feb 2025", impact: "Enterprise SaaS", logoDomain: "reputation.com",
    link: "https://reputation.com/",
    description: "Led design across three core product verticals (Insights, Reporting, Business Listings, and Reviews), directly supporting primary revenue drivers and AI feature initiatives.",
    highlights: [
      "Designed a unified Competitive Insights workflow that reduced task time by 40%, increased active usage, and contributed to higher customer retention and monetisation",
      "Implemented design QA, reducing design defects by ~25% and improving release quality",
    ],
    highlightLink: "https://reputation.com/resources/reports-guides/competitive-intelligence-stand-out-from-competition",
  },
  {
    type: "role", startYear: 2022.25, endYear: 2023.833,
    title: "Senior Product Designer", subtitle: "Zetwerk",
    dateLabel: "Apr 2022 - Nov 2023", impact: "Manufacturing", logoDomain: "zetwerk.com",
    link: "https://www.zetwerk.com/",
    images: ["/images/career/zetwerk-team.jpg"],
    description: "Led product design initiatives for Zetwerk's Order Management System (OMS), improving workflows to support business operations during a ~6× revenue growth phase.",
    highlights: [
      "Mentored three designers and partnered with leadership to establish UX practices: research, concept validation, usability testing",
      "Replaced guesswork with evidence-based design, improving product quality and reducing backlog ~20 to 30%",
      "Achievement – Zetwerk Hackathon Winner: Won competing against 11 other teams during an intense 40-hour innovation challenge",
    ],
    highlightLinks: [null, null, "https://www.youtube.com/watch?v=ZJoioJyN4H4"],
  },
  {
    type: "role", startYear: 2020.583, endYear: 2022.25,
    title: "Manager UX Designer", subtitle: "FanCode / Dream Sports",
    dateLabel: "Aug 2020 - Apr 2022", impact: "B2C startup", logoDomain: "fancode.com",
    link: "https://play.google.com/store/apps/details?id=com.dream11sportsguru&hl=en_IN",
    images: ["/images/career/fancode-team.jpg"],
    description: "Owned UX for a core product initiative, designing multiple features that drove adoption, retention, and growth across a ~50M user base.",
    highlights: [
      "Led research and concept validation to solve new-user retention, informing a 12-month roadmap and increasing retention by 18% while boosting subscriptions",
      "Redesign of FanCode homepage experience led to an increase in user engagement by 20%",
      "Designed and delivered new sports experiences as part of growth initiatives, driving adoption in football and kabaddi",
      "Uncovered and improved interconnected fan journeys across key touchpoints, increasing time spent by ~20%",
    ],
  },
  {
    /* endYear meets FanCode's startYear (2020.583) rather than sitting at
       Jul 2020's 2020.5. The roles are contiguous -- Jul 2020 ends, Aug 2020
       begins -- so the one-month numeric gap was a month-boundary artefact of
       the scale, not a real break, and it rendered as blank track. dateLabel
       is unchanged and still states the true dates. */
    type: "role", startYear: 2016.667, endYear: 2020.583,
    title: "UX Designer (Founder)", subtitle: "Quazire Consulting",
    dateLabel: "Sep 2016 - Jul 2020", impact: "Design consultancy",
    description: "Founded and ran a boutique UX consultancy.",
    highlights: [
      "Designed an award-winning suite of hospital applications, improving operational efficiency, patient management, and clinical decision-making",
      "Designed an HRIS and applicant tracking system that streamlined recruitment workflows and enhanced hiring team collaboration",
      "Designed a mobile ERP solution for MSMEs in India",
    ],
  },
  // Other. education & side roles
  {
    type: "education", startYear: 2023.833, endYear: 2026.25,
    title: "Super Mentor", subtitle: "ADPList", minHeight: 72,
    dateLabel: "Nov 2023 - Present", impact: "Top 1%",
    link: "https://adplist.org/",
    description: "Recognised as a Super Mentor and Top 1% Contributing Mentor on ADPList, mentoring designers across career transitions, portfolio reviews, and senior IC growth.",
  },
  {
    type: "education", startYear: 2023.75, endYear: 2025.083,
    title: "Product Management", subtitle: "IIT Guwahati · Accredian",
    dateLabel: "Oct 2023 - Feb 2025", logoDomain: "accredian.com", minHeight: 72,
    description: "Executive Program in Data-Driven Product Management (Accredian, IIT Guwahati).",
    bullets: [
      "Applied data, product strategy, and user-centric approaches across the product lifecycle",
      "Covered customer research, analytics, product strategy, and experimentation",
      "Translated insights into product roadmaps, metrics, and iterative data-informed decisions",
    ],
  },
  {
    type: "education", startYear: 2020.917, endYear: 2021.333,
    title: "Program in UX Design", subtitle: "IIT Bombay",
    dateLabel: "Dec 2020 - May 2021", logoDomain: "iitb.ac.in", minHeight: 72,
    description: "Program in User Experience Design from IDC School of Design, IIT Bombay.",
    bullets: [
      "Covered end-to-end UX lifecycle from user research and problem framing to interaction design, testing, and implementation",
      "Completed a hands-on, project-based curriculum with a field research project using contextual inquiry",
      "Translated real-world user behaviours into iterative design solutions",
    ],
    images: ["/images/career/iitb-1.jpg", "/images/career/iitb-2.jpg"],
  },
  {
    type: "education", startYear: 2019.583, endYear: 2019.75,
    title: "Conducting Usability Testing", subtitle: "Interaction Design Foundation",
    dateLabel: "Aug 2019", logoDomain: "interaction-design.org", minHeight: 72,
    description: "Usability Testing certification from Interaction Design Foundation.",
    bullets: [
      "Focused on planning, conducting, and analysing user tests",
      "Drive data-informed design improvements through structured testing methods",
    ],
  },
  {
    type: "education", startYear: 2019.5, endYear: 2019.583,
    title: "Industry Jury", subtitle: "Institute of Product Leadership",
    dateLabel: "Jul 2019", minHeight: 72,
    description: "Institute of Product Leadership — Skillathon format replacing traditional exams.",
    link: "https://www.productleadership.com/user-interface-design-prototyping-skillathon-hyderabad-6-july-2019/",
    bullets: [
      "Top Product Lab UX ideas presented to a live jury of hiring managers and industry experts",
      "Best voted team wins the Skill Champion Trophy and cash award",
    ],
  },
  {
    type: "education", startYear: 2017, endYear: 2017.5,
    title: "Design Thinking & Leadership", subtitle: "DSIL Global",
    dateLabel: "2017", minHeight: 72,
    description: "Global certification in social innovation and leadership.",
    bullets: [
      "Applied human-centred methods and systems thinking through field immersions and cross-sector collaboration",
      "Worked with local communities, social enterprises, and ecosystem leaders across Southeast Asia",
      "Conducted contextual research, facilitated design sprints, and translated insights into actionable solutions through iterative prototyping",
    ],
    images: ["/images/career/dsil-1.jpg", "/images/career/dsil-2.jpg"],
  },
];
