import type { Product } from "@/lib/products";
import Button from "./Button";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group bg-white rounded-2xl border border-brand-soft overflow-hidden transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5">
      {/* Preview area — real product image or fallback */}
      <div className="relative aspect-[3/4] bg-brand-pale overflow-hidden">
        {product.image ? (
          <img
            src={`/images/products/${product.image}`}
            alt={product.name}
            className="w-full h-full object-cover object-top"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
            <svg className="w-10 h-10 text-brand-soft mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            <span className="text-xs font-medium text-brand-medium">{product.name}</span>
          </div>
        )}
        <div className="absolute bottom-3 left-3">
          <span className="inline-flex items-center rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-medium text-brand-medium backdrop-blur-sm">
            Fyllbar PDF
          </span>
        </div>
        {product.pages > 1 && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-medium text-brand-medium backdrop-blur-sm">
              {product.pages} sider
            </span>
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
