import type { SocialKey } from "@/lib/socials";

/**
 * Monochrome social glyphs drawn in currentColor, so they follow the
 * theme and invert on hover with the text around them.
 */
export function SocialIcon({ name, size = 28, className = "" }: { name: SocialKey; size?: number; className?: string }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", className, "aria-hidden": true } as const;
  switch (name) {
    case "instagram":
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.6">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4.2" />
          <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "x":
      return (
        <svg {...common} fill="currentColor">
          <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg {...common} fill="currentColor">
          <rect x="2.5" y="8.6" width="4.2" height="12.9" rx="0.4" />
          <circle cx="4.6" cy="4.7" r="2.4" />
          <path d="M9.6 8.6h4v1.8c.6-1.1 2-2.1 4.1-2.1 3.9 0 4.8 2.5 4.8 5.9v7.3h-4.2v-6.4c0-1.6-.3-3.2-2.3-3.2s-2.3 1.5-2.3 3.1v6.5H9.6Z" />
        </svg>
      );
    case "behance":
      return (
        <svg {...common} fill="currentColor">
          <path d="M1 5.5h6.4c2.6 0 4.2 1.2 4.2 3.3 0 1.4-.8 2.3-1.9 2.8 1.6.4 2.6 1.6 2.6 3.3 0 2.6-2 4-4.8 4H1Zm3 2.4v3h3c1 0 1.6-.5 1.6-1.5S8 7.9 7 7.9Zm0 5.2v3.6h3.3c1.2 0 1.9-.6 1.9-1.8s-.7-1.8-1.9-1.8Z" />
          <path d="M15.3 6.2h5.9v1.5h-5.9Z" />
          <path d="M18.3 9.4c2.9 0 4.6 2 4.5 5.2h-6.7c.1 1.5.9 2.3 2.3 2.3 1 0 1.6-.4 1.9-1.1h2.4c-.5 1.9-2.1 3.1-4.3 3.1-2.9 0-4.8-1.9-4.8-4.8 0-2.8 1.9-4.7 4.7-4.7Zm-2.1 3.8h4.2c-.1-1.2-.8-1.9-2-1.9s-2 .7-2.2 1.9Z" />
        </svg>
      );
    case "github":
      return (
        <svg {...common} fill="currentColor">
          <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.42-2.7 5.4-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
        </svg>
      );
    case "whatsapp":
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
          <path d="M3.5 20.5 4.8 16A8.6 8.6 0 1 1 8 19.3Z" />
          <path d="M9.1 7.9c.3-.3.7-.3.9 0l.9 1.6c.2.3.1.6-.1.9l-.5.6c.6 1.2 1.6 2.2 2.8 2.8l.6-.5c.3-.2.6-.3.9-.1l1.6.9c.3.2.3.6 0 .9-.7.8-1.6 1.1-2.6.7a9 9 0 0 1-5.2-5.2c-.4-1 0-1.9.7-2.6Z" fill="currentColor" stroke="none" />
        </svg>
      );
  }
}
