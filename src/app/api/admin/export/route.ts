import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Waitlist from "@/models/Waitlist";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  const headerToken = request.headers.get("x-admin-token");
  const pass = token || headerToken;

  if (pass !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const entries = await Waitlist.find().sort({ createdAt: -1 }).lean();

  /* Build CSV */
  const headers = [
    "email", "firstName", "lastName", "orgName", "jobTitle",
    "industry", "interest", "frameworks", "painPoints", "createdAt",
  ];

  const csvRows = [headers.join(",")];
  for (const e of entries as any[]) {
    csvRows.push(
      headers
        .map((h) => {
          const val = h === "frameworks" ? (e[h] || []).join(";") : (e[h] ?? "");
          return `"${String(val).replace(/"/g, '""')}"`;
        })
        .join(",")
    );
  }

  return new NextResponse(csvRows.join("\n"), {
    status: 200,
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="waitlist-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
