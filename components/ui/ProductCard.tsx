"use client";

import { useState } from "react";
import type { Product } from "@/lib/products";
import { useCart } from "@/lib/cart-context";
import Button from "./Button";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem, isInCart } = useCart();
  const [feedback, setFeedback] = useState<string | null>(null);

  function handleAdd() {
    if (isInCart(product.id)) {
      setFeedback("Allerede i handlekurven");
      setTimeout(() => setFeedback(null), 2000);
      return;
    }
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      type: "product",
      image: product.image,
    });
    setFeedback("Lagt til \u2713");
    setTimeout(() => setFeedback(null), 2000);
  }

  return (
    <div className="group bg-white rounded-2xl border border-brand-soft overflow-hidden transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5">
      {/* Preview area — real product image */}
      <div className="relative aspect-[3/4] bg-brand-pale overflow-hidden">
        <img
          src={`/images/products/${product.image}`}
          alt={product.name}
          className="w-full h-full object-cover object-top"
        />
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
          <Button
            variant="primary"
            className="text-xs px-4 py-2"
            onClick={handleAdd}
          >
            {feedback ?? "Kjøp nå"}
          </Button>
        </div>
      </div>
    </div>
  );
}
