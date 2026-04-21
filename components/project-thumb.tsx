"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import Link from "next/link";
import { EASE_OUT_EXPO } from "./motion/easing";
import { MediaAsset } from "./media-asset";
import type { MediaKind } from "@/lib/types";

export type Project = {
  date: string;
  title: string;
  type: string;
  /** When provided, tile is a link. When null/undefined, tile is static. */
  href?: string | null;
  aspect?: "tall" | "wide" | "square" | "auto";
  /** CMS-driven asset. Absent → neutral placeholder. */
  media?: {
    kind: MediaKind;
    url: string;
    poster?: string;
  };
  children?: ReactNode;
};

const motionCommon = {
  className:
    "thumb-card group flex flex-col p-2 outline-none focus-visible:ring-1 focus-visible:ring-ink",
  initial: "rest",
  whileHover: "hover",
  animate: "rest",
};

export function ProjectThumb({
  date,
  title,
  type,
  href,
  aspect = "wide",
  media,
  children,
}: Project) {
  const aspectClass =
    aspect === "tall"
      ? "aspect-[3/4]"
      : aspect === "square"
      ? "aspect-square"
      : aspect === "auto"
      ? ""
      : "aspect-[432/298]";

  const inner = (
    <>
      <div className={`thumb w-full ${aspectClass} overflow-hidden relative`}>
        <motion.div
          className="absolute inset-0 bg-mute"
          variants={{ rest: { scale: 1 }, hover: { scale: 1.04 } }}
          transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
        >
          {media ? (
            <MediaAsset
              kind={media.kind}
              url={media.url}
              poster={media.poster}
              alt={title}
            />
          ) : (
            children
          )}
        </motion.div>

        {/* Ink sweep on hover — only present when the tile is clickable. */}
        {href && (
          <motion.div
            className="absolute inset-x-0 bottom-0 bg-ink/0 pointer-events-none"
            variants={{ rest: { opacity: 0 }, hover: { opacity: 0.12 } }}
            style={{ height: "100%" }}
            transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
          />
        )}

        {/* Arrow badge — also hover-only, also only when clickable. */}
        {href && (
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
      </div>

      <div className="mt-2 flex items-center justify-between t-micro">
        <span className="text-mute tabular-nums">{date}</span>
        <motion.span
          className="text-strong text-right truncate max-w-[70%]"
          variants={{ rest: { x: 0 }, hover: { x: href ? -2 : 0 } }}
          transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
        >
          {title} | {type}
        </motion.span>
      </div>
    </>
  );

  if (href) {
    return (
      <motion.div {...motionCommon}>
        <Link
          href={href}
          aria-label={`${title} — ${type}`}
          data-cursor="zoom"
          className="flex flex-col gap-2 outline-none"
        >
          {inner}
        </Link>
      </motion.div>
    );
  }

  // Non-interactive tile — still animates its asset on hover, still
  // marks itself up semantically as a figure so screen readers get the
  // same content.
  return (
    <motion.figure {...motionCommon}>
      <figcaption className="sr-only">
        {title} — {type}
      </figcaption>
      {inner}
    </motion.figure>
  );
}
