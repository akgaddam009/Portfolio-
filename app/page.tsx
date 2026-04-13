"use client";

import { motion } from "framer-motion";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import CaseStudyCard from "@/components/CaseStudyCard";
import Approach from "@/components/Approach";
import Testimonials from "@/components/Testimonials";
import Awards from "@/components/Awards";
import ContactCTA from "@/components/ContactCTA";
import Footer from "@/components/Footer";
import Cursor from "@/components/Cursor";
import { caseStudies } from "@/lib/caseStudies";

const EASE = [0.22, 1, 0.36, 1] as const;

function WorkSection() {
  const pairs: typeof caseStudies[] = [];
  for (let i = 0; i < caseStudies.length; i += 2) {
    pairs.push(caseStudies.slice(i, i + 2));
  }

  return (
    <section id="work" style={{ padding: "64px 0 0" }}>
      <div className="page-pad-wide">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
          style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}
        >
          <p style={{
            fontFamily: "var(--font-mono)", fontSize: "10px",
            letterSpacing: "0.08em", textTransform: "uppercase",
            color: "var(--muted)", whiteSpace: "nowrap",
          }}>
            Select Work
          </p>
          <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
        </motion.div>

        {/* 2-column card grid */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {pairs.map((pair, rowIdx) => (
            <div
              key={rowIdx}
              style={{ display: "grid", gridTemplateColumns: pair.length === 2 ? "1fr 1fr" : "1fr", gap: "12px" }}
              className="work-row"
            >
              {pair.map((cs, i) => (
                <CaseStudyCard key={cs.slug} cs={cs} index={rowIdx * 2 + i} />
              ))}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) { .work-row { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Cursor />
      <Nav />
      <main style={{ paddingTop: "52px" }}>
        <Hero />
        <Marquee />
        <WorkSection />
        <Approach />
        <Testimonials />
        <Awards />
        <ContactCTA />
      </main>
      <Footer />
    </>
  );
}
