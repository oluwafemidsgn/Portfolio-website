"use client";

import { useCallback, useRef, useState } from "react";
import type { Tool } from "./tool-palette";

type Point = { x: number; y: number };

type Path = {
  id: string;
  tool: Exclude<Tool, "move" | "eraser">;
  points: Point[];
};

/**
 * Per-tool draw settings. The eraser isn't represented here because it
 * removes existing paths rather than drawing new ones.
 */
const TOOL_STYLE: Record<Path["tool"], {
  stroke: string;
  width: number;
  opacity: number;
  dash?: string;
  linecap: "round" | "butt" | "square";
  linejoin: "round" | "miter" | "bevel";
}> = {
  pen: {
    stroke: "var(--color-ink)",
    width: 1.5,
    opacity: 1,
    linecap: "round",
    linejoin: "round",
  },
  brush: {
    stroke: "var(--color-ink)",
    width: 6,
    opacity: 0.85,
    linecap: "round",
    linejoin: "round",
  },
  pencil: {
    stroke: "color-mix(in oklab, var(--color-ink) 55%, transparent)",
    width: 1,
    opacity: 0.7,
    linecap: "round",
    linejoin: "round",
  },
};

/**
 * Drawing overlay that fills the stage. A plain <div> sits on top and
 * captures pointer events; the SVG underneath it is purely visual.
 *
 * We have to use the div for event capture because SVG root elements
 * default to `pointer-events: visiblePainted` — blank regions of an SVG
 * silently drop pointer events, which was why the brush wasn't drawing
 * on the empty canvas. A plain div has no such rule.
 *
 * When `active` is false the div turns off `pointer-events` so it
 * doesn't block draggable cards below.
 */
export function DoodleLayer({
  tool,
  active,
}: {
  tool: Tool;
  active: boolean;
}) {
  const hitRef = useRef<HTMLDivElement>(null);
  const [paths, setPaths] = useState<Path[]>([]);
  const currentIdRef = useRef<string | null>(null);
  // We keep the in-progress path in a ref as well so we avoid the
  // per-move React render for tail extension. We still call setPaths so
  // the SVG updates, but the ref keeps the lookup fast.
  const currentPointsRef = useRef<Point[]>([]);

  /** Convert a pointer event into stage-local coordinates. */
  const localPoint = useCallback((e: React.PointerEvent): Point | null => {
    const el = hitRef.current;
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }, []);

  const eraseAt = useCallback((p: Point) => {
    // Any path whose points come within ~14px of the pointer is removed.
    const R2 = 14 * 14;
    setPaths((prev) =>
      prev.filter((path) => {
        for (const pt of path.points) {
          const dx = pt.x - p.x;
          const dy = pt.y - p.y;
          if (dx * dx + dy * dy < R2) return false;
        }
        return true;
      }),
    );
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    if (!active) return;
    // Only react to the primary button; right-clicks open the context
    // menu and shouldn't leave a stroke behind.
    if (e.button !== 0 && e.pointerType === "mouse") return;
    const p = localPoint(e);
    if (!p) return;
    e.preventDefault();
    hitRef.current?.setPointerCapture(e.pointerId);

    if (tool === "eraser") {
      eraseAt(p);
      currentIdRef.current = "__eraser__";
      return;
    }

    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `p-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    currentIdRef.current = id;
    currentPointsRef.current = [p];
    setPaths((prev) => [
      ...prev,
      { id, tool: tool as Path["tool"], points: [p] },
    ]);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!active) return;
    if (!currentIdRef.current) return;
    const p = localPoint(e);
    if (!p) return;

    if (tool === "eraser") {
      eraseAt(p);
      return;
    }

    const id = currentIdRef.current;
    // Skip sub-pixel jitter so the path doesn't get polluted.
    const last =
      currentPointsRef.current[currentPointsRef.current.length - 1];
    if (last) {
      const dx = p.x - last.x;
      const dy = p.y - last.y;
      if (dx * dx + dy * dy < 4) return;
    }
    currentPointsRef.current = [...currentPointsRef.current, p];
    const snapshot = currentPointsRef.current;
    setPaths((prev) =>
      prev.map((path) =>
        path.id === id ? { ...path, points: snapshot } : path,
      ),
    );
  };

  const endStroke = (e: React.PointerEvent) => {
    if (currentIdRef.current) {
      hitRef.current?.releasePointerCapture?.(e.pointerId);
    }
    currentIdRef.current = null;
    currentPointsRef.current = [];
  };

  return (
    <div
      ref={hitRef}
      aria-hidden
      className="absolute inset-0"
      style={{
        pointerEvents: active ? "auto" : "none",
        touchAction: active ? "none" : "auto",
        cursor: active ? "crosshair" : "default",
        zIndex: 15,
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endStroke}
      onPointerCancel={endStroke}
    >
      {/* SVG is visual only — no pointer events so all capture stays on
          the wrapping div, which is what fixes the "clicks on blank SVG
          get swallowed" bug. */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ pointerEvents: "none" }}
      >
        {paths.map((path) => {
          const style = TOOL_STYLE[path.tool];
          return (
            <path
              key={path.id}
              d={toPathData(path.points)}
              fill="none"
              stroke={style.stroke}
              strokeWidth={style.width}
              strokeOpacity={style.opacity}
              strokeLinecap={style.linecap}
              strokeLinejoin={style.linejoin}
              strokeDasharray={style.dash}
            />
          );
        })}
      </svg>
    </div>
  );
}

/**
 * Turn a point list into an SVG path using smooth quadratic curves
 * between consecutive points. Feels more natural than jagged polylines
 * without needing a full Catmull-Rom implementation.
 */
function toPathData(points: Point[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) {
    const p = points[0];
    return `M${p.x},${p.y} L${p.x + 0.01},${p.y + 0.01}`;
  }
  let d = `M${points[0].x},${points[0].y}`;
  for (let i = 1; i < points.length - 1; i++) {
    const curr = points[i];
    const next = points[i + 1];
    const mx = (curr.x + next.x) / 2;
    const my = (curr.y + next.y) / 2;
    d += ` Q${curr.x},${curr.y} ${mx},${my}`;
  }
  const last = points[points.length - 1];
  d += ` L${last.x},${last.y}`;
  return d;
}
