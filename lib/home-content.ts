import { getDb } from "./db";
import { randomUUID } from "node:crypto";
import type {
  HeroProject,
  HeroProjectInput,
  PlaygroundItem,
  PlaygroundItemInput,
  Recommendation,
  RecommendationInput,
  MediaKind,
} from "./types";

/**
 * Repositories for the three home-page CMS entities — hero projects,
 * playground items, recommendations. All three live in this single file
 * because they share the same shape (small, flat rows ordered by
 * display_order) and reusing the helpers keeps the boilerplate down.
 */

/* -------------------------------------------------------------------------- */
/* Shared helpers                                                             */
/* -------------------------------------------------------------------------- */

function now(): string {
  return new Date().toISOString();
}

function normalizeMediaKind(raw: unknown): MediaKind {
  const v = String(raw ?? "").toLowerCase();
  if (v === "video" || v === "gif") return v;
  return "image";
}

/**
 * Returns the next display_order for a table — the maximum existing
 * value + 1, or 0 if the table is empty. Keeps new rows appended to the
 * end without the admin having to pick an order manually.
 */
function nextOrder(table: string): number {
  const row = getDb()
    .prepare(`SELECT COALESCE(MAX(display_order), -1) + 1 AS n FROM ${table}`)
    .get() as { n: number };
  return row.n;
}

/* -------------------------------------------------------------------------- */
/* Hero projects                                                              */
/* -------------------------------------------------------------------------- */

type HeroRow = {
  id: string;
  year: string;
  name: string;
  discipline: string;
  media_kind: string;
  media_url: string;
  poster_url: string;
  case_study_id: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
};

