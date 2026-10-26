// One command to put a side project into the Playground (homepage + /playground):
//   1. uploads every image/video the JSON references to Cloudinary
//      (portfolio/playground/<slug>/<file>, exact filenames, overwrite-safe)
//   2. checks each URL answers
//   3. upserts the playground item by name (new items go to the top)
//
//   npm run publish:playground -- scripts/playground/credentia.json --from="/path/to/images" [--dry]
//
// JSON: { "slug", "item": { name, label, date, mediaKind, media, poster, liveUrl, description,
//         blocks: [ {kind:"full"|"duo"|"section", ...} ] } } — media written as {media}/<file>.
// Credentials come from .env.local exactly like publish-case-study.mjs.
import { createClient } from "@libsql/client";
import { createHash, randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

for (const f of [".env.local", ".env"]) {
  if (!fs.existsSync(f)) continue;
  for (const line of fs.readFileSync(f, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const args = process.argv.slice(2);
const file = args.find((a) => !a.startsWith("--"));
const from = args.find((a) => a.startsWith("--from="))?.slice(7);
const dry = args.includes("--dry");
if (!file || !from) {
  console.error('usage: npm run publish:playground -- <file.json> --from="<image folder>" [--dry]');
  process.exit(1);
}

const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const key = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
const secret = process.env.CLOUDINARY_API_SECRET;
const root = (process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_FOLDER || "portfolio").replace(/\/$/, "");
const data = JSON.parse(fs.readFileSync(file, "utf8"));
const folder = `${root}/playground/${data.slug}`;
const refs = [...new Set(JSON.stringify(data.item).match(/\{media\}\/[^"]+/g) || [])].map((r) => r.slice(8));
const missing = refs.filter((r) => !fs.existsSync(path.join(from, r)));
if (missing.length) {
  console.error(`Not found in ${from}:\n  ${missing.join("\n  ")}`);
  process.exit(1);
}
const kindOf = (f) => (/\.(mp4|mov|webm|m4v)$/i.test(f) ? "video" : "image");
// Versioned once uploaded, so a re-publish over the same filename never shows a cached old image.
const versions = {};
const urlOf = (f) => `https://res.cloudinary.com/${cloud}/${kindOf(f)}/upload/${versions[f] ? `v${versions[f]}/` : ""}${folder}/${f}`;
const target = process.env.TURSO_DATABASE_URL ? "Turso (live site)" : "local data/portfolio.db";
console.log(`${refs.length} files → Cloudinary ${folder}/  ·  database: ${target}`);
if (dry) {
  refs.forEach((r) => console.log("  " + urlOf(r)));
  process.exit(0);
}

const sign = (p) => createHash("sha1").update(Object.keys(p).sort().map((k) => `${k}=${p[k]}`).join("&") + secret).digest("hex");
for (const f of refs) {
  const params = { asset_folder: folder, overwrite: "true", public_id: `${folder}/${f.replace(/\.[^.]+$/, "")}`, timestamp: String(Math.floor(Date.now() / 1000)) };
  const form = new FormData();
  for (const [k, v] of Object.entries(params)) form.append(k, v);
  form.append("api_key", key);
  form.append("signature", sign(params));
  form.append("file", await fs.openAsBlob(path.join(from, f)), f);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/${kindOf(f)}/upload`, { method: "POST", body: form });
  const out = await res.json();
  if (!res.ok) { console.error(`upload failed for ${f}: ${out.error?.message || res.status}`); process.exit(1); }
  versions[f] = out.version;
  console.log(`  ↑ ${f} (${(out.bytes / 1e6).toFixed(1)}MB)`);
}
for (const f of refs) {
  const res = await fetch(urlOf(f), { method: "HEAD" });
  if (!res.ok) { console.error(`not reachable yet (${res.status}): ${urlOf(f)}`); process.exit(1); }
}

const fill = (v) => (typeof v === "string" ? v.replace(/\{media\}\/([^"]+)/g, (_, f) => urlOf(f)) : v);
const it = data.item;
const blocks = (it.blocks || []).map((b) => ({ id: randomUUID(), ...Object.fromEntries(Object.entries(b).map(([k, v]) => [k, fill(v)])) }));
const db = createClient({ url: process.env.TURSO_DATABASE_URL ?? "file:./data/portfolio.db", authToken: process.env.TURSO_AUTH_TOKEN });
const now = new Date().toISOString();
const row = {
  name: it.name, label: it.label, date: it.date, media_kind: it.mediaKind || kindOf(it.media || ""),
  media_url: fill(it.media || ""), poster_url: fill(it.poster || ""), live_url: it.liveUrl || "",
  description: it.description || "", blocks: JSON.stringify(blocks), updated_at: now,
};
const existing = (await db.execute({ sql: "SELECT id FROM playground_items WHERE name = ?", args: [it.name] })).rows[0];
if (existing) {
  await db.execute({
    sql: `UPDATE playground_items SET label=@label, date=@date, media_kind=@media_kind, media_url=@media_url, poster_url=@poster_url,
          live_url=@live_url, description=@description, blocks=@blocks, updated_at=@updated_at WHERE id=@id`,
    args: { ...Object.fromEntries(Object.entries(row).filter(([k]) => k !== "name")), id: existing.id },
  });
  console.log(`updated playground item "${it.name}"`);
} else {
  await db.execute({ sql: "UPDATE playground_items SET display_order = display_order + 1", args: [] });
  await db.execute({
    sql: `INSERT INTO playground_items (id, name, label, date, media_kind, media_url, poster_url, live_url, description, blocks, display_order, created_at, updated_at)
          VALUES (@id, @name, @label, @date, @media_kind, @media_url, @poster_url, @live_url, @description, @blocks, 0, @created_at, @updated_at)`,
    args: { ...row, id: randomUUID(), created_at: now },
  });
  console.log(`added playground item "${it.name}" at the top`);
}
