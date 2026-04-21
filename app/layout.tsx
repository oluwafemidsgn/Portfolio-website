import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeScript } from "@/components/theme/theme-script";

const nohemi = localFont({
  variable: "--font-nohemi",
  display: "swap",
  src: [
    { path: "./fonts/Nohemi-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/Nohemi-Medium.ttf", weight: "500", style: "normal" },
    { path: "./fonts/Nohemi-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "./fonts/Nohemi-ExtraBold.ttf", weight: "800", style: "normal" },
  ],
});

export const metadata: Metadata = {
  title: "Oduneye Oluwafemi — Creative Designer",
  description:
    "Designer partnering with brands across 3D, motion, and visual design. Specializing in embedded, long-term collaborations.",
  metadataBase: new URL("https://oluwafemidsgn.com"),
  openGraph: {
    title: "Oduneye Oluwafemi — Creative Designer",
    description:
      "Designer partnering with brands across 3D, motion, and visual design.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={nohemi.variable} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="bg-paper text-ink antialiased">{children}</body>
    </html>
  );
}
