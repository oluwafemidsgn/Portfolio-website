"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import type { ReactNode } from "react";

type MarqueeProps = {
  children: ReactNode;
  /** Seconds for one full loop. Smaller = faster. */
  speed?: number;
  /** If true, pause while the pointer is over. */
  pauseOnHover?: boolean;
  className?: string;
};

/**
 * An infinite horizontal marquee. Renders two copies of its children so the
 * seam between loops is invisible. Uses transform (GPU-cheap) and respects
 * reduced-motion by rendering a single static copy.
 */
export function Marquee({
  children,
  speed = 24,
  pauseOnHover = false,
  className,
}: MarqueeProps) {
  const reduce = useReducedMotion();
  const [hovered, setHovered] = useState(false);

  if (reduce) {
    return (
      <div className={`${className ?? ""} whitespace-nowrap overflow-hidden`}>
        {children}
      </div>
    );
  }

  return (
    <div
      className={`${className ?? ""} relative overflow-hidden`}
      onMouseEnter={() => pauseOnHover && setHovered(true)}
      onMouseLeave={() => pauseOnHover && setHovered(false)}
    >
      <motion.div
        className="flex whitespace-nowrap will-change-transform"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        style={{ animationPlayState: hovered ? "paused" : "running" }}
      >
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0" aria-hidden>
          {children}
        </div>
      </motion.div>
    </div>
  );
}
