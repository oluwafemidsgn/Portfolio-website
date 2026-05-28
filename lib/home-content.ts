import { getReadyDb } from "./db";
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

function now(): string {
  return new Date().toISOString();
}

function normalizeMediaKind(raw: unknown): MediaKind {
  const v = String(raw ?? "").toLowerCase();
  if (v === "video" || v === "gif") return v;
  return "image";
}

async function nextOrder(table: string): Promise<number> {
  const db = await getReadyDb();
  const result = await db.execute({
    sql: `SELECT COALESCE(MAX(display_order), -1) + 1 AS n FROM ${table}`,
    args: [],
  });
  const row = result.rows[0] as unknown as { n: number };
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

export async function listHeroProjects(): Promise<HeroProject[]> {
  const db = await getReadyDb();
  const result = await db.execute({
    sql: `SELECT * FROM hero_projects ORDER BY display_order ASC, created_at ASC`,
    args: [],
  });
  return (result.rows as unknown as HeroRow[]).map(heroFromRow);
}

export async function getHeroProject(id: string): Promise<HeroProject | null> {
  const db = await getReadyDb();
  const result = await db.execute({
    sql: `SELECT * FROM hero_projects WHERE id = ?`,
    args: [id],
  });
  const row = result.rows[0] as unknown as HeroRow | undefined;
  return row ? heroFromRow(row) : null;
}

export async function createHeroProject(
  input: HeroProjectInput,
): Promise<HeroProject> {
  const db = await getReadyDb();
  const t = now();
  const id = randomUUID();
  const order =
    typeof input.displayOrder === "number" && input.displayOrder >= 0
      ? input.displayOrder
      : await nextOrder("hero_projects");

  await db.execute({
    sql: `INSERT INTO hero_projects
       (id, year, name, discipline, media_kind, media_url, poster_url,
        case_study_id, display_order, created_at, updated_at)
     VALUES
       (@id, @year, @name, @discipline, @media_kind, @media_url, @poster_url,
        @case_study_id, @display_order, @created_at, @updated_at)`,
    args: {
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
    },
  });

  return (await getHeroProject(id))!;
}

export async function updateHeroProject(
  id: string,
  input: HeroProjectInput,
): Promise<HeroProject | null> {
  const existing = await getHeroProject(id);
  if (!existing) return null;

  const db = await getReadyDb();
  await db.execute({
    sql: `UPDATE hero_projects SET
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
    args: {
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
    },
  });

  return getHeroProject(id);
}

export async function removeHeroProject(id: string): Promise<boolean> {
  const db = await getReadyDb();
  const result = await db.execute({
    sql: `DELETE FROM hero_projects WHERE id = ?`,
    args: [id],
  });
  return result.rowsAffected > 0;
}

export async function duplicateHeroProject(
  id: string,
): Promise<HeroProject | null> {
  const existing = await getHeroProject(id);
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

export async function moveHeroProject(
  id: string,
  dir: "up" | "down",
): Promise<void> {
  return swapOrder("hero_projects", id, dir);
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

export async function listPlaygroundItems(): Promise<PlaygroundItem[]> {
  const db = await getReadyDb();
  const result = await db.execute({
    sql: `SELECT * FROM playground_items ORDER BY display_order ASC, created_at ASC`,
    args: [],
  });
  return (result.rows as unknown as PlaygroundRow[]).map(playgroundFromRow);
}

export async function getPlaygroundItem(
  id: string,
): Promise<PlaygroundItem | null> {
  const db = await getReadyDb();
  const result = await db.execute({
    sql: `SELECT * FROM playground_items WHERE id = ?`,
    args: [id],
  });
  const row = result.rows[0] as unknown as PlaygroundRow | undefined;
  return row ? playgroundFromRow(row) : null;
}

export async function createPlaygroundItem(
  input: PlaygroundItemInput,
): Promise<PlaygroundItem> {
  const db = await getReadyDb();
  const t = now();
  const id = randomUUID();
  const order =
    typeof input.displayOrder === "number" && input.displayOrder >= 0
      ? input.displayOrder
      : await nextOrder("playground_items");

  await db.execute({
    sql: `INSERT INTO playground_items
       (id, date, name, label, media_kind, media_url, poster_url, live_url,
        display_order, created_at, updated_at)
     VALUES
       (@id, @date, @name, @label, @media_kind, @media_url, @poster_url, @live_url,
        @display_order, @created_at, @updated_at)`,
    args: {
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
    },
  });

  return (await getPlaygroundItem(id))!;
}

export async function updatePlaygroundItem(
  id: string,
  input: PlaygroundItemInput,
): Promise<PlaygroundItem | null> {
  const existing = await getPlaygroundItem(id);
  if (!existing) return null;

  const db = await getReadyDb();
  await db.execute({
    sql: `UPDATE playground_items SET
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
    args: {
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
    },
  });

  return getPlaygroundItem(id);
}

export async function removePlaygroundItem(id: string): Promise<boolean> {
  const db = await getReadyDb();
  const result = await db.execute({
    sql: `DELETE FROM playground_items WHERE id = ?`,
    args: [id],
  });
  return result.rowsAffected > 0;
}

export async function duplicatePlaygroundItem(
  id: string,
): Promise<PlaygroundItem | null> {
  const existing = await getPlaygroundItem(id);
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

export async function movePlaygroundItem(
  id: string,
  dir: "up" | "down",
): Promise<void> {
  return swapOrder("playground_items", id, dir);
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

export async function listRecommendations(): Promise<Recommendation[]> {
  const db = await getReadyDb();
  const result = await db.execute({
    sql: `SELECT * FROM recommendations ORDER BY display_order ASC, created_at ASC`,
    args: [],
  });
  return (result.rows as unknown as RecommendationRow[]).map(recFromRow);
}

export async function getRecommendation(
  id: string,
): Promise<Recommendation | null> {
  const db = await getReadyDb();
  const result = await db.execute({
    sql: `SELECT * FROM recommendations WHERE id = ?`,
    args: [id],
  });
  const row = result.rows[0] as unknown as RecommendationRow | undefined;
  return row ? recFromRow(row) : null;
}

export async function createRecommendation(
  input: RecommendationInput,
): Promise<Recommendation> {
  const db = await getReadyDb();
  const t = now();
  const id = randomUUID();
  const order =
    typeof input.displayOrder === "number" && input.displayOrder >= 0
      ? input.displayOrder
      : await nextOrder("recommendations");

  await db.execute({
    sql: `INSERT INTO recommendations
       (id, quote, author, role, company, avatar_url,
        display_order, created_at, updated_at)
     VALUES
       (@id, @quote, @author, @role, @company, @avatar_url,
        @display_order, @created_at, @updated_at)`,
    args: {
      id,
      quote: input.quote,
      author: input.author,
      role: input.role,
      company: input.company,
      avatar_url: input.avatarUrl,
      display_order: order,
      created_at: t,
      updated_at: t,
    },
  });

  return (await getRecommendation(id))!;
}

export async function updateRecommendation(
  id: string,
  input: RecommendationInput,
): Promise<Recommendation | null> {
  const existing = await getRecommendation(id);
  if (!existing) return null;

  const db = await getReadyDb();
  await db.execute({
    sql: `UPDATE recommendations SET
         quote = @quote,
         author = @author,
         role = @role,
         company = @company,
         avatar_url = @avatar_url,
         display_order = @display_order,
         updated_at = @updated_at
       WHERE id = @id`,
    args: {
      id,
      quote: input.quote,
      author: input.author,
      role: input.role,
      company: input.company,
      avatar_url: input.avatarUrl,
      display_order: input.displayOrder,
      updated_at: now(),
    },
  });

  return getRecommendation(id);
}

export async function removeRecommendation(id: string): Promise<boolean> {
  const db = await getReadyDb();
  const result = await db.execute({
    sql: `DELETE FROM recommendations WHERE id = ?`,
    args: [id],
  });
  return result.rowsAffected > 0;
}

export async function duplicateRecommendation(
  id: string,
): Promise<Recommendation | null> {
  const existing = await getRecommendation(id);
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

export async function moveRecommendation(
  id: string,
  dir: "up" | "down",
): Promise<void> {
  return swapOrder("recommendations", id, dir);
}

/* -------------------------------------------------------------------------- */
/* Reorder helper                                                             */
/* -------------------------------------------------------------------------- */

async function swapOrder(
  table: string,
  id: string,
  dir: "up" | "down",
): Promise<void> {
  const db = await getReadyDb();

  const targetResult = await db.execute({
    sql: `SELECT id, display_order FROM ${table} WHERE id = ?`,
    args: [id],
  });
  const target = targetResult.rows[0] as unknown as
    | { id: string; display_order: number }
    | undefined;
  if (!target) return;

  const neighbourResult = await db.execute({
    sql:
      dir === "up"
        ? `SELECT id, display_order FROM ${table} WHERE display_order < ? ORDER BY display_order DESC LIMIT 1`
        : `SELECT id, display_order FROM ${table} WHERE display_order > ? ORDER BY display_order ASC LIMIT 1`,
    args: [target.display_order],
  });
  const neighbour = neighbourResult.rows[0] as unknown as
    | { id: string; display_order: number }
    | undefined;
  if (!neighbour) return;

  await db.batch(
    [
      {
        sql: `UPDATE ${table} SET display_order = ? WHERE id = ?`,
        args: [neighbour.display_order, target.id],
      },
      {
        sql: `UPDATE ${table} SET display_order = ? WHERE id = ?`,
        args: [target.display_order, neighbour.id],
      },
    ],
    "write",
  );
}
