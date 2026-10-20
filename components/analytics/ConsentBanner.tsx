"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CONSENT_RESET_EVENT, readConsent, saveConsent, type ConsentChoice } from "@/lib/consent";

export default function ConsentBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Read after mount: localStorage isn't available during prerendering.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(readConsent() === null);
    const reopen = () => setOpen(true);
    window.addEventListener(CONSENT_RESET_EVENT, reopen);
    return () => window.removeEventListener(CONSENT_RESET_EVENT, reopen);
  }, []);

  if (!open) return null;

  function choose(choice: ConsentChoice) {
    saveConsent(choice);
    setOpen(false);
  }

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Samtykke til informasjonskapsler"
      className="fixed inset-x-0 bottom-0 z-50 p-4 sm:p-6"
    >
      <div className="mx-auto max-w-3xl rounded-2xl border border-brand-soft bg-white p-5 shadow-lg sm:flex sm:items-center sm:gap-6">
        <p className="text-sm text-brand-dark/80">
          Vil du la oss bruke Google Analytics med informasjonskapsler for å forstå hvordan siden
          brukes? Du kan endre valget når som helst.{" "}
          <Link href="/personvern" className="text-brand-medium underline hover:text-brand-dark">
            Les personvernerklæringen
          </Link>
        </p>
        <div className="mt-4 flex shrink-0 gap-3 sm:mt-0">
          <button
            type="button"
            onClick={() => choose("denied")}
            className="rounded-full border border-brand-dark px-5 py-2 text-sm font-medium text-brand-dark hover:bg-brand-pale"
          >
            Avslå
          </button>
          <button
            type="button"
            onClick={() => choose("granted")}
            className="rounded-full bg-brand-dark px-5 py-2 text-sm font-medium text-white hover:bg-brand-black"
          >
            Godta
          </button>
        </div>
      </div>
    </div>
  );
}
