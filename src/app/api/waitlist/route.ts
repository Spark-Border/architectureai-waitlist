import { NextResponse } from "next/server";
import type { HydratedDocument } from "mongoose";
import { connectDB } from "@/lib/db";
import Waitlist, { type IWaitlist } from "@/models/Waitlist";
import { sendAdminNotification, sendConfirmationEmail } from "@/lib/email";
import { isFreeEmailDomain, isValidEmail, splitName } from "@/lib/validate";
import { rateLimited } from "@/lib/rateLimit";
import { issueToken, newSessionId, verifyToken } from "@/lib/signupToken";

/*
 * The signup is saved in stages so an abandoned form still keeps the lead:
 *   POST          step 1: email + consent. Creates the record, sends the confirmation,
 *                 returns a token bound to this browser session.
 *   PATCH step 2  name, role, industry, organisation. First time: sends the team notification.
 *   PATCH step 3  frameworks, pain point, how they want to take part.
 * Later steps can be edited again (Back button) by the same session. A token issued for
 * an email that is already finished does not match the stored session, so it changes
 * nothing, and the response looks identical so the form reveals nothing.
 */

const INTERESTS = ["partner", "launch", "newsletter"] as const;
type Interest = (typeof INTERESTS)[number];

const fail = (error: string, status = 400) =>
  NextResponse.json({ success: false, error }, { status });

/** Trim and cap a user-supplied string. Anything that is not a string becomes "". */
const text = (value: unknown, max: number): string =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

const clientIp = (request: Request) =>
  request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

/* ── Step 1 ───────────────────────────────────────────── */
export async function POST(request: Request) {
  try {
    if (rateLimited(`waitlist:${clientIp(request)}`)) {
      return fail("Too many attempts. Try again in a few minutes.", 429);
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return fail("We couldn't read that request. Reload the page and try again.");
    }

    const email = text(body.email, 254).toLowerCase();
    const sid = newSessionId();

    /* Honeypot: real visitors never see this field. Answer as if it worked. */
    if (text(body.website, 100)) {
      return NextResponse.json({ success: true, token: issueToken(email || "bot", sid) }, { status: 201 });
    }

    if (!isValidEmail(email)) {
      return fail("That email doesn't look right. Check for typos.");
    }
    if (body.consent !== true) {
      return fail("Please agree to get emails from us to continue.");
    }

    await connectDB();

    const source = {
      utmSource: text(body.utmSource, 100),
      utmMedium: text(body.utmMedium, 100),
      utmCampaign: text(body.utmCampaign, 100),
      referrer: text(body.referrer, 300),
    };

    let created;
    try {
      created = await Waitlist.create({
        email,
        /* Server time: the client clock is not evidence of consent. */
        consentedAt: new Date(),
        freeEmailDomain: isFreeEmailDomain(email),
        signupSession: sid,
        ...source,
      });
    } catch (err: unknown) {
      if ((err as { code?: number })?.code !== 11000) throw err;

      /* Already on the list. Answer exactly as for a new signup. If they never finished
         the details, hand this session the record so a returning visitor can complete it.
         If they did finish, the new token will not match and later writes are ignored. */
      await Waitlist.updateOne(
        { email, profileCompletedAt: { $exists: false } },
        { signupSession: sid }
      );
      return NextResponse.json({ success: true, token: issueToken(email, sid) }, { status: 201 });
    }

    /* The email must never fail the signup: the entry is already saved. */
    const sent = await sendConfirmationEmail({ email });
    if (sent) {
      await Waitlist.updateOne(
        { _id: created._id },
        { confirmationSent: true, confirmationSentAt: new Date() }
      );
    }

    return NextResponse.json({ success: true, token: issueToken(email, sid) }, { status: 201 });
  } catch (err: unknown) {
    console.error("[api/waitlist] POST error:", err);
    return fail("We couldn't save your signup. Try again in a minute.", 500);
  }
}

/* ── Steps 2 and 3 ────────────────────────────────────── */
type Entry = HydratedDocument<IWaitlist>;

async function saveProfile(entry: Entry, body: Record<string, unknown>) {
  const { firstName, lastName } = splitName(text(body.name, 120));
  const jobTitle = text(body.jobTitle, 80);
  const industry = text(body.industry, 80);
  if (!firstName || !jobTitle || !industry) {
    return fail("Add your name, role and industry to continue.");
  }

  const firstTime = !entry.profileCompletedAt;
  entry.set({
    firstName,
    lastName,
    jobTitle,
    industry,
    orgName: text(body.orgName, 120),
    ...(firstTime && { profileCompletedAt: new Date() }),
  });
  await entry.save();

  if (firstTime) {
    await sendAdminNotification({
      email: entry.email,
      firstName,
      lastName,
      orgName: entry.orgName,
      jobTitle,
      industry,
      interest: entry.interest,
      painPoints: "",
      frameworks: [],
      freeEmailDomain: entry.freeEmailDomain,
      utmSource: entry.utmSource,
      utmMedium: entry.utmMedium,
      utmCampaign: entry.utmCampaign,
      referrer: entry.referrer,
    });
  }

  return NextResponse.json({ success: true });
}

async function saveExtras(entry: Entry, body: Record<string, unknown>) {
  const requested = body.interest as Interest;
  const frameworks = (Array.isArray(body.frameworks) ? body.frameworks : [])
    .map((f: unknown) => text(f, 80))
    .filter(Boolean)
    .slice(0, 8);

  entry.set({
    interest: INTERESTS.includes(requested) ? requested : entry.interest,
    frameworks,
    painPoints: text(body.painPoints, 2000),
    extrasCompletedAt: entry.extrasCompletedAt ?? new Date(),
  });
  await entry.save();

  return NextResponse.json({ success: true });
}

export async function PATCH(request: Request) {
  try {
    if (rateLimited(`waitlist-patch:${clientIp(request)}`, 20)) {
      return fail("Too many attempts. Try again in a few minutes.", 429);
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return fail("We couldn't read that request. Reload the page and try again.");
    }

    const email = text(body.email, 254).toLowerCase();
    const sid = verifyToken(email, body.token);
    if (!sid) return fail("Your session timed out. Start again with your email.", 401);

    await connectDB();
    const entry = await Waitlist.findOne({ email }).select("+signupSession");
    if (!entry) return fail("Your session timed out. Start again with your email.", 401);

    /* A valid token from another session (someone re-entering a finished email). */
    if (entry.signupSession !== sid) return NextResponse.json({ success: true });

    if (body.step === 2) return await saveProfile(entry, body);
    if (body.step === 3) return await saveExtras(entry, body);
    return fail("We couldn't read that request. Reload the page and try again.");
  } catch (err: unknown) {
    console.error("[api/waitlist] PATCH error:", err);
    return fail("We couldn't save that. Try again in a minute.", 500);
  }
}
