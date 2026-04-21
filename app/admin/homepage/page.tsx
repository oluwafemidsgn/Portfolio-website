import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/auth";
import { ensureSeed } from "@/lib/seed";
import {
  listHeroProjects,
  listPlaygroundItems,
  listRecommendations,
} from "@/lib/home-content";
import { Frame } from "@/components/motion/frame";

export const dynamic = "force-dynamic";

export default async function HomepageAdmin() {
  if (!(await isAuthed())) redirect("/admin/login");
  ensureSeed();

  const hero = listHeroProjects();
  const playground = listPlaygroundItems();
  const recommendations = listRecommendations();

  const sections: Section[] = [
    {
      href: "/admin/homepage/hero",
      eyebrow: "/ HERO GRID",
      title: "Projects",
      body: "The grid under the hero. Add images, videos, or gifs with a year, name, and discipline. Each tile can optionally link out to a full case study.",
      count: hero.length,
      countLabel: "TILES",
    },
    {
      href: "/admin/homepage/playground",
      eyebrow: "/ PLAYGROUND",
      title: "Sketchbook",
      body: "Short, undated experiments. Images, videos, or gifs with a date and name — no case study link, no discipline.",
      count: playground.length,
      countLabel: "ENTRIES",
    },
    {
      href: "/admin/homepage/recommendations",
      eyebrow: "/ RECOMMENDATIONS",
      title: "Quotes",
      body: "Testimonials from people you've worked with. Rendered as a carousel below the Playground section on the home page.",
      count: recommendations.length,
      countLabel: "QUOTES",
    },
  ];

  return (
    <div className="flex flex-col gap-10">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 items-end">
        <div>
          <div className="t-micro text-body">/ HOMEPAGE</div>
          <h1 className="t-title text-ink mt-4">Home page content</h1>
          <p className="mt-4 t-body text-body max-w-[56ch]">
            The three editable surfaces of the home page. Edits hit the live
            site on save.
          </p>
        </div>
        <div className="flex gap-6 t-micro tabular-nums">
          <StatPill label="HERO" value={hero.length} />
          <StatPill label="PLAYGROUND" value={playground.length} />
          <StatPill label="QUOTES" value={recommendations.length} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
        {sections.map((s) => (
          <Frame key={s.href}>
            <Link
              href={s.href}
              className="cms-ink-hover p-6 md:p-8 group h-full flex flex-col gap-4 outline-none focus-visible:bg-mute"
            >
              <div className="flex items-center justify-between">
                <span className="t-micro text-body">{s.eyebrow}</span>
                <span className="t-micro text-body tabular-nums">
                  {String(s.count).padStart(2, "0")} {s.countLabel}
                </span>
              </div>
              <h2 className="t-title text-ink">{s.title}</h2>
              <p className="t-body text-body max-w-[40ch]">{s.body}</p>
              <span className="mt-auto t-micro text-ink inline-flex items-center gap-2 group-hover:gap-3 transition-[gap] duration-300">
                MANAGE <span aria-hidden>→</span>
              </span>
            </Link>
          </Frame>
        ))}
      </div>
    </div>
  );
}

type Section = {
  href: string;
  eyebrow: string;
  title: string;
  body: string;
  count: number;
  countLabel: string;
};

function StatPill({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="t-micro text-body">{label}</span>
      <span className="t-title text-ink tabular-nums">
        {String(value).padStart(2, "0")}
      </span>
    </div>
  );
}
