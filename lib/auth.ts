import { cookies, headers } from "next/headers";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { getReadyDb } from "./db";

/**
 * Minimal password-based session for the admin area. There is exactly one
 * credential — the `ADMIN_PASSWORD` env var — and a successful login sets
 * an HMAC-signed cookie carrying its issue time. No user table, no JWTs,
 * no refresh. Good enough for a single-operator portfolio CMS.
 *
 * Production requires both envs (the admin refuses to work without them):
 *   ADMIN_PASSWORD=<your password>
 *   ADMIN_SESSION_SECRET=<a random 32+ char string>
 */

const COOKIE_NAME = "portfolio_admin_session";
const SESSION_MAX_AGE_S = 60 * 60 * 24 * 14; // 14 days

/** Failed logins allowed per IP inside the window before it's locked. */
const MAX_FAILED_ATTEMPTS = 5;
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

const isProd = process.env.NODE_ENV === "production";

function requireEnv(value: string | undefined, name: string, devFallback: string) {
  if (value) return value;
  if (isProd) {
    throw new Error(
      `${name} is not set. Refusing to run the admin with a default value in production.`,
    );
  }
  return devFallback;
}

function getSecret(): string {
  return requireEnv(
    // Also accept the lowercase name — env names are case-sensitive and
    // the deployed project was configured with `admin_session_secret`.
    process.env.ADMIN_SESSION_SECRET ?? process.env.admin_session_secret,
    "ADMIN_SESSION_SECRET",
    "dev-only-session-secret-change-me-in-production",
  );
}

function getPassword(): string {
  return requireEnv(process.env.ADMIN_PASSWORD, "ADMIN_PASSWORD", "admin");
}

function sign(value: string): string {
  return createHmac("sha256", getSecret()).update(value).digest("hex");
}

/** Constant-time string compare (false on length mismatch). */
function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

/* ------------------------------ Rate limiting ------------------------------ */

async function clientIp(): Promise<string> {
  const h = await headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown"
  );
}

/**
 * Failed attempts live in the DB (not memory) so the limit holds across
 * serverless instances. Old rows are pruned on every check.
 */
async function recentFailures(ip: string): Promise<number> {
  const db = await getReadyDb();
  const since = Date.now() - ATTEMPT_WINDOW_MS;
  await db.execute({
    sql: `DELETE FROM login_attempts WHERE attempted_at < ?`,
    args: [since],
  });
  const result = await db.execute({
    sql: `SELECT COUNT(*) AS n FROM login_attempts WHERE ip = ? AND attempted_at >= ?`,
    args: [ip, since],
  });
  return Number((result.rows[0] as unknown as { n: number }).n);
}

async function recordFailure(ip: string): Promise<void> {
  const db = await getReadyDb();
  await db.execute({
    sql: `INSERT INTO login_attempts (ip, attempted_at) VALUES (?, ?)`,
    args: [ip, Date.now()],
  });
}

async function clearFailures(ip: string): Promise<void> {
  const db = await getReadyDb();
  await db.execute({
    sql: `DELETE FROM login_attempts WHERE ip = ?`,
    args: [ip],
  });
}

/* --------------------------------- Session --------------------------------- */

export type SignInResult = "ok" | "invalid" | "locked";

/** Issues a session cookie after a valid login. */
export async function signIn(password: string): Promise<SignInResult> {
  const ip = await clientIp();
  if ((await recentFailures(ip)) >= MAX_FAILED_ATTEMPTS) return "locked";

  // Compare digests so the check doesn't leak the password's length.
  const digest = (s: string) => createHash("sha256").update(s).digest("hex");
  if (!safeEqual(digest(password), digest(getPassword()))) {
    await recordFailure(ip);
    return "invalid";
  }
  await clearFailures(ip);

  const issuedAt = Date.now().toString();
  const token = `${issuedAt}.${sign(issuedAt)}`;

  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProd,
    path: "/",
    maxAge: SESSION_MAX_AGE_S,
  });
  return "ok";
}

/** Clears the session cookie. */
export async function signOut() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

/** True if the current request carries a valid, unexpired session. */
export async function isAuthed(): Promise<boolean> {
  const store = await cookies();
  const raw = store.get(COOKIE_NAME)?.value;
  if (!raw) return false;
  const [issuedAt, signature] = raw.split(".");
  if (!issuedAt || !signature) return false;
  if (!safeEqual(sign(issuedAt), signature)) return false;

  // The cookie's maxAge is client-side only; enforce expiry here too.
  const age = Date.now() - Number(issuedAt);
  return Number.isFinite(age) && age >= 0 && age < SESSION_MAX_AGE_S * 1000;
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME;
