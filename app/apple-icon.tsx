import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const runtime = "nodejs";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Home-screen icon: same monogram as the favicon, full-bleed (iOS rounds the corners itself). */
export default async function AppleIcon() {
  const bold = await readFile(join(process.cwd(), "app/fonts/Nohemi-ExtraBold.ttf"));
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#000000", color: "#ffffff", fontFamily: "Nohemi", fontWeight: 800, fontSize: 82, letterSpacing: "-0.06em", paddingTop: 8 }}>
        OO
      </div>
    ),
    { ...size, fonts: [{ name: "Nohemi", data: bold, weight: 800, style: "normal" }] },
  );
}
