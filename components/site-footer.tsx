"use client";

import { motion } from "framer-motion";
import { Reveal } from "./motion/reveal";
import { ProjectThumb } from "./project-thumb";
import { EASE_OUT_EXPO } from "./motion/easing";
import { Frame } from "./motion/frame";

const SOCIAL = [
  { date: "@oluwafemi", title: "TWITTER", type: "Follow" },
  { date: "@oluwafemidsgn", title: "INSTAGRAM", type: "Follow" },
  { date: "in/oluwafemi", title: "LINKEDIN", type: "Follow" },
  { date: "/oluwafemidsgn", title: "DRIBBBLE", type: "Follow" },
];

export function SiteFooter() {
  return (
    <footer className="page-gutter pb-10">
      <Frame>
        <div className="grid grid-cols-1 lg:grid-cols-2 grid-col-rules">
          <div className="flex flex-col">
            <div className="p-8 md:p-10 rule-h">
              <Reveal>
                <h2 className="t-title text-ink">Oduneye Oluwafemi</h2>
              </Reveal>
              <Reveal delay={0.15}>
                <p className="mt-6 t-body text-body max-w-[528px]">
                  Designer partnering with brands across 3D, motion, and visual
                  design. Specializing in embedded, long-term collaborations.
                </p>
              </Reveal>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 grid-col-rules">
              {SOCIAL.map((s) => (
                <ProjectThumb
                  key={s.title}
                  date={s.date}
                  title={s.title}
                  type={s.type}
                  aspect="square"
                />
              ))}
            </div>
          </div>

          <div className="p-2 flex">
            <motion.div
              className="thumb w-full min-h-[240px] relative overflow-hidden"
              initial={{ scale: 1.06 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 1.2, ease: EASE_OUT_EXPO }}
            />
          </div>
        </div>
      </Frame>
    </footer>
  );
}
