"use client";

import { motion } from "framer-motion";
import { Reveal } from "./motion/reveal";
import { ProjectThumb } from "./project-thumb";
import { MediaAsset } from "./media-asset";
import { EASE_OUT_EXPO } from "./motion/easing";
import { Frame } from "./motion/frame";
import type { PlaygroundItem } from "@/lib/types";

/**
 * Boards are 16:9 and this panel is taller. Cloudinary pads the image out
 * with its own edge colour, so the panel can cover-fit without cropping
 * the board itself.
 */
function padToPanel(url: string) {
  return url.includes("res.cloudinary.com") && url.includes("/image/upload/")
    ? url.replace("/image/upload/", "/image/upload/c_pad,b_auto:border,w_1400,h_1600,f_auto,q_auto/")
    : url;
}

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
                  Side projects and experiments, designed and built end to
                  end. Live products, prototypes and ideas still taking shape.
                </p>
              </Reveal>
            </div>

            {tiles.length > 0 ? (
              <TileGrid items={tiles} />
            ) : featured ? (
              // A single project: tell its story here instead of an empty grid.
              <div className="p-8 md:p-10 flex flex-col gap-5 flex-1 justify-end">
                <div className="flex items-center justify-between t-micro">
                  <span className="text-mute tabular-nums">{featured.date}</span>
                  <span className="text-strong">{featured.name} | {featured.label}</span>
                </div>
                {featured.description && (
                  <p className="t-body text-strong max-w-[528px]">{featured.description}</p>
                )}
                <div className="flex flex-wrap gap-x-6 gap-y-2 t-nav">
                  {featured.liveUrl && (
                    <a href={featured.liveUrl} target="_blank" rel="noopener noreferrer" data-cursor="zoom" className="text-ink hover:underline">
                      VIEW LIVE ↗
                    </a>
                  )}
                  <a href="/playground" data-cursor="zoom" className="text-body hover:text-ink">
                    SEE THE PLAYGROUND →
                  </a>
                </div>
              </div>
            ) : null}
          </div>

          <a
            href={featured?.liveUrl || "/playground"}
            {...(featured?.liveUrl ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            aria-label={featured ? `${featured.name} — ${featured.liveUrl ? "view live" : "open the playground"}` : "Open the playground"}
            data-cursor="zoom"
            className="group p-2 flex outline-none focus-visible:ring-1 focus-visible:ring-ink"
          >
            <motion.div
              className="thumb w-full min-h-[360px] relative overflow-hidden"
              initial={{ scale: 1.08 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 1.2, ease: EASE_OUT_EXPO }}
            >
              {featured && (
                <div className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]">
                  <MediaAsset
                    kind={featured.mediaKind}
                    url={padToPanel(featured.mediaUrl)}
                    poster={featured.posterUrl}
                    alt={featured.name}
                  />
                </div>
              )}
              <span
                aria-hidden
                className="absolute top-3 right-3 h-9 w-9 rounded-full bg-paper text-ink flex items-center justify-center opacity-0 scale-75 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100"
              >
                ↗
              </span>
            </motion.div>
          </a>
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
            href="/playground"
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
              href="/playground"
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
