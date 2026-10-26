"use client";

import { Reveal } from "../motion/reveal";
import { Frame } from "../motion/frame";

type Principle = { n: string; title: string; desc: string };

// Grounded in the CV profile: clarity, trust and conversion guide every
// decision; AI-native, concept to live product in days; always learning.
const PRINCIPLES: Principle[] = [
  {
    n: "01",
    title: "Clarity first",
    desc: "If someone has to stop and think about how a screen works, it isn't finished. The clearest version wins over the cleverest.",
  },
  {
    n: "02",
    title: "Earn trust",
    desc: "People hand products their money, documents and time. Every flow should feel safe, predictable and honest about what happens next.",
  },
  {
    n: "03",
    title: "Design for conversion",
    desc: "Good design moves people to act. I design pages and flows around the one thing each person came to do, and measure whether they did it.",
  },
  {
    n: "04",
    title: "Prototype in code",
    desc: "I work AI-native, taking ideas from concept to a live, testable product in days, and I keep learning as the craft evolves.",
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
