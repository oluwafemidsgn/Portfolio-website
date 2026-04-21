import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/auth";
import { PlaygroundForm } from "../playground-form";
import { createPlaygroundAction } from "@/app/admin/homepage/actions";

export const dynamic = "force-dynamic";

export default async function NewPlaygroundItem({
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
        <Link href="/admin/homepage/playground" className="hover:text-ink">
          PLAYGROUND
        </Link>
        <span aria-hidden>·</span>
        <span className="text-ink">NEW ENTRY</span>
      </div>

      <div>
        <h1 className="t-title text-ink">New playground entry</h1>
        {error === "name" && (
          <p className="mt-3 t-body text-red-700">Name is required.</p>
        )}
      </div>

      <PlaygroundForm action={createPlaygroundAction} submitLabel="CREATE ENTRY" />
    </div>
  );
}
