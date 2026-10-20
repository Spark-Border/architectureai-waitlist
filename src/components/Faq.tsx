"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import SectionIntro from "@/components/SectionIntro";

const questions = [
  {
    q: "Is ArchitectureAI available now?",
    a: "Not yet, but it will soon be available. Joining the waitlist is how we choose who sees it first.",
  },
  {
    q: "Does it replace our architects?",
    a: "No. The system recommends and a person decides. One of your team accepts, rejects, defers or assigns every finding.",
  },
  {
    q: "Will it write architecture artifacts, or only review them?",
    a: "Both, over time. Once ArchitectureAI knows your landscape, it will draft the artifacts enterprise architecture runs on, such as decision records, target-state views, roadmaps and reports, grounded in your own model. Your architects review and approve every draft. That part is planned, not available yet.",
  },
  {
    q: "What can I upload?",
    a: "Documents, diagrams, models and practices.",
  },
  {
    q: "Which frameworks does it use?",
    a: "Established frameworks such as TOGAF, ArchiMate and Zachman, plus your own standards and policies. We add others based on what testing partners need.",
  },
  {
    q: "What happens to my data?",
    a: "Your tenant is isolated and pinned to a home region. We never train models on your data.",
  },
  {
    q: "How long does a review take?",
    a: "We are designing for under two minutes. Testing will show what holds up on real material.",
  },
  {
    q: "Who is it for?",
    a: "Enterprise, business, data and solution architects, and the technology, risk and compliance leaders they work with, at enterprises in any industry.",
  },
  {
    q: "What does early access involve?",
    a: "Your email now, then two short steps about your work. After that, a conversation about how your reviews run today, and access when the first release is ready. It is free during the testing period.",
  },
  {
    q: "How do I leave?",
    a: "Reply to any of our emails and ask to be removed. We will delete your details.",
  },
];

export default function Faq() {
  /* One answer open at a time; the first starts open so the section never looks empty. */
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="mx-auto w-full max-w-275 px-4 py-12 sm:px-6 md:py-16"
    >
      <SectionIntro id="faq-title" eyebrow="FAQ" title="Questions teams ask first." />

      <div className="max-w-3xl divide-y divide-line overflow-hidden rounded-md border border-line bg-raised">
        {questions.map((item, index) => {
          const isOpen = open === index;
          return (
            <div key={item.q}>
              <h3 className="m-0">
                <button
                  type="button"
                  id={`faq-q-${index}`}
                  aria-expanded={isOpen}
                  aria-controls={`faq-a-${index}`}
                  onClick={() => setOpen(isOpen ? null : index)}
                  className="flex min-h-11 w-full cursor-pointer items-center justify-between gap-4 bg-transparent p-4 text-left text-[15px] font-semibold text-ink hover:bg-paper"
                >
                  {item.q}
                  <ChevronDown
                    size={18}
                    strokeWidth={1.75}
                    className={`shrink-0 text-soft transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  />
                </button>
              </h3>
              {/* Grid-rows trick: animates height without measuring it. */}
              <div
                id={`faq-a-${index}`}
                role="region"
                aria-labelledby={`faq-q-${index}`}
                inert={!isOpen}
                className={`grid transition-[grid-template-rows] duration-150 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
              >
                <div className="overflow-hidden">
                  <p className="m-0 px-4 pb-4 text-[14px] text-soft">{item.a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
