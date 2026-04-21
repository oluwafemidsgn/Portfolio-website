"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { EASE_OUT_EXPO } from "./easing";

export type AccordionEntry = {
  id: string;
  title: string;
  body: string;
};

type Props = {
  items: AccordionEntry[];
  /** Start with the first item open. Defaults to true. */
  openFirst?: boolean;
};

/**
 * Single-column accordion that matches the hairline design language —
 * tight rows, uppercase micro labels on the left, a plus/minus glyph on
 * the right, and a height-animated body underneath.
 */
export function Accordion({ items, openFirst = true }: Props) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState<string | null>(
    openFirst && items[0] ? items[0].id : null,
  );

  return (
    <ul className="divide-y divide-[var(--rule)]">
      {items.map((item, i) => {
        const isOpen = open === item.id;
        return (
          <li key={item.id} className="py-5">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : item.id)}
              aria-expanded={isOpen}
              aria-controls={`acc-body-${item.id}`}
              className="w-full flex items-center justify-between gap-6 text-left group outline-none focus-visible:ring-1 focus-visible:ring-ink"
              data-cursor="zoom"
            >
              <span className="flex items-baseline gap-4 min-w-0">
                <span className="t-micro text-body tabular-nums">
                  / {String(i + 1).padStart(2, "0")}
                </span>
                <span className="t-nav text-ink truncate">{item.title}</span>
              </span>
              <motion.span
                className="t-nav text-strong shrink-0"
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
                aria-hidden
              >
                +
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="body"
                  id={`acc-body-${item.id}`}
                  initial={reduce ? undefined : { height: 0, opacity: 0 }}
                  animate={reduce ? undefined : { height: "auto", opacity: 1 }}
                  exit={reduce ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
                  className="overflow-hidden"
                >
                  <p className="pt-4 pl-10 t-body text-strong max-w-[48ch] whitespace-pre-line">
                    {item.body}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
