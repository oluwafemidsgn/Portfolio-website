import { getDb } from "./db";
import { create, getBySlug } from "./case-studies";
import {
  createHeroProject,
  createPlaygroundItem,
  createRecommendation,
  listHeroProjects,
  listPlaygroundItems,
  listRecommendations,
} from "./home-content";
import type {
  AccordionItem,
  Block,
  CaseStudyInput,
  HeroProjectInput,
  PlaygroundItemInput,
  RecommendationInput,
} from "./types";
import { randomUUID } from "node:crypto";

/**
 * Seeds the case-study table with a catalog that mirrors the home-page
 * project grid (12 entries, LUMEN → SIGNAL). First three entries are
 * "featured" — they carry a full long-read case-study body so at least a
 * few studies show how the 30/70 layout reads when it's actually loaded
 * up. The remainder are lighter but still published.
 *
 * Idempotent: seeds any slug that isn't already in the DB. Edits you
 * make in the admin are preserved — we never overwrite an existing row.
 */

const id = () => randomUUID();

const acc = (title: string, body: string): AccordionItem => ({
  id: id(),
  title,
  body,
});

const full = (caption?: string): Block => ({
  id: id(),
  kind: "full",
  image: "",
  alt: "",
  caption,
});

const duo = (caption?: string): Block => ({
  id: id(),
  kind: "duo",
  left: "",
  right: "",
  leftAlt: "",
  rightAlt: "",
  caption,
});

const section = (
  eyebrow: string,
  heading: string,
  body?: string,
): Block => ({
  id: id(),
  kind: "section",
  eyebrow,
  heading,
  body,
});

/* -------------------------------------------------------------------------- */
/* Featured — long-read case studies                                          */
/* -------------------------------------------------------------------------- */

const LUMEN: CaseStudyInput = {
  title: "Lumen",
  slug: "lumen",
  subtitle:
    "A quiet identity for a not-so-quiet furniture maker working across lighting, ceramics, and acoustic textiles.",
  client: "Lumen Studio",
  role: "Brand designer",
  year: "2025",
  type: "Brand identity",
  coverImage: "",
  overview:
    "Lumen makes light fixtures that double as objects. We rebuilt the identity around that dual life — typography that feels industrial on a spec sheet, soft on a domestic wall — and then ran the system through three product lines without breaking stride.",
  accordion: [
    acc(
      "Challenge",
      "The old mark leaned hard into 'designer lamp' tropes. It read more showroom than studio, and didn't leave room for the newer ceramic and acoustic lines coming in 2025.",
    ),
    acc(
      "Approach",
      "Strip the wordmark to its bones. Build a secondary mark — a soft disc — that can act as lens flare, spec-sheet bullet, or a standalone signature depending on the canvas.",
    ),
    acc(
      "Process",
      "Four weeks of sketching. Two weeks of typography. Two weeks in Blender prototyping the disc mark as a physical lens shape to make sure it survived the jump from 2D to product-photography reality.",
    ),
    acc(
      "Craft",
      "Every glyph was redrawn — the N, U, and M got the most attention. The final wordmark sits somewhere between Univers and a more architectural feeling I can't quite name yet.",
    ),
    acc(
      "Impact",
      "Identity now carries across lighting, ceramics, and the forthcoming textile line without re-branding any sub-line. Store-front sign read as 'the same company' within two weeks of rollout.",
    ),
  ],
  blocks: [
    full("Primary mark, final lockup."),
    section(
      "01 · CONTEXT",
      "A workshop, not a showroom.",
      "Lumen started in a converted mechanic's garage in Lagos in 2019. The original identity was built quickly, in an afternoon, by one of the founders. It did its job for five years. By the time the ceramics line was announced, the mark had become a polite ceiling — holding the studio up while quietly keeping it small.",
    ),
    duo("Wordmark studies — early exploration."),
    full("Disc mark, iterated across fourteen weights."),
    section(
      "02 · IDENTITY SYSTEM",
      "One mark, three temperatures.",
      "We built the system around a single disc mark that behaves like a material rather than a graphic. On a spec sheet it's a bullet. In product photography it's the lens flare of an actual fixture. In signage it's cut as a physical aluminum plate. Same geometry every time, different afterlife.",
    ),
    duo("Spec sheet / store-front treatments."),
    full("Color system in context — lighting line."),
    full("Color system in context — ceramics line."),
    section(
      "03 · TYPE",
      "Industrial with a soft hand.",
      "The wordmark and the product marque share a single type family — a custom cut loosely based on Univers that we thickened where it needed presence and softened where it needed warmth. The tabular numerals survived every round of feedback. They always do.",
    ),
    duo("Typography specimen — display vs. body."),
    full("Store-front installation."),
    section(
      "04 · MOTION",
      "A signature that breathes.",
      "For digital surfaces we built a 400ms idle animation where the disc mark subtly pulses its inner radius. It makes the mark feel like a bulb that's on rather than a shape that's been drawn. Nobody will consciously notice it. Everyone will subconsciously remember it.",
    ),
    full("Motion stills — idle loop."),
  ],
  status: "published",
};

