/** One source for social links — footer, contact page and anywhere else read from here. */
export type SocialKey = "instagram" | "x" | "linkedin" | "behance" | "github" | "whatsapp";

export type Social = {
  key: SocialKey;
  label: string;
  handle: string;
  href: string;
};

export const SOCIALS: Social[] = [
  { key: "instagram", label: "Instagram", handle: "@oluwafemidsgn", href: "https://www.instagram.com/oluwafemidsgn/" },
  { key: "x", label: "X", handle: "@OluwafemiDsgn", href: "https://x.com/OluwafemiDsgn" },
  { key: "linkedin", label: "LinkedIn", handle: "in/oluwafemi-oduneye", href: "https://www.linkedin.com/in/oluwafemi-oduneye/" },
  { key: "behance", label: "Behance", handle: "/oluwafemi11", href: "https://www.behance.net/oluwafemi11" },
  { key: "github", label: "GitHub", handle: "/oluwafemidsgn", href: "https://github.com/oluwafemidsgn" },
  { key: "whatsapp", label: "WhatsApp", handle: "+234 916 137 9900", href: "https://wa.me/2349161379900" },
];
