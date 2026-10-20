import { Layers, Users, KeyRound, History, MapPin, Ban } from "lucide-react";
import SectionIntro from "@/components/SectionIntro";

const items = [
  {
    icon: Layers,
    title: "Tenant isolation",
    body: "Each organisation's data is kept apart from every other.",
  },
  {
    icon: Users,
    title: "Role-based access",
    body: "Eight default roles, including read-only viewers and auditors.",
  },
  {
    icon: KeyRound,
    title: "Secure sign-in",
    body: "Multi-factor authentication, with SSO and SCIM on the Enterprise plan.",
  },
  {
    icon: History,
    title: "Immutable audit log",
    body: "Every decision is recorded and cannot be edited afterwards.",
  },
  {
    icon: MapPin,
    title: "Data residency",
    body: "Your tenant is pinned to a home region. Storage, AI processing and backups stay there.",
  },
  {
    icon: Ban,
    title: "No training on your data",
    body: "We never train models on your material.",
  },
];

export default function Trust() {
  return (
    <section
      id="trust"
      aria-labelledby="trust-title"
      className="mx-auto w-full max-w-275 px-4 py-12 sm:px-6 md:py-16"
    >
      <SectionIntro
        id="trust-title"
        eyebrow="Built for the enterprise"
        title="Designed for organisations that answer to auditors."
        lede="These are design requirements for the first release, not certifications. We will say so plainly when each one is verified."
      />

      <ul className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.title} className="rounded-md border border-line bg-raised p-5">
            <item.icon size={20} strokeWidth={1.75} className="mb-4 text-teal" aria-hidden="true" />
            <h3 className="mb-1.5 text-base font-bold tracking-tight text-ink">{item.title}</h3>
            <p className="text-[14px] text-soft">{item.body}</p>
          </li>
        ))}
      </ul>

      <p className="mt-6 text-[13px] text-soft">
        Built with GDPR, DORA, NIS2 and EU AI Act transparency requirements in mind.
      </p>
    </section>
  );
}