const ARCHIA: CaseStudyInput = {
  title: "Archia",
  slug: "archia",
  subtitle:
    "A portfolio for an architecture practice that doesn't act like one — a reading room for small, strange civic work.",
  client: "Archia",
  role: "Designer · Developer",
  year: "2025",
  type: "Web design",
  coverImage: "",
  overview:
    "Archia builds small, strange civic things — a library in a laundromat, a park in a parking lot, a bus stop with a poem printed on the back. The site needed to feel more like a reading room than a brochure, so we built it that way: text first, images earned.",
  accordion: [
    acc(
      "Challenge",
      "Every other architecture site is giant hero images and zero reading. Archia had real stories to tell and no patience for the portfolio template.",
    ),
    acc(
      "Approach",
      "A text-first layout with a single hairline grid. Projects live as essays, not galleries. Images are earned — they arrive mid-paragraph when the writing actually calls for them.",
    ),
    acc(
      "Process",
      "Two days of writing with the founder before any pixels moved. That conversation set the tone — we weren't designing a website, we were setting the margins of a book.",
    ),
    acc(
      "Impact",
      "Average session duration jumped from 0:48 to 4:12 in the first two months post-launch. Three of the five largest commissions in 2025 came through the site.",
    ),
  ],
  blocks: [
    full("Home — the reading room view."),
    section(
      "01 · PREMISE",
      "Stop selling, start telling.",
      "The brief arrived with a deck full of competitor sites. All of them opened with a silent autoplay video of a building being built. We closed the deck and started talking about the projects themselves. Every single one had a story the existing site wasn't telling.",
    ),
    duo("Before / after — a single project page."),
    full("Editorial templates — light and dark."),
    section(
      "02 · TYPOGRAPHY",
      "A grid you read, not look at.",
      "Type is the product. We set the body copy in a single size (17px/1.5) across every page and resisted every temptation to vary it. The grid is held together by hairlines alone — no shadows, no background color shifts. Just ink on paper, scaled for a screen.",
    ),
    duo("Project essay — mid-scroll, desktop."),
    full("Project index — responsive behaviour."),
    section(
      "03 · INTERACTION",
      "Quiet, on purpose.",
      "There are exactly two animations on the whole site: a one-time page-load curtain, and a subtle chapter-marker that slides into the margin as you scroll past a heading. Both are there to help you read, not to advertise that we built this.",
    ),
    duo("Mobile — project page vs. index."),
    full("Dark mode — automatic, respects system preference."),
  ],
  status: "published",
};

