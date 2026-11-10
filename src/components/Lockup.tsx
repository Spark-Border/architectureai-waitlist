import GateMark from "@/components/GateMark";
import { MARK_MIN_SIZE, lockupGap, wordmarkSize } from "@/lib/brandMark";

/*
 * The primary lockup (brand v1.4, section 04): Gate mark plus the wordmark,
 * "Architecture" in ink and "AI" in teal. The only approved lockup, so nothing
 * else (tagline, page name) goes inside it. Proportions live in brandMark.ts.
 */
export default function Lockup({ size = 36 }: Readonly<{ size?: number }>) {
  const px = Math.max(size, MARK_MIN_SIZE);
  return (
    <span
      className="inline-flex items-center text-ink"
      style={{ gap: lockupGap(px) }}
    >
      <GateMark size={px} />
      <span
        className="font-bold leading-none tracking-tight"
        style={{ fontSize: wordmarkSize(px) }}
      >
        Architecture<span className="text-teal">AI</span>
      </span>
    </span>
  );
}
