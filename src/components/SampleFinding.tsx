"use client";

import { useState } from "react";
import Chips from "@/components/Chips";
import { track } from "@/lib/analytics";

/*
 * Interactive sample findings, built to the finding-card spec in
 * architectureai-fe/design/components/finding-card.md:
 * header (label + severity badge) / AI indicator + confidence in mono /
 * divider / actions. Severity and actions never touch without the divider.
 *
 * Enterprise architecture is not only IT, so the samples span the architecture
 * domains: business, data, application, technology, and risk. Clicking an action
 * records a line in a small audit trail, so a visitor sees "the system
 * recommends, a person decides" happen. Every finding is an invented example,
 * labelled as such. None of it is real output.
 */
type Severity = "critical" | "high" | "medium" | "low";

interface Finding {
  id: string;
  domain: string;
  title: string;
  severity: Severity;
  confidence: string;
  fields: { label: string; value: string }[];
}

const findings: Finding[] = [
  {
    id: "business",
    domain: "Business",
    title: "Two business units run overlapping onboarding capabilities",
    severity: "medium",
    confidence: "0.76",
    fields: [
      {
        label: "Observation",
        value: "Two business units each own a customer onboarding capability.",
      },
      {
        label: "Evidence",
        value:
          "Capability map: both units list customer onboarding, with separate owners and systems.",
      },
      {
        label: "Risk",
        value: "Duplicated spend and inconsistent customer checks across units.",
      },
      {
        label: "Recommendation",
        value: "Name one capability owner and plan to move both units onto a shared service.",
      },
      { label: "Framework", value: "TOGAF, business architecture" },
    ],
  },
  {
    id: "data",
    domain: "Data",
    title: "Customer data has no named owner",
    severity: "high",
    confidence: "0.91",
    fields: [
      { label: "Observation", value: "The customer profile entity has no data steward." },
      {
        label: "Evidence",
        value: "Data catalogue entry for customer profile: owner field empty. Three systems hold copies.",
      },
      {
        label: "Risk",
        value: "Conflicting definitions, and no accountable answer to an audit question.",
      },
      {
        label: "Recommendation",
        value: "Assign a data owner and record the system of record in the model.",
      },
      { label: "Framework", value: "TOGAF, data architecture" },
    ],
  },
  {
    id: "application",
    domain: "Application",
    title: "Direct database access bypasses the service layer",
    severity: "high",
    confidence: "0.82",
    fields: [
      { label: "Observation", value: "payments-api reads and writes customer-db directly." },
      {
        label: "Evidence",
        value: "Diagram 2, link from payments-api to customer-db. No customer service sits between them.",
      },
      { label: "Risk", value: "A schema change in customer-db breaks payments." },
      { label: "Recommendation", value: "Route access through the customer service API." },
      { label: "Framework", value: "TOGAF, architecture principles" },
    ],
  },
  {
    id: "technology",
    domain: "Technology",
    title: "Order service runs in one region with no failover plan",
    severity: "high",
    confidence: "0.88",
    fields: [
      { label: "Observation", value: "The order service is deployed in a single region." },
      {
        label: "Evidence",
        value: "Deployment diagram 4: one region shown. No standby or failover is documented.",
      },
      {
        label: "Risk",
        value: "A regional outage stops orders, with no tested recovery path.",
      },
      {
        label: "Recommendation",
        value: "Document a failover to a second region and test it.",
      },
      { label: "Framework", value: "Your standard: resilience policy" },
    ],
  },
  {
    id: "risk",
    domain: "Risk",
    title: "Critical provider has no documented exit plan",
    severity: "critical",
    confidence: "0.68",
    fields: [
      { label: "Observation", value: "Fulfilment depends on one external provider." },
      {
        label: "Evidence",
        value: "Vendor register entry for the provider: exit plan field empty. Context diagram 1 shows no fallback.",
      },
      {
        label: "Risk",
        value: "If the provider fails or ends the contract, there is no route to keep fulfilling orders.",
      },
      {
        label: "Recommendation",
        value: "Document an exit and fallback plan, and review it each year.",
      },
      { label: "Framework", value: "Your standard: third-party risk policy" },
    ],
  },
];

const domains = findings.map((f) => f.domain);

const severityLabel: Record<Severity, string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
};

type Action = "Accept" | "Reject" | "Defer" | "Assign" | "Comment";

/* status is empty for actions that do not change the finding's state */
const outcome: Record<Action, { status: string; entry: string }> = {
  Accept: { status: "Accepted", entry: "accepted the finding" },
  Reject: { status: "Rejected", entry: "rejected the finding" },
  Defer: { status: "Deferred", entry: "deferred the finding" },
  Assign: { status: "Assigned", entry: "assigned the finding to a reviewer" },
  Comment: { status: "", entry: "added a comment" },
};

