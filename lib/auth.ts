import { cookies } from "next/headers";
import { createHash, timingSafeEqual } from "node:crypto";

/**
 * Minimal password-based session for the admin area. There is exactly one
 * credential — the `ADMIN_PASSWORD` env var — and a successful login sets
 * a signed cookie. No user table, no JWTs, no refresh. Good enough for a
 * single-operator portfolio CMS.
 *
 * If you're deploying publicly, set both envs:
 *   ADMIN_PASSWORD=<your password>
 *   ADMIN_SESSION_SECRET=<a random 32+ char string>
 */

const COOKIE_NAME = "portfolio_admin_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 14; // 14 days

function getSecret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ??
    "dev-only-session-secret-change-me-in-production"
  );
}

function getPassword(): string {
  return process.env.ADMIN_PASSWORD ?? "admin";
}

function sign(value: string): string {
  return createHash("sha256")
    .update(value + "::" + getSecret())
    .digest("hex");
}

/** Issues a session cookie after a valid login. */
export async function signIn(password: string): Promise<boolean> {
  const expected = Buffer.from(getPassword());
  const provided = Buffer.from(password);
  if (expected.length !== provided.length) return false;
  if (!timingSafeEqual(expected, provided)) return false;

  const issuedAt = Date.now().toString();
  const token = `${issuedAt}.${sign(issuedAt)}`;

  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
  return true;
}

/** Clears the session cookie. */
export async function signOut() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

/** True if the current request carries a valid session. */
export async function isAuthed(): Promise<boolean> {
  const store = await cookies();
  const raw = store.get(COOKIE_NAME)?.value;
  if (!raw) return false;
  const [issuedAt, signature] = raw.split(".");
  if (!issuedAt || !signature) return false;
  return sign(issuedAt) === signature;
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME;
