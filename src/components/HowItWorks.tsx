import { Upload, Network, ScanSearch, ListChecks } from "lucide-react";
import SectionIntro from "@/components/SectionIntro";

const steps = [
  {
    icon: Upload,
    title: "Upload",
    body: "Documents, diagrams, models and practices.",
  },
  {
    icon: Network,
    title: "Extract",
    body: "ArchitectureAI builds a model of your business, data, applications and technology, and how they connect.",
  },
  {
    icon: ScanSearch,
    title: "Evaluate",
    body: "The model is checked against frameworks such as TOGAF, ArchiMate and Zachman, and against your own standards, using the framework text and your organisation's context.",
  },
  {
    icon: ListChecks,
    title: "Decide",
    body: "Your architects accept, reject, defer or assign each finding. Every decision is recorded.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how"
      aria-labelledby="how-title"
      className="mx-auto w-full max-w-275 px-4 py-12 sm:px-6 md:py-16"
    >
      <SectionIntro
        id="how-title"
        eyebrow="How it works"
        title="From architecture data to better decisions."
      />

      <ol className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <li key={step.title} className="rounded-md border border-line bg-raised p-5">
            <div className="mb-4 flex items-center justify-between">
              <step.icon size={20} strokeWidth={1.75} className="text-teal" aria-hidden="true" />
              <span className="t-id text-soft">{String(index + 1).padStart(2, "0")}</span>
            </div>
            <h3 className="mb-1.5 text-base font-bold tracking-tight text-ink">{step.title}</h3>
            <p className="text-[14px] text-soft">{step.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
