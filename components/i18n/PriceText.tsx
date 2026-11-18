"use client";

import { usePricing } from "@/lib/i18n/provider";

/**
 * Copy with {single}/{fivePack}/{theme}/{komplett} placeholders, rendered in the visitor's
 * currency. Server components pass the template; the price follows the sp_currency cookie.
 */
export default function PriceText({ text }: { text: string }) {
  return <>{usePricing().fill(text)}</>;
}

/** Shows `withVipps` when the visitor pays in NOK (Vipps available), otherwise `withoutVipps`. */
export function VippsText({ withVipps, withoutVipps }: { withVipps: string; withoutVipps: string }) {
  return <>{usePricing().vipps ? withVipps : withoutVipps}</>;
}
