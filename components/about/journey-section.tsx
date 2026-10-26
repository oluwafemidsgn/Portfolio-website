"use client";

import { motion } from "framer-motion";
import { Reveal } from "../motion/reveal";
import { Frame } from "../motion/frame";
import { EASE_OUT_EXPO } from "../motion/easing";

type Entry = {
  year: string;
  dates: string;
  role: string;
  org: string;
  location: string;
  note: string;
};

// From the CV, newest first.
const ENTRIES: Entry[] = [
  {
    year: "2024",
    dates: "2024 — Present",
    role: "Lead Product Designer",
    org: "Intasect",
    location: "Lagos",
    note: "Lead product design across client engagements, from discovery to developer handoff. Shipped e-commerce, social commerce, mentorship and marketplace products, internal agency tools and marketing sites, prototyping in code to test ideas within days.",
  },
  {
    year: "2023",
    dates: "Jun 2023 — 2024",
    role: "Freelance Product Designer",
    org: "Startups",
    location: "USA · Remote",
    note: "Designed brand identities and products for 5+ startups in fintech, e-commerce and social, from wireframes to high-fidelity prototypes and design systems.",
  },
  {
    year: "2022",
    dates: "Dec 2022 — May 2023",
    role: "Creative Designer",
    org: "EV.com",
    location: "Canada · Remote",
    note: "Redesigned the e-commerce site into a more professional, trust-driven experience.",
  },
  {
    year: "2022",
    dates: "Aug — Dec 2022",
    role: "UI/UX & Product Designer",
    org: "GoDigital, Inc",
    location: "Lagos",
    note: "Led end-to-end design of a social media app, from audience research and user flows to interactive prototypes, usability iterations and developer handoff.",
  },
  {
    year: "2022",
    dates: "Aug — Oct 2022",
    role: "UI/UX & Brand Designer",
    org: "NativeBrands",
    location: "Lagos",
    note: "Designed web UI, dashboards and brand guidelines, with responsive layouts and reusable components that kept web and dashboard experiences consistent.",
  },
  {
    year: "2021",
    dates: "Jul 2021 — Jun 2022",
    role: "Senior Product Designer",
    org: "DiamondScripts",
    location: "Lagos",
    note: "Led UX/UI for a logistics ecosystem serving drivers, dispatch teams and customers, backed by research with each, and built the design system that kept it consistent.",
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
            <span className="md:hidden"> · {entry.dates}</span>
          </div>
          <p className="mt-4 t-body text-strong max-w-[560px]">{entry.note}</p>
        </div>

        {/* Exact dates on the right, desktop only (folded into the org line on phones). */}
        <span className="hidden md:block t-micro text-body tabular-nums self-start text-right uppercase">
          {entry.dates}
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
                Five years across agencies, startups and products of my own.
              </h2>
            </Reveal>
          </div>

          <div className="divide-y divide-[var(--rule)]">
            {ENTRIES.map((e, i) => (
              <Row key={e.dates + e.org} entry={e} i={i} />
            ))}
          </div>
        </div>
      </Frame>
    </section>
  );
}
