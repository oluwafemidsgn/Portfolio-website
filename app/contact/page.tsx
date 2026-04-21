import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { EmailBanner } from "@/components/email-banner";
import { Loader } from "@/components/motion/loader";
import { Cursor } from "@/components/motion/cursor";
import { ContactHero } from "@/components/contact/contact-hero";
import { ContactForm } from "@/components/contact/contact-form";
import { ContactLinks } from "@/components/contact/contact-links";
import { ContactAvailability } from "@/components/contact/contact-availability";

export const metadata = {
  title: "Contact — Oduneye Oluwafemi",
  description:
    "Book a project, say hello, or send a reference deck. A note typically earns a reply within 48 hours.",
};

/**
 * Contact page. Kept intentionally quiet — one short intro, one form,
 * one column of direct links. Matches the rest of the site's paper /
 * hairline aesthetic so it doesn't feel like a separate island.
 */
export default function ContactPage() {
  return (
    <>
      <Loader />
      <Cursor />
      <main className="bg-paper text-ink min-h-screen flex flex-col">
        <SiteNav />
        <ContactHero />
        <div className="flex flex-col gap-2">
          <ContactAvailability />
          <section className="page-gutter grid grid-cols-1 lg:grid-cols-[1fr_1fr] border-t border-[var(--rule)]">
            <ContactForm />
            <ContactLinks />
          </section>
          <EmailBanner />
          <SiteFooter />
        </div>
      </main>
    </>
  );
}
