import { ImageResponse } from "next/og";
import { OG_PORTRAIT, ShareCard, ogFonts } from "@/lib/og";
import { AVAILABILITY, SITE_NAME, SITE_ROLE } from "@/lib/site";

export const runtime = "nodejs";
export const alt = `Oduneye Oluwafemi — ${SITE_ROLE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    <ShareCard eyebrow={SITE_NAME} title={SITE_ROLE} meta={["Lagos, Nigeria", AVAILABILITY]} photo={OG_PORTRAIT} />,
    { ...size, fonts: await ogFonts() },
  );
}
