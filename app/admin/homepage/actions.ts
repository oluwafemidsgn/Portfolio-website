"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isAuthed } from "@/lib/auth";
import {
  createHeroProject,
  updateHeroProject,
  removeHeroProject,
  duplicateHeroProject,
  moveHeroProject,
  createPlaygroundItem,
  updatePlaygroundItem,
  removePlaygroundItem,
  duplicatePlaygroundItem,
  movePlaygroundItem,
  createRecommendation,
  updateRecommendation,
  removeRecommendation,
  duplicateRecommendation,
  moveRecommendation,
} from "@/lib/home-content";
import type {
  HeroProjectInput,
  MediaKind,
  PlaygroundItemInput,
  RecommendationInput,
} from "@/lib/types";

async function assertAuth() {
  if (!(await isAuthed())) redirect("/admin/login");
}

/**
 * Blast the home-page cache every time anything changes. Keeps edits
 * instantly visible on localhost and on a hosted deploy alike.
 */
function revalidateHome() {
  revalidatePath("/");
  revalidatePath("/playground");
  revalidatePath("/admin/homepage");
}

function mediaKind(v: unknown): MediaKind {
  const s = String(v ?? "").toLowerCase();
  if (s === "video" || s === "gif") return s;
  return "image";
}

function num(v: FormDataEntryValue | null, fallback: number): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

/* -------------------------------------------------------------------------- */
/* Hero projects                                                              */
/* -------------------------------------------------------------------------- */

function parseHero(form: FormData): HeroProjectInput {
  const caseStudyId = String(form.get("caseStudyId") ?? "").trim();
  return {
    year: String(form.get("year") ?? "").trim(),
    name: String(form.get("name") ?? "").trim(),
    discipline: String(form.get("discipline") ?? "").trim(),
    mediaKind: mediaKind(form.get("mediaKind")),
    mediaUrl: String(form.get("mediaUrl") ?? "").trim(),
    posterUrl: String(form.get("posterUrl") ?? "").trim(),
    caseStudyId: caseStudyId || null,
    displayOrder: num(form.get("displayOrder"), 0),
  };
}

export async function createHeroAction(formData: FormData): Promise<void> {
  await assertAuth();
  const input = parseHero(formData);
  if (!input.name) redirect("/admin/homepage/hero/new?error=name");
  // Force a tail-of-list displayOrder for new rows — the repo handles the
  // max+1 lookup when displayOrder is a negative number.
  await createHeroProject({ ...input, displayOrder: -1 });
  revalidateHome();
  redirect("/admin/homepage/hero?saved=1");
}

export async function updateHeroAction(
  id: string,
  formData: FormData,
): Promise<void> {
  await assertAuth();
  const input = parseHero(formData);
  if (!input.name) redirect(`/admin/homepage/hero/${id}?error=name`);
  await updateHeroProject(id, input);
  revalidateHome();
  redirect(`/admin/homepage/hero/${id}?saved=1`);
}

export async function deleteHeroAction(id: string): Promise<void> {
  await assertAuth();
  await removeHeroProject(id);
  revalidateHome();
  redirect("/admin/homepage/hero");
}

export async function moveHeroAction(
  id: string,
  dir: "up" | "down",
): Promise<void> {
  await assertAuth();
  await moveHeroProject(id, dir);
  revalidateHome();
  redirect("/admin/homepage/hero");
}

export async function duplicateHeroAction(id: string): Promise<void> {
  await assertAuth();
  await duplicateHeroProject(id);
  revalidateHome();
  redirect("/admin/homepage/hero?saved=1");
}

/* -------------------------------------------------------------------------- */
/* Playground                                                                 */
/* -------------------------------------------------------------------------- */

function parsePlayground(form: FormData): PlaygroundItemInput {
  return {
    date: String(form.get("date") ?? "").trim(),
    name: String(form.get("name") ?? "").trim(),
    label: String(form.get("label") ?? "").trim(),
    mediaKind: mediaKind(form.get("mediaKind")),
    mediaUrl: String(form.get("mediaUrl") ?? "").trim(),
    posterUrl: String(form.get("posterUrl") ?? "").trim(),
    liveUrl: String(form.get("liveUrl") ?? "").trim(),
    displayOrder: num(form.get("displayOrder"), 0),
  };
}

export async function createPlaygroundAction(formData: FormData): Promise<void> {
  await assertAuth();
  const input = parsePlayground(formData);
  if (!input.name) redirect("/admin/homepage/playground/new?error=name");
  await createPlaygroundItem({ ...input, displayOrder: -1 });
  revalidateHome();
  redirect("/admin/homepage/playground?saved=1");
}

export async function updatePlaygroundAction(
  id: string,
  formData: FormData,
): Promise<void> {
  await assertAuth();
  const input = parsePlayground(formData);
  if (!input.name) redirect(`/admin/homepage/playground/${id}?error=name`);
  await updatePlaygroundItem(id, input);
  revalidateHome();
  redirect(`/admin/homepage/playground/${id}?saved=1`);
}

export async function deletePlaygroundAction(id: string): Promise<void> {
  await assertAuth();
  await removePlaygroundItem(id);
  revalidateHome();
  redirect("/admin/homepage/playground");
}

export async function movePlaygroundAction(
  id: string,
  dir: "up" | "down",
): Promise<void> {
  await assertAuth();
  await movePlaygroundItem(id, dir);
  revalidateHome();
  redirect("/admin/homepage/playground");
}

export async function duplicatePlaygroundAction(id: string): Promise<void> {
  await assertAuth();
  await duplicatePlaygroundItem(id);
  revalidateHome();
  redirect("/admin/homepage/playground?saved=1");
}

/* -------------------------------------------------------------------------- */
/* Recommendations                                                            */
/* -------------------------------------------------------------------------- */

function parseRecommendation(form: FormData): RecommendationInput {
  return {
    quote: String(form.get("quote") ?? "").trim(),
    author: String(form.get("author") ?? "").trim(),
    role: String(form.get("role") ?? "").trim(),
    company: String(form.get("company") ?? "").trim(),
    avatarUrl: String(form.get("avatarUrl") ?? "").trim(),
    displayOrder: num(form.get("displayOrder"), 0),
  };
}

export async function createRecommendationAction(
  formData: FormData,
): Promise<void> {
  await assertAuth();
  const input = parseRecommendation(formData);
  if (!input.quote || !input.author) {
    redirect("/admin/homepage/recommendations/new?error=required");
  }
  await createRecommendation({ ...input, displayOrder: -1 });
  revalidateHome();
  redirect("/admin/homepage/recommendations?saved=1");
}

export async function updateRecommendationAction(
  id: string,
  formData: FormData,
): Promise<void> {
  await assertAuth();
  const input = parseRecommendation(formData);
  if (!input.quote || !input.author) {
    redirect(`/admin/homepage/recommendations/${id}?error=required`);
  }
  await updateRecommendation(id, input);
  revalidateHome();
  redirect(`/admin/homepage/recommendations/${id}?saved=1`);
}

export async function deleteRecommendationAction(id: string): Promise<void> {
  await assertAuth();
  await removeRecommendation(id);
  revalidateHome();
  redirect("/admin/homepage/recommendations");
}

export async function moveRecommendationAction(
  id: string,
  dir: "up" | "down",
): Promise<void> {
  await assertAuth();
  await moveRecommendation(id, dir);
  revalidateHome();
  redirect("/admin/homepage/recommendations");
}

export async function duplicateRecommendationAction(id: string): Promise<void> {
  await assertAuth();
  await duplicateRecommendation(id);
  revalidateHome();
  redirect("/admin/homepage/recommendations?saved=1");
}
