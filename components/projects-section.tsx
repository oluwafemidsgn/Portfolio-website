"use client";

import { motion } from "framer-motion";
import { ProjectThumb } from "./project-thumb";
import { EASE_OUT_EXPO } from "./motion/easing";
import { Frame } from "./motion/frame";
import type { HeroProject, PlaygroundItem } from "@/lib/types";
import { playgroundSlug } from "@/lib/playground-slug";

type Props = {
  tiles: HeroProject[];
  /**
   * Map of caseStudyId → public slug. Resolved on the server so we don't
   * have to ship every case study record to the client just to build a
   * href.
   */
  caseStudyHrefs: Record<string, string>;
  /** Case studies marked "coming soon" — tiles show a badge, no link. */
  comingSoonIds?: string[];
  /** Side projects shown after the case studies, tagged PLAYGROUND; they open on /playground. */
  playground?: PlaygroundItem[];
};

type Tile = {
  key: string;
  date: string;
  title: string;
  type: string;
  href: string | null;
  comingSoon: boolean;
  badge?: string;
  media: { kind: HeroProject["mediaKind"]; url: string; poster: string };
};

/**
 * The home-page project grid, now fully driven by the CMS.
 *
 * We chunk the incoming tiles into rows of four so the reveal cascade and
 * the inter-column hairlines still fire with the same rhythm the Figma
 * comp was built around. Tile count is flexible — anything from 1 upward.
 */
export function ProjectsSection({ tiles, caseStudyHrefs, comingSoonIds = [], playground = [] }: Props) {
  const withMedia = playground.filter((p) => p.mediaUrl);
  // Playground tiles top the grid up to whole rows of four; the rest live on /playground.
  const spare = (4 - (tiles.length % 4)) % 4;
  const fill = withMedia.length <= spare ? withMedia.length : spare + Math.floor((withMedia.length - spare) / 4) * 4;
  const all: Tile[] = [
    ...tiles.map((tile) => ({
      key: tile.id,
      date: tile.year,
      title: tile.name,
      type: tile.discipline,
      href: tile.caseStudyId && caseStudyHrefs[tile.caseStudyId] ? `/projects/${caseStudyHrefs[tile.caseStudyId]}` : null,
      comingSoon: tile.comingSoon || (!!tile.caseStudyId && comingSoonIds.includes(tile.caseStudyId)),
      media: { kind: tile.mediaKind, url: tile.mediaUrl, poster: tile.posterUrl },
    })),
    ...withMedia
      .slice(0, fill)
      .map((p) => ({
        key: p.id,
        date: p.date,
        title: p.name,
        type: p.label,
        href: `/playground?open=${playgroundSlug(p.name)}`,
        comingSoon: false,
        badge: "PLAYGROUND",
        media: { kind: p.mediaKind, url: p.mediaUrl, poster: p.posterUrl },
      })),
  ];
  if (all.length === 0) return null;

  const rows: Tile[][] = [];
  for (let i = 0; i < all.length; i += 4) {
    rows.push(all.slice(i, i + 4));
  }

  return (
    <section id="projects" className="page-gutter flex flex-col gap-2">
      {rows.map((row, i) => (
        <Frame key={i} delay={i * 0.06}>
          <div className="grid grid-cols-2 lg:grid-cols-4 grid-col-rules">
            {row.map((tile, j) => (
              <motion.div
                key={tile.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, ease: EASE_OUT_EXPO, delay: 0.2 + j * 0.06 }}
              >
                <ProjectThumb
                  date={tile.date}
                  title={tile.title}
                  type={tile.type}
                  href={tile.href}
                  comingSoon={tile.comingSoon}
                  badge={tile.badge}
                  media={tile.media}
                />
              </motion.div>
            ))}
          </div>
        </Frame>
      ))}
    </section>
  );
}
