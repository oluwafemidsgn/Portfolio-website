"use client";

import { motion } from "framer-motion";
import { SplitLines } from "../motion/split-lines";
import { EASE_OUT_EXPO } from "../motion/easing";

const FACTS = [
  { label: "REPLY TIME", value: "~ 48 HRS" },
  { label: "TIMEZONE", value: "GMT+1 / LAGOS" },
  { label: "AVAILABILITY", value: "OPEN Q2 2026" },
  { label: "BEST FOR", value: "EMBEDDED SPRINTS" },
];

export function ContactHero() {
  return (
    <section id="contact-top" className="page-gutter">
      <motion.div
        className="h-px w-full bg-[var(--rule)] mt-[30px] origin-left"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.1, ease: EASE_OUT_EXPO, delay: 0.2 }}
      />

      <div className="pt-[48px] pb-[60px] flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10">
        <div className="max-w-[720px]">
          <motion.span
            className="t-micro text-body block mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE_OUT_EXPO, delay: 0.35 }}
          >
            CONTACT — LET&apos;S MAKE SOMETHING
          </motion.span>

          <h1 className="t-hero text-ink">
            <SplitLines
              lines={["Say hello,", "share a brief,", "start a project."]}
              delay={0.5}
              stagger={0.1}
            />
          </h1>

          <motion.p
            className="mt-6 t-lead text-body max-w-[560px]"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 1.05 }}
          >
            I take on a small number of embedded engagements each quarter.
            Send a note with what you&apos;re making and when you&apos;d like
            to start — even a rough paragraph helps.
          </motion.p>
        </div>

        <motion.aside
          className="lg:pt-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 1.2 }}
        >
          <dl className="grid grid-cols-2 gap-x-8 gap-y-6 w-full max-w-[360px]">
            {FACTS.map((f) => (
              <div key={f.label} className="flex flex-col gap-2">
                <dt className="t-micro text-body">{f.label}</dt>
                <dd className="t-nav text-strong tabular-nums leading-[1.4]">
                  {f.value}
                </dd>
              </div>
            ))}
          </dl>
        </motion.aside>
      </div>
    </section>
  );
}
