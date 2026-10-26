import { readFile } from "node:fs/promises";
import { join } from "node:path";

/** Nohemi for generated images (favicon, share cards). */
export async function ogFonts() {
  const dir = join(process.cwd(), "app/fonts");
  const [bold, medium] = await Promise.all([
    readFile(join(dir, "Nohemi-ExtraBold.ttf")),
    readFile(join(dir, "Nohemi-Medium.ttf")),
  ]);
  return [
    { name: "Nohemi", data: bold, weight: 800 as const, style: "normal" as const },
    { name: "Nohemi", data: medium, weight: 500 as const, style: "normal" as const },
  ];
}

/** Smiling portrait, cropped to the share card's photo panel around the face. */
export const OG_PORTRAIT = "https://res.cloudinary.com/dognbegiw/image/upload/c_thumb,g_face,z_0.45,w_400,h_558,f_jpg,q_85/portfolio/about/portrait-smile.jpg";

/**
 * The share card: paper ground, hairline frame, the site's micro labels and extra-bold display type.
 * Pass `photo` to add a portrait panel on the right.
 */
export function ShareCard({ eyebrow, title, meta, photo }: { eyebrow: string; title: string; meta: [string, string]; photo?: string }) {
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", background: "#ffffff", padding: 36, fontFamily: "Nohemi" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", border: "1px solid #e5e5e5", borderRight: photo ? "none" : "1px solid #e5e5e5", padding: "40px 48px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20, fontWeight: 500, color: "#bcbcbc", letterSpacing: "0.01em", textTransform: "uppercase" }}>
          <span>{eyebrow}</span>
          {!photo && <span>Oduneye Oluwafemi</span>}
        </div>
        <div style={{ display: "flex", fontSize: title.length > 26 ? 92 : 120, fontWeight: 800, lineHeight: 0.92, letterSpacing: "-0.02em", textTransform: "uppercase", color: "#000000", maxWidth: photo ? 620 : 1000 }}>
          {title}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, fontWeight: 500, color: "#484848", textTransform: "uppercase" }}>
          <span>{meta[0]}</span>
          <span>{meta[1]}</span>
        </div>
      </div>
      {photo && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photo} width={400} height={558} alt="" style={{ objectFit: "cover" }} />
      )}
    </div>
  );
}
