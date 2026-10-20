export const CONSENT_STORAGE_KEY = "sp_analytics_consent";
/** Fired on window when the visitor asks to change their choice (button on /personvern). */
export const CONSENT_RESET_EVENT = "sp:consent-reset";

export type ConsentChoice = "granted" | "denied";

export function parseConsent(raw: string | null | undefined): ConsentChoice | null {
  return raw === "granted" || raw === "denied" ? raw : null;
}

/**
 * Inline bootstrap that must run before gtag.js and before any page effect: defines
 * `gtag`, sets Consent Mode v2 defaults to denied, restores a stored "granted" choice,
 * then configures GA4 without the automatic page_view (GaPageViews sends those).
 * page_location starts query-free so /takk?token= can't leak before GaPageViews sets
 * the redacted URL.
 */
export function gaBootstrapScript(measurementId: string): string {
  const id = JSON.stringify(measurementId);
  const key = JSON.stringify(CONSENT_STORAGE_KEY);
  return [
    "window.dataLayer=window.dataLayer||[];",
    "function gtag(){dataLayer.push(arguments);}",
    "window.gtag=gtag;",
    "gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});",
    `try{if(localStorage.getItem(${key})==='granted'){gtag('consent','update',{analytics_storage:'granted'});}}catch(e){}`,
    "gtag('set',{page_location:location.origin+location.pathname});",
    "gtag('js',new Date());",
    `gtag('config',${id},{send_page_view:false});`,
  ].join("");
}

type Gtag = (...args: unknown[]) => void;

export function getGtag(): Gtag | null {
  if (typeof window === "undefined") return null;
  const gtag = (window as Window & { gtag?: Gtag }).gtag;
  return typeof gtag === "function" ? gtag : null;
}

export function readConsent(): ConsentChoice | null {
  try {
    return parseConsent(window.localStorage.getItem(CONSENT_STORAGE_KEY));
  } catch {
    return null;
  }
}

export function saveConsent(choice: ConsentChoice | null): void {
  try {
    if (choice) window.localStorage.setItem(CONSENT_STORAGE_KEY, choice);
    else window.localStorage.removeItem(CONSENT_STORAGE_KEY);
  } catch {
    // Without storage the banner simply asks again next visit.
  }
  getGtag()?.("consent", "update", { analytics_storage: choice === "granted" ? "granted" : "denied" });
}
