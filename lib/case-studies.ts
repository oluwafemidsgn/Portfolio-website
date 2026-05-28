import { getReadyDb } from "./db";
import type { CaseStudy, CaseStudyInput, Status } from "./types";
import { randomUUID } from "node:crypto";

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

export async function listAll(): Promise<CaseStudy[]> {
  const db = await getReadyDb();
  const result = await db.execute({
    sql: `SELECT * FROM case_studies ORDER BY COALESCE(published_at, updated_at) DESC`,
    args: [],
  });
  return (result.rows as unknown as Row[]).map(fromRow);
}

export async function listPublished(): Promise<CaseStudy[]> {
  const db = await getReadyDb();
  const result = await db.execute({
    sql: `SELECT * FROM case_studies WHERE status = 'published' ORDER BY published_at DESC`,
    args: [],
  });
  return (result.rows as unknown as Row[]).map(fromRow);
}

export async function getById(id: string): Promise<CaseStudy | null> {
  const db = await getReadyDb();
  const result = await db.execute({
    sql: "SELECT * FROM case_studies WHERE id = ?",
    args: [id],
  });
  const row = result.rows[0] as unknown as Row | undefined;
  return row ? fromRow(row) : null;
}

export async function getBySlug(slug: string): Promise<CaseStudy | null> {
  const db = await getReadyDb();
  const result = await db.execute({
    sql: "SELECT * FROM case_studies WHERE slug = ?",
    args: [slug],
  });
  const row = result.rows[0] as unknown as Row | undefined;
  return row ? fromRow(row) : null;
}

async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  const db = await getReadyDb();
  let candidate = base || "untitled";
  let n = 1;
  while (true) {
    const result = await db.execute({
      sql: "SELECT id FROM case_studies WHERE slug = ? AND id IS NOT ?",
      args: [candidate, excludeId ?? ""],
    });
    if (result.rows.length === 0) break;
    n += 1;
    candidate = `${base}-${n}`;
  }
  return candidate;
}

export async function create(input: CaseStudyInput): Promise<CaseStudy> {
  const db = await getReadyDb();
  const now = new Date().toISOString();
  const id = randomUUID();
  const slug = await uniqueSlug(input.slug || slugify(input.title));
  const publishedAt = input.status === "published" ? now : null;

  await db.execute({
    sql: `INSERT INTO case_studies
       (id, slug, title, subtitle, client, role, year, type,
        cover_image, overview, accordion, blocks, status,
        created_at, updated_at, published_at)
     VALUES
       (@id, @slug, @title, @subtitle, @client, @role, @year, @type,
        @cover_image, @overview, @accordion, @blocks, @status,
        @created_at, @updated_at, @published_at)`,
    args: {
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
    },
  });

  return (await getById(id))!;
}

export async function update(
  id: string,
  input: CaseStudyInput,
): Promise<CaseStudy | null> {
  const existing = await getById(id);
  if (!existing) return null;

  const now = new Date().toISOString();
  const slug = await uniqueSlug(input.slug || slugify(input.title), id);

  let publishedAt = existing.publishedAt;
  if (input.status === "published" && !publishedAt) publishedAt = now;
  if (input.status === "draft") publishedAt = null;

  const db = await getReadyDb();
  await db.execute({
    sql: `UPDATE case_studies SET
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
    args: {
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
    },
  });

  return getById(id);
}

export async function remove(id: string): Promise<boolean> {
  const db = await getReadyDb();
  const result = await db.execute({
    sql: "DELETE FROM case_studies WHERE id = ?",
    args: [id],
  });
  return result.rowsAffected > 0;
}

export async function duplicate(id: string): Promise<CaseStudy | null> {
  const existing = await getById(id);
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

export async function setStatus(
  id: string,
  status: Status,
): Promise<CaseStudy | null> {
  const existing = await getById(id);
  if (!existing) return null;
  const now = new Date().toISOString();
  let publishedAt = existing.publishedAt;
  if (status === "published" && !publishedAt) publishedAt = now;
  if (status === "draft") publishedAt = null;

  const db = await getReadyDb();
  await db.execute({
    sql: `UPDATE case_studies SET status = ?, updated_at = ?, published_at = ? WHERE id = ?`,
    args: [status, now, publishedAt, id],
  });

  return getById(id);
}
