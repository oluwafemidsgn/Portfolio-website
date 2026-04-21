"use client";

import { motion } from "framer-motion";
import { ProjectThumb } from "./project-thumb";
import { EASE_OUT_EXPO } from "./motion/easing";
import { Frame } from "./motion/frame";
import type { HeroProject } from "@/lib/types";

type Props = {
  tiles: HeroProject[];
  /**
   * Map of caseStudyId → public slug. Resolved on the server so we don't
   * have to ship every case study record to the client just to build a
   * href.
   */
  caseStudyHrefs: Record<string, string>;
};

/**
 * The home-page project grid, now fully driven by the CMS.
 *
 * We chunk the incoming tiles into rows of four so the reveal cascade and
 * the inter-column hairlines still fire with the same rhythm the Figma
 * comp was built around. Tile count is flexible — anything from 1 upward.
 */
export function ProjectsSection({ tiles, caseStudyHrefs }: Props) {
  if (tiles.length === 0) return null;

  const rows: HeroProject[][] = [];
  for (let i = 0; i < tiles.length; i += 4) {
    rows.push(tiles.slice(i, i + 4));
  }

  return (
    <section id="projects" className="page-gutter flex flex-col gap-2">
      {rows.map((row, i) => (
        <Frame key={i} delay={i * 0.06}>
          <div className="grid grid-cols-2 lg:grid-cols-4 grid-col-rules">
            {row.map((tile, j) => {
              const href = tile.caseStudyId
                ? caseStudyHrefs[tile.caseStudyId]
                  ? `/projects/${caseStudyHrefs[tile.caseStudyId]}`
                  : null
                : null;

              return (
                <motion.div
                  key={tile.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.7,
                    ease: EASE_OUT_EXPO,
                    delay: 0.2 + j * 0.06,
                  }}
                >
                  <ProjectThumb
                    date={tile.year}
                    title={tile.name}
                    type={tile.discipline}
                    href={href}
                    media={{
                      kind: tile.mediaKind,
                      url: tile.mediaUrl,
                      poster: tile.posterUrl,
                    }}
                  />
                </motion.div>
              );
            })}
          </div>
        </Frame>
      ))}
    </section>
  );
}
