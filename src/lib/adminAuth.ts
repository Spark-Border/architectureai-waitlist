import { timingSafeEqual } from "node:crypto";

/**
 * Admin routes accept the shared password in the x-admin-token header only.
 * A password in the URL ends up in logs and browser history, so the query
 * string is not accepted. Fails closed when ADMIN_PASSWORD is not set.
 */
export function isAdmin(request: Request): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  const given = request.headers.get("x-admin-token");
  if (!expected || !given) return false;

  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
