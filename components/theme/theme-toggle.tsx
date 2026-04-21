"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE_OUT_EXPO } from "../motion/easing";

type Theme = "light" | "dark";

/**
 * Small sun / moon toggle that sits in the nav.
 *
 * The initial theme is read from `<html data-theme>` (which the
 * ThemeScript sets before paint) so the toggle's first render always
 * matches what's on screen. Saving the preference to localStorage
 * means the choice survives a reload.
 */
export function ThemeToggle({
  className = "",
}: {
  className?: string;
}) {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const current = (document.documentElement.getAttribute("data-theme") ??
      "light") as Theme;
    setTheme(current);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* storage disabled — the preference just won't persist */
    }
  };

  // Render a neutral placeholder on the server pass; this prevents
  // the button from briefly showing the wrong glyph before the effect
  // resolves the actual theme.
  if (theme === null) {
    return (
      <span
        aria-hidden
        className={`inline-block h-[22px] w-[22px] ${className}`}
      />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      data-cursor="zoom"
      className={`relative inline-flex h-[22px] w-[22px] items-center justify-center text-ink outline-none group ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? "moon" : "sun"}
          aria-hidden
          initial={{ rotate: -60, opacity: 0, scale: 0.7 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 60, opacity: 0, scale: 0.7 }}
          transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
          className="block"
        >
          {isDark ? <MoonGlyph /> : <SunGlyph />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

function SunGlyph() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="11" cy="11" r="3.5" stroke="currentColor" strokeWidth="1" />
      {[...Array(8)].map((_, i) => {
        const angle = (i * Math.PI) / 4;
        const r1 = 6;
        const r2 = 8.5;
        const x1 = 11 + Math.cos(angle) * r1;
        const y1 = 11 + Math.sin(angle) * r1;
        const x2 = 11 + Math.cos(angle) * r2;
        const y2 = 11 + Math.sin(angle) * r2;
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}

function MoonGlyph() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.5 12.8A6.5 6.5 0 0 1 9.2 5.5a6.5 6.5 0 1 0 7.3 7.3Z"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}
