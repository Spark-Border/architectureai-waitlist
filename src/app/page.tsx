import TopBar from "@/components/TopBar";
import Hero from "@/components/Hero";
import TrustMarquee from "@/components/TrustMarquee";
import AnimatedCounter from "@/components/AnimatedCounter";
import FeaturesBento from "@/components/FeaturesBento";
import WaitlistSection from "@/components/WaitlistSection";
import Footer from "@/components/Footer";
import CursorGlow from "@/components/CursorGlow";
import ScrollProgress from "@/components/ScrollProgress";
import BackToTop from "@/components/BackToTop";

export default function Home() {
  return (
    <>
      <CursorGlow />
      <ScrollProgress />
      <TopBar />
      <main>
        <Hero />
        <TrustMarquee />
        {/* <AnimatedCounter /> */}
        <FeaturesBento />
        <WaitlistSection />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}