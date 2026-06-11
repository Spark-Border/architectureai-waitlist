import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM = process.env.EMAIL_FROM!;
const ADMIN = process.env.ADMIN_EMAIL!;

/** Confirmation email sent to the subscriber */
// export async function sendConfirmationEmail(to: string, name: string) {
//   if (!resend) {
//     console.log("[email] RESEND_API_KEY not set — skipping confirmation to", to);
//     return;
//   }
//   try {
//    const test =  await resend.emails.send({
//       from: `ArchitectureAI <${FROM}>`,
//       to,
//       subject: "You're on the ArchitectureAI waitlist",
//       html: confirmationHtml(name),
//     });
//     console.log("[email] Confirmation sent to", to);
//   } catch (err) {
//     console.error("[email] Failed to send confirmation:", err);
//   }
// }

/** Notification sent to the admin/team when someone signs up */
export async function sendAdminNotification(entry: {
  email: string;
  firstName: string;
  lastName: string;
  orgName: string;
  jobTitle: string;
  industry: string;
  interest: string;
  painPoints: string;
  frameworks: string[];
}) {
  if (!resend) {
    console.log("[email] RESEND_API_KEY not set — skipping admin notification");
    return;
  }
  try {
    const test = await resend.emails.send({
      from: `ArchitectureAI Notifier <${FROM}>`,
      to: 'olanrewajuranda@gmail.com',
      subject: `New waitlist signup: ${entry.firstName} ${entry.lastName} — ${entry.interest}`,
      html: adminHtml(entry),
    });

    console.log("[email] Admin notification sent to", ADMIN);
  } catch (err) {
    console.error("[email] Failed to send admin notification:", err);
  }
}

/* ── HTML templates ── */

// function confirmationHtml(name: string) {
//   return `
// <!DOCTYPE html>
// <html>
// <head><meta charset="utf-8"></head>
// <body style="background:#080b14;color:#edf0f5;font-family:'Inter',system-ui,sans-serif;padding:40px 16px;margin:0">
// <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;margin:0 auto">
//   <tr><td style="padding-bottom:24px">
//     <span style="font-weight:700;font-size:16px;color:#edf0f5">ArchitectureAI</span>
//   </td></tr>
//   <tr><td style="background:#111627;border-radius:14px;border:1px solid #1a1f35;padding:32px">
//     <h1 style="font-size:22px;font-weight:700;color:#fff;margin:0 0 10px">You're on the list, ${name}</h1>
//     <p style="font-size:14px;color:#6e7388;line-height:1.6;margin:0 0 20px">
//       Thanks for joining the ArchitectureAI waitlist. We're building the first AI-native enterprise architecture operating system — and you'll be among the first to know when we launch.
//     </p>
//     <div style="background:#0d1120;border-radius:8px;padding:16px;margin-bottom:20px">
//       <p style="font-size:13px;color:#b4bac8;margin:0 0 6px;font-weight:600">While you wait:</p>
//       <p style="font-size:13px;color:#6e7388;margin:0;line-height:1.6">
//         We'll send occasional updates on our progress and EA insights. No spam — unsubscribing takes one click.
//       </p>
//     </div>
//     <p style="font-size:12px;color:#3a3f55;margin:0">
//       You're receiving this because you signed up at architectureai.com.<br>
//       &copy; 2025 ArchitectureAI
//     </p>
//   </td></tr>
// </table>
// </body>
// </html>`;
// }

function adminHtml(entry: {
  email: string;
  firstName: string;
  lastName: string;
  orgName: string;
  jobTitle: string;
  industry: string;
  interest: string;
  painPoints: string;
  frameworks: string[];
}) {
  const interestLabels: Record<string, string> = {
    newsletter: "📬 Stay informed",
    launch: "🚀 Launch notification",
    partner: "🤝 Testing partner",
  };
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="background:#080b14;color:#edf0f5;font-family:'Inter',system-ui,sans-serif;padding:40px 16px">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;margin:0 auto">
  <tr><td style="background:#111627;border-radius:14px;border:1px solid #1a1f35;padding:28px">
    <p style="font-size:12px;color:#587cff;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;margin:0 0 12px">New Waitlist Signup</p>

    <table width="100%" cellpadding="8" style="border-collapse:collapse">
      <tr><td style="color:#6e7388;font-size:12px;padding-right:12px;width:100px">Name</td><td style="color:#fff;font-size:14px;font-weight:500">${entry.firstName} ${entry.lastName}</td></tr>
      <tr><td style="color:#6e7388;font-size:12px">Email</td><td style="color:#fff;font-size:14px"><a href="mailto:${entry.email}" style="color:#7b98ff">${entry.email}</a></td></tr>
      <tr><td style="color:#6e7388;font-size:12px">Organisation</td><td style="color:#fff;font-size:14px">${entry.orgName || "—"}</td></tr>
      <tr><td style="color:#6e7388;font-size:12px">Role</td><td style="color:#fff;font-size:14px">${entry.jobTitle || "—"}</td></tr>
      <tr><td style="color:#6e7388;font-size:12px">Industry</td><td style="color:#fff;font-size:14px">${entry.industry || "—"}</td></tr>
      <tr><td style="color:#6e7388;font-size:12px">Interest</td><td style="color:#34d399;font-size:14px;font-weight:500">${interestLabels[entry.interest] || entry.interest}</td></tr>
      <tr><td style="color:#6e7388;font-size:12px">Frameworks</td><td style="color:#fff;font-size:14px">${entry.frameworks.join(", ") || "—"}</td></tr>
      ${entry.painPoints ? `<tr><td style="color:#6e7388;font-size:12px;vertical-align:top">Pain points</td><td style="color:#b4bac8;font-size:13px;line-height:1.5;font-style:italic">${entry.painPoints}</td></tr>` : ""}
    </table>

    <div style="margin-top:20px">
      <a href="${process.env.NEXT_PUBLIC_URL}/admin" style="display:inline-block;padding:10px 18px;border-radius:8px;background:#587cff;color:#fff;font-size:13px;font-weight:600;text-decoration:none">View all signups →</a>
    </div>
  </td></tr>
</table>
</body>
</html>`;
}