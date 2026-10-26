import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { Cursor } from "@/components/motion/cursor";
import { Frame } from "@/components/motion/frame";

export const metadata = {
  title: "Page not found — Oduneye Oluwafemi",
};

const LINKS = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

/** 404 in the site's own grammar: crumb rule, framed panel, extra-bold display type, roll-hover links. */
export default function NotFound() {
  return (
    <>
      <Cursor />
      <main className="bg-paper text-ink min-h-screen flex flex-col">
        <SiteNav />
        <section className="page-gutter">
          <div className="mt-[30px] h-px bg-[var(--rule)]" />
          <div className="py-5 md:py-6 flex items-center justify-between t-micro text-body">
            <span>/ ERROR</span>
            <span className="tabular-nums">404 · NOT FOUND</span>
          </div>
        </section>
        <div className="flex flex-col gap-2 flex-1">
          <section className="page-gutter">
            <Frame>
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(0,420px)] grid-col-rules">
                <div className="p-6 sm:p-10 md:p-14 flex flex-col justify-between gap-10 min-h-[46vh]">
                  <p className="t-micro text-body">PAGE NOT FOUND</p>
                  <h1 className="[font-family:var(--font-display)] font-[800] uppercase leading-[0.85] tracking-[-0.03em] text-[clamp(96px,22vw,320px)]">
                    404
                  </h1>
                  <p className="t-body text-strong max-w-[42ch]">
                    This page doesn’t exist, or it moved when the site was rebuilt. Try one of these instead.
                  </p>
                </div>
                <ul className="flex flex-col justify-end p-2">
                  {LINKS.map((l) => (
                    <li key={l.href} className="rule-h">
                      <Link
                        href={l.href}
                        data-cursor="zoom"
                        className="cms-ink-hover group flex items-center justify-between px-4 py-5 t-nav outline-none focus-visible:underline"
                      >
                        <span className="relative block overflow-hidden">
                          <span className="block transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-full">
                            {l.label.toUpperCase()}
                          </span>
                          <span aria-hidden className="absolute inset-0 translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0">
                            {l.label.toUpperCase()}
                          </span>
                        </span>
                        <span aria-hidden>↗</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </Frame>
          </section>
          <SiteFooter />
        </div>
      </main>
    </>
  );
}
