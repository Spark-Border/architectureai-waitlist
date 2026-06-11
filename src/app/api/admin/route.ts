import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Waitlist from "@/models/Waitlist";

export async function GET(request: Request) {
  try {
    /* light auth via shared password in header or search param */
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    const headerToken = request.headers.get("x-admin-token");

    const pass = token || headerToken;
    if (pass !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const entries = await Waitlist.find().sort({ createdAt: -1 }).lean();

    const stats = {
      total: entries.length,
      newsletter: entries.filter((e: any) => e.interest === "newsletter").length,
      launch: entries.filter((e: any) => e.interest === "launch").length,
      partner: entries.filter((e: any) => e.interest === "partner").length,
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