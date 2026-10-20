"use client";

import { useState, useCallback } from "react";
import { ChevronDown } from "lucide-react";
import GateMark from "@/components/GateMark";

interface WaitlistEntry {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  orgName: string;
  jobTitle: string;
  industry: string;
  frameworks: string[];
  painPoints: string;
  interest: "newsletter" | "launch" | "partner";
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  referrer?: string;
  freeEmailDomain?: boolean;
  profileCompletedAt?: string;
  extrasCompletedAt?: string;
  confirmationSent: boolean;
  consentedAt: string;
  createdAt: string;
}

interface Stats {
  total: number;
  newsletter: number;
  launch: number;
  partner: number;
  undecided: number;
  funnel: { email: number; profile: number; extras: number };
  personalEmail: number;
  sources: { source: string; signups: number }[];
}

const interestLabels: Record<string, string> = {
  undecided: "Not chosen",
  partner: "Testing partner",
  launch: "Launch update",
  newsletter: "Progress updates",
};

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const fetchEntries = useCallback(async (t: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin", { headers: { "x-admin-token": t } });
      if (res.status === 401) {
        setError("That password is not right.");
        setAuthenticated(false);
        return;
      }
      if (res.status === 429) {
        setError("Too many attempts. Wait a few minutes and try again.");
        return;
      }
      const data = await res.json();
      if (data.success) {
        setEntries(data.entries);
        setStats(data.stats);
        setAuthenticated(true);
      }
    } catch {
      setError("Could not reach the server.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogin = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    void fetchEntries(token.trim());
  };

  const handleExport = async () => {
    try {
      const res = await fetch("/api/admin/export", {
        headers: { "x-admin-token": token.trim() },
      });
      if (!res.ok) throw new Error("Failed to export");
      const blob = await res.blob();
      const url = globalThis.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `waitlist-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      globalThis.URL.revokeObjectURL(url);
      a.remove();
    } catch (err) {
      console.error(err);
      setError("The CSV export failed. Try again.");
    }
  };

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (!authenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-paper px-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-md border border-line bg-raised p-8"
        >
          <div className="mb-6 flex items-center gap-2.5 text-ink">
            <GateMark size={24} />
            <h1 className="text-lg font-bold tracking-tight">Admin</h1>
          </div>
          <label htmlFor="admin-password" className="t-ui mb-1.5 block text-ink">
            Password
          </label>
          <input
            id="admin-password"
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            autoComplete="current-password"
            className="control mb-4"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "admin-error" : undefined}
          />
          {error && (
            <p id="admin-error" role="alert" className="mb-4 text-[13px] text-danger">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={!token.trim() || loading}
            className="btn btn-primary w-full"
          >
            {loading ? "Checking…" : "View signups"}
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-paper text-ink">
      <div className="mx-auto flex w-full max-w-275 items-center justify-between gap-4 border-b border-line px-4 py-6 sm:px-6">
        <div className="flex items-center gap-2.5">
          <GateMark size={24} />
          <div>
            <h1 className="text-lg font-bold tracking-tight">ArchitectureAI admin</h1>
            <p className="t-metric text-soft">{stats?.total ?? 0} signups</p>
          </div>
        </div>
        <div className="flex gap-2">
          {stats && stats.total > 0 && (
            <button type="button" onClick={handleExport} className="btn btn-ghost">
              Export CSV
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              setAuthenticated(false);
              setToken("");
              setEntries([]);
              setStats(null);
            }}
            className="btn btn-ghost"
          >
            Lock
          </button>
        </div>
      </div>

      {error && (
        <p role="alert" className="mx-auto w-full max-w-275 px-4 pt-4 text-[13px] text-danger sm:px-6">
          {error}
        </p>
      )}

      {stats && (
        <dl className="mx-auto my-0 grid w-full max-w-275 grid-cols-2 gap-4 px-4 py-6 sm:px-6 md:grid-cols-5">
          <Stat label="Total" value={stats.total} />
          <Stat label="Testing partners" value={stats.partner} />
          <Stat label="Launch updates" value={stats.launch} />
          <Stat label="Progress updates" value={stats.newsletter} />
          <Stat label="Not chosen" value={stats.undecided} />
        </dl>
      )}

      {stats && (
        <section
          aria-labelledby="funnel-title"
          className="mx-auto mb-6 w-full max-w-275 px-4 sm:px-6"
        >
          <h2 id="funnel-title" className="t-label mb-3 text-soft">
            Form funnel
          </h2>
          <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
            <div className="rounded-md border border-line bg-raised p-4">
              {[
                ["Email saved", stats.funnel.email],
                ["Details saved", stats.funnel.profile],
                ["Optional step saved", stats.funnel.extras],
              ].map(([label, n]) => {
                const pct = stats.funnel.email
                  ? Math.round((Number(n) / stats.funnel.email) * 100)
                  : 0;
                return (
                  <div key={label} className="mb-3 last:mb-0">
                    <div className="mb-1 flex items-baseline justify-between text-[13px]">
                      <span className="text-ink">{label}</span>
                      <span className="t-metric text-ink">
                        {n} <span className="text-soft">({pct}%)</span>
                      </span>
                    </div>
                    <div className="h-1.5 rounded-sm bg-line" aria-hidden="true">
                      <div className="h-1.5 rounded-sm bg-teal" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
              <p className="mt-3 text-[12px] text-soft">
                {stats.personalEmail} of {stats.total} used a personal email address.
              </p>
            </div>
            <div className="rounded-md border border-line bg-raised p-4">
              <p className="t-id mb-2 text-soft">TOP SOURCES</p>
              <ul className="m-0 grid list-none gap-1 p-0 text-[13px]">
                {stats.sources.map((row) => (
                  <li key={row.source} className="flex justify-between gap-4 text-ink">
                    <span className="truncate">{row.source}</span>
                    <span className="t-metric">{row.signups}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      <div className="mx-auto w-full max-w-275 px-4 pb-16 sm:px-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="t-label text-soft">Signups</h2>
          <button
            type="button"
            onClick={() => void fetchEntries(token.trim())}
            disabled={loading}
            className="t-ui cursor-pointer bg-transparent text-teal underline"
          >
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>

        <ul className="m-0 grid list-none gap-3 p-0">
          {entries.map((entry) => (
            <EntryCard
              key={entry._id}
              entry={entry}
              open={expanded.has(entry._id)}
              toggle={() => toggleExpand(entry._id)}
            />
          ))}
        </ul>

        {entries.length === 0 && !loading && (
          <p className="py-16 text-center text-[14px] text-soft">No signups yet.</p>
        )}
      </div>
    </main>
  );
}

function EntryCard({
  entry,
  open,
  toggle,
}: Readonly<{ entry: WaitlistEntry; open: boolean; toggle: () => void }>) {
  const panelId = `entry-${entry._id}`;
  const source = [entry.utmSource, entry.utmMedium, entry.utmCampaign].filter(Boolean).join(" / ");

  return (
    <li className="overflow-hidden rounded-md border border-line bg-raised">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full cursor-pointer items-center gap-4 bg-transparent p-4 text-left text-ink"
      >
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span className="truncate text-[14px] font-semibold">
              {entry.firstName || entry.lastName
                ? `${entry.firstName} ${entry.lastName}`.trim()
                : "Email only"}
            </span>
            <span className="rounded-sm bg-teal-soft px-2 py-0.5 text-[11px] font-semibold text-ink">
              {interestLabels[entry.interest] ?? entry.interest}
            </span>
            {!entry.profileCompletedAt && (
              <span className="rounded-sm border border-line px-2 py-0.5 text-[11px] text-soft">
                Stopped at step 1
              </span>
            )}
          </span>
          <span className="mt-0.5 block truncate text-[13px] text-soft">
            {entry.email}
            {entry.orgName ? ` · ${entry.orgName}` : ""}
          </span>
        </span>
        <span className="t-id whitespace-nowrap text-soft">
          {new Date(entry.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
        </span>
        <ChevronDown
          size={16}
          strokeWidth={1.75}
          className={`shrink-0 text-soft transition-transform duration-150 ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          id={panelId}
          className="mx-4 grid grid-cols-1 gap-x-8 gap-y-3 border-t border-line py-4 text-[13px] sm:grid-cols-2"
        >
          <Value
            label="Email"
            value={entry.freeEmailDomain ? `${entry.email} (personal address)` : entry.email}
          />
          <Value label="Organisation" value={entry.orgName} />
          <Value label="Role" value={entry.jobTitle} />
          <Value label="Industry" value={entry.industry} />
          <Value label="Framework" value={entry.frameworks.join(", ")} />
          <Value label="Source" value={source} />
          <Value label="Referrer" value={entry.referrer} />
          <Value label="Confirmation sent" value={entry.confirmationSent ? "Yes" : "No"} />
          <Value label="Consent given" value={new Date(entry.consentedAt).toLocaleString("en-GB")} />
          <Value label="Signed up" value={new Date(entry.createdAt).toLocaleString("en-GB")} />
          {entry.painPoints && (
            <div className="sm:col-span-2">
              <p className="t-id text-soft">SLOWS REVIEWS</p>
              <p className="mt-1 whitespace-pre-wrap text-ink">{entry.painPoints}</p>
            </div>
          )}
        </div>
      )}
    </li>
  );
}

function Stat({ label, value }: Readonly<{ label: string; value: number }>) {
  return (
    <div className="rounded-md border border-line bg-raised p-4">
      <dt className="t-id mb-1 text-soft">{label.toUpperCase()}</dt>
      <dd className="t-metric m-0 text-2xl text-ink">{value}</dd>
    </div>
  );
}

function Value({ label, value }: Readonly<{ label: string; value?: string }>) {
  return (
    <div>
      <p className="t-id text-soft">{label.toUpperCase()}</p>
      <p className="mt-0.5 break-all text-ink">{value || "-"}</p>
    </div>
  );
}
