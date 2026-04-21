"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { EASE_OUT_EXPO } from "../motion/easing";
import type { CaseStudy } from "@/lib/types";

type Props = {
  study: CaseStudy;
  /** Index for stagger. */
  i: number;
};

/**
 * Tile used on the /projects grid. Mirrors the home-page ProjectThumb but
 * links to /projects/[slug] and uses the stored cover image when present.
 */
export function ProjectCard({ study, i }: Props) {
  const href = `/projects/${study.slug}`;
  const label = study.type || "Case study";

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.7,
        ease: EASE_OUT_EXPO,
        delay: i * 0.05,
      }}
    >
      <Link
        href={href}
        aria-label={`${study.title} — ${label}`}
        className="thumb-card group flex flex-col p-2 outline-none focus-visible:ring-1 focus-visible:ring-ink"
        data-cursor="zoom"
      >
        <motion.div
          className="thumb w-full aspect-[432/298] overflow-hidden relative"
          initial="rest"
          whileHover="hover"
          animate="rest"
        >
          {/* Cover image, scales subtly on hover. */}
          <motion.div
            className="absolute inset-0 bg-mute"
            style={
              study.coverImage
                ? {
                    backgroundImage: `url(${study.coverImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }
                : undefined
            }
            variants={{ rest: { scale: 1 }, hover: { scale: 1.04 } }}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
          />
          {/* Ink overlay. */}
          <motion.div
            className="absolute inset-0 bg-ink pointer-events-none"
            variants={{ rest: { opacity: 0 }, hover: { opacity: 0.12 } }}
            transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
          />
          {/* Arrow badge. */}
          <motion.div
            className="absolute top-3 right-3 h-8 w-8 rounded-full bg-paper text-ink flex items-center justify-center text-[14px]"
            variants={{
              rest: { opacity: 0, scale: 0.6, y: -4 },
              hover: { opacity: 1, scale: 1, y: 0 },
            }}
            transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
            aria-hidden
          >
            ↗
          </motion.div>
        </motion.div>

        <div className="mt-3 flex items-start justify-between gap-6 t-micro">
          <span className="text-mute tabular-nums shrink-0">
            {study.year || "—"}
          </span>
          <span className="text-strong text-right truncate">
            {study.title} | {label}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
