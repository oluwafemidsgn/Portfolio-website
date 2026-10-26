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

/** The share card: paper ground, hairline frame, the site's micro labels and extra-bold display type. */
export function ShareCard({ eyebrow, title, meta }: { eyebrow: string; title: string; meta: [string, string] }) {
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", background: "#ffffff", padding: 36, fontFamily: "Nohemi" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", border: "1px solid #e5e5e5", padding: "40px 48px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20, fontWeight: 500, color: "#bcbcbc", letterSpacing: "0.01em", textTransform: "uppercase" }}>
          <span>{eyebrow}</span>
          <span>Oduneye Oluwafemi</span>
        </div>
        <div style={{ display: "flex", fontSize: title.length > 26 ? 92 : 120, fontWeight: 800, lineHeight: 0.92, letterSpacing: "-0.02em", textTransform: "uppercase", color: "#000000", maxWidth: 1000 }}>
          {title}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, fontWeight: 500, color: "#484848", textTransform: "uppercase" }}>
          <span>{meta[0]}</span>
          <span>{meta[1]}</span>
        </div>
      </div>
    </div>
  );
}
