import type { Product } from "@/lib/products";
import Badge from "./Badge";
import Button from "./Button";

function MiniMockup({ product }: { product: Product }) {
  if (product.id === "studentbudsjettet") {
    return (
      <div className="bg-white rounded-lg p-3 shadow-sm mx-4 my-3">
        <div className="text-[9px] font-medium text-brand-dark mb-2">Studentbudsjettet</div>
        {["Husleie", "Mat", "Kollektiv", "Trening", "Streaming", "Sparing"].map((cat, i) => (
          <div key={cat} className="flex items-center gap-2 mb-1.5">
            <span className="text-[7px] text-brand-medium w-12 truncate">{cat}</span>
            <div className="flex-1 h-2 bg-brand-pale rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-accent rounded-full"
                style={{ width: `${[75, 60, 40, 25, 20, 30][i]}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-3 shadow-sm mx-4 my-3">
      <div className="text-[9px] font-medium text-brand-dark mb-2">{product.name}</div>
      <div className="space-y-1.5">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex gap-2">
            <div
              className="h-2 bg-brand-soft rounded"
              style={{ width: `${40 + Math.random() * 40}%` }}
            />
            <div
              className="h-2 bg-brand-pale rounded"
              style={{ width: `${20 + Math.random() * 30}%` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group bg-white rounded-2xl border border-brand-soft overflow-hidden transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5">
      {/* Preview area */}
      <div className="relative aspect-[3/2] bg-brand-pale overflow-hidden">
        <MiniMockup product={product} />
        <div className="absolute bottom-3 left-3">
          <span className="inline-flex items-center rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-medium text-brand-medium backdrop-blur-sm">
            {product.format}
          </span>
        </div>
        {product.badge && (
          <div className="absolute top-3 right-3">
            <Badge variant={product.badge === "Premium" ? "dark" : "accent"}>
              {product.badge}
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-brand-dark mb-2">
          {product.name}
        </h3>
        <p className="text-sm text-brand-medium line-clamp-2 mb-3">
          {product.description}
        </p>

        {/* Feature tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {product.features.map((feature) => (
            <span
              key={feature}
              className="inline-flex items-center rounded-full bg-brand-pale px-2.5 py-1 text-[10px] font-medium text-brand-medium"
            >
              {feature}
            </span>
          ))}
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between">
          <span className="font-[family-name:var(--font-display)] text-2xl font-bold text-brand-dark">
            {product.price} kr
          </span>
          <Button href="#" variant="primary" className="text-xs px-4 py-2">
            Kjøp nå
          </Button>
        </div>
      </div>
    </div>
  );
}
