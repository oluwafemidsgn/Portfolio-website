import { SiteNav } from "@/components/site-nav";
import { EmailBanner } from "@/components/email-banner";
import { SiteFooter } from "@/components/site-footer";
import { Loader } from "@/components/motion/loader";
import { Cursor } from "@/components/motion/cursor";
import { AboutHero } from "@/components/about/about-hero";
import { BioSection } from "@/components/about/bio-section";
import { JourneySection } from "@/components/about/journey-section";
import { PrinciplesSection } from "@/components/about/principles-section";
import { ToolkitSection } from "@/components/about/toolkit-section";
import { RecognitionSection } from "@/components/about/recognition-section";
import { CurrentlySection } from "@/components/about/currently-section";
import { AboutCta } from "@/components/about/about-cta";

export const metadata = {
  title: "About — Oduneye Oluwafemi",
  description:
    "Designer partnering with brands across 3D, motion, and visual design. A look at how I work, what I believe, and what I'm up to right now.",
};

export default function AboutPage() {
  return (
    <>
      <Loader />
      <Cursor />
      <main className="bg-paper text-ink min-h-screen">
        <SiteNav />
        <AboutHero />
        <div className="flex flex-col gap-2">
          <BioSection />
          <JourneySection />
          <PrinciplesSection />
          <ToolkitSection />
          <RecognitionSection />
          <CurrentlySection />
          <AboutCta />
          <EmailBanner />
          <SiteFooter />
        </div>
      </main>
    </>
  );
}
