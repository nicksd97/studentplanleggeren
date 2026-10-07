"use client";

import { track } from "@vercel/analytics";
import { currentCampaignTags, type CampaignTags } from "./attribution";
import { buildEventProps, propLimit, type TrackEventName, type TrackProps } from "./track-events";

const LIMIT = propLimit(process.env.NEXT_PUBLIC_VA_EVENT_PROPS);

export function trackEvent(
  name: TrackEventName,
  props: TrackProps = {},
  campaign?: CampaignTags | null,
): void {
  try {
    const data = buildEventProps(
      props,
      { path: window.location.pathname, campaign: campaign ?? currentCampaignTags() },
      LIMIT,
    );
    track(name, data);
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
