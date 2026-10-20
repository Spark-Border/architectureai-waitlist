/*
 * Small in-memory limiter. It works per server instance, so on serverless it
 * slows casual abuse but does not replace a shared store (Upstash, Vercel KV)
 * or a WAF rule if this starts to attract real traffic.
 */
const hits = new Map<string, number[]>();

export function rateLimited(key: string, limit = 5, windowMs = 10 * 60 * 1000): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(key, recent);

  if (hits.size > 5000) {
    for (const [k, times] of hits) {
      if (times.every((t) => now - t >= windowMs)) hits.delete(k);
    }
  }
  return recent.length > limit;
}
