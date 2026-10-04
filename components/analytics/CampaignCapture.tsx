"use client";

import { useEffect } from "react";
import {
  mergeCampaignTags,
  parseCampaignTags,
  readStoredCampaignTags,
  rememberCampaignTags,
} from "@/lib/attribution";

export default function CampaignCapture() {
  useEffect(() => {
    const next = mergeCampaignTags(parseCampaignTags(window.location.search), readStoredCampaignTags());
    if (next) {
      rememberCampaignTags(next);
    }
  }, []);

  return null;
}
