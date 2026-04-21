"use client";

import { useState } from "react";
import type { PlaygroundItem } from "@/lib/types";
import { MediaAsset } from "@/components/media-asset";

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  initial?: PlaygroundItem;
  submitLabel?: string;
};

const INPUT =
  "w-full bg-paper border border-[var(--rule)] px-4 py-3 t-body text-ink outline-none focus:border-ink transition-colors";
const LABEL = "t-micro text-body";

export function PlaygroundForm({ action, initial, submitLabel = "SAVE" }: Props) {
  const [mediaKind, setMediaKind] = useState<PlaygroundItem["mediaKind"]>(
    initial?.mediaKind ?? "image",
  );
  const [mediaUrl, setMediaUrl] = useState(initial?.mediaUrl ?? "");
  const [posterUrl, setPosterUrl] = useState(initial?.posterUrl ?? "");
  const [date, setDate] = useState(initial?.date ?? "");
  const [name, setName] = useState(initial?.name ?? "");
  const [label, setLabel] = useState(initial?.label ?? "Experiment");
  const [liveUrl, setLiveUrl] = useState(initial?.liveUrl ?? "");

  return (
    <form action={action} className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4">
          <Field label="DATE">
            <input
              name="date"
              className={INPUT}
              placeholder="2025.02"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </Field>
          <Field label="NAME">
            <input
              name="name"
              className={INPUT}
              placeholder="ORBITS"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Field>
        </div>

        <Field label="LABEL">
          <input
            name="label"
            className={INPUT}
            placeholder="Experiment / 3D sketch / Type study…"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </Field>

        <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-4">
          <Field label="MEDIA KIND">
            <select
              name="mediaKind"
              className={INPUT}
              value={mediaKind}
              onChange={(e) =>
                setMediaKind(e.target.value as PlaygroundItem["mediaKind"])
              }
            >
              <option value="image">Image</option>
              <option value="gif">GIF</option>
              <option value="video">Video</option>
            </select>
          </Field>
          <Field label="MEDIA URL">
            <input
              name="mediaUrl"
              className={INPUT}
              placeholder="https://cdn.../orbits.mp4"
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
            />
          </Field>
        </div>

        {mediaKind === "video" && (
          <Field label="POSTER URL (video thumbnail)">
            <input
              name="posterUrl"
              className={INPUT}
              placeholder="https://cdn.../orbits-poster.jpg"
              value={posterUrl}
              onChange={(e) => setPosterUrl(e.target.value)}
            />
          </Field>
        )}

        <Field label="LIVE URL (optional — opens on the playground page)">
          <input
            name="liveUrl"
            className={INPUT}
            placeholder="https://orbits.example.com"
            value={liveUrl}
            onChange={(e) => setLiveUrl(e.target.value)}
            type="url"
          />
        </Field>

        <div className="flex items-center justify-between pt-4 border-t border-[var(--rule)]">
          <span className="t-micro text-body">
            Order is controlled from the list page — use the ↑ ↓ arrows.
          </span>
          <button
            type="submit"
            className="bg-ink text-paper px-6 py-3 t-nav hover:opacity-90 transition-opacity"
          >
            {submitLabel}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <span className={LABEL}>PREVIEW</span>
        <div className="border border-[var(--rule)] p-2">
          <div className="thumb w-full aspect-[432/298] overflow-hidden relative bg-mute">
            <MediaAsset
              kind={mediaKind}
              url={mediaUrl}
              poster={posterUrl}
              alt={name}
            />
          </div>
          <div className="mt-2 flex items-center justify-between t-micro">
            <span className="text-mute tabular-nums">{date || "0000.00"}</span>
            <span className="text-strong text-right truncate max-w-[70%]">
              {(name || "UNTITLED").toUpperCase()} | {label || "—"}
            </span>
          </div>
        </div>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className={LABEL}>{label}</span>
      {children}
    </label>
  );
}
