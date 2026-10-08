"use client";

import { useEffect, useRef } from "react";

/**
 * Sticky sidebar that scrolls with the page until its bottom reaches the
 * viewport bottom, then pins there. Short sidebars stick at the top.
 * top = min(margin, innerHeight - height - margin) (negative when tall).
 * Because `top` tracks height, growth while bottom-pinned opens upward.
 * Desktop (lg+) only; sets style.top directly (no React state).
 */
export function useStickySidebar<T extends HTMLElement>(margin = 24) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mq = window.matchMedia("(min-width: 1024px)");

    const update = () => {
      if (!mq.matches) {
        el.style.top = "";
        return;
      }
      const h = el.offsetHeight;
      el.style.top = `${Math.min(margin, window.innerHeight - h - margin)}px`;
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    mq.addEventListener("change", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
      mq.removeEventListener("change", update);
      el.style.top = "";
    };
  }, [margin]);

  return ref;
}
