"use client";

import { motion } from "framer-motion";
import { Reveal } from "./motion/reveal";
import { EASE_OUT_EXPO } from "./motion/easing";
import { Frame } from "./motion/frame";
import { SOCIALS, type Social } from "@/lib/socials";
import { SocialIcon } from "./social-icon";
import { SITE_INTRO } from "@/lib/site";

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

/**
 * Black-and-white social tile. On hover/focus ink rises from the base, the
 * glyph rolls up and is replaced by its inverted twin, and an arrow slides in.
 */
function SocialTile({ s }: { s: Social }) {
  return (
    <a
      href={s.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${s.label} — ${s.handle}`}
      data-cursor="zoom"
      className="group relative flex aspect-square flex-col justify-between overflow-hidden p-4 text-ink outline-none focus-visible:ring-1 focus-visible:ring-ink"
    >
      <span
        aria-hidden
        className={`absolute inset-0 origin-bottom scale-y-0 bg-ink transition-transform duration-500 ${EASE} group-hover:scale-y-100 group-focus-visible:scale-y-100`}
      />
      <span className="relative flex justify-end">
        <span
          aria-hidden
          className={`text-[15px] leading-none opacity-0 -translate-x-2 translate-y-2 transition-all duration-500 ${EASE} group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:text-paper group-focus-visible:opacity-100`}
        >
          ↗
        </span>
      </span>
      <span className="relative mx-auto block h-9 w-9 overflow-hidden">
        <span className={`absolute inset-0 flex items-center justify-center transition-transform duration-500 ${EASE} group-hover:-translate-y-full group-focus-visible:-translate-y-full`}>
          <SocialIcon name={s.key} size={30} />
        </span>
        <span className={`absolute inset-0 flex items-center justify-center translate-y-full text-paper transition-transform duration-500 ${EASE} group-hover:translate-y-0 group-focus-visible:translate-y-0`}>
          <SocialIcon name={s.key} size={30} />
        </span>
      </span>
      <span className={`relative flex items-center justify-between gap-2 t-micro transition-colors duration-300 group-hover:text-paper group-focus-visible:text-paper`}>
        <span className="uppercase">{s.label}</span>
        <span className="truncate text-body group-hover:text-paper/70 group-focus-visible:text-paper/70">{s.handle}</span>
      </span>
    </a>
  );
}

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
                  {SITE_INTRO}
                </p>
              </Reveal>
            </div>
            <div className="grid grid-cols-3 grid-col-rules [&>*:nth-child(n+4)]:border-t [&>*:nth-child(n+4)]:border-[var(--rule)]">
              {SOCIALS.map((s) => (
                <SocialTile key={s.key} s={s} />
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