const FORM_STUDIO: CaseStudyInput = {
  title: "Form Studio",
  slug: "form-studio",
  subtitle:
    "A motion system for a design studio's 2024 reel — built around a single geometric primitive that could bend without breaking.",
  client: "Form Studio",
  role: "Motion designer",
  year: "2024",
  type: "Motion",
  coverImage: "",
  overview:
    "Form needed a three-minute reel for their 2024 relaunch. Instead of a greatest-hits cutdown, we built a single motion language — one geometric primitive, one easing curve, one color system — and then used it to rewrite every sequence in the reel from scratch.",
  accordion: [
    acc(
      "Challenge",
      "Reel montages usually feel like stock car ads set to boring electronic music. Form wanted a reel that read like a short film with a thesis.",
    ),
    acc(
      "Approach",
      "Start with a primitive — in this case, a circle that folds — and build every scene as a variation on it. One mark, thirty performances.",
    ),
    acc(
      "Technical",
      "Everything rendered in Blender at 30fps, then post-processed in After Effects for grain, chromatic aberration, and a single custom LUT that leans about 5% warmer than neutral.",
    ),
  ],
  blocks: [
    full("Opening frame — the primitive, unfolded."),
    section(
      "01 · PRIMITIVE",
      "One shape, thirty performances.",
      "The primitive is a 2D circle with a single fold line running through it at 27.3°. That angle is the only constant across the reel. Every other dimension — scale, color, thickness, rotation — varies scene to scene.",
    ),
    duo("Primitive in context — two sequences."),
    full("Process — Blender viewport."),
    section(
      "02 · EASING",
      "One curve for every transition.",
      "A modified quintic ease-out, with the end slightly overshot and pulled back. It's the closest approximation to the feeling of a door just barely closing on its own weight. Every cut in the reel is timed to that curve.",
    ),
    full("Key frames — pulled at regular intervals."),
  ],
  status: "published",
};

/* -------------------------------------------------------------------------- */
/* Catalog — lighter studies, still published                                 */
/* -------------------------------------------------------------------------- */

const NOIR: CaseStudyInput = {
  title: "Noir",
  slug: "noir",
  subtitle: "A 3D campaign built entirely in Blender for a footwear release.",
  client: "Noir Agency",
  role: "3D direction",
  year: "2024",
  type: "3D direction",
  coverImage: "",
  overview:
    "Noir needed a campaign visual that felt less 'render' and more 'photograph'. Three weeks, one model, a very patient cycles farm.",
  accordion: [
    acc(
      "Process",
      "Started with reference from 1970s Polaroid SX-70 shots. Baked the grain into the texture step rather than layering it on after — it survives compression in a way post-grain never does.",
    ),
    acc(
      "Outcome",
      "Campaign ran across four cities. Zero retouching post-render — every hero still is straight out of Blender.",
    ),
  ],
  blocks: [
    full("Campaign key-art — primary."),
    duo("Alt shots — cinema display."),
    full("Behind the scenes — Blender viewport."),
    section(
      "01 · NOTES",
      "Photograph, not render.",
      "The whole job was spent chasing the specific flatness of 70s Polaroid film. Grain is the trick. Everything else is in service of it.",
    ),
    full("Print detail — city-wall installation."),
  ],
  status: "published",
};

const PARAGON: CaseStudyInput = {
  title: "Paragon",
  slug: "paragon",
  subtitle: "Identity for a small-business lender that wanted to look less like a bank.",
  client: "Paragon",
  role: "Brand designer",
  year: "2024",
  type: "Brand identity",
  coverImage: "",
  overview:
    "Paragon lends to small businesses across West Africa. They came in tired of looking like a bank — all blue, all gradient, all serif-and-swoop. We rebuilt the identity around a single angular monogram and a color system that leans more textile than fintech.",
  accordion: [
    acc(
      "Challenge",
      "Banking competitors all look the same. Paragon's customers are bakers and tailors, not CFOs.",
    ),
    acc(
      "Approach",
      "Treat it like a textile brand, not a financial one. Woven color, angular mark, editorial photography of actual customers.",
    ),
    acc(
      "Impact",
      "Customer acquisition cost dropped 34% in the two quarters after launch.",
    ),
  ],
  blocks: [
    full("Primary monogram."),
    duo("Color system — woven samples."),
    section(
      "01 · MONOGRAM",
      "One letter, many angles.",
      "The P is the whole identity. It carries the color system, the photography crop, and eventually the mobile app icon. Everything else reports to it.",
    ),
    full("Application — branch signage."),
    duo("Mobile app — account vs. application flow."),
  ],
  status: "published",
};

