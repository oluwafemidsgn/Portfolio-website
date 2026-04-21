"use client";

import { Reveal } from "../motion/reveal";
import { SplitLines } from "../motion/split-lines";
import { Frame } from "../motion/frame";

export function AboutCta() {
  return (
    <section id="about-cta" className="page-gutter">
      <Frame>
        <div className="grid grid-cols-1 lg:grid-cols-2 grid-col-rules">
          <div className="p-8 md:p-12">
            <Reveal>
              <span className="t-micro text-body">/ 07 · NEXT</span>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 t-body text-strong max-w-[420px]">
                If any of this sounds like your kind of trouble, I&apos;d love
                to hear from you. Embedded engagements, identity sprints, or
                a weird idea you can&apos;t shake — all welcome.
              </p>
            </Reveal>
          </div>
          <div className="p-8 md:p-12">
            <h2 className="t-title text-ink">
              <SplitLines
                trigger="view"
                lines={["Let's make", "something", "worth keeping."]}
                stagger={0.1}
              />
            </h2>
          </div>
        </div>
      </Frame>
    </section>
  );
}
