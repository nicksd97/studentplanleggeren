"use client";

import { track } from "@vercel/analytics";
import { currentCampaignTags, type CampaignTags } from "./attribution";
import { getGtag } from "./consent";
import {
  buildEventProps,
  gaEventParams,
  propLimit,
  redactAnalyticsEvent,
  type TrackEventName,
  type TrackProps,
} from "./track-events";

const LIMIT = propLimit(process.env.NEXT_PUBLIC_VA_EVENT_PROPS);

// `track()` drops events while `window.va` is missing, and page effects run before
// <Analytics /> mounts. This is Vercel's own queue stub; the script drains `vaq` in order
// on load, so the URL redaction must be queued before any event (e.g. /takk?token=).
function ensureQueue(): void {
  if (window.va) return;
  window.va = (...params: [string, unknown?]) => {
    (window.vaq ??= []).push(params);
  };
  window.va("beforeSend", redactAnalyticsEvent);
}

export function trackEvent(
  name: TrackEventName,
  props: TrackProps = {},
  campaign?: CampaignTags | null,
): void {
  try {
    ensureQueue();
    const data = buildEventProps(
      props,
      { path: window.location.pathname, campaign: campaign ?? currentCampaignTags() },
      LIMIT,
    );
    track(name, data);
  } catch {
    // Analytics must never break the page.
  }
  sendToGoogleAnalytics(name, props);
}

// `gtag` only exists when NEXT_PUBLIC_GA_MEASUREMENT_ID is set (see GoogleAnalytics);
// Consent Mode decides whether GA may use cookies for the hit.
function sendToGoogleAnalytics(name: TrackEventName, props: TrackProps): void {
  try {
    const gtag = getGtag();
    const params = gtag && gaEventParams(name, props);
    if (gtag && params) gtag("event", name, params);
  } catch {
    // Analytics must never break the page.
  }
}

/** Fires at most once per browser session for the given key. */
export function trackOnce(key: string, name: TrackEventName, props: TrackProps = {}, campaign?: CampaignTags | null): void {
  const storageKey = `sp_va_${key}`;
  try {
    if (window.sessionStorage.getItem(storageKey)) return;
    window.sessionStorage.setItem(storageKey, "1");
  } catch {
    // Without storage we may double-count on reload; still send this one.
  }
  trackEvent(name, props, campaign);
}
