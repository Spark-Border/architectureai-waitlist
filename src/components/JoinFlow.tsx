"use client";

import { useEffect, useRef, useState, SyntheticEvent } from "react";
import Link from "next/link";
import { ArrowLeft, CircleCheck } from "lucide-react";
import Chips from "@/components/Chips";
import { isFreeEmailDomain, isValidEmail } from "@/lib/validate";
import { track } from "@/lib/analytics";

type Step = 1 | 2 | 3 | "done";
type Interest = "partner" | "launch" | "newsletter";

const OTHER = "Other";

const roles = [
  "Enterprise Architect",
  "Solution Architect",
  "Business Architect",
  "Data Architect",
  "CTO / CIO",
  "Head of Engineering",
  "Governance, Risk & Compliance",
  "Engineering Manager",
  OTHER,
];

const industries = [
  "Banking",
  "FinTech",
  "Insurance",
  "SaaS / Technology",
  "Telecom",
  "Government",
  "Healthcare",
  "Manufacturing",
  "Consulting",
  OTHER,
];

const frameworkOptions = [
  "TOGAF",
  "ArchiMate",
  "Zachman",
  "Custom / internal",
  "AWS Well-Architected",
  "Azure CAF",
  "None formally",
];

const interests: { value: Interest; title: string; body: string }[] = [
  {
    value: "partner",
    title: "Testing partner",
    body: "Early access, free during testing. You give feedback as we build.",
  },
  {
    value: "launch",
    title: "Launch update",
    body: "One email when ArchitectureAI opens, with priority onboarding.",
  },
  {
    value: "newsletter",
    title: "Progress updates",
    body: "Occasional notes on what we are building. Nothing else.",
  },
];

const benefits = [
  "Free during the testing period",
  "Priority onboarding",
  "A say in what we build first",
];

const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL;

const STEP_TITLES: Record<1 | 2 | 3, string> = {
  1: "Join the waitlist",
  2: "Tell us about your work",
  3: "Help us prepare",
};

