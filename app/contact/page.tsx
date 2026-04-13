"use client";

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Cursor from "@/components/Cursor";
import Link from "next/link";
import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

const contactItems = [
  { label: "Email",    value: "hello@arungaddam.com",       href: "mailto:hello@arungaddam.com" },
  { label: "LinkedIn", value: "linkedin.com/in/arungaddam", href: "https://linkedin.com/in/arungaddam" },
  { label: "Resume",   value: "Available on request",        href: "/resume.pdf" },
];

const expertise = [
  "Enterprise SaaS & B2B AI",
  "Complex workflow platforms",
  "0→1 and scaling products",
  "Remote-first or Bay Area / Seattle",
];

export default function ContactPage() {
  return (
    <>
      <Cursor />
      <Nav />
      <main style={{ paddingTop: "52px", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <section style={{ flex: 1, padding: "64px 0" }}>
          <div className="page-pad">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: EASE }}
              style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "20px" }}
            >
              Contact
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: EASE, delay: 0.08 }}
              style={{ fontFamily: "var(--font-body)", fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 600, lineHeight: 1.2, letterSpacing: "-0.03em", color: "var(--text)", marginBottom: "20px" }}
            >
              Let&apos;s talk about hard problems.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
              style={{ fontFamily: "var(--font-body)", fontSize: "15px", lineHeight: 1.75, color: "var(--muted2)", marginBottom: "48px", maxWidth: "440px" }}
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
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 0", borderTop: "1px solid var(--border)", gap: "16px", transition: "opacity 0.15s" }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = "0.6")}
                  onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                >
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)" }}>{label}</p>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 500, color: "var(--text)", letterSpacing: "-0.01em" }}>{value}</p>
                </Link>
              ))}
              <div style={{ borderTop: "1px solid var(--border)" }} />
            </motion.div>

            {/* Availability card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: EASE, delay: 0.3 }}
              style={{ background: "var(--surface)", borderRadius: "12px", padding: "28px" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                <motion.span
                  animate={{ boxShadow: ["0 0 0 0px rgba(34,197,94,0.5)", "0 0 0 5px rgba(34,197,94,0)"] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                  style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22C55E", display: "inline-block" }}
                />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--muted)" }}>
                  Available now
                </span>
              </div>
              <h2 style={{ fontFamily: "var(--font-body)", fontSize: "17px", fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.3, color: "var(--text)", marginBottom: "16px" }}>
                Senior Product Designer targeting Staff / Senior II
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "24px" }}>
                {expertise.map(item => (
                  <div key={item} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ color: "#22C55E", fontSize: "12px", fontWeight: 700, flexShrink: 0 }}>✓</span>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--muted2)" }}>{item}</p>
                  </div>
                ))}
              </div>
              <Link href="mailto:hello@arungaddam.com" className="btn-primary" style={{ display: "block", textAlign: "center" }}>
                Start a conversation →
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
