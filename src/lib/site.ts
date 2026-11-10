/*
 * Single source of truth for everything search engines and link previews read.
 * Per-page overrides live in each page's own `metadata` export (see app/privacy/page.tsx).
 * Files that read from here: app/layout.tsx (title, description, Open Graph, Twitter,
 * canonical, icons), app/page.tsx (JSON-LD), app/robots.ts, app/sitemap.ts.
 * Generated assets: app/opengraph-image.tsx (share image) and app/icon.svg (favicon).
 * Production needs NEXT_PUBLIC_URL set to the real origin, or canonical, sitemap and
 * share links will point at localhost.
 */
export const site = {
  name: "ArchitectureAI",
  url: process.env.NEXT_PUBLIC_URL ?? "https://www.architectureai.tech",
  /* Brand v1.4 primary tagline (site hero, deck cover). */
  tagline: "Intelligence for complex systems.",
  /* Brand v1.4 category line. */
  title: "ArchitectureAI: AI-native Enterprise Architecture platform",
  /* Search result snippet, from the brand v1.4 value proposition. Keep under about 155 characters so it does not truncate. */
  description:
    "Reviews architecture diagrams and documents against frameworks like TOGAF, surfaces risks and gaps, and shows the evidence behind every finding.",
  /* Link previews (LinkedIn, X, Slack): long-form tagline plus the value proposition. */
  shareDescription:
    "Clarity for complex systems. Evidence for every decision. ArchitectureAI reviews architecture diagrams and documents against frameworks like TOGAF and shows the evidence behind every finding. Waitlist open.",
} as const;
