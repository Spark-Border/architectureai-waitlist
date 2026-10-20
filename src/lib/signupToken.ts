import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";

/*
 * Short-lived proof that whoever finishes steps 2 and 3 of the form is the browser
 * that submitted the email in step 1. The token carries a session id; the same id is
 * stored on the record when it is created, so only the original session can edit it.
 * HMAC over email + expiry + session id.
 */
const TTL_MS = 2 * 60 * 60 * 1000;

function secret(): string {
  const value = process.env.SIGNUP_TOKEN_SECRET || process.env.ADMIN_PASSWORD;
  if (!value) throw new Error("Set SIGNUP_TOKEN_SECRET (or ADMIN_PASSWORD) to sign signup tokens.");
  return value;
}

const sign = (email: string, exp: number, sid: string) =>
  createHmac("sha256", secret()).update(`${email}.${exp}.${sid}`).digest("hex");

export const newSessionId = () => randomUUID();

export function issueToken(email: string, sid: string): string {
  const exp = Date.now() + TTL_MS;
  return `${exp}.${sid}.${sign(email, exp, sid)}`;
}

/** Returns the session id when the token is genuine and unexpired, otherwise null. */
export function verifyToken(email: string, token: unknown): string | null {
  if (typeof token !== "string") return null;
  const [expRaw, sid, sig] = token.split(".");
  const exp = Number(expRaw);
  if (!sid || !sig || !Number.isFinite(exp) || exp < Date.now()) return null;

  const expected = Buffer.from(sign(email, exp, sid));
  const given = Buffer.from(sig);
  return expected.length === given.length && timingSafeEqual(expected, given) ? sid : null;
}
