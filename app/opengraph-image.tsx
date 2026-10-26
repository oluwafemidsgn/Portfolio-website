import { ImageResponse } from "next/og";
import { ShareCard, ogFonts } from "@/lib/og";
import { SITE_ROLE } from "@/lib/site";

export const runtime = "nodejs";
export const alt = `Oduneye Oluwafemi — ${SITE_ROLE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    <ShareCard eyebrow="Portfolio" title={SITE_ROLE} meta={["Lagos, Nigeria", "Open to freelance"]} />,
    { ...size, fonts: await ogFonts() },
  );
}
