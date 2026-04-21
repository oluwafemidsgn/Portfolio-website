"use client";

export type CanvasBg = {
  id: string;
  label: string;
  /** CSS color. Can be a hex, named color, or a `var(--…)` token. */
  value: string;
};

/**
 * First entry is the default. `var(--color-paper)` lets the canvas
 * track the active theme — paper in light mode, near-black in dark
 * mode. The rest are deliberate accent colours that read well on both
 * themes.
 */
export const CANVAS_BGS: CanvasBg[] = [
  { id: "paper", label: "Paper", value: "var(--color-paper)" },
  { id: "ink", label: "Ink", value: "var(--color-ink)" },
  { id: "bone", label: "Bone", value: "#f3efe6" },
  { id: "sand", label: "Sand", value: "#e8dcc3" },
  { id: "pool", label: "Pool", value: "#cfe3e8" },
  { id: "sun", label: "Sun", value: "#f7d488" },
  { id: "bloom", label: "Bloom", value: "#f0b7c2" },
];

export function ColorPalette({
  value,
  onChange,
}: {
  value: CanvasBg;
  onChange: (bg: CanvasBg) => void;
}) {
  return (
    <div
      className="flex items-center gap-1 border border-[var(--rule)] p-1 bg-paper"
      role="radiogroup"
      aria-label="Canvas background"
    >
      {CANVAS_BGS.map((bg) => {
        const selected = bg.id === value.id;
        return (
          <button
            key={bg.id}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={bg.label}
            title={bg.label}
            onClick={() => onChange(bg)}
            data-cursor="zoom"
            className={
              "relative h-6 w-6 outline-none transition-transform " +
              (selected
                ? "ring-1 ring-offset-2 ring-offset-[var(--color-paper)] ring-ink scale-100"
                : "hover:scale-110")
            }
            style={{ backgroundColor: bg.value }}
          >
            {/* A thin interior ring helps white-on-white / black-on-black
                swatches stay visible against the toolbar. */}
            <span
              aria-hidden
              className="absolute inset-0 border border-[var(--rule)]"
            />
          </button>
        );
      })}
    </div>
  );
}
