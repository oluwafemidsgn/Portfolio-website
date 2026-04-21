"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { EASE_OUT_EXPO } from "./easing";

type FrameProps = {
  children: ReactNode;
  className?: string;
  /** Duration for each line to draw. Default 0.9s. */
  duration?: number;
  /** Delay before the animation starts. */
  delay?: number;
  /** Tag to render. Defaults to div. */
  as?: "div" | "section" | "article";
};

/**
 * Draws four hairline borders around its children on scroll. Lines grow in
 * sequence: top from left, right from top, bottom from right, left from
 * bottom — so the frame feels like it's being constructed around the
 * content.
 *
 * Also flips a `data-revealed="true"` attribute when in view, which the
 * global stylesheet uses to cascade-reveal internal column rules and
 * horizontal dividers nested inside the Frame.
 */
export function Frame({
  children,
  className,
  duration = 0.9,
  delay = 0,
  as = "div",
}: FrameProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, {
    once: true,
    amount: 0.15,
    margin: "0px 0px -10% 0px",
  });

  const revealed = reduce ? true : inView;
  const Tag = as === "section" ? motion.section : as === "article" ? motion.article : motion.div;

  const common = {
    initial: reduce ? "visible" : "hidden",
    animate: revealed ? "visible" : "hidden",
  } as const;

  return (
    <Tag
      ref={ref as React.RefObject<HTMLDivElement>}
      data-revealed={revealed ? "true" : "false"}
      className={`relative ${className ?? ""}`}
    >
      {/* top — grows from the left */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-[var(--rule)] origin-left z-10"
        variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1 } }}
        transition={{ duration, ease: EASE_OUT_EXPO, delay }}
        {...common}
      />
      {/* right — grows from the top */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute top-0 right-0 bottom-0 w-px bg-[var(--rule)] origin-top z-10"
        variants={{ hidden: { scaleY: 0 }, visible: { scaleY: 1 } }}
        transition={{ duration, ease: EASE_OUT_EXPO, delay: delay + duration * 0.3 }}
        {...common}
      />
      {/* bottom — grows from the right */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-[var(--rule)] origin-right z-10"
        variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1 } }}
        transition={{ duration, ease: EASE_OUT_EXPO, delay: delay + duration * 0.45 }}
        {...common}
      />
      {/* left — grows from the bottom */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 bottom-0 w-px bg-[var(--rule)] origin-bottom z-10"
        variants={{ hidden: { scaleY: 0 }, visible: { scaleY: 1 } }}
        transition={{ duration, ease: EASE_OUT_EXPO, delay: delay + duration * 0.15 }}
        {...common}
      />
      {children}
    </Tag>
  );
}
