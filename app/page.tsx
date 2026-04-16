"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useRef, useCallback, useState, useEffect } from "react";
import Cursor from "@/components/Cursor";
import ThemeToggle from "@/components/ThemeToggle";
import LoadingScreen from "@/components/LoadingScreen";
import { caseStudies } from "@/lib/caseStudies";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ── Home nav — name + panel arrows ── */
const PANEL_LABELS = ["About", "Work", "Career", "Testimonials", "AI"];

function HomeNav({ onPrev, onNext, activePanel }: { onPrev: () => void; onNext: () => void; activePanel: number }) {
  return (
    <header style={{
      position: "fixed",
      top: 0, left: 0, right: 0,
      zIndex: 200,
      height: "52px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 24px",
      background: "var(--chrome)",
    }}>
      {/* Name + theme toggle */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-logo)",
            fontSize: "13px",
            fontWeight: 500,
            color: "var(--text)",
            letterSpacing: "-0.03em",
            padding: "6px 12px",
            borderRadius: "8px",
            border: "1px solid var(--border)",
            background: "var(--bg)",
            boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
            transition: "background 0.15s, opacity 0.15s",
            display: "inline-block",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "#ffffff"; e.currentTarget.style.borderColor = "rgba(0,0,0,0.12)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "var(--bg)"; e.currentTarget.style.borderColor = "var(--border)"; }}
        >
          Arun Gaddam
        </Link>
        <ThemeToggle />
      </div>

      {/* Panel dots + arrows */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        {/* Panel position dots */}
        <div className="panel-dots" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          {PANEL_LABELS.map((label, i) => (
            <div
              key={label}
              title={label}
              style={{
                width: i === activePanel ? "16px" : "5px",
                height: "5px",
                borderRadius: "3px",
                background: i === activePanel ? "var(--text)" : "var(--border)",
                transition: "width 0.3s cubic-bezier(0.22,1,0.36,1), background 0.3s",
              }}
            />
          ))}
        </div>

        {/* Arrows */}
        <div className="desktop-nav-arrows" style={{ display: "flex", gap: "6px" }}>
          {([
            { dir: "prev", fn: onPrev, d: "M14 6l-6 6 6 6" },
            { dir: "next", fn: onNext, d: "M10 6l6 6-6 6" },
          ] as const).map(({ dir, fn, d }) => {
            const disabled = (dir === "prev" && activePanel === 0) || (dir === "next" && activePanel === PANEL_LABELS.length - 1);
            return (
              <motion.button
                key={dir}
                onClick={disabled ? undefined : fn}
                whileTap={disabled ? {} : { scale: 0.88 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  background: "var(--bg)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background 0.15s, opacity 0.2s",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
                  opacity: disabled ? 0.3 : 1,
                  cursor: disabled ? "default" : "none",
                }}
                onMouseEnter={e => { if (!disabled) e.currentTarget.style.background = "var(--surface2)"; }}
                onMouseLeave={e => { if (!disabled) e.currentTarget.style.background = "var(--bg)"; }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d={d} />
                </svg>
              </motion.button>
            );
          })}
        </div>
      </div>
    </header>
  );
}

/* ── Shared panel header ── */
function PanelHeader({ label }: { label: string }) {
  return (
    <div className="panel-header-glass" style={{
      position: "sticky",
      top: 0,
      zIndex: 20,
      padding: "12px 24px",
      borderBottom: "1px solid var(--border)",
    }}>
      <p style={{
        fontFamily: "var(--font-mono)",
        fontSize: "9px",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: "var(--muted)",
      }}>
        {label}
      </p>
    </div>
  );
}

/* ── Panel 1: About ── */
const infoRows = [
  { label: "Role", value: "Senior Product Designer. I own the full design process — from discovery and strategy to final pixel." },
  { label: "Focus", value: "Enterprise SaaS, B2B AI tools, and consumer products at scale — with user research as a core part of the process." },
  { label: "Experience", value: "8+ years designing complex enterprise apps to consumer mobile app influencing roadmaps, mentoring designers, and collaborating across cross-functional teams." },
  { label: "Superpower", value: "I can hold the big picture and still get into the details that matter." },
];

function AboutPanel() {
  return (
    <div>
      <PanelHeader label="About me" />
      <div style={{ padding: "28px 24px 48px" }}>
        <h1 style={{
          fontFamily: "var(--font-body)",
          fontSize: "clamp(20px, 2.8vw, 28px)",
          fontWeight: 300,
          lineHeight: 1.25,
          letterSpacing: "-0.03em",
          color: "var(--text)",
          marginBottom: "16px",
        }}>
          <span className="text-highlight">Hey, I&apos;m Arun.</span>{" "}
          <span style={{ color: "var(--muted)" }}>
            I design products at the intersection of UX, product thinking, and AI.
          </span>
        </h1>

        <p style={{
          fontFamily: "var(--font-body)",
          fontSize: "14px",
          lineHeight: 1.65,
          color: "var(--muted)",
          marginBottom: "32px",
        }}>
          I&apos;m based in Hyderabad, India with my wife and our son — figuring out the balance between designing products, catching up with AI, and raising a tiny human. I&apos;m learning a lot from both.
        </p>

        {/* Info rows */}
        <div>
          {infoRows.map((row) => (
            <div
              key={row.label}
              style={{ padding: "12px 0", transition: "opacity 0.15s" }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.75")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                <p style={{
                  fontFamily: "var(--font-mono)", fontSize: "9px",
                  letterSpacing: "0.06em", textTransform: "uppercase",
                  color: "var(--muted)", whiteSpace: "nowrap", fontWeight: 400,
                  transition: "color 0.15s",
                }}>
                  {row.label}
                </p>
                <div style={{ flex: 1, borderTop: "1px dashed var(--border)" }} />
              </div>
              <p style={{
                fontFamily: "var(--font-body)", fontSize: "14px",
                color: "var(--muted2)", lineHeight: 1.6, fontWeight: 400,
              }}>
                {row.value}
              </p>
            </div>
          ))}
        </div>

        {/* Links */}
        <div style={{ marginTop: "32px", display: "flex", gap: "20px", flexWrap: "wrap" }}>
          {[
            { label: "LinkedIn ↗", href: "https://linkedin.com/in/akgaddam", external: true },
            { label: "Medium ↗", href: "https://medium.com/@akgaddam", external: true },
            { label: "Email", href: "mailto:akgaddam02@gmail.com", external: false },
          ].map(({ label, href, external }) => (
            <Link
              key={label}
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              style={{
                fontFamily: "var(--font-mono)", fontSize: "10px",
                letterSpacing: "0.05em", textTransform: "uppercase",
                color: "var(--muted)", transition: "color 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Panel 2: Selected Work ── */
const cardBgs = ["var(--surface2)", "var(--surface)", "var(--surface2)", "var(--surface)", "var(--surface2)", "var(--surface)"];

function WorkPanel() {
  return (
    <div id="work-panel">
      <PanelHeader label="Selected Work" />
      <div style={{ padding: "16px 24px 32px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {caseStudies.map((cs, i) => {
            const href = cs.confidential ? "/contact" : `/work/${cs.slug}`;
            return (
              <motion.div
                key={cs.slug}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE, delay: i * 0.04 }}
              >
                <Link href={href}>
                  <motion.div
                    whileHover={{ y: -2 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    style={{
                      background: "var(--surface)",
                      borderRadius: "12px",
                      overflow: "hidden",
                    }}
                  >
                    {/* Thumbnail */}
                    <div style={{ height: "130px", background: cardBgs[i % cardBgs.length], position: "relative", overflow: "hidden" }}>
                      {/* Paper grain texture overlay — theme-aware via CSS class */}
                      <div className="paper-grain" />
                      {cs.confidential && (
                        <div style={{
                          position: "absolute", top: "10px", right: "10px",
                          background: "var(--surface2)",
                          borderRadius: "5px", padding: "3px 9px",
                          fontFamily: "var(--font-mono)", fontSize: "8px",
                          letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)",
                        }}>
                          Confidential
                        </div>
                      )}
                    </div>

                    {/* Body */}
                    <div style={{ padding: "12px 16px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.06em", color: "var(--muted)" }}>
                          {cs.number}
                        </span>
                        {cs.tags.slice(0, 1).map(tag => (
                          <span key={tag} style={{
                            fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.06em",
                            padding: "2px 7px", background: "var(--surface2)",
                            color: "var(--muted)", borderRadius: "4px",
                          }}>
                            {tag}
                          </span>
                        ))}
                      </div>

                      <h3 style={{
                        fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 400,
                        lineHeight: 1.3, letterSpacing: "-0.02em",
                        color: "var(--text)", marginBottom: "12px",
                      }}>
                        {cs.title}
                      </h3>

                      <div style={{
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        paddingTop: "12px", borderTop: "1px solid var(--border)",
                      }}>
                        <div style={{ display: "flex", gap: "12px" }}>
                          {cs.metrics.slice(0, 2).map(m => (
                            <div key={m.label}>
                              <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 400, letterSpacing: "-0.03em", color: "var(--text)", lineHeight: 1, marginBottom: "2px" }}>
                                {m.value}
                              </p>
                              <p style={{ fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "0.06em", color: "var(--muted)", textTransform: "uppercase" }}>
                                {m.label}
                              </p>
                            </div>
                          ))}
                        </div>
                        <span style={{
                          fontFamily: "var(--font-body)", fontSize: "10px", fontWeight: 400,
                          padding: "6px 12px", borderRadius: "5px", whiteSpace: "nowrap",
                          background: cs.confidential ? "var(--surface2)" : "var(--text)",
                          color: cs.confidential ? "var(--muted)" : "var(--bg)",
                        }}>
                          {cs.confidential ? "Request access →" : "View ↗"}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── Panel 3: Career ── */
const YEAR_PX    = 56;   // px per year
const CAL_START  = 2012;
const CAL_END    = 2026;
const TOP_OFFSET = 20;   // px breathing room above the topmost card

type CareerItem = {
  type: "role" | "education" | "label";
  startYear: number;
  endYear?: number;
  title: string;
  subtitle?: string;
  dateLabel?: string;
  impact?: string;
};

// Month helper: year + (month-1)/12
// Jan=0, Feb=0.083, Mar=0.167, Apr=0.25, May=0.333, Jun=0.417,
// Jul=0.5, Aug=0.583, Sep=0.667, Oct=0.75, Nov=0.833, Dec=0.917
const careerItems: CareerItem[] = [
  // Work — newest first
  { type: "role",      startYear: 2025.167, endYear: 2025.583, title: "Senior Product Designer",  subtitle: "Planful Software",       dateLabel: "Mar 2025 — Aug 2025", impact: "−30% training time" },
  { type: "role",      startYear: 2024.25,  endYear: 2025.083, title: "Senior UX Designer",       subtitle: "Reputation.com",         dateLabel: "Apr 2024 — Feb 2025", impact: "−40% task time" },
  { type: "role",      startYear: 2022.417, endYear: 2023.833, title: "Senior Product Designer",  subtitle: "Zetwerk",                dateLabel: "Jun 2022 — Nov 2023", impact: "~6× revenue growth" },
  { type: "role",      startYear: 2020.583, endYear: 2022.25,  title: "Manager UX Designer",      subtitle: "FanCode / Dream Sports", dateLabel: "Aug 2020 — Apr 2022", impact: "+18% retention" },
  { type: "role",      startYear: 2016.667, endYear: 2020.5,   title: "UX Designer (Founder)",    subtitle: "Quazire Consulting",     dateLabel: "Sep 2016 — Jul 2020", impact: "0→1 founder" },
  // Education
  { type: "education", startYear: 2020.917, endYear: 2021.333, title: "Program in UX Design",         subtitle: "IIT Bombay",  dateLabel: "Dec 2020 — May 2021" },
  { type: "education", startYear: 2019,     endYear: 2019.5,   title: "PM Certification",             subtitle: "",            dateLabel: "2019"                },
  { type: "education", startYear: 2017,     endYear: 2017.5,   title: "Design Thinking & Leadership", subtitle: "DSIL Global", dateLabel: "2017"                },
];

const testimonials = [
  { quote: "Arun possesses a remarkable understanding of user needs, seamlessly navigating between design strategy and hands-on execution. His strategic mindset significantly impacted our efforts to enhance retention metrics.", name: "Raissa Fichardo", role: "Director of UX", company: "Fancode", initials: "RF" },
  { quote: "I was always impressed by his ability to simplify complex problems and create user-friendly designs. He's a thoughtful, strategic designer who balances business goals with user needs.", name: "Jeff Orshalick", role: "UX Design Manager", company: "Reputation", initials: "JO" },
  { quote: "Arun has an exceptional understanding of design and the knack to draw relevant insights to identify the right problems. His business acumen combined with a user-first approach makes him an ideal UX lead.", name: "Vikas Kotian", role: "VP Product Design", company: "Fancode", initials: "VK" },
];

function CareerPanel() {
  const totalH = (CAL_END - CAL_START) * YEAR_PX + TOP_OFFSET;
  const allYears = Array.from({ length: CAL_END - CAL_START + 1 }, (_, i) => CAL_END - i);
  const workItems = careerItems.filter(i => i.type === "role");
  const eduItems  = careerItems.filter(i => i.type === "education");
  const [hoveredItem, setHoveredItem] = useState<CareerItem | null>(null);

  // Which years fall within the hovered card's span
  const isYearActive = (yr: number) => {
    if (!hoveredItem) return false;
    const endYr = hoveredItem.endYear ?? hoveredItem.startYear + 0.5;
    return yr >= Math.floor(hoveredItem.startYear) && yr <= Math.ceil(endYr);
  };

  const NOW_Y = (CAL_END - 2026.25) * YEAR_PX + TOP_OFFSET; // y-position of the "Now" dot

  const renderCard = (item: CareerItem, isEdu: boolean, index: number) => {
    const endYr    = item.endYear ?? (item.startYear + 0.5);
    const span     = endYr - item.startYear;
    const naturalH = span * YEAR_PX - 4;
    const height   = Math.max(naturalH, 64);
    const bottomPos = (CAL_END - item.startYear) * YEAR_PX + 4 + TOP_OFFSET;
    const rawTop   = bottomPos - height;
    // Keep card at least 10px below the "Now" marker so they never collide
    const top      = Math.max(rawTop, NOW_Y + 10);
    const isHovered = hoveredItem?.title === item.title && hoveredItem?.startYear === item.startYear;

    return (
      <motion.div
        key={item.title + item.startYear}
        initial={{ opacity: 0, x: isEdu ? 8 : -8 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.45, ease: EASE, delay: index * 0.055 }}
        onMouseEnter={() => setHoveredItem(item)}
        onMouseLeave={() => setHoveredItem(null)}
        style={{
          position: "absolute",
          top: `${top}px`,
          height: `${height}px`,
          ...(isEdu
            ? { left: "calc(58% + 4px)", right: "16px" }
            : { left: "22px", right: "calc(42% + 8px)" }),
          borderRadius: "7px",
          background: isEdu ? "var(--surface2)" : "var(--surface)",
          border: `1px ${isEdu ? "dashed" : "solid"} ${isHovered ? "var(--muted)" : "var(--border)"}`,
          padding: "8px 12px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          overflow: "hidden",
          cursor: "default",
          zIndex: isHovered ? 5 : 1,
          transition: "border-color 0.15s",
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Job title — Inter, human descriptor, primary */}
          <p style={{
            fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 400,
            color: "var(--text)", letterSpacing: "-0.02em", lineHeight: 1.25,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            {item.title}
          </p>
          {/* Company / institution — Inter, proper noun, secondary */}
          {item.subtitle && (
            <p style={{
              fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 400,
              color: isHovered ? "var(--muted2)" : "var(--muted)",
              letterSpacing: "-0.01em", lineHeight: 1.2, marginTop: "3px",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              transition: "color 0.15s",
            }}>
              {item.subtitle}
            </p>
          )}
          {/* Date / impact — swaps on hover */}
          {(item.dateLabel || item.impact) && (
            <p style={{
              fontFamily: "var(--font-mono)", fontSize: "8px",
              color: isHovered && item.impact ? "var(--text)" : "var(--muted)",
              letterSpacing: "0.06em", marginTop: "3px",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              transition: "color 0.2s",
            }}>
              {isHovered && item.impact ? item.impact : item.dateLabel}
            </p>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div>
      <PanelHeader label="Career" />
      <div style={{ padding: "12px 0 32px 0" }}>

        {/* Column headers — anchored with bottom border */}
        <div style={{ display: "flex", marginBottom: "0" }}>
          <div style={{ width: "52px", flexShrink: 0 }} />
          <div style={{ flex: 1, display: "flex" }}>
            <div style={{
              flex: 1, paddingLeft: "22px", paddingBottom: "10px",
              borderBottom: "1px solid var(--border)",
            }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)" }}>Work</span>
            </div>
            <div style={{
              width: "42%", paddingLeft: "8px", paddingBottom: "10px",
              borderBottom: "1px solid var(--border)",
            }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)" }}>Education</span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex" }}>
          {/* Year axis */}
          <div style={{ width: "52px", flexShrink: 0, position: "relative", height: `${totalH}px` }}>
            {allYears.map(yr => (
              <div key={yr} style={{
                position: "absolute", top: `${(CAL_END - yr) * YEAR_PX - 6 + TOP_OFFSET}px`,
                width: "100%", textAlign: "right", paddingRight: "10px",
              }}>
                <span style={{
                  fontFamily: "var(--font-mono)", fontSize: "9px",
                  letterSpacing: "0.06em",
                  color: isYearActive(yr) ? "var(--text)" : yr === 2026 ? "var(--text)" : "var(--muted)",
                  fontWeight: 400,
                  opacity: isYearActive(yr) ? 1 : yr === 2026 ? 1 : 0.55,
                  transition: "color 0.2s, opacity 0.2s",
                }}>{yr}</span>
              </div>
            ))}
          </div>

          {/* Timeline track */}
          <div style={{ flex: 1, position: "relative", height: `${totalH}px`, paddingRight: "16px", borderBottom: "1px solid var(--border)" }}>

            {/* Horizontal grid lines — all years, uniform weight */}
            {allYears.map(yr => (
              <div key={yr} style={{
                position: "absolute", left: 0, right: 0,
                top: `${(CAL_END - yr) * YEAR_PX + TOP_OFFSET}px`,
                height: "1px",
                background: "var(--border)",
                opacity: 0.3,
              }} />
            ))}

            {/* Vertical rail */}
            <div style={{
              position: "absolute", left: "10px",
              top: 0, bottom: 0,
              width: "1px",
              background: "linear-gradient(to bottom, var(--border) 0%, var(--border) 88%, transparent 100%)",
            }} />

            {/* Column divider */}
            <div style={{
              position: "absolute", left: "58%",
              top: 0, bottom: 0,
              width: "1px", background: "var(--border)", opacity: 0.35,
            }} />

            {/* Today marker + Now label */}
            <div style={{
              position: "absolute",
              left: "6px", top: `${(CAL_END - 2026.25) * YEAR_PX + TOP_OFFSET}px`,
              display: "flex", alignItems: "center", gap: "8px", zIndex: 3,
            }}>
              <div className="today-dot" style={{
                width: "9px", height: "9px", borderRadius: "50%",
                background: "#ef4444", flexShrink: 0,
              }} />
              <span style={{
                fontFamily: "var(--font-mono)", fontSize: "7px",
                letterSpacing: "0.1em", textTransform: "uppercase",
                color: "#ef4444", opacity: 0.75,
              }}>Now</span>
            </div>

            {/* Work cards */}
            {workItems.map((item, i) => renderCard(item, false, i))}

            {/* Education cards */}
            {eduItems.map((item, i) => renderCard(item, true, i))}

          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Panel 4: Testimonials ── */
function TestimonialsPanel() {
  return (
    <div>
      <PanelHeader label="Testimonials" />
      <div style={{ padding: "24px 24px 48px" }}>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", lineHeight: 1.65, color: "var(--muted)", marginBottom: "24px", fontWeight: 400 }}>
          What people I&apos;ve worked closely with have said.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.55, ease: EASE, delay: i * 0.07 }}
              style={{
                borderRadius: "12px",
                background: "var(--surface)",
                padding: "20px",
              }}
            >
              {/* Quote mark */}
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 0.15 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: EASE, delay: i * 0.07 + 0.2 }}
                style={{
                  fontFamily: "var(--font-body)", fontSize: "28px", lineHeight: 1,
                  color: "var(--text)", marginBottom: "8px",
                  letterSpacing: "-0.02em",
                }}
              >
                &ldquo;
              </motion.p>
              <p style={{
                fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 400,
                lineHeight: 1.7, color: "var(--text)", marginBottom: "24px",
                letterSpacing: "-0.01em",
              }}>
                {t.quote}
              </p>
              {/* Author */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                  width: "36px", height: "36px", borderRadius: "50%",
                  background: "var(--surface2)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 400, color: "var(--text)" }}>
                    {t.initials}
                  </span>
                </div>
                <div>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 400, color: "var(--text)", lineHeight: 1.3 }}>
                    {t.name}
                  </p>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 400, letterSpacing: "-0.01em", color: "var(--muted)", marginTop: "2px", lineHeight: 1.3 }}>
                    {t.role} · {t.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Panel 4: AI Explorations ── */
const aiExplorations = [
  {
    number: "01",
    title: "AI-Assisted Research Synthesis",
    tags: ["Claude", "Dovetail"],
    body: "Built a workflow using Claude to synthesise raw interview transcripts into themes, opportunity statements, and HMW questions in minutes — work that used to take days. Now a core part of my discovery process.",
    status: "In use",
  },
  {
    number: "02",
    title: "Prompt-Driven Wireframing",
    tags: ["Cursor", "Figma AI"],
    body: "Experimenting with prompt-to-wireframe pipelines using Cursor and Figma AI. The output is rough, but it's a forcing function — it surfaces structural decisions before I get attached to any visual direction.",
    status: "Ongoing",
  },
  {
    number: "03",
    title: "This Portfolio",
    tags: ["Claude Code", "Next.js"],
    body: "Designed and shipped entirely using Claude Code. No separate dev handoff — I wrote the brief, Claude wrote the code, I directed the output. Proof that a designer with the right tools can own the full stack.",
    status: "Shipped",
  },
  {
    number: "04",
    title: "LLM UX Copy Reviewer",
    tags: ["GPT-4", "Figma"],
    body: "A Figma plugin prototype that runs selected copy through an LLM and flags tone, reading level, and clarity issues — with suggested rewrites. Reduces back-and-forth with content designers on early-stage screens.",
    status: "Prototype",
  },
  {
    number: "05",
    title: "AI Decision Audit Trail",
    tags: ["Claude", "Notion"],
    body: "A structured prompt system that captures design decisions with rationale, tradeoffs, and alternatives considered. Feeds directly into Notion as a living decision log. Useful for async teams and post-mortems.",
    status: "In use",
  },
];

const statusColors: Record<string, string> = {
  "In use":   "#16a34a",
  "Ongoing":  "#2563eb",
  "Shipped":  "#7c3aed",
  "Prototype":"#d97706",
};

function AIExplorationsPanel() {
  return (
    <div>
      <PanelHeader label="AI Explorations" />
      <div style={{ padding: "16px 24px 48px" }}>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", lineHeight: 1.65, color: "var(--muted)", marginBottom: "24px", fontWeight: 400 }}>
          Side experiments at the intersection of AI and design practice. Some are workflows, some are tools, some are just curiosity.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {aiExplorations.map((item, i) => (
            <motion.div
              key={item.number}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.5, ease: EASE, delay: i * 0.06 }}
              style={{
                padding: "24px 0",
                borderBottom: "1px solid var(--border)",
                borderTop: i === 0 ? "1px solid var(--border)" : "none",
                transition: "opacity 0.18s",
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.7")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              {/* Number + status */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.06em", color: "var(--muted)" }}>
                  {item.number}
                </span>
                <span style={{
                  fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "0.06em",
                  padding: "3px 8px", borderRadius: "4px",
                  background: statusColors[item.status] + "18",
                  color: statusColors[item.status],
                  textTransform: "uppercase",
                }}>
                  {item.status}
                </span>
              </div>

              {/* Title */}
              <h3 style={{ fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 400, color: "var(--text)", letterSpacing: "-0.01em", lineHeight: 1.3, marginBottom: "8px" }}>
                {item.title}
              </h3>

              {/* Tags */}
              <div style={{ display: "flex", gap: "6px", marginBottom: "8px", flexWrap: "wrap" }}>
                {item.tags.map(tag => (
                  <span key={tag} style={{
                    fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "0.05em",
                    padding: "2px 7px", background: "var(--surface2)",
                    color: "var(--muted)", borderRadius: "4px",
                  }}>
                    {tag}
                  </span>
                ))}
              </div>

              {/* Body */}
              <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", lineHeight: 1.65, color: "var(--muted2)", fontWeight: 400 }}>
                {item.body}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <div style={{ marginTop: "32px" }}>
          <h2 style={{ fontFamily: "var(--font-body)", fontSize: "20px", fontWeight: 400, letterSpacing: "-0.025em", lineHeight: 1.25, color: "var(--text)", marginBottom: "8px" }}>
            Have a hard problem?
          </h2>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", lineHeight: 1.65, color: "var(--muted)", marginBottom: "24px", fontWeight: 400 }}>
            I&apos;m always interested in complex design challenges at the intersection of product, data, and AI.
          </p>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <a
              href="mailto:akgaddam02@gmail.com"
              style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 400, padding: "10px 20px", background: "var(--text)", color: "var(--bg)", borderRadius: "7px", letterSpacing: "-0.01em", transition: "opacity 0.15s" }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.75")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              Say hello →
            </a>
            <Link
              href="https://linkedin.com/in/akgaddam"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 400, padding: "10px 20px", background: "var(--surface2)", color: "var(--muted)", borderRadius: "7px", letterSpacing: "-0.01em", transition: "opacity 0.15s" }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.7")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              LinkedIn ↗
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: "48px", paddingTop: "24px", borderTop: "1px solid var(--border)" }}>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.06em", color: "var(--muted)" }}>
            © 2026 · Arun Gaddam · Hyderabad, India
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Home ── */
export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activePanel, setActivePanel] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1300);
    return () => clearTimeout(t);
  }, []);

  const scrollByPanel = useCallback((dir: 1 | -1) => {
    const el = containerRef.current;
    if (!el) return;
    const panelWidth = el.querySelector(".panel")?.clientWidth ?? 420;
    el.scrollBy({ left: dir * (panelWidth + 10), behavior: "smooth" });
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = () => {
      const panels = el.querySelectorAll<HTMLElement>(".panel");
      let closest = 0;
      let minDist = Infinity;
      panels.forEach((p, i) => {
        const dist = Math.abs(p.getBoundingClientRect().left - 24);
        if (dist < minDist) { minDist = dist; closest = i; }
      });
      setActivePanel(closest);
    };
    el.addEventListener("scroll", handler, { passive: true });
    return () => el.removeEventListener("scroll", handler);
  }, []);

  // Keyboard navigation — ← → arrow keys (#3)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") scrollByPanel(1);
      if (e.key === "ArrowLeft")  scrollByPanel(-1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [scrollByPanel]);

  return (
    <>
      <LoadingScreen visible={loading} />
      <Cursor />
      <HomeNav onPrev={() => scrollByPanel(-1)} onNext={() => scrollByPanel(1)} activePanel={activePanel} />
      {/* Right-edge fade — signals more panels */}
      <div className="panels-right-fade" style={{
        position: "fixed", top: "52px", right: 0,
        width: "64px", height: "calc(100vh - 52px)",
        background: "linear-gradient(to right, transparent, var(--chrome))",
        pointerEvents: "none", zIndex: 100,
      }} />
      <main className="home-main" style={{ paddingTop: "52px", height: "100vh", overflow: "hidden", background: "var(--chrome)" }}>
        {/* 4-panel horizontal layout */}
        <div
          ref={containerRef}
          className="panels-container"
          style={{
            display: "flex",
            height: "calc(100vh - 52px)",
            overflowX: "auto",
            overflowY: "hidden",
            gap: "8px",
            padding: "8px 0 16px 24px",
            boxSizing: "border-box",
            scrollSnapType: "x mandatory",
          }}
        >
          {/* Panel 1 — About */}
          <div className="panel" style={{
            minWidth: "380px",
            width: "420px",
            flex: "0 0 auto",
            height: "100%",
            overflowY: "auto",
            borderRadius: "18px",
            background: "var(--bg)",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 4px 20px rgba(0,0,0,0.04)",
            scrollSnapAlign: "start",
          }}>
            <AboutPanel />
          </div>

          {/* Panel 2 — Work */}
          <div className="panel" style={{
            minWidth: "380px",
            width: "440px",
            flex: "0 0 auto",
            height: "100%",
            overflowY: "auto",
            borderRadius: "18px",
            background: "var(--bg)",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 4px 20px rgba(0,0,0,0.04)",
            scrollSnapAlign: "start",
          }}>
            <WorkPanel />
          </div>

          {/* Panel 3 — Career */}
          <div className="panel" style={{
            minWidth: "380px",
            width: "420px",
            flex: "0 0 auto",
            height: "100%",
            overflowY: "auto",
            borderRadius: "18px",
            background: "var(--bg)",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 4px 20px rgba(0,0,0,0.04)",
            scrollSnapAlign: "start",
          }}>
            <CareerPanel />
          </div>

          {/* Panel 4 — Testimonials */}
          <div className="panel" style={{
            minWidth: "360px",
            width: "400px",
            flex: "0 0 auto",
            height: "100%",
            overflowY: "auto",
            borderRadius: "18px",
            background: "var(--bg)",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 4px 20px rgba(0,0,0,0.04)",
            scrollSnapAlign: "start",
          }}>
            <TestimonialsPanel />
          </div>

          {/* Panel 5 — AI Explorations */}
          <div className="panel" style={{
            minWidth: "380px",
            width: "420px",
            flex: "0 0 auto",
            height: "100%",
            overflowY: "auto",
            borderRadius: "18px",
            background: "var(--bg)",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 4px 20px rgba(0,0,0,0.04)",
            scrollSnapAlign: "start",
          }}>
            <AIExplorationsPanel />
          </div>
        </div>
      </main>

      <style>{`
        .panels-container::-webkit-scrollbar { display: none; }
        .panels-container { -ms-overflow-style: none; scrollbar-width: none; }
        .panel::-webkit-scrollbar { width: 0px; }
        .panel { -ms-overflow-style: none; scrollbar-width: none; }

        @keyframes today-pulse {
          0%   { box-shadow: 0 0 0 0px rgba(239,68,68,0.5); }
          60%  { box-shadow: 0 0 0 6px rgba(239,68,68,0); }
          100% { box-shadow: 0 0 0 0px rgba(239,68,68,0); }
        }
        .today-dot {
          box-shadow: 0 0 0 3px rgba(239,68,68,0.15);
          animation: today-pulse 2.8s ease-out infinite;
        }

        @media (max-width: 640px) {
          .home-main { height: auto !important; overflow: visible !important; }
          .panels-right-fade { display: none !important; }
          .panels-container {
            flex-direction: column !important;
            overflow-x: hidden !important;
            overflow-y: visible !important;
            scroll-snap-type: none !important;
            padding: 8px 12px 32px !important;
            gap: 12px !important;
            height: auto !important;
          }
          .panel {
            min-width: unset !important;
            width: 100% !important;
            height: auto !important;
            flex: none !important;
            scroll-snap-align: none !important;
          }
        }
      `}</style>
    </>
  );
}
