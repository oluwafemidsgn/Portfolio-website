// Upserts a case study (and optionally its home-page tile) from a JSON file.
//
//   node scripts/import-case-study.mjs scripts/case-studies/ltif-2026.json [--hero] [--dry]
//        [--media=<base>] [--frames=<base>] [--motion=<base>]
//
// - Targets TURSO_DATABASE_URL / TURSO_AUTH_TOKEN when set, else the local data/portfolio.db
//   (the same rule as lib/db.ts). Run `npm run dev` once first so the schema exists.
// - Matches on slug: an existing study is updated in place (id, created_at and the first
//   published_at are kept), a new one is inserted.
// - `{media}` in any URL is replaced with --media, or the JSON's mediaBase
//   (default /case-studies/<slug>, served from public/).
// - --frames / --motion override `{media}/frames` and `{media}/motion` separately. Cloudinary needs
//   this: images live under /image/upload/... and videos under /video/upload/...
// - --dry prints every resolved URL and writes nothing.
// - --hero adds the home-page tile at the top of the grid if the study has none yet.
import { createClient } from "@libsql/client";
import { randomUUID } from "node:crypto";
import fs from "node:fs";

const args = process.argv.slice(2);
const file = args.find((a) => !a.startsWith("--"));
if (!file) {
  console.error("usage: node scripts/import-case-study.mjs <file.json> [--hero] [--media=<base url>]");
  process.exit(1);
}
const withHero = args.includes("--hero");
const opt = (name) => args.find((a) => a.startsWith(`--${name}=`))?.slice(name.length + 3).replace(/\/$/, "");
const mediaArg = opt("media");
const framesArg = opt("frames");
const motionArg = opt("motion");
const dry = args.includes("--dry");

const data = JSON.parse(fs.readFileSync(file, "utf8"));
const media = (mediaArg || data.mediaBase || `/case-studies/${data.study.slug}`).replace(/\/$/, "");
const fill = (s) =>
  typeof s === "string"
    ? s
        .replaceAll("{media}/frames", framesArg || `${media}/frames`)
        .replaceAll("{media}/motion", motionArg || `${media}/motion`)
        .replaceAll("{media}", media)
    : s;
const deep = (v) =>
  Array.isArray(v) ? v.map(deep) : v && typeof v === "object" ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, deep(x)])) : fill(v);

const s = deep(data.study);
const accordion = s.accordion.map((a) => ({ id: randomUUID(), ...a }));
const blocks = s.blocks.map((b) => ({ id: randomUUID(), ...b }));

if (dry) {
  const urls = [s.coverImage, ...blocks.flatMap((b) => [b.image, b.left, b.right]), ...(data.heroTile ? [deep(data.heroTile).mediaUrl, deep(data.heroTile).posterUrl] : [])].filter(Boolean);
  console.log([...new Set(urls)].join("\n"));
  console.log(`\n${new Set(urls).size} media URLs. Dry run: nothing written.`);
  process.exit(0);
}

const db = createClient({
  url: process.env.TURSO_DATABASE_URL ?? "file:./data/portfolio.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const now = new Date().toISOString();
const target = process.env.TURSO_DATABASE_URL ? "Turso" : "local data/portfolio.db";

const existing = (await db.execute({ sql: "SELECT id, published_at FROM case_studies WHERE slug = ?", args: [s.slug] })).rows[0];
const fields = {
  slug: s.slug,
  title: s.title,
  subtitle: s.subtitle,
  client: s.client,
  role: s.role,
  year: s.year,
  type: s.type,
  cover_image: s.coverImage,
  overview: s.overview,
  accordion: JSON.stringify(accordion),
  blocks: JSON.stringify(blocks),
  status: s.status,
  coming_soon: s.comingSoon ? 1 : 0,
  updated_at: now,
};

let studyId;
if (existing) {
  studyId = existing.id;
  const publishedAt = s.status === "published" ? existing.published_at || now : null;
  await db.execute({
    sql: `UPDATE case_studies SET slug=@slug, title=@title, subtitle=@subtitle, client=@client, role=@role,
          year=@year, type=@type, cover_image=@cover_image, overview=@overview, accordion=@accordion,
          blocks=@blocks, status=@status, coming_soon=@coming_soon, updated_at=@updated_at,
          published_at=@published_at WHERE id=@id`,
    args: { ...fields, id: studyId, published_at: publishedAt },
  });
  console.log(`updated "${s.title}" (${s.slug}) in ${target}`);
} else {
  studyId = randomUUID();
  await db.execute({
    sql: `INSERT INTO case_studies (id, slug, title, subtitle, client, role, year, type, cover_image, overview,
          accordion, blocks, status, coming_soon, created_at, updated_at, published_at)
          VALUES (@id, @slug, @title, @subtitle, @client, @role, @year, @type, @cover_image, @overview,
          @accordion, @blocks, @status, @coming_soon, @created_at, @updated_at, @published_at)`,
    args: { ...fields, id: studyId, created_at: now, published_at: s.status === "published" ? now : null },
  });
  console.log(`created "${s.title}" (${s.slug}) in ${target}`);
}

if (withHero && data.heroTile) {
  const h = deep(data.heroTile);
  const tile = (await db.execute({ sql: "SELECT id FROM hero_projects WHERE case_study_id = ?", args: [studyId] })).rows[0];
  if (tile) {
    await db.execute({
      sql: `UPDATE hero_projects SET year=?, name=?, discipline=?, media_kind=?, media_url=?, poster_url=?, updated_at=? WHERE id=?`,
      args: [h.year, h.name, h.discipline, h.mediaKind, h.mediaUrl, h.posterUrl, now, tile.id],
    });
    console.log("updated home-page tile");
  } else {
    await db.execute({ sql: "UPDATE hero_projects SET display_order = display_order + 1", args: [] });
    await db.execute({
      sql: `INSERT INTO hero_projects (id, year, name, discipline, media_kind, media_url, poster_url, case_study_id,
            coming_soon, display_order, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, 0, ?, ?)`,
      args: [randomUUID(), h.year, h.name, h.discipline, h.mediaKind, h.mediaUrl, h.posterUrl, studyId, now, now],
    });
    console.log("added home-page tile at the top of the grid");
  }
}
console.log(`frames: ${framesArg || `${media}/frames`}\nmotion: ${motionArg || `${media}/motion`}`);
