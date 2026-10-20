import SectionIntro from "@/components/SectionIntro";

const rows = [
  {
    today: "Submissions wait for a senior architect's time.",
    next: "Every submission gets a first review in minutes, before it reaches the board.",
  },
  {
    today: "Each reviewer applies the principles a little differently.",
    next: "The same principles and framework text are applied to every submission.",
  },
  {
    today: "Findings arrive as opinion, so teams argue before they decide.",
    next: "Each finding cites its evidence. The conversation starts from facts.",
  },
  {
    today: "Why a decision was made lives in slides and email threads.",
    next: "Every accept, reject and defer is recorded in an audit trail, with who decided.",
  },
];

export default function Problem() {
  return (
    <section
      id="problem"
      aria-labelledby="problem-title"
      className="mx-auto w-full max-w-275 px-4 py-12 sm:px-6 md:py-16"
    >
      <SectionIntro
        id="problem-title"
        eyebrow="The problem"
        title="Architecture review is where good decisions slow down."
      />

      <div className="overflow-hidden rounded-md border border-line bg-raised">
        <div className="hidden grid-cols-2 border-b border-line md:grid">
          <p className="t-label border-r border-line p-5 text-soft">Today</p>
          <p className="t-label p-5 text-teal">With ArchitectureAI</p>
        </div>
        <ul className="m-0 list-none p-0">
          {rows.map((row, index) => (
            <li
              key={row.today}
              className={`grid md:grid-cols-2 ${index > 0 ? "border-t border-line" : ""}`}
            >
              <p className="border-b border-line p-5 text-[15px] text-soft md:border-b-0 md:border-r">
                <span className="t-label mb-1 block md:hidden">Today</span>
                {row.today}
              </p>
              <p className="p-5 text-[15px] text-ink">
                <span className="t-label mb-1 block text-teal md:hidden">With ArchitectureAI</span>
                {row.next}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
