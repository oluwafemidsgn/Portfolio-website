"use client";

import { useEffect, useRef, useState } from "react";
import type { PlaygroundItem } from "@/lib/types";
import { ToolPalette, type Tool } from "./tool-palette";
import { ColorPalette, type CanvasBg, CANVAS_BGS } from "./color-palette";
import { DraggableCard } from "./draggable-card";
import { DoodleLayer } from "./doodle-layer";
import { CardModal } from "./card-modal";
import { SnakePanel } from "./snake-panel";

type Layout = { x: number; y: number; rotate: number };

/**
 * Build a loose, hand-arranged layout for the given number of cards.
 * We want cards scattered inside the stage, not piled at (0,0), and we
 * want the arrangement stable across re-renders (so we seed from the
 * index instead of Math.random()).
 *
 * The layout responds to the stage's measured width so that on narrow
 * screens cards wrap into fewer columns instead of spawning offscreen.
 */
function buildLayouts(
  count: number,
  stageWidth: number,
  stageHeight: number,
  cardWidth: number,
): Layout[] {
  // Decide the column count that fits.
  const gap = 24;
  const maxCols = Math.max(
    1,
    Math.floor((stageWidth - gap) / (cardWidth + gap)),
  );
  const cols = Math.min(maxCols, 3);
  const rowHeight = 240;

  const layouts: Layout[] = [];
  for (let i = 0; i < count; i++) {
    const seed = (i + 1) * 2654435761;
    const r1 = (seed & 0xffff) / 0xffff;
    const r2 = ((seed >>> 16) & 0xffff) / 0xffff;
    const r3 = (((seed * 9301 + 49297) & 0xffff) / 0xffff);

    const col = i % cols;
    const row = Math.floor(i / cols);
    // Jitter within the slot
    const slotW = (stageWidth - gap) / cols;
    const x = gap + col * slotW + r1 * (slotW - cardWidth - gap);
    const y = gap + row * rowHeight + r2 * 40;
    const rotate = (r3 - 0.5) * 8;

    // Clamp so cards never start outside the visible stage — drag can
    // still push them to the edge, but they need to be reachable.
    layouts.push({
      x: Math.max(gap, Math.min(x, stageWidth - cardWidth - gap)),
      y: Math.max(gap, Math.min(y, Math.max(stageHeight - 220, gap))),
      rotate,
    });
  }
  return layouts;
}

/**
 * A design-software-inspired canvas that hosts the playground items.
 *
 * Left rail: tool palette (move / pen / brush / pencil / eraser).
 * Top right: swatches for canvas background colour.
 * Stage: draggable cards positioned freely + an SVG doodle layer above
 * for drawing. When a drawing tool is active the doodle layer captures
 * pointer events; when move is active, cards are draggable and clicking
 * one opens a detail modal.
 * Bottom right: a tiny snake game so there's always something to do.
 *
 * All state lives on this parent so the toolbar, swatches, cards and
 * doodle layer stay in sync without any context indirection.
 */
export function PlaygroundStudio({ items }: { items: PlaygroundItem[] }) {
  const [tool, setTool] = useState<Tool>("move");
  const [bg, setBg] = useState<CanvasBg>(CANVAS_BGS[0]);
  const [active, setActive] = useState<PlaygroundItem | null>(null);
  const [clearKey, setClearKey] = useState(0);
  const [layouts, setLayouts] = useState<Layout[] | null>(null);
  // Constraint ref forwarded to every draggable card so dragging never
  // pulls a tile outside the visible canvas area.
  const stageRef = useRef<HTMLDivElement>(null);

  const drawing = tool !== "move";

  // Compute card layouts once the stage has been measured. Re-runs on
  // viewport resize so cards reflow into a fresh arrangement — keeps
  // everything reachable across breakpoints.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const cardWidth = window.matchMedia("(min-width: 768px)").matches
      ? 260
      : 240;

    const compute = () => {
      const rect = stage.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      setLayouts(buildLayouts(items.length, rect.width, rect.height, cardWidth));
    };
    compute();

    const ro = new ResizeObserver(compute);
    ro.observe(stage);
    return () => ro.disconnect();
  }, [items.length]);

  return (
    <section className="page-gutter pt-8 pb-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between border-b border-[var(--rule)] pb-6">
        <div className="max-w-xl">
          <p className="t-micro text-body mb-2">/ PLAYGROUND</p>
          <h1 className="t-hero">
            Pull things around.
            <br />
            <span className="text-strong">Doodle on the paper.</span>
          </h1>
          <p className="mt-4 t-body text-strong max-w-md">
            A sketchbook, not a gallery. Drag the cards, switch brushes, change
            the background. Click any tile to see what it actually is.
          </p>
        </div>
        <div className="flex flex-col items-start md:items-end gap-3">
          <ColorPalette value={bg} onChange={setBg} />
          <button
            type="button"
            onClick={() => setClearKey((k) => k + 1)}
            className="t-micro text-body hover:text-ink transition-colors"
            data-cursor="zoom"
          >
            CLEAR DOODLES ↺
          </button>
        </div>
      </header>

      <div className="mt-4 grid grid-cols-[64px_1fr] gap-3">
        <ToolPalette tool={tool} onChange={setTool} />

        {/* --- Stage ------------------------------------------------------ */}
        <div
          ref={stageRef}
          className="canvas-stage relative overflow-hidden border border-[var(--rule)]"
          style={{
            backgroundColor: bg.value,
            // A faint dot-grid so the canvas reads as paper rather than a
            // blank div; tracks theme via the ink token.
            backgroundImage:
              "radial-gradient(color-mix(in oklab, var(--color-ink) 12%, transparent) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            backgroundPosition: "0 0",
            minHeight: "clamp(520px, 72vh, 820px)",
            cursor: drawing ? "crosshair" : "default",
          }}
          data-tool={tool}
        >
          {/* Cards are absolutely positioned and drag inside the stage.
              We wait for the stage to be measured before mounting the
              cards so their initial positions fit the actual canvas. */}
          {layouts &&
            items.map((item, idx) => (
              <DraggableCard
                key={item.id}
                item={item}
                index={idx}
                initial={layouts[idx]}
                constraintsRef={stageRef}
                draggable={tool === "move"}
                onOpen={() => setActive(item)}
              />
            ))}

          {/* Doodle layer sits above the cards and only catches pointer
              events when a drawing tool is active. `clearKey` resets it. */}
          <DoodleLayer
            key={`doodle-${clearKey}`}
            tool={tool}
            active={drawing}
          />

          {/* Snake panel — fixed to bottom-right of the canvas */}
          <SnakePanel />

          {/* If there are no items, surface a friendly hint */}
          {items.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="t-body text-body text-center max-w-xs">
                No playground pieces yet. Add them from the admin to see them
                land on this canvas.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footnote — tiny legend so people know what the tools do */}
      <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-1 t-micro text-body">
        <span>V — MOVE</span>
        <span>P — PEN</span>
        <span>B — BRUSH</span>
        <span>N — PENCIL</span>
        <span>E — ERASER</span>
        <span className="ml-auto hidden md:block">
          USE ARROW KEYS TO PLAY THE SNAKE
        </span>
      </div>

      <CardModal item={active} onClose={() => setActive(null)} />
    </section>
  );
}
