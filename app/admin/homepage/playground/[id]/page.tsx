import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isAuthed } from "@/lib/auth";
import { getPlaygroundItem } from "@/lib/home-content";
import { PlaygroundForm } from "../playground-form";
import { updatePlaygroundAction } from "@/app/admin/homepage/actions";

export const dynamic = "force-dynamic";

export default async function EditPlaygroundItem({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  if (!(await isAuthed())) redirect("/admin/login");
  const { id } = await params;
  const { saved, error } = await searchParams;

  const item = getPlaygroundItem(id);
  if (!item) notFound();

  return (
    <div className="flex flex-col gap-8">
      <div className="t-micro text-body flex items-center gap-2">
        <Link href="/admin/homepage" className="hover:text-ink">
          / HOMEPAGE
        </Link>
        <span aria-hidden>·</span>
        <Link href="/admin/homepage/playground" className="hover:text-ink">
          PLAYGROUND
        </Link>
        <span aria-hidden>·</span>
        <span className="text-ink">{item.name || "UNTITLED"}</span>
      </div>

      <div className="flex items-baseline justify-between gap-4 flex-wrap">
        <h1 className="t-title text-ink">Edit entry</h1>
        {saved && <span className="t-micro text-ink">SAVED ✓</span>}
        {error === "name" && (
          <span className="t-micro text-red-700">Name required.</span>
        )}
      </div>

      <PlaygroundForm
        action={updatePlaygroundAction.bind(null, item.id)}
        initial={item}
        submitLabel="SAVE CHANGES"
      />
    </div>
  );
}
