"use client";

import { useState } from "react";
import type { Recommendation } from "@/lib/types";

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  initial?: Recommendation;
  submitLabel?: string;
};

const INPUT =
  "w-full bg-paper border border-[var(--rule)] px-4 py-3 t-body text-ink outline-none focus:border-ink transition-colors";
const LABEL = "t-micro text-body";

export function RecommendationForm({
  action,
  initial,
  submitLabel = "SAVE",
}: Props) {
  const [quote, setQuote] = useState(initial?.quote ?? "");
  const [author, setAuthor] = useState(initial?.author ?? "");
  const [role, setRole] = useState(initial?.role ?? "");
  const [company, setCompany] = useState(initial?.company ?? "");
  const [avatarUrl, setAvatarUrl] = useState(initial?.avatarUrl ?? "");

  const hasAvatar = avatarUrl.trim().length > 0;

  return (
    <form
      action={action}
      className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8"
    >
      <div className="flex flex-col gap-6">
        <Field label="QUOTE">
          <textarea
            name="quote"
            className={`${INPUT} min-h-[160px] resize-y leading-relaxed`}
            placeholder="Oluwafemi sees the whole building before he sketches a window…"
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            required
          />
        </Field>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="AUTHOR">
            <input
              name="author"
              className={INPUT}
              placeholder="Ada Okonkwo"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
          </Field>
          <Field label="ROLE">
            <input
              name="role"
              className={INPUT}
              placeholder="Creative Director"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="COMPANY">
            <input
              name="company"
              className={INPUT}
              placeholder="Lumen Studio"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </Field>
          <Field label="AVATAR URL (optional)">
            <input
              name="avatarUrl"
              className={INPUT}
              placeholder="https://cdn.../ada.jpg"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
            />
          </Field>
        </div>

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
        <div className="border border-[var(--rule)] p-8 flex flex-col gap-6 min-h-[320px]">
          <span className="t-micro text-body">/ RECOMMENDATION</span>
          <p className="t-lead text-ink leading-snug">
            &ldquo;{quote || "Your quote will appear here as you type."}&rdquo;
          </p>
          <div className="mt-auto flex items-center gap-3 pt-4 border-t border-[var(--rule)]">
            {hasAvatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt=""
                className="h-10 w-10 rounded-full object-cover bg-mute"
              />
            ) : (
              <span
                className="h-10 w-10 rounded-full bg-mute"
                aria-hidden
              />
            )}
            <div className="flex flex-col leading-tight">
              <span className="t-body text-ink">
                {author || "Author name"}
              </span>
              <span className="t-micro text-body">
                {[role, company].filter(Boolean).join(", ") ||
                  "Role, Company"}
              </span>
            </div>
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
