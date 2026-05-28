import { createClient, type Client } from "@libsql/client";

declare global {
  // eslint-disable-next-line no-var
  var __portfolioDb: Client | undefined;
  // eslint-disable-next-line no-var
  var __portfolioSchemaReady: Promise<void> | undefined;
}

export function getDb(): Client {
  if (!globalThis.__portfolioDb) {
    const url = process.env.TURSO_DATABASE_URL ?? "file:./data/portfolio.db";
    globalThis.__portfolioDb = createClient({
      url,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
  }
  return globalThis.__portfolioDb;
}

export async function getReadyDb(): Promise<Client> {
  if (!globalThis.__portfolioSchemaReady) {
    const p = _applySchema();
    globalThis.__portfolioSchemaReady = p;
    p.catch(() => {
      globalThis.__portfolioSchemaReady = undefined;
    });
  }
  await globalThis.__portfolioSchemaReady;
  return getDb();
}

async function _applySchema(): Promise<void> {
  const db = getDb();

  await db.executeMultiple(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS case_studies (
      id           TEXT PRIMARY KEY,
      slug         TEXT NOT NULL UNIQUE,
      title        TEXT NOT NULL,
      subtitle     TEXT NOT NULL DEFAULT '',
      client       TEXT NOT NULL DEFAULT '',
      role         TEXT NOT NULL DEFAULT '',
      year         TEXT NOT NULL DEFAULT '',
      type         TEXT NOT NULL DEFAULT '',
      cover_image  TEXT NOT NULL DEFAULT '',
      overview     TEXT NOT NULL DEFAULT '',
      accordion    TEXT NOT NULL DEFAULT '[]',
      blocks       TEXT NOT NULL DEFAULT '[]',
      status       TEXT NOT NULL DEFAULT 'draft',
      created_at   TEXT NOT NULL,
      updated_at   TEXT NOT NULL,
      published_at TEXT
    );

    CREATE TABLE IF NOT EXISTS hero_projects (
      id             TEXT PRIMARY KEY,
      year           TEXT NOT NULL DEFAULT '',
      name           TEXT NOT NULL DEFAULT '',
      discipline     TEXT NOT NULL DEFAULT '',
      media_kind     TEXT NOT NULL DEFAULT 'image',
      media_url      TEXT NOT NULL DEFAULT '',
      poster_url     TEXT NOT NULL DEFAULT '',
      case_study_id  TEXT,
      display_order  INTEGER NOT NULL DEFAULT 0,
      created_at     TEXT NOT NULL,
      updated_at     TEXT NOT NULL,
      FOREIGN KEY (case_study_id) REFERENCES case_studies(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS playground_items (
      id             TEXT PRIMARY KEY,
      date           TEXT NOT NULL DEFAULT '',
      name           TEXT NOT NULL DEFAULT '',
      label          TEXT NOT NULL DEFAULT '',
      media_kind     TEXT NOT NULL DEFAULT 'image',
      media_url      TEXT NOT NULL DEFAULT '',
      poster_url     TEXT NOT NULL DEFAULT '',
      live_url       TEXT NOT NULL DEFAULT '',
      display_order  INTEGER NOT NULL DEFAULT 0,
      created_at     TEXT NOT NULL,
      updated_at     TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS recommendations (
      id             TEXT PRIMARY KEY,
      quote          TEXT NOT NULL DEFAULT '',
      author         TEXT NOT NULL DEFAULT '',
      role           TEXT NOT NULL DEFAULT '',
      company        TEXT NOT NULL DEFAULT '',
      avatar_url     TEXT NOT NULL DEFAULT '',
      display_order  INTEGER NOT NULL DEFAULT 0,
      created_at     TEXT NOT NULL,
      updated_at     TEXT NOT NULL
    );
  `);

  await addColumnIfMissing(
    db,
    "playground_items",
    "live_url",
    "TEXT NOT NULL DEFAULT ''",
  );
}

async function addColumnIfMissing(
  db: Client,
  table: string,
  column: string,
  definition: string,
): Promise<void> {
  const result = await db.execute({
    sql: `PRAGMA table_info(${table})`,
    args: [],
  });
  const cols = result.rows as unknown as { name: string }[];
  if (cols.some((c) => c.name === column)) return;
  await db.execute({
    sql: `ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`,
    args: [],
  });
}
