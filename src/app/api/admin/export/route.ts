import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Waitlist from "@/models/Waitlist";
import { isAdmin } from "@/lib/adminAuth";

const HEADERS = [
  "email", "firstName", "lastName", "orgName", "jobTitle", "industry",
  "interest", "frameworks", "painPoints", "utmSource", "utmMedium",
  "utmCampaign", "referrer", "freeEmailDomain", "profileCompletedAt",
  "extrasCompletedAt", "confirmationSent", "createdAt",
];

/**
 * One CSV cell. Values that start with = + - @ (or a tab/CR) would run as a
 * formula when the file is opened in Excel or Sheets, so they get a leading
 * apostrophe. Quotes are doubled per RFC 4180.
 */
function cell(value: unknown): string {
  let s = "";
  if (value instanceof Date) s = value.toISOString();
  else if (Array.isArray(value)) s = value.join(";");
  else if (typeof value === "string") s = value;
  else if (typeof value === "number" || typeof value === "boolean") s = String(value);

  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replaceAll('"', '""')}"`;
}

export async function GET(request: Request) {
  if (!isAdmin(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const entries = (await Waitlist.find().sort({ createdAt: -1 }).lean()) as unknown as Record<string, unknown>[];

  const rows = [
    HEADERS.join(","),
    ...entries.map((e) => HEADERS.map((h) => cell(e[h])).join(",")),
  ];

  return new NextResponse(rows.join("\n"), {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="waitlist-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