async function send(method: "POST" | "PATCH", payload: object) {
  const res = await fetch("/api/waitlist", {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(
      data.error || "We couldn't save that. Try again in a minute.",
    );
    (error as Error & { status?: number }).status = res.status;
    throw error;
  }
  return data as { success: boolean; token?: string };
}

export default function JoinFlow() {
  const [step, setStep] = useState<Step>(1);
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<string[]>([]);
  const [customRole, setCustomRole] = useState("");
  const [industry, setIndustry] = useState<string[]>([]);
  const [customIndustry, setCustomIndustry] = useState("");
  const [orgName, setOrgName] = useState("");
  const [frameworks, setFrameworks] = useState<string[]>([]);
  const [painPoints, setPainPoints] = useState("");
  const [interest, setInterest] = useState<Interest>("partner");
  const [website, setWebsite] = useState(""); // honeypot, must stay empty
  /* What the success screen promises: only people who chose to be testing partners are told about a call. */
  const [finishedAs, setFinishedAs] = useState<Interest | "skipped">("skipped");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [busy, setBusy] = useState(false);

  const headingRef = useRef<HTMLHeadingElement>(null);
  const submitEmailRef = useRef<(value: string) => void>(() => {});
  const stepRef = useRef<Step>(1);

  /* Move focus to the new step's heading so keyboard and screen-reader users land on it. */
  useEffect(() => {
    if (step !== 1) headingRef.current?.focus();
  }, [step]);

  /* The hero email box hands its value to this flow. */
  useEffect(() => {
    const onPrefill = (event: Event) => {
      const detail = (event as CustomEvent<{ email: string }>).detail;
      if (detail?.email && stepRef.current === 1) {
        setEmail(detail.email);
        submitEmailRef.current(detail.email);
      }
    };
    window.addEventListener("join:prefill", onPrefill);
    return () => window.removeEventListener("join:prefill", onPrefill);
  }, []);

  const clearError = (key: string) =>
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });

  const restart = (message: string) => {
    setServerError(message);
    setToken("");
    setStep(1);
  };

  /* ── Step 1: email ── */
  const submitEmail = async (value: string) => {
    if (busy) return;
    setServerError("");
    const trimmed = value.trim();
    if (!trimmed) return setErrors({ email: "Add your work email." });
    if (!isValidEmail(trimmed))
      return setErrors({
        email: "That email doesn't look right. Check for typos.",
      });
    setErrors({});

    setBusy(true);
    try {
      const params = new URLSearchParams(window.location.search);
      const data = await send("POST", {
        email: trimmed,
        consent: true,
        website,
        utmSource: params.get("utm_source") ?? "",
        utmMedium: params.get("utm_medium") ?? "",
        utmCampaign: params.get("utm_campaign") ?? "",
        referrer: document.referrer,
      });
      setToken(data.token ?? "");
      track("Signup email");
      setStep(2);
    } catch (err) {
      setServerError(
        err instanceof Error
          ? err.message
          : "We couldn't save that. Try again in a minute.",
      );
    } finally {
      setBusy(false);
    }
  };
  /* Keep the listener pointed at the latest handler and step without re-subscribing. */
  useEffect(() => {
    submitEmailRef.current = submitEmail;
    stepRef.current = step;
  });

  /* ── Step 2: who you are ── */
  const submitProfile = async () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Add your name.";
    if (role.length === 0) errs.role = "Choose your role.";
    else if (role[0] === OTHER && !customRole.trim())
      errs.customRole = "Tell us your job title.";
    if (industry.length === 0) errs.industry = "Choose your industry.";
    else if (industry[0] === OTHER && !customIndustry.trim())
      errs.customIndustry = "Tell us your industry.";
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      document.getElementById(Object.keys(errs)[0])?.focus();
      return;
    }

    setServerError("");
    setBusy(true);
    try {
      await send("PATCH", {
        step: 2,
        email: email.trim(),
        token,
        name,
        jobTitle: role[0] === OTHER ? customRole : role[0],
        industry: industry[0] === OTHER ? customIndustry : industry[0],
        orgName,
      });
      track("Signup profile", { role: role[0] === OTHER ? OTHER : role[0] });
      setStep(3);
    } catch (err) {
      if ((err as { status?: number }).status === 401) {
        restart("Your session timed out. Enter your email to start again.");
      } else {
        setServerError(
          err instanceof Error
            ? err.message
            : "We couldn't save that. Try again in a minute.",
        );
      }
    } finally {
      setBusy(false);
    }
  };

  /* ── Step 3: optional extras ── */
  const submitExtras = async (skip: boolean) => {
    if (skip) {
      track("Signup skipped extras");
      setFinishedAs("skipped");
      return setStep("done");
    }
    setServerError("");
    setBusy(true);
    try {
      await send("PATCH", {
        step: 3,
        email: email.trim(),
        token,
        interest,
        frameworks,
        painPoints,
      });
      track("Signup finished", { interest });
      setFinishedAs(interest);
      setStep("done");
    } catch (err) {
      if ((err as { status?: number }).status === 401) {
        restart("Your session timed out. Enter your email to start again.");
      } else {
        setServerError(
          err instanceof Error
            ? err.message
            : "We couldn't save that. Try again in a minute.",
        );
      }
    } finally {
      setBusy(false);
    }
  };

  const onSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (step === 1) void submitEmail(email);
    else if (step === 2) void submitProfile();
    else if (step === 3) void submitExtras(false);
  };

  const extrasUntouched =
    frameworks.length === 0 && !painPoints.trim() && interest === "partner";
  const firstName = name.trim().split(/\s+/)[0];
  const nudgeWorkEmail = step === 1 && isFreeEmailDomain(email);

  return (
    <section
      id="join"
      aria-labelledby="join-title"
      className="mx-auto w-full max-w-275 px-4 py-12 sm:px-6 md:py-20"
    >
      <div className="mx-auto mb-8 max-w-2xl text-center">
        <p className="t-id mb-3 text-teal">TESTING GROUP</p>
        <h2 id="join-title" className="t-display text-ink">
          Help shape the first release.
        </h2>
        <p className="mt-4 text-[15px] text-soft sm:text-base">
          ArchitectureAI will soon be available. We are working with enterprise
          teams now, so the first version fits how architecture work actually
          runs.
        </p>
        <ul className="m-0 mt-5 flex list-none flex-wrap justify-center gap-x-6 gap-y-2 p-0">
          {benefits.map((benefit) => (
            <li
              key={benefit}
              className="flex items-center gap-2 text-[13px] text-ink"
            >
              <CircleCheck
                size={16}
                strokeWidth={1.75}
                className="text-teal"
                aria-hidden="true"
              />
              {benefit}
            </li>
          ))}
        </ul>
      </div>

      <div className="mx-auto w-full max-w-xl rounded-md border border-line bg-raised p-5 sm:p-8">
        {step === "done" ? (
          <div role="status" aria-live="polite" className="py-2 text-center">
            <CircleCheck
              size={32}
              strokeWidth={1.75}
              className="mx-auto mb-4 text-teal"
              aria-hidden="true"
            />
            <h3
              ref={headingRef}
              tabIndex={-1}
              className="text-xl font-bold tracking-tight text-ink outline-none"
            >
              You&apos;re on the list{firstName ? `, ${firstName}` : ""}.
            </h3>
            <p className="mx-auto mt-3 max-w-md text-[14px] text-soft">
              A confirmation is on its way to {email.trim()}. If you don&apos;t
              see it, check your spam folder.{" "}
              {finishedAs === "partner"
                ? "We will email you to arrange a short conversation about how your architecture reviews run today."
                : "We will email you when there is something to share."}
            </p>
            {finishedAs === "partner" && bookingUrl && (
              <a
                href={bookingUrl}
                className="btn btn-primary mt-6"
                rel="noopener"
              >
                Book a conversation
              </a>
            )}
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate>
            {/* Progress */}
            <div className="mb-6">
              <div className="mb-3 flex items-center justify-between">
                <p className="t-id text-soft" aria-live="polite">
                  STEP {step} OF 3
                </p>
                {step !== 1 && (
                  <button
                    type="button"
                    onClick={() => setStep(step === 3 ? 2 : 1)}
                    className="t-ui flex cursor-pointer items-center gap-1 bg-transparent text-soft hover:text-ink"
                  >
                    <ArrowLeft
                      size={14}
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                    Back
                  </button>
                )}
              </div>
              <div className="flex gap-1.5" aria-hidden="true">
                {[1, 2, 3].map((n) => (
                  <span
                    key={n}
                    className={`h-1 flex-1 rounded-sm ${n <= step ? "bg-teal" : "bg-line"}`}
                  />
                ))}
              </div>
            </div>

            <h3
              ref={headingRef}
              tabIndex={-1}
              className="text-xl font-bold tracking-tight text-ink outline-none"
            >
              {STEP_TITLES[step]}
            </h3>

            {serverError && (
              <p
                role="alert"
                className="mt-4 rounded-sm border border-line bg-paper p-3 text-[13px] text-danger"
              >
                {serverError}
              </p>
            )}

            {step === 1 && (
              <>
                <p className="mb-5 mt-1 text-[14px] text-soft">
                  Start with your work email. Two short steps follow, and the
                  second is optional.
                </p>
                <label htmlFor="email" className="t-ui mb-1.5 block text-ink">
                  Work email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearError("email");
                  }}
                  placeholder="jane.doe@company.com"
                  autoComplete="email"
                  aria-invalid={errors.email ? true : undefined}
                  aria-describedby={
                    errors.email
                      ? "email-error"
                      : nudgeWorkEmail
                        ? "email-hint"
                        : undefined
                  }
                  className="control"
                />
                {errors.email && (
                  <p
                    id="email-error"
                    className="mt-1.5 text-[13px] text-danger"
                  >
                    {errors.email}
                  </p>
                )}
                {nudgeWorkEmail && !errors.email && (
                  <p id="email-hint" className="mt-1.5 text-[13px] text-soft">
                    A work email helps us place you in the right conversation.
                    You can still continue with this one.
                  </p>
                )}

                {/* Honeypot: hidden from people and assistive tech, bots fill it in */}
                <div className="sr-only" aria-hidden="true">
                  <label htmlFor="website">Leave this field empty</label>
                  <input
                    id="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={busy}
                  className="btn btn-primary mt-5 w-full"
                >
                  {busy ? "Sending…" : "Join Waitlist"}
                </button>
                <p className="mt-4 text-[12px] leading-relaxed text-soft">
                  By continuing you agree to get emails from ArchitectureAI
                  about early access. Read the{" "}
                  <Link href="/privacy">privacy notice</Link>. You can
                  unsubscribe by replying to any email.
                </p>
              </>
            )}

            {step === 2 && (
              <>
                <p className="mb-5 mt-1 text-[14px] text-soft">
                  So we can match you with the right conversation.
                </p>

                <div className="mb-5">
                  <label htmlFor="name" className="t-ui mb-1.5 block text-ink">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      clearError("name");
                    }}
                    autoComplete="name"
                    aria-invalid={errors.name ? true : undefined}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    className="control"
                  />
                  {errors.name && (
                    <p
                      id="name-error"
                      className="mt-1.5 text-[13px] text-danger"
                    >
                      {errors.name}
                    </p>
                  )}
                </div>

                <div id="role">
                  <Chips
                    legend="Role"
                    name="role"
                    options={roles}
                    value={role}
                    onChange={(v) => {
                      setRole(v);
                      clearError("role");
                    }}
                    error={errors.role}
                    errorId="role-error"
                  />
                </div>
                {role[0] === OTHER && (
                  <div className="-mt-2 mb-5">
                    <label
                      htmlFor="customRole"
                      className="t-ui mb-1.5 block text-ink"
                    >
                      Your job title
                    </label>
                    <input
                      id="customRole"
                      type="text"
                      value={customRole}
                      onChange={(e) => {
                        setCustomRole(e.target.value);
                        clearError("customRole");
                      }}
                      aria-invalid={errors.customRole ? true : undefined}
                      aria-describedby={
                        errors.customRole ? "customRole-error" : undefined
                      }
                      className="control"
                    />
                    {errors.customRole && (
                      <p
                        id="customRole-error"
                        className="mt-1.5 text-[13px] text-danger"
                      >
                        {errors.customRole}
                      </p>
                    )}
                  </div>
                )}

                <div id="industry">
                  <Chips
                    legend="Industry"
                    name="industry"
                    options={industries}
                    value={industry}
                    onChange={(v) => {
                      setIndustry(v);
                      clearError("industry");
                    }}
                    error={errors.industry}
                    errorId="industry-error"
                  />
                </div>
                {industry[0] === OTHER && (
                  <div className="-mt-2 mb-5">
                    <label
                      htmlFor="customIndustry"
                      className="t-ui mb-1.5 block text-ink"
                    >
                      Your industry
                    </label>
                    <input
                      id="customIndustry"
                      type="text"
                      value={customIndustry}
                      onChange={(e) => {
                        setCustomIndustry(e.target.value);
                        clearError("customIndustry");
                      }}
                      aria-invalid={errors.customIndustry ? true : undefined}
                      aria-describedby={
                        errors.customIndustry
                          ? "customIndustry-error"
                          : undefined
                      }
                      className="control"
                    />
                    {errors.customIndustry && (
                      <p
                        id="customIndustry-error"
                        className="mt-1.5 text-[13px] text-danger"
                      >
                        {errors.customIndustry}
                      </p>
                    )}
                  </div>
                )}

                <div className="mb-6">
                  <label
                    htmlFor="orgName"
                    className="t-ui mb-1.5 block text-ink"
                  >
                    Organisation
                    <span className="ml-1.5 font-normal text-soft">
                      Optional
                    </span>
                  </label>
                  <input
                    id="orgName"
                    type="text"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    autoComplete="organization"
                    className="control"
                  />
                </div>

                <button
                  type="submit"
                  disabled={busy}
                  className="btn btn-primary w-full"
                >
                  {busy ? "Saving…" : "Continue"}
                </button>
              </>
            )}

            {step === 3 && (
              <>
                <p className="mb-5 mt-1 text-[14px] text-soft">
                  Optional. Your answers shape what we build first.
                </p>

                <Chips
                  legend="Which frameworks do you work with?"
                  name="frameworks"
                  options={frameworkOptions}
                  value={frameworks}
                  onChange={setFrameworks}
                  multiple
                  optional
                />

                <div className="mb-5">
                  <label
                    htmlFor="painPoints"
                    className="t-ui mb-1.5 block text-ink"
                  >
                    What slows your architecture reviews down most?
                    <span className="ml-1.5 font-normal text-soft">
                      Optional
                    </span>
                  </label>
                  <textarea
                    id="painPoints"
                    value={painPoints}
                    onChange={(e) => setPainPoints(e.target.value)}
                    placeholder="For example: submissions wait on a few senior people, or principles are applied unevenly."
                    rows={3}
                    maxLength={2000}
                    className="control min-h-24 resize-y"
                  />
                </div>

                <fieldset className="mb-6 min-w-0 border-0 p-0">
                  <legend className="t-ui mb-2 text-ink">
                    How would you like to take part?
                  </legend>
                  <div className="grid gap-2">
                    {interests.map((opt) => (
                      <label
                        key={opt.value}
                        className="flex cursor-pointer items-start gap-3 rounded-md border border-line bg-paper p-3 has-checked:border-teal has-checked:bg-teal-soft has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-teal"
                      >
                        <input
                          type="radio"
                          name="interest"
                          value={opt.value}
                          checked={interest === opt.value}
                          onChange={() => setInterest(opt.value)}
                          className="mt-1 h-4 w-4 shrink-0 accent-teal"
                        />
                        <span>
                          <span className="block text-[14px] font-semibold text-ink">
                            {opt.title}
                          </span>
                          <span className="block text-[13px] text-soft">
                            {opt.body}
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div className="flex flex-col gap-2 sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={busy}
                    className="btn btn-primary sm:flex-1"
                  >
                    {busy ? "Saving…" : "Finish"}
                  </button>
                  {extrasUntouched && (
                    <button
                      type="button"
                      onClick={() => void submitExtras(true)}
                      disabled={busy}
                      className="btn btn-ghost sm:flex-1"
                    >
                      Skip for now
                    </button>
                  )}
                </div>
              </>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
