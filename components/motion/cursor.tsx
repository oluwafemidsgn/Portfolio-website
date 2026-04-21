"use client";

import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * A minimal, editorial custom cursor. On desktop only. Grows over any element
 * marked with `data-cursor="zoom"` (or simply `<a>`, `<button>`, `.thumb-card`).
 */
export function Cursor() {
  const reduce = useReducedMotion();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });
  const [variant, setVariant] = useState<"default" | "zoom" | "invert">(
    "default",
  );
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!hasFinePointer || reduce) return;
    setEnabled(true);

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const mode = target.closest<HTMLElement>("[data-cursor]")?.dataset.cursor;
      if (mode === "zoom" || mode === "invert") {
        setVariant(mode);
      } else if (
        target.closest("a, button, .thumb-card, input, textarea, [role='button']")
      ) {
        setVariant("zoom");
      } else {
        setVariant("default");
      }
    };
    const onLeave = () => {
      x.set(-100);
      y.set(-100);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, [x, y, reduce]);

  if (!enabled) return null;

  const sizes: Record<typeof variant, number> = {
    default: 10,
    zoom: 56,
    invert: 80,
  };
  const size = sizes[variant];

  return (
    <motion.div
      aria-hidden
      className="fixed top-0 left-0 z-[9999] pointer-events-none rounded-full mix-blend-difference"
      style={{
        x: sx,
        y: sy,
        translateX: "-50%",
        translateY: "-50%",
        background: "white",
      }}
      animate={{ width: size, height: size }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    />
  );
}
