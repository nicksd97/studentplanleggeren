"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  type: "product" | "bundle";
  image?: string;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: CartItem) => boolean;
  removeItem: (id: string) => void;
  clearCart: () => void;
  totalPrice: number;
  itemCount: number;
  isInCart: (id: string) => boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("cart");
      if (saved) setItems(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem("cart", JSON.stringify(items));
    } catch {}
  }, [items]);

  const addItem = useCallback((item: CartItem): boolean => {
    let added = false;
    setItems((prev) => {
      if (prev.some((i) => i.id === item.id)) return prev;
      added = true;
      return [...prev, item];
    });
    return added;
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const isInCart = useCallback(
    (id: string) => items.some((i) => i.id === id),
    [items],
  );

  const totalPrice = items.reduce((sum, i) => sum + i.price, 0);

  return (
    <CartContext value={{
      items,
      addItem,
      removeItem,
      clearCart,
      totalPrice,
      itemCount: items.length,
      isInCart,
    }}>
      {children}
    </CartContext>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
