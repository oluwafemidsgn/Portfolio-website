"use client";

import { motion } from "framer-motion";
import { Accordion } from "../motion/accordion";
import { Reveal } from "../motion/reveal";
import { EASE_OUT_EXPO } from "../motion/easing";
import type { AccordionItem } from "@/lib/types";

type Props = {
  title: string;
  subtitle: string;
  overview: string;
  year: string;
  client: string;
  role: string;
  type: string;
  accordion: AccordionItem[];
};

export function CaseStudySidebar({
  title,
  subtitle,
  overview,
  year,
  client,
  role,
  type,
  accordion,
}: Props) {
  const meta = [
    { k: "CLIENT", v: client },
    { k: "ROLE", v: role },
    { k: "YEAR", v: year },
    { k: "DISCIPLINE", v: type },
  ].filter((m) => m.v);

  return (
    <aside className="p-5 sm:p-8 lg:p-6 xl:p-8 flex flex-col gap-6 lg:sticky lg:top-6 lg:self-start lg:max-h-[calc(100dvh-3rem)] lg:overflow-y-auto lg:overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div>
        <motion.span
          className="t-micro text-body"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
        >
          / CASE STUDY
        </motion.span>
        <Reveal delay={0.05}>
          <h1 className="t-lead font-[800] uppercase tracking-tight text-ink mt-3 break-words [font-family:var(--font-display)]">{title}</h1>
        </Reveal>
        {subtitle && (
          <Reveal delay={0.12}>
            <p className="t-body text-sm! text-strong mt-3 max-w-[38ch]">{subtitle}</p>
          </Reveal>
        )}
      </div>

      {meta.length > 0 && (
        <Reveal delay={0.2}>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-4">
            {meta.map((m) => (
              <div key={m.k} className="flex flex-col gap-1 min-w-0">
                <dt className="t-micro text-body">{m.k}</dt>
                <dd className="t-body text-sm! text-strong break-words">{m.v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      )}

      {overview && (
        <Reveal delay={0.28}>
          <p className="t-body text-sm! text-strong max-w-[42ch] whitespace-pre-line">
            {overview}
          </p>
        </Reveal>
      )}

      {accordion.length > 0 && (
        <Reveal delay={0.36}>
          <div>
            <div className="t-micro text-body mb-4">/ DETAILS</div>
            <Accordion items={accordion} />
          </div>
        </Reveal>
      )}
    </aside>
  );
}
