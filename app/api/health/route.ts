import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

/** Temporary: which database production reads. Host label only, never the token. */
export async function GET() {
  const raw = process.env.TURSO_DATABASE_URL;
  const db = raw === undefined ? "unset" : raw === "" ? "empty" : raw.replace(/^[a-z]+:\/\//, "").split(".")[0];
  let caseStudies: unknown = null;
  try {
    caseStudies = (await getDb().execute("SELECT slug FROM case_studies")).rows.map((r) => r.slug);
  } catch (e) {
    caseStudies = String(e).slice(0, 200);
  }
  return Response.json({ db, hasToken: Boolean(process.env.TURSO_AUTH_TOKEN), env: process.env.VERCEL_ENV, caseStudies });
}
