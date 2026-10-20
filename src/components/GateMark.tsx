/*
 * The Gate mark (brand v1.4): drafting corner brackets, open at the corners,
 * closing on a checkmark. Brackets follow the text colour; the check is teal.
 * Never close the corners into a square, recolour the check, rotate or stretch.
 * Minimum size 24px.
 */
export default function GateMark({ size = 28 }: Readonly<{ size?: number }>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M4 12V4h8M20 4h8v8M28 20v8h-8M12 28H4v-8"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.5 16.5l4 4 7-9"
        stroke="var(--teal)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
