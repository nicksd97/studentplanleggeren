export default function DeviceShowcase() {
  return (
    <section className="py-20 md:py-28 bg-brand-cream">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Label */}
        <p className="text-center text-sm font-medium text-brand-accent mb-3">
          ✦ Bruk den overalt ✦
        </p>

        {/* Heading */}
        <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-bold text-brand-dark text-center mb-4">
          Fungerer på alle enheter
        </h2>

        {/* Subtext */}
        <p className="text-brand-medium text-center max-w-xl mx-auto mb-12">
          Fyll ut planleggerne digitalt på PC, Mac, iPad eller nettbrett — eller
          skriv ut på papir. Du velger.
        </p>

        {/* Device mockup image */}
        <div className="mb-16 rounded-2xl overflow-hidden shadow-lg">
          <img
            src="/images/marketing/il_1588xN.4593614661_13gt.jpg.webp"
            alt="Studentplanlegger vist på iPad og laptop"
            className="w-full h-auto"
          />
        </div>

        {/* Three feature points */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {/* PC & Mac */}
          <div className="flex flex-col items-center">
            <div className="h-14 w-14 rounded-2xl bg-brand-pale flex items-center justify-center mb-4">
              <svg
                className="h-7 w-7 text-brand-accent"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z"
                />
              </svg>
            </div>
            <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-brand-dark mb-1">
              PC og Mac
            </h3>
            <p className="text-sm text-brand-medium">
              Åpne i Adobe Reader eller nettleseren
            </p>
          </div>

          {/* iPad & Tablet */}
          <div className="flex flex-col items-center">
            <div className="h-14 w-14 rounded-2xl bg-brand-pale flex items-center justify-center mb-4">
              <svg
                className="h-7 w-7 text-brand-accent"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5h3m-6.75 2.25h10.5a2.25 2.25 0 002.25-2.25V4.5a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 4.5v15a2.25 2.25 0 002.25 2.25z"
                />
              </svg>
            </div>
            <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-brand-dark mb-1">
              iPad og nettbrett
            </h3>
            <p className="text-sm text-brand-medium">
              Fyll inn med Apple Pencil eller fingeren
            </p>
          </div>

          {/* Print */}
          <div className="flex flex-col items-center">
            <div className="h-14 w-14 rounded-2xl bg-brand-pale flex items-center justify-center mb-4">
              <svg
                className="h-7 w-7 text-brand-accent"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18.75 12h.008v.008h-.008V12zm-2.25 0h.008v.008H16.5V12z"
                />
              </svg>
            </div>
            <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-brand-dark mb-1">
              Utskrift
            </h3>
            <p className="text-sm text-brand-medium">
              Skriv ut på A4 og fyll inn for hånd
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
