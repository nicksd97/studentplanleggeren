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
    <div className="group bg-white rounded-2xl border border-brand-soft overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 animate-fade-in flex flex-col h-full">
      {/* Preview area — real product image */}
      <div className="relative aspect-[3/4] bg-brand-pale overflow-hidden shrink-0">
        <img
          src={`/images/products/${product.image}`}
          alt={product.name}
          className="w-full h-full object-cover object-top"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 top-1/2 bg-gradient-to-t from-brand-pale to-transparent pointer-events-none" />
        
        <div className="absolute bottom-3 left-3 z-10">
          <span className="inline-flex items-center rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-brand-dark backdrop-blur-sm shadow-sm">
            Fyllbar PDF
          </span>
        </div>
        {product.pages > 1 && (
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-flex items-center rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-brand-dark backdrop-blur-sm shadow-sm">
              {product.pages} sider
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-brand-dark mb-2">
          {product.name}
        </h3>
        <p className="text-sm text-brand-medium line-clamp-2 mb-3 flex-grow">
          {product.description}
        </p>

        {/* Feature tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {product.features.map((feature, idx) => {
            // Pseudo-random but consistent tints based on index
            const tints = [
              "bg-[#F5E6D3]/60 text-brand-dark/80", 
              "bg-[#E2EBD8]/60 text-brand-dark/80", 
              "bg-[#DDE4EE]/60 text-brand-dark/80", 
              "bg-[#F0E0EC]/60 text-brand-dark/80",
              "bg-[#E8DDD4]/60 text-brand-dark/80"
            ];
            const tint = tints[idx % tints.length];
            return (
              <span
                key={feature}
                className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-medium ${tint}`}
              >
                {feature}
              </span>
            );
          })}
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-brand-soft/30">
          <span className="font-[family-name:var(--font-display)] text-3xl font-black text-brand-dark">
            {product.price} kr
          </span>
          <Button
            variant="primary"
            className="text-xs px-5 py-2.5 transition-transform duration-300 group-hover:scale-[1.02] shadow-sm"
            onClick={handleAdd}
          >
            {feedback ?? "Kjøp nå"}
          </Button>
        </div>
      </div>
    </div>
  );
}
