import type { MetadataRoute } from "next";
import { listPublished } from "@/lib/case-studies";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = ["", "/projects", "/about", "/playground", "/contact"].map((p) => ({
    url: `${SITE_URL}${p}`,
    changeFrequency: "monthly" as const,
    priority: p === "" ? 1 : 0.8,
  }));
  const studies = (await listPublished())
    .filter((s) => !s.comingSoon)
    .map((s) => ({
      url: `${SITE_URL}/projects/${s.slug}`,
      lastModified: new Date(s.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    }));
  return [...pages, ...studies];
}