interface AuditEntry {
  id: number;
  text: string;
  time: string;
}

interface Decision {
  status: string;
  audit: AuditEntry[];
}

const fresh: Decision = { status: "Proposed", audit: [] };

export default function SampleFinding() {
  const [domain, setDomain] = useState(findings[0].domain);
  const [decisions, setDecisions] = useState<Record<string, Decision>>({});

  const finding = findings.find((f) => f.domain === domain) ?? findings[0];
  const { status, audit } = decisions[finding.id] ?? fresh;

  const update = (change: (d: Decision) => Decision) =>
    setDecisions((prev) => ({ ...prev, [finding.id]: change(prev[finding.id] ?? fresh) }));

  const act = (action: Action) => {
    const { status: next, entry } = outcome[action];
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    update((d) => ({
      status: next || d.status,
      audit: [{ id: Date.now() + d.audit.length, text: `You ${entry}`, time }, ...d.audit],
    }));
    track("Sample finding action", { action, domain: finding.domain });
  };

  const accepted = status === "Accepted";

  return (
    <figure className="m-0">
      <figcaption className="t-id mb-3 flex items-center justify-between text-soft">
        <span>SAMPLE FINDINGS</span>
        <span>ILLUSTRATIVE · TRY IT</span>
      </figcaption>

      <Chips
        legend="Architecture domain"
        name="sample-domain"
        options={domains}
        value={[domain]}
        onChange={(v) => {
          setDomain(v[0]);
          track("Sample finding domain", { domain: v[0] });
        }}
      />

      <article
        aria-label={`Sample ${finding.domain.toLowerCase()} architecture finding`}
        className="overflow-hidden rounded-md border border-line bg-raised"
      >
        <div className="p-5">
          <header className="flex items-start justify-between gap-4">
            <h2 className="t-label text-ink">{finding.title}</h2>
            <span
              className={`badge shrink-0 ${accepted ? "badge-accepted" : `badge-${finding.severity}`}`}
            >
              {accepted ? "Accepted" : severityLabel[finding.severity]}
            </span>
          </header>

          <p className="t-id mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-soft">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-teal" aria-hidden="true" />
            <span>ai-generated</span>
            <span aria-hidden="true">·</span>
            <span className="t-metric text-ink">{finding.confidence} confidence</span>
            <span aria-hidden="true">·</span>
            <span>
              status <span className="text-ink">{status}</span>
            </span>
          </p>

          <dl className="mt-4 grid gap-3">
            {finding.fields.map((field) => (
              <div key={field.label} className="grid gap-0.5 sm:grid-cols-[7.5rem_1fr] sm:gap-4">
                <dt className="t-id text-soft uppercase">{field.label}</dt>
                <dd className="m-0 text-[14px] text-ink">{field.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="border-t border-line" />

        <fieldset className="m-0 flex min-w-0 flex-wrap gap-2 border-0 p-4">
          <legend className="sr-only">Reviewer actions</legend>
          <button type="button" className="btn btn-positive" onClick={() => act("Accept")}>
            Accept
          </button>
          <button type="button" className="btn btn-destructive" onClick={() => act("Reject")}>
            Reject
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => act("Defer")}>
            Defer
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => act("Assign")}>
            Assign
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => act("Comment")}>
            Comment
          </button>
        </fieldset>

        <div className="border-t border-line" />

        <div className="p-4" aria-live="polite">
          <div className="flex items-center justify-between">
            <p className="t-id text-soft">AUDIT TRAIL</p>
            {audit.length > 0 && (
              <button
                type="button"
                onClick={() => update(() => fresh)}
                className="t-ui cursor-pointer bg-transparent text-teal underline"
              >
                Reset sample
              </button>
            )}
          </div>
          {audit.length === 0 ? (
            <p className="mt-2 text-[13px] text-soft">
              Nothing recorded yet. Try accepting, rejecting or deferring this finding.
            </p>
          ) : (
            <ul className="m-0 mt-2 grid list-none gap-1 p-0">
              {audit.map((item) => (
                <li
                  key={item.id}
                  className="flex items-baseline justify-between gap-4 text-[13px] text-ink"
                >
                  <span>{item.text}</span>
                  <span className="t-id shrink-0 text-soft">{item.time}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </article>

      <p className="mt-3 text-[13px] text-soft">
        Invented examples of the format. Real findings link to evidence in your own material.
      </p>
    </figure>
  );
}
