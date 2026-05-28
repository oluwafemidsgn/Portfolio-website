import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/auth";
import { listAll } from "@/lib/case-studies";
import { HeroForm } from "../hero-form";
import { createHeroAction } from "@/app/admin/homepage/actions";

export const dynamic = "force-dynamic";

export default async function NewHeroTile({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (!(await isAuthed())) redirect("/admin/login");
  const { error } = await searchParams;
  const studies = (await listAll()).map((s) => ({
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
        <span className="text-ink">NEW TILE</span>
      </div>

      <div>
        <h1 className="t-title text-ink">New hero tile</h1>
        {error === "name" && (
          <p className="mt-3 t-body text-red-700">Name is required.</p>
        )}
      </div>

      <HeroForm
        action={createHeroAction}
        caseStudies={studies}
        submitLabel="CREATE TILE"
      />
    </div>
  );
}
