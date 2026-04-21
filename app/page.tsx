import { SiteNav } from "@/components/site-nav";
import { Hero } from "@/components/hero";
import { ProjectsSection } from "@/components/projects-section";
import { AboutSection } from "@/components/about-section";
import { ServicesSection } from "@/components/services-section";
import { PlaygroundSection } from "@/components/playground-section";
import { RecommendationsSection } from "@/components/recommendations-section";
import { CtaSection } from "@/components/cta-section";
import { EmailBanner } from "@/components/email-banner";
import { SiteFooter } from "@/components/site-footer";
import { Loader } from "@/components/motion/loader";
import { Cursor } from "@/components/motion/cursor";
import { ensureSeed } from "@/lib/seed";
import {
  listHeroProjects,
  listPlaygroundItems,
  listRecommendations,
} from "@/lib/home-content";
import { listAll } from "@/lib/case-studies";

// Home page is server-rendered on each request so CMS edits are
// reflected immediately without waiting on ISR revalidation windows.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  ensureSeed();

  const [heroTiles, playgroundItems, recommendations, caseStudies] =
    await Promise.all([
      listHeroProjects(),
      listPlaygroundItems(),
      listRecommendations(),
      listAll(),
    ]);

  // Only published case studies are reachable from home tiles. Draft
  // studies still exist but clicking a linked tile should not leak them.
  const publishedHrefs: Record<string, string> = {};
  for (const cs of caseStudies) {
    if (cs.status === "published") publishedHrefs[cs.id] = cs.slug;
  }

  return (
    <>
      <Loader />
      <Cursor />
      <main className="bg-paper text-ink min-h-screen">
        <SiteNav />
        <Hero />
        <div className="flex flex-col gap-2">
          <ProjectsSection tiles={heroTiles} caseStudyHrefs={publishedHrefs} />
          <AboutSection />
          <ServicesSection />
          <PlaygroundSection items={playgroundItems} />
          <RecommendationsSection items={recommendations} />
          <CtaSection />
          <EmailBanner />
          <SiteFooter />
        </div>
      </main>
    </>
  );
}
