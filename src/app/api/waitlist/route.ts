export const runtime = "edge";

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Waitlist from "@/models/Waitlist";
import { sendConfirmationEmail, sendAdminNotification } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    /* ── Validate ── */
    const { email, firstName, lastName, interest, consentedAt } = body;

    if (!email || !firstName || !lastName) {
      return NextResponse.json(
        { success: false, error: "Email, first name, and last name are required." },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email address." },
        { status: 400 }
      );
    }

    /* ── Persist ── */
    await connectDB();

    try {
      const entry = await Waitlist.create({
        email: email.toLowerCase().trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        orgName: body.orgName?.trim() || "",
        jobTitle: body.jobTitle || "",
        industry: body.industry || "",
        frameworks: Array.isArray(body.frameworks) ? body.frameworks : [],
        painPoints: body.painPoints?.trim() || "",
        interest: interest || "newsletter",
        consentedAt: consentedAt ? new Date(consentedAt) : new Date(),
      });

      /* ── Send emails (fire-and-forget) ── */
      Promise.allSettled([
        sendConfirmationEmail(entry.email, entry.firstName),
        sendAdminNotification({
          email: entry.email,
          firstName: entry.firstName,
          lastName: entry.lastName,
          orgName: entry.orgName,
          jobTitle: entry.jobTitle,
          industry: entry.industry,
          interest: entry.interest,
          painPoints: entry.painPoints,
          frameworks: entry.frameworks,
        }),
      ]);

      return NextResponse.json({ success: true }, { status: 201 });
    } catch (err: unknown) {
      if (err && typeof err === "object" && "code" in err && err.code === 11000) {
        /* duplicate email — silently succeed so the user doesn't know */
        return NextResponse.json({ success: true }, { status: 200 });
      }
      throw err;
    }
  } catch (err: unknown) {
    console.error("[api/waitlist] Error:", err);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
