import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/auth";
import { ensureSeed } from "@/lib/seed";
import { listHeroProjects } from "@/lib/home-content";
import { listAll } from "@/lib/case-studies";
import { Frame } from "@/components/motion/frame";
import { MediaAsset } from "@/components/media-asset";
import {
  deleteHeroAction,
  duplicateHeroAction,
  moveHeroAction,
} from "@/app/admin/homepage/actions";
import { ConfirmDelete } from "@/app/admin/confirm-delete";

export const dynamic = "force-dynamic";

export default async function HeroAdminList() {
  if (!(await isAuthed())) redirect("/admin/login");
  await ensureSeed();

  const [tiles, allStudies] = await Promise.all([
    listHeroProjects(),
    listAll(),
  ]);
  const studiesById = new Map(allStudies.map((s) => [s.id, s]));

  return (
    <div className="flex flex-col gap-10">
      <Breadcrumb />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 items-end">
        <div>
          <h1 className="t-title text-ink">Hero grid</h1>
          <p className="mt-4 t-body text-body max-w-[56ch]">
            Tiles rendered under the hero on the home page. Drag-less ordering
            via the ↑ ↓ arrows — first row of the grid is the top-left tile.
          </p>
        </div>
        <Link
          href="/admin/homepage/hero/new"
          className="bg-ink text-paper px-5 py-3 t-nav hover:opacity-90 transition-opacity justify-self-start lg:justify-self-end"
        >
          NEW TILE +
        </Link>
      </div>

      <Frame>
        <table className="w-full">
          <thead>
            <tr className="rule-h text-left">
              <th className="p-4 md:p-6 t-micro text-body w-[28px]">#</th>
              <th className="p-4 md:p-6 t-micro text-body">MEDIA</th>
              <th className="p-4 md:p-6 t-micro text-body">NAME</th>
              <th className="p-4 md:p-6 t-micro text-body hidden md:table-cell">
                YEAR
              </th>
              <th className="p-4 md:p-6 t-micro text-body hidden md:table-cell">
                DISCIPLINE
              </th>
              <th className="p-4 md:p-6 t-micro text-body hidden lg:table-cell">
                LINKS TO
              </th>
              <th className="p-4 md:p-6 t-micro text-body text-right">
                ACTIONS
              </th>
            </tr>
          </thead>
          <tbody>
            {tiles.length === 0 && (
              <tr>
                <td colSpan={7} className="p-10 text-center t-body text-body">
                  No tiles yet.{" "}
                  <Link
                    href="/admin/homepage/hero/new"
                    className="text-ink underline"
                  >
                    Create your first one
                  </Link>
                  .
                </td>
              </tr>
            )}
            {tiles.map((t, i) => {
              const study = t.caseStudyId ? studiesById.get(t.caseStudyId) : null;
              return (
                <tr
                  key={t.id}
                  className={`cms-ink-hover ${i < tiles.length - 1 ? "rule-h" : ""}`}
                >
                  <td className="p-4 md:p-6 t-micro text-body tabular-nums align-middle">
                    {String(i + 1).padStart(2, "0")}
                  </td>
                  <td className="p-4 md:p-6 align-middle">
                    <div className="thumb relative h-14 w-20 overflow-hidden bg-mute">
                      <MediaAsset
                        kind={t.mediaKind}
                        url={t.mediaUrl}
                        poster={t.posterUrl}
                        alt={t.name}
                      />
                    </div>
                  </td>
                  <td className="p-4 md:p-6 align-middle">
                    <Link
                      href={`/admin/homepage/hero/${t.id}`}
                      className="t-nav text-ink hover:underline"
                    >
                      {t.name || <em className="text-body">Untitled</em>}
                    </Link>
                  </td>
                  <td className="p-4 md:p-6 t-body text-strong tabular-nums hidden md:table-cell align-middle">
                    {t.year || "—"}
                  </td>
                  <td className="p-4 md:p-6 t-body text-strong hidden md:table-cell align-middle">
                    {t.discipline || "—"}
                  </td>
                  <td className="p-4 md:p-6 t-micro text-body hidden lg:table-cell align-middle">
                    {study ? (
                      <Link
                        href={`/projects/${study.slug}`}
                        target="_blank"
                        className="text-ink hover:underline"
                      >
                        /{study.slug}
                      </Link>
                    ) : (
                      <span className="text-body">—</span>
                    )}
                  </td>
                  <td className="p-4 md:p-6 align-middle">
                    <div className="flex items-center gap-3 justify-end flex-wrap">
                      <form action={moveHeroAction.bind(null, t.id, "up")}>
                        <button
                          type="submit"
                          disabled={i === 0}
                          className="t-micro text-body hover:text-ink disabled:opacity-30"
                          aria-label="Move up"
                        >
                          ↑
                        </button>
                      </form>
                      <form action={moveHeroAction.bind(null, t.id, "down")}>
                        <button
                          type="submit"
                          disabled={i === tiles.length - 1}
                          className="t-micro text-body hover:text-ink disabled:opacity-30"
                          aria-label="Move down"
                        >
                          ↓
                        </button>
                      </form>
                      <Link
                        href={`/admin/homepage/hero/${t.id}`}
                        className="t-micro text-body hover:text-ink"
                      >
                        EDIT
                      </Link>
                      <form action={duplicateHeroAction.bind(null, t.id)}>
                        <button
                          type="submit"
                          className="t-micro text-body hover:text-ink"
                        >
                          DUPLICATE
                        </button>
                      </form>
                      <form
                        action={deleteHeroAction.bind(null, t.id)}
                        className="contents"
                      >
                        <ConfirmDelete title={t.name || "this tile"} />
                      </form>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Frame>
    </div>
  );
}

function Breadcrumb() {
  return (
    <div className="t-micro text-body flex items-center gap-2">
      <Link href="/admin/homepage" className="hover:text-ink">
        / HOMEPAGE
      </Link>
      <span aria-hidden>·</span>
      <span className="text-ink">HERO GRID</span>
    </div>
  );
}
