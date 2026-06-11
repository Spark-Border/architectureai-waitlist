"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
  confirmationSent: boolean;
  consentedAt: string;
  createdAt: string;
}

interface Stats {
  total: number;
  newsletter: number;
  launch: number;
  partner: number;
}

const interestLabels: Record<string, string> = {
  newsletter: "📬 Informed",
  launch: "🚀 Launch",
  partner: "🤝 Partner",
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
      const res = await fetch(
        `/api/admin?token=${encodeURIComponent(t)}`,
        { headers: { "x-admin-token": t } }
      );
      if (res.status === 401) {
        setError("Wrong password.");
        setAuthenticated(false);
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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEntries(token.trim());
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
      <div className="min-h-screen bg-[#080b14] flex items-center justify-center px-6">
        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          onSubmit={handleLogin}
          className="w-full max-w-sm p-8 rounded-2xl border border-[#1a1f35] bg-[#111627]"
        >
          <h1 className="text-lg font-bold text-white mb-1">Admin</h1>
          <p className="text-xs text-[#6e7388] mb-6">Enter the admin password to view signups.</p>
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-[#f87171] mb-4 bg-[rgba(248,113,113,0.08)] border border-[rgba(248,113,113,0.2)] rounded-md px-3 py-2"
            >
              {error}
            </motion.p>
          )}
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Password"
            className="w-full px-3 py-2.5 rounded-md border border-[#222840] bg-[#0d1120] text-[#edf0f5] text-sm outline-none focus:border-[#587cff] focus:shadow-[0_0_0_3px_rgba(88,124,255,0.1)] mb-4"
            autoFocus
          />
          <button
            type="submit"
            disabled={!token.trim() || loading}
            className="w-full py-2.5 rounded-full bg-[#587cff] text-white font-semibold text-sm disabled:opacity-40 cursor-pointer hover:bg-[#7b98ff] transition-colors"
          >
            {loading ? "Checking…" : "View signups"}
          </button>
        </motion.form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080b14] text-[#edf0f5]">
      {/* Header */}
      <div className="max-w-5xl mx-auto px-6 py-8 flex items-center justify-between border-b border-[#1a1f35]">
        <div>
          <h1 className="text-lg font-bold text-white">ArchitectureAI Admin</h1>
          <p className="text-xs text-[#6e7388]">{stats?.total ?? 0} total signups</p>
        </div>
        <button
          onClick={() => { setAuthenticated(false); setToken(""); setEntries([]); setStats(null); }}
          className="px-4 py-2 rounded-full border border-[#222840] text-xs text-[#6e7388] hover:border-[#587cff] hover:text-white transition-colors cursor-pointer"
        >
          Lock
        </button>
        {stats && stats.total > 0 && (
          <a
            href={`/api/admin/export?token=${encodeURIComponent(token)}`}
            className="px-4 py-2 rounded-full border border-[#1a4d3a] text-xs text-[#34d399] hover:bg-[#1a4d3a] transition-colors cursor-pointer no-underline"
            download
          >
            Export CSV →
          </a>
        )}
      </div>

      {/* Stats cards */}
      {stats && (
        <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-4 gap-4">
          <StatCard label="Total" value={stats.total} color="#7b98ff" />
          <StatCard label="Newsletter" value={stats.newsletter} emoji="📬" />
          <StatCard label="Launch" value={stats.launch} emoji="🚀" />
          <StatCard label="Partners" value={stats.partner} emoji="🤝" />
        </div>
      )}

      {/* Entry list */}
      <div className="max-w-5xl mx-auto px-6 pb-16">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold text-[#b4bac8] uppercase tracking-[0.06em]">
            Signups
          </h2>
          <button
            onClick={() => fetchEntries(token)}
            disabled={loading}
            className="text-xs text-[#587cff] hover:underline cursor-pointer"
          >
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {entries.map((entry) => {
            const isOpen = expanded.has(entry._id);
            return (
              <motion.div
                key={entry._id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="rounded-xl border border-[#1a1f35] bg-[#111627] overflow-hidden"
              >
                <button
                  onClick={() => toggleExpand(entry._id)}
                  className="w-full text-left px-5 py-4 flex items-center gap-4 cursor-pointer hover:bg-[#111627]/80 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white truncate">
                        {entry.firstName} {entry.lastName}
                      </span>
                      <span className="text-[0.65rem] px-2 py-0.5 rounded-full bg-[rgba(88,124,255,0.1)] text-[#7b98ff] font-medium">
                        {interestLabels[entry.interest] || entry.interest}
                      </span>
                    </div>
                    <p className="text-xs text-[#6e7388] mt-0.5 truncate">
                      {entry.email}{entry.orgName ? ` · ${entry.orgName}` : ""}
                    </p>
                  </div>
                  <span className="text-[0.68rem] text-[#3a3f55] whitespace-nowrap">
                    {new Date(entry.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    className="text-[#6e7388] text-xs"
                  >
                    ▼
                  </motion.span>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 grid grid-cols-2 gap-x-8 gap-y-2 text-xs border-t border-[#1a1f35] pt-4 mx-5">
                        <Row label="Email" value={entry.email} />
                        <Row label="Organisation" value={entry.orgName || "—"} />
                        <Row label="Job title" value={entry.jobTitle || "—"} />
                        <Row label="Industry" value={entry.industry || "—"} />
                        <Row label="Frameworks" value={entry.frameworks.join(", ") || "—"} />
                        <Row label="Signed up" value={new Date(entry.createdAt).toLocaleString()} />
                        {/* Pain points gets full width */}
                        {entry.painPoints && (
                          <div className="col-span-2 mt-2">
                            <span className="text-[#3a3f55]">Pain points</span>
                            <p className="text-[#b4bac8] mt-1 italic leading-relaxed">{entry.painPoints}</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {entries.length === 0 && !loading && (
          <p className="text-center text-sm text-[#3a3f55] py-16">No signups yet.</p>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
  emoji,
}: {
  label: string;
  value: number;
  color?: string;
  emoji?: string;
}) {
  return (
    <div className="p-5 rounded-xl border border-[#1a1f35] bg-[#111627]">
      <p className="text-[0.68rem] text-[#6e7388] uppercase tracking-[0.05em] mb-1">
        {emoji ? `${emoji} ` : ""}{label}
      </p>
      <p className="text-2xl font-extrabold text-white tracking-[-0.02em]" style={{ color: color || "#fff" }}>
        {value}
      </p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-[#3a3f55]">{label}</span>
      <p className="text-[#b4bac8] mt-0.5 break-all">{value}</p>
    </div>
  );
}