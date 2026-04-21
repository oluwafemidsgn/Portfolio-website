"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { PlaygroundItem } from "@/lib/types";
import { MediaAsset } from "@/components/media-asset";
import { EASE_OUT_EXPO } from "../motion/easing";

type Props = {
  item: PlaygroundItem | null;
  onClose: () => void;
};

/**
 * Full-viewport overlay that opens when a card is clicked. Presents the
 * media large and centred with metadata in a thin rail on the side; if
 * the item has a `liveUrl`, a "VIEW LIVE" button links out in a new tab.
 *
 * Closes on: Escape, clicking the scrim, or the close button.
 */
export function CardModal({ item, onClose }: Props) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (item) {
      window.addEventListener("keydown", onKey);
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        window.removeEventListener("keydown", onKey);
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [item, onClose]);

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={item.name}
          className="fixed inset-0 z-[80] flex items-center justify-center p-4 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Scrim */}
          <motion.button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute inset-0 bg-ink/80 backdrop-blur-[6px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Panel */}
          <motion.div
            className="relative w-full max-w-[1100px] grid grid-cols-1 md:grid-cols-[1fr_320px] gap-0 bg-paper border border-[var(--rule)] overflow-hidden"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Media */}
            <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[480px] bg-mute overflow-hidden">
              <MediaAsset
                kind={item.mediaKind}
                url={item.mediaUrl}
                poster={item.posterUrl}
                alt={item.name}
              />
            </div>

            {/* Meta rail */}
            <div className="flex flex-col p-6 md:p-8 border-t md:border-t-0 md:border-l border-[var(--rule)]">
              <div className="flex items-center justify-between t-micro text-body">
                <span className="tabular-nums">{item.date || "—"}</span>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  data-cursor="zoom"
                  className="text-body hover:text-ink transition-colors"
                >
                  CLOSE ✕
                </button>
              </div>

              <h2 className="mt-6 t-title">
                {(item.name || "UNTITLED").toUpperCase()}
              </h2>
              {item.label && (
                <p className="mt-2 t-micro text-body uppercase">{item.label}</p>
              )}

              <div className="mt-auto pt-8">
                {item.liveUrl ? (
                  <a
                    href={item.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="zoom"
                    className="cms-ink-hover block text-center px-6 py-4 border border-ink text-ink t-nav"
                  >
                    VIEW LIVE ↗
                  </a>
                ) : (
                  <p className="t-body text-body">
                    An in-progress sketch — no live build yet.
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
