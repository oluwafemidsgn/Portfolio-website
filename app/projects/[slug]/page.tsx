import { notFound } from "next/navigation";
import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { EmailBanner } from "@/components/email-banner";
import { SiteFooter } from "@/components/site-footer";
import { Loader } from "@/components/motion/loader";
import { Cursor } from "@/components/motion/cursor";
import { Frame } from "@/components/motion/frame";
import { CaseStudyBlocks } from "@/components/projects/case-study-blocks";
import { CaseStudySidebar } from "@/components/projects/case-study-sidebar";
import { NextCaseStudy } from "@/components/projects/next-case-study";
import { getBySlug, listPublished } from "@/lib/case-studies";
import { ensureSeed } from "@/lib/seed";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  ensureSeed();
  const study = getBySlug(slug);
  if (!study) return { title: "Case study — Oduneye Oluwafemi" };
  return {
    title: `${study.title} — Case study`,
    description: study.subtitle || study.overview.slice(0, 160),
  };
}

export const dynamic = "force-dynamic";

export default async function CaseStudyPage({ params }: { params: Params }) {
  const { slug } = await params;
  ensureSeed();
  const study = getBySlug(slug);
  if (!study || study.status !== "published") notFound();

  const published = listPublished();
  const idx = published.findIndex((s) => s.id === study.id);
  const next = idx >= 0 ? published[(idx + 1) % published.length] : null;

  return (
    <>
      <Loader />
      <Cursor />
      <main className="bg-paper text-ink min-h-screen">
        <SiteNav />

        {/* Breadcrumb / crumb trail above the 30/70 frame. */}
        <section className="page-gutter">
          <div className="mt-[30px] h-px bg-[var(--rule)]" />
          <div className="pt-6 pb-6 flex items-center justify-between t-micro text-body">
            <span>
              <Link href="/projects" className="hover:text-ink">
                / PROJECTS
              </Link>
              <span className="mx-2 text-mute">→</span>
              <span className="text-strong">{study.title.toUpperCase()}</span>
            </span>
            <span className="tabular-nums">
              {study.year} · {study.type || "CASE STUDY"}
            </span>
          </div>
        </section>

        <div className="flex flex-col gap-2">
          {/* The 30/70 frame. */}
          <section className="page-gutter">
            <Frame>
              <div className="grid grid-cols-1 lg:grid-cols-[30%_70%] grid-col-rules">
                <CaseStudySidebar
                  title={study.title}
                  subtitle={study.subtitle}
                  overview={study.overview}
                  year={study.year}
                  client={study.client}
                  role={study.role}
                  type={study.type}
                  accordion={study.accordion}
                />

                <div className="min-w-0">
                  <CaseStudyBlocks blocks={study.blocks} />
                </div>
              </div>
            </Frame>
          </section>

          {/* Next-up nav pill. */}
          {next && next.id !== study.id && (
            <section className="page-gutter">
              <Frame>
                <NextCaseStudy
                  href={`/projects/${next.slug}`}
                  title={next.title}
                  type={next.type}
                />
              </Frame>
            </section>
          )}

          <EmailBanner />
          <SiteFooter />
        </div>
      </main>
    </>
  );
}
