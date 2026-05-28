import { notFound, redirect } from "next/navigation";
import { isAuthed } from "@/lib/auth";
import { getById } from "@/lib/case-studies";
import { updateCaseStudy } from "../../actions";
import { EditorForm } from "../../editor-form";

type Params = Promise<{ id: string }>;
type SP = Promise<{ saved?: string }>;

export default async function EditCaseStudyPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SP;
}) {
  if (!(await isAuthed())) redirect("/admin/login");
  const { id } = await params;
  const { saved } = await searchParams;
  const study = await getById(id);
  if (!study) notFound();

  const bound = async (formData: FormData) => {
    "use server";
    await updateCaseStudy(id, formData);
  };

  const previewHref =
    study!.status === "published" ? `/projects/${study!.slug}` : null;

  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="t-micro text-body">/ EDIT</div>
          <h1 className="t-title text-ink mt-4">{study!.title || "Untitled"}</h1>
          <p className="mt-3 t-micro text-body">
            /{study!.slug} · updated {formatDate(study!.updatedAt)}
          </p>
        </div>
      </div>
      <EditorForm
        id={id}
        action={bound}
        initial={study!}
        saved={saved === "1"}
        previewHref={previewHref}
      />
    </div>
  );
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toISOString().slice(0, 10).replace(/-/g, ".");
  } catch {
    return "—";
  }
}
