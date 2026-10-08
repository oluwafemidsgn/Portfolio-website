"use client";

import { useMemo, useState } from "react";
import type { Block } from "@/lib/types";

/**
 * Content-block editor shared by the case-study and playground forms.
 * Blocks live in React state and are serialized into a hidden JSON input
 * (`name`, default "blocks") so server actions read one flat field.
 */

type Props = {
  initial?: Block[];
  /** Hidden input name the JSON is submitted under. */
  name?: string;
};

function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

const inputCls =
  "w-full bg-transparent border border-[var(--rule)] px-4 py-3 t-body text-ink placeholder:text-body focus:outline-none focus:border-ink transition-colors";

const addBtnCls =
  "t-nav text-ink border border-[var(--rule)] px-4 py-2.5 hover:bg-ink hover:text-paper transition-colors";

export function BlocksEditor({ initial = [], name = "blocks" }: Props) {
  const [blocks, setBlocks] = useState<Block[]>(initial);
  const json = useMemo(() => JSON.stringify(blocks), [blocks]);

  const add = (b: Block) => setBlocks((cur) => [...cur, b]);

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

  return (
    <div className="flex flex-col gap-4">
      <input type="hidden" name={name} value={json} />

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
                placeholder="Image / GIF / video URL"
                value={b.image}
                onChange={(e) => updateBlock(idx, { image: e.target.value })}
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
                  placeholder="Left image / GIF / video URL"
                  value={b.left}
                  onChange={(e) => updateBlock(idx, { left: e.target.value })}
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
                  placeholder="Right image / GIF / video URL"
                  value={b.right}
                  onChange={(e) => updateBlock(idx, { right: e.target.value })}
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
                onChange={(e) => updateBlock(idx, { eyebrow: e.target.value })}
              />
              <input
                className={inputCls}
                placeholder="Heading"
                value={b.heading}
                onChange={(e) => updateBlock(idx, { heading: e.target.value })}
              />
              <textarea
                className={`${inputCls} resize-y`}
                rows={4}
                placeholder="Body copy"
                value={b.body ?? ""}
                onChange={(e) => updateBlock(idx, { body: e.target.value })}
              />
            </div>
          )}

          {b.kind !== "section" && (
            <input
              className={inputCls}
              placeholder="Caption (optional)"
              value={b.caption ?? ""}
              onChange={(e) => updateBlock(idx, { caption: e.target.value })}
            />
          )}
        </div>
      ))}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() =>
            add({ id: uid(), kind: "full", image: "", alt: "", caption: "" })
          }
          className={addBtnCls}
        >
          + FULL BLOCK
        </button>
        <button
          type="button"
          onClick={() =>
            add({
              id: uid(),
              kind: "duo",
              left: "",
              right: "",
              leftAlt: "",
              rightAlt: "",
              caption: "",
            })
          }
          className={addBtnCls}
        >
          + DUO BLOCK
        </button>
        <button
          type="button"
          onClick={() =>
            add({ id: uid(), kind: "section", eyebrow: "", heading: "", body: "" })
          }
          className={addBtnCls}
        >
          + SECTION
        </button>
      </div>
    </div>
  );
}
