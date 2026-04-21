"use client";

import { useMemo, useState } from "react";
import type { AccordionItem, Block, CaseStudy, Status } from "@/lib/types";

/**
 * Editor form. Used by both /admin/new and /admin/[id]/edit. Dynamic
 * arrays (accordion, blocks) live in React state and are serialized into
 * hidden JSON inputs at submit time, so the server action only has to
 * handle a flat FormData.
 */

type Props = {
  /** Bound action. For create: createCaseStudy; for edit: updateCaseStudy.bind(null, id) */
  action: (formData: FormData) => Promise<void>;
  initial?: Partial<CaseStudy>;
  /** Saved flag from the URL, for the little "Saved ✓" confirmation. */
  saved?: boolean;
  /** Existing id (edit mode). */
  id?: string;
  /** For edit mode: public URL to preview. */
  previewHref?: string | null;
};

function uid(): string {
  // Adequate for form-local ids. Server re-assigns nothing — these ids
  // are preserved so ordering and accordion state survive round-trips.
  return Math.random().toString(36).slice(2, 10);
}

function defaultAccordion(): AccordionItem[] {
  return [
    { id: uid(), title: "Challenge", body: "" },
    { id: uid(), title: "Approach", body: "" },
    { id: uid(), title: "Impact", body: "" },
  ];
}

