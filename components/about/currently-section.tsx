"use client";

import { motion } from "framer-motion";
import { Reveal } from "../motion/reveal";
import { Frame } from "../motion/frame";
import { EASE_OUT_EXPO } from "../motion/easing";

type Card = {
  eyebrow: string;
  title: string;
  meta: string;
  detail: string;
};

const CARDS: Card[] = [
  {
    eyebrow: "READING",
    title: "How to Talk to Anyone, Anytime, Anywhere",
    meta: "Larry King",
    detail: "On listening first and asking better questions, useful in every client call and user interview.",
  },
  {
    eyebrow: "LISTENING",
    title: "Love, Damini",
    meta: "Burna Boy · 2022",
    detail: "On repeat while I design.",
  },
  {
    eyebrow: "PLAYING",
    title: "No game right now",
    meta: "—",
    detail: "Nothing on the go at the moment.",
  },
];

export function CurrentlySection() {
  return (
    <section id="currently" className="page-gutter">
      <Frame>
        <div className="flex flex-col">
          <div className="p-8 md:p-12 rule-h">
            <Reveal>
              <span className="t-micro text-body">/ 06 · CURRENTLY</span>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="t-title text-ink mt-6 max-w-[820px]">
                What I&apos;m keeping close this month.
              </h2>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 grid-col-rules">
            {CARDS.map((c, i) => (
              <motion.article
                key={c.title}
                className="p-8 md:p-10 flex flex-col gap-6 min-h-[340px]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.7,
                  ease: EASE_OUT_EXPO,
                  delay: i * 0.08,
                }}
              >
                <div className="flex items-center gap-3">
                  <motion.span
                    aria-hidden
                    className="h-1.5 w-1.5 rounded-full bg-ink"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{
                      duration: 2.4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.4,
                    }}
                  />
                  <span className="t-micro text-body">{c.eyebrow}</span>
                </div>
                <h3 className="t-nav text-ink leading-snug">{c.title}</h3>
                <p className="t-micro text-strong">{c.meta}</p>
                <p className="t-body text-body mt-auto">{c.detail}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </Frame>
    </section>
  );
}
