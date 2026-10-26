"use client";

import { motion } from "framer-motion";
import { Reveal } from "../motion/reveal";
import { EASE_OUT_EXPO } from "../motion/easing";
import { Frame } from "../motion/frame";

const META = [
  { k: "BORN", v: "2002 · Lagos" },
  { k: "DESIGNING SINCE", v: "2021" },
  { k: "STUDYING", v: "University of Lagos" },
  { k: "LANGUAGES", v: "English, Yorùbá" },
];

/** Portrait for the bio panel — paste a URL (Cloudinary) to fill it. */
const PORTRAIT = { src: "https://res.cloudinary.com/dognbegiw/image/upload/f_auto,q_auto,w_1400/portfolio/about/portrait-agbada.jpg", alt: "Oluwafemi Oduneye in Yorùbá attire and fila", position: "50% 20%" };

export function BioSection() {
  return (
    <section className="page-gutter">
      <Frame>
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,520px)_1fr] grid-col-rules">
          {/* Portrait panel — stays vertical on desktop, stacks on mobile. */}
          <div className="p-2 flex">
            <motion.div
              className="thumb w-full min-h-[420px] lg:min-h-[640px] relative overflow-hidden"
              initial={{ scale: 1.08 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 1.2, ease: EASE_OUT_EXPO }}
            >
              {PORTRAIT.src && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={PORTRAIT.src} alt={PORTRAIT.alt} style={{ objectPosition: PORTRAIT.position }} className="absolute inset-0 h-full w-full object-cover" loading="lazy" decoding="async" />
              )}
            </motion.div>
          </div>

          {/* Bio copy + specimen rows. */}
          <div className="flex flex-col">
            <div className="p-8 md:p-12 rule-h">
              <Reveal>
                <span className="t-micro text-body">PORTRAIT · 001</span>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="t-title text-ink mt-6">
                  A short version of a long story
                </h2>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="mt-8 t-lead text-body max-w-[720px]">
                  I design and build products end to end, from strategy and
                  research through UX, UI and design systems to
                  production-ready front-end code.
                </p>
              </Reveal>
              <Reveal delay={0.3}>
                <p className="mt-6 t-body text-body max-w-[640px]">
                  I started designing products in Lagos in 2021, leading UX and
                  UI for a logistics ecosystem. Since then I&apos;ve worked
                  across social, e-commerce, fintech and marketplaces, for
                  agencies in Lagos and startups in the US and Canada. Today I
                  lead product design at Intasect and prototype in code with
                  Cursor, v0 and Claude Code, so a team can test how a product
                  feels within days, not weeks.
                </p>
              </Reveal>
            </div>

            {/* Specimen: compact identity card. */}
            <div className="grid grid-cols-2 md:grid-cols-4 grid-col-rules">
              {META.map((m, i) => (
                <Reveal key={m.k} delay={0.1 * i}>
                  <div className="p-6 md:p-8">
                    <div className="t-micro text-body">{m.k}</div>
                    <div className="mt-3 t-nav text-strong">{m.v}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </Frame>
    </section>
  );
}
