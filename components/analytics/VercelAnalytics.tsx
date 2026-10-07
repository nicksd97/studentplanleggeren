"use client";

import { Analytics, type BeforeSendEvent } from "@vercel/analytics/next";
import { redactAnalyticsUrl } from "@/lib/track-events";

function beforeSend(event: BeforeSendEvent): BeforeSendEvent {
  return { ...event, url: redactAnalyticsUrl(event.url) };
}

export default function VercelAnalytics() {
  return <Analytics beforeSend={beforeSend} />;
}
