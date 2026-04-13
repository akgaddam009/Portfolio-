"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Nav() {
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText("hello@arungaddam.com");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          zIndex: 200,
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(16px) saturate(160%)",
          WebkitBackdropFilter: "blur(16px) saturate(160%)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            padding: "0 24px",
            height: "52px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Name — logo */}
          <Link
            href="/"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "14px",
              fontWeight: 600,
              color: "var(--text)",
              letterSpacing: "-0.02em",
              transition: "opacity 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.5")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            Arun Gaddam
          </Link>

          {/* Desktop: nav links + email copy */}
          <nav
            className="desktop-nav"
            style={{ display: "flex", alignItems: "center", gap: "28px" }}
          >
            {[
              { href: "/#work", label: "Work" },
              { href: "/about", label: "About" },
              { href: "/contact", label: "Contact" },
            ].map(({ href, label }) => (
              <Link key={href} href={href} className="nav-link">
                {label}
              </Link>
            ))}

            <div
              style={{ width: "1px", height: "14px", background: "var(--border)" }}
            />

            {/* Copy email — MC-style affordance */}
            <button
              onClick={copyEmail}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontFamily: "var(--font-body)",
                fontSize: "13px",
                fontWeight: 500,
                color: copied ? "#16a34a" : "var(--muted)",
                background: "none",
                border: "none",
                padding: "0",
                transition: "color 0.2s",
                letterSpacing: "-0.01em",
              }}
              onMouseEnter={e => { if (!copied) e.currentTarget.style.color = "var(--text)"; }}
              onMouseLeave={e => { if (!copied) e.currentTarget.style.color = "var(--muted)"; }}
            >
              <span style={{ fontSize: "11px" }}>{copied ? "✓" : "✉"}</span>
              {copied ? "Copied!" : "Copy email"}
            </button>
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="mobile-menu-btn"
            style={{ background: "none", border: "none", padding: "4px", display: "none" }}
            aria-label="Toggle menu"
          >
            <div style={{ width: "20px", display: "flex", flexDirection: "column", gap: "4px" }}>
              {[0, 1].map(i => (
                <motion.span
                  key={i}
                  animate={{
                    rotate: menuOpen ? (i === 0 ? 45 : -45) : 0,
                    y:      menuOpen ? (i === 0 ? 6  : -6 ) : 0,
                  }}
                  transition={{ duration: 0.25, ease: EASE }}
                  style={{ display: "block", height: "1.5px", background: "var(--text)", borderRadius: "1px" }}
                />
              ))}
            </div>
          </button>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed", top: "52px", left: 0, right: 0, bottom: 0,
              background: "var(--bg)", zIndex: 199,
              padding: "32px 24px",
              display: "flex", flexDirection: "column", gap: "4px",
            }}
          >
            {[
              { href: "/#work", label: "Work" },
              { href: "/about", label: "About" },
              { href: "/contact", label: "Contact" },
            ].map(({ href, label }, i) => (
              <motion.div
                key={href}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3, ease: EASE }}
              >
                <Link
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: "block",
                    fontFamily: "var(--font-body)",
                    fontSize: "28px",
                    fontWeight: 600,
                    letterSpacing: "-0.02em",
                    color: "var(--text)",
                    padding: "14px 0",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  {label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 640px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}
