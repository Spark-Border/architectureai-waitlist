/* Shared by the form (client) and the API route (server). */
export function isValidEmail(value: string): boolean {
  const email = value.trim();
  if (email.length > 254 || /\s/.test(email)) return false;
  const at = email.indexOf("@");
  if (at < 1 || at !== email.lastIndexOf("@")) return false;
  const domain = email.slice(at + 1);
  const dot = domain.lastIndexOf(".");
  return dot > 0 && dot < domain.length - 1;
}

const FREE_EMAIL_DOMAINS = new Set([
  "gmail.com", "googlemail.com", "yahoo.com", "yahoo.co.uk", "ymail.com",
  "hotmail.com", "hotmail.co.uk", "outlook.com", "live.com", "msn.com",
  "icloud.com", "me.com", "aol.com", "proton.me", "protonmail.com",
  "gmx.com", "gmx.de", "mail.com", "yandex.com", "zoho.com",
]);

/** True for personal mailbox providers. Used for a soft nudge, never to block a signup. */
export function isFreeEmailDomain(value: string): boolean {
  const domain = value.trim().toLowerCase().split("@")[1];
  return !!domain && FREE_EMAIL_DOMAINS.has(domain);
}

/** "Jane van Doe" becomes first "Jane", last "van Doe". */
export function splitName(full: string): { firstName: string; lastName: string } {
  const [firstName = "", ...rest] = full.trim().split(/\s+/);
  return { firstName, lastName: rest.join(" ") };
}
