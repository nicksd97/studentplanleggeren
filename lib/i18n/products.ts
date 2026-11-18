import { hasTranslatedPdfs, type Locale } from "./config";
import type { Messages } from "./messages/types";
import type { Bundle, Product } from "../products";

// Translated catalog copy. Ids, prices and files stay as in lib/products.ts, and cart/order
// lines keep their Bokmål name so orders look the same whatever the page language. The copy
// comes from the dictionary (Messages), so client components can use these with useMessages().

export function localizeProduct(product: Product, messages: Messages): Product {
  const copy = messages.products[product.id];
  if (!copy) return product;
  return {
    ...product,
    name: copy.name,
    description: copy.description,
    features: copy.features,
    categoryLabel: messages.categoryLabels[product.category] ?? product.categoryLabel,
  };
}

export function localizeBundle(bundle: Bundle, messages: Messages): Bundle {
  const copy = messages.bundles[bundle.id];
  if (!copy) return bundle;
  return { ...bundle, name: copy.name, description: copy.description, badge: copy.badge ?? bundle.badge };
}

export function categoryLabel(key: string, fallback: string, messages: Messages): string {
  return messages.categoryLabels[key] ?? fallback;
}

/** Display name for a cart or order line; the stored name stays Bokmål. */
export function itemDisplayName(item: { id: string; name: string }, messages: Messages): string {
  return messages.products[item.id]?.name ?? messages.bundles[item.id]?.name ?? item.name;
}

/** Which language the PDFs come in, for this page language (empty on the Bokmål site). */
export function pdfLanguageCopy(locale: Locale, messages: Messages): { sentence: string; short: string } {
  return hasTranslatedPdfs(locale) ? messages.pdfLanguage.available : messages.pdfLanguage.norwegian;
}
