"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isAuthed, signIn, signOut } from "@/lib/auth";
import {
  create as repoCreate,
  update as repoUpdate,
  remove as repoRemove,
  duplicate as repoDuplicate,
  setStatus as repoSetStatus,
  getById,
  slugify,
} from "@/lib/case-studies";
import type {
  AccordionItem,
  Block,
  CaseStudyInput,
  Status,
} from "@/lib/types";

async function assertAuth() {
  if (!(await isAuthed())) redirect("/admin/login");
}

function revalidateAll(slug?: string) {
  revalidatePath("/admin");
  revalidatePath("/projects");
  revalidatePath("/");
  if (slug) revalidatePath(`/projects/${slug}`);
}

/**
 * Parses the dynamic accordion/block arrays out of a FormData payload.
 * The admin form submits them as hidden JSON fields (see editor page) so
 * we only need two JSON.parses here — no field-name parsing games.
 */
function parseCaseStudy(form: FormData): CaseStudyInput {
  const title = String(form.get("title") ?? "").trim();
  const slugRaw = String(form.get("slug") ?? "").trim();
  const slug = slugify(slugRaw || title);

  let accordion: AccordionItem[] = [];
  let blocks: Block[] = [];
  try {
    accordion = JSON.parse(String(form.get("accordion") ?? "[]"));
  } catch {
    /* empty on parse error */
  }
  try {
    blocks = JSON.parse(String(form.get("blocks") ?? "[]"));
  } catch {
    /* empty on parse error */
  }

  const status = (String(form.get("status") ?? "draft") as Status) === "published"
    ? "published"
    : "draft";

  return {
    title,
    slug,
    subtitle: String(form.get("subtitle") ?? "").trim(),
    client: String(form.get("client") ?? "").trim(),
    role: String(form.get("role") ?? "").trim(),
    year: String(form.get("year") ?? "").trim(),
    type: String(form.get("type") ?? "").trim(),
    coverImage: String(form.get("coverImage") ?? "").trim(),
    overview: String(form.get("overview") ?? "").trim(),
    accordion,
    blocks,
    status,
  };
}

/* -------------------------------------------------------------------------- */
/* Auth                                                                       */
/* -------------------------------------------------------------------------- */

export async function loginAction(formData: FormData): Promise<void> {
  const password = String(formData.get("password") ?? "");
  const ok = await signIn(password);
  if (!ok) redirect("/admin/login?error=1");
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await signOut();
  redirect("/admin/login");
}

/* -------------------------------------------------------------------------- */
/* CRUD                                                                       */
/* -------------------------------------------------------------------------- */

export async function createCaseStudy(formData: FormData): Promise<void> {
  await assertAuth();
  const input = parseCaseStudy(formData);
  if (!input.title) redirect("/admin/new?error=title");
  const created = repoCreate(input);
  revalidateAll(created.slug);
  redirect(`/admin/${created.id}/edit?saved=1`);
}

export async function updateCaseStudy(
  id: string,
  formData: FormData,
): Promise<void> {
  await assertAuth();
  const input = parseCaseStudy(formData);
  if (!input.title) redirect(`/admin/${id}/edit?error=title`);
  const updated = repoUpdate(id, input);
  if (!updated) redirect("/admin");
  revalidateAll(updated!.slug);
  redirect(`/admin/${id}/edit?saved=1`);
}

export async function deleteCaseStudy(id: string): Promise<void> {
  await assertAuth();
  const existing = getById(id);
  repoRemove(id);
  revalidateAll(existing?.slug);
  redirect("/admin");
}

export async function publishCaseStudy(id: string): Promise<void> {
  await assertAuth();
  const updated = repoSetStatus(id, "published");
  revalidateAll(updated?.slug);
  redirect("/admin");
}

export async function unpublishCaseStudy(id: string): Promise<void> {
  await assertAuth();
  const updated = repoSetStatus(id, "draft");
  revalidateAll(updated?.slug);
  redirect("/admin");
}

/**
 * Clone an existing case study and drop the admin straight into the
 * edit screen for the new copy. The copy is always a draft, so the
 * original stays live on the public site while the clone is being
 * tweaked.
 */
export async function duplicateCaseStudy(id: string): Promise<void> {
  await assertAuth();
  const copy = repoDuplicate(id);
  revalidateAll(copy?.slug);
  if (!copy) redirect("/admin");
  redirect(`/admin/${copy!.id}/edit?saved=1`);
}
