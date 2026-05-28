import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/auth";
import { ensureSeed } from "@/lib/seed";
import { listPlaygroundItems } from "@/lib/home-content";
import { Frame } from "@/components/motion/frame";
import { MediaAsset } from "@/components/media-asset";
import {
  deletePlaygroundAction,
  duplicatePlaygroundAction,
  movePlaygroundAction,
} from "@/app/admin/homepage/actions";
import { ConfirmDelete } from "@/app/admin/confirm-delete";

export const dynamic = "force-dynamic";

export default async function PlaygroundAdminList() {
  if (!(await isAuthed())) redirect("/admin/login");
  await ensureSeed();

  const items = await listPlaygroundItems();

  return (
    <div className="flex flex-col gap-10">
      <div className="t-micro text-body flex items-center gap-2">
        <Link href="/admin/homepage" className="hover:text-ink">
          / HOMEPAGE
        </Link>
        <span aria-hidden>·</span>
        <span className="text-ink">PLAYGROUND</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 items-end">
        <div>
          <h1 className="t-title text-ink">Playground</h1>
          <p className="mt-4 t-body text-body max-w-[56ch]">
            Short, undated experiments that sit under the Projects section on
            the home page. Reorder with the ↑ ↓ arrows — first is the oldest in
            the 2×2 grid.
          </p>
        </div>
        <Link
          href="/admin/homepage/playground/new"
          className="bg-ink text-paper px-5 py-3 t-nav hover:opacity-90 transition-opacity justify-self-start lg:justify-self-end"
        >
          NEW ENTRY +
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
                DATE
              </th>
              <th className="p-4 md:p-6 t-micro text-body hidden md:table-cell">
                LABEL
              </th>
              <th className="p-4 md:p-6 t-micro text-body text-right">
                ACTIONS
              </th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr>
                <td colSpan={6} className="p-10 text-center t-body text-body">
                  No playground entries yet.{" "}
                  <Link
                    href="/admin/homepage/playground/new"
                    className="text-ink underline"
                  >
                    Create your first one
                  </Link>
                  .
                </td>
              </tr>
            )}
            {items.map((p, i) => (
              <tr
                key={p.id}
                className={`cms-ink-hover ${i < items.length - 1 ? "rule-h" : ""}`}
              >
                <td className="p-4 md:p-6 t-micro text-body tabular-nums align-middle">
                  {String(i + 1).padStart(2, "0")}
                </td>
                <td className="p-4 md:p-6 align-middle">
                  <div className="thumb relative h-14 w-20 overflow-hidden bg-mute">
                    <MediaAsset
                      kind={p.mediaKind}
                      url={p.mediaUrl}
                      poster={p.posterUrl}
                      alt={p.name}
                    />
                  </div>
                </td>
                <td className="p-4 md:p-6 align-middle">
                  <Link
                    href={`/admin/homepage/playground/${p.id}`}
                    className="t-nav text-ink hover:underline"
                  >
                    {p.name || <em className="text-body">Untitled</em>}
                  </Link>
                </td>
                <td className="p-4 md:p-6 t-body text-strong tabular-nums hidden md:table-cell align-middle">
                  {p.date || "—"}
                </td>
                <td className="p-4 md:p-6 t-body text-strong hidden md:table-cell align-middle">
                  {p.label || "—"}
                </td>
                <td className="p-4 md:p-6 align-middle">
                  <div className="flex items-center gap-3 justify-end flex-wrap">
                    <form action={movePlaygroundAction.bind(null, p.id, "up")}>
                      <button
                        type="submit"
                        disabled={i === 0}
                        className="t-micro text-body hover:text-ink disabled:opacity-30"
                        aria-label="Move up"
                      >
                        ↑
                      </button>
                    </form>
                    <form
                      action={movePlaygroundAction.bind(null, p.id, "down")}
                    >
                      <button
                        type="submit"
                        disabled={i === items.length - 1}
                        className="t-micro text-body hover:text-ink disabled:opacity-30"
                        aria-label="Move down"
                      >
                        ↓
                      </button>
                    </form>
                    <Link
                      href={`/admin/homepage/playground/${p.id}`}
                      className="t-micro text-body hover:text-ink"
                    >
                      EDIT
                    </Link>
                    <form action={duplicatePlaygroundAction.bind(null, p.id)}>
                      <button
                        type="submit"
                        className="t-micro text-body hover:text-ink"
                      >
                        DUPLICATE
                      </button>
                    </form>
                    <form
                      action={deletePlaygroundAction.bind(null, p.id)}
                      className="contents"
                    >
                      <ConfirmDelete title={p.name || "this entry"} />
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
