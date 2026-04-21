"use client";

import { motion } from "framer-motion";
import { EASE_OUT_EXPO } from "./motion/easing";
import { ThemeToggle } from "./theme/theme-toggle";

const NAV_ITEMS = [
  { label: "HOME", href: "/" },
  { label: "PROJECTS", href: "/projects" },
  { label: "ABOUT", href: "/about" },
  { label: "PLAYGROUND", href: "/playground" },
  { label: "CONTACT", href: "/contact" },
];

const EMAIL = "HEY@OLUWAFEMIDSGN.COM";

function NavLink({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      data-cursor="zoom"
      className="relative block overflow-hidden group outline-none"
    >
      <span className="block transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-full group-focus-visible:-translate-y-full">
        {label}
      </span>
      <span
        aria-hidden
        className="absolute inset-0 translate-y-full text-ink transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-focus-visible:translate-y-0"
      >
        {label}
      </span>
    </a>
  );
}

export function SiteNav() {
  return (
    <motion.nav
      aria-label="Primary"
      className="page-gutter pt-10"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.1 }}
    >
      <ul className="hidden md:flex items-center justify-between gap-6 t-nav text-body">
        {NAV_ITEMS.map((item) => (
          <li key={item.label}>
            <NavLink label={item.label} href={item.href} />
          </li>
        ))}
        <li>
          <NavLink label={EMAIL} href={`mailto:${EMAIL.toLowerCase()}`} />
        </li>
        <li className="flex items-center">
          <ThemeToggle />
        </li>
      </ul>
      <ul className="flex md:hidden items-center justify-between t-nav text-body">
        <li className="text-ink">OLUWAFEMI</li>
        <li className="flex items-center gap-4">
          <a href={`mailto:${EMAIL.toLowerCase()}`} className="text-strong">
            CONTACT
          </a>
          <ThemeToggle />
        </li>
      </ul>
    </motion.nav>
  );
}
