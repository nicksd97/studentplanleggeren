"use client";

import { useState } from "react";

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
    <section className="bg-brand-dark py-20 md:py-28">
      <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Icon */}
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
          Gratis pengeguide for studenter
        </h2>
        <p className="text-brand-soft text-sm mb-8">
          Få «Studentens pengeguide» — 10 konkrete tips for å ta kontroll over
          økonomien som student. Rett i innboksen.
        </p>

        {status === "success" ? (
          <div className="bg-brand-accent/20 rounded-xl p-6">
            <p className="text-brand-accent font-medium">
              Takk! Sjekk innboksen din for pengeguiden.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="din@epost.no"
              required
              className="flex-1 rounded-full bg-white/10 border border-white/20 px-5 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-brand-accent"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="rounded-full bg-brand-accent px-6 py-3 text-sm font-medium text-brand-dark hover:bg-brand-accent/90 transition-colors disabled:opacity-60"
            >
              {status === "loading" ? "Sender..." : "Send meg guiden"}
            </button>
          </form>
        )}

        {status === "error" && (
          <p className="text-red-400 text-sm mt-3">
            Noe gikk galt. Prøv igjen.
          </p>
        )}

        <p className="text-white/30 text-xs mt-4">
          Vi sender aldri spam. Avmeld når som helst.
        </p>
      </div>
    </section>
  );
}
