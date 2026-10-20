"use client";

import { CONSENT_RESET_EVENT, saveConsent } from "@/lib/consent";

/** Withdraws the current choice and reopens the banner. Only rendered when GA is configured. */
export default function ConsentSettingsButton() {
  return (
    <button
      type="button"
      onClick={() => {
        saveConsent(null);
        window.dispatchEvent(new Event(CONSENT_RESET_EVENT));
      }}
      className="text-brand-accent hover:underline"
    >
      Endre samtykke for Google Analytics
    </button>
  );
}
