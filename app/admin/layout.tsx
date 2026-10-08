import Link from "next/link";
import { isAuthed } from "@/lib/auth";
import { logoutAction } from "./actions";

export const metadata = { title: "Admin — Oduneye Oluwafemi" };

/**
 * Wraps all /admin routes. The login page uses this too — it just renders
 * children without the toolbar when the user isn't authed.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authed = await isAuthed();

  return (
    <div className="admin-root bg-paper text-ink min-h-screen">
      {authed ? (
        <>
          <header className="page-gutter border-b border-[var(--rule)] pt-8 pb-4">
            <div className="flex items-center justify-between gap-4 t-nav">
              <div className="flex items-center gap-6 md:gap-10">
                <Link href="/admin" className="admin-link admin-link-current">
                  / ADMIN
                </Link>
                <Link
                  href="/admin"
                  className="admin-link"
                >
                  CASE STUDIES
                </Link>
                <Link
                  href="/admin/homepage"
                  className="admin-link"
                >
                  HOMEPAGE
                </Link>
                <Link
                  href="/"
                  className="admin-link"
                  target="_blank"
                >
                  VIEW SITE ↗
                </Link>
              </div>
              <form action={logoutAction}>
                <button type="submit" className="admin-link t-nav">
                  SIGN OUT
                </button>
              </form>
            </div>
          </header>
          <main className="page-gutter py-10">{children}</main>
        </>
      ) : (
        // Login (and any other unauthed page) renders full-bleed.
        <main className="min-h-screen">{children}</main>
      )}
    </div>
  );
}
