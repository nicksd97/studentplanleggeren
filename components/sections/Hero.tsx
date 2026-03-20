import Button from "@/components/ui/Button";

function ProductCardMini({
  title,
  rotation,
  zIndex,
  featured,
  children,
}: {
  title: string;
  rotation: number;
  zIndex: number;
  featured?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`absolute bg-white rounded-xl shadow-lg p-3 w-36 sm:w-44 md:w-48 transition-all duration-300 hover:scale-105 hover:z-30 ${
        featured ? "border-2 border-brand-dark" : "border border-brand-soft"
      }`}
      style={{
        transform: `rotate(${rotation}deg)`,
        zIndex,
      }}
    >
      <div className="text-[8px] sm:text-[9px] font-medium text-brand-dark mb-1.5 truncate">
        {title}
      </div>
      {children}
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden">
      {/* Dot pattern background */}
      <div className="dot-pattern" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Section label */}
        <p className="text-xs font-medium tracking-[0.1em] uppercase text-brand-medium mb-4">
          ✦ Laget for norske studenter ✦
        </p>

        {/* Heading */}
        <h1 className="font-[family-name:var(--font-display)] text-5xl sm:text-6xl lg:text-7xl font-bold text-brand-dark mb-4">
          Studentplanlegger
        </h1>

        {/* Subheading */}
        <p className="text-brand-medium text-lg sm:text-xl max-w-2xl mx-auto mb-12 md:mb-16">
          Få orden på studiene. 25 fyllbare PDF-planleggere for studenter. Daglig, ukentlig, månedlig — skriv ut eller fyll inn direkte på skjermen.
        </p>

        {/* Fanned-out product cards */}
        <div className="relative mx-auto h-56 sm:h-64 md:h-72 max-w-3xl mb-8">
          {/* SVG Arrow Left */}
          <svg
            className="absolute -left-4 sm:left-0 top-4 w-20 h-20 text-brand-medium/30"
            viewBox="0 0 80 80"
            fill="none"
          >
            <path
              d="M10 20 C30 10, 50 40, 60 60"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M55 52 L60 60 L50 58"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>

          {/* SVG Arrow Right */}
          <svg
            className="absolute -right-4 sm:right-0 top-4 w-20 h-20 text-brand-medium/30"
            viewBox="0 0 80 80"
            fill="none"
          >
            <path
              d="M70 20 C50 10, 30 40, 20 60"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M25 52 L20 60 L30 58"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>

          {/* Cards container */}
          <div className="relative flex items-center justify-center h-full">
            {/* Card 1 - Personlig Finans Tracker */}
            <ProductCardMini title="Personlig Finans Tracker" rotation={-7} zIndex={1}>
              <div className="space-y-1">
                {["Inntekt", "Utgifter", "Sparing"].map((l) => (
                  <div key={l} className="flex items-center gap-1">
                    <span className="text-[6px] text-brand-medium w-8">{l}</span>
                    <div className="flex-1 h-1.5 bg-brand-pale rounded-full">
                      <div className="h-full bg-brand-accent/60 rounded-full" style={{ width: "65%" }} />
                    </div>
                  </div>
                ))}
              </div>
            </ProductCardMini>

            {/* Card 2 - Ukentlig Plan */}
            <ProductCardMini title="Ukentlig Plan" rotation={-2} zIndex={2}>
              <div className="grid grid-cols-5 gap-0.5">
                {["Ma", "Ti", "On", "To", "Fr"].map((d) => (
                  <div key={d} className="text-center">
                    <div className="text-[5px] text-brand-medium mb-0.5">{d}</div>
                    <div className="h-3 bg-brand-pale rounded-sm" />
                    <div className="h-3 bg-brand-soft/50 rounded-sm mt-0.5" />
                  </div>
                ))}
              </div>
            </ProductCardMini>

            {/* Card 3 - Daglig Planlegger (featured) */}
            <ProductCardMini title="Daglig Planlegger" rotation={1} zIndex={10} featured>
              <div className="space-y-1">
                <div className="flex items-center gap-1 mb-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-brand-accent" />
                  <span className="text-[5px] sm:text-[6px] text-brand-medium">Fokusområder</span>
                </div>
                {["08:00 — Forelesning", "10:00 — Studiegruppe", "12:00 — Lunsj", "13:00 — Bibliotek", "15:00 — Trening"].map((item) => (
                  <div key={item} className="flex items-center gap-1">
                    <div className="h-1.5 w-1.5 rounded-sm border border-brand-soft" />
                    <span className="text-[5px] sm:text-[6px] text-brand-medium">{item}</span>
                  </div>
                ))}
                <div className="flex items-center gap-1 mt-1 pt-1 border-t border-brand-soft">
                  <div className="h-1.5 w-1.5 rounded-full bg-brand-accent/50" />
                  <span className="text-[5px] text-brand-medium">Gjøremål i dag: 5</span>
                </div>
              </div>
            </ProductCardMini>

            {/* Card 4 - Vane Tracker */}
            <ProductCardMini title="Vane Tracker" rotation={3} zIndex={2}>
              <div className="grid grid-cols-7 gap-0.5">
                {[...Array(21)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 w-2 rounded-sm ${
                      [0, 2, 3, 5, 7, 8, 10, 12, 14, 15, 17, 19].includes(i)
                        ? "bg-brand-accent"
                        : [1, 6, 11, 16].includes(i)
                        ? "bg-brand-accent/40"
                        : "bg-brand-pale"
                    }`}
                  />
                ))}
              </div>
            </ProductCardMini>

            {/* Card 5 - Pomodoro Planlegger */}
            <ProductCardMini title="Pomodoro Planlegger" rotation={7} zIndex={1}>
              <div className="space-y-1.5">
                {[
                  { label: "Økt 1", w: "100%" },
                  { label: "Pause", w: "25%" },
                  { label: "Økt 2", w: "80%" },
                  { label: "Pause", w: "25%" },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <span className="text-[5px] text-brand-medium w-6">{s.label}</span>
                    <div className="flex-1 h-2 bg-brand-pale rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${s.label === "Pause" ? "bg-brand-soft" : "bg-brand-accent/70"}`}
                        style={{ width: s.w }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </ProductCardMini>
          </div>

          {/* Umiddelbar nedlasting badge */}
          <div className="absolute -bottom-2 right-4 sm:right-12 md:right-16 z-20">
            <div className="bg-brand-accent text-brand-dark rounded-full px-4 py-2 text-xs font-medium shadow-lg">
              Umiddelbar nedlasting
            </div>
          </div>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
          <Button href="#komplett" variant="primary" className="text-base px-8 py-3.5">
            Se komplett pakke — 349 kr
          </Button>
          <Button href="#planleggere" variant="outline" className="text-base px-8 py-3.5">
            Utforsk planleggerne
          </Button>
        </div>

        {/* Trust signals */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-brand-medium">
          <span className="flex items-center gap-1.5">
            <svg className="h-4 w-4 text-brand-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Betal med Vipps eller kort
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="h-4 w-4 text-brand-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Fyllbare PDF-er
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="h-4 w-4 text-brand-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            100% på norsk
          </span>
        </div>
      </div>

      {/* Gradient transition */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-white" />
    </section>
  );
}
