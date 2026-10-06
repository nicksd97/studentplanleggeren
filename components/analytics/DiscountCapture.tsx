"use client";

import { useEffect } from "react";
import { parseDiscountQuery, rememberDiscountCode } from "@/lib/discount";

export default function DiscountCapture() {
  useEffect(() => {
    const code = parseDiscountQuery(window.location.search);
    if (code) {
      rememberDiscountCode(code);
    }
  }, []);

  return null;
}
