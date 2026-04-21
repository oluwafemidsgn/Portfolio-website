import { SiteNav } from "@/components/site-nav";
import { EmailBanner } from "@/components/email-banner";
import { SiteFooter } from "@/components/site-footer";
import { Loader } from "@/components/motion/loader";
import { Cursor } from "@/components/motion/cursor";
import { Frame } from "@/components/motion/frame";
import { ProjectCard } from "@/components/projects/project-card";
import { listPublished } from "@/lib/case-studies";
import { ensureSeed } from "@/lib/seed";
import { ProjectsHero } from "@/components/projects/projects-hero";

export const metadata = {
  title: "Projects — Oduneye Oluwafemi",
  description:
    "Selected case studies across brand, 3D, motion, and product work.",
};

export const dynamic = "force-dynamic";

export default async function ProjectsIndexPage() {
  ensureSeed();
  const studies = listPublished();

  return (
    <>
      <Loader />
      <Cursor />
      <main className="bg-paper text-ink min-h-screen">
        <SiteNav />
        <ProjectsHero count={studies.length} />
        <div className="flex flex-col gap-2">
          <section className="page-gutter">
            <Frame>
              <div className="p-2">
                {studies.length === 0 ? (
                  <div className="p-10 t-body text-body">
                    No published case studies yet. Head to the{" "}
                    <a href="/admin" className="text-ink underline">
                      admin
                    </a>{" "}
                    to publish one.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {studies.map((s, i) => (
                      <ProjectCard key={s.id} study={s} i={i} />
                    ))}
                  </div>
                )}
              </div>
            </Frame>
          </section>

          <EmailBanner />
          <SiteFooter />
        </div>
      </main>
    </>
  );
}
