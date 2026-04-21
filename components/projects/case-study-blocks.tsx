"use client";

import { motion } from "framer-motion";
import type { Block } from "@/lib/types";
import { EASE_OUT_EXPO } from "../motion/easing";

type ImgProps = {
  src?: string;
  alt?: string;
  /** Adds bg-mute placeholder when src is empty. */
  placeholder?: boolean;
};

function Img({ src, alt = "", placeholder = true }: ImgProps) {
  // Using a regular <img> because admin-entered URLs will be arbitrary
  // hosts — next/image would need remotePatterns config for each one.
  if (!src) {
    return (
      <div
        className={`w-full h-full min-h-[320px] ${
          placeholder ? "bg-mute" : ""
        }`}
        aria-hidden
      />
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className="w-full h-auto object-cover block"
      loading="lazy"
    />
  );
}

function BlockFrame({
  children,
  i,
}: {
  children: React.ReactNode;
  i: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, ease: EASE_OUT_EXPO, delay: i * 0.04 }}
    >
      {children}
    </motion.div>
  );
}

export function CaseStudyBlocks({ blocks }: { blocks: Block[] }) {
  if (blocks.length === 0) {
    return (
      <div className="p-10 t-body text-body">
        No image blocks yet for this project.
      </div>
    );
  }

  return (
    <div className="flex flex-col divide-y divide-[var(--rule)]">
      {blocks.map((b, i) => (
        <BlockFrame key={b.id} i={i}>
          {b.kind === "full" && (
            <figure className="p-2">
              <div className="w-full overflow-hidden bg-mute">
                <Img src={b.image} alt={b.alt} />
              </div>
              {b.caption && (
                <figcaption className="mt-3 px-2 t-micro text-body">
                  {b.caption}
                </figcaption>
              )}
            </figure>
          )}

          {b.kind === "duo" && (
            <figure className="p-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="overflow-hidden bg-mute">
                  <Img src={b.left} alt={b.leftAlt} />
                </div>
                <div className="overflow-hidden bg-mute">
                  <Img src={b.right} alt={b.rightAlt} />
                </div>
              </div>
              {b.caption && (
                <figcaption className="mt-3 px-2 t-micro text-body">
                  {b.caption}
                </figcaption>
              )}
            </figure>
          )}

          {b.kind === "section" && (
            <div className="px-6 md:px-12 py-12 md:py-16 flex flex-col gap-5 max-w-[72ch]">
              {b.eyebrow && (
                <div className="t-micro text-body">{b.eyebrow}</div>
              )}
              <h3 className="t-title text-ink">{b.heading}</h3>
              {b.body && (
                <p className="t-lead text-strong whitespace-pre-line">
                  {b.body}
                </p>
              )}
            </div>
          )}
        </BlockFrame>
      ))}
    </div>
  );
}
