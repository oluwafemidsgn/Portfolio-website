"use client";

import { useState } from "react";
import type { HeroProject } from "@/lib/types";
import { MediaAsset } from "@/components/media-asset";
import { UploadButton } from "@/app/admin/upload-button";
import { resolveMediaKind } from "@/lib/media";

type CaseStudyOption = { id: string; title: string; status: string };

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  initial?: HeroProject;
  caseStudies: CaseStudyOption[];
  submitLabel?: string;
};

const INPUT =
  "w-full bg-paper border border-[var(--rule)] px-4 py-3 t-body text-ink outline-none focus:border-ink transition-colors";

const LABEL = "t-micro text-body";

/**
 * Client form for creating/editing hero tiles. Mirrors the case-study
 * editor's visual language so the whole admin reads as one tool.
 *
 * The preview panel on the right stays reactive to form state so the
 * admin can see what they're typing before they save.
 */
export function HeroForm({
  action,
  initial,
  caseStudies,
  submitLabel = "SAVE",
}: Props) {
  const [mediaKind, setMediaKind] = useState<HeroProject["mediaKind"]>(
    initial?.mediaKind ?? "image",
  );
  const [mediaUrl, setMediaUrl] = useState(initial?.mediaUrl ?? "");
  const [posterUrl, setPosterUrl] = useState(initial?.posterUrl ?? "");
  const [year, setYear] = useState(initial?.year ?? "");
  const [name, setName] = useState(initial?.name ?? "");
  const [discipline, setDiscipline] = useState(initial?.discipline ?? "");
  const [caseStudyId, setCaseStudyId] = useState(initial?.caseStudyId ?? "");
  const [comingSoon, setComingSoon] = useState(initial?.comingSoon ?? false);

  return (
    <form action={action} className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
      {comingSoon && <input type="hidden" name="comingSoon" value="on" />}
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4">
          <Field label="YEAR">
            <input
              name="year"
              className={INPUT}
              placeholder="2025.02"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
          </Field>
          <Field label="NAME">
            <input
              name="name"
              className={INPUT}
              placeholder="LUMEN"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Field>
        </div>

        <Field label="DISCIPLINE">
          <input
            name="discipline"
            className={INPUT}
            placeholder="Brand identity"
            value={discipline}
            onChange={(e) => setDiscipline(e.target.value)}
          />
        </Field>

        <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-4">
          <Field label="MEDIA KIND">
            <select
              name="mediaKind"
              className={INPUT}
              value={mediaKind}
              onChange={(e) =>
                setMediaKind(e.target.value as HeroProject["mediaKind"])
              }
            >
              <option value="image">Image</option>
              <option value="gif">GIF</option>
              <option value="video">Video</option>
            </select>
          </Field>
          <Field label="MEDIA URL">
            <div className="flex flex-wrap gap-2">
              <input
                name="mediaUrl"
                className={`${INPUT} flex-1 min-w-0`}
                placeholder="https://cdn.../lumen.jpg"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
              />
              <UploadButton
                onUploaded={(url) => {
                  setMediaUrl(url);
                  setMediaKind((k) => resolveMediaKind(k, url));
                }}
              />
            </div>
          </Field>
        </div>

        {mediaKind === "video" && (
          <Field label="POSTER URL (video thumbnail)">
            <div className="flex flex-wrap gap-2">
              <input
                name="posterUrl"
                className={`${INPUT} flex-1 min-w-0`}
                placeholder="https://cdn.../lumen-poster.jpg"
                value={posterUrl}
                onChange={(e) => setPosterUrl(e.target.value)}
              />
              <UploadButton accept="image" onUploaded={setPosterUrl} />
            </div>
          </Field>
        )}

        <Field label="LINKED CASE STUDY (optional)">
          <select
            name="caseStudyId"
            className={INPUT}
            value={caseStudyId ?? ""}
            onChange={(e) => setCaseStudyId(e.target.value)}
          >
            <option value="">— No link (non-clickable tile)</option>
            {caseStudies.map((cs) => (
              <option key={cs.id} value={cs.id}>
                {cs.title}
                {cs.status === "draft" ? " (draft)" : ""}
              </option>
            ))}
          </select>
        </Field>

        <div className="flex items-center justify-between gap-4 flex-wrap border border-[var(--rule)] p-4">
          <div className="flex flex-col gap-1">
            <span className={LABEL}>COMING SOON</span>
            <span className="t-micro text-body">
              Shows the tile with a COMING SOON badge and removes the link.
            </span>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={comingSoon}
            onClick={() => setComingSoon(!comingSoon)}
            title="Show the thumbnail with a COMING SOON badge and disable the link"
            className={`admin-tab inline-flex items-center gap-2 border border-[var(--rule)] px-3 py-1.5 t-micro ${
              comingSoon ? "bg-ink text-paper" : "text-body"
            }`}
          >
            <span aria-hidden>{comingSoon ? "●" : "○"}</span>
            COMING SOON: {comingSoon ? "ON" : "OFF"}
          </button>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[var(--rule)]">
          <span className="t-micro text-body">
            Tiles appear in the home grid in the order shown on the list page —
            use the ↑ ↓ arrows there to rearrange.
          </span>
          <button
            type="submit"
            className="admin-btn-primary px-6 py-3 t-nav"
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
            {comingSoon && (
              <span className="absolute top-3 left-3 bg-paper text-ink px-2 py-1 t-micro pointer-events-none">
                COMING SOON
              </span>
            )}
          </div>
          <div className="mt-2 flex items-center justify-between t-micro">
            <span className="text-mute tabular-nums">{year || "0000.00"}</span>
            <span className="text-strong text-right truncate max-w-[70%]">
              {(name || "UNTITLED").toUpperCase()} | {discipline || "—"}
            </span>
          </div>
        </div>
        {caseStudyId && !comingSoon && (
          <span className="t-micro text-body">
            Clicks route to /projects/
            <em className="text-ink not-italic">{caseStudyId.slice(0, 8)}…</em>
          </span>
        )}
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
