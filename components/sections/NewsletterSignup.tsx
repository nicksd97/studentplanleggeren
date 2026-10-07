"use client";

import { type ReactNode, useState } from "react";
import Link from "next/link";

import FadeInOnScroll from "@/components/ui/FadeInOnScroll";
import { trackEvent } from "@/lib/track";

type Variant = "home" | "gratis";

type NewsletterSignupProps = {
  heading?: string;
  subheading?: string;
  buttonLabel?: string;
  successMessage?: string;
  consent?: ReactNode;
  variant?: Variant;
};

const defaultConsent = (
  <>
    Ved å sende inn samtykker du til at vi lagrer e-posten din for å sende smakebiten og
    jevnlige studietips. Les{" "}
    <Link href="/personvern" className="underline underline-offset-2 hover:opacity-80">
      personvernerklæringen
    </Link>
    .
  </>
);

export default function NewsletterSignup({
  heading = "Gratis ukentlig plan-smakebit",
  subheading = "Få en fyllbar ukeplan-smakebit på e-post — én side, ikke hele produktet.",
  buttonLabel = "Send meg smakebiten",
  successMessage = "Takk! Sjekk innboksen — smakebiten er på vei.",
  consent = defaultConsent,
  variant = "home",
}: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("Noe gikk galt. Prøv igjen.");
  const isHome = variant === "home";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, company }),
      });
      const payload = (await res.json().catch(() => ({}))) as { error?: string };
      if (res.ok) {
        trackEvent("lead_signup", { form: variant });
        setStatus("success");
        setEmail("");
        setCompany("");
      } else {
        trackEvent("lead_signup_error", {
          form: variant,
          reason: res.status === 429 ? "for_mange" : res.status >= 500 ? "server" : "ugyldig",
        });
        setErrorMessage(payload.error || "Noe gikk galt. Prøv igjen.");
        setStatus("error");
      }
    } catch {
      trackEvent("lead_signup_error", { form: variant, reason: "nettverk" });
      setErrorMessage("Noe gikk galt. Prøv igjen.");
      setStatus("error");
    }
  }

  const form = (
    <>
      {status === "success" ? (
        <div
          className={
            isHome
              ? "bg-brand-accent/20 rounded-xl p-6"
              : "bg-brand-pale rounded-xl p-6 border border-brand-soft"
          }
        >
          <p className={isHome ? "text-brand-accent font-medium" : "text-brand-dark font-medium"}>
            {successMessage}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <label className="sr-only" htmlFor={`newsletter-email-${variant}`}>
            E-postadresse
          </label>
          <input
            id={`newsletter-email-${variant}`}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="din@epost.no"
            required
            autoComplete="email"
            className={
              isHome
                ? "flex-1 rounded-full bg-white/10 border border-white/20 px-5 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-brand-accent/50 transition-shadow"
                : "flex-1 rounded-full bg-white border border-brand-soft px-5 py-3 text-sm text-brand-dark placeholder:text-brand-medium/50 focus:outline-none focus:ring-2 focus:ring-brand-accent/50 transition-shadow"
            }
          />
          <input
            type="text"
            name="company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute left-[-9999px] h-0 w-0 overflow-hidden"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="rounded-full bg-brand-accent px-6 py-3 text-sm font-bold text-brand-dark transition-all duration-300 hover:brightness-110 hover:shadow-md hover:-translate-y-0.5 disabled:opacity-60"
          >
            {status === "loading" ? "Sender..." : buttonLabel}
          </button>
        </form>
      )}

      {status === "error" && (
        <p className={isHome ? "text-red-400 text-sm mt-3" : "text-red-700 text-sm mt-3"}>
          {errorMessage}
        </p>
      )}

      <p
        className={
          isHome ? "text-white/50 text-xs mt-4 leading-relaxed" : "text-brand-medium text-xs mt-4 leading-relaxed"
        }
      >
        {consent}
      </p>
    </>
  );

  if (!isHome) {
    return <div className="relative text-left sm:text-center">{form}</div>;
  }

  return (
    <section className="bg-gradient-to-b from-brand-dark to-[#4a3c31] py-24 md:py-32">
      <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8 text-center">
        <FadeInOnScroll>
          <div className="h-14 w-14 rounded-full bg-brand-medium/20 flex items-center justify-center mx-auto mb-6">
            <svg
              className="h-6 w-6 text-brand-accent"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
              />
            </svg>
          </div>

          <h2 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-bold text-white mb-3">
            {heading}
          </h2>
          <p className="text-brand-soft text-sm mb-8">{subheading}</p>
          <div className="relative">{form}</div>
        </FadeInOnScroll>
      </div>
    </section>
  );
}
