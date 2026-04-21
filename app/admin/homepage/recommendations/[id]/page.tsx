import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isAuthed } from "@/lib/auth";
import { getRecommendation } from "@/lib/home-content";
import { RecommendationForm } from "../recommendation-form";
import { updateRecommendationAction } from "@/app/admin/homepage/actions";

export const dynamic = "force-dynamic";

export default async function EditRecommendation({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  if (!(await isAuthed())) redirect("/admin/login");
  const { id } = await params;
  const { saved, error } = await searchParams;

  const rec = getRecommendation(id);
  if (!rec) notFound();

  return (
    <div className="flex flex-col gap-8">
      <div className="t-micro text-body flex items-center gap-2">
        <Link href="/admin/homepage" className="hover:text-ink">
          / HOMEPAGE
        </Link>
        <span aria-hidden>·</span>
        <Link href="/admin/homepage/recommendations" className="hover:text-ink">
          RECOMMENDATIONS
        </Link>
        <span aria-hidden>·</span>
        <span className="text-ink">{rec.author || "UNTITLED"}</span>
      </div>

      <div className="flex items-baseline justify-between gap-4 flex-wrap">
        <h1 className="t-title text-ink">Edit recommendation</h1>
        {saved && <span className="t-micro text-ink">SAVED ✓</span>}
        {error === "required" && (
          <span className="t-micro text-red-700">
            Quote and author required.
          </span>
        )}
      </div>

      <RecommendationForm
        action={updateRecommendationAction.bind(null, rec.id)}
        initial={rec}
        submitLabel="SAVE CHANGES"
      />
    </div>
  );
}
