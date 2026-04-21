import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/auth";
import { listAll } from "@/lib/case-studies";
import { ensureSeed } from "@/lib/seed";
import {
  deleteCaseStudy,
  duplicateCaseStudy,
  publishCaseStudy,
  unpublishCaseStudy,
} from "./actions";
import { Frame } from "@/components/motion/frame";
import { ConfirmDelete } from "./confirm-delete";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  if (!(await isAuthed())) redirect("/admin/login");
  ensureSeed();
  const all = listAll();
  const drafts = all.filter((s) => s.status === "draft").length;
  const published = all.filter((s) => s.status === "published").length;

  return (
    <div className="flex flex-col gap-10">
      {/* Top banner */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 items-end">
        <div>
          <div className="t-micro text-body">/ CASE STUDIES</div>
          <h1 className="t-title text-ink mt-4">Studio CMS</h1>
          <p className="mt-4 t-body text-body max-w-[56ch]">
            Write, edit, publish, and retire case studies. Every change hits
            the live site on save.
          </p>
        </div>
        <div className="flex gap-6 t-micro tabular-nums">
          <StatPill label="PUBLISHED" value={published} />
          <StatPill label="DRAFT" value={drafts} />
          <StatPill label="TOTAL" value={all.length} />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="t-micro text-body">/ INDEX</div>
        <Link
          href="/admin/new"
          className="bg-ink text-paper px-5 py-3 t-nav hover:opacity-90 transition-opacity"
        >
          NEW CASE STUDY +
        </Link>
      </div>

      <Frame>
        <table className="w-full">
          <thead>
            <tr className="rule-h text-left">
              <th className="p-4 md:p-6 t-micro text-body w-[28px]">#</th>
              <th className="p-4 md:p-6 t-micro text-body">TITLE</th>
              <th className="p-4 md:p-6 t-micro text-body hidden md:table-cell">
                TYPE
              </th>
              <th className="p-4 md:p-6 t-micro text-body hidden md:table-cell">
                YEAR
              </th>
              <th className="p-4 md:p-6 t-micro text-body">STATUS</th>
              <th className="p-4 md:p-6 t-micro text-body hidden lg:table-cell">
                UPDATED
              </th>
              <th className="p-4 md:p-6 t-micro text-body text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {all.length === 0 && (
              <tr>
                <td colSpan={7} className="p-10 text-center t-body text-body">
                  No case studies yet. Start with{" "}
                  <Link href="/admin/new" className="text-ink underline">
                    a new one
                  </Link>
                  .
                </td>
              </tr>
            )}
            {all.map((s, i) => (
              <tr
                key={s.id}
                className={`cms-ink-hover ${i < all.length - 1 ? "rule-h" : ""}`}
              >
                <td className="p-4 md:p-6 t-micro text-body tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </td>
                <td className="p-4 md:p-6">
                  <div className="flex flex-col gap-1">
                    <Link
                      href={`/admin/${s.id}/edit`}
                      className="t-nav text-ink hover:underline"
                    >
                      {s.title || <em className="text-body">Untitled</em>}
                    </Link>
                    <span className="t-micro text-body truncate max-w-[40ch]">
                      /{s.slug}
                    </span>
                  </div>
                </td>
                <td className="p-4 md:p-6 t-body text-strong hidden md:table-cell">
                  {s.type || "—"}
                </td>
                <td className="p-4 md:p-6 t-body text-strong tabular-nums hidden md:table-cell">
                  {s.year || "—"}
                </td>
                <td className="p-4 md:p-6">
                  <StatusDot status={s.status} />
                </td>
                <td className="p-4 md:p-6 t-micro text-body tabular-nums hidden lg:table-cell">
                  {formatDate(s.updatedAt)}
                </td>
                <td className="p-4 md:p-6">
                  <div className="flex items-center gap-3 justify-end flex-wrap">
                    {s.status === "published" ? (
                      <>
                        <Link
                          href={`/projects/${s.slug}`}
                          target="_blank"
                          className="t-micro text-body hover:text-ink"
                        >
                          VIEW ↗
                        </Link>
                        <form
                          action={unpublishCaseStudy.bind(null, s.id)}
                        >
                          <button
                            type="submit"
                            className="t-micro text-body hover:text-ink"
                          >
                            UNPUBLISH
                          </button>
                        </form>
                      </>
                    ) : (
                      <form action={publishCaseStudy.bind(null, s.id)}>
                        <button
                          type="submit"
                          className="t-micro text-ink hover:underline"
                        >
                          PUBLISH →
                        </button>
                      </form>
                    )}
                    <Link
                      href={`/admin/${s.id}/edit`}
                      className="t-micro text-body hover:text-ink"
                    >
                      EDIT
                    </Link>
                    <form action={duplicateCaseStudy.bind(null, s.id)}>
                      <button
                        type="submit"
                        className="t-micro text-body hover:text-ink"
                      >
                        DUPLICATE
                      </button>
                    </form>
                    <form
                      action={deleteCaseStudy.bind(null, s.id)}
                      className="contents"
                    >
                      <ConfirmDelete title={s.title} />
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Frame>
    </div>
  );
}

function StatPill({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="t-micro text-body">{label}</span>
      <span className="t-title text-ink tabular-nums">
        {String(value).padStart(2, "0")}
      </span>
    </div>
  );
}

function StatusDot({ status }: { status: "draft" | "published" }) {
  const isPub = status === "published";
  return (
    <span className="inline-flex items-center gap-2 t-micro">
      <span
        className={`h-1.5 w-1.5 rounded-full ${isPub ? "bg-ink" : "bg-[var(--rule)]"}`}
        aria-hidden
      />
      <span className={isPub ? "text-ink" : "text-body"}>
        {isPub ? "LIVE" : "DRAFT"}
      </span>
    </span>
  );
}

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toISOString().slice(0, 10).replace(/-/g, ".");
  } catch {
    return "—";
  }
}
