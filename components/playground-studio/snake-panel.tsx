"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { EASE_OUT_EXPO } from "../motion/easing";

const COLS = 18;
const ROWS = 14;
const CELL = 14; // pixels per cell in the rendered SVG
const START_LEN = 4;
const TICK_MS = 120;

type P = { x: number; y: number };
type Dir = "up" | "down" | "left" | "right";

const START_SNAKE = (): P[] =>
  Array.from({ length: START_LEN }, (_, i) => ({
    x: Math.floor(COLS / 2) - i,
    y: Math.floor(ROWS / 2),
  }));

/**
 * Deterministic starting food position so the SSR render matches the
 * first client render. The real random position is picked from the
 * mount effect below.
 */
const INITIAL_FOOD: P = { x: 3, y: 3 };

function randomFood(exclude: P[]): P {
  while (true) {
    const p = {
      x: Math.floor(Math.random() * COLS),
      y: Math.floor(Math.random() * ROWS),
    };
    if (!exclude.some((e) => e.x === p.x && e.y === p.y)) return p;
  }
}

/**
 * Tiny snake game pinned to the bottom-right of the canvas. Takes full
 * control of the arrow keys while focused — space to pause, R to reset.
 * The panel can be minimised so it doesn't eat the canvas.
 */
export function SnakePanel() {
  const [minimised, setMinimised] = useState(false);
  const [snake, setSnake] = useState<P[]>(START_SNAKE());
  const [dir, setDir] = useState<Dir>("right");
  // Initial food is deterministic so the SSR and first-client render
  // match; we pick a real random cell inside useEffect below.
  const [food, setFood] = useState<P>(INITIAL_FOOD);
  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [high, setHigh] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  // Queue of directions — prevents a fast key combo from sending the
  // snake into itself (e.g. right → down → left within one tick).
  const dirQueueRef = useRef<Dir[]>([]);
  const dirRef = useRef<Dir>("right");

  const reset = useCallback(() => {
    const s = START_SNAKE();
    setSnake(s);
    setFood(randomFood(s));
    setDir("right");
    dirRef.current = "right";
    dirQueueRef.current = [];
    setScore(0);
    setGameOver(false);
    setRunning(true);
  }, []);

  // Load high-score from localStorage, and replace the deterministic
  // starting food cell with a real random one now that we're on the
  // client. Running this in an effect keeps SSR + first-render in sync.
  useEffect(() => {
    try {
      const raw = localStorage.getItem("snake:high");
      if (raw) setHigh(parseInt(raw, 10) || 0);
    } catch {
      /* storage disabled — ignore */
    }
    setFood(randomFood(START_SNAKE()));
  }, []);

  // Keyboard controls
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (target && /INPUT|TEXTAREA|SELECT/.test(target.tagName)) return;
      if (target?.isContentEditable) return;

      const opposite: Record<Dir, Dir> = {
        up: "down",
        down: "up",
        left: "right",
        right: "left",
      };
      const map: Record<string, Dir> = {
        ArrowUp: "up",
        ArrowDown: "down",
        ArrowLeft: "left",
        ArrowRight: "right",
        w: "up",
        s: "down",
        a: "left",
        d: "right",
      };
      const next = map[e.key] ?? map[e.key.toLowerCase()];
      if (next) {
        e.preventDefault();
        const last =
          dirQueueRef.current[dirQueueRef.current.length - 1] ?? dirRef.current;
        if (next !== opposite[last] && next !== last) {
          dirQueueRef.current.push(next);
        }
        if (!running && !gameOver) setRunning(true);
      } else if (e.key === " " || e.key.toLowerCase() === "p") {
        e.preventDefault();
        if (!gameOver) setRunning((r) => !r);
      } else if (e.key.toLowerCase() === "r") {
        e.preventDefault();
        reset();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [running, gameOver, reset]);

  // Game loop
  useEffect(() => {
    if (!running || gameOver || minimised) return;
    const t = window.setInterval(() => {
      setSnake((prev) => {
        // Pop a queued direction if available.
        const nextDir = dirQueueRef.current.shift() ?? dirRef.current;
        dirRef.current = nextDir;
        setDir(nextDir);

        const head = prev[0];
        const delta =
          nextDir === "up"
            ? { x: 0, y: -1 }
            : nextDir === "down"
              ? { x: 0, y: 1 }
              : nextDir === "left"
                ? { x: -1, y: 0 }
                : { x: 1, y: 0 };
        const nextHead = { x: head.x + delta.x, y: head.y + delta.y };

        // Wall collision
        if (
          nextHead.x < 0 ||
          nextHead.x >= COLS ||
          nextHead.y < 0 ||
          nextHead.y >= ROWS
        ) {
          setGameOver(true);
          setRunning(false);
          return prev;
        }
        // Self-collision — ignore the tail because it'll move out.
        const willEat = nextHead.x === food.x && nextHead.y === food.y;
        const body = willEat ? prev : prev.slice(0, -1);
        if (body.some((seg) => seg.x === nextHead.x && seg.y === nextHead.y)) {
          setGameOver(true);
          setRunning(false);
          return prev;
        }
        const nextSnake = [nextHead, ...body];
        if (willEat) {
          setFood(randomFood(nextSnake));
          setScore((s) => {
            const ns = s + 1;
            setHigh((h) => {
              if (ns > h) {
                try {
                  localStorage.setItem("snake:high", String(ns));
                } catch {
                  /* storage disabled — keep high score in memory only */
                }
                return ns;
              }
              return h;
            });
            return ns;
          });
        }
        return nextSnake;
      });
    }, TICK_MS);
    return () => window.clearInterval(t);
  }, [running, gameOver, minimised, food.x, food.y]);

  const W = COLS * CELL;
  const H = ROWS * CELL;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.3 }}
      className="absolute bottom-3 right-3 z-[18] border border-[var(--rule)] bg-paper"
      onPointerDown={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between t-micro border-b border-[var(--rule)] px-2 py-1.5 gap-4">
        <span className="text-body">SNAKE</span>
        <div className="flex items-center gap-3 tabular-nums">
          <span>
            <span className="text-body">SCORE</span>
            <span className="ml-2 text-ink">{String(score).padStart(2, "0")}</span>
          </span>
          <span className="text-body">|</span>
          <span>
            <span className="text-body">BEST</span>
            <span className="ml-2 text-ink">{String(high).padStart(2, "0")}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => (gameOver ? reset() : setRunning((r) => !r))}
            aria-label={
              gameOver
                ? "Restart game"
                : running
                  ? "Pause game"
                  : "Start game"
            }
            data-cursor="zoom"
            className="text-body hover:text-ink transition-colors"
          >
            {gameOver ? "R" : running ? "II" : "▶"}
          </button>
          <button
            type="button"
            onClick={() => setMinimised((m) => !m)}
            aria-label={minimised ? "Expand snake" : "Minimise snake"}
            data-cursor="zoom"
            className="text-body hover:text-ink transition-colors"
          >
            {minimised ? "+" : "–"}
          </button>
        </div>
      </div>

      {!minimised && (
        <div className="p-2" style={{ width: W + 16, height: H + 16 }}>
          <svg
            width={W}
            height={H}
            viewBox={`0 0 ${W} ${H}`}
            style={{
              background:
                "color-mix(in oklab, var(--color-ink) 4%, transparent)",
            }}
          >
            <rect
              x="0"
              y="0"
              width={W}
              height={H}
              fill="none"
              stroke="var(--rule)"
              strokeWidth="1"
            />
            {/* Food */}
            <rect
              x={food.x * CELL + 3}
              y={food.y * CELL + 3}
              width={CELL - 6}
              height={CELL - 6}
              fill="var(--color-ink)"
              opacity={0.45}
            />
            {/* Snake */}
            {snake.map((seg, i) => (
              <rect
                key={i}
                x={seg.x * CELL + 1}
                y={seg.y * CELL + 1}
                width={CELL - 2}
                height={CELL - 2}
                fill="var(--color-ink)"
              />
            ))}
          </svg>

          {/* Overlay messages */}
          {(gameOver || (!running && !gameOver && score === 0)) && (
            <div
              className="absolute inset-2 flex items-center justify-center pointer-events-none"
              style={{ top: 36 }}
            >
              <div className="px-3 py-2 bg-paper/95 border border-[var(--rule)] t-micro text-ink text-center">
                {gameOver ? (
                  <>
                    GAME OVER
                    <br />
                    <span className="text-body">PRESS R TO RESTART</span>
                  </>
                ) : (
                  <>
                    ARROWS TO PLAY
                    <br />
                    <span className="text-body">SPACE TO PAUSE · R TO RESET</span>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
