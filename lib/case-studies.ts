import { getDb } from "./db";
import type { CaseStudy, CaseStudyInput, Status } from "./types";
import { randomUUID } from "node:crypto";

/**
 * Repository for the case_studies table. All SQLite-specific concerns
 * live in this file; the rest of the app speaks pure domain types.
 */

type Row = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  client: string;
  role: string;
  year: string;
  type: string;
  cover_image: string;
  overview: string;
  accordion: string;
  blocks: string;
  status: Status;
  created_at: string;
  updated_at: string;
  published_at: string | null;
};

function fromRow(r: Row): CaseStudy {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    subtitle: r.subtitle,
    client: r.client,
    role: r.role,
    year: r.year,
    type: r.type,
    coverImage: r.cover_image,
    overview: r.overview,
    accordion: safeJson(r.accordion, []),
    blocks: safeJson(r.blocks, []),
    status: r.status,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    publishedAt: r.published_at,
  };
}

function safeJson<T>(s: string, fallback: T): T {
  try {
    return JSON.parse(s) as T;
  } catch {
    return fallback;
  }
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function listAll(): CaseStudy[] {
  const rows = getDb()
    .prepare(
      `SELECT * FROM case_studies
       ORDER BY COALESCE(published_at, updated_at) DESC`,
    )
    .all() as Row[];
  return rows.map(fromRow);
}

export function listPublished(): CaseStudy[] {
  const rows = getDb()
    .prepare(
      `SELECT * FROM case_studies
       WHERE status = 'published'
       ORDER BY published_at DESC`,
    )
    .all() as Row[];
  return rows.map(fromRow);
}

export function getById(id: string): CaseStudy | null {
  const row = getDb()
    .prepare("SELECT * FROM case_studies WHERE id = ?")
    .get(id) as Row | undefined;
  return row ? fromRow(row) : null;
}

export function getBySlug(slug: string): CaseStudy | null {
  const row = getDb()
    .prepare("SELECT * FROM case_studies WHERE slug = ?")
    .get(slug) as Row | undefined;
  return row ? fromRow(row) : null;
}

function uniqueSlug(base: string, excludeId?: string): string {
  const db = getDb();
  let candidate = base || "untitled";
  let n = 1;
  const stmt = db.prepare(
    "SELECT id FROM case_studies WHERE slug = ? AND id IS NOT ?",
  );
  while ((stmt.get(candidate, excludeId ?? "") as { id: string } | undefined)) {
    n += 1;
    candidate = `${base}-${n}`;
  }
  return candidate;
}

export function create(input: CaseStudyInput): CaseStudy {
  const db = getDb();
  const now = new Date().toISOString();
  const id = randomUUID();
  const slug = uniqueSlug(input.slug || slugify(input.title));
  const publishedAt = input.status === "published" ? now : null;

  db.prepare(
    `INSERT INTO case_studies
       (id, slug, title, subtitle, client, role, year, type,
        cover_image, overview, accordion, blocks, status,
        created_at, updated_at, published_at)
     VALUES
       (@id, @slug, @title, @subtitle, @client, @role, @year, @type,
        @cover_image, @overview, @accordion, @blocks, @status,
        @created_at, @updated_at, @published_at)`,
  ).run({
    id,
    slug,
    title: input.title,
    subtitle: input.subtitle,
    client: input.client,
    role: input.role,
    year: input.year,
    type: input.type,
    cover_image: input.coverImage,
    overview: input.overview,
    accordion: JSON.stringify(input.accordion),
    blocks: JSON.stringify(input.blocks),
    status: input.status,
    created_at: now,
    updated_at: now,
    published_at: publishedAt,
  });

  return getById(id)!;
}

export function update(id: string, input: CaseStudyInput): CaseStudy | null {
  const db = getDb();
  const existing = getById(id);
  if (!existing) return null;

  const now = new Date().toISOString();
  const slug = uniqueSlug(input.slug || slugify(input.title), id);

  // Preserve first-published timestamp; set it on publish if not already.
  let publishedAt = existing.publishedAt;
  if (input.status === "published" && !publishedAt) publishedAt = now;
  if (input.status === "draft") publishedAt = null;

  db.prepare(
    `UPDATE case_studies SET
       slug = @slug,
       title = @title,
       subtitle = @subtitle,
       client = @client,
       role = @role,
       year = @year,
       type = @type,
       cover_image = @cover_image,
       overview = @overview,
       accordion = @accordion,
       blocks = @blocks,
       status = @status,
       updated_at = @updated_at,
       published_at = @published_at
     WHERE id = @id`,
  ).run({
    id,
    slug,
    title: input.title,
    subtitle: input.subtitle,
    client: input.client,
    role: input.role,
    year: input.year,
    type: input.type,
    cover_image: input.coverImage,
    overview: input.overview,
    accordion: JSON.stringify(input.accordion),
    blocks: JSON.stringify(input.blocks),
    status: input.status,
    updated_at: now,
    published_at: publishedAt,
  });

  return getById(id);
}

export function remove(id: string): boolean {
  const res = getDb().prepare("DELETE FROM case_studies WHERE id = ?").run(id);
  return res.changes > 0;
}

/**
 * Clone an existing case study. The copy gets a new id + slug, the title
 * has "(Copy)" appended, and the status is forced back to draft so a
 * freshly duplicated study is never accidentally live. `uniqueSlug`
 * inside `create` handles slug collisions when a study is duplicated
 * multiple times in a row.
 */
export function duplicate(id: string): CaseStudy | null {
  const existing = getById(id);
  if (!existing) return null;
  const title = existing.title
    ? `${existing.title} (Copy)`
    : "Untitled (Copy)";
  return create({
    title,
    slug: slugify(title),
    subtitle: existing.subtitle,
    client: existing.client,
    role: existing.role,
    year: existing.year,
    type: existing.type,
    coverImage: existing.coverImage,
    overview: existing.overview,
    accordion: existing.accordion,
    blocks: existing.blocks,
    status: "draft",
  });
}

export function setStatus(id: string, status: Status): CaseStudy | null {
  const existing = getById(id);
  if (!existing) return null;
  const now = new Date().toISOString();
  let publishedAt = existing.publishedAt;
  if (status === "published" && !publishedAt) publishedAt = now;
  if (status === "draft") publishedAt = null;

  getDb()
    .prepare(
      `UPDATE case_studies
         SET status = ?, updated_at = ?, published_at = ?
       WHERE id = ?`,
    )
    .run(status, now, publishedAt, id);

  return getById(id);
}
