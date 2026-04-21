"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode, JSX } from "react";
import { EASE_OUT_EXPO } from "./easing";

type RevealProps = {
  children: ReactNode;
  as?: "div" | "section" | "li" | "article";
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
};

/**
 * Fade + translate-Y on viewport enter. Honors reduced-motion by rendering
 * the children inline with no animation.
 */
export function Reveal({
  children,
  as = "div",
  delay = 0,
  y = 24,
  className,
  once = true,
}: RevealProps) {
  const reduce = useReducedMotion();
  const MotionTag =
    as === "section"
      ? motion.section
      : as === "li"
      ? motion.li
      : as === "article"
      ? motion.article
      : motion.div;

  if (reduce) {
    const Tag = as as keyof JSX.IntrinsicElements;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.15, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay }}
    >
      {children}
    </MotionTag>
  );
}
