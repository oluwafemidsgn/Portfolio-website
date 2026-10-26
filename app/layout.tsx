import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeScript } from "@/components/theme/theme-script";
import { SITE_INTRO, SITE_URL } from "@/lib/site";

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
  title: "Oduneye Oluwafemi — Product Designer & Design Engineer",
  description:
    SITE_INTRO,
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: "Oduneye Oluwafemi — Product Designer & Design Engineer",
    description:
      SITE_INTRO,
    type: "website",
    siteName: "Oduneye Oluwafemi",
  },
  twitter: {
    card: "summary_large_image",
    title: "Oduneye Oluwafemi — Product Designer & Design Engineer",
    creator: "@OluwafemiDsgn",
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
