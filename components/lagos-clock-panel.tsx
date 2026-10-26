"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { AVAILABILITY, REPLY_TIME, TIMEZONE } from "@/lib/site";

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

type Now = { hh: string; mm: string; ss: string; working: boolean };

function lagosNow(): Now {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: TIMEZONE,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      weekday: "short",
      hourCycle: "h23",
    })
      .formatToParts(new Date())
      .map((p) => [p.type, p.value]),
  );
  const hour = Number(parts.hour);
  const weekend = parts.weekday === "Sat" || parts.weekday === "Sun";
  return { hh: parts.hour, mm: parts.minute, ss: parts.second, working: !weekend && hour >= 9 && hour < 18 };
}

/**
 * Footer panel: live Lagos time, availability and a route to the brief.
 * The clock renders after mount so server and client markup always agree.
 */
export function LagosClockPanel() {
  const reduce = useReducedMotion();
  const [now, setNow] = useState<Now | null>(null);

  useEffect(() => {
    setNow(lagosNow());
    const id = setInterval(() => setNow(lagosNow()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="w-full min-h-[360px] bg-ink text-paper flex flex-col justify-between p-6 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 t-micro">
        <span className="flex items-center gap-2 whitespace-nowrap">
          <span className="relative flex h-2 w-2">
            {!reduce && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#22c55e] opacity-60" />}
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#22c55e]" />
          </span>
          {AVAILABILITY}
        </span>
        <span className="text-paper/50 whitespace-nowrap">Lagos, Nigeria · WAT</span>
      </div>

      <div className="py-10">
        <p className="t-micro text-paper/50">Local time</p>
        <p
          className="mt-3 font-[family-name:var(--font-display)] font-extrabold leading-[0.85] tracking-[-0.02em] tabular-nums text-[clamp(72px,9vw,140px)]"
          aria-live="off"
          suppressHydrationWarning
        >
          {now ? now.hh : "--"}
          <span className={reduce ? "" : "animate-[blink_1s_steps(2,start)_infinite]"}>:</span>
          {now ? now.mm : "--"}
          <span className="ml-3 align-top text-[0.22em] font-medium tracking-normal text-paper/50">{now ? now.ss : "--"}</span>
        </p>
        <p className="mt-5 t-body text-paper/70 max-w-[420px]">
          {now && !now.working
            ? `It's after hours in Lagos. Send a note anyway: ${REPLY_TIME.toLowerCase()}.`
            : `${REPLY_TIME}. Send a short brief and I'll come back with next steps.`}
        </p>
      </div>

      <a
        href="/contact"
        data-cursor="zoom"
        className={`group relative flex items-center justify-between overflow-hidden border border-paper/30 px-5 py-4 t-nav outline-none focus-visible:ring-1 focus-visible:ring-paper`}
      >
        <span aria-hidden className={`absolute inset-0 origin-left scale-x-0 bg-paper transition-transform duration-500 ${EASE} group-hover:scale-x-100 group-focus-visible:scale-x-100`} />
        <span className="relative transition-colors duration-300 group-hover:text-ink group-focus-visible:text-ink">Start a project</span>
        <svg aria-hidden width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" className={`relative transition-all duration-500 ${EASE} group-hover:translate-x-1 group-hover:text-ink group-focus-visible:text-ink`}>
          <path d="M3 10h13M11 5l5 5-5 5" />
        </svg>
      </a>
    </div>
  );
}
