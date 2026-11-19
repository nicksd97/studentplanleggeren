import { NextResponse, type NextRequest } from "next/server";
import { CURRENCY_COOKIE, CURRENCY_COOKIE_MAX_AGE } from "@/lib/currency";
import { LOCALE_COOKIE, LOCALE_REQUEST_HEADER } from "@/lib/i18n/config";
import { LOCALE_VARY, currencyCookieToSet, decideLocale } from "@/lib/i18n/detect";

// Sends visitors from unprefixed (Bokmål) pages to the same page in their language, and sets
// the functional sp_currency cookie the price display reads. Crawlers and prefixed pages are
// never redirected, and every redirect is a 302 that CDNs must not cache.
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const country = request.headers.get("x-vercel-ip-country");
  const decision = decideLocale({
    method: request.method,
    pathname,
    search,
    cookieLocale: request.cookies.get(LOCALE_COOKIE)?.value,
    userAgent: request.headers.get("user-agent"),
    country,
    acceptLanguage: request.headers.get("accept-language"),
  });

  let response: NextResponse;
  if (decision.action === "redirect") {
    response = NextResponse.redirect(new URL(decision.location, request.url), 302);
    response.headers.set("Cache-Control", "private, no-store");
    response.headers.set("Vary", LOCALE_VARY);
  } else {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set(LOCALE_REQUEST_HEADER, decision.locale);
    response = NextResponse.next({ request: { headers: requestHeaders } });
    if (decision.vary) {
      // Next.js sets its own Vary on App Router pages, so this may not survive self-hosted.
      response.headers.append("Vary", LOCALE_VARY);
    }
  }

  if (decision.reason !== "excluded" && decision.reason !== "method") {
    const currency = currencyCookieToSet({
      existing: request.cookies.get(CURRENCY_COOKIE)?.value,
      country,
      locale: decision.locale,
    });
    if (currency) {
      response.cookies.set({
        name: CURRENCY_COOKIE,
        value: currency,
        maxAge: CURRENCY_COOKIE_MAX_AGE,
        path: "/",
        sameSite: "lax",
        secure: request.nextUrl.protocol === "https:",
      });
    }
  }
  return response;
}

export const config = {
  matcher: [
    // Pages only: skip /api, Next internals, metadata files and anything with a file extension.
    // Prefixed pages (/en, /de, …) run too, for the currency cookie and the 404 language tag;
    // they are never redirected.
    "/((?!api/|api$|_next/|favicon\\.ico|robots\\.txt|sitemap\\.xml|.*\\.[^/]*$).*)",
  ],
};
