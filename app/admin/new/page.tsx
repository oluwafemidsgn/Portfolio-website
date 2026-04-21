import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/auth";
import { createCaseStudy } from "../actions";
import { EditorForm } from "../editor-form";

export default async function NewCaseStudyPage() {
  if (!(await isAuthed())) redirect("/admin/login");
  return (
    <div className="flex flex-col gap-10">
      <div>
        <div className="t-micro text-body">/ NEW</div>
        <h1 className="t-title text-ink mt-4">Create a case study</h1>
      </div>
      <EditorForm action={createCaseStudy} />
    </div>
  );
}
