"use client";

import { motion } from "framer-motion";
import { Reveal } from "../motion/reveal";
import { Frame } from "../motion/frame";
import { EASE_OUT_EXPO } from "../motion/easing";

type Mention = { year: string; title: string; where: string };

const MENTIONS: Mention[] = [
  { year: "2024", title: "Featured project", where: "SiteInspire" },
  { year: "2024", title: "Honorable mention", where: "Awwwards" },
  { year: "2023", title: "Top 100 designers to watch", where: "Dribbble Annual" },
  { year: "2023", title: "Interview: Designing in Lagos", where: "Brand New" },
  { year: "2022", title: "Panelist, Africa Design Week", where: "ADW Lagos" },
];

export function RecognitionSection() {
  return (
    <section id="recognition" className="page-gutter">
      <Frame>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] grid-col-rules">
          <div className="p-8 md:p-12">
            <Reveal>
              <span className="t-micro text-body">/ 05 · RECOGNITION</span>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="t-title text-ink mt-6">
                Kind words and quiet nods.
              </h2>
            </Reveal>
          </div>

          <ul>
            {MENTIONS.map((m, i) => (
              <motion.li
                key={m.year + m.title}
                className={`group relative flex flex-col md:flex-row md:items-baseline gap-2 md:gap-10 p-6 md:p-8 ${
                  i < MENTIONS.length - 1 ? "rule-h" : ""
                }`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.6,
                  ease: EASE_OUT_EXPO,
                  delay: i * 0.05,
                }}
              >
                <span className="t-micro text-body tabular-nums shrink-0 md:w-[80px]">
                  {m.year}
                </span>
                <span className="t-nav text-ink flex-1">{m.title}</span>
                <span className="t-micro text-strong">{m.where}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </Frame>
    </section>
  );
}
