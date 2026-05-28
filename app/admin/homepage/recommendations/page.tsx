import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/auth";
import { ensureSeed } from "@/lib/seed";
import { listRecommendations } from "@/lib/home-content";
import { Frame } from "@/components/motion/frame";
import {
  deleteRecommendationAction,
  duplicateRecommendationAction,
  moveRecommendationAction,
} from "@/app/admin/homepage/actions";
import { ConfirmDelete } from "@/app/admin/confirm-delete";

export const dynamic = "force-dynamic";

export default async function RecommendationsAdminList() {
  if (!(await isAuthed())) redirect("/admin/login");
  await ensureSeed();

  const items = await listRecommendations();

  return (
    <div className="flex flex-col gap-10">
      <div className="t-micro text-body flex items-center gap-2">
        <Link href="/admin/homepage" className="hover:text-ink">
          / HOMEPAGE
        </Link>
        <span aria-hidden>·</span>
        <span className="text-ink">RECOMMENDATIONS</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 items-end">
        <div>
          <h1 className="t-title text-ink">Recommendations</h1>
          <p className="mt-4 t-body text-body max-w-[56ch]">
            Quotes from clients and collaborators. Rendered below the Playground
            section on the home page as a navigable carousel.
          </p>
        </div>
        <Link
          href="/admin/homepage/recommendations/new"
          className="bg-ink text-paper px-5 py-3 t-nav hover:opacity-90 transition-opacity justify-self-start lg:justify-self-end"
        >
          NEW QUOTE +
        </Link>
      </div>

      <Frame>
        <div className="flex flex-col">
          {items.length === 0 && (
            <div className="p-10 text-center t-body text-body">
              No recommendations yet.{" "}
              <Link
                href="/admin/homepage/recommendations/new"
                className="text-ink underline"
              >
                Add your first one
              </Link>
              .
            </div>
          )}
          {items.map((r, i) => (
            <div
              key={r.id}
              className={`cms-ink-hover p-6 md:p-8 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 ${
                i < items.length - 1 ? "rule-h" : ""
              }`}
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 t-micro text-body tabular-nums">
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <span aria-hidden>·</span>
                  <span className="text-ink">{r.author || "—"}</span>
                  {(r.role || r.company) && (
                    <>
                      <span aria-hidden>·</span>
                      <span>{[r.role, r.company].filter(Boolean).join(", ")}</span>
                    </>
                  )}
                </div>
                <p className="t-lead text-strong max-w-[72ch] leading-snug">
                  &ldquo;{r.quote || "—"}&rdquo;
                </p>
              </div>
              <div className="flex items-start gap-3 lg:flex-col lg:items-end">
                <div className="flex items-center gap-3">
                  <form
                    action={moveRecommendationAction.bind(null, r.id, "up")}
                  >
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
                    action={moveRecommendationAction.bind(null, r.id, "down")}
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
                </div>
                <div className="flex items-center gap-3">
                  <Link
                    href={`/admin/homepage/recommendations/${r.id}`}
                    className="t-micro text-body hover:text-ink"
                  >
                    EDIT
                  </Link>
                  <form
                    action={duplicateRecommendationAction.bind(null, r.id)}
                  >
                    <button
                      type="submit"
                      className="t-micro text-body hover:text-ink"
                    >
                      DUPLICATE
                    </button>
                  </form>
                  <form
                    action={deleteRecommendationAction.bind(null, r.id)}
                    className="contents"
                  >
                    <ConfirmDelete
                      title={r.author ? `${r.author}'s quote` : "this quote"}
                    />
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Frame>
    </div>
  );
}
