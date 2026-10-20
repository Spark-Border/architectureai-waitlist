"use client";

import { useState, SyntheticEvent } from "react";
import { isValidEmail } from "@/lib/validate";

/*
 * Email box in the hero. It validates, scrolls to the join section and hands the
 * address to the three-step flow there, which saves it straight away.
 */
export default function HeroEmail() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const onSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = email.trim();
    if (!value) return setError("Add your work email.");
    if (!isValidEmail(value))
      return setError("That email doesn't look right. Check for typos.");
    setError("");

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    document
      .getElementById("join")
      ?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
    window.dispatchEvent(
      new CustomEvent("join:prefill", { detail: { email: value } }),
    );
  };

  return (
    <form onSubmit={onSubmit} noValidate className="max-w-md">
      <label htmlFor="hero-email" className="sr-only">
        Work email
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id="hero-email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError("");
          }}
          placeholder="Work email"
          autoComplete="email"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "hero-email-error" : "hero-email-note"}
          className="control sm:flex-1"
        />
        <button
          type="submit"
          className="btn btn-primary whitespace-nowrap sm:min-h-10"
        >
          Join Waitlist
        </button>
      </div>
      {error ? (
        <p id="hero-email-error" className="mt-2 text-[13px] text-danger">
          {error}
        </p>
      ) : (
        <p id="hero-email-note" className="mt-2 text-[12px] text-soft">
          Free during testing. By continuing you agree to get emails about early
          access.
          {/* See the <Link href="/privacy">privacy notice</Link>. */}
        </p>
      )}
    </form>
  );
}
