import { ImageResponse } from "next/og";
import { ShareCard, ogFonts } from "@/lib/og";
import { getBySlug } from "@/lib/case-studies";

export const runtime = "nodejs";
export const alt = "Case study — Oduneye Oluwafemi";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = await getBySlug(slug);
  return new ImageResponse(
    <ShareCard
      eyebrow="Case study"
      title={study?.title ?? "Case study"}
      meta={[study?.type || "Design", study?.year || ""]}
    />,
    { ...size, fonts: await ogFonts() },
  );
}
