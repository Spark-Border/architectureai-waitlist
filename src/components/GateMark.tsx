import {
  MARK_BRACKETS,
  MARK_BRACKET_STROKE,
  MARK_CHECK,
  MARK_CHECK_STROKE,
  MARK_MIN_SIZE,
  MARK_VIEWBOX,
} from "@/lib/brandMark";

/*
 * The Gate mark (brand v1.4). Brackets follow the text colour; the check is
 * always teal. Rules live in src/lib/brandMark.ts. Use <Lockup> for headers.
 */
export default function GateMark({ size = 28 }: Readonly<{ size?: number }>) {
  const px = Math.max(size, MARK_MIN_SIZE);
  return (
    <svg
      width={px}
      height={px}
      viewBox={MARK_VIEWBOX}
      fill="none"
      aria-hidden="true"
      focusable="false"
      className="shrink-0"
    >
      <path
        d={MARK_BRACKETS}
        stroke="currentColor"
        strokeWidth={MARK_BRACKET_STROKE}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={MARK_CHECK}
        stroke="var(--teal)"
        strokeWidth={MARK_CHECK_STROKE}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
