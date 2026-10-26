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
