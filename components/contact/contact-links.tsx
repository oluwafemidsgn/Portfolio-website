"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { EASE_OUT_EXPO } from "../motion/easing";

const DIRECT = {
  label: "EMAIL",
  value: "HEY@OLUWAFEMIDSGN.COM",
  href: "mailto:hey@oluwafemidsgn.com",
};

const SOCIALS = [
  { label: "TWITTER / X", handle: "@OLUWAFEMIDSGN", href: "https://x.com/" },
  { label: "INSTAGRAM", handle: "@OLUWAFEMIDSGN", href: "https://instagram.com/" },
  { label: "READ.CV", handle: "/OLUWAFEMIDSGN", href: "https://read.cv/" },
  { label: "LINKEDIN", handle: "/IN/OLUWAFEMIDSGN", href: "https://linkedin.com/" },
];

const FAQS = [
  {
    q: "Do you take on small projects?",
    a: "Yes — if the work is focused and the brief is clear. A one-week visual sprint is fair game.",
  },
  {
    q: "Can you sign an NDA?",
    a: "Happy to. Send a draft with your first note and I'll countersign before the kickoff call.",
  },
  {
    q: "Do you work with agencies?",
    a: "Occasionally, as a white-label partner. Standard rates and credit go to the agency.",
  },
];

/**
 * Right-hand column on the contact page — direct email, social links,
 * and a short FAQ. Intentionally spare so the form stays the hero.
 */
export function ContactLinks() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduce = useReducedMotion();

  const show = inView || reduce;

  return (
    <div
      ref={ref}
      className="flex flex-col gap-10 p-6 md:p-10 border-t lg:border-t-0 border-[var(--rule)]"
    >
      {/* Direct line */}
      <motion.a
        href={DIRECT.href}
        data-cursor="zoom"
        initial={reduce ? false : { opacity: 0, y: 14 }}
        animate={show ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
        className="cms-ink-hover block border border-[var(--rule)] p-6"
      >
        <p className="t-micro text-body">{DIRECT.label}</p>
        <p className="mt-3 t-title">{DIRECT.value}</p>
        <p className="mt-4 t-micro text-body">TAP TO COMPOSE ↗</p>
      </motion.a>

      {/* Socials */}
      <div>
        <p className="t-micro text-body mb-3">ELSEWHERE</p>
        <ul className="flex flex-col">
          {SOCIALS.map((s, i) => (
            <motion.li
              key={s.label}
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={show ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: 0.05 * i,
                ease: EASE_OUT_EXPO,
              }}
            >
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="zoom"
                className="rule-h cms-ink-hover flex items-baseline justify-between gap-6 py-4"
              >
                <span className="t-nav text-ink">{s.label}</span>
                <span className="t-micro text-body">{s.handle} ↗</span>
              </a>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* FAQ */}
      <div>
        <p className="t-micro text-body mb-3">FREQUENTLY ASKED</p>
        <ul className="flex flex-col gap-5">
          {FAQS.map((f, i) => (
            <motion.li
              key={f.q}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={show ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: 0.2 + 0.05 * i,
                ease: EASE_OUT_EXPO,
              }}
            >
              <p className="t-nav text-ink">{f.q}</p>
              <p className="mt-2 t-body text-strong">{f.a}</p>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}