const METRIC: CaseStudyInput = {
  title: "Metric",
  slug: "metric",
  subtitle: "A focused dashboard for a team that measures too many things.",
  client: "Metric",
  role: "Product designer",
  year: "2024",
  type: "Product design",
  coverImage: "",
  overview:
    "Metric is a B2B analytics tool that had grown 47 chart types across seven years. We shipped a redesign that cut that to 9 and made the rest feel less like flags on a cruise ship.",
  accordion: [
    acc(
      "Challenge",
      "Feature-creep. Every chart had a customer who'd asked for it, and nobody wanted to be the PM who killed one.",
    ),
    acc(
      "Approach",
      "Audit, consolidate, rename. Nine charts, every one re-earned its place.",
    ),
  ],
  blocks: [
    full("Dashboard — after."),
    duo("Before / after — single chart comparison."),
    full("Chart system — specimen sheet."),
  ],
  status: "published",
};

const ORBIT: CaseStudyInput = {
  title: "Orbit",
  slug: "orbit",
  subtitle: "Brand + packaging for a cold-brew coffee subscription.",
  client: "Orbit",
  role: "Brand designer",
  year: "2024",
  type: "Visual design",
  coverImage: "",
  overview:
    "Orbit ships a different cold-brew blend every month. The identity needed to hold across twelve variants per year without buckling.",
  accordion: [
    acc(
      "Approach",
      "A modular label system — fixed mark, variable back panel. Each month's blend gets its own color, typography pass, and origin story printed like a record sleeve.",
    ),
  ],
  blocks: [
    full("Packaging — three-month shelf."),
    duo("Label system — January vs. July."),
    full("Shipping box — interior print."),
    section(
      "01 · SYSTEM",
      "A record sleeve for coffee.",
      "Each label reads like a B-side sleeve — small type, generous margins, a short essay on the origin farm printed on the back. Customers have started collecting them.",
    ),
    duo("Collected labels — customer submissions."),
  ],
  status: "published",
};

const ECHO: CaseStudyInput = {
  title: "Echo",
  slug: "echo",
  subtitle: "A marketing site for a podcast network specializing in long-form interviews.",
  client: "Echo",
  role: "Designer · Developer",
  year: "2023",
  type: "Web design",
  coverImage: "",
  overview:
    "Echo hosts 30 shows, some of them two hours long. The old site treated every episode the same way. The new site treats each show like its own publication.",
  accordion: [
    acc(
      "Approach",
      "Show-level theming — each of the 30 shows picks its own typography and color from a constrained palette. Episode pages inherit the show's visual language.",
    ),
  ],
  blocks: [
    full("Network home — all 30 shows."),
    duo("Show page — two different shows, same grid."),
    full("Episode page — long-form reading experience."),
  ],
  status: "published",
};

const VESPER: CaseStudyInput = {
  title: "Vesper",
  slug: "vesper",
  subtitle: "A quiet mark for a small natural-wine importer.",
  client: "Vesper",
  role: "Brand designer",
  year: "2023",
  type: "Brand identity",
  coverImage: "",
  overview:
    "Vesper imports natural wine from five producers in the Loire Valley. The identity had to feel less like a wine brand and more like a letterpress print shop that happens to sell wine.",
  accordion: [
    acc(
      "Approach",
      "A hand-drawn wordmark, a restrained palette of three colors borrowed from the actual wine labels, and a tiny set of icons that only appear on invoices and packing slips.",
    ),
  ],
  blocks: [
    full("Primary wordmark."),
    duo("Label — white vs. red."),
    full("Packing slip — an unsung surface."),
  ],
  status: "published",
};

const ATLAS: CaseStudyInput = {
  title: "Atlas",
  slug: "atlas",
  subtitle: "Motion identity for a travel magazine going quarterly in print.",
  client: "Atlas Quarterly",
  role: "Motion designer",
  year: "2023",
  type: "Motion",
  coverImage: "",
  overview:
    "Atlas was born online but moved to print in 2023. We built the motion identity that bridges the two — a single animation system that scales from a tiny social reel to a full-screen cover teaser.",
  accordion: [
    acc(
      "Approach",
      "One easing curve, one typography rule, three scales. Everything else is content.",
    ),
  ],
  blocks: [
    full("Cover reveal — full-screen."),
    duo("Social cutdowns — 1:1 and 9:16."),
    full("Print-to-motion handoff."),
  ],
  status: "published",
};

