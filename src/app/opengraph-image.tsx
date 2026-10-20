import { ImageResponse } from "next/og";

export const alt =
  "ArchitectureAI. Clarity for complex systems. Evidence for every decision.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* Brand v1.4 dark tokens: paper #0B0F0F, ink #E7EFEC, ink-soft #9FB0AC, teal #38C6B5 */
export default function Image() {
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
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="64" height="64" viewBox="0 0 32 32" fill="none">
            <path
              d="M4 12V4h8M20 4h8v8M28 20v8h-8M12 28H4v-8"
              stroke="#E7EFEC"
              strokeWidth="2.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10.5 16.5l4 4 7-9"
              stroke="#38C6B5"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div style={{ fontSize: 40, fontWeight: 700 }}>ArchitectureAI</div>
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
    { ...size }
  );
}
