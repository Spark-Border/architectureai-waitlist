import SectionIntro from "@/components/SectionIntro";

const stages = [
  {
    tag: "IN DEVELOPMENT",
    title: "Review",
    body: "Upload your architecture material. Get findings that cite their evidence, and decide on each one.",
  },
  {
    tag: "PLANNED",
    title: "Remember",
    body: "Every review adds to a living model of your capabilities, processes, data, applications and technology. Impact analysis shows what a proposed change touches before it ships.",
  },
  {
    tag: "PLANNED",
    title: "Generate",
    body: "Once ArchitectureAI knows your landscape, it drafts the artifacts enterprise architecture runs on: decision records, principles, target-state views, roadmaps and reports. Each is grounded in your own model and standards, and your architects review and approve every draft.",
  },
];

export default function Roadmap() {
  return (
    <section
      id="next"
      aria-labelledby="next-title"
      className="mx-auto w-full max-w-275 px-4 py-12 sm:px-6 md:py-16"
    >
      <SectionIntro
        id="next-title"
        eyebrow="Where this goes"
        title="Reviews first. Then a model that remembers. Then drafts."
        lede="The destination is a full enterprise architecture system, built one stage at a time. The first release is the review loop. The rest follows the first pilots and is planned, not available."
      />

      <ol className="m-0 grid list-none gap-4 p-0 md:grid-cols-3">
        {stages.map((stage, index) => (
          <li
            key={stage.title}
            className={`rounded-md p-5 ${
              index === 0 ? "border border-teal bg-raised" : "border border-dashed border-field"
            }`}
          >
            <div className="mb-3 flex items-center justify-between">
              <p className={`t-id ${index === 0 ? "text-teal" : "text-soft"}`}>{stage.tag}</p>
              <span className="t-id text-soft">{String(index + 1).padStart(2, "0")}</span>
            </div>
            <h3 className="mb-1.5 text-base font-bold tracking-tight text-ink">{stage.title}</h3>
            <p className="text-[14px] text-soft">{stage.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
