"use client";

import { useState } from "react";

import Button from "@/components/ui/Button";
import Eyebrow from "@/components/landing/Eyebrow";
import Reveal from "@/components/landing/Reveal";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="relative py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          {/* Centred glass panel */}
          <div className="mx-auto max-w-3xl rounded-3xl border border-line bg-surface backdrop-blur-sm p-8 md:p-16 text-center">
            {/* Icon disc */}
            <div className="mx-auto h-12 w-12 rounded-full bg-brand-accent/10 ring-1 ring-brand-accent/25 flex items-center justify-center">
              <svg
                className="h-6 w-6 text-brand-accent"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
            </div>

            <Eyebrow n="09" className="mt-8">
              Gratis tips
            </Eyebrow>

            <h2 className="mt-4 font-[family-name:var(--font-display)] font-bold leading-[0.95] tracking-[-0.02em] text-[clamp(2rem,4.5vw,3.5rem)] text-ink">
              Gratis tips for <span className="italic font-normal text-ink/80">bedre</span>{" "}
              studievaner
            </h2>

            <p className="mx-auto mt-6 max-w-xl text-lg text-ink-muted leading-relaxed">
              Få våre beste tips for planlegging, produktivitet og studieteknikk — rett i innboksen.
            </p>

            <div className="mx-auto mt-10 max-w-lg">
              {status === "success" ? (
                <div className="rounded-xl bg-brand-accent/15 p-6">
                  <p className="font-medium text-brand-accent">Takk! Sjekk innboksen din.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="din@epost.no"
                    required
                    aria-label="E-postadresse"
                    className="flex-1 min-h-[44px] rounded-full bg-white/[0.06] border border-white/10 px-5 py-3 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-brand-accent/50 transition-shadow"
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={status === "loading"}
                    className="min-h-[44px] px-7 font-bold hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
                  >
                    {status === "loading" ? "Sender..." : "Send meg tipsene"}
                  </Button>
                </form>
              )}

              {status === "error" && (
                <p className="mt-3 text-sm text-red-400">Noe gikk galt. Prøv igjen.</p>
              )}

              <p className="mt-4 text-xs text-ink-muted">
                Vi sender aldri spam. Avmeld når som helst.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
