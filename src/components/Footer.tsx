import Link from "next/link";
import GateMark from "@/components/GateMark";

export default function Footer() {
  const contact = process.env.NEXT_PUBLIC_CONTACT_EMAIL;

  return (
    <footer className="mt-auto border-t border-line">
      <div className="mx-auto flex w-full max-w-275 flex-col gap-6 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3 text-ink">
          <GateMark size={24} />
          <div>
            <p className="text-[14px] font-bold tracking-tight">
              ArchitectureAI
            </p>
            <p className="text-[13px] text-soft">
              Intelligence for complex systems.
            </p>
          </div>
        </div>

        <nav
          aria-label="Footer"
          className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px]"
        >
          {/* <Link href="/privacy">Privacy notice</Link> */}
          {contact && <a href={`mailto:${contact}`}>{contact}</a>}
          <span className="text-soft">© 2026 ArchitectureAI</span>
        </nav>
      </div>
    </footer>
  );
}
