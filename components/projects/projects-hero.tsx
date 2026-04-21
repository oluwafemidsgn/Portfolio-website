"use client";

import { motion } from "framer-motion";
import { SplitLines } from "../motion/split-lines";
import { EASE_OUT_EXPO } from "../motion/easing";

type Props = { count: number };

export function ProjectsHero({ count }: Props) {
  return (
    <section id="projects-top" className="page-gutter">
      <motion.div
        className="h-px w-full bg-[var(--rule)] mt-[30px] origin-left"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.1, ease: EASE_OUT_EXPO, delay: 0.2 }}
      />

      <div className="pt-[48px] pb-[60px] flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
        <div className="max-w-[720px]">
          <motion.span
            className="t-micro text-body block mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE_OUT_EXPO, delay: 0.35 }}
          >
            / INDEX · {String(count).padStart(3, "0")} ENTRIES
          </motion.span>

          <h1 className="t-hero text-ink">
            <SplitLines lines={["Selected", "Work"]} delay={0.5} stagger={0.12} />
          </h1>
        </div>

        <motion.p
          className="t-body text-body max-w-[420px]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 1 }}
        >
          A running catalogue of work across brand, 3D, motion, and product.
          Click through for a closer read on how each one was made.
        </motion.p>
      </div>
    </section>
  );
}
