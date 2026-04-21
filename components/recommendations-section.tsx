"use client";

import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Reveal } from "./motion/reveal";
import { Frame } from "./motion/frame";
import { EASE_OUT_EXPO } from "./motion/easing";
import type { Recommendation } from "@/lib/types";

type Props = {
  items: Recommendation[];
};

/**
 * Recommendations carousel on the home page. One quote takes the stage
 * at a time, with tab-style navigation on the left. Auto-advance is
 * intentionally slow (~9s) so the reader has time to actually read.
 *
 * When there's only one recommendation we render a quieter static
 * layout — no nav, no counter — so a single quote doesn't look like a
 * broken carousel.
 */
export function RecommendationsSection({ items }: Props) {
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();
  const total = items.length;

  const go = useCallback(
    (dir: -1 | 1) => {
      setIndex((i) => (i + dir + total) % total);
    },
    [total],
  );

  // Auto-advance. Pauses whenever the user hovers the section
  // (handled with CSS group-hover + React state below).
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (total <= 1 || paused || reduce) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % total);
    }, 9000);
    return () => window.clearInterval(id);
  }, [total, paused, reduce]);

  // Keyboard nav when any part of the section is focused.
  const onKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        go(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(-1);
      }
    },
    [go],
  );

  if (total === 0) return null;

  const current = items[index];

  return (
    <section
      id="recommendations"
      className="page-gutter"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onKeyDown={onKey}
      tabIndex={-1}
    >
      <Frame>
        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] grid-col-rules min-h-[440px]">
          {/* Sidebar: title, description, controls */}
          <div className="p-8 md:p-10 flex flex-col justify-between gap-10">
            <div className="flex flex-col gap-6">
              <Reveal delay={0.05}>
                <div className="t-micro text-body">/ RECOMMENDATIONS</div>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="t-title text-ink">Kind words</h2>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="t-body text-body max-w-[40ch]">
                  Quotes from the people on the other end of each brief.
                  Working in service of the work, together.
                </p>
              </Reveal>
            </div>

            {total > 1 && (
              <Reveal delay={0.3}>
                <div className="flex items-center justify-between t-micro">
                  <span className="text-body tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                    <span className="mx-1 opacity-60">/</span>
                    {String(total).padStart(2, "0")}
                  </span>
                  <div className="flex items-center gap-2">
                    <NavButton
                      label="Previous quote"
                      onClick={() => go(-1)}
                      glyph="←"
                    />
                    <NavButton
                      label="Next quote"
                      onClick={() => go(1)}
                      glyph="→"
                    />
                  </div>
                </div>
              </Reveal>
            )}
          </div>

          {/* Stage */}
          <div className="relative p-8 md:p-12 flex flex-col justify-between gap-10 min-h-[360px] overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.blockquote
                key={current.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
                className="flex-1 flex flex-col gap-10 justify-between"
              >
                <p
                  className="text-ink leading-[1.15]"
                  style={{
                    fontSize: "clamp(24px, 3.6vw, 44px)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  &ldquo;{current.quote}&rdquo;
                </p>
                <footer className="flex items-center gap-4 pt-6 border-t border-[var(--rule)]">
                  {current.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={current.avatarUrl}
                      alt=""
                      className="h-12 w-12 rounded-full object-cover bg-mute"
                    />
                  ) : (
                    <span
                      className="h-12 w-12 rounded-full bg-mute"
                      aria-hidden
                    />
                  )}
                  <div className="flex flex-col leading-tight">
                    <cite className="t-body text-ink not-italic">
                      {current.author}
                    </cite>
                    <span className="t-micro text-body">
                      {[current.role, current.company]
                        .filter(Boolean)
                        .join(", ")}
                    </span>
                  </div>
                </footer>
              </motion.blockquote>
            </AnimatePresence>

            {/* Progress bar — purely decorative, gives a sense of pace. */}
            {total > 1 && !reduce && (
              <motion.span
                key={`${current.id}-progress`}
                aria-hidden
                className="absolute left-0 right-0 bottom-0 h-[1px] bg-ink origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: paused ? 0 : 1 }}
                transition={{
                  duration: paused ? 0 : 9,
                  ease: "linear",
                }}
              />
            )}
          </div>
        </div>
      </Frame>
    </section>
  );
}

function NavButton({
  label,
  onClick,
  glyph,
}: {
  label: string;
  onClick: () => void;
  glyph: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="h-9 w-9 flex items-center justify-center border border-[var(--rule)] hover:bg-ink hover:text-paper hover:border-ink transition-colors duration-300 text-ink"
      data-cursor="zoom"
    >
      {glyph}
    </button>
  );
}
