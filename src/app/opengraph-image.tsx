import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import {
  MARK_BRACKETS,
  MARK_BRACKET_STROKE,
  MARK_CHECK,
  MARK_CHECK_STROKE,
  MARK_VIEWBOX,
  lockupGap,
  wordmarkSize,
} from "@/lib/brandMark";

export const alt =
  "ArchitectureAI. Clarity for complex systems. Evidence for every decision.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* Brand v1.4 dark tokens: paper #0B0F0F, ink #E7EFEC, ink-soft #9FB0AC, teal #38C6B5 */
const MARK = 96;
const fontDir = join(process.cwd(), "src/app/_fonts");

export default async function Image() {
  const [regular, bold, extraBold] = await Promise.all([
    readFile(join(fontDir, "Geist-Regular.ttf")),
    readFile(join(fontDir, "Geist-Bold.ttf")),
    readFile(join(fontDir, "Geist-ExtraBold.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0B0F0F",
          color: "#E7EFEC",
          padding: 72,
          fontFamily: "Geist",
        }}
      >
        <div
          style={{ display: "flex", alignItems: "center", gap: lockupGap(MARK) }}
        >
          <svg width={MARK} height={MARK} viewBox={MARK_VIEWBOX} fill="none">
            <path
              d={MARK_BRACKETS}
              stroke="#E7EFEC"
              strokeWidth={MARK_BRACKET_STROKE}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={MARK_CHECK}
              stroke="#38C6B5"
              strokeWidth={MARK_CHECK_STROKE}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div
            style={{
              display: "flex",
              fontSize: wordmarkSize(MARK),
              fontWeight: 700,
              letterSpacing: "-0.025em",
            }}
          >
            <span>Architecture</span>
            {/* Satori puts a word space between text runs; cancel it (Geist space = 0.228em). */}
            <span style={{ color: "#38C6B5", marginLeft: "-0.228em" }}>AI</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              fontSize: 76,
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.025em",
              maxWidth: 980,
            }}
          >
            Clarity for complex systems. Evidence for every decision.
          </div>
          <div style={{ fontSize: 30, color: "#9FB0AC" }}>
            Architecture reviews with findings you can verify. Testing group open.
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Geist", data: regular, weight: 400, style: "normal" },
        { name: "Geist", data: bold, weight: 700, style: "normal" },
        { name: "Geist", data: extraBold, weight: 800, style: "normal" },
      ],
    }
  );
}
