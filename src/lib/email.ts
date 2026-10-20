import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM = process.env.EMAIL_FROM;
const ADMIN = process.env.ADMIN_EMAIL;
const SITE = process.env.NEXT_PUBLIC_URL ?? "https://www.architectureai.tech";

/* Brand v1.4 dark tokens, inlined because email clients ignore CSS variables */
const C = {
  paper: "#0b0f0f",
  raised: "#121918",
  line: "#253330",
  ink: "#e7efec",
  soft: "#9fb0ac",
  teal: "#38c6b5",
};

/** Escape anything a visitor typed before it goes into HTML. */
export function esc(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

interface Entry {
  email: string;
  firstName: string;
  lastName: string;
  orgName: string;
  jobTitle: string;
  industry: string;
  interest: string;
  painPoints: string;
  frameworks: string[];
  freeEmailDomain?: boolean;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  referrer: string;
}

const interestLabels: Record<string, string> = {
  undecided: "Not chosen yet",
  partner: "Testing partner",
  launch: "Launch update",
  newsletter: "Progress updates",
};

/** Confirmation sent to the person who signed up. Returns true when Resend accepted it. */
export async function sendConfirmationEmail(to: { email: string }): Promise<boolean> {
  if (!resend || !FROM) {
    console.log("[email] RESEND_API_KEY or EMAIL_FROM not set, skipping confirmation");
    return false;
  }
  try {
    const { error } = await resend.emails.send({
      from: `ArchitectureAI <${FROM}>`,
      to: to.email,
      replyTo: ADMIN ?? FROM,
      subject: "You're on the ArchitectureAI waitlist",
      html: confirmationHtml(),
      text: confirmationText(),
    });
    if (error) {
      console.error("[email] Confirmation rejected:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[email] Failed to send confirmation:", err);
    return false;
  }
}

/** Notification to the team when someone signs up. */
export async function sendAdminNotification(entry: Entry): Promise<boolean> {
  if (!resend || !FROM || !ADMIN) {
    console.log("[email] RESEND_API_KEY, EMAIL_FROM or ADMIN_EMAIL not set, skipping admin notification");
    return false;
  }
  try {
    const { error } = await resend.emails.send({
      from: `ArchitectureAI Notifier <${FROM}>`,
      to: ADMIN,
      replyTo: entry.email,
      subject: `New signup: ${entry.firstName} ${entry.lastName}`.trim() + ` (${interestLabels[entry.interest] ?? entry.interest})`,
      html: adminHtml(entry),
    });
    if (error) {
      console.error("[email] Admin notification rejected:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[email] Failed to send admin notification:", err);
    return false;
  }
}

/* ── Templates ── */

function shell(inner: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="dark light"></head>
<body style="margin:0;padding:32px 16px;background:${C.paper};color:${C.ink};font-family:Geist,Inter,system-ui,-apple-system,'Segoe UI',sans-serif;font-size:15px;line-height:1.55">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto">
  <tr><td style="padding-bottom:20px;font-size:16px;font-weight:700;letter-spacing:-0.01em;color:${C.ink}">ArchitectureAI</td></tr>
  <tr><td style="background:${C.raised};border:1px solid ${C.line};border-radius:8px;padding:28px">${inner}</td></tr>
  <tr><td style="padding-top:20px;font-size:12px;color:${C.soft}">Intelligence for complex systems.</td></tr>
</table>
</body>
</html>`;
}

const CONFIRMATION_INTRO =
  "ArchitectureAI reviews architecture documents, diagrams, models and practices against frameworks such as TOGAF, ArchiMate and Zachman, and against your own standards, and shows the evidence behind every finding. It is still in development.";
const CONFIRMATION_ASK =
  "One question: what is the one thing about your architecture reviews you would change? Reply to this email with a sentence or two. A person reads every reply.";
const CONFIRMATION_NEXT =
  "We are speaking with enterprise teams before the first release. If you added your details, we will be in touch about a short conversation on how your architecture work runs today. Otherwise we will email you when there is something to share.";

function confirmationHtml(): string {
  return shell(`
    <h1 style="margin:0 0 12px;font-size:22px;line-height:1.25;letter-spacing:-0.015em;color:${C.ink}">You're on the waitlist.</h1>
    <p style="margin:0 0 16px;color:${C.soft}">${esc(CONFIRMATION_INTRO)}</p>
    <p style="margin:0 0 16px;color:${C.ink}">${esc(CONFIRMATION_NEXT)}</p>
    <p style="margin:0 0 20px;color:${C.ink}">${esc(CONFIRMATION_ASK)}</p>
    <p style="margin:0;font-size:12px;color:${C.soft}">You received this because you joined the waitlist at ${esc(SITE.replace(/^https?:\/\//, ""))}. To stop hearing from us, reply to this email with "unsubscribe" and we will remove you.</p>
  `);
}

function confirmationText(): string {
  return [
    "You're on the waitlist.",
    "",
    CONFIRMATION_INTRO,
    "",
    CONFIRMATION_NEXT,
    "",
    CONFIRMATION_ASK,
    "",
    `You received this because you joined the waitlist at ${SITE}. To stop hearing from us, reply with "unsubscribe" and we will remove you.`,
  ].join("\n");
}

function adminHtml(entry: Entry): string {
  const row = (label: string, value: string, mono = false) =>
    `<tr><td style="padding:6px 12px 6px 0;width:120px;vertical-align:top;font-size:12px;color:${C.soft}">${label}</td><td style="padding:6px 0;font-size:14px;color:${C.ink};${mono ? "font-family:ui-monospace,Menlo,monospace;" : ""}">${value || "-"}</td></tr>`;

  const source = [entry.utmSource, entry.utmMedium, entry.utmCampaign].filter(Boolean).join(" / ");

  return shell(`
    <p style="margin:0 0 14px;font-size:12px;font-weight:650;letter-spacing:0.06em;text-transform:uppercase;color:${C.teal}">New signup</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${row("Name", esc(`${entry.firstName} ${entry.lastName}`.trim()))}
      ${row("Email", `<a href="mailto:${esc(entry.email)}" style="color:${C.teal}">${esc(entry.email)}</a>${entry.freeEmailDomain ? " (personal address)" : ""}`)}
      ${row("Organisation", esc(entry.orgName))}
      ${row("Role", esc(entry.jobTitle))}
      ${row("Industry", esc(entry.industry))}
      ${row("Taking part as", esc(interestLabels[entry.interest] ?? entry.interest))}
      ${row("Framework", esc(entry.frameworks.join(", ")))}
      ${row("Source", esc(source), true)}
      ${row("Referrer", esc(entry.referrer), true)}
      ${entry.painPoints ? row("Slows reviews", esc(entry.painPoints)) : ""}
    </table>
    <p style="margin:20px 0 0"><a href="${esc(SITE)}/admin" style="display:inline-block;padding:9px 16px;border-radius:4px;background:${C.ink};color:${C.paper};font-size:13px;font-weight:600;text-decoration:none">View all signups</a></p>
  `);
}
