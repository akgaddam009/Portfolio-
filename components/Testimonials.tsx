"use client";

import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

const testimonials = [
  { quote: "Arun possesses a remarkable understanding of user needs, seamlessly navigating between design strategy and hands-on execution. His strategic mindset significantly impacted our efforts to enhance retention metrics.", name: "Raissa Fichardo", role: "Director of UX", company: "Fancode", initials: "RF", hue: "#F5EDE4" },
  { quote: "I was always impressed by his ability to simplify complex problems and create user-friendly designs. He's a thoughtful, strategic designer who balances business goals with user needs — making sure every solution is both effective and intuitive.", name: "Jeff Orshalick", role: "UX Design Manager", company: "Reputation", initials: "JO", hue: "#E4EBF5" },
  { quote: "Arun has an exceptional understanding of design and the knack to draw relevant insights to identify the right problems. His business acumen combined with a user-first approach makes him an ideal UX lead.", name: "Vikas Kotian", role: "VP Product Design", company: "Fancode", initials: "VK", hue: "#E4F5EC" },
];

export default function Testimonials() {
  return (
    <section style={{ padding: "64px 0 0" }}>
      <div className="page-pad">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
          style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}
        >
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", whiteSpace: "nowrap" }}>
            In their words
          </p>
          <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
        </motion.div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.65, ease: EASE, delay: i * 0.07 }}
              style={{
                padding: "28px 0",
                borderBottom: "1px solid var(--border)",
              }}
            >
              {/* Quote */}
              <p style={{
                fontFamily: "var(--font-body)", fontSize: "15px", fontWeight: 400,
                lineHeight: 1.7, color: "var(--muted2)", marginBottom: "20px",
                letterSpacing: "-0.01em",
              }}>
                &ldquo;{t.quote}&rdquo;
              </p>
              {/* Author */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                  width: "36px", height: "36px", borderRadius: "50%",
                  background: t.hue, display: "flex", alignItems: "center",
                  justifyContent: "center", flexShrink: 0,
                }}>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 600, color: "var(--text)" }}>
                    {t.initials}
                  </span>
                </div>
                <div>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 600, color: "var(--text)", lineHeight: 1.3 }}>
                    {t.name}
                  </p>
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.04em", color: "var(--muted)", marginTop: "1px" }}>
                    {t.role} · {t.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
