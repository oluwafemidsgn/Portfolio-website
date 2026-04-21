"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { EASE_OUT_EXPO } from "../motion/easing";

type Props = {
  href: string;
  title: string;
  type?: string;
};

/**
 * Pill that links to the next case study. On hover it fills with ink from
 * the left — same language as the services rows — and inverts text color
 * to paper. The arrow slides outward to reinforce the direction of travel.
 */
export function NextCaseStudy({ href, title, type }: Props) {
  return (
    <Link
      href={href}
      className="relative block overflow-hidden outline-none focus-visible:ring-1 focus-visible:ring-ink"
      data-cursor="zoom"
    >
      <motion.div
        initial="rest"
        whileHover="hover"
        animate="rest"
        className="relative"
      >
        {/* Ink wipe from the left. */}
        <motion.div
          aria-hidden
          className="absolute inset-0 bg-ink origin-left"
          variants={{ rest: { scaleX: 0 }, hover: { scaleX: 1 } }}
          transition={{ duration: 0.55, ease: EASE_OUT_EXPO }}
        />

        <div className="relative flex items-center justify-between gap-6 p-8 md:p-10">
          <div className="flex flex-col gap-2 min-w-0">
            <motion.span
              className="t-micro"
              variants={{
                rest: { color: "var(--color-body)" },
                hover: { color: "var(--color-paper)" },
              }}
              transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
            >
              NEXT CASE STUDY {type ? `· ${type.toUpperCase()}` : ""}
            </motion.span>
            <motion.span
              className="t-title truncate"
              variants={{
                rest: { color: "var(--color-ink)", x: 0 },
                hover: { color: "var(--color-paper)", x: 8 },
              }}
              transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
            >
              {title}
            </motion.span>
          </div>
          <motion.span
            aria-hidden
            className="t-nav shrink-0"
            variants={{
              rest: { color: "var(--color-strong)", x: 0 },
              hover: { color: "var(--color-paper)", x: 6 },
            }}
            transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
          >
            →
          </motion.span>
        </div>
      </motion.div>
    </Link>
  );
}
