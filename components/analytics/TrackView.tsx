"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/track";
import type { TrackEventName, TrackValue } from "@/lib/track-events";

export default function TrackView({
  event,
  props,
}: {
  event: TrackEventName;
  props: Record<string, TrackValue>;
}) {
  const key = JSON.stringify(props);
  useEffect(() => {
    trackEvent(event, JSON.parse(key) as Record<string, TrackValue>);
  }, [event, key]);

  return null;
}
