import SampleFinding from "@/components/SampleFinding";
import HeroEmail from "@/components/HeroEmail";

export default function Hero() {
  return (
    <section id="top" className="mx-auto w-full max-w-275 px-4 py-12 sm:px-6 md:py-16">
      <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <div>
          <p className="t-id mb-5 inline-flex items-center gap-2 rounded-sm border border-line bg-teal-soft px-3 py-1.5 text-ink">
            <span className="h-1.5 w-1.5 rounded-full bg-teal" aria-hidden="true" />
            <span>IN DEVELOPMENT · WAITLIST OPEN</span>
          </p>

          <h1 className="t-display text-ink">
            Clarity for complex systems. Evidence for every decision.
          </h1>

          <p className="mt-5 max-w-xl text-[15px] text-soft sm:text-base">
            ArchitectureAI reviews your architecture documents, diagrams, models and
            practices against frameworks such as TOGAF, ArchiMate and Zachman, and against
            your own principles. Each finding cites its evidence, so your team can verify it
            and make the call.
          </p>

          <div className="mt-8">
            <HeroEmail />
          </div>

          <p className="mt-6 max-w-xl text-[13px] text-soft">
            For enterprise, business, data and solution architects, and the technology and risk
            leaders they work with, in any industry.{" "}
            <a href="#evidence">See what a finding looks like</a>.
          </p>
        </div>

        <SampleFinding />
      </div>
    </section>
  );
}
