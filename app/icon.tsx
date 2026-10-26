import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const runtime = "nodejs";
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** Favicon: black tile, white "OO" monogram in Nohemi ExtraBold — reads in light and dark tab bars. */
export default async function Icon() {
  const bold = await readFile(join(process.cwd(), "app/fonts/Nohemi-ExtraBold.ttf"));
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#000000", borderRadius: 14, color: "#ffffff", fontFamily: "Nohemi", fontWeight: 800, fontSize: 30, letterSpacing: "-0.06em", paddingTop: 3 }}>
        OO
      </div>
    ),
    { ...size, fonts: [{ name: "Nohemi", data: bold, weight: 800, style: "normal" }] },
  );
}