export function EditorForm({
  action,
  initial,
  saved,
  id,
  previewHref,
}: Props) {
  const [accordion, setAccordion] = useState<AccordionItem[]>(
    initial?.accordion && initial.accordion.length > 0
      ? initial.accordion
      : defaultAccordion(),
  );
  const [blocks, setBlocks] = useState<Block[]>(initial?.blocks ?? []);
  const [status, setStatus] = useState<Status>(initial?.status ?? "draft");

  const accordionJson = useMemo(() => JSON.stringify(accordion), [accordion]);
  const blocksJson = useMemo(() => JSON.stringify(blocks), [blocks]);

  /* ------------------------------ Accordion ------------------------------ */
  const addAccordion = () =>
    setAccordion((cur) => [...cur, { id: uid(), title: "", body: "" }]);

  const updateAccordion = (idx: number, patch: Partial<AccordionItem>) =>
    setAccordion((cur) =>
      cur.map((it, i) => (i === idx ? { ...it, ...patch } : it)),
    );

  const removeAccordion = (idx: number) =>
    setAccordion((cur) => cur.filter((_, i) => i !== idx));

  const moveAccordion = (idx: number, dir: -1 | 1) =>
    setAccordion((cur) => {
      const j = idx + dir;
      if (j < 0 || j >= cur.length) return cur;
      const copy = [...cur];
      [copy[idx], copy[j]] = [copy[j], copy[idx]];
      return copy;
    });

  /* ------------------------------ Blocks --------------------------------- */
  const addFull = () =>
    setBlocks((cur) => [
      ...cur,
      { id: uid(), kind: "full", image: "", alt: "", caption: "" },
    ]);

  const addDuo = () =>
    setBlocks((cur) => [
      ...cur,
      {
        id: uid(),
        kind: "duo",
        left: "",
        right: "",
        leftAlt: "",
        rightAlt: "",
        caption: "",
      },
    ]);

  const addSection = () =>
    setBlocks((cur) => [
      ...cur,
      { id: uid(), kind: "section", eyebrow: "", heading: "", body: "" },
    ]);

  const updateBlock = (idx: number, patch: Partial<Block>) =>
    setBlocks((cur) =>
      cur.map((b, i) => (i === idx ? ({ ...b, ...patch } as Block) : b)),
    );

  const removeBlock = (idx: number) =>
    setBlocks((cur) => cur.filter((_, i) => i !== idx));

  const moveBlock = (idx: number, dir: -1 | 1) =>
    setBlocks((cur) => {
      const j = idx + dir;
      if (j < 0 || j >= cur.length) return cur;
      const copy = [...cur];
      [copy[idx], copy[j]] = [copy[j], copy[idx]];
      return copy;
    });

  /* ------------------------------ Render -------------------------------- */
  return (
    <form action={action} className="flex flex-col gap-10">
      <input type="hidden" name="accordion" value={accordionJson} />
      <input type="hidden" name="blocks" value={blocksJson} />
      <input type="hidden" name="status" value={status} />

      {/* Top toolbar */}
      <div className="sticky top-0 z-20 -mx-[clamp(16px,3.33vw,64px)] px-[clamp(16px,3.33vw,64px)] py-4 bg-paper border-b border-[var(--rule)] flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4 t-micro">
          <span className="text-body">
            {id ? "EDITING" : "NEW CASE STUDY"}
          </span>
          <StatusToggle value={status} onChange={setStatus} />
          {saved && <span className="text-ink">SAVED ✓</span>}
        </div>
        <div className="flex items-center gap-4">
          {previewHref && (
            <a
              href={previewHref}
              target="_blank"
              rel="noreferrer"
              className="t-micro text-body hover:text-ink"
            >
              PREVIEW ↗
            </a>
          )}
          <button
            type="submit"
            className="bg-ink text-paper px-5 py-2.5 t-nav hover:opacity-90 transition-opacity"
          >
            {status === "published" ? "SAVE & PUBLISH" : "SAVE DRAFT"}
          </button>
        </div>
      </div>

      {/* Meta */}
      <Section label="01" title="Meta">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="TITLE" required>
            <input
              name="title"
              defaultValue={initial?.title ?? ""}
              required
              className={inputCls}
              placeholder="Lumen"
            />
          </Field>
          <Field label="SLUG" hint="Leave blank to derive from title.">
            <input
              name="slug"
              defaultValue={initial?.slug ?? ""}
              className={inputCls}
              placeholder="lumen"
            />
          </Field>
          <Field label="SUBTITLE">
            <input
              name="subtitle"
              defaultValue={initial?.subtitle ?? ""}
              className={inputCls}
              placeholder="A quiet identity for a loud studio."
            />
          </Field>
          <Field label="TYPE">
            <input
              name="type"
              defaultValue={initial?.type ?? ""}
              className={inputCls}
              placeholder="Brand identity"
            />
          </Field>
          <Field label="CLIENT">
            <input
              name="client"
              defaultValue={initial?.client ?? ""}
              className={inputCls}
            />
          </Field>
          <Field label="ROLE">
            <input
              name="role"
              defaultValue={initial?.role ?? ""}
              className={inputCls}
            />
          </Field>
          <Field label="YEAR">
            <input
              name="year"
              defaultValue={initial?.year ?? ""}
              className={inputCls}
              placeholder="2025"
            />
          </Field>
          <Field label="COVER IMAGE URL">
            <input
              name="coverImage"
              defaultValue={initial?.coverImage ?? ""}
              className={inputCls}
              placeholder="https://..."
            />
          </Field>
        </div>
      </Section>

      {/* Overview */}
      <Section label="02" title="Overview">
        <Field label="BODY">
          <textarea
            name="overview"
            defaultValue={initial?.overview ?? ""}
            rows={6}
            className={`${inputCls} resize-y leading-relaxed`}
            placeholder="Short intro that sits in the 30% sidebar on the case-study page."
          />
        </Field>
      </Section>

      {/* Accordion */}
      <Section
        label="03"
        title="Details accordion"
        hint="Expandable rows that live in the sidebar under the overview."
      >
        <div className="flex flex-col gap-4">
          {accordion.map((item, idx) => (
            <div
              key={item.id}
              className="border border-[var(--rule)] p-4 md:p-5 flex flex-col gap-3"
            >
              <div className="flex items-center justify-between t-micro text-body">
                <span>ROW {String(idx + 1).padStart(2, "0")}</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => moveAccordion(idx, -1)}
                    className="hover:text-ink"
                    aria-label="Move up"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveAccordion(idx, 1)}
                    className="hover:text-ink"
                    aria-label="Move down"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => removeAccordion(idx)}
                    className="hover:text-ink"
                  >
                    REMOVE
                  </button>
                </div>
              </div>
              <input
                className={inputCls}
                placeholder="Title (e.g. Challenge)"
                value={item.title}
                onChange={(e) =>
                  updateAccordion(idx, { title: e.target.value })
                }
              />
              <textarea
                className={`${inputCls} resize-y`}
                rows={3}
                placeholder="Body copy…"
                value={item.body}
                onChange={(e) =>
                  updateAccordion(idx, { body: e.target.value })
                }
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addAccordion}
            className="self-start t-nav text-ink border border-[var(--rule)] px-4 py-2.5 hover:bg-ink hover:text-paper transition-colors"
          >
            + ADD ROW
          </button>
        </div>
      </Section>

      {/* Blocks */}
      <Section
        label="04"
        title="Image blocks"
        hint="Each block is a row in the 70% column. Use 'Full' for a single image, 'Duo' for a 2-up split."
      >
        <div className="flex flex-col gap-4">
          {blocks.map((b, idx) => (
            <div
              key={b.id}
              className="border border-[var(--rule)] p-4 md:p-5 flex flex-col gap-3"
            >
              <div className="flex items-center justify-between t-micro text-body">
                <span>
                  BLOCK {String(idx + 1).padStart(2, "0")} ·{" "}
                  <span className="text-ink">{b.kind.toUpperCase()}</span>
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => moveBlock(idx, -1)}
                    className="hover:text-ink"
                    aria-label="Move up"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveBlock(idx, 1)}
                    className="hover:text-ink"
                    aria-label="Move down"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => removeBlock(idx)}
                    className="hover:text-ink"
                  >
                    REMOVE
                  </button>
                </div>
              </div>

              {b.kind === "full" && (
                <div className="flex flex-col gap-3">
                  <input
                    className={inputCls}
                    placeholder="Image URL"
                    value={b.image}
                    onChange={(e) =>
                      updateBlock(idx, { image: e.target.value })
                    }
                  />
                  <input
                    className={inputCls}
                    placeholder="Alt text"
                    value={b.alt ?? ""}
                    onChange={(e) => updateBlock(idx, { alt: e.target.value })}
                  />
                </div>
              )}

              {b.kind === "duo" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-3">
                    <input
                      className={inputCls}
                      placeholder="Left image URL"
                      value={b.left}
                      onChange={(e) =>
                        updateBlock(idx, { left: e.target.value })
                      }
                    />
                    <input
                      className={inputCls}
                      placeholder="Left alt text"
                      value={b.leftAlt ?? ""}
                      onChange={(e) =>
                        updateBlock(idx, { leftAlt: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-3">
                    <input
                      className={inputCls}
                      placeholder="Right image URL"
                      value={b.right}
                      onChange={(e) =>
                        updateBlock(idx, { right: e.target.value })
                      }
                    />
                    <input
                      className={inputCls}
                      placeholder="Right alt text"
                      value={b.rightAlt ?? ""}
                      onChange={(e) =>
                        updateBlock(idx, { rightAlt: e.target.value })
                      }
                    />
                  </div>
                </div>
              )}

              {b.kind === "section" && (
                <div className="flex flex-col gap-3">
                  <input
                    className={inputCls}
                    placeholder="Eyebrow (e.g. 02 · IDENTITY SYSTEM)"
                    value={b.eyebrow ?? ""}
                    onChange={(e) =>
                      updateBlock(idx, { eyebrow: e.target.value })
                    }
                  />
                  <input
                    className={inputCls}
                    placeholder="Heading"
                    value={b.heading}
                    onChange={(e) =>
                      updateBlock(idx, { heading: e.target.value })
                    }
                  />
                  <textarea
                    className={`${inputCls} resize-y`}
                    rows={4}
                    placeholder="Body copy"
                    value={b.body ?? ""}
                    onChange={(e) =>
                      updateBlock(idx, { body: e.target.value })
                    }
                  />
                </div>
              )}

              {b.kind !== "section" && (
                <input
                  className={inputCls}
                  placeholder="Caption (optional)"
                  value={b.caption ?? ""}
                  onChange={(e) =>
                    updateBlock(idx, { caption: e.target.value })
                  }
                />
              )}
            </div>
          ))}
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={addFull}
              className="t-nav text-ink border border-[var(--rule)] px-4 py-2.5 hover:bg-ink hover:text-paper transition-colors"
            >
              + FULL BLOCK
            </button>
            <button
              type="button"
              onClick={addDuo}
              className="t-nav text-ink border border-[var(--rule)] px-4 py-2.5 hover:bg-ink hover:text-paper transition-colors"
            >
              + DUO BLOCK
            </button>
            <button
              type="button"
              onClick={addSection}
              className="t-nav text-ink border border-[var(--rule)] px-4 py-2.5 hover:bg-ink hover:text-paper transition-colors"
            >
              + SECTION
            </button>
          </div>
        </div>
      </Section>

      {/* Bottom save */}
      <div className="flex items-center justify-between pt-6 border-t border-[var(--rule)] t-micro text-body">
        <span>End of editor.</span>
        <button
          type="submit"
          className="bg-ink text-paper px-5 py-2.5 t-nav hover:opacity-90 transition-opacity"
        >
          {status === "published" ? "SAVE & PUBLISH" : "SAVE DRAFT"}
        </button>
      </div>
    </form>
  );
}

