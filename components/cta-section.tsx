"use client";

import { Reveal } from "./motion/reveal";
import { SplitLines } from "./motion/split-lines";
import { Frame } from "./motion/frame";

export function CtaSection() {
  return (
    <section id="contact" className="page-gutter">
      <Frame>
        <div className="grid grid-cols-1 lg:grid-cols-2 grid-col-rules">
          <div className="hidden lg:block p-8 md:p-10" aria-hidden />
          <div className="p-8 md:p-10">
            <h2 className="t-title text-ink">
              <SplitLines
                trigger="view"
                lines={["Would you like", "to work together?"]}
                stagger={0.1}
              />
            </h2>
            <Reveal delay={0.35}>
              <p className="mt-6 t-body text-body">
                Let&apos;s create something amazing!
              </p>
            </Reveal>
          </div>
        </div>
      </Frame>
    </section>
  );
}
