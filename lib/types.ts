/**
 * Case-study domain types. These are the shapes the admin reads/writes and
 * the public pages render. Kept deliberately flat so the admin form is
 * straightforward — no nested component trees or rich-text ASTs.
 */

export type BlockKind = "full" | "duo" | "section";

/**
 * A single row in the 70% column of the case-study page.
 *   - "full" is one image that spans the column
 *   - "duo" is two images side-by-side
 *   - "section" is a chapter heading + body copy, used to break the
 *     image stack into narrative passages
 */
export type Block =
  | {
      id: string;
      kind: "full";
      image: string;
      alt?: string;
      caption?: string;
    }
  | {
      id: string;
      kind: "duo";
      left: string;
      right: string;
      leftAlt?: string;
      rightAlt?: string;
      caption?: string;
    }
  | {
      id: string;
      kind: "section";
      /** Small uppercase eyebrow, e.g. "02 · IDENTITY SYSTEM". */
      eyebrow?: string;
      heading: string;
      body?: string;
    };

/** A single expandable row in the 30% sidebar. */
export type AccordionItem = {
  id: string;
  title: string;
  body: string;
};

export type Status = "draft" | "published";

export type CaseStudy = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  client: string;
  role: string;
  year: string;
  /** e.g. "Brand identity", "Web design". Mirrors the home-page thumb label. */
  type: string;
  coverImage: string;
  overview: string;
  accordion: AccordionItem[];
  blocks: Block[];
  status: Status;
  createdAt: string;
  updatedAt: string;
  /** Timestamp when the study first went public. Null if still in draft. */
  publishedAt: string | null;
};

/** Shape used by the admin form. No auto-managed fields. */
export type CaseStudyInput = Omit<
  CaseStudy,
  "id" | "createdAt" | "updatedAt" | "publishedAt"
>;

/* -------------------------------------------------------------------------- */
/* Home-page content                                                          */
/*                                                                            */
/* The home-page hero projects, playground items, and recommendations are all */
/* CMS-managed. Hero + playground share the same media shape (image / video /  */
/* gif) so they reuse one MediaKind union.                                    */
/* -------------------------------------------------------------------------- */

export type MediaKind = "image" | "video" | "gif";

/**
 * A single tile in the home-page projects grid. Optional link to a full
 * case study — when present, clicking the tile opens /projects/[slug].
 */
export type HeroProject = {
  id: string;
  /** e.g. "2025.02" — rendered as shown, no formatting applied. */
  year: string;
  /** Display title (usually uppercase in the UI). */
  name: string;
  /** Small label — "Brand identity", "Motion", "3D direction", etc. */
  discipline: string;
  mediaKind: MediaKind;
  /** URL to the asset. Images, videos, and gifs all use this field. */
  mediaUrl: string;
  /** Optional poster/thumbnail for videos. */
  posterUrl: string;
  /** Optional FK to case_studies.id. NULL = non-clickable tile. */
  caseStudyId: string | null;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type HeroProjectInput = Omit<
  HeroProject,
  "id" | "createdAt" | "updatedAt"
>;

/**
 * A tile in the Playground grid. Simpler than HeroProject — no case-study
 * link, no discipline. Pure sketchbook entries.
 */
export type PlaygroundItem = {
  id: string;
  /** Free-form date label — "2025.02", "Apr 2025", etc. */
  date: string;
  name: string;
  /** Short context label — "Experiment", "3D sketch", etc. */
  label: string;
  mediaKind: MediaKind;
  mediaUrl: string;
  posterUrl: string;
  /**
   * Optional external link to the live experiment — shown as a
   * "VIEW LIVE ↗" button inside the playground modal. If empty,
   * the modal just displays the media + metadata.
   */
  liveUrl: string;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type PlaygroundItemInput = Omit<
  PlaygroundItem,
  "id" | "createdAt" | "updatedAt"
>;

/** A testimonial/quote block for the home page. */
export type Recommendation = {
  id: string;
  quote: string;
  author: string;
  /** e.g. "Creative Director, Lumen Studio". */
  role: string;
  /** Optional — standalone company string if role doesn't include it. */
  company: string;
  /** Optional small portrait URL. */
  avatarUrl: string;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type RecommendationInput = Omit<
  Recommendation,
  "id" | "createdAt" | "updatedAt"
>;
