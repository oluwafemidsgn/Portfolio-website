"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { EASE_OUT_EXPO } from "../motion/easing";

export type Tool = "move" | "pen" | "brush" | "pencil" | "eraser";

type ToolDef = {
  id: Tool;
  label: string;
  /** Single-key shortcut — V, P, B, N, E */
  shortcut: string;
  Glyph: () => React.JSX.Element;
};

const TOOLS: ToolDef[] = [
  { id: "move", label: "Move", shortcut: "v", Glyph: MoveGlyph },
  { id: "pen", label: "Pen", shortcut: "p", Glyph: PenGlyph },
  { id: "brush", label: "Brush", shortcut: "b", Glyph: BrushGlyph },
  { id: "pencil", label: "Pencil", shortcut: "n", Glyph: PencilGlyph },
  { id: "eraser", label: "Eraser", shortcut: "e", Glyph: EraserGlyph },
];

export function ToolPalette({
  tool,
  onChange,
}: {
  tool: Tool;
  onChange: (t: Tool) => void;
}) {
  // Keyboard shortcuts. Only fire when no input/textarea is focused so we
  // don't eat typing events elsewhere on the page.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (target && /INPUT|TEXTAREA|SELECT/.test(target.tagName)) return;
      if (target?.isContentEditable) return;
      const key = e.key.toLowerCase();
      const match = TOOLS.find((t) => t.shortcut === key);
      if (match) {
        e.preventDefault();
        onChange(match.id);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onChange]);

  return (
    <aside
      aria-label="Drawing tools"
      className="sticky top-4 self-start flex flex-col gap-1 border border-[var(--rule)] bg-paper p-1"
    >
      {TOOLS.map(({ id, label, shortcut, Glyph }) => {
        const selected = tool === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            aria-label={`${label} (${shortcut.toUpperCase()})`}
            title={`${label} · ${shortcut.toUpperCase()}`}
            data-cursor="zoom"
            className={
              "group relative aspect-square w-full flex items-center justify-center outline-none transition-colors duration-300 " +
              (selected ? "text-paper" : "text-ink hover:text-paper")
            }
          >
            {/* Selected state fills the swatch with ink. Framer's layoutId
                slides the fill between buttons when the selection changes. */}
            {selected && (
              <motion.span
                aria-hidden
                layoutId="tool-selection"
                className="absolute inset-0 bg-ink"
                transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
              />
            )}
            {/* Hover fill — scales up from the bottom on mouse-in. */}
            {!selected && (
              <span
                aria-hidden
                className="absolute inset-0 bg-ink origin-bottom scale-y-0 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-y-100"
              />
            )}
            <span className="relative z-[1] flex items-center justify-center w-full h-full">
              <Glyph />
            </span>
          </button>
        );
      })}
    </aside>
  );
}

/* ------------------------------------------------------------------ */
/* Glyphs                                                              */
/* ------------------------------------------------------------------ */

function MoveGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
      <path
        d="M12 3v18M3 12h18M8 7l4-4 4 4M8 17l4 4 4-4M7 8l-4 4 4 4M17 8l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PenGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
      <path
        d="M4 20l4-1 10-10-3-3L5 16l-1 4z"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        strokeLinejoin="round"
      />
      <path
        d="M14 6l4 4"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BrushGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
      <path
        d="M14 4l6 6-8 8a3 3 0 0 1-4-4l6-10z"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        strokeLinejoin="round"
      />
      <path
        d="M8 18l-3 3"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PencilGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
      <path
        d="M3 21l4-1L20 7l-3-3L4 17l-1 4z"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        strokeLinejoin="round"
      />
      <path
        d="M15 5l3 3"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}

function EraserGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
      <path
        d="M4 17l10-10 5 5-7 7H7l-3-2z"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        strokeLinejoin="round"
      />
      <path d="M4 21h16" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}
