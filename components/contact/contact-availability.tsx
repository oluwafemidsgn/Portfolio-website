"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EASE_OUT_EXPO } from "../motion/easing";
import { AVAILABILITY } from "@/lib/site";

/**
 * Always-on availability line: a live dot and one sentence, so people know
 * they can get in touch without checking dates.
 */
export function ContactAvailability() {
  const reduce = useReducedMotion();
  return (
    <section className="page-gutter">
      <motion.div
        className="border-y border-[var(--rule)] py-6 grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-4 lg:gap-6 items-center"
        initial={reduce ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE_OUT_EXPO, delay: 0.3 }}
      >
        <h2 className="t-micro text-body">AVAILABILITY</h2>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="flex items-center gap-3 t-nav text-ink">
            <span className="relative flex h-2.5 w-2.5" aria-hidden>
              {!reduce && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#22c55e] opacity-60" />}
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#22c55e]" />
            </span>
            {AVAILABILITY.toUpperCase()}
          </p>
          <p className="t-body text-strong">Product design, design engineering and MVP builds.</p>
        </div>
      </motion.div>
    </section>
  );
}
