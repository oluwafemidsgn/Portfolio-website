"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EASE_OUT_EXPO } from "./easing";

type SplitLinesProps = {
  lines: string[];
  className?: string;
  delay?: number;
  /** Stagger between lines, in seconds. */
  stagger?: number;
  /** When to trigger the reveal. "mount" fires immediately, "view" fires on scroll. */
  trigger?: "mount" | "view";
};

/**
 * Renders each line wrapped in an overflow-hidden mask so the text slides up
 * from beneath a horizontal seam. Classic editorial reveal.
 */
export function SplitLines({
  lines,
  className,
  delay = 0,
  stagger = 0.08,
  trigger = "mount",
}: SplitLinesProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <span className={className}>
        {lines.map((line, i) => (
          <span key={i} className="block">
            {line}
          </span>
        ))}
      </span>
    );
  }

  const container = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const child = {
    hidden: { y: "110%" },
    visible: {
      y: "0%",
      transition: { duration: 0.9, ease: EASE_OUT_EXPO },
    },
  };

  return (
    <motion.span
      className={className}
      variants={container}
      initial="hidden"
      {...(trigger === "view"
        ? { whileInView: "visible", viewport: { once: true, amount: 0.4 } }
        : { animate: "visible" })}
    >
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden">
          <motion.span variants={child} className="block will-change-transform">
            {line}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