/* ------------------------------ Presentational ------------------------------ */

const inputCls =
  "w-full bg-transparent border border-[var(--rule)] px-4 py-3 t-body text-ink placeholder:text-body focus:outline-none focus:border-ink transition-colors";

function Section({
  label,
  title,
  hint,
  children,
}: {
  label: string;
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6 lg:gap-12">
      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="t-micro text-body">/ {label}</div>
        <h2 className="t-title text-ink mt-3">{title}</h2>
        {hint && <p className="t-body text-body mt-4 max-w-[32ch]">{hint}</p>}
      </div>
      <div>{children}</div>
    </section>
  );
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="t-micro text-body flex items-center gap-2">
        {label}
        {required && <span className="text-ink">*</span>}
      </span>
      {children}
      {hint && <span className="t-micro text-body">{hint}</span>}
    </label>
  );
}

function StatusToggle({
  value,
  onChange,
}: {
  value: Status;
  onChange: (v: Status) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Publish status"
      className="inline-flex border border-[var(--rule)]"
    >
      {(["draft", "published"] as const).map((s) => {
        const active = value === s;
        return (
          <button
            key={s}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(s)}
            className={`px-3 py-1.5 t-micro transition-colors ${
              active
                ? "bg-ink text-paper"
                : "text-body hover:text-ink"
            }`}
          >
            {s === "draft" ? "DRAFT" : "LIVE"}
          </button>
        );
      })}
    </div>
  );
}
