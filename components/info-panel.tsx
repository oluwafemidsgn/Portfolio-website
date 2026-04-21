"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { EASE_OUT_EXPO } from "./motion/easing";

type Cell = { label: string; value: string };

function InfoCell({ label, value, pulse }: Cell & { pulse?: boolean }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <motion.span
          aria-hidden
          className="h-[5px] w-[5px] rounded-full bg-body"
          animate={pulse ? { scale: [1, 1.6, 1], opacity: [0.6, 1, 0.6] } : undefined}
          transition={pulse ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : undefined}
        />
        <span className="t-micro text-body">{label}</span>
      </div>
      <span className="t-nav text-strong">{value}</span>
    </div>
  );
}

export function InfoPanel() {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const hh = now.getHours();
      const mm = now.getMinutes().toString().padStart(2, "0");
      const ss = now.getSeconds().toString().padStart(2, "0");
      const h12 = hh % 12 === 0 ? 12 : hh % 12;
      const suffix = hh >= 12 ? "PM" : "AM";
      setTime(`${h12}:${mm}:${ss} ${suffix}`);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const cells = [
    { label: "ROLE", value: "Creative Designer" },
    { label: "AVAILABILITY", value: "Open to freelance" },
    { label: "LOCATION", value: "Lagos, Nigeria" },
  ];

  return (
    <aside
      aria-label="Status"
      className="grid grid-cols-2 gap-x-8 gap-y-6 w-full max-w-[360px]"
    >
      {cells.map((c, i) => (
        <motion.div
          key={c.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.15 + i * 0.08, ease: EASE_OUT_EXPO }}
        >
          <InfoCell label={c.label} value={c.value} />
        </motion.div>
      ))}
      <motion.div
        className="flex flex-col gap-2"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.39, ease: EASE_OUT_EXPO }}
      >
        <div className="flex items-center gap-2">
          <motion.span
            aria-hidden
            className="h-[5px] w-[5px] rounded-full bg-body"
            animate={{ scale: [1, 1.6, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <span className="t-micro text-body">LOCAL TIME</span>
        </div>
        <div className="flex flex-col t-nav text-strong tabular-nums leading-[1.4]">
          <span>6.5244° N, 3.3792° E</span>
          <span suppressHydrationWarning>{time || "—"}</span>
        </div>
      </motion.div>
    </aside>
  );
}
