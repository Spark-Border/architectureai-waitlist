export default function CtaBand() {
  return (
    <section
      aria-labelledby="cta-title"
      className="mx-auto w-full max-w-275 px-4 py-6 sm:px-6"
    >
      <div className="flex flex-col items-start justify-between gap-5 rounded-md border border-line bg-raised p-6 md:flex-row md:items-center md:p-8">
        <div className="max-w-xl">
          <h2 id="cta-title" className="t-h2 text-ink">
            Want findings like this on your own architecture?
          </h2>
          <p className="mt-2 text-[14px] text-soft">
            Early access is free during testing, with priority onboarding for
            the first partners.
          </p>
        </div>
        <a href="#join" className="btn btn-primary shrink-0">
          Join Waitlist
        </a>
      </div>
    </section>
  );
}
