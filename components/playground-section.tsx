"use client";

import { motion } from "framer-motion";
import { Reveal } from "./motion/reveal";
import { ProjectThumb } from "./project-thumb";
import { MediaAsset } from "./media-asset";
import { EASE_OUT_EXPO } from "./motion/easing";
import { Frame } from "./motion/frame";
import type { PlaygroundItem } from "@/lib/types";

type Props = {
  items: PlaygroundItem[];
};

/**
 * Playground grid on the home page. The left column stacks the title,
 * description, and a 2-by-2 tile grid of CMS-managed items. The right
 * column surfaces the first item as a large "featured" panel — when
 * there are no items we fall back to a neutral placeholder so the
 * section still renders cleanly on an empty CMS.
 */
export function PlaygroundSection({ items }: Props) {
  // First item is the featured panel on the right; next four fill the
  // 2-by-2 grid on the left. Extra items roll off quietly — intentional,
  // since the section isn't meant to be an index.
  const [featured, ...rest] = items;
  const tiles = rest.slice(0, 4);

  return (
    <section id="playground" className="page-gutter">
      <Frame>
        <div className="grid grid-cols-1 lg:grid-cols-2 grid-col-rules">
          <div className="flex flex-col">
            <div className="p-8 md:p-10 rule-h">
              <Reveal delay={0.05}>
                <h2 className="t-title text-ink">Playground</h2>
              </Reveal>
              <Reveal delay={0.15}>
                <p className="mt-6 t-body text-body max-w-[528px]">
                  Experiments across 3D, motion, and visual design. A
                  sketchbook for ideas that don&apos;t fit anywhere else —
                  yet.
                </p>
              </Reveal>
            </div>

            {tiles.length > 0 ? (
              <TileGrid items={tiles} />
            ) : (
              <div className="p-8 md:p-10 t-body text-body">
                No experiments pinned yet.
              </div>
            )}
          </div>

          <div className="p-2 flex">
            <motion.div
              className="thumb w-full min-h-[360px] relative overflow-hidden"
              initial={{ scale: 1.08 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 1.2, ease: EASE_OUT_EXPO }}
            >
              {featured && (
                <MediaAsset
                  kind={featured.mediaKind}
                  url={featured.mediaUrl}
                  poster={featured.posterUrl}
                  alt={featured.name}
                />
              )}
            </motion.div>
          </div>
        </div>
      </Frame>
    </section>
  );
}

function TileGrid({ items }: { items: PlaygroundItem[] }) {
  // Split into two rows of up to two tiles so the second row gets its
  // own hairline (matches the original Figma rhythm).
  const topRow = items.slice(0, 2);
  const bottomRow = items.slice(2, 4);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 grid-col-rules">
        {topRow.map((p) => (
          <ProjectThumb
            key={p.id}
            date={p.date}
            title={p.name}
            type={p.label}
            media={{
              kind: p.mediaKind,
              url: p.mediaUrl,
              poster: p.posterUrl,
            }}
          />
        ))}
      </div>
      {bottomRow.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 grid-col-rules rule-h">
          {bottomRow.map((p) => (
            <ProjectThumb
              key={p.id}
              date={p.date}
              title={p.name}
              type={p.label}
              media={{
                kind: p.mediaKind,
                url: p.mediaUrl,
                poster: p.posterUrl,
              }}
            />
          ))}
        </div>
      )}
    </>
  );
}
