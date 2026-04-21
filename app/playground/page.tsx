import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { EmailBanner } from "@/components/email-banner";
import { Loader } from "@/components/motion/loader";
import { Cursor } from "@/components/motion/cursor";
import { ensureSeed } from "@/lib/seed";
import { listPlaygroundItems } from "@/lib/home-content";
import { PlaygroundStudio } from "@/components/playground-studio/playground-studio";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Playground — Oduneye Oluwafemi",
  description:
    "An open canvas of experiments, sketches, and off-hours work. Drag things around, doodle on the paper, play a round of snake.",
};

export default async function PlaygroundPage() {
  ensureSeed();
  const items = await listPlaygroundItems();

  return (
    <>
      <Loader />
      <Cursor />
      <main className="bg-paper text-ink min-h-screen flex flex-col">
        <SiteNav />
        <PlaygroundStudio items={items} />
        <div className="flex flex-col gap-2 mt-2">
          <EmailBanner />
          <SiteFooter />
        </div>
      </main>
    </>
  );
}
