import type { Metadata } from "next";
import Link from "next/link";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy notice | ArchitectureAI",
  description:
    "What ArchitectureAI collects when you request early access, why, and how to have it removed.",
  alternates: { canonical: "/privacy" },
};

const contact = process.env.NEXT_PUBLIC_CONTACT_EMAIL;

export default function PrivacyPage() {
  return (
    <>
      <TopBar />
      <main id="main" className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 md:py-16">
        <p className="t-id mb-3 text-teal">PRIVACY NOTICE</p>
        <h1 className="t-display text-ink">How we handle your details.</h1>
        <p className="mt-4 text-[15px] text-soft">
          This notice covers early access to ArchitectureAI at architectureai.tech. Last updated
          20 October 2026.
        </p>

        <Section title="What we collect">
          <p>
            When you request early access we first save your work email. If you continue, we also
            save your name, role and industry, and your organisation if you give it. Two further
            answers are optional: the frameworks you use and what slows your reviews down. We also
            record how you chose to take part, when you agreed to hear from us, and where you came
            from (referring site and campaign tags in the link, if any). If you stop after the
            first step, we keep only your email and those source details.
          </p>
        </Section>

        <Section title="Why we collect it">
          <p>
            To run the waitlist, choose who to speak to first, and email you about
            ArchitectureAI. We do not sell your details and we do not use them for anything else.
          </p>
        </Section>

        <Section title="Legal basis">
          <p>Your consent, given when you submit your email after reading the notice beside the button. You can withdraw it at any time.</p>
        </Section>

        <Section title="Who handles it">
          <p>
            Your details are stored in a MongoDB Atlas database and we send email through Resend. We
            share them with no one else.
          </p>
        </Section>

        <Section title="How long we keep it">
          <p>
            While early access is open and until you ask us to delete your details, whichever
            comes first.
          </p>
        </Section>

        <Section title="Your rights">
          <p>
            You can ask to see, correct or delete your details, or withdraw your consent, at any
            time. Reply to any email from us and say what you want. We will act on it.
            {contact && (
              <>
                {" "}
                You can also write to <a href={`mailto:${contact}`}>{contact}</a>.
              </>
            )}{" "}
            You can also complain to your local data protection authority.
          </p>
        </Section>

        <p className="mt-10 text-[14px]">
          <Link href="/">Back to ArchitectureAI</Link>
        </p>
      </main>
      <Footer />
    </>
  );
}

function Section({ title, children }: Readonly<{ title: string; children: React.ReactNode }>) {
  return (
    <section className="mt-8">
      <h2 className="t-h2 mb-2 text-ink">{title}</h2>
      <div className="text-[15px] text-soft">{children}</div>
    </section>
  );
}
