"use client";

import { motion } from "framer-motion";
import { InfoPanel } from "./info-panel";
import { SplitLines } from "./motion/split-lines";
import { EASE_OUT_EXPO } from "./motion/easing";

export function Hero() {
  return (
    <section id="home" className="page-gutter">
      <motion.div
        className="h-px w-full bg-[var(--rule)] mt-[30px] origin-left"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.1, ease: EASE_OUT_EXPO, delay: 0.2 }}
      />

      <div className="pt-[48px] pb-[60px] flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10">
        <div className="max-w-[640px]">
          <h1 className="t-hero text-ink">
            <SplitLines
              lines={["Oduneye", "Oluwafemi"]}
              delay={0.35}
              stagger={0.12}
            />
          </h1>
          <motion.p
            className="mt-2 t-body text-body max-w-[528px]"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.9 }}
          >
            Designer partnering with brands across 3D, motion, and visual
            design. Specializing in embedded, long-term collaborations.
          </motion.p>
        </div>

        <motion.div
          className="lg:pt-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 1.05 }}
        >
          <InfoPanel />
        </motion.div>
      </div>
    </section>
  );
}
