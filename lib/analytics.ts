/* Custom event helpers — call these anywhere in client components.
   They're no-ops in development or when GA4 isn't loaded. */

type GtagFn = (...args: unknown[]) => void;

function gtag(...args: unknown[]) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { gtag?: GtagFn; dataLayer?: unknown[] };
  if (typeof w.gtag === "function") {
    w.gtag(...args);
  } else if (Array.isArray(w.dataLayer)) {
    w.dataLayer.push(args);
  }
}

export function trackResumeDownload() {
  gtag("event", "resume_download", { event_category: "engagement" });
}

export function trackEmailClick() {
  gtag("event", "email_click", { event_category: "contact" });
}

export function trackLinkedInClick() {
  gtag("event", "linkedin_click", { event_category: "contact" });
}

export function trackContactFormSubmit() {
  gtag("event", "contact_form_submit", { event_category: "contact" });
}
