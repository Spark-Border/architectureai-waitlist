import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "ArchitectureAI — The AI-Native Enterprise Architecture OS",
  description:
    "ArchitectureAI is the first operating system for enterprise architecture — automating reviews, enforcing governance, and building a continuously learning knowledge graph. Join the waitlist.",
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
    ],
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "ArchitectureAI — AI-Native Enterprise Architecture OS",
    description:
      "Automate architecture reviews, enforce governance, build institutional intelligence. Human oversight at every step.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <ThemeProvider>
          {/* Grain texture */}
          <div className="grain-overlay" aria-hidden="true" />
          {/* Engineering grid blueprint background */}
          <div className="engineering-grid" aria-hidden="true" />
          {/* Ambient glows */}
          <div className="ambient-container" aria-hidden="true">
            <div className="absolute top-[-30%] left-[-10%] w-[55%] h-[55%] bg-[radial-gradient(ellipse,rgba(88,124,255,0.07)_0%,transparent_70%)] animate-[ambientA_18s_ease-in-out_infinite]" />
            <div className="absolute bottom-[-25%] right-[-8%] w-[50%] h-[50%] bg-[radial-gradient(ellipse,rgba(52,211,153,0.05)_0%,transparent_70%)] animate-[ambientB_22s_ease-in-out_infinite]" />
          </div>
          <div className="relative z-1 flex flex-col min-h-screen">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
