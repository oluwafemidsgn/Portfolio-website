"use client";

import { motion } from "framer-motion";
import { Reveal } from "./motion/reveal";
import { ProjectThumb } from "./project-thumb";
import { EASE_OUT_EXPO } from "./motion/easing";
import { Frame } from "./motion/frame";

export function AboutSection() {
  return (
    <section id="about" className="page-gutter">
      <Frame>
        <div className="grid grid-cols-1 lg:grid-cols-2 grid-col-rules">
          <div className="p-2 flex">
            <motion.div
              className="thumb w-full min-h-[360px] relative overflow-hidden"
              initial={{ scale: 1.08 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 1.2, ease: EASE_OUT_EXPO }}
            />
          </div>

          <div className="flex flex-col">
            <div className="p-8 md:p-10 rule-h">
              <Reveal delay={0.1}>
                <h2 className="t-title text-ink">About me</h2>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="mt-6 t-lead text-body max-w-[880px]">
                  My design journey started with a passion for creating
                  intuitive and visually captivating experiences, driven by the
                  transformative impact of design in solving problems and
                  enhancing user interactions with technology. My aim is to
                  develop digital experiences that blend functionality with
                  delight.
                </p>
              </Reveal>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <Reveal delay={0.28}>
                  <p className="t-body text-body max-w-[368px]">
                    My design philosophy focuses on crafting seamless, engaging
                    user journeys that leave a lasting impression. I believe in
                    the power of clear communication, user empathy, and a
                    meticulous eye for detail to create high-quality websites.
                  </p>
                </Reveal>
                <Reveal delay={0.36}>
                  <p className="t-body text-body max-w-[368px]">
                    When I&apos;m not designing or developing, I explore Lagos,
                    seek inspiration in nature, and continuously learn new
                    things to improve my design skills.
                  </p>
                </Reveal>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 grid-col-rules">
              <ProjectThumb date="2024.11" title="FORM STUDIO" type="Case study" />
              <ProjectThumb date="2024.08" title="NOIR" type="Case study" />
            </div>
          </div>
        </div>
      </Frame>
    </section>
  );
}