function heroFromRow(r: HeroRow): HeroProject {
  return {
    id: r.id,
    year: r.year,
    name: r.name,
    discipline: r.discipline,
    mediaKind: normalizeMediaKind(r.media_kind),
    mediaUrl: r.media_url,
    posterUrl: r.poster_url,
    caseStudyId: r.case_study_id,
    displayOrder: r.display_order,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

export function listHeroProjects(): HeroProject[] {
  const rows = getDb()
    .prepare(
      `SELECT * FROM hero_projects
       ORDER BY display_order ASC, created_at ASC`,
    )
    .all() as HeroRow[];
  return rows.map(heroFromRow);
}

export function getHeroProject(id: string): HeroProject | null {
  const row = getDb()
    .prepare(`SELECT * FROM hero_projects WHERE id = ?`)
    .get(id) as HeroRow | undefined;
  return row ? heroFromRow(row) : null;
}

export function createHeroProject(input: HeroProjectInput): HeroProject {
  const db = getDb();
  const t = now();
  const id = randomUUID();
  const order =
    typeof input.displayOrder === "number" && input.displayOrder >= 0
      ? input.displayOrder
      : nextOrder("hero_projects");

  db.prepare(
    `INSERT INTO hero_projects
       (id, year, name, discipline, media_kind, media_url, poster_url,
        case_study_id, display_order, created_at, updated_at)
     VALUES
       (@id, @year, @name, @discipline, @media_kind, @media_url, @poster_url,
        @case_study_id, @display_order, @created_at, @updated_at)`,
  ).run({
    id,
    year: input.year,
    name: input.name,
    discipline: input.discipline,
    media_kind: normalizeMediaKind(input.mediaKind),
    media_url: input.mediaUrl,
    poster_url: input.posterUrl,
    case_study_id: input.caseStudyId || null,
    display_order: order,
    created_at: t,
    updated_at: t,
  });

  return getHeroProject(id)!;
}

export function updateHeroProject(
  id: string,
  input: HeroProjectInput,
): HeroProject | null {
  const existing = getHeroProject(id);
  if (!existing) return null;

  getDb()
    .prepare(
      `UPDATE hero_projects SET
         year = @year,
         name = @name,
         discipline = @discipline,
         media_kind = @media_kind,
         media_url = @media_url,
         poster_url = @poster_url,
         case_study_id = @case_study_id,
         display_order = @display_order,
         updated_at = @updated_at
       WHERE id = @id`,
    )
    .run({
      id,
      year: input.year,
      name: input.name,
      discipline: input.discipline,
      media_kind: normalizeMediaKind(input.mediaKind),
      media_url: input.mediaUrl,
      poster_url: input.posterUrl,
      case_study_id: input.caseStudyId || null,
      display_order: input.displayOrder,
      updated_at: now(),
    });

  return getHeroProject(id);
}

export function removeHeroProject(id: string): boolean {
  const res = getDb().prepare(`DELETE FROM hero_projects WHERE id = ?`).run(id);
  return res.changes > 0;
}

/**
 * Clone a hero tile. The copy is appended to the end of the grid
 * (displayOrder = -1 triggers `nextOrder` inside create).
 */
export function duplicateHeroProject(id: string): HeroProject | null {
  const existing = getHeroProject(id);
  if (!existing) return null;
  return createHeroProject({
    year: existing.year,
    name: existing.name ? `${existing.name} (Copy)` : "Untitled (Copy)",
    discipline: existing.discipline,
    mediaKind: existing.mediaKind,
    mediaUrl: existing.mediaUrl,
    posterUrl: existing.posterUrl,
    caseStudyId: existing.caseStudyId,
    displayOrder: -1,
  });
}

/**
 * Swaps display_order between the target row and its neighbour in the
 * requested direction. No-ops at the edges. Used by the admin "move up /
 * down" buttons.
 */
export function moveHeroProject(id: string, dir: "up" | "down"): void {
  swapOrder("hero_projects", id, dir);
}

/* -------------------------------------------------------------------------- */
/* Playground items                                                           */
/* -------------------------------------------------------------------------- */

type PlaygroundRow = {
  id: string;
  date: string;
  name: string;
  label: string;
  media_kind: string;
  media_url: string;
  poster_url: string;
  live_url: string;
  display_order: number;
  created_at: string;
  updated_at: string;
};

function playgroundFromRow(r: PlaygroundRow): PlaygroundItem {
  return {
    id: r.id,
    date: r.date,
    name: r.name,
    label: r.label,
    mediaKind: normalizeMediaKind(r.media_kind),
    mediaUrl: r.media_url,
    posterUrl: r.poster_url,
    liveUrl: r.live_url ?? "",
    displayOrder: r.display_order,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

export function listPlaygroundItems(): PlaygroundItem[] {
  const rows = getDb()
    .prepare(
      `SELECT * FROM playground_items
       ORDER BY display_order ASC, created_at ASC`,
    )
    .all() as PlaygroundRow[];
  return rows.map(playgroundFromRow);
}

export function getPlaygroundItem(id: string): PlaygroundItem | null {
  const row = getDb()
    .prepare(`SELECT * FROM playground_items WHERE id = ?`)
    .get(id) as PlaygroundRow | undefined;
  return row ? playgroundFromRow(row) : null;
}

export function createPlaygroundItem(
  input: PlaygroundItemInput,
): PlaygroundItem {
  const db = getDb();
  const t = now();
  const id = randomUUID();
  const order =
    typeof input.displayOrder === "number" && input.displayOrder >= 0
      ? input.displayOrder
      : nextOrder("playground_items");

  db.prepare(
    `INSERT INTO playground_items
       (id, date, name, label, media_kind, media_url, poster_url, live_url,
        display_order, created_at, updated_at)
     VALUES
       (@id, @date, @name, @label, @media_kind, @media_url, @poster_url, @live_url,
        @display_order, @created_at, @updated_at)`,
  ).run({
    id,
    date: input.date,
    name: input.name,
    label: input.label,
    media_kind: normalizeMediaKind(input.mediaKind),
    media_url: input.mediaUrl,
    poster_url: input.posterUrl,
    live_url: input.liveUrl ?? "",
    display_order: order,
    created_at: t,
    updated_at: t,
  });

  return getPlaygroundItem(id)!;
}

export function updatePlaygroundItem(
  id: string,
  input: PlaygroundItemInput,
): PlaygroundItem | null {
  const existing = getPlaygroundItem(id);
  if (!existing) return null;

  getDb()
    .prepare(
      `UPDATE playground_items SET
         date = @date,
         name = @name,
         label = @label,
         media_kind = @media_kind,
         media_url = @media_url,
         poster_url = @poster_url,
         live_url = @live_url,
         display_order = @display_order,
         updated_at = @updated_at
       WHERE id = @id`,
    )
    .run({
      id,
      date: input.date,
      name: input.name,
      label: input.label,
      media_kind: normalizeMediaKind(input.mediaKind),
      media_url: input.mediaUrl,
      poster_url: input.posterUrl,
      live_url: input.liveUrl ?? "",
      display_order: input.displayOrder,
      updated_at: now(),
    });

  return getPlaygroundItem(id);
}

export function removePlaygroundItem(id: string): boolean {
  const res = getDb()
    .prepare(`DELETE FROM playground_items WHERE id = ?`)
    .run(id);
  return res.changes > 0;
}

export function duplicatePlaygroundItem(id: string): PlaygroundItem | null {
  const existing = getPlaygroundItem(id);
  if (!existing) return null;
  return createPlaygroundItem({
    date: existing.date,
    name: existing.name ? `${existing.name} (Copy)` : "Untitled (Copy)",
    label: existing.label,
    mediaKind: existing.mediaKind,
    mediaUrl: existing.mediaUrl,
    posterUrl: existing.posterUrl,
    liveUrl: existing.liveUrl,
    displayOrder: -1,
  });
}

export function movePlaygroundItem(id: string, dir: "up" | "down"): void {
  swapOrder("playground_items", id, dir);
}

/* -------------------------------------------------------------------------- */
/* Recommendations                                                            */
/* -------------------------------------------------------------------------- */

type RecommendationRow = {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar_url: string;
  display_order: number;
  created_at: string;
  updated_at: string;
};

function recFromRow(r: RecommendationRow): Recommendation {
  return {
    id: r.id,
    quote: r.quote,
    author: r.author,
    role: r.role,
    company: r.company,
    avatarUrl: r.avatar_url,
    displayOrder: r.display_order,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

export function listRecommendations(): Recommendation[] {
  const rows = getDb()
    .prepare(
      `SELECT * FROM recommendations
       ORDER BY display_order ASC, created_at ASC`,
    )
    .all() as RecommendationRow[];
  return rows.map(recFromRow);
}

export function getRecommendation(id: string): Recommendation | null {
  const row = getDb()
    .prepare(`SELECT * FROM recommendations WHERE id = ?`)
    .get(id) as RecommendationRow | undefined;
  return row ? recFromRow(row) : null;
}

export function createRecommendation(
  input: RecommendationInput,
): Recommendation {
  const db = getDb();
  const t = now();
  const id = randomUUID();
  const order =
    typeof input.displayOrder === "number" && input.displayOrder >= 0
      ? input.displayOrder
      : nextOrder("recommendations");

  db.prepare(
    `INSERT INTO recommendations
       (id, quote, author, role, company, avatar_url,
        display_order, created_at, updated_at)
     VALUES
       (@id, @quote, @author, @role, @company, @avatar_url,
        @display_order, @created_at, @updated_at)`,
  ).run({
    id,
    quote: input.quote,
    author: input.author,
    role: input.role,
    company: input.company,
    avatar_url: input.avatarUrl,
    display_order: order,
    created_at: t,
    updated_at: t,
  });

  return getRecommendation(id)!;
}

export function updateRecommendation(
  id: string,
  input: RecommendationInput,
): Recommendation | null {
  const existing = getRecommendation(id);
  if (!existing) return null;

  getDb()
    .prepare(
      `UPDATE recommendations SET
         quote = @quote,
         author = @author,
         role = @role,
         company = @company,
         avatar_url = @avatar_url,
         display_order = @display_order,
         updated_at = @updated_at
       WHERE id = @id`,
    )
    .run({
      id,
      quote: input.quote,
      author: input.author,
      role: input.role,
      company: input.company,
      avatar_url: input.avatarUrl,
      display_order: input.displayOrder,
      updated_at: now(),
    });

  return getRecommendation(id);
}

export function removeRecommendation(id: string): boolean {
  const res = getDb()
    .prepare(`DELETE FROM recommendations WHERE id = ?`)
    .run(id);
  return res.changes > 0;
}

export function duplicateRecommendation(id: string): Recommendation | null {
  const existing = getRecommendation(id);
  if (!existing) return null;
  return createRecommendation({
    quote: existing.quote,
    author: existing.author ? `${existing.author} (Copy)` : "Author (Copy)",
    role: existing.role,
    company: existing.company,
    avatarUrl: existing.avatarUrl,
    displayOrder: -1,
  });
}

export function moveRecommendation(id: string, dir: "up" | "down"): void {
  swapOrder("recommendations", id, dir);
}

/* -------------------------------------------------------------------------- */
/* Reorder helper                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Swap display_order between the target row and its neighbour. Wrapped
 * in a transaction so we never end up with two rows sharing an order.
 */
function swapOrder(table: string, id: string, dir: "up" | "down"): void {
  const db = getDb();
  const target = db
    .prepare(`SELECT id, display_order FROM ${table} WHERE id = ?`)
    .get(id) as { id: string; display_order: number } | undefined;
  if (!target) return;

  const neighbour = db
    .prepare(
      dir === "up"
        ? `SELECT id, display_order FROM ${table}
             WHERE display_order < ?
             ORDER BY display_order DESC LIMIT 1`
        : `SELECT id, display_order FROM ${table}
             WHERE display_order > ?
             ORDER BY display_order ASC LIMIT 1`,
    )
    .get(target.display_order) as
    | { id: string; display_order: number }
    | undefined;

  if (!neighbour) return;

  const swap = db.transaction(() => {
    db.prepare(`UPDATE ${table} SET display_order = ? WHERE id = ?`).run(
      neighbour.display_order,
      target.id,
    );
    db.prepare(`UPDATE ${table} SET display_order = ? WHERE id = ?`).run(
      target.display_order,
      neighbour.id,
    );
  });
  swap();
}
