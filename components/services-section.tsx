"use client";

import { motion } from "framer-motion";
import { Reveal } from "./motion/reveal";
import { EASE_OUT_EXPO } from "./motion/easing";
import { Frame } from "./motion/frame";

const SERVICES = [
  {
    title: "Brand Identity",
    desc: "Crafting marks, systems, and visual voices that feel inevitable.",
  },
  {
    title: "UI/UX Design",
    desc: "Creating user-centered interfaces that are both beautiful and functional.",
  },
  {
    title: "Design Engineering",
    desc: "Turning designs into live, testable products: rapid prototypes, component libraries and React front-ends.",
  },
  {
    title: "Website Design",
    desc: "Designing editorial, expressive marketing sites that perform.",
  },
  {
    title: "Website Development",
    desc: "Shipping production-grade frontends with care for motion and craft.",
  },
  {
    title: "MVP Development",
    desc: "Partnering with founders to ship a first, honest product fast.",
  },
];

const PROCESS = [
  { title: "Understand", desc: "Goals, users and constraints first: audits, research and a brief we both sign off." },
  { title: "Design", desc: "Flows, UI and a design system in Figma, put in front of people early." },
  { title: "Build", desc: "Production-ready front-end in React and Next.js, or a live prototype within days." },
  { title: "Ship and refine", desc: "Launch, watch how it's used, and tighten what matters." },
];

/** Left column: how an engagement runs, so the services list has a shape. */
function ProcessColumn() {
  return (
    <div className="order-last lg:order-none p-8 md:p-10 flex flex-col justify-between gap-10">
      <Reveal>
        <p className="t-micro text-body">How a project runs</p>
      </Reveal>
      <ol className="divide-y divide-[var(--rule)]">
        {PROCESS.map((p, i) => (
          <Reveal key={p.title} delay={0.08 * i} as="li" y={12}>
            <div className="grid grid-cols-[56px_1fr] md:grid-cols-[72px_1fr] gap-4 py-5">
              <span className="font-[family-name:var(--font-display)] font-extrabold text-[28px] md:text-[32px] leading-none tracking-[-0.02em] text-ink tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="t-body text-ink">{p.title}</p>
                <p className="mt-1 t-body text-body max-w-[380px]">{p.desc}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </ol>
      <Reveal delay={0.4}>
        <p className="t-micro text-strong">From one-week sprints to multi-month builds.</p>
      </Reveal>
    </div>
  );
}

function ServiceRow({ title, desc }: { title: string; desc: string }) {
  return (
    <motion.div
      className="relative overflow-hidden cursor-pointer"
      initial="rest"
      whileHover="hover"
      animate="rest"
      data-cursor="zoom"
    >
      <motion.div
        aria-hidden
        className="absolute inset-0 bg-ink origin-left"
        variants={{
          rest: { scaleX: 0 },
          hover: { scaleX: 1 },
        }}
        transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
      />
      <div className="relative flex flex-col md:flex-row md:items-center gap-2 md:gap-12 py-5 md:py-6 px-4">
        <motion.span
          className="shrink-0 md:w-[220px] t-body"
          variants={{
            rest: { color: "var(--color-body)", x: 0 },
            hover: { color: "var(--color-paper)", x: 8 },
          }}
          transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
        >
          {title}
        </motion.span>
        <motion.span
          className="t-micro md:text-right md:flex-1"
          variants={{
            rest: { color: "var(--color-strong)" },
            hover: { color: "var(--color-paper)" },
          }}
          transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
        >
          {desc}
        </motion.span>
        <motion.span
          aria-hidden
          className="absolute right-4 top-1/2 -translate-y-1/2 text-paper t-micro"
          variants={{
            rest: { opacity: 0, x: -8 },
            hover: { opacity: 1, x: 0 },
          }}
          transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
        >
          ↗
        </motion.span>
      </div>
    </motion.div>
  );
}

export function ServicesSection() {
  return (
    <section id="services" className="page-gutter">
      <Frame>
        <div className="grid grid-cols-1 lg:grid-cols-2 grid-col-rules">
          <ProcessColumn />
          <div className="p-8 md:p-10">
            <Reveal>
              <h2 className="t-title text-ink">What I do and how I can help</h2>
            </Reveal>
            <ul className="mt-10 divide-y divide-[var(--rule)]">
              {SERVICES.map((s, i) => (
                <Reveal key={s.title} delay={0.08 * i} as="li" y={12}>
                  <ServiceRow title={s.title} desc={s.desc} />
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </Frame>
    </section>
  );
}
