/*
 * Cookieless event tracking through Plausible. Does nothing unless
 * NEXT_PUBLIC_PLAUSIBLE_DOMAIN is set (the script is only loaded then).
 * Never pass personal data as event properties.
 */
declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string> }) => void;
  }
}

export function track(event: string, props?: Record<string, string>) {
  if (typeof window === "undefined") return;
  window.plausible?.(event, props ? { props } : undefined);
}
