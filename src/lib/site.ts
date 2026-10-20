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
  tagline: "Intelligence for complex systems.",
  title: "ArchitectureAI: enterprise architecture, with evidence",
  /* Search result snippet. Keep under about 155 characters so it does not truncate. */
  description:
    "Review architecture documents, diagrams, models and practices against TOGAF, ArchiMate, Zachman and your own standards, with evidence. Waitlist open.",
  /* Link previews (LinkedIn, X, Slack). Room for the audience and the offer. */
  shareDescription:
    "AI-native enterprise architecture for all industries. Review against TOGAF, ArchiMate, Zachman and your own standards, with evidence for every finding. Waitlist open.",
} as const;
