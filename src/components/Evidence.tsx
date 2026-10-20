import SectionIntro from "@/components/SectionIntro";

const parts = [
  { label: "Observation", body: "What the system found." },
  { label: "Evidence", body: "Where in your material it found it." },
  { label: "Risk", body: "What could go wrong." },
  { label: "Recommendation", body: "What to do about it." },
  { label: "Confidence", body: "A number, never rounded up." },
  { label: "Framework reference", body: "The rule it applies, linked to the source text." },
];

const rows = [
  {
    topic: "What it checks against",
    chat: "Whatever the model recalls about a framework.",
    ours: "Retrieved framework text and your own standards, cited by rule.",
  },
  {
    topic: "What you get back",
    chat: "A written answer.",
    ours: "Structured findings with evidence, risk and a confidence score.",
  },
  {
    topic: "What happens next",
    chat: "You copy the output somewhere else.",
    ours: "Accept, reject, defer or assign in place, with an audit trail.",
  },
  {
    topic: "Your data",
    chat: "Depends on the tool and its settings.",
    ours: "Isolated per tenant, kept in your region, never used for training.",
  },
];

export default function Evidence() {
  return (
    <section
      id="evidence"
      aria-labelledby="evidence-title"
      className="mx-auto w-full max-w-275 px-4 py-12 sm:px-6 md:py-16"
    >
      <SectionIntro
        id="evidence-title"
        eyebrow="Evidence"
        title="Every finding shows its work."
        lede="Findings are built to be checked, not trusted. Each one carries the same six parts, so a reviewer can verify it in a minute and decide."
      />

      <dl className="m-0 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {parts.map((part) => (
          <div key={part.label} className="rounded-md border border-line bg-raised p-5">
            <dt className="t-label mb-2 text-ink">{part.label}</dt>
            <dd className="m-0 text-[14px] text-soft">{part.body}</dd>
          </div>
        ))}
      </dl>

      <h3 className="mb-4 mt-14 text-lg font-bold tracking-tight text-ink">
        Why not paste it into a chat assistant?
      </h3>
      <div className="overflow-x-auto rounded-md border border-line bg-raised">
        <table className="w-full min-w-[40rem] border-collapse text-left text-[14px]">
          <caption className="sr-only">
            A general chat assistant compared with ArchitectureAI
          </caption>
          <thead>
            <tr className="border-b border-line">
              <th scope="col" className="t-label w-1/4 p-4 text-soft">
                <span className="sr-only">Topic</span>
              </th>
              <th scope="col" className="t-label p-4 text-soft">
                A general chat assistant
              </th>
              <th scope="col" className="t-label p-4 text-teal">
                ArchitectureAI
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.topic} className="border-t border-line first:border-t-0">
                <th scope="row" className="t-ui p-4 align-top text-ink">
                  {row.topic}
                </th>
                <td className="p-4 align-top text-soft">{row.chat}</td>
                <td className="p-4 align-top text-ink">{row.ours}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
