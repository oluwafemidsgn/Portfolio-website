/** Canonical site URL — used by metadata, the sitemap and robots. Override with NEXT_PUBLIC_SITE_URL. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://oluwafemi.online").replace(/\/$/, "");

export const SITE_NAME = "Oduneye Oluwafemi";
export const SITE_ROLE = "Product Designer & Design Engineer";

/** Contact address — used by the nav, menu, banner, contact page and form. */
export const EMAIL = "info.dotbranding@gmail.com";

/** One-line intro (from the CV profile) — hero, footer and default meta description. */
export const SITE_INTRO =
  "Product designer and design engineer. Five years designing and shipping products across fintech, e-commerce, marketplaces, logistics and social, from strategy to production-ready code.";

/** Availability — always shown, everywhere it appears. */
export const AVAILABILITY = "Open to new projects";
