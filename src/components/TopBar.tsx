import Lockup from "@/components/Lockup";
import ThemeToggle from "@/components/ThemeToggle";

const links = [
  { href: "#how", label: "How it works" },
  { href: "#evidence", label: "Evidence" },
  { href: "#trust", label: "Trust" },
  { href: "#faq", label: "FAQ" },
];

export default function TopBar() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper">
      <div className="mx-auto flex w-full max-w-275 items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <a
          href="#top"
          className="flex items-center no-underline"
          aria-label="ArchitectureAI, back to top"
        >
          <Lockup size={36} />
        </a>

        <nav aria-label="Main" className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="t-ui text-soft no-underline hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a href="#join" className="btn btn-primary">
            <span className="sm:hidden">Join</span>
            <span className="hidden sm:inline">Join Waitlist</span>
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
