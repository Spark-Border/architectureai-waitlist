import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Waitlist from "@/models/Waitlist";
import { isAdmin } from "@/lib/adminAuth";
import { rateLimited } from "@/lib/rateLimit";

export async function GET(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    if (rateLimited(`admin:${ip}`, 10, 10 * 60 * 1000)) {
      return NextResponse.json(
        { success: false, error: "Too many attempts. Try again later." },
        { status: 429 }
      );
    }

    if (!isAdmin(request)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const entries = await Waitlist.find().sort({ createdAt: -1 }).lean();

    const count = (interest: string) =>
      entries.filter((e: { interest?: string }) => e.interest === interest).length;

    type Row = {
      profileCompletedAt?: Date;
      extrasCompletedAt?: Date;
      freeEmailDomain?: boolean;
      utmSource?: string;
      referrer?: string;
    };
    const rows = entries as unknown as Row[];

    /* Where people drop off: email saved, details saved, optional step saved. */
    const sourceCounts = new Map<string, number>();
    for (const e of rows) {
      let label = e.utmSource || "";
      if (!label && e.referrer) {
        try {
          label = new URL(e.referrer).hostname;
        } catch {
          label = "";
        }
      }
      label = label || "direct";
      sourceCounts.set(label, (sourceCounts.get(label) ?? 0) + 1);
    }

    const stats = {
      total: entries.length,
      newsletter: count("newsletter"),
      launch: count("launch"),
      partner: count("partner"),
      undecided: count("undecided"),
      funnel: {
        email: entries.length,
        profile: rows.filter((e) => e.profileCompletedAt).length,
        extras: rows.filter((e) => e.extrasCompletedAt).length,
      },
      personalEmail: rows.filter((e) => e.freeEmailDomain).length,
      sources: [...sourceCounts.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([source, signups]) => ({ source, signups })),
    };

    return NextResponse.json({ success: true, stats, entries }, { status: 200 });
  } catch (err) {
    console.error("[api/admin] Error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
