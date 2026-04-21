"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EASE_OUT_EXPO } from "../motion/easing";

const EMAIL = "hey@oluwafemidsgn.com";

const BUDGETS = [
  "Under $5k",
  "$5k – $15k",
  "$15k – $35k",
  "$35k – $75k",
  "$75k+",
  "Not sure yet",
];

const TIMELINES = ["< 4 weeks", "1 – 2 months", "2 – 3 months", "Q2 / later"];

const DISCIPLINES = ["Brand identity", "Motion / 3D", "Product UI", "Other"];

/**
 * Contact form — client-side only. Submitting opens the user's mail
 * client with a prefilled mailto: link built from the form values.
 * Keeps the page hostable as a static export without needing a backend.
 */
export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [discipline, setDiscipline] = useState(DISCIPLINES[0]);
  const [budget, setBudget] = useState(BUDGETS[2]);
  const [timeline, setTimeline] = useState(TIMELINES[1]);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Name, email, and a short note are required.");
      return;
    }
    const subject = `New project — ${name.trim()} (${discipline})`;
    const bodyLines = [
      `Name: ${name}`,
      `Email: ${email}`,
      company ? `Company: ${company}` : null,
      `Discipline: ${discipline}`,
      `Budget: ${budget}`,
      `Timeline: ${timeline}`,
      "",
      "— Message —",
      message,
    ].filter(Boolean);
    const href = `mailto:${EMAIL}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(bodyLines.join("\n"))}`;
    window.location.href = href;
    setSent(true);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 p-6 md:p-10 border-r-0 lg:border-r border-[var(--rule)]"
    >
      <header className="mb-2">
        <p className="t-micro text-body">NEW PROJECT ENQUIRY</p>
        <h2 className="mt-3 t-title">TELL ME ABOUT IT.</h2>
      </header>

      <Row>
        <Field label="YOUR NAME" htmlFor="contact-name">
          <Input
            id="contact-name"
            name="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ada Lovelace"
          />
        </Field>
        <Field label="EMAIL" htmlFor="contact-email">
          <Input
            id="contact-email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ada@studio.co"
          />
        </Field>
      </Row>

      <Field label="COMPANY / STUDIO" htmlFor="contact-company">
        <Input
          id="contact-company"
          name="company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Optional"
        />
      </Field>

      <Field label="DISCIPLINE" htmlFor="contact-discipline">
        <div role="radiogroup" className="flex flex-wrap gap-2">
          {DISCIPLINES.map((d) => (
            <Chip
              key={d}
              selected={discipline === d}
              onClick={() => setDiscipline(d)}
            >
              {d}
            </Chip>
          ))}
        </div>
      </Field>

      <Row>
        <Field label="BUDGET" htmlFor="contact-budget">
          <Select
            id="contact-budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          >
            {BUDGETS.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </Select>
        </Field>
        <Field label="TIMELINE" htmlFor="contact-timeline">
          <Select
            id="contact-timeline"
            value={timeline}
            onChange={(e) => setTimeline(e.target.value)}
          >
            {TIMELINES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </Select>
        </Field>
      </Row>

      <Field label="THE PROJECT" htmlFor="contact-message">
        <textarea
          id="contact-message"
          name="message"
          required
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="A few lines on what you're making, who it's for, and why now."
          className="w-full bg-transparent border border-[var(--rule)] px-4 py-3 t-body text-ink outline-none focus:border-ink transition-colors resize-y"
        />
      </Field>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
            className="t-micro text-red-700"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      <div className="mt-2 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <p className="t-micro text-body">
          Hitting send opens your mail client — pre-filled and ready.
        </p>
        <button
          type="submit"
          data-cursor="zoom"
          className="cms-ink-hover px-6 py-4 border border-ink text-ink t-nav self-start md:self-auto"
        >
          SEND NOTE ↗
        </button>
      </div>

      <AnimatePresence>
        {sent && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="t-micro text-ink"
          >
            Your mail client should have opened. If nothing happened, write to{" "}
            <a
              href={`mailto:${EMAIL}`}
              className="underline decoration-from-font"
            >
              {EMAIL}
            </a>
            .
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* Small form primitives — kept local to this file                     */
/* ------------------------------------------------------------------ */

function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-5">{children}</div>;
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="flex flex-col gap-2">
      <span className="t-micro text-body">{label}</span>
      {children}
    </label>
  );
}

const BASE_INPUT =
  "w-full bg-transparent border border-[var(--rule)] px-4 py-3 t-body text-ink outline-none focus:border-ink transition-colors";

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${BASE_INPUT} ${props.className ?? ""}`} />;
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`${BASE_INPUT} appearance-none ${props.className ?? ""}`}
    />
  );
}

function Chip({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      data-cursor="zoom"
      className={
        "px-4 py-2 t-micro border transition-colors duration-300 " +
        (selected
          ? "bg-ink text-paper border-ink"
          : "border-[var(--rule)] text-body hover:text-ink hover:border-ink")
      }
    >
      {children}
    </button>
  );
}
