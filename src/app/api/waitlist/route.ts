import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Waitlist from "@/models/Waitlist";
import { sendAdminNotification } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    /* ── Validate ── */
    const { email, firstName, lastName, interest, consentedAt, orgName, jobTitle, industry, frameworks } = body;

    if (!email || !firstName || !lastName || !orgName || !jobTitle || !industry || !frameworks || frameworks.length === 0) {
      return NextResponse.json(
        { success: false, error: "Please fill out all required fields." },
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

    const formattedEmail = email.toLowerCase().trim();
    const existing = await Waitlist.findOne({ email: formattedEmail });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "This email is already on the waitlist." },
        { status: 400 }
      );
    }

    try {
      const entry = await Waitlist.create({
        email: formattedEmail,
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

      /* ── Send emails ── */
      await sendAdminNotification({
        email: entry.email,
        firstName: entry.firstName,
        lastName: entry.lastName,
        orgName: entry.orgName,
        jobTitle: entry.jobTitle,
        industry: entry.industry,
        interest: entry.interest,
        painPoints: entry.painPoints,
        frameworks: entry.frameworks,
      });

      return NextResponse.json({ success: true }, { status: 201 });
    } catch (err: unknown) {
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
