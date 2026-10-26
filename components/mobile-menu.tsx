"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { EASE_IN_OUT_EXPO, EASE_OUT_EXPO } from "./motion/easing";
import { ThemeToggle } from "./theme/theme-toggle";

type Item = { label: string; href: string };

/**
 * Phone + tablet navigation (below lg). A MENU trigger in the top bar, a
 * floating pill once the bar has scrolled away, and a full-screen inverted
 * panel: it wipes down from the top, then each link rises out of its own
 * mask, staggered. Closing reverses it — links drop first, panel retracts.
 */
export function MobileMenu({ items, email }: { items: Item[]; email: string }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const firstLinkRef = useRef<HTMLAnchorElement | null>(null);

  const close = useCallback(() => setOpen(false), []);

  // Floating pill appears once the top bar is out of view.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 140);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll lock, Escape to close, focus in and back out.
  useEffect(() => {
    if (!open) return;
    const prevFocus = document.activeElement as HTMLElement | null;
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    const t = window.setTimeout(() => firstLinkRef.current?.focus({ preventScroll: true }), 450);
    return () => {
      html.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
      (prevFocus ?? triggerRef.current)?.focus({ preventScroll: true });
    };
  }, [open]);

  // Leaving the breakpoint (rotating a tablet, resizing) shouldn't strand an open menu.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = (e: MediaQueryListEvent) => e.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname?.startsWith(href));

  return (
    <>
      {/* Top-bar trigger */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="site-menu"
        data-cursor="zoom"
        className="group inline-flex items-center gap-2.5 t-nav text-ink outline-none"
      >
        <RollLabel text="MENU" />
        <Burger />
      </button>

      {/* Floating pill, once the bar has scrolled away */}
      <AnimatePresence>
        {scrolled && !open && (
          <div
            className="lg:hidden fixed inset-x-0 z-[8000] flex justify-center pointer-events-none"
            style={{ bottom: "max(20px, env(safe-area-inset-bottom))" }}
          >
          <motion.button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-controls="site-menu"
            initial={{ y: 24, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
            className="group pointer-events-auto inline-flex items-center gap-2.5 rounded-full bg-ink text-paper t-nav pl-5 pr-4 py-3 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.45)] outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ink"
          >
            MENU
            <Burger />
          </motion.button>
          </div>
        )}
      </AnimatePresence>

      {/* Full-screen panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="site-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="lg:hidden fixed inset-0 z-[9000] bg-ink text-paper flex flex-col page-gutter overflow-y-auto"
            style={{ paddingTop: "max(40px, env(safe-area-inset-top))", paddingBottom: "max(28px, env(safe-area-inset-bottom))" }}
            initial={reduce ? { opacity: 0 } : { clipPath: "inset(0% 0% 100% 0%)" }}
            animate={reduce ? { opacity: 1 } : { clipPath: "inset(0% 0% 0% 0%)" }}
            exit={reduce ? { opacity: 0 } : { clipPath: "inset(0% 0% 100% 0%)", transition: { duration: 0.6, ease: EASE_IN_OUT_EXPO, delay: 0.18 } }}
            transition={{ duration: 0.75, ease: EASE_IN_OUT_EXPO }}
          >
            {/* Panel top bar mirrors the site bar so CLOSE sits where MENU was */}
            <div className="flex items-center justify-between t-nav">
              <a href="/" onClick={close} className="text-paper outline-none focus-visible:underline">
                OLUWAFEMI
              </a>
              <button
                type="button"
                onClick={close}
                data-cursor="zoom"
                className="group inline-flex items-center gap-2.5 text-paper outline-none"
              >
                <RollLabel text="CLOSE" />
                <Cross />
              </button>
            </div>

            <div className="mt-6 h-px bg-paper/15 origin-left" />

            <nav aria-label="Menu" className="flex-1 flex flex-col justify-center py-10">
              <ul className="flex flex-col">
                {items.map((item, i) => {
                  const active = isActive(item.href);
                  return (
                    <li key={item.href} className="border-b border-paper/15 last:border-b-0">
                      <a
                        ref={i === 0 ? firstLinkRef : undefined}
                        href={item.href}
                        onClick={close}
                        aria-current={active ? "page" : undefined}
                        className="group flex items-end justify-between gap-4 py-3 sm:py-4 outline-none"
                      >
                        <span className="block overflow-hidden">
                          <motion.span
                            className="block font-display font-extrabold uppercase leading-[0.92] tracking-[-0.02em] text-[clamp(44px,12vw,96px)]"
                            initial={reduce ? false : { y: "110%" }}
                            animate={{ y: "0%" }}
                            exit={reduce ? undefined : { y: "-110%", transition: { duration: 0.35, ease: EASE_IN_OUT_EXPO, delay: i * 0.03 } }}
                            transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.32 + i * 0.07 }}
                          >
                            <span className="relative block overflow-hidden py-[0.06em]">
                              <span className="block transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-[120%] group-focus-visible:-translate-y-[120%]">
                                {item.label}
                              </span>
                              <span
                                aria-hidden
                                className="absolute inset-x-0 top-[0.06em] translate-y-[120%] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-focus-visible:translate-y-0"
                              >
                                {item.label}
                              </span>
                            </span>
                          </motion.span>
                        </span>
                        <motion.span
                          className="t-micro pb-2 sm:pb-3 flex items-center gap-2 text-paper/60 shrink-0"
                          initial={reduce ? false : { opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={reduce ? undefined : { opacity: 0, transition: { duration: 0.2 } }}
                          transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.5 + i * 0.07 }}
                        >
                          {active && <span className="h-1.5 w-1.5 rounded-full bg-paper" aria-hidden />}
                          <span className={active ? "text-paper" : ""}>{String(i + 1).padStart(2, "0")}</span>
                        </motion.span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <motion.div
              className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between t-nav"
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, transition: { duration: 0.2 } }}
              transition={{ duration: 0.7, ease: EASE_OUT_EXPO, delay: 0.75 }}
            >
              <div className="flex flex-col gap-1.5 min-w-0">
                <span className="t-micro text-paper/60">GET IN TOUCH</span>
                <a href={`mailto:${email.toLowerCase()}`} className="text-paper break-all outline-none focus-visible:underline">
                  {email}
                </a>
              </div>
              <div className="flex items-center gap-3 text-paper [&_button]:text-paper">
                <span className="t-micro text-paper/60">THEME</span>
                <ThemeToggle />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/** Label that rolls up on hover, matching the desktop nav links. */
function RollLabel({ text }: { text: string }) {
  return (
    <span className="relative block overflow-hidden">
      <span className="block transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-full group-focus-visible:-translate-y-full">
        {text}
      </span>
      <span
        aria-hidden
        className="absolute inset-0 translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-focus-visible:translate-y-0"
      >
        {text}
      </span>
    </span>
  );
}

function Burger() {
  return (
    <span aria-hidden className="relative block h-[10px] w-[18px]">
      <span className="absolute left-0 right-0 top-0 h-[1.5px] bg-current transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[3px]" />
      <span className="absolute left-0 right-0 bottom-0 h-[1.5px] bg-current transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-x-[3px]" />
    </span>
  );
}

function Cross() {
  return (
    <motion.span
      aria-hidden
      className="relative block h-[18px] w-[18px]"
      initial={{ rotate: -90, opacity: 0 }}
      animate={{ rotate: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.3 }}
    >
      <span className="absolute left-0 right-0 top-1/2 h-[1.5px] -translate-y-1/2 rotate-45 bg-current transition-transform duration-500 group-hover:rotate-[135deg]" />
      <span className="absolute left-0 right-0 top-1/2 h-[1.5px] -translate-y-1/2 -rotate-45 bg-current transition-transform duration-500 group-hover:rotate-[45deg]" />
    </motion.span>
  );
}
