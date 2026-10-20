import TopBar from "@/components/TopBar";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import HowItWorks from "@/components/HowItWorks";
import Evidence from "@/components/Evidence";
import Trust from "@/components/Trust";
import Roadmap from "@/components/Roadmap";
import JoinFlow from "@/components/JoinFlow";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";
import CtaBand from "@/components/CtaBand";
import { site } from "@/lib/site";

/* Structured data for search engines. Only facts that are true today. */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: site.name,
      url: site.url,
      logo: `${site.url}/icon.svg`,
      description: site.description,
    },
    {
      "@type": "WebSite",
      name: site.name,
      url: site.url,
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <TopBar />
      <main id="main">
        <Hero />
        <Problem />
        <HowItWorks />
        <Evidence />
        <CtaBand />
        <Trust />
        <Roadmap />
        <JoinFlow />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
