"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { EASE_OUT_EXPO } from "../motion/easing";
import type { CaseStudy } from "@/lib/types";
import { MediaAsset } from "../media-asset";

type Props = {
  study: CaseStudy;
  /** Index for stagger. */
  i: number;
};

/** Coming-soon tiles keep their cover but are inert: no link, no hover. */
function Wrapper({
  study,
  label,
  comingSoon,
  children,
}: {
  study: CaseStudy;
  label: string;
  comingSoon: boolean;
  children: React.ReactNode;
}) {
  if (comingSoon) {
    return (
      <div
        aria-label={`${study.title} — ${label} (coming soon)`}
        className="thumb-card flex flex-col p-2 opacity-80"
      >
        {children}
      </div>
    );
  }
  return (
    <Link
      href={`/projects/${study.slug}`}
      aria-label={`${study.title} — ${label}`}
      className="thumb-card group flex flex-col p-2 outline-none focus-visible:ring-1 focus-visible:ring-ink"
      data-cursor="zoom"
    >
      {children}
    </Link>
  );
}

/**
 * Tile used on the /projects grid. Mirrors the home-page ProjectThumb but
 * links to /projects/[slug] and uses the stored cover image when present.
 */
export function ProjectCard({ study, i }: Props) {
  const label = study.type || "Case study";
  const comingSoon = study.comingSoon;

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
      <Wrapper study={study} label={label} comingSoon={comingSoon}>
        <motion.div
          className="thumb w-full aspect-[432/298] overflow-hidden relative"
          initial="rest"
          whileHover={comingSoon ? undefined : "hover"}
          animate="rest"
        >
          {/* Cover image, scales subtly on hover. */}
          <motion.div
            className="absolute inset-0 bg-mute"
            variants={{ rest: { scale: 1 }, hover: { scale: 1.04 } }}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
          >
            {study.coverImage && (
              <MediaAsset
                kind="image"
                url={study.coverImage}
                alt={study.title}
              />
            )}
          </motion.div>
          {comingSoon && (
            <span className="absolute top-3 left-3 bg-paper text-ink px-2 py-1 t-micro pointer-events-none">
              COMING SOON
            </span>
          )}
          {/* Ink overlay. */}
          {!comingSoon && (
            <motion.div
              className="absolute inset-0 bg-ink pointer-events-none"
              variants={{ rest: { opacity: 0 }, hover: { opacity: 0.12 } }}
              transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
            />
          )}
          {/* Arrow badge. */}
          {!comingSoon && (
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
          )}
        </motion.div>

        <div className="mt-3 flex items-start justify-between gap-6 t-micro">
          <span className="text-mute tabular-nums shrink-0">
            {study.year || "—"}
          </span>
          <span className="text-strong text-right truncate">
            {study.title} | {label}
          </span>
        </div>
      </Wrapper>
    </motion.div>
  );
}