const PRISM: CaseStudyInput = {
  title: "Prism",
  slug: "prism",
  subtitle: "3D direction for a product launch teaser — one 15-second loop.",
  client: "Prism",
  role: "3D direction",
  year: "2023",
  type: "3D direction",
  coverImage: "",
  overview:
    "Fifteen seconds. One object. One light. Six weeks. The brief was 'make it feel inevitable' and we spent the entire schedule figuring out what that meant.",
  accordion: [
    acc(
      "Notes",
      "The final object is a single NURBS surface with one animated subdivision modifier. That's it. Everything interesting is in the lighting.",
    ),
  ],
  blocks: [
    full("Final loop — frame 000."),
    duo("Lighting tests — passes 12 & 47."),
    full("Final loop — frame 180."),
  ],
  status: "published",
};

const SIGNAL: CaseStudyInput = {
  title: "Signal",
  slug: "signal",
  subtitle: "A quiet, typography-heavy site for a small audio archive.",
  client: "Signal Archive",
  role: "Designer · Developer",
  year: "2023",
  type: "Web design",
  coverImage: "",
  overview:
    "Signal is an audio archive of field recordings from across West Africa. The site is mostly text — waveform SVGs, date metadata, transcript links. It's meant to be read, not scrolled past.",
  accordion: [
    acc(
      "Approach",
      "Library-catalog typography. Tabular numerals everywhere. The only interactive element is the play button, which doubles as the timecode.",
    ),
  ],
  blocks: [
    full("Archive index."),
    duo("Single recording — header and transcript."),
    full("Search — the only non-text interaction."),
  ],
  status: "published",
};

/* -------------------------------------------------------------------------- */
/* Ordering matches the home-page catalog rows (most recent first).           */
/* -------------------------------------------------------------------------- */

const ITEMS: CaseStudyInput[] = [
  LUMEN,
  ARCHIA,
  FORM_STUDIO,
  NOIR,
  PARAGON,
  METRIC,
  ORBIT,
  ECHO,
  VESPER,
  ATLAS,
  PRISM,
  SIGNAL,
];

/* -------------------------------------------------------------------------- */
/* Home-page content seeds                                                    */
/*                                                                            */
/* Hero projects mirror the original 12-project home grid one-for-one so the  */
/* published site keeps the same catalog after the CMS cut-over. Case-study   */
/* links are resolved by slug lookup so each tile points at its matching      */
/* long-read when one exists.                                                 */
/* -------------------------------------------------------------------------- */

type HeroSeed = Omit<HeroProjectInput, "caseStudyId" | "displayOrder"> & {
  caseStudySlug: string | null;
};

const HERO_SEEDS: HeroSeed[] = [
  { year: "2025.02", name: "LUMEN",       discipline: "Brand identity",  mediaKind: "image", mediaUrl: "", posterUrl: "", caseStudySlug: "lumen" },
  { year: "2025.01", name: "ARCHIA",      discipline: "Web design",      mediaKind: "image", mediaUrl: "", posterUrl: "", caseStudySlug: "archia" },
  { year: "2024.11", name: "FORM STUDIO", discipline: "Motion",          mediaKind: "image", mediaUrl: "", posterUrl: "", caseStudySlug: "form-studio" },
  { year: "2024.09", name: "NOIR",        discipline: "3D direction",    mediaKind: "image", mediaUrl: "", posterUrl: "", caseStudySlug: "noir" },
  { year: "2024.07", name: "PARAGON",     discipline: "Brand identity",  mediaKind: "image", mediaUrl: "", posterUrl: "", caseStudySlug: "paragon" },
  { year: "2024.05", name: "METRIC",      discipline: "Product design",  mediaKind: "image", mediaUrl: "", posterUrl: "", caseStudySlug: "metric" },
  { year: "2024.03", name: "ORBIT",       discipline: "Visual design",   mediaKind: "image", mediaUrl: "", posterUrl: "", caseStudySlug: "orbit" },
  { year: "2023.12", name: "ECHO",        discipline: "Web design",      mediaKind: "image", mediaUrl: "", posterUrl: "", caseStudySlug: "echo" },
  { year: "2023.10", name: "VESPER",      discipline: "Brand identity",  mediaKind: "image", mediaUrl: "", posterUrl: "", caseStudySlug: "vesper" },
  { year: "2023.07", name: "ATLAS",       discipline: "Motion",          mediaKind: "image", mediaUrl: "", posterUrl: "", caseStudySlug: "atlas" },
  { year: "2023.04", name: "PRISM",       discipline: "3D direction",    mediaKind: "image", mediaUrl: "", posterUrl: "", caseStudySlug: "prism" },
  { year: "2023.02", name: "SIGNAL",      discipline: "Web design",      mediaKind: "image", mediaUrl: "", posterUrl: "", caseStudySlug: "signal" },
];

