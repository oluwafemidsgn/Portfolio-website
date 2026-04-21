"use client";

import { motion } from "framer-motion";
import { Reveal } from "../motion/reveal";
import { Frame } from "../motion/frame";
import { EASE_OUT_EXPO } from "../motion/easing";

type Entry = {
  year: string;
  role: string;
  org: string;
  location: string;
  note: string;
};

const ENTRIES: Entry[] = [
  {
    year: "2025",
    role: "Independent / Creative Designer",
    org: "Self-directed",
    location: "Lagos",
    note: "Embedded brand + product partnerships with early-stage teams across Africa and Europe.",
  },
  {
    year: "2023",
    role: "Senior Brand Designer",
    org: "Form Studio",
    location: "Remote",
    note: "Led visual systems for three public launches. Shipped a design-ops handbook still in use by the team.",
  },
  {
    year: "2021",
    role: "Brand & Motion Designer",
    org: "Noir Agency",
    location: "Lagos",
    note: "Owned the motion pipeline — from storyboards to final renders — for ten+ identity rollouts.",
  },
  {
    year: "2019",
    role: "Freelance",
    org: "Various",
    location: "Remote",
    note: "Built a portfolio the hard way: cold emails, late nights, and a lot of unsolicited logos.",
  },
  {
    year: "2018",
    role: "First file opened",
    org: "Figma · Blender",
    location: "Lagos",
    note: "Discovered the joy of a pen-tool. Haven't closed it since.",
  },
];

function Row({ entry, i }: { entry: Entry; i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: EASE_OUT_EXPO, delay: i * 0.06 }}
    >
      <motion.div
        className="group relative grid grid-cols-[80px_1fr] md:grid-cols-[120px_1fr_auto] gap-6 md:gap-10 py-7 md:py-8 px-4 md:px-8 overflow-hidden"
        initial="rest"
        whileHover="hover"
        animate="rest"
        data-cursor="zoom"
      >
        {/* Year — oversized, tabular. */}
        <motion.span
          className="t-title text-ink tabular-nums self-start"
          variants={{ rest: { x: 0 }, hover: { x: 4 } }}
          transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
        >
          {entry.year}
        </motion.span>

        {/* Middle block: role + org. */}
        <div className="min-w-0">
          <motion.h3
            className="t-nav text-ink"
            variants={{ rest: { x: 0 }, hover: { x: 4 } }}
            transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
          >
            {entry.role}
          </motion.h3>
          <div className="mt-2 t-micro text-body">
            {entry.org} · {entry.location}
          </div>
          <p className="mt-4 t-body text-strong max-w-[560px]">{entry.note}</p>
        </div>

        {/* Index badge on the right, desktop only. */}
        <span
          className="hidden md:block t-micro text-body tabular-nums self-start"
          aria-hidden
        >
          / {String(i + 1).padStart(2, "0")}
        </span>
      </motion.div>
    </motion.div>
  );
}

export function JourneySection() {
  return (
    <section id="journey" className="page-gutter">
      <Frame>
        <div className="flex flex-col">
          <div className="p-8 md:p-12 rule-h">
            <Reveal>
              <span className="t-micro text-body">/ 02 · JOURNEY</span>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="t-title text-ink mt-6 max-w-[820px]">
                Seven years, roughly four cities, and a stack of unfinished
                sketchbooks.
              </h2>
            </Reveal>
          </div>

          <div className="divide-y divide-[var(--rule)]">
            {ENTRIES.map((e, i) => (
              <Row key={e.year + e.org} entry={e} i={i} />
            ))}
          </div>
        </div>
      </Frame>
    </section>
  );
}
