"use client";

import { motion } from "framer-motion";
import { Reveal } from "../motion/reveal";
import { EASE_OUT_EXPO } from "../motion/easing";
import { Frame } from "../motion/frame";

const META = [
  { k: "BORN", v: "1997 · Lagos" },
  { k: "FIRST TOOL", v: "Figma, 2018" },
  { k: "EDUCATION", v: "Self-taught" },
  { k: "LANGUAGES", v: "English, Yorùbá" },
];

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
            />
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
                  I design at the seam between the tangible and the digital.
                  Logos that sit comfortably on a business card and on a
                  render pass. Interfaces that feel like objects. Motion that
                  moves with purpose, not decoration.
                </p>
              </Reveal>
              <Reveal delay={0.3}>
                <p className="mt-6 t-body text-body max-w-[640px]">
                  I grew up in Lagos drawing letterforms and later fell for
                  Blender after a particularly bad MBTI rabbit-hole. Today I
                  split my time between long-term brand partners and a
                  rotating cast of independent studios. I believe the best
                  work comes from staying in the kitchen — being embedded
                  with a team long enough to understand the dish we&apos;re
                  actually cooking.
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
