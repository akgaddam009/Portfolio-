"use client";

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Cursor from "@/components/Cursor";
import PageTransition from "@/components/PageTransition";
import Link from "next/link";
import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

const contactItems = [
  { label: "Email",    value: "akgaddam02@gmail.com",           href: "mailto:akgaddam02@gmail.com" },
  { label: "LinkedIn", value: "linkedin.com/in/akgaddam",        href: "https://linkedin.com/in/akgaddam" },
];

const expertise = [
  "Enterprise SaaS & B2B AI",
  "Complex workflow platforms",
  "0→1 and scaling products",
  "Cross-functional design leadership",
];

export default function ContactPage() {
  return (
    <>
      <Cursor />
      <Nav />
      <main style={{ paddingTop: "52px", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <PageTransition>
        <section style={{ flex: 1, padding: "48px 0" }}>
          <div className="page-pad">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: EASE }}
              style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "16px" }}
            >
              Contact
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: EASE, delay: 0.08 }}
              style={{ fontFamily: "var(--font-body)", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 300, lineHeight: 1.2, letterSpacing: "-0.03em", color: "var(--text)", marginBottom: "16px" }}
            >
              Let&apos;s talk about hard problems.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
              style={{ fontFamily: "var(--font-body)", fontSize: "14px", lineHeight: 1.7, color: "var(--muted)", marginBottom: "48px", maxWidth: "440px" }}
            >
              I&apos;m open to Staff / Senior II product design roles at companies building enterprise tools. If you&apos;re working on something complex and consequential — I want to hear about it.
            </motion.p>

            {/* Contact list */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.22 }}
              style={{ marginBottom: "48px" }}
            >
              {contactItems.map(({ label, value, href }) => (
                <Link
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderTop: "1px solid var(--border)", gap: "16px", transition: "opacity 0.15s" }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = "0.6")}
                  onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                >
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)" }}>{label}</p>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 400, color: "var(--text)", letterSpacing: "-0.01em" }}>{value}</p>
                </Link>
              ))}
              <div style={{ borderTop: "1px solid var(--border)" }} />
            </motion.div>

            {/* Availability card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: EASE, delay: 0.3 }}
              style={{ background: "var(--surface)", borderRadius: "12px", padding: "24px" }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span className="availability-dot" />
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--muted)" }}>
                    Open to opportunities
                  </span>
                </div>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.05em", color: "var(--muted)", opacity: 0.6 }}>
                  Updated Apr 2026
                </span>
              </div>
              <h2 style={{ fontFamily: "var(--font-body)", fontSize: "16px", fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1.35, color: "var(--text)", marginBottom: "16px" }}>
                Senior Product Designer targeting Staff / Senior II
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "24px" }}>
                {expertise.map(item => (
                  <div key={item} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--muted)", flexShrink: 0 }}>—</span>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--muted2)" }}>{item}</p>
                  </div>
                ))}
              </div>
              <Link href="mailto:akgaddam02@gmail.com" className="btn-primary" style={{ display: "inline-flex" }}>
                Start a conversation →
              </Link>
            </motion.div>
          </div>
        </section>
      </PageTransition>
      </main>
      <Footer />
    </>
  );
}
