"use client";

import { Marquee } from "./motion/marquee";
import { Frame } from "./motion/frame";

const EMAIL = "HEY@OLUWAFEMIDSGN.COM";
const DIVIDER = (
  <span className="mx-8 md:mx-12 inline-block align-middle text-paper/40">
    ✦
  </span>
);

export function EmailBanner() {
  return (
    <section className="page-gutter">
      <Frame className="p-2">
        <a
          href={`mailto:${EMAIL.toLowerCase()}`}
          className="group block bg-ink text-paper py-10 md:py-16 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          aria-label={`Email ${EMAIL.toLowerCase()}`}
          data-cursor="invert"
        >
          <Marquee speed={28} pauseOnHover className="text-paper">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className="flex items-center shrink-0 pr-12">
                <span className="t-mega">{EMAIL}</span>
                {DIVIDER}
              </span>
            ))}
          </Marquee>
        </a>
      </Frame>
    </section>
  );
}
