"use client";

import { motion } from "framer-motion";
import { Reveal } from "../motion/reveal";
import { Frame } from "../motion/frame";
import { EASE_OUT_EXPO } from "../motion/easing";

type Tool = { name: string; use: string };

const TOOLS: Tool[] = [
  { name: "Figma", use: "Interface & systems" },
  { name: "Blender", use: "3D direction & render" },
  { name: "Cinema 4D", use: "Motion, occasionally" },
  { name: "After Effects", use: "Motion polish" },
  { name: "Illustrator", use: "Type & marks" },
  { name: "Webflow", use: "Marketing sites" },
  { name: "Next.js", use: "Production frontend" },
  { name: "Framer Motion", use: "Interaction" },
];

function ToolCard({ tool, i }: { tool: Tool; i: number }) {
  return (
    <motion.div
      className="relative p-6 md:p-8 overflow-hidden group"
      initial="rest"
      whileHover="hover"
      animate="rest"
      data-cursor="zoom"
    >
      <motion.div
        aria-hidden
        className="absolute inset-0 bg-ink origin-bottom"
        variants={{ rest: { scaleY: 0 }, hover: { scaleY: 1 } }}
        transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
      />
      <div className="relative flex flex-col gap-3">
        <motion.span
          className="t-micro tabular-nums"
          variants={{
            rest: { color: "var(--color-body)" },
            hover: { color: "var(--color-paper)" },
          }}
          transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
        >
          / {String(i + 1).padStart(2, "0")}
        </motion.span>
        <motion.span
          className="t-title"
          variants={{
            rest: { color: "var(--color-ink)" },
            hover: { color: "var(--color-paper)" },
          }}
          transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
        >
          {tool.name}
        </motion.span>
        <motion.span
          className="t-body"
          variants={{
            rest: { color: "var(--color-strong)" },
            hover: { color: "var(--color-paper)" },
          }}
          transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
        >
          {tool.use}
        </motion.span>
      </div>
    </motion.div>
  );
}

export function ToolkitSection() {
  return (
    <section id="toolkit" className="page-gutter">
      <Frame>
        <div className="flex flex-col">
          <div className="p-8 md:p-12 rule-h">
            <Reveal>
              <span className="t-micro text-body">/ 04 · TOOLKIT</span>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="t-title text-ink mt-6 max-w-[820px]">
                The tools do the thinking for you — if you let them.
              </h2>
            </Reveal>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 grid-col-rules">
            {TOOLS.map((t, i) => (
              <div
                key={t.name}
                className={`${i < TOOLS.length - 4 ? "rule-h" : ""}`}
              >
                <ToolCard tool={t} i={i} />
              </div>
            ))}
          </div>
        </div>
      </Frame>
    </section>
  );
}
