"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { EASE_IN_OUT_EXPO } from "./easing";

/**
 * Full-screen counter curtain. Rendered inside each page component so
 * every SPA navigation unmounts the previous Loader and mounts a fresh
 * one — that remount *is* the signal to play the count-up. No pathname
 * listener required.
 *
 *   First visit to the site in this tab → counter 00 → 100 over ~2.2s
 *   Every subsequent page mount           → counter 00 → 100 over ~0.9s
 *
 * Implementation notes:
 *
 * 1. `requestAnimationFrame` drives the counter directly — framer's
 *    `animate()` on a MotionValue was cancelled by Strict-Mode effect
 *    double-invocation and left the number stuck.
 *
 * 2. `startedRef` makes the effect body idempotent. Strict-Mode runs
 *    effects twice (mount → cleanup → mount); without this guard the
 *    second invocation would restart the rAF loop halfway through the
 *    first one and freeze the display.
 *
 * 3. `sessionStorage` only picks the duration — it never skips the
 *    animation. That's the behaviour change from the previous version:
 *    we always show the count-up, every navigation, every refresh.
 *
 * 4. `prefers-reduced-motion` jumps straight to closed state so users
 *    who opt out never see the overlay at all.
 */

const SESSION_KEY = "intro:seen";
const INTRO_DURATION_MS = 2200;
const TRANSITION_DURATION_MS = 900;
const HOLD_ON_100_MS = 260;

export function Loader() {
  const [open, setOpen] = useState(true);
  const [display, setDisplay] = useState("00");
  const startedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (startedRef.current) return;
    startedRef.current = true;

    const reduce =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      // Skip the curtain entirely; mark as seen so any later code path
      // that cares about the session flag stays consistent.
      setOpen(false);
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        /* storage disabled — fine */
      }
      return;
    }

    // Longer run the first time in this tab, snappier on subsequent
    // page mounts so route changes don't feel sluggish.
    let seen = false;
    try {
      seen = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      /* storage blocked — treat as unseen */
    }
    const duration = seen ? TRANSITION_DURATION_MS : INTRO_DURATION_MS;

    const start = performance.now();

    // easeOutQuart — visually matches the [0.22, 1, 0.36, 1] cubic
    // bezier we use for frame reveals.
    const ease = (t: number) => 1 - Math.pow(1 - t, 4);

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const value = Math.min(100, Math.round(ease(t) * 100));
      setDisplay(value.toString().padStart(2, "0"));

      if (t < 1) {
        requestAnimationFrame(tick);
      } else {
        setDisplay("100");
        try {
          sessionStorage.setItem(SESSION_KEY, "1");
        } catch {
          /* ignore */
        }
        window.setTimeout(() => setOpen(false), HOLD_ON_100_MS);
      }
    };

    requestAnimationFrame(tick);
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[10000] bg-ink flex items-end justify-between px-6 md:px-12 pb-8 md:pb-12 pointer-events-auto"
          initial={{ y: 0 }}
          exit={{ y: "-101%" }}
          transition={{ duration: 0.9, ease: EASE_IN_OUT_EXPO }}
          aria-hidden
        >
          <span
            className="text-paper uppercase text-[11px] md:text-[12px] font-medium"
            style={{ letterSpacing: "0.06em" }}
          >
            Oduneye Oluwafemi — Portfolio 2025
          </span>
          <span
            className="text-paper font-extrabold leading-none tabular-nums"
            style={{
              fontSize: "clamp(64px, 12vw, 180px)",
              letterSpacing: "-0.02em",
            }}
          >
            {display}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