const PLAYGROUND_SEEDS: Omit<PlaygroundItemInput, "displayOrder">[] = [
  { date: "2025.02", name: "ORBITS",     label: "Experiment", mediaKind: "image", mediaUrl: "", posterUrl: "", liveUrl: "" },
  { date: "2024.12", name: "TYPE STUDY", label: "Experiment", mediaKind: "image", mediaUrl: "", posterUrl: "", liveUrl: "" },
  { date: "2024.10", name: "GRIDS",      label: "Experiment", mediaKind: "image", mediaUrl: "", posterUrl: "", liveUrl: "" },
  { date: "2024.08", name: "RENDER 01",  label: "3D sketch",  mediaKind: "image", mediaUrl: "", posterUrl: "", liveUrl: "" },
];

const RECOMMENDATION_SEEDS: Omit<RecommendationInput, "displayOrder">[] = [
  {
    quote:
      "Oluwafemi sees the whole building before he sketches a window. He shipped an identity system we're still finding new rooms in.",
    author: "Ada Okonkwo",
    role: "Creative Director",
    company: "Lumen Studio",
    avatarUrl: "",
  },
  {
    quote:
      "Three weeks in and the brief was tighter than when we started. That's the real gift — he edits the work and the thinking at the same time.",
    author: "Marcus Bell",
    role: "Founder",
    company: "Archia",
    avatarUrl: "",
  },
  {
    quote:
      "The motion reel turned into a thesis. One curve, one primitive, thirty scenes. I've been quoting it in pitch decks ever since.",
    author: "Sara Lin",
    role: "Executive Producer",
    company: "Form Studio",
    avatarUrl: "",
  },
];

/**
 * Ensures every seed slug exists in the DB. Idempotent: existing rows
 * are left alone so admin edits survive a redeploy.
 *
 * Home-content tables (hero / playground / recommendations) are only
 * seeded when their table is empty — once an admin starts editing,
 * reseeding would fight them.
 */
export function ensureSeed() {
  getDb();
  for (const item of ITEMS) {
    if (!getBySlug(item.slug)) create(item);
  }

  if (listHeroProjects().length === 0) {
    HERO_SEEDS.forEach((seed, i) => {
      const study = seed.caseStudySlug ? getBySlug(seed.caseStudySlug) : null;
      createHeroProject({
        year: seed.year,
        name: seed.name,
        discipline: seed.discipline,
        mediaKind: seed.mediaKind,
        mediaUrl: seed.mediaUrl,
        posterUrl: seed.posterUrl,
        caseStudyId: study?.id ?? null,
        displayOrder: i,
      });
    });
  }

  if (listPlaygroundItems().length === 0) {
    PLAYGROUND_SEEDS.forEach((seed, i) => {
      createPlaygroundItem({ ...seed, displayOrder: i });
    });
  }

  if (listRecommendations().length === 0) {
    RECOMMENDATION_SEEDS.forEach((seed, i) => {
      createRecommendation({ ...seed, displayOrder: i });
    });
  }
}
