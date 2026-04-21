"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { EASE_OUT_EXPO } from "../motion/easing";

const ROWS = [
  {
    q: "Q1 2026",
    status: "BOOKED",
    note: "Two long-term brand engagements — wrapping in March.",
  },
  {
    q: "Q2 2026",
    status: "OPEN",
    note: "Two slots available for 6–10 week sprints.",
  },
  {
    q: "Q3 2026",
    status: "WAITLIST",
    note: "Accepting a shortlist of embedded collaborations.",
  },
];

/**
 * A small status table showing what quarters are open, so people don't
 * have to email just to find out. Fits the site's tabular, editorial feel.
 */
export function ContactAvailability() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduce = useReducedMotion();

  return (
    <section className="page-gutter">
      <div
        ref={ref}
        className="border-y border-[var(--rule)] pt-8 pb-6 grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-6"
      >
        <h2 className="t-micro text-body">AVAILABILITY</h2>

        <ul className="flex flex-col">
          {ROWS.map((row, i) => (
            <motion.li
              key={row.q}
              className="rule-h grid grid-cols-[90px_120px_1fr] items-baseline gap-4 py-3"
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={
                inView || reduce
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 14 }
              }
              transition={{
                duration: 0.65,
                delay: 0.06 * i,
                ease: EASE_OUT_EXPO,
              }}
            >
              <span className="t-nav text-ink tabular-nums">{row.q}</span>
              <span
                className={
                  "t-micro " +
                  (row.status === "OPEN"
                    ? "text-ink"
                    : row.status === "BOOKED"
                      ? "text-body line-through decoration-from-font"
                      : "text-strong")
                }
              >
                {row.status}
              </span>
              <span className="t-body text-strong">{row.note}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
