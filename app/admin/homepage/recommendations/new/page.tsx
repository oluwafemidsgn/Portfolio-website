import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/auth";
import { RecommendationForm } from "../recommendation-form";
import { createRecommendationAction } from "@/app/admin/homepage/actions";

export const dynamic = "force-dynamic";

export default async function NewRecommendation({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (!(await isAuthed())) redirect("/admin/login");
  const { error } = await searchParams;

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
        <span className="text-ink">NEW QUOTE</span>
      </div>

      <div>
        <h1 className="t-title text-ink">New recommendation</h1>
        {error === "required" && (
          <p className="mt-3 t-body text-red-700">
            Quote and author are both required.
          </p>
        )}
      </div>

      <RecommendationForm
        action={createRecommendationAction}
        submitLabel="ADD QUOTE"
      />
    </div>
  );
}
