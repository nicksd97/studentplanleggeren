import type { Bundle } from "@/lib/products";
import { calculateSavings } from "@/lib/products";
import Badge from "./Badge";
import Button from "./Button";

export default function BundleCard({ bundle }: { bundle: Bundle }) {
  const savings = calculateSavings(bundle);

  if (bundle.featured) {
    return (
      <div className="relative max-w-[560px] mx-auto bg-brand-dark rounded-2xl border-2 border-brand-accent shadow-2xl overflow-hidden">
        {/* Ribbon */}
        <div className="bg-brand-accent text-brand-dark text-center py-2 text-sm font-medium">
          ✦ Mest populær ✦
        </div>

        <div className="p-8 md:p-10">
          <h3 className="font-[family-name:var(--font-display)] text-3xl font-bold text-white mb-3">
            {bundle.name}
          </h3>
          <p className="text-brand-soft text-sm mb-6">{bundle.description}</p>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-2">
            <span className="font-[family-name:var(--font-display)] text-5xl md:text-6xl font-bold text-white">
              {bundle.price}
            </span>
            <span className="text-white/70 text-xl">kr</span>
            <span className="text-white/40 line-through text-lg">
              {bundle.originalPrice} kr
            </span>
          </div>
          <div className="mb-8">
            <Badge variant="accent">Spar {savings}%</Badge>
          </div>

          {/* Includes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            {bundle.includes.map((item) => (
              <div key={item} className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-brand-accent shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-white/80 text-sm">{item}</span>
              </div>
            ))}
          </div>

          <Button
            href="#"
            variant="primary"
            fullWidth
            className="text-base py-4"
          >
            Kjøp Økonomipakken — {bundle.price} kr
          </Button>
          <p className="text-center text-white/30 text-xs mt-3">
            Umiddelbar nedlasting · Ingen abonnement
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-brand-soft p-6 md:p-8 relative">
      {bundle.badge && (
        <div className="absolute -top-3 left-6">
          <Badge variant="accent">{bundle.badge}</Badge>
        </div>
      )}
      <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-brand-dark mb-2">
        {bundle.name}
      </h3>
      <p className="text-sm text-brand-medium mb-1">
        {bundle.productCount} produkter · {bundle.format}
      </p>
      <div className="flex items-baseline gap-2 mb-4">
        <span className="font-[family-name:var(--font-display)] text-3xl font-bold text-brand-dark">
          {bundle.price} kr
        </span>
        <span className="text-brand-medium/60 line-through text-sm">
          {bundle.originalPrice} kr
        </span>
        <Badge variant="accent" className="ml-1">
          Spar {savings}%
        </Badge>
      </div>
      <Button href="#" variant="secondary" fullWidth>
        Kjøp pakke
      </Button>
    </div>
  );
}
