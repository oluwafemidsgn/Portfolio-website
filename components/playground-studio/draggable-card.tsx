"use client";

import { useRef, type RefObject } from "react";
import { motion, useMotionValue } from "framer-motion";
import type { PlaygroundItem } from "@/lib/types";
import { MediaAsset } from "@/components/media-asset";
import { EASE_OUT_EXPO } from "../motion/easing";

type Layout = { x: number; y: number; rotate: number };

type Props = {
  item: PlaygroundItem;
  index: number;
  /** Starting position + rotation. Provided by the parent after the
   * stage has been measured so cards never spawn off-canvas. */
  initial: Layout;
  constraintsRef: RefObject<HTMLDivElement | null>;
  draggable: boolean;
  onOpen: () => void;
};

export function DraggableCard({
  item,
  index,
  initial,
  constraintsRef,
  draggable,
  onOpen,
}: Props) {
  const x = useMotionValue(initial.x);
  const y = useMotionValue(initial.y);
  const hasDragged = useRef(false);

  // The card is sized in CSS below. We render a `motion.div` and let
  // Framer handle drag with the stage as its constraint. We differentiate
  // drag-ended vs clicked by tracking if meaningful movement happened.
  return (
    <motion.button
      type="button"
      drag={draggable}
      dragMomentum={false}
      dragElastic={0.05}
      dragConstraints={constraintsRef}
      style={{ x, y }}
      initial={{ opacity: 0, scale: 0.92, rotate: initial.rotate }}
      animate={{
        opacity: 1,
        scale: 1,
        rotate: initial.rotate,
        transition: {
          duration: 0.6,
          delay: 0.05 * index,
          ease: EASE_OUT_EXPO,
        },
      }}
      whileHover={draggable ? { scale: 1.02 } : undefined}
      whileDrag={{ scale: 1.04, rotate: initial.rotate * 0.4, zIndex: 20 }}
      onDragStart={() => {
        hasDragged.current = true;
      }}
      onDragEnd={() => {
        // Let any click immediately after drag be swallowed.
        window.setTimeout(() => {
          hasDragged.current = false;
        }, 60);
      }}
      onClick={() => {
        // Pass-through click to open modal, unless we just finished a drag
        // or a drawing tool is active. Pointer-events handled by parent
        // stage's drawing layer when tool !== "move".
        if (!draggable) return;
        if (hasDragged.current) return;
        onOpen();
      }}
      aria-label={`Open ${item.name}`}
      data-cursor="zoom"
      className={
        "absolute left-0 top-0 w-[240px] md:w-[260px] bg-paper border border-[var(--rule)] p-2 shadow-[0_18px_40px_-30px_rgba(0,0,0,0.35)] text-left select-none " +
        (draggable ? "cursor-grab active:cursor-grabbing" : "cursor-default")
      }
    >
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-mute pointer-events-none">
        <MediaAsset
          kind={item.mediaKind}
          url={item.mediaUrl}
          poster={item.posterUrl}
          alt={item.name}
        />
      </div>
      <div className="mt-2 flex items-center justify-between t-micro pointer-events-none">
        <span className="text-body tabular-nums">{item.date || "—"}</span>
        <span className="text-strong truncate max-w-[70%] text-right">
          {(item.name || "UNTITLED").toUpperCase()}
        </span>
      </div>
      {item.label && (
        <span className="block mt-1 t-micro text-body uppercase pointer-events-none">
          {item.label}
        </span>
      )}
    </motion.button>
  );
}
