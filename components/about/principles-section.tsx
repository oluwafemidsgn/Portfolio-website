"use client";

import { Reveal } from "../motion/reveal";
import { Frame } from "../motion/frame";

type Principle = { n: string; title: string; desc: string };

const PRINCIPLES: Principle[] = [
  {
    n: "01",
    title: "Clarity over cleverness",
    desc: "The clever idea is often the second one. The obvious one, executed well, almost always wins.",
  },
  {
    n: "02",
    title: "Systems that flex",
    desc: "A good system survives its maker. It carries enough opinion to feel alive and enough room to be wrong in interesting ways.",
  },
  {
    n: "03",
    title: "Craft as care",
    desc: "Details are a love letter to whoever shows up next — a user, a teammate, a future version of yourself.",
  },
  {
    n: "04",
    title: "Ship honest work",
    desc: "If the story matches the product, the rest takes care of itself. If it doesn't, no amount of polish will save it.",
  },
];

export function PrinciplesSection() {
  return (
    <section id="principles" className="page-gutter">
      <Frame>
        <div className="flex flex-col">
          <div className="p-8 md:p-12 rule-h">
            <Reveal>
              <span className="t-micro text-body">/ 03 · PRINCIPLES</span>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="t-title text-ink mt-6 max-w-[820px]">
                Four beliefs I try to bring to every project.
              </h2>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 grid-col-rules">
            {PRINCIPLES.map((p, i) => (
              <div
                key={p.n}
                className={`p-8 md:p-12 ${
                  i < 2 ? "rule-h md:rule-h" : ""
                }`}
              >
                <Reveal delay={0.08 * i}>
                  <div className="flex items-baseline gap-4">
                    <span className="t-micro text-body tabular-nums">{p.n}</span>
                    <h3 className="t-title text-ink">{p.title}</h3>
                  </div>
                </Reveal>
                <Reveal delay={0.08 * i + 0.1}>
                  <p className="mt-6 t-body text-strong max-w-[520px]">
                    {p.desc}
                  </p>
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </Frame>
    </section>
  );
}
