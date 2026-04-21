import Database from "better-sqlite3";
import { mkdirSync, existsSync } from "node:fs";
import path from "node:path";

/**
 * Singleton SQLite handle.
 *
 * We memoize on `globalThis` so Next.js hot-reload doesn't open a dozen
 * connections to the same file during development. In production each
 * worker gets exactly one handle.
 *
 * Storage note: this writes to `./data/portfolio.db` at the project root.
 * That path is gitignored and works out of the box for local dev. For a
 * hosted deployment (Vercel, etc.) you'll want to swap this file for a
 * hosted DB driver — the only call site that touches SQLite directly is
 * `lib/case-studies.ts`, so that's where to port to Turso / Postgres /
 * Neon without touching any UI code.
 */

const DB_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DB_DIR, "portfolio.db");

declare global {
  // eslint-disable-next-line no-var
  var __portfolioDb: Database.Database | undefined;
}

function openDb(): Database.Database {
  if (!existsSync(DB_DIR)) mkdirSync(DB_DIR, { recursive: true });

  const db = new Database(DB_FILE);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  return db;
}

/**
 * Schema. Arrays (accordion, blocks) are stored as JSON blobs — we
 * always edit the whole record at once, so a relational split would be
 * over-engineered for this volume.
 *
 * Kept separate from `openDb()` so it runs on every `getDb()` call.
 * `CREATE TABLE IF NOT EXISTS` is cheap and idempotent; doing it this
 * way means that when new tables are added in code, an already-cached
 * handle in the dev server (memoized on globalThis across HMR) still
 * picks them up on the next query instead of throwing "no such table".
 */
function ensureSchema(db: Database.Database): void {
  db.exec(`
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

  // Lightweight column migrations — idempotent checks that catch the
  // case of an existing DB created before a column was added.
  addColumnIfMissing(db, "playground_items", "live_url", "TEXT NOT NULL DEFAULT ''");
}

function addColumnIfMissing(
  db: Database.Database,
  table: string,
  column: string,
  definition: string,
): void {
  const cols = db
    .prepare(`PRAGMA table_info(${table})`)
    .all() as { name: string }[];
  if (cols.some((c) => c.name === column)) return;
  db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
}

// Module-local flag — resets on full process restart. In dev with HMR,
// the handle is memoized on globalThis but modules reload, so this
// cleanly re-runs the IF NOT EXISTS block once per reload.
let schemaApplied = false;

export function getDb(): Database.Database {
  if (!globalThis.__portfolioDb) {
    globalThis.__portfolioDb = openDb();
  }
  if (!schemaApplied) {
    ensureSchema(globalThis.__portfolioDb);
    schemaApplied = true;
  }
  return globalThis.__portfolioDb;
}
