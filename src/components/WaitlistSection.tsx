"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, SyntheticEvent } from "react";
import Confetti from "@/components/Confetti";

interface FormData {
  email: string;
  firstName: string;
  lastName: string;
  orgName: string;
  jobTitle: string;
  industry: string;
  frameworks: string;
  painPoints: string;
}

const optionData = [
  {
    value: "newsletter",
    emoji: "📬",
    title: "Stay informed",
    subtitle:
      "Occasional updates on our progress, EA insights, and launch news. No spam.",
  },
  {
    value: "launch",
    emoji: "🚀",
    title: "Launch notification",
    subtitle:
      "Get a one-time email when ArchitectureAI opens its doors. Plus priority onboarding.",
  },
  {
    value: "partner",
    emoji: "🤝",
    title: "Become a testing partner",
    subtitle:
      "Early access when we're ready. Shape the product with your feedback. Free during the testing period.",
  },
];

/* ── Shared input className (no bg/border — handled via style) ── */
const inputCls =
  "w-full px-3 py-2.5 rounded-md text-sm outline-none transition-all duration-200";

export default function WaitlistSection() {
  const [interest, setInterest] = useState("newsletter");
  const [formData, setFormData] = useState<FormData>({
    email: "",
    firstName: "",
    lastName: "",
    orgName: "",
    jobTitle: "",
    industry: "",
    frameworks: "",
    painPoints: "",
  });
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const formRef = useRef<HTMLFormElement>(null);

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.email.trim()) errs.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()))
      errs.email = "Invalid email";
    if (!formData.firstName.trim()) errs.firstName = "Required";
    if (!formData.lastName.trim()) errs.lastName = "Required";
    if (!formData.orgName.trim()) errs.orgName = "Required";
    if (!formData.jobTitle.trim()) errs.jobTitle = "Required";
    if (!formData.industry.trim()) errs.industry = "Required";
    if (!formData.frameworks.trim()) errs.frameworks = "Required";
    if (!consent) errs.consent = "You must agree to continue";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!validate()) return;

    setSubmitting(true);

    const payload = {
      interest,
      ...formData,
      consentedAt: new Date().toISOString(),
    };

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong");
      }
      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="signup" className="max-w-275 mx-auto px-6 pb-28">
      <div className="border-t pt-20" style={{ borderColor: "var(--border-dim)" }} />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-16 items-start">
        {/* Left: narrative + options */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
        >
          <h2
            className="text-[clamp(1.6rem,2.8vw,2rem)] font-bold tracking-tight leading-tight mb-3"
            style={{ color: "var(--text)" }}
          >
            Be first in line.
            <br />
            No commitment required.
          </h2>
          <p className="text-[0.95rem] leading-relaxed mb-6" style={{ color: "var(--text-muted)" }}>
            ArchitectureAI is in active development and not yet available. But
            we&apos;re building for practitioners like you — and your input will
            shape what we ship. Choose how you want to engage.
          </p>

          {/* Option trio */}
          <div className="flex flex-col gap-3 mb-8">
            {optionData.map((opt) => (
              <motion.label
                key={opt.value}
                onClick={() => setInterest(opt.value)}
                whileTap={{ scale: 0.995 }}
                className="flex items-start gap-3.5 p-4 rounded-xl border cursor-pointer transition-all duration-200"
                style={{
                  borderColor:
                    interest === opt.value ? "var(--accent)" : "var(--border-dim)",
                  background:
                    interest === opt.value
                      ? "rgba(88,124,255,0.06)"
                      : "var(--surface)",
                  boxShadow:
                    interest === opt.value
                      ? "0 0 0 3px rgba(88,124,255,0.08)"
                      : "none",
                }}
              >
                <input
                  type="radio"
                  name="interest"
                  value={opt.value}
                  checked={interest === opt.value}
                  onChange={() => setInterest(opt.value)}
                  className="sr-only"
                />
                <div
                  className="w-5 h-5 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center transition-colors"
                  style={{
                    borderColor:
                      interest === opt.value ? "var(--accent)" : "var(--border)",
                  }}
                >
                  {interest === opt.value && (
                    <motion.div
                      layoutId="radio-dot"
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: "var(--accent)" }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                    />
                  )}
                </div>
                <div>
                  <h4
                    className="text-[0.9rem] font-semibold tracking-[-0.01em] mb-0.5"
                    style={{ color: "var(--text)" }}
                  >
                    {opt.emoji} {opt.title}
                  </h4>
                  <span className="text-[0.78rem]" style={{ color: "var(--text-muted)" }}>
                    {opt.subtitle}
                  </span>
                </div>
              </motion.label>
            ))}
          </div>

          {/* Quote */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="p-4 rounded-xl border text-[0.82rem] italic leading-relaxed"
            style={{
              borderColor: "var(--border-dim)",
              background: "var(--ink-lift)",
              color: "var(--text-muted)",
            }}
          >
            &ldquo;We&apos;re a small, focused team of architects and engineers
            who&apos;ve lived the pain of manual governance reviews.
            ArchitectureAI is the tool we wish we&apos;d always had. We
            can&apos;t wait to share it.&rdquo;
            <br />
            <strong
              className="not-italic font-semibold mt-1 inline-block"
              style={{ color: "var(--text-soft)" }}
            >
              — ArchitectureAI founding team
            </strong>
          </motion.div>
        </motion.div>

        {/* Right: form panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const, delay: 0.1 }}
          className="p-9 rounded-2xl border lg:sticky lg:top-28"
          style={{
            borderColor: "var(--border-dim)",
            background: "var(--surface)",
          }}
        >
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="text-center py-6 relative"
              >
                <Confetti active={submitted} />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.1 }}
                  className="w-14 h-14 rounded-full inline-flex items-center justify-center text-2xl mb-4"
                  style={{ background: "var(--green-dim)", color: "var(--green)" }}
                >
                  ✓
                </motion.div>
                <h3
                  className="text-[1.15rem] font-semibold mb-1.5"
                  style={{ color: "var(--text)" }}
                >
                  You&apos;re on the list.
                </h3>
                <p
                  className="text-[0.85rem] leading-relaxed max-w-xs mx-auto"
                  style={{ color: "var(--text-muted)" }}
                >
                  We&apos;ll be in touch when there&apos;s something to share —
                  and we promise to make it worth the wait.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h3
                  className="text-[1.1rem] font-semibold tracking-[-0.01em] mb-1"
                  style={{ color: "var(--text)" }}
                >
                  Join the waitlist
                </h3>
                <p className="text-[0.82rem] mb-6" style={{ color: "var(--text-muted)" }}>
                  We&apos;ll never share your email. Unsubscribe anytime.
                </p>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="px-3.5 py-2.5 rounded-md border text-xs mb-4"
                    style={{
                      background: "rgba(248,113,113,0.08)",
                      borderColor: "rgba(248,113,113,0.2)",
                      color: "var(--red)",
                    }}
                  >
                    {error}
                  </motion.div>
                )}

                <form ref={formRef} onSubmit={handleSubmit} noValidate>
                  {/* Email */}
                  <Field label="Work email" htmlFor="email" required error={errors.email}>
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      placeholder="jane.doe@company.com"
                      autoComplete="email"
                      className={inputCls}
                      style={inputStyle()}
                    />
                  </Field>

                  {/* Name row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="First name" htmlFor="firstName" required error={errors.firstName}>
                      <input
                        id="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => updateField("firstName", e.target.value)}
                        placeholder="Jane"
                        autoComplete="given-name"
                        className={inputCls}
                        style={inputStyle()}
                      />
                    </Field>
                    <Field label="Last name" htmlFor="lastName" required error={errors.lastName}>
                      <input
                        id="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => updateField("lastName", e.target.value)}
                        placeholder="Doe"
                        autoComplete="family-name"
                        className={inputCls}
                        style={inputStyle()}
                      />
                    </Field>
                  </div>

                  {/* Organisation */}
                  <Field label="Organisation" htmlFor="orgName" required error={errors.orgName}>
                    <input
                      id="orgName"
                      type="text"
                      value={formData.orgName}
                      onChange={(e) => updateField("orgName", e.target.value)}
                      placeholder="Acme Corp"
                      className={inputCls}
                      style={inputStyle()}
                    />
                  </Field>

                  {/* Job title + Industry */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Job title" htmlFor="jobTitle" required error={errors.jobTitle}>
                      <select
                        id="jobTitle"
                        value={formData.jobTitle}
                        onChange={(e) => updateField("jobTitle", e.target.value)}
                        className={inputCls + " cursor-pointer appearance-none"}
                        style={{
                          ...inputStyle(),
                          backgroundImage:
                            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' fill='none'%3E%3Cpath d='M1 1.5l5 5 5-5' stroke='%236e7388' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E\")",
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "right 12px center",
                          paddingRight: "2rem",
                        }}
                      >
                        <option value="" disabled>Select…</option>
                        <option value="enterprise-architect">Enterprise Architect</option>
                        <option value="solution-architect">Solution Architect</option>
                        <option value="cto">CTO / VP of Engineering</option>
                        <option value="head-of-engineering">Head of Engineering</option>
                        <option value="compliance-governance">IT Governance / Compliance Lead</option>
                        <option value="engineering-manager">Engineering Manager</option>
                        <option value="other">Other</option>
                      </select>
                    </Field>
                    <Field label="Industry" htmlFor="industry" required error={errors.industry}>
                      <select
                        id="industry"
                        value={formData.industry}
                        onChange={(e) => updateField("industry", e.target.value)}
                        className={inputCls + " cursor-pointer appearance-none"}
                        style={{
                          ...inputStyle(),
                          backgroundImage:
                            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' fill='none'%3E%3Cpath d='M1 1.5l5 5 5-5' stroke='%236e7388' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E\")",
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "right 12px center",
                          paddingRight: "2rem",
                        }}
                      >
                        <option value="" disabled>Select…</option>
                        <option value="banking">Banking</option>
                        <option value="fintech">FinTech</option>
                        <option value="insurance">Insurance</option>
                        <option value="saas">SaaS / Technology</option>
                        <option value="telecom">Telecom</option>
                        <option value="government">Government</option>
                        <option value="healthcare">Healthcare</option>
                        <option value="manufacturing">Manufacturing</option>
                        <option value="consulting">Consulting</option>
                        <option value="other">Other</option>
                      </select>
                    </Field>
                  </div>

                  {/* Frameworks */}
                  <Field label="Primary frameworks you use" htmlFor="frameworks" required error={errors.frameworks}>
                    <select
                      id="frameworks"
                      value={formData.frameworks}
                      onChange={(e) => updateField("frameworks", e.target.value)}
                      className={inputCls + " cursor-pointer appearance-none"}
                      style={{
                        ...inputStyle(),
                        backgroundImage:
                          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' fill='none'%3E%3Cpath d='M1 1.5l5 5 5-5' stroke='%236e7388' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E\")",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 12px center",
                        paddingRight: "2rem",
                      }}
                    >
                      <option value="" disabled>Select…</option>
                      <option value="togaf">TOGAF</option>
                      <option value="archimate">ArchiMate</option>
                      <option value="aws-wa">AWS Well-Architected</option>
                      <option value="azure-caf">Azure Cloud Adoption Framework</option>
                      <option value="custom">Custom / Internal</option>
                      <option value="none">None — we don&apos;t use a formal framework</option>
                    </select>
                  </Field>

                  {/* Pain points */}
                  <Field label="What frustrates you most about architecture governance?" htmlFor="painPoints">
                    <textarea
                      id="painPoints"
                      value={formData.painPoints}
                      onChange={(e) => updateField("painPoints", e.target.value)}
                      placeholder="Tell us about your current review process, bottlenecks, or anything you'd like us to know…"
                      rows={3}
                      className={inputCls + " resize-y min-h-22"}
                      style={inputStyle()}
                    />
                  </Field>

                  {/* Consent */}
                  <div className="flex flex-col gap-1.5 mb-4">
                    <motion.label
                      className="flex items-start gap-2.5 mt-2 text-xs leading-relaxed cursor-pointer"
                      style={{ color: "var(--text-muted)" }}
                      whileHover={{ color: "var(--text-soft)" }}
                    >
                      <input
                        type="checkbox"
                        required
                        checked={consent}
                        onChange={(e) => {
                          setConsent(e.target.checked);
                          if (errors.consent) {
                            setErrors((prev) => {
                              const next = { ...prev };
                              delete next.consent;
                              return next;
                            });
                          }
                        }}
                        className="mt-0.5 w-3.75 h-3.75 cursor-pointer accent-[#587cff]"
                      />
                      <span>
                        I agree to receive emails from ArchitectureAI and understand my
                        data will be handled securely.
                      </span>
                    </motion.label>
                    {errors.consent && (
                      <motion.span
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[0.7rem]"
                        style={{ color: "var(--red)" }}
                      >
                        {errors.consent}
                      </motion.span>
                    )}
                  </div>

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    disabled={submitting}
                    whileHover={{ scale: submitting ? 1 : 1.01, y: submitting ? 0 : -1 }}
                    whileTap={{ scale: submitting ? 1 : 0.98 }}
                    className="w-full py-3.5 rounded-full font-semibold text-sm tracking-[-0.01em] disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200 cursor-pointer text-white"
                    style={{ background: "var(--accent)" }}
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        />
                        Submitting…
                      </span>
                    ) : (
                      "Join the waitlist"
                    )}
                  </motion.button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

/* Helper to build inline styles for form inputs from CSS variables */
function inputStyle(): React.CSSProperties {
  return {
    border: "1px solid var(--border)",
    background: "var(--ink-lift)",
    color: "var(--text)",
  };
}

/* Tiny field wrapper */
function Field({
  label,
  htmlFor,
  required,
  error,
  children,
}: Readonly<{
  label: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col gap-1.5 mb-4">
      <label
        htmlFor={htmlFor}
        className="text-[0.72rem] font-semibold uppercase tracking-[0.06em]"
        style={{ color: "var(--text-soft)" }}
      >
        {label}
        {required && (
          <span className="ml-0.5" style={{ color: "var(--accent-lit)" }}>
            *
          </span>
        )}
      </label>
      {children}
      {error && (
        <motion.span
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[0.7rem]"
          style={{ color: "var(--red)" }}
        >
          {error}
        </motion.span>
      )}
    </div>
  );
}