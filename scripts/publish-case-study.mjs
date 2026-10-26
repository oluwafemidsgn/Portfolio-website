// One command to put a case study live:
//   1. uploads every frame/video the JSON references to Cloudinary (signed, overwrite-safe,
//      exact filenames, foldered as <upload folder>/<slug>/frames|motion)
//   2. checks each delivered URL answers
//   3. upserts the case study (+ optional home-page tile) into the database
//      via scripts/import-case-study.mjs, pointing at the Cloudinary URLs
//
//   npm run publish:case-study -- scripts/case-studies/ltif-2026.json --from="/path/to/export" [--hero] [--dry]
//
// --from   folder that holds frames/ and motion/ (the files named in the JSON)
// --hero   also add/update the home-page tile (top of the grid if new)
// --dry    show what would be uploaded and written; touch nothing
//
// Reads credentials from .env.local / .env (never printed):
//   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, NEXT_PUBLIC_CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET,
//   NEXT_PUBLIC_CLOUDINARY_UPLOAD_FOLDER (optional, default "portfolio"),
//   TURSO_DATABASE_URL, TURSO_AUTH_TOKEN (without these it writes to local data/portfolio.db).
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

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
const hero = args.includes("--hero");
if (!file || !from) {
  console.error('usage: npm run publish:case-study -- <file.json> --from="<export folder>" [--hero] [--dry]');
  process.exit(1);
}

const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const key = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
const secret = process.env.CLOUDINARY_API_SECRET;
const root = (process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_FOLDER || "portfolio").replace(/\/$/, "");
const missing = Object.entries({ NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: cloud, NEXT_PUBLIC_CLOUDINARY_API_KEY: key, CLOUDINARY_API_SECRET: secret })
  .filter(([, v]) => !v || /^your-/.test(v))
  .map(([k]) => k);
if (missing.length && !dry) {
  console.error(`Missing in .env.local: ${missing.join(", ")}`);
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(file, "utf8"));
const slug = data.study.slug;
const refs = [...new Set(JSON.stringify(data).match(/\{media\}\/(frames|motion)\/[^"]+/g) || [])].map((r) => r.slice("{media}/".length));
const missingFiles = refs.filter((r) => !fs.existsSync(path.join(from, r)));
if (missingFiles.length) {
  console.error(`Not found in ${from}:\n  ${missingFiles.join("\n  ")}`);
  process.exit(1);
}

const kindOf = (rel) => (/\.(mp4|mov|webm|m4v)$/i.test(rel) ? "video" : "image");
const base = (kind, sub) => `https://res.cloudinary.com/${cloud}/${kind}/upload/${root}/${slug}/${sub}`;
const target = process.env.TURSO_DATABASE_URL ? "Turso (live site)" : "local data/portfolio.db";

console.log(`${refs.length} files → Cloudinary ${cloud || "(cloud name not set)"}:${root}/${slug}/  ·  database: ${target}`);
if (dry) {
  refs.forEach((r) => console.log(`  ${kindOf(r).padEnd(5)}  ${r}`));
  console.log("Dry run: nothing uploaded or written.");
  process.exit(0);
}

const sign = (params) =>
  createHash("sha1")
    .update(Object.keys(params).sort().map((k) => `${k}=${params[k]}`).join("&") + secret)
    .digest("hex");

let done = 0;
for (const rel of refs) {
  const [sub, name] = rel.split("/");
  const kind = kindOf(rel);
  const params = {
    asset_folder: `${root}/${slug}/${sub}`,
    overwrite: "true",
    public_id: `${root}/${slug}/${sub}/${name.replace(/\.[^.]+$/, "")}`,
    timestamp: String(Math.floor(Date.now() / 1000)),
  };
  const form = new FormData();
  for (const [k, v] of Object.entries(params)) form.append(k, v);
  form.append("api_key", key);
  form.append("signature", sign(params));
  form.append("file", await fs.openAsBlob(path.join(from, rel)), name);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/${kind}/upload`, { method: "POST", body: form });
  const out = await res.json();
  if (!res.ok) {
    console.error(`upload failed for ${rel}: ${out.error?.message || res.status}`);
    process.exit(1);
  }
  done++;
  console.log(`  ↑ ${String(done).padStart(2)}/${refs.length}  ${rel}  (${(out.bytes / 1e6).toFixed(1)}MB)`);
}

// every URL the page will use must answer before the database points at it
for (const rel of refs) {
  const [sub, name] = rel.split("/");
  const url = `${base(kindOf(rel), sub)}/${name}`;
  const res = await fetch(url, { method: "HEAD" });
  if (!res.ok) {
    console.error(`not reachable yet (${res.status}): ${url}`);
    process.exit(1);
  }
}
console.log("All URLs answer.");

execFileSync(
  process.execPath,
  [
    path.join(path.dirname(fileURLToPath(import.meta.url)), "import-case-study.mjs"),
    file,
    `--frames=${base("image", "frames")}`,
    `--motion=${base("video", "motion")}`,
    ...(hero ? ["--hero"] : []),
  ],
  { stdio: "inherit", env: process.env },
);
