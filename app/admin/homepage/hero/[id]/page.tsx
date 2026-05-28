import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isAuthed } from "@/lib/auth";
import { listAll } from "@/lib/case-studies";
import { getHeroProject } from "@/lib/home-content";
import { HeroForm } from "../hero-form";
import { updateHeroAction } from "@/app/admin/homepage/actions";

export const dynamic = "force-dynamic";

export default async function EditHeroTile({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  if (!(await isAuthed())) redirect("/admin/login");
  const { id } = await params;
  const { saved, error } = await searchParams;

  const [tile, allStudies] = await Promise.all([getHeroProject(id), listAll()]);
  if (!tile) notFound();

  const studies = allStudies.map((s) => ({
    id: s.id,
    title: s.title,
    status: s.status,
  }));

  return (
    <div className="flex flex-col gap-8">
      <div className="t-micro text-body flex items-center gap-2">
        <Link href="/admin/homepage" className="hover:text-ink">
          / HOMEPAGE
        </Link>
        <span aria-hidden>·</span>
        <Link href="/admin/homepage/hero" className="hover:text-ink">
          HERO GRID
        </Link>
        <span aria-hidden>·</span>
        <span className="text-ink">{tile.name || "UNTITLED"}</span>
      </div>

      <div className="flex items-baseline justify-between gap-4 flex-wrap">
        <h1 className="t-title text-ink">Edit tile</h1>
        {saved && (
          <span className="t-micro text-ink">SAVED ✓</span>
        )}
        {error === "name" && (
          <span className="t-micro text-red-700">Name required.</span>
        )}
      </div>

      <HeroForm
        action={updateHeroAction.bind(null, tile.id)}
        initial={tile}
        caseStudies={studies}
        submitLabel="SAVE CHANGES"
      />
    </div>
  );
}
