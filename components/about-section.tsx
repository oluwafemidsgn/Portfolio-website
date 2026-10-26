"use client";

import { motion } from "framer-motion";
import { Reveal } from "./motion/reveal";
import { EASE_OUT_EXPO } from "./motion/easing";
import { Frame } from "./motion/frame";

/**
 * Photos for the About block. Paste a URL (Cloudinary) into `src` and the
 * slot fills; empty slots keep the neutral placeholder so the grid holds.
 */
const ABOUT_PHOTOS = {
  main: { src: "", alt: "" },
  pair: [
    { src: "", alt: "", caption: "" },
    { src: "", alt: "", caption: "" },
  ],
};

function PhotoSlot({ src, alt, caption }: { src: string; alt: string; caption?: string }) {
  return (
    <figure className="thumb-card group flex flex-col p-2">
      <div className="thumb relative w-full aspect-[432/298] overflow-hidden bg-mute">
        {src && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
          />
        )}
      </div>
      {caption && <figcaption className="mt-2 t-micro text-strong">{caption}</figcaption>}
    </figure>
  );
}

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
            >
              {ABOUT_PHOTOS.main.src && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={ABOUT_PHOTOS.main.src} alt={ABOUT_PHOTOS.main.alt} className="absolute inset-0 h-full w-full object-cover" loading="lazy" decoding="async" />
              )}
            </motion.div>
          </div>

          <div className="flex flex-col">
            <div className="p-8 md:p-10 rule-h">
              <Reveal delay={0.1}>
                <h2 className="t-title text-ink">About me</h2>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="mt-6 t-lead text-body max-w-[880px]">
                  I own the full stack of product work: strategy and research,
                  UX, UI and design systems, through to production-ready
                  front-end code. Clarity, trust and conversion guide every
                  decision.
                </p>
              </Reveal>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <Reveal delay={0.28}>
                  <p className="t-body text-body max-w-[368px]">
                    I work AI-native. With Cursor, v0 and Claude Code I turn
                    Figma concepts into live builds within days, so people can
                    test how a product actually feels before it ships.
                  </p>
                </Reveal>
                <Reveal delay={0.36}>
                  <p className="t-body text-body max-w-[368px]">
                    Today I lead product design at Intasect, a product design
                    and development agency in Lagos, and build my own products
                    on the side, like Credentia.
                  </p>
                </Reveal>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 grid-col-rules">
              {ABOUT_PHOTOS.pair.map((p, i) => (
                <PhotoSlot key={i} {...p} />
              ))}
            </div>
          </div>
        </div>
      </Frame>
    </section>
  );
}
